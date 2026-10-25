import 'react-native-reanimated';
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WishlistProvider } from '@/context/WishlistContext';
import { COLORS } from '@/constants/theme';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  anchor: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync().catch(() => {
  /* ignore */
});

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) {
      console.warn('Font loading error, continuing with system fonts:', error);
    }
  }, [error]);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <WishlistProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: COLORS.surface,
            },
            headerTintColor: COLORS.primary,
            headerTitleStyle: {
              fontWeight: '700',
              color: COLORS.textPrimary,
            },
            contentStyle: {
              backgroundColor: COLORS.background,
            },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="destination/[id]"
            options={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="modal"
            options={{
              presentation: 'modal',
              title: 'About Yatra',
              headerTitleStyle: {
                fontWeight: '800',
                color: COLORS.primary,
              },
            }}
          />
        </Stack>
      </WishlistProvider>
    </SafeAreaProvider>
  );
}
