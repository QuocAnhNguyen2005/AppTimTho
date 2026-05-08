import { API_BASE_URL } from '../config/api';

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

export async function getOnlineWorkers(limit = 20, offset = 0): Promise<{ success: boolean; workers?: WorkerInfo[]; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/workers?limit=${limit}&offset=${offset}`);
    const resData = await response.json();
    if (!response.ok) return { success: false, error: resData.error };
    return { success: true, workers: resData.workers };
  } catch (err: any) {
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
