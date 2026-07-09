import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
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

const bgmSource = require('../../assets/sounds/bgm.mp3');

let loaded: Record<string, any> = {};
let currentPack: string | null = null;
let bgmPlayer: any = null;

function loadPack(pack: string) {
  if (currentPack === pack && Object.keys(loaded).length > 0) return;
  unload();
  const files = soundFiles[pack];
  if (!files) return;
  for (const [key, source] of Object.entries(files)) {
    try {
      const p = createAudioPlayer(source);
      loaded[key] = p;
    } catch (e) {
      console.warn('Sound load failed:', key, e);
    }
  }
  currentPack = pack;
}

function unload() {
  for (const p of Object.values(loaded)) {
    try { p.remove(); } catch {}
  }
  loaded = {};
  currentPack = null;
}

export async function initSound() {
  try {
    await setAudioModeAsync({
      playsInSilentMode: true,
    });
    bgmPlayer = createAudioPlayer(bgmSource);
    bgmPlayer.loop = true;
  } catch (e) {
    console.warn('Sound init failed:', e);
  }
}

export function startBgm() {
  if (!bgmPlayer) return;
  const { musicEnabled } = useSettingsStore.getState().settings;
  if (musicEnabled) try { bgmPlayer.play(); } catch {}
}

export function stopBgm() {
  if (!bgmPlayer) return;
  try { bgmPlayer.pause(); } catch {}
}

export function toggleMusic(enable: boolean) {
  if (!bgmPlayer) return;
  try {
    if (enable) bgmPlayer.play();
    else bgmPlayer.pause();
  } catch (e) {
    console.warn('Music toggle failed:', e);
  }
}

export async function ensureSoundPack() {
  const pack = useSettingsStore.getState().settings.soundPack || 'classic';
  loadPack(pack);
}

export async function playSound(name: string) {
  if (!useSettingsStore.getState().settings.soundEnabled) return;
  await ensureSoundPack();
  const p = loaded[name];
  if (!p) { console.warn('Sound not loaded:', name); return; }
  try {
    p.seekTo(0);
    p.play();
  } catch (e) { console.warn('Sound play failed:', e); }
}
