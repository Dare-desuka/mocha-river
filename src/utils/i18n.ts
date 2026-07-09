import { useSettingsStore } from '../store/settingsStore';
import { en, id } from '../constants/lang';

const langs = { en, id };

export function t(key: string, lang: 'en' | 'id' = 'en'): string {
  return langs[lang][key as keyof typeof en] ?? key;
}

export function useT() {
  const lang = useSettingsStore(s => s.settings.language);
  return (key: string) => langs[lang][key as keyof typeof en] ?? key;
}
