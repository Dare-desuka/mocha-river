import { createInitialState, handleAction, startNewHand } from '../game/gameEngine';
import { Card, GameState, Rank, Suit } from '../game/types';

function c(rank: Rank, suit: Suit): Card {
  return { rank, suit };
}

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`FAIL: ${message}`);
  }
  console.log('PASS:', message);
}

function showdownState(): GameState {
  const state = createInitialState();
  return {
    ...state,
    phase: 'river',
    communityCards: [
      c(2, 'hearts'),
      c(3, 'diamonds'),
      c(4, 'clubs'),
      c(9, 'spades'),
      c(13, 'diamonds'),
    ],
    currentPlayerIndex: 0,
    isPlayerTurn: true,
    currentBet: 0,
    roundActionsSinceLastRaise: 1,
    players: state.players.map(p => ({
      ...p,
      chips: 1000,
      currentBet: 0,
      totalBet: 0,
      folded: true,
      isAllIn: false,
      holeCards: [c(7, 'clubs'), c(8, 'clubs')],
    })),
  };
}

console.log('\n=== Game Engine ===\n');

{
  const state = startNewHand(createInitialState());
  assert(state.dealerIndex === 0, 'first hand dealer starts at player 0');
  assert(state.smallBlindIndex === 1, 'small blind is left of dealer');
  assert(state.bigBlindIndex === 2, 'big blind is left of small blind');
  assert(state.currentPlayerIndex === 3, 'preflop starts left of big blind');
}

{
  const state = startNewHand(createInitialState());
  const raised = handleAction(state, 'raise', 40);
  assert(raised.players[3].currentBet === 60, 'raise amount is added after call cost');
  assert(raised.players[3].totalBet === 60, 'raise records total contribution');
  assert(raised.pot === 90, 'pot includes blinds, call cost, and raise');
  assert(raised.currentBet === 60, 'current bet moves to raised total');
}

{
  const state = showdownState();
  state.players[0] = {
    ...state.players[0],
    chips: 950,
    totalBet: 50,
    folded: false,
    holeCards: [c(14, 'spades'), c(5, 'spades')],
  };
  state.players[1] = {
    ...state.players[1],
    chips: 950,
    totalBet: 50,
    folded: false,
    holeCards: [c(14, 'hearts'), c(5, 'hearts')],
  };
  state.pot = 100;

  const result = handleAction(state, 'check');
  assert(result.phase === 'showdown', 'river check advances to showdown');
  assert(result.winners.length === 2, 'tied best hands produce two winners');
  assert(result.players[0].chips === 1000, 'split pot pays first tied player');
  assert(result.players[1].chips === 1000, 'split pot pays second tied player');
}

{
  const state = showdownState();
  state.roundActionsSinceLastRaise = 2;
  state.players[0] = {
    ...state.players[0],
    chips: 900,
    totalBet: 100,
    folded: false,
    holeCards: [c(14, 'spades'), c(5, 'spades')],
  };
  state.players[1] = {
    ...state.players[1],
    chips: 900,
    totalBet: 100,
    folded: false,
    holeCards: [c(14, 'hearts'), c(5, 'hearts')],
  };
  state.players[2] = {
    ...state.players[2],
    chips: 700,
    totalBet: 300,
    folded: false,
    holeCards: [c(13, 'clubs'), c(13, 'spades')],
  };
  state.pot = 500;

  const result = handleAction(state, 'check');
  assert(result.phase === 'showdown', 'side pot scenario reaches showdown');
  assert(result.players[0].chips === 1050, 'main pot split pays player 0');
  assert(result.players[1].chips === 1050, 'main pot split pays player 1');
  assert(result.players[2].chips === 900, 'side pot pays only eligible player');
  assert(result.potAwards.length === 2, 'main pot and side pot are recorded separately');
}

console.log('\nAll game engine tests passed.\n');
