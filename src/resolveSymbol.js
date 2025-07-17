export const resolveSymbol = (
  symbolName,
  onSymbolResolvedCallback,
  onResolveErrorCallback,
  extension
) => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const baseMint = urlParams.get("base");
    const quoteMint = urlParams.get("quote");

    if (!baseMint || !quoteMint) {
      onResolveErrorCallback("Missing base or quote mint address in URL");
      return;
    }

    // Optional: create a human-readable symbol name
    const displaySymbol = `${baseMint.slice(0, 4)}.../${quoteMint.slice(0, 4)}...`;

    const symbolInfo = {
      ticker: `${baseMint}/${quoteMint}`,
      name: `${baseMint}/${quoteMint}`, // used as symbolInfo.name in getBars/subscribeBars
      description: displaySymbol,
      session: "24x7",
      timezone: "Etc/UTC",
      minmov: 1,
      pricescale: 1000,
      has_intraday: true,
      intraday_multipliers: ["1", "5", "15", "30", "60"],
      has_empty_bars: false,
      has_weekly_and_monthly: false,
      supported_resolutions: ["1", "5", "15", "30", "60", "1D", "1W", "1M"],
      supported_intervals: ["1", "5", "15", "30", "60", "1D", "1W", "1M"],
      countBack: 30,
      volume_precision: 2,
      visible_plots_set: "ohlcv",
    };

    onSymbolResolvedCallback(symbolInfo);
  } catch (err) {
    console.error("Error in resolveSymbol:", err);
    onResolveErrorCallback("resolveSymbol failure");
  }
};
