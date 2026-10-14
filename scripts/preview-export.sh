#!/usr/bin/env bash
# Builds a static, relative-path preview of the drafts into ./preview (for sharing a review link).
set -e
cd "$(dirname "$0")/.."
mv src/proxy.js /tmp/gtc-proxy.js
trap 'mv /tmp/gtc-proxy.js src/proxy.js' EXIT
rm -rf out preview
STATIC_EXPORT=1 npx next build --webpack
mkdir -p preview
cp -r out/_next out/images out/icon.png preview/ 2>/dev/null || true
# Draft 4 (the chosen homepage) in every language
for d in out/*/draft-4; do l=$(basename $(dirname $d)); mkdir -p preview/$l/draft-4; cp $d/index.html preview/$l/draft-4/; done
# Company hub in every language
for d in out/*/company; do l=$(basename $(dirname $d)); mkdir -p preview/$l/company; cp $d/index.html preview/$l/company/; done
# award images: the real ones from public/awards, or preview stand-ins
mkdir -p preview/awards
if ls public/awards/*.webp >/dev/null 2>&1; then cp public/awards/*.webp preview/awards/; else cp preview-hub/awards/*.webp preview/awards/ 2>/dev/null || true; fi
cp public/ceo.webp preview/
# every draft page sits two folders deep, so ../../ points to the preview root
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
