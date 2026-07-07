import { Card, Rank, Suit } from '../game/types';
import { evaluateBestHand, compareHands } from '../game/handEvaluator';

function c(rank: Rank, suit: Suit): Card {
  return { rank, suit };
}

const h: Suit = 'hearts';
const d: Suit = 'diamonds';
const cS: Suit = 'clubs';
const s: Suit = 'spades';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`FAIL: ${message}`);
  } else {
    console.log('PASS:', message);
  }
}

function testHand(description: string, cards: Card[], expectedRank: string) {
  const result = evaluateBestHand(cards);
  assert(
    result.rank === expectedRank,
    `${description}: expected ${expectedRank}, got ${result.rank} (score: ${result.score})`
  );
}

function testCompare(description: string, winner: Card[], loser: Card[]) {
  const h1 = evaluateBestHand(winner);
  const h2 = evaluateBestHand(loser);
  const cmp = compareHands(h1, h2);
  assert(
    cmp > 0,
    `${description}: expected winner (${h1.rank}) to beat loser (${h2.rank})`
  );
}

function testTie(description: string, hand1: Card[], hand2: Card[]) {
  const h1 = evaluateBestHand(hand1);
  const h2 = evaluateBestHand(hand2);
  const cmp = compareHands(h1, h2);
  assert(
    cmp === 0,
    `${description}: expected tie, got ${cmp} (h1=${h1.rank}, h2=${h2.rank})`
  );
}

// Test individual hand ranks
console.log('\n=== Hand Rank Detection ===\n');

// Royal Flush
testHand(
  'Royal Flush',
  [c(14, h), c(13, h), c(12, h), c(11, h), c(10, h)],
  'royal_flush'
);

// Straight Flush
testHand(
  'Straight Flush (9-5)',
  [c(9, s), c(8, s), c(7, s), c(6, s), c(5, s)],
  'straight_flush'
);

// Wheel Straight Flush (A-2-3-4-5)
testHand(
  'Wheel Straight Flush',
  [c(14, d), c(2, d), c(3, d), c(4, d), c(5, d)],
  'straight_flush'
);

// Four of a Kind
testHand(
  'Four of a Kind',
  [c(10, h), c(10, d), c(10, cS), c(10, s), c(7, h)],
  'four_of_a_kind'
);

// Full House
testHand(
  'Full House',
  [c(8, h), c(8, d), c(8, cS), c(5, s), c(5, h)],
  'full_house'
);

// Flush
testHand(
  'Flush',
  [c(14, h), c(11, h), c(7, h), c(6, h), c(3, h)],
  'flush'
);

// Straight
testHand(
  'Straight (10-6)',
  [c(10, h), c(9, d), c(8, cS), c(7, s), c(6, h)],
  'straight'
);

// Wheel Straight (A-2-3-4-5)
testHand(
  'Wheel Straight',
  [c(14, h), c(2, d), c(3, cS), c(4, s), c(5, h)],
  'straight'
);

// Three of a Kind
testHand(
  'Three of a Kind',
  [c(9, h), c(9, d), c(9, cS), c(7, s), c(3, h)],
  'three_of_a_kind'
);

// Two Pair
testHand(
  'Two Pair',
  [c(12, h), c(12, d), c(8, cS), c(8, s), c(3, h)],
  'two_pair'
);

// One Pair
testHand(
  'One Pair',
  [c(11, h), c(11, d), c(9, cS), c(7, s), c(3, h)],
  'one_pair'
);

// High Card
testHand(
  'High Card',
  [c(14, h), c(10, d), c(8, cS), c(5, s), c(3, h)],
  'high_card'
);

// 7-card evaluation
testHand(
  '7-card: Find best 5 (flush hidden in 7)',
  [c(14, h), c(13, h), c(12, h), c(11, h), c(10, h), c(2, d), c(3, s)],
  'royal_flush'
);

testHand(
  '7-card: Pair from 7 cards',
  [c(14, h), c(14, d), c(8, cS), c(5, s), c(3, h), c(2, cS), c(7, d)],
  'one_pair'
);

// Comparison tests
console.log('\n=== Hand Comparisons ===\n');

testCompare(
  'Pair beats High Card',
  [c(11, h), c(11, d), c(9, cS), c(7, s), c(3, h)],
  [c(14, h), c(10, d), c(8, cS), c(5, s), c(3, h)]
);

testCompare(
  'Two Pair beats One Pair',
  [c(12, h), c(12, d), c(8, cS), c(8, s), c(3, h)],
  [c(14, h), c(14, d), c(9, cS), c(7, s), c(3, h)]
);

