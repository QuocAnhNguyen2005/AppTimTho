import { API_BASE_URL } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

let memoryCache: { [key: string]: { data: any, timestamp: number } } = {};

export interface WorkerInfo {
  id: number;
  full_name: string;
  phone_number: string;
  avatar_url?: string;
  specialties: string[];
  experience_years: number;
  districts_active: string[];
  is_verified: boolean;
  average_rating: string | number;
  total_reviews: number;
}

export async function getOnlineWorkers(limit = 20, offset = 0, forceRefresh = false): Promise<{ success: boolean; workers?: WorkerInfo[]; error?: string }> {
  const cacheKey = `workers_${limit}_${offset}`;
  
  if (!forceRefresh) {
    // 1. Memory Cache (Instant - 1 minute TTL)
    if (memoryCache[cacheKey] && Date.now() - memoryCache[cacheKey].timestamp < 60000) {
      return { success: true, workers: memoryCache[cacheKey].data };
    }
    // 2. Async Storage Cache (Fast - 5 minutes TTL)
    try {
      const cachedData = await AsyncStorage.getItem(cacheKey);
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        if (Date.now() - parsed.timestamp < 300000) {
          memoryCache[cacheKey] = parsed;
          return { success: true, workers: parsed.data };
        }
      }
    } catch(e) {}
  }

  // 3. Network Request
  try {
    const response = await fetch(`${API_BASE_URL}/workers?limit=${limit}&offset=${offset}`);
    const resData = await response.json();
    if (!response.ok) return { success: false, error: resData.error };
    
    const cacheData = { data: resData.workers, timestamp: Date.now() };
    memoryCache[cacheKey] = cacheData;
    AsyncStorage.setItem(cacheKey, JSON.stringify(cacheData)).catch(() => {});
    
    return { success: true, workers: resData.workers };
  } catch (err: any) {
    // Fallback to memory cache
    if (memoryCache[cacheKey]) return { success: true, workers: memoryCache[cacheKey].data };
    return { success: false, error: err.message };
  }
}

export async function toggleWorkerStatus(workerId: number, isOnline: boolean): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/workers/${workerId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_online: isOnline }),
    });
    const resData = await response.json();
    if (!response.ok) return { success: false, error: resData.error };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
