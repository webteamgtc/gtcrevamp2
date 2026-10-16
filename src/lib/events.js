/**
 * Events & Exhibitions data (Strapi collection type `event`, API id `events`).
 * Pages call getEventsPageData(locale) on the server; components only see the normalised shape below.
 *
 * Normalised event:
 * { id, slug, title, shortTitle, summary, body: string[], startDate, endDate ('YYYY-MM-DD'),
 *   venue, city, country, booth, role, featured, registrationOpen,
 *   cover: {url, alt, width, height} | null, gallery: [{url, alt, width, height}],
 *   year, dateLabel, place, status: 'upcoming' | 'live' | 'past' }
 *
 * Full field list + example request/response: docs/strapi-events.md
 */
import { strapiGet, strapiConfigured, toImage, toParagraphs } from './strapi';
import { SAMPLE_EVENTS } from '@/data/events.sample';

const ISO = (d) => (d ? String(d).slice(0, 10) : '');

/** Raw Strapi v5 entry (flat attributes) → normalised event. Also accepts v4 `{ id, attributes }`. */
export function normaliseEvent(raw) {
  const a = raw?.attributes ? { id: raw.id, ...raw.attributes } : raw ?? {};
  const media = (m) => (m?.data !== undefined ? (Array.isArray(m.data) ? m.data.map((x) => ({ id: x.id, ...x.attributes })) : m.data && { id: m.data.id, ...m.data.attributes }) : m);
  const gallery = media(a.gallery) ?? [];
  return {
    id: String(a.documentId ?? a.id ?? a.slug),
    slug: a.slug ?? '',
    title: a.title ?? '',
    shortTitle: a.shortTitle || a.title || '',
    summary: a.summary ?? '',
    body: toParagraphs(a.description ?? a.body),
    startDate: ISO(a.startDate),
    endDate: ISO(a.endDate || a.startDate),
    venue: a.venue ?? '',
    city: a.city ?? '',
    country: a.country ?? '',
    booth: a.booth ?? '',
    role: a.sponsorship ?? a.role ?? '',
    featured: Boolean(a.featured),
    registrationOpen: Boolean(a.registrationOpen),
    cover: toImage(media(a.cover), 'large'),
    gallery: (Array.isArray(gallery) ? gallery : []).map((g) => toImage(g, 'large')).filter(Boolean)
  };
}

/** "30–31 October 2026" in the page language (UTC so server and browser agree). */
// "en" would give US order (October 30 – 31); the site uses day-month-year
export const dateLocale = (locale) => (locale === 'en' ? 'en-GB' : locale);

export function formatRange(start, end, locale) {
  try {
    const fmt = new Intl.DateTimeFormat(dateLocale(locale), { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
    const a = new Date(`${start}T00:00:00Z`);
    const b = new Date(`${end || start}T00:00:00Z`);
    return start === end || !end ? fmt.format(a) : fmt.formatRange(a, b);
  } catch {
    return end && end !== start ? `${start} – ${end}` : start;
  }
}

function decorate(e, locale, today) {
  const status = e.endDate < today ? 'past' : e.startDate <= today ? 'live' : 'upcoming';
  const place = [e.venue, e.city, e.country].filter(Boolean).join(', ');
  return { ...e, year: e.startDate.slice(0, 4), dateLabel: formatRange(e.startDate, e.endDate, locale), place, status };
}

async function fetchEvents(locale) {
  if (!strapiConfigured()) return null;
  const json = await strapiGet('events', {
    locale,
    tags: ['events'],
    query: {
      sort: ['startDate:desc'],
      pagination: { pageSize: 100 },
      populate: { cover: { fields: ['url', 'alternativeText', 'width', 'height', 'formats'] }, gallery: { fields: ['url', 'alternativeText', 'width', 'height', 'formats'] } }
    }
  });
  if (!json?.data) return null;
  return json.data.map(normaliseEvent);
}

/**
 * Everything the Events page needs:
 *  upcoming — not finished yet, soonest first (featured one first)
 *  archive  — finished, grouped by year (newest first)
 *  source   — 'strapi' | 'sample'
 */
export async function getEventsPageData(locale) {
  const today = new Date().toISOString().slice(0, 10);
  const remote = await fetchEvents(locale);
  const list = (remote ?? SAMPLE_EVENTS).map((e) => decorate(e, locale, today));

  const upcoming = list
    .filter((e) => e.status !== 'past')
    .sort((a, b) => Number(b.featured) - Number(a.featured) || a.startDate.localeCompare(b.startDate));
  const past = list.filter((e) => e.status === 'past').sort((a, b) => b.startDate.localeCompare(a.startDate));
  const years = [...new Set(past.map((e) => e.year))].sort((a, b) => b.localeCompare(a));
  const archive = years.map((year) => ({ year, events: past.filter((e) => e.year === year) }));

  return { upcoming, archive, source: remote ? 'strapi' : 'sample' };
}
