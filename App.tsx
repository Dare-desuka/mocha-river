import React, { useEffect, useState, Component } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts, Montserrat_700Bold, Montserrat_600SemiBold, Montserrat_400Regular } from '@expo-google-fonts/montserrat';
import { MaterialIcons } from '@expo/vector-icons';
import { View, Text, ScrollView, ImageBackground, StatusBar, Platform } from 'react-native';

import HomeTabs from './src/screens/HomeTabs';
import GameScreen from './src/screens/GameScreen';
import TutorialScreen from './src/screens/TutorialScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { useSettingsStore } from './src/store/settingsStore';
import { useGameStore } from './src/store/gameStore';
import { initSound, ensureSoundPack } from './src/utils/soundManager';

// Keep the native splash visible until our full-screen splash is ready.
// The native splash on Android 12+ can only show a small centred icon, so
// the full-screen portrait art is shown by the app itself below, not by
// the native splash. Without this, the native splash auto-hides as soon
// as the first view mounts and the full-screen art never gets its moment.
SplashScreen.preventAutoHideAsync().catch(() => {
  // Already hidden (e.g. in Expo Go) - the custom splash still shows.
});

const Stack = createNativeStackNavigator();

class ErrorBoundary extends Component<{ children: React.ReactNode }, { error: Error | null }> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) {
      const e: Error = this.state.error;
      return (
        <View style={{ flex: 1, backgroundColor: '#0D0D0D', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ color: '#f38ba8', fontSize: 18, fontWeight: '700', marginBottom: 12 }}>App Error</Text>
          <ScrollView style={{ maxHeight: 300 }}><Text style={{ color: '#cdd6f4', fontSize: 12, fontFamily: 'monospace' }}>
            {e.stack || e.message}
          </Text></ScrollView>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [fontsLoaded] = useFonts({ Montserrat_700Bold, Montserrat_600SemiBold, Montserrat_400Regular, ...MaterialIcons.font });
  const [customSplashVisible, setCustomSplashVisible] = useState(true);

  useEffect(() => {
    useSettingsStore.getState().load().then(() => {
      const { botDifficulty } = useSettingsStore.getState().settings;
      useGameStore.getState().setDifficulty(botDifficulty);
    });
    initSound().then(() => ensureSoundPack());
  }, []);

  // Once fonts are ready, hide the native splash and keep the full-screen
  // art visible for a short beat so it does not just flash by.
  useEffect(() => {
    if (!fontsLoaded) return;
    const timer = setTimeout(async () => {
      await SplashScreen.hideAsync().catch(() => {});
      setCustomSplashVisible(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [fontsLoaded]);

  // Safety net: never trap the user on the splash if font loading hangs.
  useEffect(() => {
    const timer = setTimeout(async () => {
      await SplashScreen.hideAsync().catch(() => {});
      setCustomSplashVisible(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  if (customSplashVisible) {
    return (
      <SafeAreaProvider>
        <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />
        <ImageBackground source={require('./assets/splash-icon.png')} style={{ flex: 1 }} resizeMode="cover">
        </ImageBackground>
      </SafeAreaProvider>
    );
  }

  return (
    <ErrorBoundary>
    <SafeAreaProvider>
      <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />
      <ImageBackground source={require('./assets/splash-icon.png')} style={{ flex: 1 }} resizeMode="cover">
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
              contentStyle: { backgroundColor: 'transparent' },
            }}
          >
            <Stack.Screen name="Home" component={HomeTabs} />
            <Stack.Screen name="Game" component={GameScreen} />
            <Stack.Screen name="Tutorial" component={TutorialScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </ImageBackground>
    </SafeAreaProvider>
    </ErrorBoundary>
  );
}
