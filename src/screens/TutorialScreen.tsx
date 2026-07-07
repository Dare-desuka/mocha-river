import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, BORDER_RADIUS, SPACING } from '../constants/theme';

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
  isTop?: boolean;
  faded?: boolean;
}

function RankCard({ name, desc, cards, isTop, faded }: RankCardProps) {
  return (
    <View style={[styles.rankCard, isTop && styles.rankCardTop, faded && styles.rankCardFaded]}>
      <View style={styles.rankContent}>
        <View style={styles.rankInfo}>
          <Text style={[styles.rankName, isTop && styles.rankNameTop]}>{name}</Text>
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

  return (
    <LinearGradient colors={['#0a1a0a', '#111318', '#111318']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.surface} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.tertiary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tutorial</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Basics Section */}
        <Text style={styles.sectionTitle}>TEXAS HOLD'EM BASICS</Text>

        <GlassCard icon="🎴" title="1. The Setup">
          Every player is dealt two private cards, known as 'hole cards'. These belong exclusively to the player.
        </GlassCard>

        <GlassCard icon="🃏" title="2. Community Cards">
          Five community cards are dealt face up on the table in three stages: The Flop (3 cards), The Turn (1 card), and The River (1 card).
        </GlassCard>

        <GlassCard icon="🏆" title="3. The Goal">
          Make the best five-card poker hand using any combination of your two hole cards and the five community cards.
        </GlassCard>

        {/* Hand Rankings */}
        <Text style={styles.sectionTitle}>HAND RANKINGS</Text>
        <Text style={styles.sectionSubtitle}>Ranked from strongest to weakest.</Text>

        <RankCard
          name="Royal Flush"
          desc="A, K, Q, J, 10, all the same suit."
          cards={[
            { rank: 'A', suit: '♥', red: true },
            { rank: 'K', suit: '♥', red: true },
            { rank: 'Q', suit: '♥', red: true },
            { rank: 'J', suit: '♥', red: true },
            { rank: '10', suit: '♥', red: true },
          ]}
          isTop
        />

        <RankCard
          name="Straight Flush"
          desc="Five cards in sequence, same suit."
          cards={[
            { rank: '8', suit: '♠' },
            { rank: '7', suit: '♠' },
            { rank: '6', suit: '♠' },
            { rank: '5', suit: '♠' },
            { rank: '4', suit: '♠' },
          ]}
        />

        <RankCard
          name="Four of a Kind"
          desc="All four cards of the same rank."
          cards={[
            { rank: '9', suit: '♥', red: true },
            { rank: '9', suit: '♦', red: true },
            { rank: '9', suit: '♠' },
            { rank: '9', suit: '♣' },
            { rank: 'K', suit: '♥', red: true },
          ]}
        />

        <RankCard
          name="Full House"
          desc="Three of a kind + One pair."
          cards={[
            { rank: 'J', suit: '♠' },
            { rank: 'J', suit: '♥', red: true },
            { rank: 'J', suit: '♦', red: true },
            { rank: '5', suit: '♣' },
            { rank: '5', suit: '♠' },
          ]}
        />

        <RankCard
          name="Flush"
          desc="Five cards of the same suit."
          cards={[
            { rank: 'A', suit: '♣' },
            { rank: 'Q', suit: '♣' },
            { rank: '9', suit: '♣' },
            { rank: '6', suit: '♣' },
            { rank: '3', suit: '♣' },
          ]}
        />

        <RankCard
          name="Straight"
          desc="Five cards in sequence."
          cards={[
            { rank: '10', suit: '♠' },
            { rank: '9', suit: '♥', red: true },
            { rank: '8', suit: '♦', red: true },
            { rank: '7', suit: '♣' },
            { rank: '6', suit: '♠' },
          ]}
        />

        <RankCard
          name="Three of a Kind"
          desc="Three cards of same rank."
          cards={[
            { rank: '7', suit: '♥', red: true },
            { rank: '7', suit: '♦', red: true },
            { rank: '7', suit: '♣' },
            { rank: 'K', suit: '♠' },
            { rank: '2', suit: '♦', red: true },
          ]}
        />

        <RankCard
          name="Two Pair"
          desc="Two different pairs."
          cards={[
            { rank: 'Q', suit: '♠' },
            { rank: 'Q', suit: '♥', red: true },
            { rank: '8', suit: '♦', red: true },
            { rank: '8', suit: '♣' },
            { rank: '3', suit: '♠' },
          ]}
        />

        <RankCard
          name="One Pair"
          desc="Two cards of same rank."
          cards={[
            { rank: 'A', suit: '♥', red: true },
            { rank: 'A', suit: '♦', red: true },
            { rank: 'J', suit: '♠' },
            { rank: '7', suit: '♣' },
            { rank: '4', suit: '♠' },
          ]}
        />

        <RankCard
          name="High Card"
          desc="Highest card plays."
          cards={[
            { rank: 'A', suit: '♥', red: true },
            { rank: 'J', suit: '♠' },
            { rank: '8', suit: '♦', red: true },
            { rank: '5', suit: '♣' },
            { rank: '2', suit: '♥', red: true },
          ]}
          faded
        />

        <View style={{ height: 40 }} />
      </ScrollView>
    </LinearGradient>
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
    backgroundColor: 'rgba(49, 51, 53, 0.7)',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.tertiary,
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
    backgroundColor: 'rgba(49, 51, 53, 0.7)',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
  },
  rankCardTop: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.tertiary,
  },
  rankCardFaded: {
    opacity: 0.6,
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
  rankNameTop: {
    color: COLORS.tertiary,
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
    backgroundColor: COLORS.surfaceLow,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
    width: 36,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniRank: {
    fontSize: 11,
    fontWeight: '700',
  },
});
