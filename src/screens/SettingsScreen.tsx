import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, ScrollView, StatusBar, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, BORDER_RADIUS, SPACING, TABLE_THEMES } from '../constants/theme';
import { useSettingsStore } from '../store/settingsStore';
import { useGameStore } from '../store/gameStore';
import { STARTING_CHIPS, BotDifficulty } from '../game/types';
import { useT } from '../utils/i18n';

export default function SettingsScreen() {
  const t = useT();
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
    { key: 'easy', label: t('settings.easy'), desc: t('settings.easy.desc') },
    { key: 'medium', label: t('settings.medium'), desc: t('settings.medium.desc') },
    { key: 'hard', label: t('settings.hard'), desc: t('settings.hard.desc') },
  ];

  return (
    <ImageBackground source={require('../../assets/splash-icon.png')} style={styles.container} resizeMode='cover'>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.surface} />
      <View style={[styles.header, { paddingTop: (StatusBar.currentHeight || 28) + 4 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.primaryContainer} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('settings.title')}</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Game Preferences */}
        <Text style={styles.sectionTitle}>{t('settings.preferences')}</Text>
        <View style={styles.sectionCard}>
          {/* Sound */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                <MaterialIcons name="volume-up" size={18} color={COLORS.primaryContainer} />
              </View>
              <View>
                <Text style={styles.settingLabel}>{t('settings.sound')}</Text>
                <Text style={styles.settingDesc}>{t('settings.sound.desc')}</Text>
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
                <Text style={styles.settingLabel}>{t('settings.haptic')}</Text>
                <Text style={styles.settingDesc}>{t('settings.haptic.desc')}</Text>
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
        <Text style={styles.sectionTitle}>{t('settings.botDiff')}</Text>
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
        <Text style={styles.sectionTitle}>{t('settings.tableTheme')}</Text>
        <View style={styles.sectionCard}>
          {TABLE_THEMES.map(theme => (
            <TouchableOpacity
              key={theme.id}
              style={[
                styles.themeRow,
                settings.tableTheme === theme.id && styles.themeRowActive,
              ]}
              onPress={() => update({ tableTheme: theme.id })}
              activeOpacity={0.7}
            >
              <View style={[styles.themeSwatch, { backgroundColor: theme.bg, borderColor: theme.border }]} />
              <View style={styles.themeInfo}>
                <Text style={[
                  styles.themeLabel,
                  settings.tableTheme === theme.id && styles.themeLabelActive,
                ]}>{t('settings.theme.' + theme.id)}</Text>
                <Text style={styles.themeDesc}>{t('settings.blind').replace('{label}', theme.label)}</Text>
              </View>
              {settings.tableTheme === theme.id && (
                <MaterialIcons name="check-circle" size={20} color={COLORS.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Card Back */}
        <Text style={styles.sectionTitle}>{t('settings.cardBack')}</Text>
        <View style={styles.sectionCard}>
          {[
            { key: 'classic', label: t('settings.card.classic'), desc: t('settings.card.classic.desc') },
            { key: 'diamond', label: t('settings.card.diamond'), desc: t('settings.card.diamond.desc') },
            { key: 'royal', label: t('settings.card.royal'), desc: t('settings.card.royal.desc') },
          ].map(opt => (
            <TouchableOpacity
              key={opt.key}
              style={[styles.selectorRow, settings.cardBack === opt.key && styles.selectorRowActive]}
              onPress={() => update({ cardBack: opt.key as any })}
              activeOpacity={0.7}
            >
              <View style={styles.selectorInfo}>
                <Text style={[styles.selectorLabel, settings.cardBack === opt.key && styles.selectorLabelActive]}>{opt.label}</Text>
                <Text style={styles.selectorDesc}>{opt.desc}</Text>
              </View>
              {settings.cardBack === opt.key && (
                <MaterialIcons name="check-circle" size={20} color={COLORS.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Sound Pack */}
        <Text style={styles.sectionTitle}>{t('settings.soundPack')}</Text>
        <View style={styles.sectionCard}>
          {[
            { key: 'classic', label: t('settings.pack.classic'), desc: t('settings.pack.classic.desc') },
            { key: 'arcade', label: t('settings.pack.arcade'), desc: t('settings.pack.arcade.desc') },
            { key: 'muted', label: t('settings.pack.muted'), desc: t('settings.pack.muted.desc') },
          ].map(opt => (
            <TouchableOpacity
              key={opt.key}
              style={[styles.selectorRow, settings.soundPack === opt.key && styles.selectorRowActive]}
              onPress={() => update({ soundPack: opt.key as any })}
              activeOpacity={0.7}
            >
              <View style={styles.selectorInfo}>
                <Text style={[styles.selectorLabel, settings.soundPack === opt.key && styles.selectorLabelActive]}>{opt.label}</Text>
                <Text style={styles.selectorDesc}>{opt.desc}</Text>
              </View>
              {settings.soundPack === opt.key && (
                <MaterialIcons name="check-circle" size={20} color={COLORS.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Language */}
        <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
        <View style={styles.sectionCard}>
          {[
            { key: 'en' as const, label: t('settings.lang.en'), desc: 'English' },
            { key: 'id' as const, label: t('settings.lang.id'), desc: 'Bahasa Indonesia' },
          ].map(opt => (
            <TouchableOpacity
              key={opt.key}
              style={[styles.selectorRow, settings.language === opt.key && styles.selectorRowActive]}
              onPress={() => update({ language: opt.key })}
              activeOpacity={0.7}
            >
              <View style={styles.selectorInfo}>
                <Text style={[styles.selectorLabel, settings.language === opt.key && styles.selectorLabelActive]}>{opt.label}</Text>
                <Text style={styles.selectorDesc}>{opt.desc}</Text>
              </View>
              {settings.language === opt.key && (
                <MaterialIcons name="check-circle" size={20} color={COLORS.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Danger Zone */}
        <Text style={[styles.sectionTitle, { color: COLORS.mochaRed }]}>{t('settings.danger')}</Text>
        <View style={[styles.sectionCard, { borderColor: 'rgba(243, 139, 168, 0.2)' }]}>
          <Text style={styles.dangerTitle}>{t('settings.reset')}</Text>
          <Text style={styles.dangerDesc}>{t('settings.reset.desc').replace('{chips}', String(STARTING_CHIPS))}</Text>
          <TouchableOpacity
            style={styles.resetBtn}
            onPress={handleReset}
            activeOpacity={0.7}
          >
            <MaterialIcons name="restart-alt" size={16} color={COLORS.mochaRed} />
            <Text style={styles.resetBtnText}>{'  ' + t('settings.resetBtn')}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ImageBackground>
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
  selectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm + 4,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xs,
  },
  selectorRowActive: {
    backgroundColor: 'rgba(181, 207, 255, 0.08)',
  },
  selectorInfo: {
    flex: 1,
  },
  selectorLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.onSurface,
  },
  selectorLabelActive: {
    color: COLORS.primary,
  },
  selectorDesc: {
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
