import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, BORDER_RADIUS, SPACING, TYPOGRAPHY } from '../constants/theme';
import { useGameStore } from '../store/gameStore';
import { formatChips } from '../utils/format';

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const players = useGameStore(s => s.players);
  const handCount = useGameStore(s => s.handCount);
  const playerChips = players[0]?.chips || 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.surface} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <MaterialIcons name="menu" size={24} color={COLORS.mochaPeach} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>High Roller Poker</Text>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.navigate('Settings')}>
          <MaterialIcons name="settings" size={24} color={COLORS.mochaPeach} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>A</Text>
            </View>
            <View style={styles.onlineDot} />
          </View>
          <Text style={styles.playerName}>Ace Vancura</Text>
          <View style={styles.badgeRow}>
            <View style={styles.vipBadge}>
              <Text style={styles.vipText}>VIP</Text>
            </View>
            <Text style={styles.levelText}>Lv. 1</Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <MaterialIcons name="casino" size={16} color={COLORS.mochaPeach} />
              <Text style={styles.statLabel}>Total Hands</Text>
            </View>
            <Text style={styles.statValue}>{handCount}</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <MaterialIcons name="trending-up" size={16} color={COLORS.mochaPeach} />
              <Text style={styles.statLabel}>Win Rate</Text>
            </View>
            <Text style={styles.statValue}>--</Text>
          </View>
          <View style={[styles.statCard, styles.statCardWide]}>
            <View style={styles.statHeader}>
              <MaterialIcons name="star" size={16} color={COLORS.mochaPeach} />
              <Text style={styles.statLabel}>Biggest Win</Text>
            </View>
            <Text style={styles.statValue}>{formatChips(playerChips)}</Text>
          </View>
        </View>

        {/* Account Settings */}
        <TouchableOpacity style={styles.settingsCta} activeOpacity={0.7} onPress={() => navigation.navigate('Settings')}>
          <View style={styles.settingsCtaIcon}>
            <MaterialIcons name="tune" size={18} color={COLORS.onSurfaceVariant} />
          </View>
          <View style={styles.settingsCtaText}>
            <Text style={styles.settingsCtaTitle}>Account Settings</Text>
            <Text style={styles.settingsCtaDesc}>Security, preferences, and billing</Text>
          </View>
          <Text style={styles.settingsCtaArrow}>›</Text>
        </TouchableOpacity>

        {/* Recent Matches */}
        <Text style={styles.sectionTitle}>RECENT MATCHES</Text>
        <View style={styles.matchList}>
          <View style={styles.matchRow}>
            <View style={styles.matchInfo}>
              <Text style={styles.matchGame}>No Limit Hold'em</Text>
              <Text style={styles.matchBlinds}>$10/$20 Blinds</Text>
            </View>
            <View style={styles.matchResult}>
              <Text style={styles.matchAmount}>—</Text>
              <Text style={styles.matchTime}>Play more to see history</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Game')}>
          <MaterialIcons name="play-circle-filled" size={28} color={COLORS.onSurfaceVariant} />
          <Text style={styles.navText}>Play Now</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="account-circle" size={28} color={COLORS.mochaPeach} />
          <Text style={[styles.navText, { color: COLORS.mochaPeach }]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md + 8,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    backgroundColor: 'rgba(17,19,24,0.7)',
  },
  headerBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.mochaPeach,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.lg,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SPACING.sm,
  },
  avatar: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: '#182034',
    borderWidth: 3,
    borderColor: COLORS.surfaceHighest,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.primary,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.mochaPeach,
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  playerName: {
    ...TYPOGRAPHY.headlineLgMobile,
    color: COLORS.onSurface,
    marginBottom: SPACING.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  vipBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    backgroundColor: COLORS.surfaceHigh,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.tertiary,
  },
  vipText: {
    ...TYPOGRAPHY.labelMd,
    color: COLORS.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  levelText: {
    ...TYPOGRAPHY.bodySm,
    color: COLORS.onSurfaceVariant,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statCardWide: {
    minWidth: '100%',
    borderColor: 'rgba(181,207,255,0.15)',
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  statLabel: {
    ...TYPOGRAPHY.labelMd,
    color: COLORS.onSurfaceVariant,
  },
  statValue: {
    ...TYPOGRAPHY.headlineSm,
    color: COLORS.onSurface,
  },
  settingsCta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: SPACING.lg,
    gap: SPACING.md,
  },
  settingsCtaIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceHigh,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsCtaText: {
    flex: 1,
  },
  settingsCtaTitle: {
    ...TYPOGRAPHY.headlineSm,
    fontSize: 16,
    color: COLORS.onSurface,
  },
  settingsCtaDesc: {
    ...TYPOGRAPHY.bodySm,
    color: COLORS.onSurfaceVariant,
    marginTop: 2,
  },
  settingsCtaArrow: {
    fontSize: 24,
    color: COLORS.onSurfaceVariant,
  },
  sectionTitle: {
    ...TYPOGRAPHY.labelMd,
    color: COLORS.primary,
    letterSpacing: 1.5,
    marginBottom: SPACING.sm,
  },
  matchList: {
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.surfaceHighest,
    overflow: 'hidden',
    marginBottom: SPACING.xxl,
  },
  matchRow: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.03)',
  },
  matchInfo: {
    marginBottom: SPACING.xs,
  },
  matchGame: {
    ...TYPOGRAPHY.labelLg,
    color: COLORS.onSurface,
  },
  matchBlinds: {
    ...TYPOGRAPHY.bodySm,
    color: COLORS.onSurfaceVariant,
    marginTop: 2,
  },
  matchResult: {
    alignItems: 'flex-end',
  },
  matchAmount: {
    ...TYPOGRAPHY.labelLg,
    color: COLORS.onSurfaceVariant,
  },
  matchTime: {
    ...TYPOGRAPHY.bodySm,
    color: COLORS.onSurfaceVariant,
    marginTop: 2,
  },
  bottomNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: SPACING.sm,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.lg,
    backgroundColor: 'rgba(30,32,42,0.92)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(141,145,155,0.25)',
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 3,
  },
  navText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.onSurfaceVariant,
    textAlign: 'center',
  },
});
