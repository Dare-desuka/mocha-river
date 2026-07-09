import { GameState, Player, Card, Phase, ActionType, BLIND_AMOUNTS, BLIND_LEVELS, BLIND_INTERVAL, STARTING_CHIPS, HandEvaluation, PotAward } from './types';
import { getDeck, shuffleDeck, dealCards } from './deck';
import { evaluateBestHand, compareHands, getHandNameTranslated } from './handEvaluator';
import { makeBotDecision } from './botAI';
import { useSettingsStore } from '../store/settingsStore';
import { t } from '../utils/i18n';

const getLang = () => useSettingsStore.getState().settings.language;

function getNextActivePlayer(players: Player[], startIndex: number): number {
  const count = players.length;
  for (let i = 0; i < count; i++) {
    const idx = (startIndex + i) % count;
    if (!players[idx].folded && !players[idx].isAllIn) return idx;
  }
  for (let i = 0; i < count; i++) {
    if (!players[i].folded) return i;
  }
  return startIndex;
}

function dealCommunityCards(deck: Card[], phase: Phase, currentCommunity: Card[]): { community: Card[]; remaining: Card[] } {
  const dealCount = phase === 'flop' ? 3 : (phase === 'turn' || phase === 'river') ? 1 : 0;
  if (dealCount === 0) return { community: currentCommunity, remaining: deck };
  const { dealt, remaining } = dealCards(deck, dealCount);
  return { community: [...currentCommunity, ...dealt], remaining };
}

function createPlayer(index: number, name: string, isBot: boolean, chips: number): Player {
  return {
    index,
    name,
    chips,
    holeCards: [],
    currentBet: 0,
    totalBet: 0,
    folded: false,
    isAllIn: chips <= 0,
    isBot,
  };
}

export function createInitialState(): GameState {
  return {
    players: [
      createPlayer(0, 'You', false, STARTING_CHIPS),
      createPlayer(1, 'Bot A', true, STARTING_CHIPS),
      createPlayer(2, 'Bot B', true, STARTING_CHIPS),
      createPlayer(3, 'Bot C', true, STARTING_CHIPS),
    ],
    deck: [],
    communityCards: [],
    pot: 0,
    currentBet: 0,
    currentPlayerIndex: 0,
    dealerIndex: -1,
    smallBlindIndex: 0,
    bigBlindIndex: 1,
    phase: 'idle',
    winner: null,
    winners: [],
    winningHand: null,
    potAwards: [],
    actionLog: [],
    isPlayerTurn: false,
    minRaise: BLIND_AMOUNTS.big,
    lastRaiserIndex: -1,
    roundActionsSinceLastRaise: 0,
    handCount: 0,
    blindLevel: 0,
    botActions: {},
    difficulty: 'medium',
  };
}

function canAct(player: Player): boolean {
  return !player.folded && !player.isAllIn && player.chips > 0;
}

function getNextPlayerIndex(players: Player[], currentIndex: number): number {
  let next = (currentIndex + 1) % players.length;
  for (let i = 0; i < players.length; i++) {
    const p = players[next];
    if (canAct(p)) return next;
    next = (next + 1) % players.length;
  }
  return currentIndex;
}

function getActiveCount(players: Player[]): number {
  return players.filter(canAct).length;
}

function getContenderCount(players: Player[]): number {
  return players.filter(p => !p.folded).length;
}

function isRoundComplete(state: GameState): boolean {
  const activePlayers = state.players.filter(canAct);
  if (activePlayers.length <= 1) return true;
  for (const p of activePlayers) {
    if (p.currentBet < state.currentBet) return false;
  }
  if (state.roundActionsSinceLastRaise >= activePlayers.length) return true;
  return false;
}

function resetBettingRound(state: GameState): GameState {
  const newState = { ...state, players: state.players.map(p => ({ ...p, currentBet: 0 })) };
  newState.currentBet = 0;
  newState.lastRaiserIndex = -1;
  newState.roundActionsSinceLastRaise = 0;
  return newState;
}

