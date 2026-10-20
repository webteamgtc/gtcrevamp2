/**
 * Main navigation structure.
 * Text lives in messages/<locale>.json under "menu" (same ids as below).
 * href = internal route without the locale (e.g. '/about' → /en/about), or a full https:// URL.
 */
import {
  Building2, Sparkles, Globe, CalendarDays, ShieldCheck, Award, Headset, MessageCircle, Handshake, Crown,
  UserPlus, MonitorPlay, Wallet, Layers, Monitor, Smartphone, Tablet, Users, Gauge, RefreshCw, ChartPie, Server,
  Rocket, BookA, Network, BookOpen, Map, ShieldAlert, ChartCandlestick, CircleHelp, FileQuestion, Newspaper,
  CalendarClock, Coins, CalendarX, Megaphone, Trophy, AppWindow, Gem, Flame, ChartColumn, Bitcoin, Landmark, Wheat
} from 'lucide-react';

// account entry points: live application form (/trading hero), demo form, client portal log-in
const CLIENT_PORTAL = 'https://web.mygtc.app/user?redirect=%252Fdashboard';
export const PORTAL = {
  register: '/trading#apply',
  login: CLIENT_PORTAL,
  demo: '/trading/free-demo-account',
  clientPortal: CLIENT_PORTAL
};

/** Footer link targets, in the same order as footer.columns.<id>.links in messages/<locale>/common.json */
export const FOOTER_LINKS = {
  instruments: ['/markets/forex', '/markets/energy', '/markets/indices', '/markets/metals', '/markets/shares', '/markets/crypto-cfds', '/markets/future-cfds'],
  quick: ['/trading/account-types', '/copy-trading', '/trading/deposit', '/markets', '/promotions'],
  platforms: ['/trading/mt4-platform', '/trading/mt5-platform', '/trading/gtc-go-app'],
  company: ['/company/about-us', '/company/why-gtc-group', '/company/regulations', '/company/events-and-exhibitions'],
  support: ['/faq', '/company/contact-us', '/company/contact-us#help'],
  legal: [
    '/legal/website-disclaimer',
    '/legal/risk-disclosure',
    '/legal/restricted-countries',
    '/legal/deposit-refund-policy',
    '/legal/kyc-compliance-policy',
    '/legal/cookie-policy',
    '/legal/privacy-policy',
    '/legal/terms-and-conditions'
  ]
};

/** Homepage market cards, in the same order as markets.items in homepage.json */
export const MARKET_LINKS = ['/markets/forex', '/markets/metals', '/markets/energy', '/markets/indices', '/markets/future-cfds', '/markets/shares', '/markets/crypto-cfds', '/markets/future-cfds'];

/** Homepage platform slides by key */
export const PLATFORM_LINKS = { gtcgo: '/trading/gtc-go-app', mt5: '/trading/mt5-platform', mt4: '/trading/mt4-platform' };

