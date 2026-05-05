export interface User {
  id: string;
  phone: string;
  role: 'customer' | 'worker';
  fullName?: string;
  avatarUrl?: string;
}

export interface WorkerProfile extends User {
  rating: number;
  completedJobs: number;
  walletBalance: number;
  isOnline: boolean;
  isEkycApproved: boolean;
}
