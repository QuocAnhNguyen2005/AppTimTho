// API Service kết nối với Backend Express (PostgreSQL)
// Backend đang chạy tại http://localhost:5000

// Khi test trên thiết bị thật, thay 'localhost' bằng IP máy tính (vd: 192.168.1.x)
// Khi test trên Emulator Android: dùng '10.0.2.2' thay cho 'localhost'
const API_BASE_URL = 'http://10.0.2.2:5000/api'; // Android Emulator
// const API_BASE_URL = 'http://localhost:5000/api'; // iOS Simulator / Web
// const API_BASE_URL = 'http://192.168.x.x:5000/api'; // Thiết bị thật (thay IP)

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
export async function loginAPI(phone_number: string, password: string): Promise<LoginResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone_number, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Đăng nhập thất bại' };
    }

    return {
      success: true,
      role: data.role,
      user: data.user,
    };
  } catch (err) {
    console.error('loginAPI error:', err);
    return { success: false, error: 'Không kết nối được với server. Hãy kiểm tra backend đang chạy.' };
  }
}

/**
 * Đăng ký Khách hàng mới.
 */
export async function registerCustomerAPI(full_name: string, phone_number: string, password: string): Promise<RegisterCustomerResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register/customer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name, phone_number, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Đăng ký thất bại' };
    }

    return { success: true };
  } catch (err) {
    console.error('registerCustomerAPI error:', err);
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
    const response = await fetch(`${API_BASE_URL}/auth/register/worker`, {
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
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Đăng ký thất bại' };
    }

    return { success: true };
  } catch (err) {
    console.error('registerWorkerAPI error:', err);
    return { success: false, error: 'Không kết nối được với server.' };
  }
}