export const MENU = [
  {
    id: 'company',
    href: '/company', // clicking "Company" in the top bar opens the Company page
    columns: [
      [{ id: 'about', items: [
        { id: 'aboutUs', href: '/company/about-us', icon: Building2 },
        { id: 'whyGtcfx', href: '/company/why-gtc-group', icon: Sparkles },
        { id: 'globalPresence', href: '/company/global-presence', icon: Globe },
        { id: 'events', href: '/company/events-and-exhibitions', icon: CalendarDays }
      ] }],
      [{ id: 'legal', items: [
        { id: 'regulation', href: '/company/regulations', icon: ShieldCheck },
        { id: 'awards', href: '/awards', icon: Award }
      ] }],
      [
        { id: 'help', items: [
          { id: 'faqSupport', href: '/faq', icon: Headset },
          { id: 'contact', href: '/company/contact-us', icon: MessageCircle }
        ] },
        { id: 'partner', items: [
          { id: 'partners', href: '/partners', icon: Handshake },
          { id: 'prime', href: '/gtc-prime', icon: Crown }
        ] }
      ]
    ],
    promo: { id: 'company', href: '/trading/account-types', visual: 'accounts' }
  },
  
  {
    id: 'trading',
    href: '/trading',
    columns: [
      [{ id: 'tradeWith', items: [
        { id: 'openLive', href: '/trading/open-live-account', icon: UserPlus },
        { id: 'freeDemo', href: '/trading/free-demo-account', icon: MonitorPlay },
        { id: 'fund', href: '/trading/deposit', icon: Wallet },
        { id: 'accountTypes', href: '/trading/account-types', icon: Layers },
        { id: 'security', href: '/trading/compensation-fund', icon: ShieldCheck }
      ] }],
      [
        { id: 'metatrader', items: [
          { id: 'mt5', href: '/trading/mt5-platform', icon: Monitor },
          { id: 'mt4', href: '/trading/mt4-platform', icon: Monitor },
          { id: 'mtAndroid', href: '/trading/metatrader-for-android', icon: Smartphone },
          { id: 'mtIos', href: '/trading/metatrader-for-ipad', icon: Tablet }
        ] },
        { id: 'products', items: [
          { id: 'dynamicLeverage', href: '/company/dynamic-leverage', icon: Gauge },
          { id: 'swapUpdate', href: '/trading/swap-update', icon: RefreshCw }
        ] }
      ],
      [
        { id: 'gtcgo', items: [
          { id: 'gtcGo', href: '/trading/gtc-go-app', icon: AppWindow },
          { id: 'gtcGoWeb', href: '/trading/gtc-go-web', icon: Globe },
          { id: 'gtcGoIos', href: '/trading/gtc-go-app-ipad', icon: Tablet },
          { id: 'gtcGoAndroid', href: '/trading/gtc-go-app-android', icon: Smartphone },
          { id: 'copyTrading', href: '/trading/copy-trading', icon: Users }
        ] },
        { id: 'advantages', items: [
          { id: 'pamm', href: '/trading/pamm-account', icon: ChartPie },
          { id: 'vps', href: '/trading/vps-hosting-services', icon: Server }
        ] }
      ]
    ],
    promo: { id: 'trading', visual: 'downloads' }
  },
  {
    id: 'markets',
    href: '/markets', // clicking "Markets" in the top bar opens the Markets page
    columns: [
      [{ id: 'tradeMarkets', items: [
        { id: 'forex', href: '/markets/forex', icon: Globe },
        { id: 'energy', href: '/markets/energy', icon: Flame },
        { id: 'indices', href: '/markets/indices', icon: ChartColumn },
        { id: 'metals', href: '/markets/metals', icon: Gem },
        { id: 'shares', href: '/markets/shares', icon: Landmark },
        { id: 'crypto', href: '/markets/crypto-cfds', icon: Bitcoin },
        { id: 'futures', href: '/markets/future-cfds', icon: Wheat }
      ] }],
      // live-price lists: `group` = demo feed group in shared/ticker.jsx
      [{ id: 'recommendations', live: 7, items: [
        { id: 'EURUSD', href: '/markets/forex/eurusd' },
        { id: 'GBPUSD', href: '/markets/forex/gbpusd' },
        { id: 'USDJPY', href: '/markets/forex/usdjpy' },
        { id: 'USDCHF', href: '/markets/forex/usdchf' },
        { id: 'XAUUSD', href: '/markets/metals/xauusd' }
      ] }],
      [{ id: 'popularIndices', live: 8, items: [
        { id: 'US30', href: '/markets/indices/us30' },
        { id: 'SPX500', href: '/markets/indices/spx500' },
        { id: 'NAS100', href: '/markets/indices/nas100' }
      ] }]
    ],
    promo: { id: 'markets', href: PORTAL.register, visual: 'chart' }
  },
  {
    id: 'learn',
    href: '/knowledge-to-learn', // clicking "Learn" in the top bar opens the Knowledge hub
    columns: [
      [{ id: 'startTrading', items: [
        { id: 'beginners', href: '/knowledge-to-learn/for-trading-beginners', icon: Rocket },
        { id: 'freeDemo', href: PORTAL.demo, icon: MonitorPlay },
        { id: 'glossary', href: '/knowledge-to-learn/trading-glossary', icon: BookA },
        { id: 'liquidity', href: '/knowledge-to-learn/liquidity-technology', icon: Network }
      ] }],
      [{ id: 'skills', items: [
        { id: 'essentials', href: '/knowledge-to-learn/ebooks-guides', icon: BookOpen },
        { id: 'marketGuides', href: '/knowledge-to-learn/webinars-live', icon: Map },
        { id: 'risk', href: '/knowledge-to-learn/platform-walkthroughs', icon: ShieldAlert },
        { id: 'technical', href: '/knowledge-to-learn/technical-analysis', icon: ChartCandlestick }
      ] }],
      [{ id: 'helpCentre', items: [
        { id: 'qa', href: '/faq', icon: CircleHelp },
        { id: 'depositFaq', href: '/faq/account-deposit', icon: FileQuestion },
        { id: 'platformGuides', href: '/knowledge-to-learn/platform-guide', icon: Monitor }
      ] }]
    ],
    promo: { id: 'learn', href: '/insights', visual: 'insight' }
  },
  {
    id: 'news',
    columns: [
      [{ id: 'marketUpdates', items: [
        { id: 'outlook', href: '/news/market-outlook', icon: Newspaper },
        { id: 'calendar', href: '/news/economic-calendar', icon: CalendarClock },
        { id: 'earnings', href: '/news/earnings-dividends', icon: Coins },
        { id: 'holidays', href: '/news/market-holidays', icon: CalendarX }
      ] }],
      [{ id: 'companyUpdates', items: [
        { id: 'companyNews', href: '/news/company', icon: Megaphone },
        { id: 'events', href: '/company/events-and-exhibitions', icon: CalendarDays },
        { id: 'awardsMedia', href: '/awards', icon: Trophy }
      ] }]
    ],
    promo: { id: 'news', href: '/trading/deposit', visual: 'currencies' }
  }
];
