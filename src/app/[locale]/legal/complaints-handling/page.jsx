import { legalRoute } from '../components/legalRoute';

// South African site only (/en-za); other locales answer 404 — see ZA_ONLY_LEGAL_SLUGS in src/config/regions.js
export const revalidate = 3600;

const route = legalRoute('complaints-handling');
export const generateMetadata = route.generateMetadata;
export default route.Page;
