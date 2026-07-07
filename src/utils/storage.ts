import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  CHIP_BALANCE: 'poker_chip_balance',
  SETTINGS: 'poker_settings',
};

export async function saveChipBalance(chips: number): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.CHIP_BALANCE, String(chips));
  } catch {}
}

export async function loadChipBalance(): Promise<number | null> {
  try {
    const val = await AsyncStorage.getItem(KEYS.CHIP_BALANCE);
    return val ? parseInt(val, 10) : null;
  } catch {
    return null;
  }
}

export interface Settings {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  soundEnabled: true,
  vibrationEnabled: true,
};

export async function saveSettings(settings: Settings): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  } catch {}
}

export async function loadSettings(): Promise<Settings> {
  try {
    const val = await AsyncStorage.getItem(KEYS.SETTINGS);
    return val ? JSON.parse(val) : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}
