import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '../context/AuthContext';
import * as QuickActions from 'expo-quick-actions';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  useEffect(() => {
    QuickActions.setItems([
      { title: 'Gọi thợ Sửa Điện Lạnh', icon: 'snow', id: 'dien-lanh', params: { href: '/(customer)/booking' } },
      { title: 'Gọi thợ Sửa Khoá', icon: 'key', id: 'sua-khoa', params: { href: '/(customer)/booking' } },
    ]);

    const subscription = QuickActions.addListener((action) => {
      if (action.params?.href) {
        router.push(action.params.href as any);
      }
    });

    return () => subscription.remove();
  }, [router]);

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="(customer)" />
          <Stack.Screen name="(worker)" />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
