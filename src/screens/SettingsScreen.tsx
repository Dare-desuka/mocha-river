import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, ScrollView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, BORDER_RADIUS, SPACING, TABLE_THEMES } from '../constants/theme';
import { useSettingsStore } from '../store/settingsStore';
import { useGameStore } from '../store/gameStore';
import { STARTING_CHIPS, BotDifficulty } from '../game/types';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { settings, update } = useSettingsStore();
  const { resetChips, setDifficulty } = useGameStore();

  const handleReset = () => {
    resetChips();
  };

  const handleDifficulty = (d: BotDifficulty) => {
    update({ botDifficulty: d });
    setDifficulty(d);
  };

  const difficultyOptions: { key: BotDifficulty; label: string; desc: string }[] = [
    { key: 'easy', label: 'Easy', desc: 'Bots make mistakes' },
    { key: 'medium', label: 'Medium', desc: 'Balanced play' },
    { key: 'hard', label: 'Hard', desc: 'Tight-aggressive' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.surface} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.primaryContainer} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Game Preferences */}
        <Text style={styles.sectionTitle}>GAME PREFERENCES</Text>
        <View style={styles.sectionCard}>
          {/* Sound */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                <MaterialIcons name="volume-up" size={18} color={COLORS.primaryContainer} />
              </View>
              <View>
                <Text style={styles.settingLabel}>Sound Effects</Text>
                <Text style={styles.settingDesc}>Chips clinking, card shuffling</Text>
              </View>
            </View>
            <Switch
              value={settings.soundEnabled}
              onValueChange={v => update({ soundEnabled: v })}
              trackColor={{ false: COLORS.surfaceHighest, true: COLORS.tertiary }}
              thumbColor={settings.soundEnabled ? COLORS.onTertiary : COLORS.outline}
            />
          </View>

          <View style={styles.divider} />

          {/* Vibration */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                <MaterialIcons name="vibration" size={18} color={COLORS.primaryContainer} />
              </View>
              <View>
                <Text style={styles.settingLabel}>Haptic Feedback</Text>
                <Text style={styles.settingDesc}>Vibrate on your turn</Text>
              </View>
            </View>
            <Switch
              value={settings.vibrationEnabled}
              onValueChange={v => update({ vibrationEnabled: v })}
              trackColor={{ false: COLORS.surfaceHighest, true: COLORS.tertiary }}
              thumbColor={settings.vibrationEnabled ? COLORS.onTertiary : COLORS.outline}
            />
          </View>
        </View>

        {/* Bot Difficulty */}
        <Text style={styles.sectionTitle}>BOT DIFFICULTY</Text>
        <View style={styles.sectionCard}>
          {difficultyOptions.map(opt => (
            <TouchableOpacity
              key={opt.key}
              style={[
                styles.difficultyRow,
                settings.botDifficulty === opt.key && styles.difficultyRowActive,
              ]}
              onPress={() => handleDifficulty(opt.key)}
              activeOpacity={0.7}
            >
              <View style={styles.difficultyInfo}>
                <Text style={[
                  styles.difficultyLabel,
                  settings.botDifficulty === opt.key && styles.difficultyLabelActive,
                ]}>{opt.label}</Text>
                <Text style={styles.difficultyDesc}>{opt.desc}</Text>
              </View>
              {settings.botDifficulty === opt.key && (
                <MaterialIcons name="check-circle" size={20} color={COLORS.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Table Theme */}
        <Text style={styles.sectionTitle}>TABLE THEME</Text>
        <View style={styles.sectionCard}>
          {TABLE_THEMES.map(t => (
            <TouchableOpacity
              key={t.id}
              style={[
                styles.themeRow,
                settings.tableTheme === t.id && styles.themeRowActive,
              ]}
              onPress={() => update({ tableTheme: t.id })}
              activeOpacity={0.7}
            >
              <View style={[styles.themeSwatch, { backgroundColor: t.bg, borderColor: t.border }]} />
              <View style={styles.themeInfo}>
                <Text style={[
                  styles.themeLabel,
                  settings.tableTheme === t.id && styles.themeLabelActive,
                ]}>{t.name}</Text>
                <Text style={styles.themeDesc}>Blind {t.label}</Text>
              </View>
              {settings.tableTheme === t.id && (
                <MaterialIcons name="check-circle" size={20} color={COLORS.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Danger Zone */}
        <Text style={[styles.sectionTitle, { color: COLORS.mochaRed }]}>DANGER ZONE</Text>
        <View style={[styles.sectionCard, { borderColor: 'rgba(243, 139, 168, 0.2)' }]}>
          <Text style={styles.dangerTitle}>Reset Account</Text>
          <Text style={styles.dangerDesc}>This will reset your chip balance to the starting amount ({STARTING_CHIPS}).</Text>
          <TouchableOpacity
            style={styles.resetBtn}
            onPress={handleReset}
            activeOpacity={0.7}
          >
            <MaterialIcons name="restart-alt" size={16} color={COLORS.mochaRed} />
            <Text style={styles.resetBtnText}>  Reset Chip Balance</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
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
    backgroundColor: 'rgba(17, 19, 24, 0.7)',
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    fontSize: 22,
    color: COLORS.primaryContainer,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primaryContainer,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryContainer,
    letterSpacing: 1.5,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },
  sectionCard: {
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm + 2,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flex: 1,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surfaceHighest,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingIconText: {
    fontSize: 16,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.onSurface,
  },
  settingDesc: {
    fontSize: 11,
    color: COLORS.onSurfaceVariant,
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginVertical: SPACING.xs,
  },
  dangerTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.onSurface,
    marginBottom: SPACING.xs,
  },
  dangerDesc: {
    fontSize: 12,
    color: COLORS.onSurfaceVariant,
    lineHeight: 18,
    marginBottom: SPACING.sm,
  },
  resetBtn: {
    flexDirection: 'row',
    backgroundColor: 'rgba(243, 139, 168, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(243, 139, 168, 0.4)',
    paddingVertical: SPACING.sm + 4,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.mochaRed,
  },
  difficultyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm + 4,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xs,
  },
  difficultyRowActive: {
    backgroundColor: 'rgba(181, 207, 255, 0.08)',
  },
  difficultyInfo: {
    flex: 1,
  },
  difficultyLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.onSurface,
  },
  difficultyLabelActive: {
    color: COLORS.primary,
  },
  difficultyDesc: {
    fontSize: 11,
    color: COLORS.onSurfaceVariant,
    marginTop: 2,
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xs,
  },
  themeRowActive: {
    backgroundColor: 'rgba(181, 207, 255, 0.08)',
  },
  themeSwatch: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 2,
  },
  themeInfo: {
    flex: 1,
  },
  themeLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.onSurface,
  },
  themeLabelActive: {
    color: COLORS.primary,
  },
  themeDesc: {
    fontSize: 11,
    color: COLORS.onSurfaceVariant,
    marginTop: 2,
  },
});
