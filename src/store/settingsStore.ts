import { create } from 'zustand';
import { Settings, loadSettings, saveSettings } from '../utils/storage';

interface SettingsStore {
  settings: Settings;
  load: () => Promise<void>;
  update: (partial: Partial<Settings>) => Promise<void>;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: {
    soundEnabled: true,
    vibrationEnabled: true,
  },

  load: async () => {
    const settings = await loadSettings();
    set({ settings });
  },

  update: async (partial: Partial<Settings>) => {
    const current = get().settings;
    const updated = { ...current, ...partial };
    await saveSettings(updated);
    set({ settings: updated });
  },
}));
