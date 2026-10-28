'use client';

import { Cat5Frame } from '../components/MarketingPage';
import DeleteAccountPage from './components/DeleteAccountPage';

/** Delete account on the UAE CAT 5 site — CAT5 chrome only (no main-site header/footer). */
export default function DeleteCat5Shell() {
  return (
    <Cat5Frame page="home">
      <DeleteAccountPage shell="cat5" />
    </Cat5Frame>
  );
}
