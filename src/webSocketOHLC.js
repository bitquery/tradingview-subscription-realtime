import { createClient } from 'graphql-ws';

let client;
let lastBar = null;
let dataBuffer = [];
const BUFFER_TIMEOUT = 60000; // 1 minute interval for OHLC calculation
const BITQUERY_ENDPOINT = 'wss://streaming.bitquery.io/eap?token=ory_...';

const subscriptionQuery = `
subscription {
  Solana {
    DEXTrades(
      where: {Trade: {Buy: {Currency: {MintAddress: {is: "4Yx39Hkci49fdtyUGmrkDqTnVei9tmzPK9aac952xniv"}}}, Sell: {Currency: {MintAddress: {is: "So11111111111111111111111111111111111111112"}}}}}
    ) {
      Trade {
        Buy {
          Price
        }
      }
      Block {
        Time
      }
    }
  }
}
`;

function processBuffer(callback) {
  if (lastBar) {
    callback(lastBar);
    lastBar = null; // Reset after processing
  }
}

export function subscribeToWebSocket( onRealtimeCallback) {
  client = createClient({
    url: BITQUERY_ENDPOINT
  });

  const onNext = (data) => {
    const trade = data.data.Solana.DEXTrades[0];
    const tradeTime = new Date(trade.Block.Time).getTime();
    const price = parseFloat(trade.Trade.Buy.Price);

    // Round the time to the nearest minute
    const roundedTime = Math.floor(tradeTime / 60000) * 60000;

    // If it's a new minute, finalize the last bar and start a new one
    if (!lastBar || lastBar.time !== roundedTime) {
      if (lastBar) {
        dataBuffer.push(lastBar); // Push the finalized bar to the buffer
      }

      lastBar = {
        time: roundedTime,
        open: price,
        high: price,
        low: price,
        close: price,
        volume: 1, // Can modify to include volume data if available
      };
      console.log("lastBar",lastBar)
    } else {
      // Update the OHLC data for the current minute
      lastBar.high = Math.max(lastBar.high, price);
      lastBar.low = Math.min(lastBar.low, price);
      lastBar.close = price;
      lastBar.volume += 1; // Increment trade count (or add volume if applicable)
    }
  };

  client.subscribe(
    { query: subscriptionQuery },
    { next: onNext, error: console.error }
  );

  // Process buffer every minute to emit the finalized OHLC bar
  setInterval(() => {
    if (dataBuffer.length > 0) {
      processBuffer(onRealtimeCallback);
      console.log("dataBuffer ",dataBuffer) // Emit the last processed bar
      dataBuffer = []; // Clear the buffer
    }
  }, BUFFER_TIMEOUT);
}

export function unsubscribeFromWebSocket() {
  if (client) {
    client.dispose();
  }
}
