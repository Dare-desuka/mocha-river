import { create } from 'zustand';
import { GameState, ActionType, STARTING_CHIPS } from '../game/types';
import { createInitialState, startNewHand, handleAction, processBotActions } from '../game/gameEngine';
import { saveChipBalance, loadChipBalance } from '../utils/storage';
import { vibrate } from '../utils/haptics';
import { playSound } from '../utils/soundManager';

interface GameStore extends GameState {
  initGame: () => void;
  startHand: () => void;
  playerAction: (action: ActionType, amount?: number) => void;
  nextHand: () => void;
  resetChips: () => Promise<void>;
}

export const useGameStore = create<GameStore>((set, get) => {
  const processBotRound = () => {
    const current = get();
    const processed = processBotActions(current);
    set({ ...processed });
    if (processed.isPlayerTurn) {
      vibrate(50);
      playSound('turn');
    }
    if (processed.winner && processed.phase === 'showdown') {
      playSound('win');
      vibrate([0, 100, 50, 100, 50, 150]);
      saveChipBalance(
        processed.players.find(p => !p.isBot)?.chips || 0
      );
    }
  };

  return {
    ...createInitialState(),

    initGame: async () => {
      const state = createInitialState();
      const savedChips = await loadChipBalance();
      if (savedChips && savedChips > 0) {
        state.players = state.players.map((p, i) =>
          i === 0 ? { ...p, chips: savedChips } : p
        );
      }
      set(state);
    },

    startHand: () => {
      const state = get();
      const newState = startNewHand(state);
      set({ ...newState });
      playSound('deal');

      if (newState.isPlayerTurn) {
        vibrate(50);
        playSound('turn');
      }

      if (!newState.isPlayerTurn && newState.phase !== 'showdown') {
        setTimeout(processBotRound, 500);
      }
    },

    playerAction: (action: ActionType, amount?: number) => {
      const state = get();
      if (!state.isPlayerTurn) return;

      const newState = handleAction(state, action, amount);
      set({ ...newState });

      vibrate(30);
      playSound('chip');

      if (!newState.isPlayerTurn && newState.phase !== 'showdown' && newState.phase !== 'idle') {
        setTimeout(processBotRound, 500);
      }

      if (newState.phase === 'showdown' && newState.winner) {
        playSound('win');
        vibrate([0, 100, 50, 100, 50, 150]);
        saveChipBalance(
          newState.players.find(p => !p.isBot)?.chips || 0
        );
      }
    },

    nextHand: () => {
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
      await saveChipBalance(STARTING_CHIPS);
      const state = createInitialState();
      set(state);
    },
  };
});
