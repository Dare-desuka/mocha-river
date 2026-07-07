import { Audio } from 'expo-av';
import { useSettingsStore } from '../store/settingsStore';

const soundFiles = {
  deal: require('../../assets/sounds/deal.wav'),
  chip: require('../../assets/sounds/chip.wav'),
  win: require('../../assets/sounds/win.wav'),
  turn: require('../../assets/sounds/turn.wav'),
};

let loaded: Record<string, Audio.Sound> = {};

async function load() {
  for (const [key, source] of Object.entries(soundFiles)) {
    try {
      const { sound } = await Audio.Sound.createAsync(source, { shouldPlay: false });
      loaded[key] = sound;
    } catch (e) {
      console.warn('Sound load failed:', key, e);
    }
  }
}

export async function initSound() {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
    await load();
  } catch (e) {
    console.warn('Sound init failed:', e);
  }
}

export async function playSound(name: string) {
  if (!useSettingsStore.getState().settings.soundEnabled) return;
  const s = loaded[name];
  if (!s) { console.warn('Sound not loaded:', name); return; }
  try { await s.replayAsync(); } catch (e) { console.warn('Sound play failed:', e); }
}
