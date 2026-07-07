import { Vibration } from 'react-native';
import { useSettingsStore } from '../store/settingsStore';

export function vibrate(pattern: number | number[]) {
  const { vibrationEnabled } = useSettingsStore.getState().settings;
  if (vibrationEnabled) Vibration.vibrate(pattern);
}
