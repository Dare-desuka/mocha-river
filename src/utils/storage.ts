import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ProfileData {
  name: string;
  avatarUri: string | null;
}

export interface Stats {
  totalHands: number;
  handsWon: number;
  biggestWin: number;
  biggestWinDate: number | null;
}

const KEYS = {
  CHIP_BALANCE: 'poker_chip_balance',
  SETTINGS: 'poker_settings',
  STATS: 'poker_stats',
  PROFILE: 'poker_profile',
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
  botDifficulty: 'easy' | 'medium' | 'hard';
  tableTheme: string;
  cardBack: 'classic' | 'diamond' | 'royal';
  soundPack: 'classic' | 'arcade' | 'muted';
  language: 'en' | 'id';
}

const DEFAULT_SETTINGS: Settings = {
  soundEnabled: true,
  vibrationEnabled: true,
  botDifficulty: 'medium',
  tableTheme: 'classic',
  cardBack: 'classic',
  soundPack: 'classic',
  language: 'en',
};

export async function saveSettings(settings: Settings): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  } catch {}
}

export async function loadSettings(): Promise<Settings> {
  try {
    const val = await AsyncStorage.getItem(KEYS.SETTINGS);
    if (!val) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(val);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveStats(stats: Stats): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.STATS, JSON.stringify(stats));
  } catch {}
}

export async function saveProfile(data: ProfileData): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.PROFILE, JSON.stringify(data));
  } catch {}
}

export async function loadProfile(): Promise<ProfileData> {
  try {
    const val = await AsyncStorage.getItem(KEYS.PROFILE);
    return val ? JSON.parse(val) : { name: 'Ace Vancura', avatarUri: null };
  } catch {
    return { name: 'Ace Vancura', avatarUri: null };
  }
}

export async function loadStats(): Promise<Stats> {
  try {
    const val = await AsyncStorage.getItem(KEYS.STATS);
    return val ? JSON.parse(val) : { totalHands: 0, handsWon: 0, biggestWin: 0, biggestWinDate: null };
  } catch {
    return { totalHands: 0, handsWon: 0, biggestWin: 0, biggestWinDate: null };
  }
}
