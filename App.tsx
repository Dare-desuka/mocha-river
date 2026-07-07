import React, { useEffect, Component } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts, Montserrat_700Bold, Montserrat_600SemiBold, Montserrat_400Regular } from '@expo-google-fonts/montserrat';
import { View, Text, ScrollView } from 'react-native';

import HomeScreen from './src/screens/HomeScreen';
import GameScreen from './src/screens/GameScreen';
import TutorialScreen from './src/screens/TutorialScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { useSettingsStore } from './src/store/settingsStore';
import { initSound } from './src/utils/soundManager';

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
  const [fontsLoaded] = useFonts({ Montserrat_700Bold, Montserrat_600SemiBold, Montserrat_400Regular });

  useEffect(() => {
    useSettingsStore.getState().load();
    initSound();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <ErrorBoundary>
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            contentStyle: { backgroundColor: '#0D0D0D' },
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Game" component={GameScreen} />
          <Stack.Screen name="Tutorial" component={TutorialScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
    </ErrorBoundary>
  );
}
