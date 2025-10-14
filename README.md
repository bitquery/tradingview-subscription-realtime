# TradingView Charts - Realtime OHLC

📊 A implementation of TradingView's Advanced Charts powered by [Bitquery's](https://bitquery.io?utm_source=github&utm_medium=repo&utm_campaign=tradingview-subscription-realtime) real-time OHLC streaming data. Plot DEX trading data with live price updates across multiple blockchains.

---

## What is TradingView Realtime OHLC?

This project integrates **TradingView's Advanced Charts** with **Bitquery's Trading API** to display real-time OHLC (Open, High, Low, Close) candlestick charts for cryptocurrency trading pairs. Stream live price data from DEXs on Solana, Ethereum, BSC, and other blockchains directly into TradingView charts.

---

## 🚀 Features

- Real-time OHLC candlestick charts using TradingView
- Support for multiple blockchains (Solana, Ethereum, BSC, Base, Polygon, Tron)
- Live price streaming via WebSocket subscriptions
- Support for DEX-specific data (Pump.fun, Raydium, Uniswap, PancakeSwap, etc.)
- Customizable base and quote token pairs
- USD or quote currency pricing
- Volume and moving averages (SMA, EMA)

---

## 📦 Installation

```bash
git clone https://github.com/bitquery/tradingview-subscription-realtime.git
cd tradingview-subscription-realtime
npm install
```

---

## 🔑 Access Token

Get your Bitquery Access Token [here](https://account.bitquery.io/user/api_v2/access_tokens?utm_source=github&utm_medium=repo&utm_campaign=tradingview-subscription-realtime)

---

## 🎯 Quick Start

### 1. Start the development server

```bash
npm start
```

### 2. Test with token addresses

Pass the base and quote token addresses as URL parameters:

```
http://localhost:3000/?base=So11111111111111111111111111111111111111112&quote=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
```

**Example Parameters:**
- `base`: SOL token address (So11111111111111111111111111111111111111112)
- `quote`: USDC token address (EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v)

---

## 📚 Complete Tutorial

Follow the complete step-by-step tutorial [here](https://docs.bitquery.io/docs/usecases/tradingview-subscription-realtime/getting-started/?utm_source=github&utm_medium=repo&utm_campaign=tradingview-subscription-realtime)

---

## 🔥 Supported Blockchains

- [Ethereum](https://docs.bitquery.io/docs/blockchain/Ethereum?utm_source=github&utm_medium=repo&utm_campaign=tradingview-subscription-realtime)
- [Solana](https://docs.bitquery.io/docs/blockchain/Solana?utm_source=github&utm_medium=repo&utm_campaign=tradingview-subscription-realtime)
- [BSC (Binance Smart Chain)](https://docs.bitquery.io/docs/blockchain/BSC?utm_source=github&utm_medium=repo&utm_campaign=tradingview-subscription-realtime)
- [Base](https://docs.bitquery.io/docs/blockchain/Base?utm_source=github&utm_medium=repo&utm_campaign=tradingview-subscription-realtime)
- [Polygon](https://docs.bitquery.io/docs/blockchain/Matic?utm_source=github&utm_medium=repo&utm_campaign=tradingview-subscription-realtime)
- [Tron](https://docs.bitquery.io/docs/blockchain/Tron?utm_source=github&utm_medium=repo&utm_campaign=tradingview-subscription-realtime)
- [Arbitrum](https://docs.bitquery.io/docs/blockchain/Arbitrum?utm_source=github&utm_medium=repo&utm_campaign=tradingview-subscription-realtime)
- [Optimism](https://docs.bitquery.io/docs/blockchain/Optimism?utm_source=github&utm_medium=repo&utm_campaign=tradingview-subscription-realtime)

---

## 📊 Example Queries

### Real-Time Token Prices in USD on Solana

Stream live OHLC price and volume data for all tokens on Solana, quoted directly in USD.

[Run Stream ➤](https://ide.bitquery.io/Real-Time-usd-price-on-solana-chain?utm_source=github&utm_medium=repo&utm_campaign=tradingview-subscription-realtime)

```graphql
subscription {
  Trading {
    Pairs(
      where: {
        Interval: {Time: {Duration: {eq: 1}}}
        Price: {IsQuotedInUsd: true}
        Market: {Network: {is: "Solana"}}
        Volume: {Usd: {gt: 5}}
      }
    ) {
      Token {
        Name
        Symbol
        Address
      }
      Market {
        Protocol
        Program
        Network
        Name
        Address
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
        Ohlc {
          Close
          High
          Low
          Open
        }
      }
    }
  }
}
```

---

### Real-Time Token Prices Against SOL/WSOL

Stream real-time OHLC and volume data for Solana tokens specifically paired against SOL or WSOL.

[Run Stream ➤](https://ide.bitquery.io/Real-Time-usd-price-on-solana-chain-against-WSOLSOL?utm_source=github&utm_medium=repo&utm_campaign=tradingview-subscription-realtime)

```graphql
subscription {
  Trading {
    Pairs(
      where: {
        Interval: {Time: {Duration: {eq: 1}}}
        Price: {IsQuotedInUsd: false}
        QuoteToken: {
          Address: {
            in: [
              "So11111111111111111111111111111111111111112"
              "11111111111111111111111111111111"
            ]
          }
        }
        Market: {Network: {is: "Solana"}}
        Volume: {Usd: {gt: 5}}
      }
    ) {
      Token {
        Name
        Symbol
        Address
      }
      QuoteToken {
        Name
        Symbol
        Address
      }
      Market {
        Protocol
        Program
        Network
        Name
        Address
      }
      Volume {
        Base
        Quote
        Usd
      }
      Price {
        Ohlc {
          Close
          High
          Low
          Open
        }
      }
    }
  }
}
```

---

### PumpAMM 1-second Price Stream

Real-time (1-second interval) price, OHLC, volume, and moving averages for Pump.fun AMM tokens on Solana.

[Run Stream ➤](https://ide.bitquery.io/PumpAMM-tokens-1-second-price-stream-with-OHLC_1?utm_source=github&utm_medium=repo&utm_campaign=tradingview-subscription-realtime)

```graphql
subscription {
  Trading {
    Pairs(
      where: {
        Interval: {Time: {Duration: {eq: 1}}}
        Price: {IsQuotedInUsd: true}
        Market: {
          Network: {is: "Solana"}
          Program: {is: "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA"}
        }
        Volume: {Usd: {gt: 5}}
      }
    ) {
      Market {
        Protocol
        Program
        Network
        Name
        Address
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
        Ohlc {
          Close
          High
          Low
          Open
        }
        IsQuotedInUsd
      }
      Currency {
        Symbol
        Name
        Id
      }
      Token {
        Name
        Symbol
        Address
        Id
      }
      QuoteToken {
        Name
        Symbol
        Id
        Address
      }
    }
  }
}
```

---

### Uniswap v3 1-second Price Stream

1-second OHLC and volume stream for tokens traded on Uniswap v3 (Ethereum).

[Run Stream ➤](https://ide.bitquery.io/Uniswap-v3-DEX-tokens-1-second-price-stream-with-OHLC?utm_source=github&utm_medium=repo&utm_campaign=tradingview-subscription-realtime)

```graphql
subscription {
  Trading {
    Pairs(
      where: {
        Interval: {Time: {Duration: {eq: 1}}}
        Price: {IsQuotedInUsd: true}
        Market: {
          Network: {is: "Ethereum"}
          Address: {is: "0x1f98431c8ad98523631ae4a59f267346ea31f984"}
        }
        Volume: {Usd: {gt: 5}}
      }
    ) {
      Market {
        Protocol
        Program
        Network
        Name
        Address
      }
      Volume {
        Base
        Quote
        Usd
      }
      Price {
        Ohlc {
          Close
          High
          Low
          Open
        }
      }
      Token {
        Name
        Symbol
        Address
      }
    }
  }
}
```

---

## 🎨 Supported DEXs

### Solana DEXs
- **Pump.fun AMM** - `pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA`
- **Raydium Launchlab** - `LanMV9sAd7wArD4vJFi2qDdfnVhFxYSUg6eADduJ3uj`
- **Heaven DEX** - `HEAVENoP2qxoeuF8Dj2oT1GHEnu49U5mJYkdeC8BAX2o`
- **Meteora DBC** - Supported

### Ethereum DEXs
- **Uniswap v3** - `0x1f98431c8ad98523631ae4a59f267346ea31f984`
- **Sushiswap** - `0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac`
- **PancakeSwap v3** - `0x0bfbcf9fa4f9c56b0f40a671ad40e0805a091865`

### BSC DEXs
- **FourMeme** - `0x5c952063c7fc8610ffdb798152d69f0b9550762b`

---

## 🛠️ Advanced Features

### Price Quotation Options

You can choose between two price quotation modes:

1. **USD Pricing** (`IsQuotedInUsd: true`)
   - OHLC values are in USD
   - Useful for fiat-based trading bots and dashboards

2. **Quote Currency Pricing** (`IsQuotedInUsd: false`)
   - OHLC values are in the quote token (e.g., USDC, SOL)
   - Useful for analyzing token behavior relative to trading pairs

### Time Intervals

Available duration intervals:
- 1 second (`Duration: {eq: 1}`)
- 5 minutes (`Duration: {eq: 300}`)
- 1 hour (`Duration: {eq: 3600}`)
- [Full list of intervals](https://docs.bitquery.io/docs/trading/price-index/introduction/?utm_source=github&utm_medium=repo&utm_campaign=tradingview-subscription-realtime#understanding-intervals)

### Volume Filtering

Filter out low-volume or outlier trades:

```graphql
Volume: {Usd: {gt: 5}}  # Minimum $5 USD volume
```

---

## 📖 API Documentation

- [Trading API Overview](https://docs.bitquery.io/docs/category/crypto-price-apis?utm_source=github&utm_medium=repo&utm_campaign=tradingview-subscription-realtime)
- [Crypto Price API Examples](https://docs.bitquery.io/docs/trading/crypto-price-api/examples?utm_source=github&utm_medium=repo&utm_campaign=tradingview-subscription-realtime)
- [GraphQL Schema Reference](https://docs.bitquery.io/docs/graphql-reference/intro?utm_source=github&utm_medium=repo&utm_campaign=tradingview-subscription-realtime)
- [Subscriptions Guide](https://docs.bitquery.io/docs/start/starter-subscriptions?utm_source=github&utm_medium=repo&utm_campaign=tradingview-subscription-realtime)

---

## 🤝 Contributing

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

MIT License. Free to use and modify.

---

## 💬 Support

- **Telegram**: [Join our community](https://t.me/Bloxy_info?utm_source=github&utm_medium=repo&utm_campaign=tradingview-subscription-realtime)
- **Form**: [Request API access or enterprise support](https://bitquery.io/forms/api?utm_source=github&utm_medium=repo&utm_campaign=tradingview-subscription-realtime)
- **Documentation**: [Bitquery Docs](https://docs.bitquery.io?utm_source=github&utm_medium=repo&utm_campaign=tradingview-subscription-realtime)

---

## 🌟 Related Projects

- [Crypto Price API](https://github.com/bitquery/crypto-price-api) - NPM package for token price feeds
- [Bitquery IDE](https://ide.bitquery.io?utm_source=github&utm_medium=repo&utm_campaign=tradingview-subscription-realtime) - Interactive GraphQL playground
- [Streaming Data Platform](https://docs.bitquery.io/docs/streams/?utm_source=github&utm_medium=repo&utm_campaign=tradingview-subscription-realtime) - Kafka streams for blockchain data

---

**Built with ❤️ by [Bitquery](https://bitquery.io?utm_source=github&utm_medium=repo&utm_campaign=tradingview-subscription-realtime)**

