import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import { Player, HandEvaluation, PotAward } from '../game/types';
import { COLORS, BORDER_RADIUS, SPACING } from '../constants/theme';
import { formatChips } from '../utils/format';
import { getHandName } from '../game/handEvaluator';
import PokerCard from './PokerCard';

interface Props {
  visible: boolean;
  winner: Player | null;
  winners: Player[];
  winningHand: HandEvaluation | null;
  potAwards: PotAward[];
  players: Player[];
  communityCards: Player['holeCards'];
  onNextHand: () => void;
}

const ShowdownModal: React.FC<Props> = ({
  visible,
  winner,
  winners,
  winningHand,
  potAwards,
  players,
  communityCards,
  onNextHand,
}) => {
  const [countdown, setCountdown] = useState(5);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoAdvanceRef = useRef(false);

  const winnerIndexes = new Set((winners.length > 0 ? winners : winner ? [winner] : []).map(p => p.index));
  const winningsByPlayer = potAwards.reduce<Record<number, number>>((acc, award) => {
    const share = Math.floor(award.amount / award.winnerIndexes.length);
    const remainder = award.amount % award.winnerIndexes.length;
    award.winnerIndexes.forEach((playerIndex, i) => {
      acc[playerIndex] = (acc[playerIndex] || 0) + share + (i < remainder ? 1 : 0);
    });
    return acc;
  }, {});
  const totalWinnings = Object.values(winningsByPlayer).reduce((sum, amount) => sum + amount, 0);

  const handleNextHand = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    onNextHand();
  };

  useEffect(() => {
    if (visible) {
      autoAdvanceRef.current = false;
      setCountdown(5);

      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.08, duration: 500, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        ])
      ).start();

      timerRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            if (!autoAdvanceRef.current) {
              autoAdvanceRef.current = true;
              setTimeout(() => onNextHand(), 100);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    } else {
      setCountdown(5);
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Animated.Text style={[styles.winnerLabel, { transform: [{ scale: pulseAnim }] }]}>
            {winnerIndexes.size > 1 ? 'WINNERS' : 'WINNER'}
          </Animated.Text>

          {winnerIndexes.size > 0 && (
            <Text style={styles.winnerName}>
              {players.filter(p => winnerIndexes.has(p.index)).map(p => p.name).join(', ')}
            </Text>
          )}

          {winningHand && (
            <View style={styles.handBadge}>
              <Text style={styles.handText}>{getHandName(winningHand)}</Text>
            </View>
          )}

          {totalWinnings > 0 && (
            <Text style={styles.payoutText}>+ {formatChips(totalWinnings)}</Text>
          )}

          {communityCards.length > 0 && (
            <View style={styles.boardSection}>
              <Text style={styles.boardLabel}>Community Cards</Text>
              <View style={styles.boardCards}>
                {communityCards.map((card, i) => (
                  <PokerCard key={`${card.rank}-${card.suit}-${i}`} card={card} small />
                ))}
              </View>
            </View>
          )}

          <ScrollView style={styles.playerList} showsVerticalScrollIndicator={false}>
            {players.filter(p => !p.folded).map(player => {
              const isWinner = winnerIndexes.has(player.index);
              const winnings = winningsByPlayer[player.index] || 0;
              const initials = player.isBot ? player.name.replace('Bot ', '').slice(0, 1) : 'P';
              return (
                <View key={player.index} style={[
                  styles.playerRow,
                  isWinner && styles.winnerRow,
                  !isWinner && styles.loserRow,
                ]}>
                  <View style={[styles.avatar, isWinner && styles.avatarWinnerBorder, !isWinner && styles.avatarLoser]}>
                    <Text style={[styles.avatarText, !isWinner && styles.avatarTextLoser]}>{initials}</Text>
                  </View>
                  <View style={styles.playerInfo}>
                    <Text style={[styles.playerName, isWinner && styles.winnerNameText, !isWinner && styles.loserNameText]}>
                      {player.name}
                      {!player.isBot ? ' (You)' : ''}
                    </Text>
                  </View>
                  <Text style={[styles.playerChips, !isWinner && styles.noWinnings]}>
                    {isWinner ? `+${formatChips(winnings)}` : formatChips(player.chips)}
                  </Text>
                  <View style={[styles.cards, !isWinner && styles.cardsLoser]}>
                    {player.holeCards.map((card, i) => (
                      <PokerCard key={i} card={card} small />
                    ))}
                  </View>
                </View>
              );
            })}
          </ScrollView>

          <View style={styles.footerRow}>
            <TouchableOpacity style={styles.button} onPress={handleNextHand} activeOpacity={0.8}>
              <Text style={styles.buttonText}>Next Hand</Text>
            </TouchableOpacity>
            {countdown > 0 && (
              <Text style={styles.countdownText}>Auto in {countdown}s</Text>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: COLORS.glassBg,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    width: '88%',
    maxHeight: '80%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(250, 179, 135, 0.3)',
    shadowColor: COLORS.mochaPeach,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
    zIndex: 10,
  },
  winnerLabel: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.mochaPeach,
    textTransform: 'uppercase',
    letterSpacing: 2,
    textShadowColor: COLORS.mochaPeach,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  winnerName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.onSurface,
    marginTop: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  handBadge: {
    backgroundColor: 'rgba(250, 179, 135, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(250, 179, 135, 0.4)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.md,
  },
  handText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.mochaPeach,
  },
  payoutText: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.mochaPeach,
    marginBottom: SPACING.md,
  },
  boardSection: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  boardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.onSurfaceVariant,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
  },
  boardCards: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  playerList: {
    width: '100%',
    marginBottom: SPACING.sm,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xs,
    backgroundColor: 'rgba(255,255,255,0.03)',
    gap: SPACING.sm,
  },
  winnerRow: {
    backgroundColor: 'rgba(137, 180, 250, 0.1)',
    borderWidth: 1,
    borderColor: COLORS.primaryContainer,
  },
  loserRow: {
    opacity: 0.7,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#242638',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.outline,
  },
  avatarWinnerBorder: {
    borderColor: COLORS.primaryContainer,
    shadowColor: COLORS.primaryContainer,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarLoser: {
    borderColor: COLORS.outlineVariant,
    opacity: 0.6,
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primary,
  },
  avatarTextLoser: {
    color: COLORS.outline,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.onSurface,
  },
  winnerNameText: {
    color: COLORS.primaryContainer,
  },
  loserNameText: {
    color: COLORS.onSurfaceVariant,
  },
  playerChips: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.tertiary,
  },
  noWinnings: {
    color: COLORS.onSurfaceVariant,
  },
  cards: {
    flexDirection: 'row',
    gap: 2,
  },
  cardsLoser: {
    opacity: 0.5,
  },
  footerRow: {
    width: '100%',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  button: {
    backgroundColor: COLORS.mochaPeach,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm + 4,
    borderRadius: BORDER_RADIUS.full,
    width: '100%',
    alignItems: 'center',
    shadowColor: COLORS.mochaPeach,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.surface,
  },
  countdownText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.onSurfaceVariant,
    letterSpacing: 0.5,
  },
});

export default ShowdownModal;
