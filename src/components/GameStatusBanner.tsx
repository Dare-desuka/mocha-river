import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Phase, BLIND_LEVELS } from '../game/types';
import { COLORS, BORDER_RADIUS, SPACING } from '../constants/theme';
import { formatChips } from '../utils/format';

interface Props {
  phase: Phase;
  pot: number;
  handCount: number;
  blindLevel: number;
  level: number;
}

const GameStatusBanner: React.FC<Props> = React.memo(({ phase, pot, handCount, level }) => {
  const phaseLabels: Record<Phase, string> = {
    idle: 'Press Deal to Start',
    preflop: 'Pre-Flop',
    flop: 'Flop',
    turn: 'Turn',
    river: 'River',
    showdown: 'Showdown!',
  };

  const blind = BLIND_LEVELS[level] || BLIND_LEVELS[BLIND_LEVELS.length - 1];

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.potSection}>
          <Text style={styles.potLabel}>Total Pot</Text>
          <Text style={styles.potAmount}>{formatChips(pot)}</Text>
        </View>
        <Text style={styles.phase}>{phaseLabels[phase]} · Hand #{handCount} · Blinds {blind.small}/{blind.big}</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.glassBg,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  inner: {
    alignItems: 'center',
  },
  potSection: {
    alignItems: 'center',
  },
  potLabel: {
    fontSize: 9,
    color: COLORS.primary,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  potAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
  },
  phase: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
});

export default GameStatusBanner;
