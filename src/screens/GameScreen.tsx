import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, BORDER_RADIUS, SPACING, TABLE_COLORS } from '../constants/theme';
import { useGameStore } from '../store/gameStore';
import { ActionType } from '../game/types';
import { formatChips } from '../utils/format';
import PokerCard from '../components/PokerCard';
import PlayerSeat from '../components/PlayerSeat';
import GameStatusBanner from '../components/GameStatusBanner';
import ShowdownModal from '../components/ShowdownModal';
import RaiseSlider from '../components/RaiseSlider';

export default function GameScreen() {
  const navigation = useNavigation<any>();
  const {
    players,
    communityCards,
    pot,
    currentBet,
    phase,
    currentPlayerIndex,
    dealerIndex,
    winner,
    winners,
    winningHand,
    potAwards,
    isPlayerTurn,
    minRaise,
    handCount,
    botActionMessage,
    startHand,
    playerAction,
    nextHand,
  } = useGameStore();

  const [showRaiseSlider, setShowRaiseSlider] = useState(false);

  const player = players[0];
  const playerBet = player?.currentBet || 0;
  const callAmount = Math.min(Math.max(currentBet - playerBet, 0), player?.chips || 0);
  const canCheck = currentBet <= playerBet;
  const chipsAfterCall = Math.max((player?.chips || 0) - callAmount, 0);
  const canRaise = chipsAfterCall >= minRaise;
  const raisePreview = canRaise ? Math.min(Math.max(minRaise * 3, minRaise), chipsAfterCall) : 0;

  useEffect(() => {
    startHand();
  }, []);

  const handleAction = useCallback((action: ActionType) => {
    if (action === 'raise') {
      setShowRaiseSlider(true);
      return;
    }
    playerAction(action);
  }, [playerAction]);

  const handleRaiseConfirm = useCallback((amount: number) => {
    setShowRaiseSlider(false);
    playerAction('raise', amount);
  }, [playerAction]);

  const handleRaiseCancel = useCallback(() => setShowRaiseSlider(false), []);

  const handleBack = useCallback(() => {
    if (phase !== 'idle' && phase !== 'showdown') {
      Alert.alert(
        'Leave Game?',
        'Your current hand will be lost.',
        [
          { text: 'Stay', style: 'cancel' },
          { text: 'Leave', style: 'destructive', onPress: () => {
            nextHand();
            navigation.goBack();
          }},
        ]
      );
    } else {
      nextHand();
      navigation.goBack();
    }
  }, [phase, navigation, nextHand]);

  const handleNextHand = useCallback(() => {
    nextHand();
    setTimeout(() => startHand(), 100);
  }, [nextHand, startHand]);

  const handleQuit = useCallback(() => {
    nextHand();
    navigation.goBack();
  }, [nextHand, navigation]);

  const callAction = canCheck ? 'check' : 'call';

  const actionBar = phase !== 'showdown' && phase !== 'idle' ? (
    <View style={styles.actionBar}>
      <View style={styles.sliderRow}>
        <Text style={[styles.sliderLabel, !isPlayerTurn && styles.disabledText]}>MIN</Text>
        <View style={styles.sliderTrackStatic}>
          <View style={[styles.sliderFillStatic, { width: `${Math.min(100, Math.max(0, (currentBet / 200) * 100))}%` }]} />
        </View>
        <TouchableOpacity onPress={() => handleAction('all_in')} disabled={!isPlayerTurn}>
          <Text style={[styles.sliderLabel, !isPlayerTurn && styles.disabledText]}>MAX</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.betButton, !isPlayerTurn && styles.disabled]}
          onPress={() => handleAction('fold')}
          disabled={!isPlayerTurn}
          activeOpacity={0.75}
        >
          <Text style={[styles.betButtonText, { color: COLORS.onSurface }]}>Fold</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.betButton,
            !isPlayerTurn && styles.disabled,
          ]}
          onPress={() => handleAction(callAction)}
          disabled={!isPlayerTurn}
          activeOpacity={0.75}
        >
          <Text style={styles.betButtonText}>{canCheck ? 'Check' : 'Call'}</Text>
          {!canCheck && <Text style={styles.betButtonSub}>{formatChips(callAmount)}</Text>}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.raiseButton, (!isPlayerTurn || !canRaise) && styles.disabled]}
          onPress={() => handleAction('raise')}
          disabled={!isPlayerTurn || !canRaise}
          activeOpacity={0.75}
        >
          <Text style={styles.raiseButtonText}>Raise</Text>
          {canRaise && <Text style={styles.raiseButtonSub}>{formatChips(raisePreview)}</Text>}
        </TouchableOpacity>
      </View>
    </View>
  ) : null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.surface} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIconBtn} onPress={handleBack}>
          <MaterialIcons name="menu" size={28} color={COLORS.onSurfaceVariant} />
        </TouchableOpacity>
          <Text style={styles.headerTitle}>Mocha River</Text>
        <TouchableOpacity style={styles.headerIconBtn} onPress={() => navigation.navigate('Settings')}>
          <MaterialIcons name="settings" size={28} color={COLORS.onSurfaceVariant} />
        </TouchableOpacity>
      </View>

      {/* Game area */}
      <View style={styles.gameArea}>
        {/* Oval table */}
        <View style={[styles.tableOval, { borderColor: TABLE_COLORS.border }]}>
          <View style={[styles.tableGradientOuter, { backgroundColor: TABLE_COLORS.bg }]}>
            <View style={styles.tableGradientMid} />
            <View style={styles.tableGradientInner} />
          </View>
          {/* Bot Top */}
          <View style={styles.botTop}>
            <PlayerSeat
              player={players[2]}
              isCurrentPlayer={currentPlayerIndex === 2}
              isDealer={dealerIndex === 2}
              position="top"
              showCards={phase === 'showdown'}
              botAction={botActionMessage?.playerIndex === 2 ? botActionMessage.text : null}
            />
          </View>

          {/* Bot Left */}
          <View style={styles.botLeft}>
            <PlayerSeat
              player={players[1]}
              isCurrentPlayer={currentPlayerIndex === 1}
              isDealer={dealerIndex === 1}
              position="left"
              showCards={phase === 'showdown'}
              botAction={botActionMessage?.playerIndex === 1 ? botActionMessage.text : null}
            />
          </View>

          {/* Bot Right */}
          <View style={styles.botRight}>
            <PlayerSeat
              player={players[3]}
              isCurrentPlayer={currentPlayerIndex === 3}
              isDealer={dealerIndex === 3}
              position="right"
              showCards={phase === 'showdown'}
              botAction={botActionMessage?.playerIndex === 3 ? botActionMessage.text : null}
            />
          </View>

          {/* Table center content */}
          <View style={styles.tableCenter}>
            {/* Pot */}
            <GameStatusBanner phase={phase} pot={pot} handCount={handCount} />

            {/* Community cards */}
            <View style={styles.communityArea}>
              <View style={styles.communityCards}>
                {[0, 1, 2, 3, 4].map(i => (
                  <View key={i} style={styles.communitySlot}>
                    {communityCards[i] ? (
                      <PokerCard card={communityCards[i]} small />
                    ) : phase !== 'idle' && phase !== 'preflop' && i < 3 ? (
                      <View style={styles.emptyCard} />
                    ) : null}
                  </View>
                ))}
              </View>
            </View>

            {/* Current bet */}
            {currentBet > 0 && (
              <View style={styles.currentBetRow}>
                <Text style={styles.currentBetText}>Current Bet: {formatChips(currentBet)}</Text>
              </View>
            )}
          </View>

          {/* Player hole cards at bottom of table */}
          {phase !== 'idle' && player && player.holeCards.length === 2 && (
            <View style={styles.playerCards}>
              <View style={styles.playerCardLeft}>
                <PokerCard card={player.holeCards[0]} />
              </View>
              <View style={styles.playerCardRight}>
                <PokerCard card={player.holeCards[1]} />
              </View>
            </View>
          )}
        </View>

        {/* Player seat below table */}
        <View style={styles.playerBottom}>
          <PlayerSeat
            player={player}
            isCurrentPlayer={currentPlayerIndex === 0}
            isDealer={dealerIndex === 0}
            position="bottom"
            showCards={true}
          />
        </View>
      </View>

      {/* Action bar */}
      {phase === 'showdown' ? (
        <View style={styles.actionBar}>
          <TouchableOpacity style={styles.continueBtn} onPress={handleNextHand} activeOpacity={0.8}>
            <Text style={styles.continueBtnText}>Continue</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quitBtn} onPress={handleQuit} activeOpacity={0.7}>
            <Text style={styles.quitBtnText}>Quit</Text>
          </TouchableOpacity>
        </View>
      ) : actionBar}

      {/* Raise overlay */}
      {showRaiseSlider && (
        <View style={styles.raiseOverlay}>
          <RaiseSlider
            min={minRaise}
            max={chipsAfterCall}
            onConfirm={handleRaiseConfirm}
            onCancel={handleRaiseCancel}
          />
        </View>
      )}

      {/* Showdown modal */}
      <ShowdownModal
        visible={phase === 'showdown' && winner !== null}
        winner={winner}
        winners={winners}
        winningHand={winningHand}
        potAwards={potAwards}
        players={players}
        communityCards={communityCards}
        onNextHand={handleNextHand}
        onQuit={handleQuit}
      />
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
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.sm,
    backgroundColor: 'rgba(17, 19, 24, 0.78)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(181, 207, 255, 0.22)',
  },
  headerIconBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.mochaPeach,
    textAlign: 'center',
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm + 10,
    paddingTop: SPACING.xl + 10,
  },
  tableOval: {
    width: '100%',
    maxWidth: 340,
    aspectRatio: 4 / 5,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'visible',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 24,
    elevation: 10,
    borderWidth: 14,
    borderColor: '#171827',
  },
  tableGradientOuter: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    borderRadius: 86,
  },
  tableGradientMid: {
    position: 'absolute',
    top: '15%',
    left: '15%',
    right: '15%',
    bottom: '15%',
    borderRadius: 70,
    backgroundColor: 'rgba(49,50,68,0.6)',
  },
  tableGradientInner: {
    position: 'absolute',
    top: '30%',
    left: '30%',
    right: '30%',
    bottom: '30%',
    borderRadius: 50,
    backgroundColor: 'rgba(49,50,68,0.3)',
  },
  tableCenter: {
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  botTop: {
    position: 'absolute',
    top: -54,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 5,
  },
  botLeft: {
    position: 'absolute',
    left: -54,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 5,
  },
  botRight: {
    position: 'absolute',
    right: -54,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 5,
  },
  communityArea: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  communityCards: {
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  communitySlot: {
    width: 48,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCard: {
    width: 44,
    height: 64,
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
    borderStyle: 'dashed',
  },
  currentBetRow: {
    marginTop: SPACING.xs,
  },
  currentBetText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  playerCards: {
    position: 'absolute',
    bottom: -20,
    flexDirection: 'row',
    gap: 0,
    zIndex: 10,
  },
  playerCardLeft: {
    transform: [{ rotate: '-6deg' }, { translateY: 8 }],
  },
  playerCardRight: {
    transform: [{ rotate: '6deg' }],
  },
  playerBottom: {
    marginTop: SPACING.xl + 16,
    alignItems: 'center',
  },
  actionBar: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.lg,
    backgroundColor: 'rgba(17, 19, 24, 0.92)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(137, 180, 250, 0.45)',
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
  },
  actionRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.xs,
  },
  sliderLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.onSurfaceVariant,
    letterSpacing: 1.5,
  },
  sliderTrackStatic: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.surfaceHighest,
    borderWidth: 1,
    borderColor: 'rgba(141,145,155,0.45)',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  sliderFillStatic: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    opacity: 0.4,
  },
  betButton: {
    flex: 1,
    minHeight: 74,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surfaceHighest,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  raiseButton: {
    flex: 1.45,
    minHeight: 74,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  betButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.onSurface,
  },
  betButtonSub: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  raiseButtonText: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.onPrimary,
  },
  raiseButtonSub: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.onPrimaryContainer,
  },
  disabled: {
    opacity: 0.35,
  },
  disabledText: {
    opacity: 0.35,
  },
  continueBtn: {
    backgroundColor: COLORS.mochaPeach,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
    shadowColor: COLORS.mochaPeach,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: SPACING.xs,
  },
  continueBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.surface,
  },
  quitBtn: {
    paddingVertical: SPACING.sm,
    alignItems: 'center',
  },
  quitBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.onSurfaceVariant,
  },
  raiseOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    padding: SPACING.lg,
  },
});
