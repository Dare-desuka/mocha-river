import React, { useState, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, PanResponder, LayoutChangeEvent } from 'react-native';
import { COLORS, BORDER_RADIUS, SPACING } from '../constants/theme';
import { formatChips } from '../utils/format';

interface Props {
  min: number;
  max: number;
  pot: number;
  onConfirm: (amount: number) => void;
  onCancel: () => void;
}

const RaiseSlider: React.FC<Props> = ({ min, max, pot, onConfirm, onCancel }) => {
  const [selected, setSelected] = useState(min);
  const trackWidth = useRef(1);
  const thumbPos = useRef(0);

  const potFractions = [
    { label: '1/3', mult: 1 / 3 },
    { label: '1/2', mult: 0.5 },
    { label: '3/4', mult: 0.75 },
    { label: 'Pot', mult: 1 },
  ];
  const potPresets = potFractions.map(f => {
    const amt = Math.min(Math.max(Math.round(pot * f.mult), min), max);
    return { label: f.label, amount: amt };
  }).filter((v, i, a) => a.findIndex(x => x.amount === v.amount) === i);

  const raiseFromPosition = useCallback((positionX: number) => {
    const ratio = Math.max(0, Math.min(1, positionX / (trackWidth.current || 1)));
    const range = max - min;
    const value = Math.round(min + ratio * range);
    setSelected(Math.max(min, Math.min(max, value)));
  }, [min, max]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        thumbPos.current = evt.nativeEvent.locationX;
        raiseFromPosition(evt.nativeEvent.locationX);
      },
      onPanResponderMove: (evt) => {
        raiseFromPosition(evt.nativeEvent.locationX);
      },
    })
  ).current;

  const onTrackLayout = useCallback((e: LayoutChangeEvent) => {
    trackWidth.current = e.nativeEvent.layout.width;
  }, []);

  const fillRatio = max > min ? (selected - min) / (max - min) : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Raise By</Text>
      <Text style={styles.amount}>{formatChips(selected)}</Text>

      {/* Draggable slider */}
      <View style={styles.sliderSection}>
        <Text style={styles.sliderEndLabel}>MIN</Text>
        <View
          style={styles.sliderTrack}
          onLayout={onTrackLayout}
          {...panResponder.panHandlers}
        >
          <View style={[styles.sliderFill, { width: `${fillRatio * 100}%` }]} />
          <View style={[styles.sliderThumb, { left: `${fillRatio * 100}%` }]} />
        </View>
        <TouchableOpacity onPress={() => setSelected(max)}>
          <Text style={styles.sliderEndLabel}>MAX</Text>
        </TouchableOpacity>
      </View>

      {/* Pot fraction buttons */}
      <View style={styles.presets}>
        {potPresets.map((p) => (
          <TouchableOpacity
            key={p.label}
            style={[styles.presetBtn, selected === p.amount && styles.presetActive]}
            onPress={() => setSelected(p.amount)}
          >
            <Text style={[styles.presetText, selected === p.amount && styles.presetTextActive]}>
              {p.label}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[styles.presetBtn, selected === max && styles.presetActive]}
          onPress={() => setSelected(max)}
        >
          <Text style={[styles.presetText, selected === max && styles.presetTextActive]}>
            ALL IN
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.confirmBtn} onPress={() => onConfirm(selected)}>
          <Text style={styles.confirmText}>Raise</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surfaceHigh,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.onSurfaceVariant,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: SPACING.xs,
  },
  amount: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.mochaPeach,
    marginBottom: SPACING.md,
  },
  sliderSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
    width: '100%',
  },
  sliderEndLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.onSurfaceVariant,
    letterSpacing: 1.2,
  },
  sliderTrack: {
    flex: 1,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceHighest,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
    justifyContent: 'center',
    position: 'relative',
  },
  sliderFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    opacity: 0.3,
  },
  sliderThumb: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.mochaPeach,
    borderWidth: 3,
    borderColor: '#f3f5ff',
    shadowColor: COLORS.mochaPeach,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
    marginLeft: -14,
    top: 2,
  },
  presets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  presetBtn: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs + 2,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.surfaceHighest,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
    minWidth: 52,
    alignItems: 'center',
  },
  presetActive: {
    borderColor: COLORS.mochaPeach,
    backgroundColor: 'rgba(250, 179, 135, 0.15)',
  },
  presetText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.onSurface,
  },
  presetTextActive: {
    color: COLORS.mochaPeach,
  },
  buttons: {
    flexDirection: 'row',
    gap: SPACING.md,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: SPACING.sm + 2,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surfaceHighest,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.onSurface,
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: SPACING.sm + 2,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.mochaPeach,
    alignItems: 'center',
  },
  confirmText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.surface,
  },
});

export default RaiseSlider;
