import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Card as CardType, SUIT_SYMBOLS, SUIT_COLORS, RANK_NAMES } from '../game/types';
import { BORDER_RADIUS } from '../constants/theme';

interface Props {
  card: CardType;
  hidden?: boolean;
  small?: boolean;
  flipped?: boolean;
}

const PokerCard: React.FC<Props> = React.memo(({ card, hidden, small, flipped: showAnimation }) => {
  const flipAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    flipAnim.setValue(0);
    Animated.spring(flipAnim, {
      toValue: 1,
      friction: 7,
      tension: 50,
      useNativeDriver: true,
    }).start();
  }, [card.rank, card.suit, showAnimation]);

  const rotateY = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['90deg', '0deg'],
  });

  const frontOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  const backOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1, 0],
  });

  if (hidden) {
    return (
      <View style={[styles.card, styles.cardBack, small && styles.cardSmall]}>
        <View style={styles.backPattern}>
          <View style={styles.backFrame} />
          <View style={[styles.backDiag, { transform: [{ rotate: '45deg' }] }]} />
          <View style={[styles.backDiag, { transform: [{ rotate: '-45deg' }] }]} />
          <Text style={styles.backText}>♠♥♣♦</Text>
        </View>
      </View>
    );
  }

  const suitColor = SUIT_COLORS[card.suit];
  const suitSymbol = SUIT_SYMBOLS[card.suit];
  const rankName = RANK_NAMES[card.rank];

  return (
    <View style={[styles.card, small && styles.cardSmall]}>
      <Animated.View style={[styles.backOverlay, { opacity: backOpacity }, small && styles.cardSmall]}>
        <View style={[styles.backPatternFill]}>
          <View style={styles.backFrame} />
          <View style={[styles.backDiag, { transform: [{ rotate: '45deg' }] }]} />
          <View style={[styles.backDiag, { transform: [{ rotate: '-45deg' }] }]} />
          <Text style={styles.backText}>♠♥♣♦</Text>
        </View>
      </Animated.View>
      <Animated.View style={[styles.front, { opacity: frontOpacity }]}>
        <View style={styles.cornerTop}>
          <Text style={[styles.rank, small && styles.rankSmall, { color: suitColor }]}>{rankName}</Text>
          <Text style={[styles.suitCorner, small && styles.suitCornerSmall, { color: suitColor }]}>{suitSymbol}</Text>
        </View>
        <Text style={[styles.suitCenter, small && styles.suitCenterSmall, { color: suitColor }]}>{suitSymbol}</Text>
        <View style={styles.cornerBottom}>
          <Text style={[styles.rank, styles.rankBottom, small && styles.rankSmall, { color: suitColor }]}>{rankName}</Text>
          <Text style={[styles.suitCorner, styles.suitBottom, small && styles.suitCornerSmall, { color: suitColor }]}>{suitSymbol}</Text>
        </View>
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    width: 56,
    height: 80,
    backgroundColor: '#cdd6f4',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
    borderWidth: 0.5,
    borderColor: '#b0b8cf',
    position: 'relative',
  },
  cardSmall: {
    width: 48,
    height: 64,
    borderRadius: 6,
  },
  cardBack: {
    backgroundColor: '#313244',
    borderWidth: 1,
    borderColor: 'rgba(181,207,255,0.45)',
  },
  backPattern: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    backgroundColor: '#242638',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backFrame: {
    position: 'absolute',
    top: '15%',
    left: '15%',
    width: '70%',
    height: '70%',
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: 'rgba(181,207,255,0.5)',
  },
  backDiag: {
    position: 'absolute',
    width: '150%',
    height: 1.5,
    backgroundColor: 'rgba(181,207,255,0.15)',
    top: '50%',
    left: '-25%',
  },
  backText: {
    fontSize: 10,
    color: 'rgba(181,207,255,0.2)',
    letterSpacing: 4,
  },
  backOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  backPatternFill: {
    flex: 1,
    backgroundColor: '#242638',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  front: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cornerTop: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingLeft: 5,
    paddingTop: 4,
  },
  cornerBottom: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    paddingRight: 5,
    paddingBottom: 4,
    transform: [{ rotate: '180deg' }],
  },
  rank: {
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 18,
    fontFamily: 'monospace',
  },
  rankSmall: {
    fontSize: 11,
    lineHeight: 12,
  },
  rankBottom: {
    fontSize: 14,
    lineHeight: 16,
  },
  suitCorner: {
    fontSize: 11,
    lineHeight: 12,
    marginTop: 0,
  },
  suitCornerSmall: {
    fontSize: 8,
    lineHeight: 9,
  },
  suitBottom: {
    fontSize: 9,
    lineHeight: 10,
  },
  suitCenter: {
    fontSize: 28,
    lineHeight: 32,
    textAlign: 'center',
  },
  suitCenterSmall: {
    fontSize: 16,
    lineHeight: 20,
  },
});

export default PokerCard;