export function startNewHand(state: GameState): GameState {
  const newState = { ...state };
  const playerCount = newState.players.length;

  newState.players = newState.players.map((p, i) =>
    createPlayer(i, p.name, p.isBot, p.chips)
  );

  // Advance blind level every BLIND_INTERVAL hands
  if (newState.handCount > 0 && newState.handCount % BLIND_INTERVAL === 0) {
    newState.blindLevel = Math.min(newState.blindLevel + 1, BLIND_LEVELS.length - 1);
  }

  newState.dealerIndex = (newState.dealerIndex + 1) % playerCount;
  newState.handCount += 1;

  const sbIdx = (newState.dealerIndex + 1) % playerCount;
  const bbIdx = (newState.dealerIndex + 2) % playerCount;
  newState.smallBlindIndex = sbIdx;
  newState.bigBlindIndex = bbIdx;

  const level = BLIND_LEVELS[newState.blindLevel] || BLIND_LEVELS[BLIND_LEVELS.length - 1];
  const smallBlind = Math.min(level.small, newState.players[sbIdx].chips);
  const bigBlind = Math.min(level.big, newState.players[bbIdx].chips);
  newState.players[sbIdx].chips -= smallBlind;
  newState.players[sbIdx].currentBet = smallBlind;
  newState.players[sbIdx].totalBet = smallBlind;
  newState.players[sbIdx].isAllIn = newState.players[sbIdx].chips === 0;
  newState.players[bbIdx].chips -= bigBlind;
  newState.players[bbIdx].currentBet = bigBlind;
  newState.players[bbIdx].totalBet = bigBlind;
  newState.players[bbIdx].isAllIn = newState.players[bbIdx].chips === 0;

  newState.pot = smallBlind + bigBlind;
  newState.currentBet = bigBlind;
  newState.minRaise = bigBlind;
  newState.lastRaiserIndex = bbIdx;
  newState.roundActionsSinceLastRaise = 1;

  let deck = shuffleDeck(getDeck());
  for (let i = 0; i < playerCount; i++) {
    const { dealt, remaining } = dealCards(deck, 2);
    newState.players[i].holeCards = dealt;
    deck = remaining;
  }
  newState.deck = deck;
  newState.communityCards = [];
  newState.phase = 'preflop';
  newState.winner = null;
  newState.winners = [];
  newState.winningHand = null;
  newState.potAwards = [];
  newState.actionLog = [
    t('action.handStart', getLang()).replace('{n}', String(newState.handCount)),
    t('action.postSB', getLang()).replace('{player}', newState.players[sbIdx].name).replace('{amount}', String(smallBlind)),
    t('action.postBB', getLang()).replace('{player}', newState.players[bbIdx].name).replace('{amount}', String(bigBlind)),
  ];

  const firstPlayerIdx = (bbIdx + 1) % playerCount;
  newState.currentPlayerIndex = getNextActivePlayer(newState.players, firstPlayerIdx);
  newState.isPlayerTurn = !newState.players[newState.currentPlayerIndex].isBot;

  return newState;
}

function advancePhase(state: GameState): GameState {
  let newState = resetBettingRound(state);
  const currentLevel = BLIND_LEVELS[newState.blindLevel] || BLIND_LEVELS[BLIND_LEVELS.length - 1];
  newState.minRaise = currentLevel.big;

  if (newState.phase === 'preflop') {
    newState.phase = 'flop';
    const { community, remaining } = dealCommunityCards(newState.deck, 'flop', newState.communityCards);
    newState.communityCards = community;
    newState.deck = remaining;
    newState.actionLog = [...newState.actionLog, t('action.flop', getLang())];
  } else if (newState.phase === 'flop') {
    newState.phase = 'turn';
    const { community, remaining } = dealCommunityCards(newState.deck, 'turn', newState.communityCards);
    newState.communityCards = community;
    newState.deck = remaining;
    newState.actionLog = [...newState.actionLog, t('action.turn', getLang())];
  } else if (newState.phase === 'turn') {
    newState.phase = 'river';
    const { community, remaining } = dealCommunityCards(newState.deck, 'river', newState.communityCards);
    newState.communityCards = community;
    newState.deck = remaining;
    newState.actionLog = [...newState.actionLog, t('action.river', getLang())];
  } else {
    newState.phase = 'showdown';
    return doShowdown(newState);
  }

  if (getActiveCount(newState.players) <= 1 && getContenderCount(newState.players) > 1) {
    return advancePhase(newState);
  }

  let startIdx = (newState.dealerIndex + 1) % newState.players.length;
  newState.currentPlayerIndex = getNextActivePlayer(newState.players, startIdx);
  newState.isPlayerTurn = !newState.players[newState.currentPlayerIndex].isBot;
  return newState;
}

function getBestHand(player: Player, communityCards: Card[]): HandEvaluation | null {
  try {
    return evaluateBestHand([...player.holeCards, ...communityCards]);
  } catch {
    return null;
  }
}

function getBestPlayers(players: Player[], communityCards: Card[]): { winners: Player[]; hand: HandEvaluation | null } {
  let bestHand: HandEvaluation | null = null;
  let winners: Player[] = [];

  for (const player of players) {
    const hand = getBestHand(player, communityCards);
    if (!hand) continue;

    if (!bestHand || compareHands(hand, bestHand) > 0) {
      bestHand = hand;
      winners = [player];
    } else if (compareHands(hand, bestHand) === 0) {
      winners.push(player);
    }
  }

  return { winners, hand: bestHand };
}

