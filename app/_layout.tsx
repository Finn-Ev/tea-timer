import Ionicons from '@expo/vector-icons/Ionicons';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Link, router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { Pressable } from 'react-native';
import { ContextProviders } from '../context';
import { useThemeColor } from '../hooks/useThemeColor';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const tintColor = useThemeColor('tint');

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} /> */}
      <ContextProviders>
        <Stack initialRouteName="timers">
          <Stack.Screen
            name="timers"
            options={{
              title: 'Timers',
              headerTintColor: tintColor,
              headerRight: ({ tintColor }) => (
                <Link href="/settings">
                  <Ionicons
                    name="settings-outline"
                    color={tintColor}
                    size={24}
                  />
                </Link>
              ),
            }}
          />
          <Stack.Screen
            name="settings"
            options={{
              title: 'Settings',
              headerTintColor: tintColor,
            }}
          />
          <Stack.Screen
            name="create-timer"
            options={{
              presentation: 'fullScreenModal',
              title: 'Create timer',
              headerTintColor: tintColor,
              headerLeft: ({ tintColor }) => (
                <Pressable onPress={() => router.back()}>
                  <Ionicons name="close" color={tintColor} size={28} />
                </Pressable>
              ),
            }}
          />

          <Stack.Screen name="+not-found" />
        </Stack>
      </ContextProviders>
    </ThemeProvider>
  );
}
