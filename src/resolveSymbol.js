export const resolveSymbol = (
  symbolName,
  onSymbolResolvedCallback,
  onResolveErrorCallback,
  extension
) => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const baseMint = urlParams.get("base");

    if (!baseMint) {
      onResolveErrorCallback("Missing base token mint address in URL");
      return;
    }

    const displaySymbol = `${baseMint.slice(0, 4)}...${baseMint.slice(-4)}`;

    const symbolInfo = {
      ticker: baseMint,
      name: baseMint,
      description: displaySymbol,
      session: "24x7",
      timezone: "Etc/UTC",
      minmov: 1,
      pricescale: 100000000,
      has_intraday: true,
      intraday_multipliers: ["1", "5", "10", "15", "30", "60"],
      has_seconds: true,
      seconds_multipliers: ["10"],
      has_empty_bars: false,
      has_weekly_and_monthly: false,
      supported_resolutions: [
        "10S",
        "1",
        "5",
        "10",
        "15",
        "30",
        "60",
        "1D",
        "1W",
        "1M",
      ],
      supported_intervals: [
        "10S",
        "1",
        "5",
        "10",
        "15",
        "30",
        "60",
        "1D",
        "1W",
        "1M",
      ],
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
