export type BookingStatus = 'finding' | 'accepted' | 'arriving' | 'working' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  customerId: string;
  workerId?: string;
  serviceType: string;
  description: string;
  status: BookingStatus;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  estimatedFee: number;
  finalFee?: number;
  createdAt: string;
  updatedAt: string;
}
