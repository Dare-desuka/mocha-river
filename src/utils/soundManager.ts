import { Audio } from 'expo-av';
import { useSettingsStore } from '../store/settingsStore';

const soundFiles: Record<string, Record<string, any>> = {
  classic: {
    deal: require('../../assets/sounds/classic/deal.wav'),
    chip: require('../../assets/sounds/classic/chip.wav'),
    win: require('../../assets/sounds/classic/win.wav'),
    turn: require('../../assets/sounds/classic/turn.wav'),
    fold: require('../../assets/sounds/classic/fold.wav'),
    check: require('../../assets/sounds/classic/check.wav'),
    call: require('../../assets/sounds/classic/call.wav'),
    raise: require('../../assets/sounds/classic/raise.wav'),
    all_in: require('../../assets/sounds/classic/all_in.wav'),
  },
  arcade: {
    deal: require('../../assets/sounds/arcade/deal.wav'),
    chip: require('../../assets/sounds/arcade/chip.wav'),
    win: require('../../assets/sounds/arcade/win.wav'),
    turn: require('../../assets/sounds/arcade/turn.wav'),
    fold: require('../../assets/sounds/arcade/fold.wav'),
    check: require('../../assets/sounds/arcade/check.wav'),
    call: require('../../assets/sounds/arcade/call.wav'),
    raise: require('../../assets/sounds/arcade/raise.wav'),
    all_in: require('../../assets/sounds/arcade/all_in.wav'),
  },
  muted: {
    deal: require('../../assets/sounds/muted/deal.wav'),
    chip: require('../../assets/sounds/muted/chip.wav'),
    win: require('../../assets/sounds/muted/win.wav'),
    turn: require('../../assets/sounds/muted/turn.wav'),
    fold: require('../../assets/sounds/muted/fold.wav'),
    check: require('../../assets/sounds/muted/check.wav'),
    call: require('../../assets/sounds/muted/call.wav'),
    raise: require('../../assets/sounds/muted/raise.wav'),
    all_in: require('../../assets/sounds/muted/all_in.wav'),
  },
};

let loaded: Record<string, Audio.Sound> = {};
let currentPack: string | null = null;

async function loadPack(pack: string) {
  if (currentPack === pack && Object.keys(loaded).length > 0) return;
  await unload();
  const files = soundFiles[pack];
  if (!files) return;
  for (const [key, source] of Object.entries(files)) {
    try {
      const { sound } = await Audio.Sound.createAsync(source, { shouldPlay: false });
      loaded[key] = sound;
    } catch (e) {
      console.warn('Sound load failed:', key, e);
    }
  }
  currentPack = pack;
}

async function unload() {
  for (const s of Object.values(loaded)) {
    try { await s.unloadAsync(); } catch {}
  }
  loaded = {};
  currentPack = null;
}

export async function initSound() {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
  } catch (e) {
    console.warn('Sound init failed:', e);
  }
}

export async function ensureSoundPack() {
  const pack = useSettingsStore.getState().settings.soundPack || 'classic';
  await loadPack(pack);
}

export async function playSound(name: string) {
  if (!useSettingsStore.getState().settings.soundEnabled) return;
  await ensureSoundPack();
  const s = loaded[name];
  if (!s) { console.warn('Sound not loaded:', name); return; }
  try { await s.replayAsync(); } catch (e) { console.warn('Sound play failed:', e); }
}
