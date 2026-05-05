const API_BASE_URL = 'http://10.0.2.2:5000/api'; // Android Emulator
// const API_BASE_URL = 'http://localhost:5000/api'; // iOS Simulator / Web

export interface Job {
  id: number;
  customer_id: number;
  worker_id: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';
  address: string;
  description: string;
  total_price?: number;
  created_at: string;
  worker_name?: string;
  customer_name?: string;
  customer_phone?: string;
}

export async function createJob(data: {
  customer_id: number;
  worker_id: number;
  scheduled_time: string;
  address: string;
  description: string;
}): Promise<{ success: boolean; job?: Job; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const resData = await response.json();
    if (!response.ok) return { success: false, error: resData.error };
    return { success: true, job: resData.job };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getJobById(jobId: number): Promise<{ success: boolean; job?: Job; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`);
    const resData = await response.json();
    if (!response.ok) return { success: false, error: resData.error };
    return { success: true, job: resData.job };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getWorkerJobs(workerId: number): Promise<{ success: boolean; jobs?: Job[]; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/worker/${workerId}`);
    const resData = await response.json();
    if (!response.ok) return { success: false, error: resData.error };
    return { success: true, jobs: resData.jobs };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateJobStatus(jobId: number, status: 'ACCEPTED' | 'REJECTED'): Promise<{ success: boolean; job?: Job; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const resData = await response.json();
    if (!response.ok) return { success: false, error: resData.error };
    return { success: true, job: resData.job };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function completeJob(jobId: number, totalPrice: number): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ total_price: totalPrice }),
    });
    const resData = await response.json();
    if (!response.ok) return { success: false, error: resData.error };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
