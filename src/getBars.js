import { fetchHistoricalData } from "./histOHLC";

import { subscribeToWebSocket } from "./webSocketOHLC"; // Assuming you have WebSocket logic here

export const getBars = async (
  symbolInfo,
  resolution,
  periodParams, //compulsorily needed
  onHistoryCallback,
  onErrorCallback
) => {
  try {
    console.log(
      "[getBars]: Fetching bars for",
      symbolInfo,
      resolution,
      periodParams.from,
      periodParams.to
    );

    const bars = await fetchHistoricalData();

    if (bars.length > 0) {
      onHistoryCallback(bars, { noData: false });
    } else {
      onHistoryCallback([], { noData: true });
    }
  } catch (err) {
    console.error("[getBars] Error fetching data:", err);
    onErrorCallback(err);
  }
};

export const subscribeBars = (
  symbolInfo,
  resolution,
  onRealtimeCallback,
  subscriberUID,
  onResetCacheNeededCallback
) => {
  // this.subscribers[subscriberUID] = {
  //   callback: onRealtimeCallback,
  //   resolution: resolution,
  // };
  subscribeToWebSocket(onRealtimeCallback);
};

export const unsubscribeBars = (subscriberUID) => {
  delete this.subscribers[subscriberUID];
  // if (Object.keys(this.subscribers).length === 0) {
  //   unsubscribeFromWebSocket();
  // }
};
