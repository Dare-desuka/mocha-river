import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar, TextInput, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, BORDER_RADIUS, SPACING, TYPOGRAPHY } from '../constants/theme';
import { useGameStore } from '../store/gameStore';
import { formatChips } from '../utils/format';
import { loadStats, loadProfile, saveProfile, Stats, ProfileData } from '../utils/storage';

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const players = useGameStore(s => s.players);
  const handCount = useGameStore(s => s.handCount);
  const playerChips = players[0]?.chips || 0;
  const [stats, setStats] = useState<Stats>({ totalHands: 0, handsWon: 0, biggestWin: 0, biggestWinDate: null });
  const [profile, setProfile] = useState<ProfileData>({ name: 'Ace Vancura', avatarUri: null });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    loadStats().then(setStats);
    loadProfile().then(setProfile);
  }, [handCount]);

  const pickImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const updated = { ...profile, avatarUri: uri };
      setProfile(updated);
      await saveProfile(updated);
    }
  }, [profile]);

  const saveName = useCallback(async () => {
    setEditing(false);
    const updated = { ...profile, name: profile.name.trim() || 'Player' };
    setProfile(updated);
    await saveProfile(updated);
  }, [profile]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.surface} />

      <View style={[styles.header, { paddingTop: (StatusBar.currentHeight || 28) + 4 }]}>
        <View style={styles.headerBtn} />
        <Text style={styles.headerTitle}>Mocha River</Text>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.navigate('Settings')}>
          <MaterialIcons name="settings" size={24} color={COLORS.mochaPeach} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <TouchableOpacity style={styles.avatarContainer} onPress={pickImage} activeOpacity={0.7}>
            {profile.avatarUri ? (
              <Image source={{ uri: profile.avatarUri }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {profile.name ? profile.name[0].toUpperCase() : 'A'}
                </Text>
              </View>
            )}
            <View style={styles.cameraBadge}>
              <MaterialIcons name="camera-alt" size={14} color={COLORS.surface} />
            </View>
          </TouchableOpacity>
          {editing ? (
            <TextInput
              style={styles.nameInput}
              value={profile.name}
              onChangeText={text => setProfile(p => ({ ...p, name: text }))}
              onBlur={saveName}
              onSubmitEditing={saveName}
              autoFocus
              maxLength={20}
              selectTextOnFocus
            />
          ) : (
            <TouchableOpacity onPress={() => setEditing(true)}>
              <Text style={styles.playerName}>{profile.name}</Text>
            </TouchableOpacity>
          )}
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
            <Text style={styles.statValue}>
              {stats.totalHands > 0
                ? `${Math.round((stats.handsWon / stats.totalHands) * 100)}%`
                : '--'}
            </Text>
          </View>
          <View style={[styles.statCard, styles.statCardWide]}>
            <View style={styles.statHeader}>
              <MaterialIcons name="star" size={16} color={COLORS.mochaPeach} />
              <Text style={styles.statLabel}>Biggest Win</Text>
            </View>
            <Text style={styles.statValue}>{stats.biggestWin > 0 ? formatChips(stats.biggestWin) : '--'}</Text>
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

        {/* Session stats */}
        <Text style={styles.sectionTitle}>SESSION</Text>
        <View style={styles.matchList}>
          <View style={styles.matchRow}>
            <View style={styles.matchInfo}>
              <Text style={styles.matchGame}>Hands Played</Text>
            </View>
            <View style={styles.matchResult}>
              <Text style={[styles.matchAmount, { color: COLORS.onSurface }]}>{stats.totalHands}</Text>
            </View>
          </View>
          <View style={styles.matchRow}>
            <View style={styles.matchInfo}>
              <Text style={styles.matchGame}>Hands Won</Text>
            </View>
            <View style={styles.matchResult}>
              <Text style={[styles.matchAmount, { color: COLORS.onSurface }]}>{stats.handsWon}</Text>
            </View>
          </View>
        </View>
      </ScrollView>


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
  avatarImage: {
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 3,
    borderColor: COLORS.surfaceHighest,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.primary,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  nameInput: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.onSurface,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
    paddingVertical: 4,
    minWidth: 150,
    marginBottom: SPACING.xs,
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
