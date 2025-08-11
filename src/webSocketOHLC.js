import { createClient } from 'graphql-ws';
import config from "./configs.json";

let client;
const BITQUERY_ENDPOINT = 'wss://streaming.bitquery.io/eap?token=' + config.authtoken;
const urlParams = new URLSearchParams(window.location.search);
const baseMint = urlParams.get("base");
console.log("Base Mint:", baseMint);
const subscriptionQuery = `
subscription {
  Trading {
    Tokens(
      where: {
        Token: {
          Network: {is: "Solana"},
          Address: {is: "${baseMint}"}
        },
        Interval: {Time: {Duration: {eq: 60}}}
      }
    ) {
      Block {
        Time
      }
      Price {
        Ohlc {
          Open
          High
          Low
          Close
        }
      }
      Volume {
        Base
      }
    }
  }
}
`;

export function subscribeToWebSocket(onRealtimeCallback) {
  client = createClient({ url: BITQUERY_ENDPOINT });

  const onNext = (data) => {
    // console.log("subscription called")
    const tokenData = data.data?.Trading?.Tokens?.[0];
    if (!tokenData) return;

    const bar = {
      time: new Date(tokenData.Block.Time).getTime(),
      open: tokenData.Price.Ohlc.Open,
      high: tokenData.Price.Ohlc.High,
      low: tokenData.Price.Ohlc.Low,
      close: tokenData.Price.Ohlc.Close,
      volume: tokenData.Volume.Base,
    };

    onRealtimeCallback(bar); // Emit immediately
  };

  client.subscribe(
    { query: subscriptionQuery },
    { next: onNext, error: console.error }
  );
}

export function unsubscribeFromWebSocket() {
  if (client) {
    client.dispose();
  }
}
