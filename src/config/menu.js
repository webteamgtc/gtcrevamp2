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

// external links — replace with the real client-portal URLs
export const PORTAL = {
  register: '#register',
  login: '#login',
  demo: '#register'
};

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
    promo: { id: 'company', href: '/account-types', visual: 'accounts' }
  },
  {
    id: 'trading',
    href: '/trading',
    columns: [
      [{ id: 'tradeWith', items: [
        { id: 'openLive', href: '/trading/open-live-account', icon: UserPlus },
        { id: 'freeDemo', href: PORTAL.demo, icon: MonitorPlay },
        { id: 'fund', href: '/deposit-withdraw', icon: Wallet },
        { id: 'accountTypes', href: '/account-types', icon: Layers },
        { id: 'security', href: '/security-of-funds', icon: ShieldCheck }
      ] }],
      [
        { id: 'metatrader', items: [
          { id: 'mt5', href: '/platforms/mt5', icon: Monitor },
          { id: 'mt4', href: '/platforms/mt4', icon: Monitor },
          { id: 'mtAndroid', href: '/platforms/metatrader-android', icon: Smartphone },
          { id: 'mtIos', href: '/platforms/metatrader-ios', icon: Tablet }
        ] },
        { id: 'products', items: [
          { id: 'dynamicLeverage', href: '/dynamic-leverage', icon: Gauge },
          { id: 'swapUpdate', href: '/swap-update', icon: RefreshCw }
        ] }
      ],
      [
        { id: 'gtcgo', items: [
          { id: 'gtcGo', href: '/platforms/gtc-go', icon: AppWindow },
          { id: 'gtcGoWeb', href: '/platforms/gtc-go-web', icon: Globe },
          { id: 'gtcGoIos', href: '/platforms/gtc-go-ios', icon: Tablet },
          { id: 'gtcGoAndroid', href: '/platforms/gtc-go-android', icon: Smartphone },
          { id: 'copyTrading', href: '/copy-trading', icon: Users }
        ] },
        { id: 'advantages', items: [
          { id: 'pamm', href: '/pamm', icon: ChartPie },
          { id: 'vps', href: '/vps', icon: Server }
        ] }
      ]
    ],
    promo: { id: 'trading', visual: 'downloads' }
  },
  {
    id: 'markets',
    columns: [
      [{ id: 'tradeMarkets', items: [
        { id: 'forex', href: '/markets/forex', icon: Globe },
        { id: 'energy', href: '/markets/energy', icon: Flame },
        { id: 'indices', href: '/markets/indices', icon: ChartColumn },
        { id: 'metals', href: '/markets/metals', icon: Gem },
        { id: 'shares', href: '/markets/shares', icon: Landmark },
        { id: 'crypto', href: '/markets/crypto', icon: Bitcoin },
        { id: 'futures', href: '/markets/futures', icon: Wheat }
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
    columns: [
      [{ id: 'startTrading', items: [
        { id: 'beginners', href: '/learn/beginners', icon: Rocket },
        { id: 'freeDemo', href: PORTAL.demo, icon: MonitorPlay },
        { id: 'glossary', href: '/learn/glossary', icon: BookA },
        { id: 'liquidity', href: '/learn/liquidity-technology', icon: Network }
      ] }],
      [{ id: 'skills', items: [
        { id: 'essentials', href: '/learn/trading-essentials', icon: BookOpen },
        { id: 'marketGuides', href: '/learn/market-guides', icon: Map },
        { id: 'risk', href: '/learn/risk-management', icon: ShieldAlert },
        { id: 'technical', href: '/learn/technical-analysis', icon: ChartCandlestick }
      ] }],
      [{ id: 'helpCentre', items: [
        { id: 'qa', href: '/faq', icon: CircleHelp },
        { id: 'depositFaq', href: '/faq/account-deposit', icon: FileQuestion },
        { id: 'platformGuides', href: '/learn/platform-guides', icon: Monitor }
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
    promo: { id: 'news', href: '/deposit-withdraw', visual: 'currencies' }
  }
];
