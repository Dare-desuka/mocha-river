import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, BORDER_RADIUS, SPACING } from '../constants/theme';
import { formatChips } from '../utils/format';

interface Props {
  pot: number;
}

const GameStatusBanner: React.FC<Props> = React.memo(({ pot }) => {
  return (
    <View style={styles.container}>
      <View style={styles.chipIcon}>
        <View style={styles.chipIconInner} />
        <Text style={styles.chipIconText}>MR</Text>
      </View>
      <Text style={styles.potAmount}>{formatChips(pot)}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.glassBg,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chipIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e8e8e8',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#c0c0c0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 2,
  },
  chipIconInner: {
    position: 'absolute',
    top: 3, left: 3, right: 3, bottom: 3,
    borderRadius: 11,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.15)',
  },
  chipIconText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#555',
    letterSpacing: 0.5,
  },
  potAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
  },
});

export default GameStatusBanner;
