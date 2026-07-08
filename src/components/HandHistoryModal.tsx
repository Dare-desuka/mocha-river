import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { Player, HandEvaluation, PotAward, Card, BLIND_LEVELS } from '../game/types';
import { COLORS, BORDER_RADIUS, SPACING } from '../constants/theme';
import { formatChips } from '../utils/format';
import { getHandName } from '../game/handEvaluator';
import { SUIT_SYMBOLS, SUIT_COLORS } from '../game/types';
import PokerCard from './PokerCard';

interface Props {
  visible: boolean;
  handCount: number;
  blindLevel: number;
  communityCards: Card[];
  players: Player[];
  winners: Player[];
  winningHand: HandEvaluation | null;
  potAwards: PotAward[];
  actionLog: string[];
  onClose: () => void;
}

const HandHistoryModal: React.FC<Props> = ({
  visible, handCount, blindLevel, communityCards, players,
  winners, winningHand, potAwards, actionLog, onClose,
}) => {
  const winnerIndexes = new Set(winners.map(p => p.index));
  const blind = BLIND_LEVELS[blindLevel] || BLIND_LEVELS[BLIND_LEVELS.length - 1];

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Hand #{handCount}</Text>
          <Text style={styles.blindText}>Blinds {blind.small}/{blind.big}</Text>

          {communityCards.length > 0 && (
            <View style={styles.boardSection}>
              <Text style={styles.label}>Community Cards</Text>
              <View style={styles.boardCards}>
                {communityCards.map((card, i) => (
                  <PokerCard key={i} card={card} small />
                ))}
              </View>
            </View>
          )}

          {winningHand && (
            <View style={styles.handBadge}>
              <Text style={styles.handText}>{getHandName(winningHand)}</Text>
            </View>
          )}

          <ScrollView style={styles.playerList} showsVerticalScrollIndicator={false}>
            {players.filter(p => !p.folded || winnerIndexes.has(p.index)).map(player => {
              const isWinner = winnerIndexes.has(player.index);
              const winnings = potAwards
                .filter(a => a.winnerIndexes.includes(player.index))
                .reduce((s, a) => s + Math.floor(a.amount / a.winnerIndexes.length), 0);
              return (
                <View key={player.index} style={[styles.playerRow, isWinner && styles.winnerRow]}>
                  <Text style={[styles.playerName, isWinner && styles.winnerName]}>{player.name}</Text>
                  {player.holeCards.length === 2 && (
                    <View style={styles.cards}>
                      {player.holeCards.map((card, i) => (
                        <PokerCard key={i} card={card} small />
                      ))}
                    </View>
                  )}
                  {isWinner ? (
                    <Text style={styles.winAmount}>+{formatChips(winnings)}</Text>
                  ) : (
                    <Text style={styles.loseText}>{player.folded ? 'Folded' : formatChips(player.chips)}</Text>
                  )}
                </View>
              );
            })}
          </ScrollView>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: COLORS.overlay,
    justifyContent: 'center', alignItems: 'center',
  },
  modal: {
    backgroundColor: COLORS.glassBg,
    borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg,
    width: '88%', maxHeight: '80%', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(250,179,135,0.3)',
  },
  title: { fontSize: 22, fontWeight: '700', color: COLORS.mochaPeach, marginBottom: 2 },
  blindText: { fontSize: 12, fontWeight: '600', color: COLORS.onSurfaceVariant, marginBottom: SPACING.md },
  label: { fontSize: 11, fontWeight: '700', color: COLORS.onSurfaceVariant, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: SPACING.sm },
  boardSection: { alignItems: 'center', marginBottom: SPACING.md },
  boardCards: { flexDirection: 'row', gap: SPACING.xs },
  handBadge: {
    backgroundColor: 'rgba(250,179,135,0.15)', borderWidth: 1,
    borderColor: 'rgba(250,179,135,0.4)', paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.full, marginBottom: SPACING.md,
  },
  handText: { fontSize: 14, fontWeight: '600', color: COLORS.mochaPeach },
  playerList: { width: '100%', marginBottom: SPACING.md },
  playerRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: SPACING.sm, paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.md, marginBottom: SPACING.xs,
    backgroundColor: 'rgba(255,255,255,0.03)', gap: SPACING.sm,
  },
  winnerRow: { backgroundColor: 'rgba(137,180,250,0.1)', borderWidth: 1, borderColor: COLORS.primaryContainer },
  playerName: { fontSize: 13, fontWeight: '600', color: COLORS.onSurface, flex: 1 },
  winnerName: { color: COLORS.primaryContainer },
  cards: { flexDirection: 'row', gap: 2 },
  winAmount: { fontSize: 12, fontWeight: '700', color: COLORS.tertiary },
  loseText: { fontSize: 12, fontWeight: '600', color: COLORS.onSurfaceVariant },
  closeBtn: {
    backgroundColor: COLORS.mochaPeach, paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm + 4, borderRadius: BORDER_RADIUS.full,
    width: '100%', alignItems: 'center',
  },
  closeText: { fontSize: 16, fontWeight: '700', color: COLORS.surface },
});

export default HandHistoryModal;
