import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, BORDER_RADIUS, SPACING } from '../constants/theme';
import { useGameStore } from '../store/gameStore';
import { formatChips } from '../utils/format';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const players = useGameStore(s => s.players);
  const playerChips = players[0]?.chips || 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.surface} />

      <View style={styles.brandBlock}>
        <Text style={styles.title}>HIGH ROLLER POKER</Text>
      </View>

      <View style={styles.bankrollPill}>
        <View style={styles.coinIcon}>
          <Text style={styles.coinIconText}>$</Text>
        </View>
        <View>
          <Text style={styles.chipLabel}>BANKROLL</Text>
          <Text style={styles.chipAmount}>{formatChips(playerChips)}</Text>
        </View>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.playBtn}
          onPress={() => navigation.navigate('Game')}
          activeOpacity={0.82}
        >
          <MaterialIcons name="play-arrow" size={30} color={COLORS.surface} />
          <Text style={styles.playBtnText}>Play Offline</Text>
        </TouchableOpacity>

        <View style={styles.secondaryRow}>
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => navigation.navigate('Tutorial')}
            activeOpacity={0.7}
          >
            <MaterialIcons name="school" size={24} color={COLORS.onSurfaceVariant} />
            <Text style={styles.secondaryBtnText}>Tutorial</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => navigation.navigate('Settings')}
            activeOpacity={0.7}
          >
            <MaterialIcons name="settings" size={24} color={COLORS.onSurfaceVariant} />
            <Text style={styles.secondaryBtnText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Game')}>
          <MaterialIcons name="play-circle-filled" size={28} color={COLORS.mochaPeach} />
          <Text style={[styles.navText, { color: COLORS.mochaPeach }]}>Play Now</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
          <MaterialIcons name="account-circle" size={28} color={COLORS.onSurfaceVariant} />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Keep chip amount available for screen readers and small balances */}
      <View style={styles.hiddenBalance}>
        <Text style={styles.chipAmount}>{formatChips(playerChips)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
    paddingBottom: 100,
  },
  brandBlock: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.md,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.mochaPeach,
    letterSpacing: 4,
    textAlign: 'center',
    lineHeight: 44,
  },
  bankrollPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    backgroundColor: 'rgba(24,24,37,0.65)',
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 2,
    borderColor: 'rgba(141,145,155,0.35)',
  },
  chipLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.onSurfaceVariant,
    letterSpacing: 3,
  },
  chipAmount: {
    fontSize: 26,
    fontWeight: '700',
    color: '#d8def8',
    letterSpacing: 1,
  },
  coinIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: COLORS.mochaPeach,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coinIconText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.mochaPeach,
  },
  menu: {
    width: '100%',
    alignItems: 'center',
    gap: SPACING.md,
  },
  playBtn: {
    backgroundColor: COLORS.mochaPeach,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    width: '88%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.lg,
    shadowColor: COLORS.mochaPeach,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  playBtnText: {
    fontSize: 30,
    fontWeight: '700',
    color: COLORS.surface,
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  secondaryBtn: {
    backgroundColor: 'rgba(24,24,37,0.45)',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    borderWidth: 1.5,
    borderColor: 'rgba(195,198,210,0.45)',
    minWidth: 118,
    justifyContent: 'center',
  },
  secondaryBtnText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.onSurfaceVariant,
  },
  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 92,
    backgroundColor: 'rgba(30,32,42,0.92)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(141,145,155,0.25)',
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: SPACING.sm,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 3,
  },
  navText: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '600',
    color: COLORS.onSurfaceVariant,
    textAlign: 'center',
  },
  hiddenBalance: {
    position: 'absolute',
    opacity: 0,
  },
});
