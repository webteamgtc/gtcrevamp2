#!/usr/bin/env bash
# Builds a static, relative-path preview of the site into ./preview (for sharing a review link).
set -e
cd "$(dirname "$0")/.."
# static export can't include the proxy or API routes: park them for the build
mv src/proxy.js /tmp/gtc-proxy.js
mv src/app/api /tmp/gtc-api
# …and can't render pages on demand: symbol pages are limited to the prebuilt ones
SYM='src/app/[locale]/markets/[market]/[symbol]/page.js'
cp "$SYM" /tmp/gtc-symbol-page.js
sed -i 's/^export const dynamicParams = true;/export const dynamicParams = false;/' "$SYM"
trap 'mv /tmp/gtc-proxy.js src/proxy.js; mv /tmp/gtc-api src/app/api; mv /tmp/gtc-symbol-page.js "$SYM"' EXIT
rm -rf out preview
STATIC_EXPORT=1 npx next build --webpack
mkdir -p preview
cp -r out/_next out/images out/icon.png preview/ 2>/dev/null || true
# Homepage in every language (flattened to /<l>/home/)
for l in $(ls -d out/*/ | xargs -n1 basename); do [ -f out/$l/index.html ] && [ -d out/$l/company ] && mkdir -p preview/$l/home && cp out/$l/index.html preview/$l/home/; done
# Every other page, flattened to /<l>/<last-segment>/ so all pages sit two folders deep
# (keep in sync with PREVIEW_PAGES in src/components/shared/nav/NavLink.jsx)
PAGES="company trading trading/open-live-account trading/free-demo-account trading/deposit trading/account-types trading/compensation-fund trading/mt5-platform trading/mt4-platform trading/metatrader-for-android trading/metatrader-for-ipad trading/gtc-go-app trading/gtc-go-app-ipad trading/gtc-go-app-android company/about-us company/why-gtc-group company/global-presence company/events-and-exhibitions company/regulations company/contact-us markets markets/forex markets/energy markets/indices markets/metals markets/shares markets/crypto-cfds markets/future-cfds markets/forex/eurusd markets/forex/gbpusd markets/forex/usdjpy markets/forex/usdchf markets/metals/xauusd markets/indices/us30 markets/indices/spx500 markets/indices/nas100"
for l in $(ls -d out/*/ | xargs -n1 basename); do
  [ -d out/$l/company ] || continue
  for p in $PAGES; do
    [ -f out/$l/$p/index.html ] && mkdir -p preview/$l/$(basename $p) && cp out/$l/$p/index.html preview/$l/$(basename $p)/
  done
done
# award images: the real ones from public/awards, or preview stand-ins
mkdir -p preview/awards
if ls public/awards/*.webp >/dev/null 2>&1; then cp public/awards/*.webp preview/awards/; else cp preview-hub/awards/*.webp preview/awards/ 2>/dev/null || true; fi
cp public/ceo.webp preview/
# every page sits two folders deep, so ../../ points to the preview root
# CSS files live in _next/static/css/, so their font URLs point to ../media/
find preview -name '*.css' | while read f; do sed -i 's#/__GTC__/_next/static/media/#../media/#g' "$f"; done
find preview -name '*.html' -o -name '*.js' | while read f; do
  sed -i 's#/__GTC__/_next/#../../_next/#g; s#"/images/#"../../images/#g; s#"/icon.png#"../../icon.png#g; s#"/ceo.webp#"../../ceo.webp#g; s#"/awards/#"../../awards/#g' "$f"
done

# avoid "[locale]" in URLs: rename the chunk folder and its references
if [ -d "preview/_next/static/chunks/app/[locale]" ]; then
  mv "preview/_next/static/chunks/app/[locale]" preview/_next/static/chunks/app/locale
  find preview -name '*.html' -o -name '*.js' | while read f; do sed -i 's#app/%5Blocale%5D/#app/locale/#g; s#app/\[locale\]/#app/locale/#g' "$f"; done
fi
# same for dynamic segments below it, e.g. markets/[market] -> markets/market
find preview/_next/static/chunks/app -depth -type d -name '\[*\]' | while read d; do
  n=$(basename "$d" | tr -d '[]'); mv "$d" "$(dirname "$d")/$n"
  find preview -name '*.html' -o -name '*.js' | while read f; do sed -i "s#/%5B$n%5D/#/$n/#g; s#/\\[$n\\]/#/$n/#g" "$f"; done
done

# the artifact host reserves names starting with "_": move _next to assets/
# (Next's runtime needs a "/_next/" segment in script URLs, so keep it one level down)
mkdir -p preview/assets && mv preview/_next preview/assets/_next
find preview -name '*.html' -o -name '*.js' | while read f; do sed -i 's#\.\./\.\./_next/#../../assets/_next/#g' "$f"; done

# escape literal U+FFFD characters (the artifact host rejects them in text files)
python3 - <<'PY'
import glob
for f in glob.glob('preview/**/*.js', recursive=True):
    s = open(f, encoding='utf-8').read()
    if '�' in s:
        open(f, 'w', encoding='utf-8').write(s.replace('�', '\\uFFFD'))
PY

