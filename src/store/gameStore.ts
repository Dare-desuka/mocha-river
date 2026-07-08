import { create } from 'zustand';
import { GameState, ActionType, STARTING_CHIPS, BotDifficulty } from '../game/types';
import { createInitialState, startNewHand, handleAction, processOneBotAction } from '../game/gameEngine';
import { saveChipBalance, loadChipBalance, saveStats, loadStats, Stats, loadProfile } from '../utils/storage';
import { vibrate } from '../utils/haptics';
import { playSound } from '../utils/soundManager';

const BOT_DELAY = 1500;

interface GameStore extends GameState {
  initGame: () => void;
  startHand: () => void;
  playerAction: (action: ActionType, amount?: number) => void;
  nextHand: () => void;
  resetChips: () => Promise<void>;
  setDifficulty: (d: BotDifficulty) => void;
}

let botTimer: ReturnType<typeof setTimeout> | null = null;

const cancelTimers = () => {
  if (botTimer) { clearTimeout(botTimer); botTimer = null; }
};

const processNextBot = () => {
  const { getState, setState } = useGameStore;
  const state = getState();
  if (state.phase === 'showdown' || state.phase === 'idle' || state.isPlayerTurn) return;

  const result = processOneBotAction(state);
  setState({ ...result, botActionMessage: result.botActionMessage });

  if (
    !result.isPlayerTurn &&
    result.phase !== 'showdown' &&
    result.phase !== 'idle'
  ) {
    botTimer = setTimeout(processNextBot, BOT_DELAY);
  }

  if (result.isPlayerTurn) {
    vibrate(50);
    playSound('turn');
  }

  if (result.phase === 'showdown' && result.winner) {
    playSound('win');
    vibrate([0, 100, 50, 100, 50, 150]);
    trackWin(result);
  }
};

const trackWin = async (state: GameState) => {
  const player = state.players[0];
  if (!player) return;
  const stats = await loadStats();
  stats.totalHands += 1;
  if (state.winners?.some(w => w.index === 0)) {
    stats.handsWon += 1;
    const winAmount = player.totalBet;
    if (winAmount > stats.biggestWin) {
      stats.biggestWin = winAmount;
      stats.biggestWinDate = Date.now();
    }
  }
  await saveStats(stats);
  saveChipBalance(player.chips);
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...createInitialState(),

  initGame: async () => {
    cancelTimers();
    const state = createInitialState();
    const savedChips = await loadChipBalance();
    if (savedChips && savedChips > 0) {
      state.players = state.players.map((p, i) =>
        i === 0 ? { ...p, chips: savedChips } : p
      );
    }
    const profile = await loadProfile();
    if (profile.name) {
      state.players = state.players.map((p, i) =>
        i === 0 ? { ...p, name: profile.name } : p
      );
    }
    set(state);
  },

  startHand: () => {
    cancelTimers();
    const state = get();
    const newState = startNewHand(state);
    loadProfile().then(p => {
      if (p.name && p.name !== state.players[0]?.name) {
        set(s => ({
          ...s,
          players: s.players.map((pl, i) =>
            i === 0 ? { ...pl, name: p.name } : pl
          ),
        }));
      }
    });
    set({ ...newState, botActionMessage: null });
    playSound('deal');

    if (newState.isPlayerTurn) {
      vibrate(50);
      playSound('turn');
    }

    if (!newState.isPlayerTurn && newState.phase !== 'showdown') {
      botTimer = setTimeout(processNextBot, 800);
    }
  },

  playerAction: (action: ActionType, amount?: number) => {
    const state = get();
    if (!state.isPlayerTurn) return;

    const newState = handleAction(state, action, amount);
    set({ ...newState, botActionMessage: null });

    vibrate(30);
    playSound('chip');

    if (
      !newState.isPlayerTurn &&
      newState.phase !== 'showdown' &&
      newState.phase !== 'idle'
    ) {
      botTimer = setTimeout(processNextBot, 800);
    }

    if (newState.phase === 'showdown' && newState.winner) {
      playSound('win');
      vibrate([0, 100, 50, 100, 50, 150]);
      trackWin(newState);
    }
  },

  nextHand: () => {
    cancelTimers();
    const state = get();
    const newState = createInitialState();
    newState.players = newState.players.map((p, i) => ({
      ...p,
      chips: state.players[i]?.chips || 0,
    }));
    newState.dealerIndex = state.dealerIndex;
    newState.handCount = state.handCount;
    set(newState);
  },

  resetChips: async () => {
    cancelTimers();
    await saveChipBalance(STARTING_CHIPS);
    const state = createInitialState();
    set(state);
  },

  setDifficulty: (d: BotDifficulty) => {
    set(state => ({ ...state, difficulty: d }));
  },
}));
