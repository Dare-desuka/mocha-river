export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;

export interface Card {
  suit: Suit;
  rank: Rank;
}

export type HandRank =
  | 'high_card'
  | 'one_pair'
  | 'two_pair'
  | 'three_of_a_kind'
  | 'straight'
  | 'flush'
  | 'full_house'
  | 'four_of_a_kind'
  | 'straight_flush'
  | 'royal_flush';

export interface HandEvaluation {
  rank: HandRank;
  score: number;
  kickers: number[];
  bestFive: Card[];
}

export type ActionType = 'fold' | 'check' | 'call' | 'raise' | 'all_in';
export type BotDifficulty = 'easy' | 'medium' | 'hard';

export interface BotAction {
  playerIndex: number;
  text: string;
}

export interface PlayerAction {
  type: ActionType;
  amount: number;
  playerIndex: number;
}

export type Phase = 'idle' | 'preflop' | 'flop' | 'turn' | 'river' | 'showdown';

export interface Player {
  index: number;
  name: string;
  chips: number;
  holeCards: Card[];
  currentBet: number;
  totalBet: number;
  folded: boolean;
  isAllIn: boolean;
  isBot: boolean;
}

export interface PotAward {
  amount: number;
  winnerIndexes: number[];
}

export interface GameState {
  players: Player[];
  deck: Card[];
  communityCards: Card[];
  pot: number;
  currentBet: number;
  currentPlayerIndex: number;
  dealerIndex: number;
  smallBlindIndex: number;
  bigBlindIndex: number;
  phase: Phase;
  winner: Player | null;
  winners: Player[];
  winningHand: HandEvaluation | null;
  potAwards: PotAward[];
  actionLog: string[];
  isPlayerTurn: boolean;
  botActionMessage: BotAction | null;
  minRaise: number;
  lastRaiserIndex: number;
  roundActionsSinceLastRaise: number;
  handCount: number;
  difficulty: BotDifficulty;
}

export const HAND_RANK_VALUES: Record<HandRank, number> = {
  high_card: 1,
  one_pair: 2,
  two_pair: 3,
  three_of_a_kind: 4,
  straight: 5,
  flush: 6,
  full_house: 7,
  four_of_a_kind: 8,
  straight_flush: 9,
  royal_flush: 10,
};

export const RANK_NAMES: Record<Rank, string> = {
  2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8',
  9: '9', 10: '10', 11: 'J', 12: 'Q', 13: 'K', 14: 'A',
};

export const SUIT_SYMBOLS: Record<Suit, string> = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
};

export const SUIT_COLORS: Record<Suit, string> = {
  hearts: '#d20f39',
  diamonds: '#d20f39',
  clubs: '#11111b',
  spades: '#11111b',
};

export const BLIND_AMOUNTS = {
  small: 10,
  big: 20,
};

export const STARTING_CHIPS = 1000;
