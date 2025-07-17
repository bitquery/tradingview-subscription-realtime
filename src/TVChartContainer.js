import React, { useEffect, useRef } from "react";
import { widget } from "./charting_library";
import Datafeed from "./custom_datafeed";

const TVChartContainer = () => {
  const chartContainerRef = useRef(null);

  useEffect(() => {
    const widgetOptions = {
      symbol: "BananaCat (BCAT)",
      datafeed: Datafeed,
      interval: "15",
      container: chartContainerRef.current,
      library_path: "/charting_library/",
      locale: "en",
      theme: "dark",
      fullscreen: false,
      autosize: true,

      disabled_features: [
        "header_symbol_search",
        "header_compare",
        "header_saveload",
        "timeframes_toolbar",
        "volume_force_overlay",
        "show_interval_dialog_on_key_press",
      ],

      enabled_features: [
        "study_templates",
        "left_toolbar",
        "countdown",
      ],

      studies_overrides: {
        "volume.volume.color.0": "#ef5350",
        "volume.volume.color.1": "#26a69a",
        "volume.volume.transparency": 70,
      },

      overrides: {
        "paneProperties.background": "#1E1E1E",
        "paneProperties.vertGridProperties.color": "#2E2E2E",
        "paneProperties.horzGridProperties.color": "#2E2E2E",
        "symbolWatermarkProperties.color": "rgba(0, 0, 0, 0)",
      
        "scalesProperties.lineColor": "#555",
        "scalesProperties.textColor": "#FFFFFF",  // Bright white for better visibility
      
        "mainSeriesProperties.candleStyle.upColor": "#26a69a",
        "mainSeriesProperties.candleStyle.downColor": "#ef5350",
        "mainSeriesProperties.candleStyle.borderUpColor": "#26a69a",
        "mainSeriesProperties.candleStyle.borderDownColor": "#ef5350",
        "mainSeriesProperties.candleStyle.wickUpColor": "#26a69a",
        "mainSeriesProperties.candleStyle.wickDownColor": "#ef5350",
      },

      supported_resolutions: ["1", "5", "15", "30", "60", "1D", "1W", "1M"],
      time_scale: {
        min_bar_spacing: 2,
      },

      debug: false,
    };

    const tvWidget = new widget(widgetOptions);

    tvWidget.onChartReady(() => {
      console.log("Chart has loaded!");
      const priceScale = tvWidget
        .activeChart()
        .getPanes()[0]
        .getMainSourcePriceScale();
      priceScale.setAutoScale(true);
    });

    return () => {
      if (tvWidget) {
        console.log("Removing TradingView widget.");
        tvWidget.remove();
      }
    };
  }, []);

  return (
    <div ref={chartContainerRef} style={{ height: "600px", width: "100%" }} />
  );
};

export default TVChartContainer;
