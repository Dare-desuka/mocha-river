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
    } catch {}
  }
}

export function initSound() { load(); }

export async function playSound(name: string) {
  if (!useSettingsStore.getState().settings.soundEnabled) return;
  await loaded[name]?.replayAsync();
}
