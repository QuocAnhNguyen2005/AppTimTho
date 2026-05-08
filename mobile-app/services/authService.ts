import { API_BASE_URL } from '../config/api';

export interface LoginResult {
  success: boolean;
  role?: 'customer' | 'worker' | 'admin';
  user?: {
    id: number;
    full_name: string;
    phone_number: string;
    avatar_url?: string;
    is_verified?: boolean;
  };
  error?: string;
}

export interface RegisterCustomerResult {
  success: boolean;
  error?: string;
}

/**
 * Đăng nhập dùng chung cho cả Khách hàng, Thợ và Admin.
 * Backend tự phân loại role dựa vào bảng nào khớp.
 */
/** Fetch với timeout để tránh xoay vòng vô tận */
async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs = 10000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export async function loginAPI(phone_number: string, password: string): Promise<LoginResult> {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/auth/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number, password }),
      },
      10000 // 10 giây timeout
    );

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Đăng nhập thất bại' };
    }

    return {
      success: true,
      role: data.role,
      user: data.user,
    };
  } catch (err: any) {
    console.error('loginAPI error:', err);
    if (err.name === 'AbortError') {
      return { success: false, error: `Hết thời gian chờ (10s). Server không phản hồi.\n\n📡 Đang kết nối: ${API_BASE_URL}\n\nKiểm tra:\n• Backend đang chạy\n• Điện thoại & máy tính cùng WiFi` };
    }
    return { success: false, error: `Không kết nối được server.\n\n📡 ${API_BASE_URL}` };
  }
}

/**
 * Đăng ký Khách hàng mới.
 */
export async function registerCustomerAPI(full_name: string, phone_number: string, password: string): Promise<RegisterCustomerResult> {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/auth/register/customer`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name, phone_number, password }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Đăng ký thất bại' };
    }

    return { success: true };
  } catch (err: any) {
    console.error('registerCustomerAPI error:', err);
    if (err.name === 'AbortError') {
      return { success: false, error: 'Hết thời gian chờ. Server không phản hồi.' };
    }
    return { success: false, error: 'Không kết nối được với server.' };
  }
}

/**
 * Đăng ký Thợ mới (chỉ với thông tin tối thiểu từ mobile).
 * Backend sẽ set is_verified = false, chờ Admin duyệt.
 */
export async function registerWorkerAPI(
  phone_number: string,
  password: string,
  full_name: string,
  specialties: string[]
): Promise<RegisterCustomerResult> {
  try {
    // Backend yêu cầu identity_card, bank_name, bank_account_number
    // Ta dùng placeholder để pass validation, Admin sẽ cập nhật sau khi duyệt eKYC
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/auth/register/worker`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name,
          phone_number,
          password,
          identity_card: 'PENDING_KYC',
          bank_name: 'PENDING',
          bank_account_number: 'PENDING',
          bank_account_name: full_name,
          specialties: specialties,
          experience_years: 0,
          districts_active: [],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Đăng ký thất bại' };
    }

    return { success: true };
  } catch (err: any) {
    console.error('registerWorkerAPI error:', err);
    if (err.name === 'AbortError') {
      return { success: false, error: 'Hết thời gian chờ. Server không phản hồi.' };
    }
    return { success: false, error: 'Không kết nối được với server.' };
  }
}
