import achievementsEn from '../../shared/Achievements/translations/en.json';
import { en, uk } from './translations';

const resources = {
  en: {
    translation: { ...en, ...achievementsEn },
  },
  uk: {
    translation: uk,
  },
};

export default resources;