function buildSidePots(players: Player[]): Array<{ amount: number; contenders: Player[] }> {
  const levels = Array.from(new Set(players.map(p => p.totalBet).filter(v => v > 0))).sort((a, b) => a - b);
  const pots: Array<{ amount: number; contenders: Player[] }> = [];
  let previous = 0;

  for (const level of levels) {
    const contributors = players.filter(p => p.totalBet >= level);
    const contenders = contributors.filter(p => !p.folded);
    const amount = (level - previous) * contributors.length;
    if (amount > 0 && contenders.length > 0) {
      pots.push({ amount, contenders });
    }
    previous = level;
  }

  return pots;
}

function applyPotAwards(state: GameState): GameState {
  const newState = { ...state, players: state.players.map(p => ({ ...p })), phase: 'showdown' as Phase };
  const sidePots = buildSidePots(newState.players);
  const awards: PotAward[] = [];
  const allWinners = new Map<number, Player>();
  let overallBestHand: HandEvaluation | null = null;

  for (const pot of sidePots) {
    const { winners, hand } = getBestPlayers(pot.contenders, newState.communityCards);
    if (winners.length === 0) continue;

    if (hand && (!overallBestHand || compareHands(hand, overallBestHand) > 0)) {
      overallBestHand = hand;
    }

    const share = Math.floor(pot.amount / winners.length);
    const remainder = pot.amount % winners.length;
    winners.sort((a, b) => ((a.index - state.dealerIndex + 4) % 4) - ((b.index - state.dealerIndex + 4) % 4));
    winners.forEach((winner, i) => {
      const payout = share + (i < remainder ? 1 : 0);
      newState.players[winner.index].chips += payout;
      allWinners.set(winner.index, newState.players[winner.index]);
    });
    awards.push({ amount: pot.amount, winnerIndexes: winners.map(w => w.index) });
  }

  const winners = Array.from(allWinners.values());
  const winnerNames = winners.map(p => p.name).join(', ');
  const handName = overallBestHand ? getHandNameTranslated(overallBestHand) : 'unknown hand';
  newState.winner = winners[0] ?? null;
  newState.winners = winners;
  newState.winningHand = overallBestHand;
  newState.potAwards = awards;
  newState.actionLog = [...newState.actionLog, winners.length > 1
    ? t('action.split', getLang()).replace('{winners}', winnerNames).replace('{hand}', handName)
    : t('action.wins', getLang()).replace('{winner}', winnerNames || 'No winner').replace('{hand}', handName)
  ];
  newState.pot = 0;
  newState.isPlayerTurn = false;
  return newState;
}

function doShowdown(state: GameState): GameState {
  return applyPotAwards(state);
}

function awardPotToLastMan(state: GameState): GameState {
  const active = state.players.filter(p => !p.folded);
  if (active.length === 1) {
    const newState = { ...state, players: state.players.map(p => ({ ...p })), phase: 'showdown' as Phase };
    const winner = active[0];
    const payout = newState.pot;
    newState.winningHand = null;
    newState.potAwards = payout > 0 ? [{ amount: payout, winnerIndexes: [winner.index] }] : [];
    newState.actionLog = [...newState.actionLog, t('action.winsFold', getLang()).replace('{winner}', winner.name)];
    newState.players = newState.players.map(p =>
      p.index === winner.index ? { ...p, chips: p.chips + newState.pot } : p
    );
    newState.winner = newState.players[winner.index];
    newState.winners = [newState.players[winner.index]];
    newState.pot = 0;
    newState.isPlayerTurn = false;
    return newState;
  }
  return state;
}

