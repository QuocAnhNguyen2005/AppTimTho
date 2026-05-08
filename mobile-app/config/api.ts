import Constants from 'expo-constants';
import { Platform } from 'react-native';

const BACKEND_PORT = 5000;

// ─── Phát hiện IP tự động từ Expo Metro server ──────────────
function getExpoHostIP(): string | null {
  try {
    // SDK 49+ / Expo Go
    const hostUri = Constants.expoConfig?.hostUri;
    if (hostUri) {
      const ip = hostUri.split(':')[0];
      if (ip && ip !== 'localhost' && ip !== '127.0.0.1' && ip !== '') {
        return ip;
      }
    }
  } catch (_) {}

  try {
    // SDK 45-48
    const m2 = (Constants as any).manifest2;
    const hostUri = m2?.extra?.expoClient?.hostUri || m2?.launchAsset?.url;
    if (hostUri) {
      const ip = (hostUri as string).split(':')[0].replace(/^https?:\/\//, '');
      if (ip && ip !== 'localhost') return ip;
    }
  } catch (_) {}

  try {
    // SDK cũ
    const debuggerHost = (Constants as any).manifest?.debuggerHost;
    if (debuggerHost) {
      const ip = debuggerHost.split(':')[0];
      if (ip && ip !== 'localhost') return ip;
    }
  } catch (_) {}

  return null;
}

function resolveBaseUrl(): string {
  // Ưu tiên 1: Biến môi trường set thủ công (EXPO_PUBLIC_API_URL)
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  if (__DEV__) {
    const ip = getExpoHostIP();
    if (ip) {
      return `http://${ip}:${BACKEND_PORT}/api`;
    }
    // Fallback theo platform
    if (Platform.OS === 'android') {
      return `http://10.0.2.2:${BACKEND_PORT}/api`;
    }
    return `http://localhost:${BACKEND_PORT}/api`;
  }

  return 'https://api.yourdomain.com/api';
}

export const API_BASE_URL = resolveBaseUrl();
export const BACKEND_PORT_EXPORT = BACKEND_PORT;

if (__DEV__) {
  console.log('=== [AppTimTho] API Config ===');
  console.log('API_BASE_URL:', API_BASE_URL);
  console.log('hostUri raw:', Constants.expoConfig?.hostUri);
  console.log('platform:', Platform.OS);
  console.log('==============================');
}
