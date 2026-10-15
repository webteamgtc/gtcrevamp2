# Translation files

## Folder layout (preferred)

For each locale, split copy by page or shared scope:

```
messages/
  en/
    common.json       # nav, footer, menu, meta, riskBar, lang picker, …
    homepage.json     # hero, features, markets, drafts, register, …
    companyPage.json  # /company — root key `companyPage`
  ar/
    common.json
    homepage.json
    companyPage.json
```

Components keep using the same namespaces, e.g. `useTranslations('companyPage')` or `useTranslations('hero')`.

## Legacy single file

`messages/<locale>.json` still works. It is merged **under** folder bundles (folder overrides legacy for the same keys). Use this for languages that only override part of the site.

## Regenerate splits from a monolith

```bash
node scripts/split-messages.mjs en
node scripts/split-messages.mjs ar
```

## Adding a new page or namespace

**Option A — flat keys (filename = namespace)** — e.g. `messages/en/adeela.json`:

```json
{
  "label1": "News 1",
  "label2": "News 2"
}
```

```jsx
const t = useTranslations('adeela'); // same as file name, without .json
t('label1'); // → "News 1"
```

**Option B — explicit wrapper**:

```json
{
  "adeela": {
    "label1": "News 1"
  }
}
```

Same `useTranslations('adeela')`.

Copy the file for other locales (`messages/ar/adeela.json`, etc.). Do not put flat keys in `common.json` / `homepage.json` (those files export many namespaces at once).

Files under `messages/en/` are read from disk on each request (no dev restart needed after adding a JSON file). Restart only if you change `loadMessages.js`.