testCompare(
  'Straight beats Three of a Kind',
  [c(10, h), c(9, d), c(8, cS), c(7, s), c(6, h)],
  [c(9, h), c(9, d), c(9, cS), c(7, s), c(3, h)]
);

testCompare(
  'Flush beats Straight',
  [c(14, h), c(11, h), c(7, h), c(6, h), c(3, h)],
  [c(10, h), c(9, d), c(8, cS), c(7, s), c(6, h)]
);

testCompare(
  'Full House beats Flush',
  [c(8, h), c(8, d), c(8, cS), c(5, s), c(5, h)],
  [c(14, h), c(11, h), c(7, h), c(6, h), c(3, h)]
);

testCompare(
  'Four of a Kind beats Full House',
  [c(10, h), c(10, d), c(10, cS), c(10, s), c(7, h)],
  [c(8, h), c(8, d), c(8, cS), c(5, s), c(5, h)]
);

testCompare(
  'Straight Flush beats Four of a Kind',
  [c(9, s), c(8, s), c(7, s), c(6, s), c(5, s)],
  [c(10, h), c(10, d), c(10, cS), c(10, s), c(7, h)]
);

testCompare(
  'Royal Flush beats Straight Flush',
  [c(14, h), c(13, h), c(12, h), c(11, h), c(10, h)],
  [c(9, s), c(8, s), c(7, s), c(6, s), c(5, s)]
);

// Tiebreakers
console.log('\n=== Tiebreakers ===\n');

testCompare(
  'Higher pair beats lower pair',
  [c(12, h), c(12, d), c(9, cS), c(7, s), c(3, h)],
  [c(11, h), c(11, d), c(9, cS), c(7, s), c(3, h)]
);

testCompare(
  'Higher kicker breaks pair tie',
  [c(11, h), c(11, d), c(14, cS), c(7, s), c(3, h)],
  [c(11, h), c(11, d), c(9, cS), c(7, s), c(3, h)]
);

testCompare(
  'Higher two pair beats lower two pair',
  [c(14, h), c(14, d), c(8, cS), c(8, s), c(3, h)],
  [c(12, h), c(12, d), c(8, cS), c(8, s), c(3, h)]
);

testCompare(
  'Higher straight beats lower straight',
  [c(10, h), c(9, d), c(8, cS), c(7, s), c(6, h)],
  [c(9, h), c(8, d), c(7, cS), c(6, s), c(5, h)]
);

testCompare(
  'Higher flush beats lower flush',
  [c(14, h), c(11, h), c(7, h), c(6, h), c(3, h)],
  [c(13, h), c(11, h), c(7, h), c(6, h), c(3, h)]
);

testCompare(
  'Higher full house beats lower full house (trips first)',
  [c(9, h), c(9, d), c(9, cS), c(5, s), c(5, h)],
  [c(8, h), c(8, d), c(8, cS), c(14, s), c(14, h)]
);

testCompare(
  'Higher four of a kind beats lower',
  [c(10, h), c(10, d), c(10, cS), c(10, s), c(7, h)],
  [c(9, h), c(9, d), c(9, cS), c(9, s), c(14, h)]
);

testCompare(
  'Ace-high straight beats king-high straight',
  [c(14, h), c(13, d), c(12, cS), c(11, s), c(10, h)],
  [c(13, h), c(12, d), c(11, cS), c(10, s), c(9, h)]
);

// 7-card best selection tests
testCompare(
  '7-card: Two pair beats one pair from 7',
  [c(11, h), c(11, d), c(9, cS), c(7, s), c(3, h), c(2, cS), c(7, d)],
  [c(14, h), c(14, d), c(8, cS), c(5, s), c(3, h), c(2, cS), c(7, d)]
);

testCompare(
  '7-card: Flush in community + hole cards detected',
  [c(14, h), c(9, h), c(6, h), c(3, h), c(2, h), c(8, d), c(7, cS)],
  [c(14, s), c(9, s), c(6, s), c(3, s), c(2, h), c(8, d), c(7, cS)]
);

// Wheel straight (A-2-3-4-5) has a lower high card than King-high straight
testCompare(
  'King-high straight beats wheel straight',
  [c(13, h), c(12, d), c(11, cS), c(10, s), c(9, h)],
  [c(5, h), c(4, d), c(3, cS), c(2, s), c(14, h)]
);

console.log('\n=== All tests passed! ===\n');
