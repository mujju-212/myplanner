import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../src/theme/colors';
import { initializeDatabase } from '../src/database/schema';
import { useThemeStore } from '../src/stores/useThemeStore';

export default function RootLayout() {
  const [dbInitialized, setDbInitialized] = useState(false);
  const { isDark, colors: themeColors, loadTheme } = useThemeStore();

  useEffect(() => {
    async function setup() {
      try {
        await loadTheme();
        await initializeDatabase();
        setDbInitialized(true);
      } catch (e) {
        console.error("DB Init Error:", e);
      }
    }
    setup();
  }, []);

  if (!dbInitialized) {
    return (
      <View style={{ flex: 1, backgroundColor: themeColors.background, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: themeColors.textSecondary }}>Initializing Base...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: themeColors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(stacks)/todo/create"
          options={{
            presentation: 'modal',
            headerShown: false
          }}
        />
      </Stack>
    </>
  );
}
