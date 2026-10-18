/**
 * The 7 market pages (/markets/<slug>). Order = the Trade Markets menu:
 * odd positions use template A, even positions template B.
 *
 *  - slug        URL segment (/markets/<slug>); symbol pages live at /markets/<slug>/<symbol lowercase>
 *  - id          key in messages/<locale>/marketsPage.json → marketsPage.pages.<id>
 *  - apiType     matches the category name returned by the symbols API (/symbol/type)
 *  - fallback    symbol list used when the symbols API can't be reached (s = feed symbol, n = description, d = decimals)
 */
export const MARKET_PAGES = [
  {
    slug: 'forex',
    id: 'forex',
    template: 'A',
    apiType: /forex|fx|currenc/i,
    fallback: [
      ['EURUSD', 'Euro vs US Dollar', 5], ['GBPUSD', 'British Pound vs US Dollar', 5], ['USDJPY', 'US Dollar vs Japanese Yen', 3],
      ['USDCHF', 'US Dollar vs Swiss Franc', 5], ['AUDUSD', 'Australian Dollar vs US Dollar', 5], ['USDCAD', 'US Dollar vs Canadian Dollar', 5],
      ['NZDUSD', 'New Zealand Dollar vs US Dollar', 5], ['EURGBP', 'Euro vs British Pound', 5], ['EURJPY', 'Euro vs Japanese Yen', 3],
      ['GBPJPY', 'British Pound vs Japanese Yen', 3], ['EURCHF', 'Euro vs Swiss Franc', 5], ['AUDJPY', 'Australian Dollar vs Japanese Yen', 3],
      ['AUDCAD', 'Australian Dollar vs Canadian Dollar', 5], ['AUDCHF', 'Australian Dollar vs Swiss Franc', 5], ['AUDNZD', 'Australian Dollar vs New Zealand Dollar', 5],
      ['CADJPY', 'Canadian Dollar vs Japanese Yen', 3], ['CHFJPY', 'Swiss Franc vs Japanese Yen', 3], ['EURAUD', 'Euro vs Australian Dollar', 5],
      ['EURCAD', 'Euro vs Canadian Dollar', 5], ['EURNZD', 'Euro vs New Zealand Dollar', 5], ['GBPAUD', 'British Pound vs Australian Dollar', 5],
      ['GBPCAD', 'British Pound vs Canadian Dollar', 5], ['GBPCHF', 'British Pound vs Swiss Franc', 5], ['GBPNZD', 'British Pound vs New Zealand Dollar', 5],
      ['NZDJPY', 'New Zealand Dollar vs Japanese Yen', 3], ['USDSGD', 'US Dollar vs Singapore Dollar', 5], ['USDHKD', 'US Dollar vs Hong Kong Dollar', 5],
      ['USDZAR', 'US Dollar vs South African Rand', 5], ['USDMXN', 'US Dollar vs Mexican Peso', 5], ['USDTRY', 'US Dollar vs Turkish Lira', 5]
    ]
  },
  {
    slug: 'energy',
    id: 'energy',
    template: 'B',
    apiType: /energ|oil/i,
    fallback: [
      ['BRNUSD', 'Brent Crude Oil', 2], ['WTIUSD', 'US Crude Oil', 2], ['USOUSD', 'US Crude Oil', 3], ['UKOUSD', 'Brent Crude Oil', 3], ['NGAS', 'Natural Gas', 3]
    ]
  },
  {
    slug: 'indices',
    id: 'indices',
    template: 'A',
    apiType: /indic|index/i,
    fallback: [
      ['US30', 'Dow Jones 30', 1], ['SPX500', 'S&P 500', 1], ['NAS100', 'Nasdaq 100', 1], ['UK100', 'FTSE 100', 1], ['GER40', 'DAX 40', 1],
      ['FRA40', 'CAC 40', 1], ['JPN225', 'Nikkei 225', 1], ['AUS200', 'ASX 200', 1], ['HK50', 'Hang Seng 50', 1], ['EU50', 'Euro Stoxx 50', 1]
    ]
  },
  {
    slug: 'metals',
    id: 'metals',
    template: 'B',
    apiType: /metal|gold|precious/i,
    fallback: [
      ['XAUUSD', 'Gold vs US Dollar', 2], ['XAGUSD', 'Silver vs US Dollar', 3], ['XPTUSD', 'Platinum vs US Dollar', 2], ['XPDUSD', 'Palladium vs US Dollar', 2]
    ]
  },
  {
    slug: 'shares',
    id: 'shares',
    template: 'A',
    apiType: /share|stock|equit/i,
    fallback: [
      ['AAPL', 'Apple Inc.', 2], ['MSFT', 'Microsoft Corp.', 2], ['NVDA', 'NVIDIA Corp.', 2], ['AMZN', 'Amazon.com Inc.', 2], ['GOOGL', 'Alphabet Inc.', 2],
      ['META', 'Meta Platforms Inc.', 2], ['TSLA', 'Tesla Inc.', 2], ['NFLX', 'Netflix Inc.', 2], ['JPM', 'JPMorgan Chase & Co.', 2], ['V', 'Visa Inc.', 2]
    ]
  },
  {
    slug: 'crypto-cfds',
    id: 'crypto',
    template: 'B',
    apiType: /crypto|coin/i,
    fallback: [
      ['BTCUSD', 'Bitcoin vs US Dollar', 1], ['ETHUSD', 'Ethereum vs US Dollar', 2], ['SOLUSD', 'Solana vs US Dollar', 2], ['XRPUSD', 'Ripple vs US Dollar', 4],
      ['LTCUSD', 'Litecoin vs US Dollar', 2], ['BCHUSD', 'Bitcoin Cash vs US Dollar', 2]
    ]
  },
  {
    slug: 'future-cfds',
    id: 'futures',
    template: 'A',
    apiType: /futur|commod|soft/i,
    fallback: [
      ['COFFEE', 'Coffee', 2], ['COCOA', 'Cocoa', 1], ['SUGAR', 'Sugar', 2], ['WHEAT', 'Wheat', 1], ['CORN', 'Corn', 1], ['SOYBEAN', 'Soybeans', 1], ['COTTON', 'Cotton', 2]
    ]
  }
];

export const marketPageBySlug = (slug) => MARKET_PAGES.find((p) => p.slug === slug);

/** URL of a single symbol page: /markets/<slug>/<symbol lowercase> */
export const symbolHref = (slug, symbol) => `/markets/${slug}/${String(symbol).toLowerCase()}`;

/**
 * Symbol pages built ahead of time (the Markets menu links + the review link).
 * Every other symbol of a market is rendered on its first visit and cached (see `revalidate` in the route).
 */
export const PREBUILT_SYMBOLS = {
  forex: ['EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF'],
  metals: ['XAUUSD'],
  indices: ['US30', 'SPX500', 'NAS100']
};

/**
 * Symbol page settings you can change without touching the components.
 *  - devicesImage   the "Unlock global markets" picture (put the final file in /public and update the path)
 *  - downloads      the four buttons under it; replace the hrefs with the real download links when ready
 */
export const SYMBOL_PAGE = {
  devicesImage: { src: '/images/markets/platform-devices.webp', width: 1510, height: 720 },
  downloads: [
    { id: 'windows', href: '/trading/gtc-go-app' },
    { id: 'mac', href: '/trading/gtc-go-app' },
    { id: 'linux', href: '/trading/gtc-go-app' },
    { id: 'web', href: '/trading/gtc-go-app' }
  ]
};
