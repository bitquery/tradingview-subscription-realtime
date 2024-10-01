// TVChartContainer.js
import React, { useEffect, useRef } from "react";
import { widget } from "./charting_library"; // Ensure this is the correct path
import Datafeed from "./custom_datafeed";

const TVChartContainer = () => {
  const chartContainerRef = useRef(null);
  console.log("TVChartContainer called.");
  useEffect(() => {
    console.log("TVChartContainer useEffect called.");

    const widgetOptions = {
      symbol: "BananaCat (BCAT)",
      datafeed: Datafeed,
      interval: ["1"],
      container: chartContainerRef.current,
      library_path: "/charting_library/", // Ensure this path is correct
      locale: "en",
      disabled_features: ["use_localstorage_for_settings"],
      enabled_features: ["study_templates"],
      charts_storage_url: "https://saveload.tradingview.com",
      charts_storage_api_version: "1.1",
      client_id: "tradingview.com",
      user_id: "public_user_id",
      fullscreen: false,
      autosize: true,
      studies_overrides: {},
      debug: true,
      chartType: 1,
      supports_marks: true,
      supports_timescale_marks: true,
      supported_resolutions: ["1", "5", "15", "30", "60", "1D", "1W", "1M"],
      supported_intervals: ["1", "5", "15", "30", "60", "1D", "1W", "1M"],
      theme: "dark",
      pricescale: 1000,
      data_status: "streaming",
      overrides: {
        "mainSeriesProperties.statusViewStyle.showInterval": true,
        "mainSeriesProperties.statusViewStyle.symbolTextSource": "ticker",
        "mainSeriesProperties.priceAxisProperties.indexedTo100": true, // Since prices are very small, for demo we are indexing it to 100 https://www.tradingview.com/charting-library-docs/latest/api/interfaces/Charting_Library.ChartPropertiesOverrides#properties
      },
    };

    console.log("widgetOptions:", widgetOptions);

    const tvWidget = new widget(widgetOptions);
    console.log("TradingView widget initialized.", tvWidget);

    tvWidget.onChartReady(() => {
      console.log("Chart has loaded!");
      const priceScale = tvWidget
        .activeChart()
        .getPanes()[0]
        .getMainSourcePriceScale();
      priceScale.setAutoScale(true);
    });

    // Cleanup function to remove the widget on component unmount
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
