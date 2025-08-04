import { createClient } from 'graphql-ws';
import config from "./configs.json";

let client;
let lastBar = null;
let dataBuffer = [];
const BUFFER_TIMEOUT = 60000; // 1 minute interval for OHLC calculation
const BITQUERY_ENDPOINT = 'wss://streaming.bitquery.io/eap?token=' + config.authtoken;

const subscriptionQuery = `
subscription {
  Trading {
    Tokens(
      where: {Token: {Network: {is: "Solana"}, Address: {is: "6ft9XJZX7wYEH1aywspW5TiXDcshGc2W2SqBHN9SLAEJ"}}, Interval: {Time: {Duration: {eq: 60}}}}
    ) {
      Token {
        Address
        Id
        IsNative
        Name
        Network
        Name
        Symbol
        TokenId
      }
      Block {
        Date
        Time
        Timestamp
      }
      Interval {
        Time {
          Start
          Duration
          End
        }
      }
      Volume {
        Base
        Quote
        Usd
      }
      Price {
        IsQuotedInUsd
        Ohlc {
          Close
          High
          Low
          Open
        }
        Average {
          ExponentialMoving
          Mean
          SimpleMoving
          WeightedSimpleMoving
        }
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
    const trade = data.data.Trading.Tokens[0];
    const tradeTime = new Date(trade.Block.Time).getTime();
   

    // Round the time to the nearest minute
    const roundedTime = Math.floor(tradeTime / 60000) * 60000;

    // If it's a new minute, finalize the last bar and start a new one
    if (!lastBar || lastBar.time !== roundedTime) {
      if (lastBar) {
        dataBuffer.push(lastBar); // Push the finalized bar to the buffer
      }

      lastBar = {
        time: roundedTime,
        open: trade.Price.Ohlc.Open,
        high: trade.Price.Ohlc.High,
        low: trade.Price.Ohlc.Low,
        close: trade.Price.Ohlc.Close,
        volume: 1, // Can modify to include volume data if available
      };
      console.log("lastBar",lastBar)
    } else {
      // Update the OHLC data for the current minute
      lastBar.high = Math.max(lastBar.high, trade.Price.Ohlc.High);
      lastBar.low = Math.min(lastBar.low, trade.Price.Ohlc.Low);
      lastBar.close = trade.Price.Close;
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
      dataBuffer = lastBar ? [lastBar] : []; // Clear the buffer
    }
  }, BUFFER_TIMEOUT);
}


export function unsubscribeFromWebSocket() {
  if (client) {
    client.dispose();
  }
}
