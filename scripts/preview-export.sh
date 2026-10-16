#!/usr/bin/env bash
# Builds a static, relative-path preview of the site into ./preview (for sharing a review link).
set -e
cd "$(dirname "$0")/.."
mv src/proxy.js /tmp/gtc-proxy.js
trap 'mv /tmp/gtc-proxy.js src/proxy.js' EXIT
rm -rf out preview
STATIC_EXPORT=1 npx next build --webpack
mkdir -p preview
cp -r out/_next out/images out/icon.png preview/ 2>/dev/null || true
# Homepage in every language (flattened to /<l>/home/)
for l in $(ls -d out/*/ | xargs -n1 basename); do [ -f out/$l/index.html ] && [ -d out/$l/company ] && mkdir -p preview/$l/home && cp out/$l/index.html preview/$l/home/; done
# Company hub in every language
for d in out/*/company; do l=$(basename $(dirname $d)); mkdir -p preview/$l/company; cp $d/index.html preview/$l/company/; done
# Trading pages in every language
# (open-live-account is flattened to /<l>/open-live-account/ so every page sits two folders deep)
for d in out/*/trading; do l=$(basename $(dirname $d)); mkdir -p preview/$l/trading preview/$l/open-live-account; cp $d/index.html preview/$l/trading/; cp $d/open-live-account/index.html preview/$l/open-live-account/ 2>/dev/null || true; done
# About Us (flattened to /<l>/about-us/)
for d in out/*/company/about-us; do l=$(basename $(dirname $(dirname $d))); mkdir -p preview/$l/about-us; cp $d/index.html preview/$l/about-us/; done
# Why GTC Group (flattened to /<l>/why-gtc-group/)
for d in out/*/company/why-gtc-group; do l=$(basename $(dirname $(dirname $d))); mkdir -p preview/$l/why-gtc-group; cp $d/index.html preview/$l/why-gtc-group/; done
# Global Presence (flattened to /<l>/global-presence/)
for d in out/*/company/global-presence; do l=$(basename $(dirname $(dirname $d))); mkdir -p preview/$l/global-presence; cp $d/index.html preview/$l/global-presence/; done
# Events & Exhibitions (flattened to /<l>/events-and-exhibitions/)
for d in out/*/company/events-and-exhibitions; do l=$(basename $(dirname $(dirname $d))); mkdir -p preview/$l/events-and-exhibitions; cp $d/index.html preview/$l/events-and-exhibitions/; done
# Regulations (flattened to /<l>/regulations/)
for d in out/*/company/regulations; do l=$(basename $(dirname $(dirname $d))); mkdir -p preview/$l/regulations; cp $d/index.html preview/$l/regulations/; done
# Contact Us (flattened to /<l>/contact-us/)
for d in out/*/company/contact-us; do l=$(basename $(dirname $(dirname $d))); mkdir -p preview/$l/contact-us; cp $d/index.html preview/$l/contact-us/; done
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

