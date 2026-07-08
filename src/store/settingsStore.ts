import { create } from 'zustand';
import { Settings, loadSettings, saveSettings } from '../utils/storage';
import { BotDifficulty } from '../game/types';

interface SettingsStore {
  settings: Settings;
  load: () => Promise<void>;
  update: (partial: Partial<Settings>) => Promise<void>;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: {
    soundEnabled: true,
    vibrationEnabled: true,
    botDifficulty: 'medium',
    tableTheme: 'classic',
    cardBack: 'classic',
    soundPack: 'classic',
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
