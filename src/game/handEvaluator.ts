import { Card, Rank, HandRank, HandEvaluation, HAND_RANK_VALUES, SUIT_SYMBOLS, RANK_NAMES } from './types';

function sortByRank(cards: Card[]): Card[] {
  return [...cards].sort((a, b) => b.rank - a.rank);
}

function getRankCounts(cards: Card[]): Map<Rank, number> {
  const counts = new Map<Rank, number>();
  for (const c of cards) {
    counts.set(c.rank, (counts.get(c.rank) || 0) + 1);
  }
  return counts;
}

function isFlush(cards: Card[]): boolean {
  return cards.every(c => c.suit === cards[0].suit);
}

function getStraightHigh(cards: Card[]): Rank | null {
  const sorted = [...new Set(cards.map(c => c.rank))].sort((a, b) => b - a);
  for (let i = 0; i <= sorted.length - 5; i++) {
    if (sorted[i] - sorted[i + 4] === 4) {
      return sorted[i];
    }
  }
  // A-2-3-4-5 (wheel)
  if (sorted.includes(14) && sorted.includes(2) && sorted.includes(3) && sorted.includes(4) && sorted.includes(5)) {
    return 5;
  }
  return null;
}

function combinations<T>(arr: T[], k: number): T[][] {
  if (k === 0) return [[]];
  if (arr.length < k) return [];
  const [first, ...rest] = arr;
  const withFirst = combinations(rest, k - 1).map(c => [first, ...c]);
  const withoutFirst = combinations(rest, k);
  return [...withFirst, ...withoutFirst];
}

function padKickers(kickers: number[], length: number): number[] {
  const result = [...kickers];
  while (result.length < length) result.push(0);
  return result.slice(0, length);
}

function computeScore(baseValue: number, kickers: number[]): number {
  const padded = padKickers(kickers, 5);
  let score = baseValue;
  for (const v of padded) {
    score = score * 100 + v;
  }
  return score;
}

function evaluateFiveCards(cards: Card[]): HandEvaluation {
  const sorted = sortByRank(cards);
  const rankCounts = getRankCounts(sorted);
  const counts = Array.from(rankCounts.entries());
  counts.sort((a, b) => b[1] - a[1] || b[0] - a[0]);

  const ranks = counts.map(([r]) => r);
  const groups = counts.map(([, c]) => c);

  const flush = isFlush(sorted);
  const straightHigh = getStraightHigh(sorted);

  const bestFive = sorted.slice(0, 5);

  // Royal Flush
  if (flush && straightHigh === 14) {
    return { rank: 'royal_flush', score: computeScore(10, [14]), kickers: [14], bestFive };
  }

  // Straight Flush
  if (flush && straightHigh !== null) {
    return { rank: 'straight_flush', score: computeScore(9, [straightHigh]), kickers: [straightHigh], bestFive };
  }

  // Four of a Kind
  if (groups[0] === 4) {
    return { rank: 'four_of_a_kind', score: computeScore(8, [ranks[0], ranks[1] || 0]), kickers: [ranks[0], ranks[1] || 0], bestFive: sorted };
  }

  // Full House
  if (groups[0] === 3 && groups[1] === 2) {
    return { rank: 'full_house', score: computeScore(7, [ranks[0], ranks[1]]), kickers: [ranks[0], ranks[1]], bestFive: sorted };
  }

  // Flush
  if (flush) {
    const kickers = sorted.map(c => c.rank);
    return { rank: 'flush', score: computeScore(6, kickers), kickers, bestFive: sorted };
  }

  // Straight
  if (straightHigh !== null) {
    return { rank: 'straight', score: computeScore(5, [straightHigh]), kickers: [straightHigh], bestFive };
  }

  // Three of a Kind
  if (groups[0] === 3) {
    const kickers = [ranks[0], ...ranks.slice(1)];
    return { rank: 'three_of_a_kind', score: computeScore(4, kickers), kickers, bestFive: sorted };
  }

  // Two Pair
  if (groups[0] === 2 && groups[1] === 2) {
    const highPair = Math.max(ranks[0], ranks[1]);
    const lowPair = Math.min(ranks[0], ranks[1]);
    return { rank: 'two_pair', score: computeScore(3, [highPair, lowPair, ranks[2] || 0]), kickers: [highPair, lowPair, ranks[2] || 0], bestFive: sorted };
  }

  // One Pair
  if (groups[0] === 2) {
    const kickers = [ranks[0], ...ranks.slice(1)];
    return { rank: 'one_pair', score: computeScore(2, kickers), kickers, bestFive: sorted };
  }

  // High Card
  {
    const kickers = sorted.map(c => c.rank);
    return { rank: 'high_card', score: computeScore(1, kickers), kickers, bestFive: sorted };
  }
}

export function evaluateBestHand(cards: Card[]): HandEvaluation {
  if (cards.length < 5) {
    throw new Error('Need at least 5 cards to evaluate');
  }
  if (cards.length === 5) {
    return evaluateFiveCards(cards);
  }
  const combos = combinations(cards, 5);
  let best: HandEvaluation | null = null;
  for (const combo of combos) {
    const evalHand = evaluateFiveCards(combo);
    if (!best || evalHand.score > best.score) {
      best = evalHand;
    }
  }
  return best!;
}

export function compareHands(a: HandEvaluation, b: HandEvaluation): number {
  if (a.score !== b.score) {
    return a.score - b.score;
  }
  return 0;
}

export function getHandName(hand: HandEvaluation): string {
  const names: Record<HandRank, string> = {
    high_card: 'High Card',
    one_pair: 'One Pair',
    two_pair: 'Two Pair',
    three_of_a_kind: 'Three of a Kind',
    straight: 'Straight',
    flush: 'Flush',
    full_house: 'Full House',
    four_of_a_kind: 'Four of a Kind',
    straight_flush: 'Straight Flush',
    royal_flush: 'Royal Flush',
  };
  return names[hand.rank];
}

export function handToString(hand: HandEvaluation, cards: Card[]): string {
  const name = getHandName(hand);
  const kickerStr = hand.kickers.filter(k => k > 0).map(k => RANK_NAMES[k as Rank] || `${k}`).join(', ');
  if (hand.rank === 'high_card') {
    return `${name} (${kickerStr})`;
  }
  return name;
}
