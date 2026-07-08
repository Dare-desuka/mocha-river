import { Player, Card, ActionType, BLIND_AMOUNTS, HAND_RANK_VALUES, BotDifficulty } from './types';
import { evaluateBestHand } from './handEvaluator';

interface BotDecision { type: ActionType; amount: number }

type Position = 'early' | 'middle' | 'late' | 'blind';

function getPosition(index: number, dealer: number, count: number): Position {
  const fd = (index - dealer + count) % count;
  if (fd === 0) return 'late';
  if (fd === 1) return 'blind';
  if (fd === count - 1) return 'late';
  if (fd === count - 2) return 'middle';
  return 'early';
}

const POS_AGGR: Record<Position, number> = { early: 0.7, middle: 0.85, late: 1.15, blind: 0.9 };

function handScore(cards: Card[], community: Card[]): number {
  if (community.length < 3) {
    const r = cards.map(c => c.rank).sort((a, b) => b - a);
    if (r[0] === r[1]) return 0.5 + r[0] / 28;
    let s = (r[0] + r[1]) / 28;
    if (cards[0].suit === cards[1].suit) s += 0.08;
    const gap = r[0] - r[1];
    if (gap === 1) s += 0.06;
    else if (gap === 2) s += 0.03;
    if (r[0] >= 12 && r[1] >= 10) s += 0.1;
    return Math.min(s, 1);
  }
  const hand = evaluateBestHand([...cards, ...community]);
  const r = HAND_RANK_VALUES[hand.rank];
  let s = r * 0.1 - 0.1;
  if (r >= 2) s += hand.kickers[0] / 140;
  return Math.max(0, Math.min(1, s));
}

const DIFFICULTY_MULT: Record<BotDifficulty, number> = {
  easy: 0.55,
  medium: 1.0,
  hard: 1.4,
};

export function makeBotDecision(
  player: Player,
  community: Card[],
  currentBet: number,
  pot: number,
  minRaise: number,
  dealerIndex: number,
  playerCount: number,
  difficulty: BotDifficulty = 'medium',
): BotDecision {
  const dm = DIFFICULTY_MULT[difficulty];
  const strength = handScore(player.holeCards, community);
  const position = getPosition(player.index, dealerIndex, playerCount);
  const aggr = POS_AGGR[position] * dm;
  const callAmt = currentBet - player.currentBet;
  const canCheck = currentBet <= player.currentBet;
  const potOdds = callAmt / (pot + callAmt);
  const isPostflop = community.length >= 3;
  const effStack = player.chips;
  const hard = difficulty === 'hard';

  // Easy bot: random misplays
  if (difficulty === 'easy' && Math.random() < 0.15) {
    const actions: ActionType[] = ['call', 'fold', 'check', 'raise'];
    const pick = actions[Math.floor(Math.random() * 4)];
    if (pick === 'fold') return { type: 'fold', amount: 0 };
    if (pick === 'check' && canCheck) return { type: 'check', amount: 0 };
    if (pick === 'call' && callAmt > 0 && callAmt <= effStack) return { type: 'call', amount: callAmt };
    if (pick === 'raise' && effStack > minRaise) return { type: 'raise', amount: Math.round(Math.min(minRaise * 2, effStack)) };
  }

  // Bluff: aggressive with weak hands
  const bluffChance = hard ? 0.3 : (difficulty === 'easy' ? 0.08 : 0.15) * dm;
  if (strength < 0.3 && Math.random() < bluffChance && effStack > minRaise * (hard ? 2 : 3)) {
    const size = hard ? Math.min(pot, effStack) : Math.min(minRaise * 3, effStack);
    return { type: 'raise', amount: Math.round(size) };
  }

  // Hard: pre-flop raise with decent hands
  if (!isPostflop && hard && strength > 0.4 && canCheck && Math.random() < 0.4) {
    return { type: 'raise', amount: Math.round(Math.min(pot * 0.75 * aggr, effStack)) };
  }

  // Strength thresholds
  const strongThresh = hard ? 0.55 : 0.65;
  const mediumThresh = hard ? 0.3 : 0.4;

  // Nut hand: big value bet
  if (strength > 0.92 && isPostflop) {
    const size = Math.round(Math.min(pot * (hard ? 1.0 : 0.75) * aggr, effStack));
    if (canCheck) return { type: 'raise', amount: Math.max(size, minRaise) };
    const raise = Math.round(Math.max(currentBet * (hard ? 4 : 3), size));
    return raise >= effStack ? { type: 'all_in', amount: effStack } : { type: 'raise', amount: Math.round(Math.min(raise, effStack)) };
  }

  // Very strong: raise/re-raise
  if (strength > 0.8) {
    if (canCheck) {
      const size = Math.round(Math.max(pot * (hard ? 0.8 : 0.6) * aggr, minRaise));
      return { type: 'raise', amount: Math.round(Math.min(size, effStack)) };
    }
    if (callAmt >= effStack * 0.4) return { type: 'all_in', amount: effStack };
    const raise = Math.round(Math.max(currentBet * (hard ? 3 : 2.5) * aggr, minRaise));
    return raise >= effStack ? { type: 'all_in', amount: effStack } : { type: 'raise', amount: Math.round(Math.min(raise, effStack)) };
  }

  // Strong: raise or call
  if (strength > strongThresh) {
    if (canCheck) {
      if (Math.random() < (hard ? 0.6 : 0.4) * aggr) {
        return { type: 'raise', amount: Math.round(Math.min(minRaise * (hard ? 3 : 2.5) * aggr, effStack)) };
      }
      return { type: 'check', amount: 0 };
    }
    if (callAmt > effStack * (hard ? 0.4 : 0.3)) return { type: 'call', amount: callAmt };
    if (Math.random() < (hard ? 0.5 : 0.35) * aggr) {
      return { type: 'raise', amount: Math.round(Math.min(Math.max(currentBet * (hard ? 2.5 : 2) * aggr, minRaise), effStack)) };
    }
    return { type: 'call', amount: callAmt };
  }

  // Medium: play if reasonable
  if (strength > mediumThresh) {
    if (canCheck) return { type: 'check', amount: 0 };
    if (hard) {
      if (callAmt <= effStack * 0.35) return { type: 'call', amount: callAmt };
    } else {
      if (potOdds < 0.3 && callAmt <= BLIND_AMOUNTS.big * 2) return { type: 'call', amount: callAmt };
      if (callAmt > effStack * 0.25) return { type: 'fold', amount: 0 };
      if (potOdds < 0.25) return { type: 'call', amount: callAmt };
    }
    return { type: 'fold', amount: 0 };
  }

  // Weak
  if (canCheck) return { type: 'check', amount: 0 };
  if (potOdds < 0.15 && callAmt <= BLIND_AMOUNTS.big) {
    if (Math.random() < 0.2) return { type: 'call', amount: callAmt };
  }
  return { type: 'fold', amount: 0 };
}
