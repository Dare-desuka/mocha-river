import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, BORDER_RADIUS, SPACING, TABLE_THEMES, TABLE_COLORS } from '../constants/theme';
import { useGameStore } from '../store/gameStore';
import { useSettingsStore } from '../store/settingsStore';
import { ActionType, BLIND_LEVELS } from '../game/types';
import { formatChips } from '../utils/format';
import { loadProfile } from '../utils/storage';
import { useT } from '../utils/i18n';
import { startBgm, stopBgm } from '../utils/soundManager';
import PokerCard from '../components/PokerCard';
import PlayerSeat from '../components/PlayerSeat';
import GameStatusBanner from '../components/GameStatusBanner';
import ShowdownModal from '../components/ShowdownModal';
import RaiseSlider from '../components/RaiseSlider';
import HandHistoryModal from '../components/HandHistoryModal';

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
    blindLevel,
    botActions,
    actionLog,
    startHand,
    playerAction,
    nextHand,
    resetGame,
  } = useGameStore();
  const settings = useSettingsStore(s => s.settings);
  const t = useT();

  const tableTheme = TABLE_THEMES.find(t => t.id === settings.tableTheme) || TABLE_THEMES[0];

  const [showRaiseSlider, setShowRaiseSlider] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const player = players[0];
  const activePlayers = players.filter(p => !p.folded).length;
  const playerBet = player?.currentBet || 0;
  const callAmount = Math.min(Math.max(currentBet - playerBet, 0), player?.chips || 0);
  const canCheck = currentBet <= playerBet;
  const chipsAfterCall = Math.max((player?.chips || 0) - callAmount, 0);
  const canRaise = chipsAfterCall >= minRaise;
  const canAllIn = (player?.chips || 0) > 0;

  const blind = BLIND_LEVELS[blindLevel] || BLIND_LEVELS[BLIND_LEVELS.length - 1];

  useEffect(() => {
    startHand();
    loadProfile().then(p => setAvatarUri(p.avatarUri));
    startBgm();
    return stopBgm;
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
      setShowLeaveModal(true);
    } else {
      resetGame();
      navigation.goBack();
    }
  }, [phase, navigation, resetGame]);

  const confirmLeave = useCallback(() => {
    setShowLeaveModal(false);
    resetGame();
    navigation.goBack();
  }, [resetGame, navigation]);

  const cancelLeave = useCallback(() => setShowLeaveModal(false), []);

  const handleContinue = useCallback(() => {
    setGameOver(true);
  }, []);

  const handleDeal = useCallback(() => {
    nextHand();
    setGameOver(false);
    setTimeout(() => startHand(), 100);
  }, [nextHand, startHand]);

  const handleQuit = useCallback(() => {
    resetGame();
    navigation.goBack();
  }, [resetGame, navigation]);

  const callAction = canCheck ? 'check' : 'call';

  const actionBar = phase !== 'showdown' && phase !== 'idle' ? (
    <View style={styles.actionBar}>
      <View style={styles.sliderRow}>
        <Text style={[styles.sliderLabel, !isPlayerTurn && styles.disabledText]}>{t('game.min')}</Text>
        <View style={styles.sliderTrackStatic}>
          <View style={[styles.sliderFillStatic, { width: `${Math.min(100, Math.max(0, (currentBet / 200) * 100))}%` }]} />
        </View>
        <TouchableOpacity onPress={() => handleAction('all_in')} disabled={!isPlayerTurn}>
          <Text style={[styles.sliderLabel, !isPlayerTurn && styles.disabledText]}>{t('game.max')}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.betButton, !isPlayerTurn && styles.disabled]}
          onPress={() => handleAction('fold')}
          disabled={!isPlayerTurn}
          activeOpacity={0.75}
        >
          <Text style={[styles.betButtonText, { color: COLORS.onSurface }]}>{t('game.fold')}</Text>
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
          <Text style={styles.betButtonText}>{canCheck ? t('game.check') : t('game.call')}</Text>
          {!canCheck && <Text style={styles.betButtonSub}>{formatChips(callAmount)}</Text>}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.raiseButton, (!isPlayerTurn || !canRaise) && styles.disabled]}
          onPress={() => handleAction('raise')}
          disabled={!isPlayerTurn || !canRaise}
          activeOpacity={0.75}
        >
          <Text style={styles.raiseButtonText}>{t('game.raise')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.allInButton, (!isPlayerTurn || !canAllIn) && styles.disabled]}
          onPress={() => handleAction('all_in')}
          disabled={!isPlayerTurn || !canAllIn}
          activeOpacity={0.75}
        >
          <Text style={styles.allInButtonText}>{t('game.allIn')}</Text>
          <Text style={styles.allInButtonSub}>{formatChips(player?.chips || 0)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  ) : null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.surface} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: (StatusBar.currentHeight || 28) + 4 }]}>
        <TouchableOpacity style={styles.headerIconBtn} onPress={handleBack}>
          <MaterialIcons name="arrow-back" size={28} color={COLORS.onSurfaceVariant} />
        </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('app.title')}</Text>
        <TouchableOpacity style={styles.headerIconBtn} onPress={() => navigation.navigate('Settings')}>
          <MaterialIcons name="settings" size={28} color={COLORS.onSurfaceVariant} />
        </TouchableOpacity>
      </View>

      {/* Game area */}
      <View style={styles.gameArea}>
        <View style={[styles.tableOval, { borderColor: tableTheme.border }]}>
          <View style={[styles.tableGradientOuter, { backgroundColor: tableTheme.bg }]}>
            <View style={[styles.tableGradientMid, { backgroundColor: tableTheme.felt }]} />
            <View style={[styles.tableGradientInner, { backgroundColor: tableTheme.felt }]} />
          </View>

          {/* Info label above bot top */}
          <View style={styles.infoLabel}>
            <Text style={styles.infoLabelText}>
              {t('game.hand')} #{handCount} · {blind.small}/{blind.big}
            </Text>
          </View>

          {/* Bot Top */}
          <View style={styles.botTop}>
            <PlayerSeat
              player={players[2]}
              isCurrentPlayer={currentPlayerIndex === 2}
              isDealer={dealerIndex === 2}
              position="top"
              showCards={phase === 'showdown'}
              botAction={botActions[2] ?? null}
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
              botAction={botActions[1] ?? null}
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
              botAction={botActions[3] ?? null}
            />
          </View>

          {/* Table center content */}
          <View style={styles.tableCenter}>
            <View style={styles.communityWrapper}>
              <GameStatusBanner pot={pot} />
              <View style={styles.communityArea}>
                <View style={styles.communityRow}>
                  {[0, 1, 2].map(i => (
                    <View key={i} style={styles.communitySlot}>
                      {communityCards[i] ? (
                        <PokerCard card={communityCards[i]} small />
                      ) : phase !== 'idle' && phase !== 'preflop' ? (
                        <View style={styles.emptyCard} />
                      ) : null}
                    </View>
                  ))}
                </View>
                <View style={styles.communityRow}>
                  {[3, 4].map(i => (
                    <View key={i} style={styles.communitySlot}>
                      {communityCards[i] ? (
                        <PokerCard card={communityCards[i]} small />
                      ) : null}
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>

          {/* Player seat below table */}
          <View style={styles.playerBottom}>
            <PlayerSeat
              player={player}
              isCurrentPlayer={currentPlayerIndex === 0}
              isDealer={dealerIndex === 0}
              position="bottom"
              showCards={true}
              avatarUri={avatarUri}
            />
          </View>
        </View>
      </View>

      {/* Action bar */}
      {phase === 'showdown' && !gameOver ? null : phase === 'showdown' && gameOver ? (
        <View style={styles.actionBar}>
          <TouchableOpacity style={styles.continueBtn} onPress={handleDeal} activeOpacity={0.8}>
            <Text style={styles.continueBtnText}>{t('game.deal')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.historyBtn} onPress={() => setShowHistory(true)} activeOpacity={0.7}>
            <Text style={styles.historyBtnText}>{t('game.history')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quitBtn} onPress={handleQuit} activeOpacity={0.7}>
            <Text style={styles.quitBtnText}>{t('game.quit')}</Text>
          </TouchableOpacity>
        </View>
      ) : actionBar}

      {/* Raise overlay */}
      {showRaiseSlider && (
        <View style={styles.raiseOverlay}>
          <RaiseSlider
            min={minRaise}
            max={chipsAfterCall}
            pot={pot}
            onConfirm={handleRaiseConfirm}
            onCancel={handleRaiseCancel}
          />
        </View>
      )}

      {/* Showdown modal */}
      <ShowdownModal
        visible={phase === 'showdown' && winner !== null && !gameOver}
        winner={winner}
        winners={winners}
        winningHand={winningHand}
        potAwards={potAwards}
        players={players}
        communityCards={communityCards}
        onContinue={handleContinue}
        onQuit={handleQuit}
      />

      {/* Hand history modal */}
      <HandHistoryModal
        visible={showHistory}
        handCount={handCount}
        blindLevel={blindLevel}
        communityCards={communityCards}
        players={players}
        winners={winners}
        winningHand={winningHand}
        potAwards={potAwards}
        actionLog={actionLog}
        onClose={() => setShowHistory(false)}
      />

      {/* Leave confirmation modal */}
      {showLeaveModal && (
        <View style={styles.leaveOverlay}>
          <View style={styles.leaveModal}>
            <Text style={styles.leaveTitle}>{t('game.leaveTitle')}</Text>
            <Text style={styles.leaveDesc}>{t('game.leaveDesc')}</Text>
            <View style={styles.leaveButtons}>
              <TouchableOpacity style={styles.leaveStayBtn} onPress={cancelLeave} activeOpacity={0.7}>
                <Text style={styles.leaveStayText}>{t('game.stay')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.leaveConfirmBtn} onPress={confirmLeave} activeOpacity={0.7}>
                <Text style={styles.leaveConfirmText}>{t('game.leave')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
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
  },
  tableOval: {
    width: '90%',
    maxWidth: 340,
    aspectRatio: 4 / 5,
    borderRadius: 100,
    position: 'relative',
    overflow: 'visible',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 24,
    elevation: 10,
    borderWidth: 16,
    borderColor: '#171827',
  },
  tableGradientOuter: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    borderRadius: 80,
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
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
  },
  botTop: {
    position: 'absolute',
    top: -40,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 5,
  },
  infoLabel: {
    position: 'absolute',
    top: -68,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 6,
  },
  infoLabelText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.onSurfaceVariant,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  botLeft: {
    position: 'absolute',
    left: -20,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 5,
  },
  botRight: {
    position: 'absolute',
    right: -20,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 5,
  },
  communityWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingTop: 100,
  },
  communityArea: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    zIndex: 1,
  },
  communityRow: {
    flexDirection: 'row',
    gap: 4,
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
  playerBottom: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    alignItems: 'center',
    marginTop: -36,
    zIndex: 5,
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
  allInButton: {
    flex: 1.2,
    minHeight: 74,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: 'rgba(243,139,168,0.2)',
    borderWidth: 1.5,
    borderColor: COLORS.mochaRed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  allInButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.mochaRed,
  },
  allInButtonSub: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.mochaRed,
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
  historyBtn: {
    paddingVertical: SPACING.sm,
    alignItems: 'center',
  },
  historyBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
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
  leaveOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 200,
    padding: SPACING.xl,
  },
  leaveModal: {
    width: '100%',
    maxWidth: 300,
    backgroundColor: '#1e1e2e',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(181,207,255,0.2)',
    alignItems: 'center',
  },
  leaveTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.onSurface,
    marginBottom: SPACING.sm,
  },
  leaveDesc: {
    fontSize: 14,
    color: COLORS.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    lineHeight: 20,
  },
  leaveButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
    width: '100%',
  },
  leaveStayBtn: {
    flex: 1,
    paddingVertical: SPACING.sm + 4,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surfaceHighest,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
    alignItems: 'center',
  },
  leaveStayText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.onSurface,
  },
  leaveConfirmBtn: {
    flex: 1,
    paddingVertical: SPACING.sm + 4,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: 'rgba(243,139,168,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(243,139,168,0.5)',
    alignItems: 'center',
  },
  leaveConfirmText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.mochaRed,
  },
});
