import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, BORDER_RADIUS, SPACING } from '../constants/theme';
import { useT } from '../utils/i18n';

interface GlassCardProps {
  icon: string;
  title: string;
  children: React.ReactNode;
}

function GlassCard({ icon, title, children }: GlassCardProps) {
  return (
    <View style={styles.glassCard}>
      <View style={styles.cardHeader}>
        <View style={styles.iconWrap}>
          <Text style={styles.iconText}>{icon}</Text>
        </View>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <Text style={styles.cardBody}>{children}</Text>
    </View>
  );
}

interface RankCardProps {
  name: string;
  desc: string;
  cards: { rank: string; suit: string; red?: boolean }[];
}

function RankCard({ name, desc, cards }: RankCardProps) {
  return (
    <View style={styles.rankCard}>
      <View style={styles.rankContent}>
        <View style={styles.rankInfo}>
          <Text style={styles.rankName}>{name}</Text>
          <Text style={styles.rankDesc}>{desc}</Text>
        </View>
        <View style={styles.miniCards}>
          {cards.map((c, i) => (
            <View key={i} style={styles.miniCard}>
              <Text style={[styles.miniRank, { color: c.red ? COLORS.mochaRed : COLORS.cardBlack }]}>
                {c.rank}{c.suit}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

export default function TutorialScreen() {
  const navigation = useNavigation();
  const t = useT();

  return (
    <ImageBackground source={require('../../assets/splash-icon.png')} style={styles.container} resizeMode="cover">
      <StatusBar barStyle="light-content" backgroundColor={COLORS.surface} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.tertiary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('tutorial.title')}</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Basics Section */}
        <Text style={styles.sectionTitle}>{t('tutorial.basics')}</Text>

        <GlassCard icon="🃏" title={t('tutorial.setup')}>
          {t('tutorial.setup.desc')}
        </GlassCard>

        <GlassCard icon="🃏" title={t('tutorial.community')}>
          {t('tutorial.community.desc')}
        </GlassCard>

        <GlassCard icon="🏆" title={t('tutorial.goal')}>
          {t('tutorial.goal.desc')}
        </GlassCard>

        <GlassCard icon="🔄" title={t('tutorial.rounds')}>
          {t('tutorial.rounds.desc')}
        </GlassCard>

        <GlassCard icon="👆" title={t('tutorial.actions')}>
          {t('tutorial.actions.desc')}
        </GlassCard>

        <GlassCard icon="💰" title={t('tutorial.winning')}>
          {t('tutorial.winning.desc')}
        </GlassCard>

        <GlassCard icon="🎲" title={t('tutorial.blinds')}>
          {t('tutorial.blinds.desc')}
        </GlassCard>

        {/* Hand Rankings */}
        <Text style={styles.sectionTitle}>{t('tutorial.rankings')}</Text>
        <Text style={styles.sectionSubtitle}>{t('tutorial.rankings.sub')}</Text>

        <RankCard
          name={t('tutorial.royalFlush')}
          desc={t('tutorial.royalFlush.desc')}
          cards={[
            { rank: 'A', suit: '♥', red: true },
            { rank: 'K', suit: '♥', red: true },
            { rank: 'Q', suit: '♥', red: true },
            { rank: 'J', suit: '♥', red: true },
            { rank: '10', suit: '♥', red: true },
          ]}
        />

        <RankCard
          name={t('tutorial.straightFlush')}
          desc={t('tutorial.straightFlush.desc')}
          cards={[
            { rank: '8', suit: '♠' },
            { rank: '7', suit: '♠' },
            { rank: '6', suit: '♠' },
            { rank: '5', suit: '♠' },
            { rank: '4', suit: '♠' },
          ]}
        />

        <RankCard
          name={t('tutorial.fourKind')}
          desc={t('tutorial.fourKind.desc')}
          cards={[
            { rank: '9', suit: '♥', red: true },
            { rank: '9', suit: '♦', red: true },
            { rank: '9', suit: '♠' },
            { rank: '9', suit: '♣' },
            { rank: 'K', suit: '♥', red: true },
          ]}
        />

        <RankCard
          name={t('tutorial.fullHouse')}
          desc={t('tutorial.fullHouse.desc')}
          cards={[
            { rank: 'J', suit: '♠' },
            { rank: 'J', suit: '♥', red: true },
            { rank: 'J', suit: '♦', red: true },
            { rank: '5', suit: '♣' },
            { rank: '5', suit: '♠' },
          ]}
        />

        <RankCard
          name={t('tutorial.flush')}
          desc={t('tutorial.flush.desc')}
          cards={[
            { rank: 'A', suit: '♣' },
            { rank: 'Q', suit: '♣' },
            { rank: '9', suit: '♣' },
            { rank: '6', suit: '♣' },
            { rank: '3', suit: '♣' },
          ]}
        />

        <RankCard
          name={t('tutorial.straight')}
          desc={t('tutorial.straight.desc')}
          cards={[
            { rank: '10', suit: '♠' },
            { rank: '9', suit: '♥', red: true },
            { rank: '8', suit: '♦', red: true },
            { rank: '7', suit: '♣' },
            { rank: '6', suit: '♠' },
          ]}
        />

        <RankCard
          name={t('tutorial.threeKind')}
          desc={t('tutorial.threeKind.desc')}
          cards={[
            { rank: '7', suit: '♥', red: true },
            { rank: '7', suit: '♦', red: true },
            { rank: '7', suit: '♣' },
            { rank: 'K', suit: '♠' },
            { rank: '2', suit: '♦', red: true },
          ]}
        />

        <RankCard
          name={t('tutorial.twoPair')}
          desc={t('tutorial.twoPair.desc')}
          cards={[
            { rank: 'Q', suit: '♠' },
            { rank: 'Q', suit: '♥', red: true },
            { rank: '8', suit: '♦', red: true },
            { rank: '8', suit: '♣' },
            { rank: '3', suit: '♠' },
          ]}
        />

        <RankCard
          name={t('tutorial.onePair')}
          desc={t('tutorial.onePair.desc')}
          cards={[
            { rank: 'A', suit: '♥', red: true },
            { rank: 'A', suit: '♦', red: true },
            { rank: 'J', suit: '♠' },
            { rank: '7', suit: '♣' },
            { rank: '4', suit: '♠' },
          ]}
        />

        <RankCard
          name={t('tutorial.highCard')}
          desc={t('tutorial.highCard.desc')}
          cards={[
            { rank: 'A', suit: '♥', red: true },
            { rank: 'J', suit: '♠' },
            { rank: '8', suit: '♦', red: true },
            { rank: '5', suit: '♣' },
            { rank: '2', suit: '♥', red: true },
          ]}
        />

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
    borderBottomColor: 'rgba(161, 221, 156, 0.2)',
    backgroundColor: 'rgba(17, 19, 24, 0.7)',
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.tertiary,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.tertiary,
    letterSpacing: 1.5,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: COLORS.onSurfaceVariant,
    marginBottom: SPACING.md,
  },
  glassCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.outline,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(161, 221, 156, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.onSurface,
  },
  cardBody: {
    fontSize: 14,
    color: COLORS.onSurfaceVariant,
    lineHeight: 20,
  },
  rankCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.outline,
  },
  rankContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  rankInfo: {
    flex: 1,
  },
  rankName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.onSurface,
    marginBottom: 2,
  },
  rankDesc: {
    fontSize: 12,
    color: COLORS.onSurfaceVariant,
  },
  miniCards: {
    flexDirection: 'row',
    gap: 2,
  },
  miniCard: {
    backgroundColor: '#cdd6f4',
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 0.5,
    borderColor: '#b0b8cf',
    width: 36,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  miniRank: {
    fontSize: 12,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
});
