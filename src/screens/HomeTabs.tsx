import React, { useState, useRef, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet, Dimensions, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, BORDER_RADIUS, SPACING } from '../constants/theme';
import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeTabs() {
  const [tabIndex, setTabIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const handleTabChange = useCallback((index: number) => {
    setTabIndex(index);
    scrollRef.current?.scrollTo({ x: index * SCREEN_WIDTH, animated: true });
  }, []);

  const sbHeight = StatusBar.currentHeight || 28;
  return (
    <View style={{ flex: 1, paddingTop: sbHeight }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.surface} />
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
          setTabIndex(idx);
        }}
      >
        <View style={{ width: SCREEN_WIDTH }}>
          <HomeScreen />
        </View>
        <View style={{ width: SCREEN_WIDTH }}>
          <ProfileScreen />
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => handleTabChange(0)}>
          <MaterialIcons name="play-circle-filled" size={28} color={tabIndex === 0 ? COLORS.mochaPeach : COLORS.onSurfaceVariant} />
          <Text style={[styles.navText, tabIndex === 0 && { color: COLORS.mochaPeach }]}>Play Now</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => handleTabChange(1)}>
          <MaterialIcons name="account-circle" size={28} color={tabIndex === 1 ? COLORS.mochaPeach : COLORS.onSurfaceVariant} />
          <Text style={[styles.navText, tabIndex === 1 && { color: COLORS.mochaPeach }]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: SPACING.sm,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.lg,
    backgroundColor: 'rgba(30,32,42,0.92)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(141,145,155,0.25)',
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 3,
  },
  navText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.onSurfaceVariant,
    textAlign: 'center',
  },
});