export function handleAction(state: GameState, actionType: ActionType, raiseAmount?: number): GameState {
  if (state.phase === 'showdown' || state.phase === 'idle') return state;

  let newState = { ...state, players: state.players.map(p => ({ ...p })) };
  const player = newState.players[newState.currentPlayerIndex];

  if (!canAct(player)) return state;

  const callAmount = Math.min(Math.max(newState.currentBet - player.currentBet, 0), player.chips);

  switch (actionType) {
    case 'fold': {
      player.folded = true;
      newState.actionLog = [...newState.actionLog, t('action.folds', getLang()).replace('{player}', player.name)];
      newState.roundActionsSinceLastRaise += 1;
      const afterFold = awardPotToLastMan(newState);
      if (afterFold.phase === 'showdown') return afterFold;
      break;
    }
    case 'check': {
      if (player.currentBet < newState.currentBet) return state;
      newState.actionLog = [...newState.actionLog, t('action.checks', getLang()).replace('{player}', player.name)];
      newState.roundActionsSinceLastRaise += 1;
      break;
    }
    case 'call': {
      player.chips -= callAmount;
      player.currentBet += callAmount;
      player.totalBet += callAmount;
      newState.pot += callAmount;
      if (player.chips === 0) player.isAllIn = true;
      newState.actionLog = [...newState.actionLog, t('action.calls', getLang()).replace('{player}', player.name).replace('{amount}', String(callAmount))];
      newState.roundActionsSinceLastRaise += 1;
      break;
    }
    case 'raise': {
      const requestedRaise = Math.floor(raiseAmount ?? newState.minRaise);
      if (requestedRaise < newState.minRaise) return state;
      const callCost = Math.max(0, newState.currentBet - player.currentBet);
      const totalCost = Math.min(callCost + requestedRaise, player.chips);
      if (totalCost <= callAmount) return state;
      const raiseIncrement = totalCost - callCost;
      const isShortAllIn = totalCost === player.chips && raiseIncrement < newState.minRaise;
      if (!isShortAllIn && raiseIncrement < newState.minRaise) return state;
      player.chips -= totalCost;
      player.currentBet += totalCost;
      player.totalBet += totalCost;
      newState.pot += totalCost;
      if (!isShortAllIn) {
        newState.currentBet = player.currentBet;
        newState.lastRaiserIndex = player.index;
        newState.roundActionsSinceLastRaise = 1;
        newState.minRaise = Math.max(newState.minRaise, player.currentBet - state.currentBet);
      } else {
        newState.roundActionsSinceLastRaise += 1;
      }
      if (player.chips === 0) player.isAllIn = true;
      newState.actionLog = [...newState.actionLog, player.isAllIn
        ? t('action.raisesAllIn', getLang()).replace('{player}', player.name).replace('{amount}', String(player.currentBet))
        : t('action.raises', getLang()).replace('{player}', player.name).replace('{amount}', String(player.currentBet))
      ];
      break;
    }
    case 'all_in': {
      const allInAmount = player.chips;
      player.currentBet += allInAmount;
      player.totalBet += allInAmount;
      newState.pot += allInAmount;
      if (player.currentBet > newState.currentBet) {
        const raiseSize = player.currentBet - newState.currentBet;
        newState.currentBet = player.currentBet;
        if (raiseSize >= newState.minRaise) {
          newState.lastRaiserIndex = player.index;
          newState.roundActionsSinceLastRaise = 1;
          newState.minRaise = raiseSize;
        } else {
          newState.roundActionsSinceLastRaise += 1;
        }
      } else {
        newState.roundActionsSinceLastRaise += 1;
      }
      player.chips = 0;
      player.isAllIn = true;
      newState.actionLog = [...newState.actionLog, t('action.goesAllIn', getLang()).replace('{player}', player.name).replace('{amount}', String(allInAmount))];
      break;
    }
  }

  if (getContenderCount(newState.players) <= 1) {
    return awardPotToLastMan(newState);
  }

  if (isRoundComplete(newState)) {
    return advancePhase(newState);
  }

  newState.currentPlayerIndex = getNextPlayerIndex(newState.players, newState.currentPlayerIndex);
  newState.isPlayerTurn = !newState.players[newState.currentPlayerIndex].isBot;
  return newState;
}

function formatBotActionText(state: GameState, player: Player, actionType: ActionType, amount: number): string {
  const l = getLang();
  switch (actionType) {
    case 'fold': return t('bot.fold', l);
    case 'check': return t('bot.check', l);
    case 'call': return t('bot.call', l).replace('{amount}', String(amount));
    case 'raise': return t('bot.raise', l).replace('{amount}', String(amount));
    case 'all_in': return t('bot.allIn', l).replace('{amount}', String(amount));
  }
}

export function processOneBotAction(state: GameState): GameState {
  if (state.phase === 'showdown' || state.phase === 'idle' || state.isPlayerTurn) return state;

  const player = state.players[state.currentPlayerIndex];
  if (!player.isBot || player.folded || player.isAllIn) return state;

  const decision = makeBotDecision(
    player,
    state.communityCards,
    state.currentBet,
    state.pot,
    state.minRaise,
    state.dealerIndex,
    state.players.length,
    state.difficulty,
  );

  const nextState = handleAction(state, decision.type, decision.amount);
  if (nextState === state) {
    const fallback: ActionType = state.currentBet > player.currentBet ? 'call' : 'check';
    const fallbackState = handleAction(state, fallback);
    return {
      ...fallbackState,
      botActions: { ...state.botActions, [player.index]: formatBotActionText(fallbackState, player, fallback, state.currentBet - player.currentBet) },
    };
  }

  return {
    ...nextState,
    botActions: { ...state.botActions, [player.index]: formatBotActionText(nextState, player, decision.type, decision.amount) },
  };
}
