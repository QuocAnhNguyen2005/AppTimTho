import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Mặc định cho Android Emulator
let BASE_URL = 'http://10.0.2.2:5000/api';

if (__DEV__) {
  // Lấy IP của máy tính đang chạy Expo server để thiết bị thật có thể kết nối chung mạng LAN
  // expoConfig?.hostUri thường có dạng "192.168.1.15:8081"
  const debuggerHost = Constants.expoConfig?.hostUri;
  
  if (debuggerHost) {
    const ip = debuggerHost.split(':')[0];
    BASE_URL = `http://${ip}:5000/api`;
  } else if (Platform.OS === 'ios') {
    BASE_URL = 'http://localhost:5000/api';
  } else if (Platform.OS === 'web') {
    BASE_URL = 'http://localhost:5000/api';
  }
} else {
  // Production URL (thay bằng domain backend thật khi deploy)
  BASE_URL = 'https://api.yourdomain.com/api';
}

export const API_BASE_URL = BASE_URL;
