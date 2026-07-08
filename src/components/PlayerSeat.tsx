import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Player } from '../game/types';
import { COLORS, BORDER_RADIUS, SPACING } from '../constants/theme';
import { formatChips } from '../utils/format';
import PokerCard from './PokerCard';

interface Props {
  player: Player;
  isCurrentPlayer: boolean;
  isDealer: boolean;
  position: 'bottom' | 'left' | 'top' | 'right';
  showCards?: boolean;
  botAction?: string | null;
}

const PlayerSeat: React.FC<Props> = React.memo(({
  player,
  isCurrentPlayer,
  isDealer,
  position,
  showCards,
  botAction,
}) => {
  const isActive = !player.folded && !player.isAllIn;
  const initials = player.isBot ? player.name.replace('Bot ', '').slice(0, 1) : 'P';
  const avatarColors = ['#2a2024', '#182034', '#2a251d', '#241f30'];
  const avatarColor = avatarColors[player.index % avatarColors.length];

  return (
    <View style={[styles.container, position === 'bottom' && styles.containerBottom, isCurrentPlayer && isActive && styles.active]}>
      {/* Dealer badge */}
      {isDealer && (
        <View style={styles.dealerBadge}>
          <Text style={styles.dealerText}>D</Text>
        </View>
      )}

      {/* Avatar */}
      <View style={[styles.avatar, { backgroundColor: avatarColor }, isCurrentPlayer && isActive && styles.avatarActiveGlow]}>
        <View style={styles.avatarInner}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.avatarHighlight} />
      </View>

      {/* Name */}
      {position !== 'bottom' && <Text style={styles.name} numberOfLines={1}>{player.name}</Text>}

      {/* Bot action text */}
      {botAction && (
        <View style={[
          styles.actionBadge,
          botAction.startsWith('FOLD') && styles.actionFold,
          botAction.startsWith('CHECK') && styles.actionCheck,
          botAction.startsWith('CALL') && styles.actionCall,
          botAction.startsWith('RAISE') && styles.actionRaise,
          botAction.startsWith('ALL-IN') && styles.actionAllIn,
        ]}>
          <Text style={[
            styles.actionText,
            botAction.startsWith('FOLD') && styles.actionTextDark,
            botAction.startsWith('ALL-IN') && styles.actionTextDark,
          ]}>{botAction}</Text>
        </View>
      )}

      {/* Current-turn label */}
      {isCurrentPlayer && isActive && (
        <Text style={[styles.turnText, position === 'bottom' && styles.turnTextBottom]}>
          {position === 'bottom' ? 'YOUR TURN' : 'TURN'}
        </Text>
      )}

      {/* Chip count */}
      <View style={styles.chipBadge}>
        <Text style={styles.chipIcon}>$</Text>
        <Text style={styles.chipText}>{formatChips(player.chips)}</Text>
      </View>

      {/* Current bet */}
      {player.currentBet > 0 && (
        <View style={styles.betBadge}>
          <Text style={styles.betText}>{formatChips(player.currentBet)}</Text>
        </View>
      )}

      {/* Status indicators */}
      {player.isAllIn && <Text style={styles.statusText}>ALL IN</Text>}
      {player.folded && <Text style={styles.foldedText}>Folded</Text>}

      {/* Hole cards (skip bottom/player — already rendered in game table) */}
      {position !== 'bottom' && (showCards || !player.isBot) && player.holeCards.length === 2 && (
        <View style={styles.cards}>
          <PokerCard card={player.holeCards[0]} small />
          <PokerCard card={player.holeCards[1]} small />
        </View>
      )}
      {position !== 'bottom' && !showCards && player.isBot && isActive && player.holeCards.length === 2 && (
        <View style={styles.cards}>
          <PokerCard card={player.holeCards[0]} hidden small />
          <PokerCard card={player.holeCards[1]} hidden small />
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: SPACING.xs,
    borderRadius: BORDER_RADIUS.lg,
    minWidth: 70,
    position: 'relative',
  },
  containerBottom: {
    minWidth: 120,
  },
  active: {
    backgroundColor: 'transparent',
  },
  dealerBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.mochaPeach,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  dealerText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.surface,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: 'rgba(226,226,232,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
    overflow: 'hidden',
  },
  avatarActiveGlow: {
    borderColor: COLORS.primary,
    shadowColor: COLORS.primaryContainer,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 22,
    elevation: 12,
  },
  avatarInner: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderWidth: 1,
    borderColor: 'rgba(250,179,135,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarHighlight: {
    position: 'absolute',
    top: 4,
    left: 8,
    width: 18,
    height: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
  },
  name: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.onSurface,
    marginBottom: 2,
    maxWidth: 70,
    textAlign: 'center',
  },
  chipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceHighest,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(141,145,155,0.45)',
    gap: 5,
  },
  chipIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    color: COLORS.primary,
    textAlign: 'center',
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '800',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.onSurface,
  },
  betBadge: {
    marginTop: 2,
    backgroundColor: COLORS.primaryContainer,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: BORDER_RADIUS.sm,
  },
  betText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.onPrimaryContainer,
  },
  statusText: {
    fontSize: 8,
    fontWeight: '700',
    color: COLORS.mochaRed,
    marginTop: 2,
  },
  foldedText: {
    fontSize: 9,
    fontWeight: '600',
    color: COLORS.onSurfaceVariant,
    marginTop: 2,
  },
  turnText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginVertical: 4,
  },
  turnTextBottom: {
    marginTop: 8,
  },
  actionBadge: {
    marginTop: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
    maxWidth: 120,
  },
  actionFold: {
    backgroundColor: 'rgba(127, 132, 141, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(127, 132, 141, 0.5)',
  },
  actionCheck: {
    backgroundColor: 'rgba(137, 180, 250, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(137, 180, 250, 0.4)',
  },
  actionCall: {
    backgroundColor: 'rgba(166, 227, 161, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(166, 227, 161, 0.4)',
  },
  actionRaise: {
    backgroundColor: 'rgba(243, 139, 168, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(243, 139, 168, 0.4)',
  },
  actionAllIn: {
    backgroundColor: 'rgba(250, 179, 135, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(250, 179, 135, 0.4)',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  actionTextDark: {
    color: COLORS.onSurfaceVariant,
  },
  cards: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 4,
  },
});

export default PlayerSeat;
