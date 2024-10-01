import axios from "axios";

const endpoint = "https://streaming.bitquery.io/eap";
const TOKEN_DETAILS = `
{
  Solana {
    DEXTradeByTokens(
      orderBy: {descendingByField: "Block_Timefield"}
      where: {Trade: {Currency: {MintAddress: {is: "4Yx39Hkci49fdtyUGmrkDqTnVei9tmzPK9aac952xniv"}}, Side: {Currency: {MintAddress: {is: "So11111111111111111111111111111111111111112"}}}}}
      limit: {count: 1000}
    ) {
      Block {
        Timefield: Time(interval: {in: minutes, count: 1})
      }
      volume: sum(of: Trade_Amount)
      Trade {
        high: Price(maximum: Trade_Price)
        low: Price(minimum: Trade_Price)
        open: Price(minimum: Block_Slot)
        close: Price(maximum: Block_Slot)
      }
      count
    }
  }
}
`;

export async function fetchHistoricalData(from) {
  const requiredBars = 360; // Hardcoding the value
  try {
    const response = await axios.post(
      endpoint,
      { query: TOKEN_DETAILS },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer ory_a...",
        },
      }
    );
    console.log("API called");
    const trades = response.data.data.Solana.DEXTradeByTokens;

    // Preprocess the bars data
    let bars = trades.map((trade) => {
      // Parse and convert Block Timefield to Unix timestamp in milliseconds
      const blockTime = new Date(trade.Block.Timefield).getTime();

      return {
        time: blockTime, // Time in Unix timestamp (milliseconds)
        open: trade.Trade.open || 0,
        high: trade.Trade.high || 0,
        low: trade.Trade.low || 0,
        close: trade.Trade.close || 0,
        volume: trade.volume || 0,
        count: trade.count || 0, // Trade count for additional info
      };
    });

    // Sort bars in ascending order by time (since the API returned descending order)
    bars.sort((a, b) => a.time - b.time);

    // Fill in missing bars if needed to reach 300 bars
    if (bars.length < requiredBars) {
      const earliestTime = bars[0]?.time || from;
      const missingBarsCount = requiredBars - bars.length;

      // Generate missing bars before the earliest returned bar
      for (let i = 1; i <= missingBarsCount; i++) {
        bars.unshift({
          time: earliestTime - i * 60000, // Assuming 1-minute bars (60000 ms)
          open: 0,
          high: 0,
          low: 0,
          close: 0,
          volume: 0,
          count: 0
        });
      }
    }

    return bars;
  } catch (err) {
    console.error("Error fetching historical data:", err);
    throw err;
  }
}
