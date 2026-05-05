# 🔧 AppTimTho — Nền tảng kết nối thợ sửa chữa

> Hệ thống full-stack kết nối **Khách hàng** (người có nhu cầu sửa chữa) với **Thợ sửa chữa** (đối tác), vận hành theo mô hình hoa hồng **15,5%** trên mỗi giao dịch. Hệ thống được đồng bộ dữ liệu xuyên suốt giữa Mobile App, Web Client và Dashboard Admin qua REST API và tối ưu hiệu năng cao.

---

## 📁 Cấu trúc tổng quan dự án

```
AppTimTho/
├── backend/          # API Server (Node.js + Express + PostgreSQL)
├── web-admin/        # Dashboard quản trị Admin (React + Vite)
├── web-client/       # Cổng thông tin Web cho Khách hàng & Thợ (Next.js)
└── mobile-app/       # Ứng dụng di động (Expo React Native)
```

---

## ⚙️ Yêu cầu hệ thống (Prerequisites)

Trước khi cài đặt, bên mua cần cài sẵn:

| Phần mềm | Phiên bản tối thiểu | Link tải |
|----------|---------------------|----------|
| Node.js | v20 LTS trở lên | https://nodejs.org |
| npm | v10+ (đi kèm Node.js) | — |
| PostgreSQL | v15+ | https://www.postgresql.org/download |
| Git | Bất kỳ | https://git-scm.com |
| Expo CLI | Cài qua npm (xem bên dưới) | — |

---

## 🚀 Hướng dẫn cài đặt & chạy toàn bộ hệ thống

### Bước 1 — Clone source code

```bash
git clone <ĐƯỜNG_DẪN_REPO>
cd AppTimTho
```

---

### Bước 2 — Cài đặt & chạy Backend (Port 5000)

#### 2.1 — Cấu hình môi trường

Vào thư mục `backend/`, tạo file `.env` (copy từ `.env.example`):

```bash
cd backend
```

Tạo file `.env` với nội dung sau:

```env
# Cổng server API
PORT=5000

# Thông tin kết nối PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=<MẬT_KHẨU_POSTGRES_CỦA_BẠN>
DB_NAME=apptimtho
```

> ⚠️ **Quan trọng:** Thay `<MẬT_KHẨU_POSTGRES_CỦA_BẠN>` bằng mật khẩu thực của PostgreSQL trên máy bạn.

#### 2.2 — Khởi tạo cơ sở dữ liệu

Chạy lệnh này **một lần duy nhất** khi lần đầu cài đặt. Script sẽ tự động tạo database `apptimtho` và toàn bộ các bảng (tables):

```bash
npm install
node init_db.js
```

Nếu thành công, terminal sẽ hiện:
```
✅ Đã tạo database apptimtho thành công.
✅ Đã tạo toàn bộ các Tables thành công!
```

#### 2.3 — Khởi động server

```bash
node index.js
```

Server sẽ chạy tại: **http://localhost:5000**

Kiểm tra bằng cách mở trình duyệt vào `http://localhost:5000` — sẽ thấy dòng chữ: `API Tìm Thợ đang chạy...`

---

### Bước 3 — Cài đặt & chạy Web Admin (Port 5173)

Dashboard quản trị dành riêng cho nhân viên/quản lý nội bộ.

```bash
cd ../web-admin
npm install
npm run dev
```

Mở trình duyệt: **http://localhost:5173**

---

### Bước 4 — Cài đặt & chạy Web Client (Port 3000)

Cổng thông tin web dành cho **Khách hàng** và **Thợ** đăng nhập/đăng ký.

```bash
cd ../web-client
npm install
npm run dev
```

Mở trình duyệt: **http://localhost:3000**

---

### Bước 5 — Cài đặt & chạy Mobile App

Ứng dụng di động xây dựng bằng **Expo React Native**, chạy được trên cả iOS và Android.

```bash
cd ../mobile-app
npm install
npx expo start
```

Sau đó:
- **Android**: Quét QR code bằng app **Expo Go** trên điện thoại
- **iOS**: Quét QR code bằng **Camera** hoặc app Expo Go
- **Máy ảo**: Nhấn `a` (Android Emulator) hoặc `i` (iOS Simulator) trong terminal

---

## 🗄️ Cấu trúc Cơ sở dữ liệu (PostgreSQL)

Database: `apptimtho`

### Danh sách các bảng (Tables)

| Bảng | Chức năng |
|------|----------|
| `users` | Tài khoản Khách hàng (SĐT, Họ tên, Mật khẩu đã hash, Địa chỉ...) |
| `workers` | Tài khoản Thợ (SĐT, Mật khẩu, CCCD, Tài khoản ngân hàng, Chuyên môn, Khu vực...) |
| `admins` | Tài khoản quản trị viên hệ thống |
| `categories` | Danh mục dịch vụ (Điện, Nước, Điện lạnh...) |
| `worker_services` | Dịch vụ cụ thể mà từng Thợ cung cấp |
| `bookings` | Lịch sử đặt thợ, trạng thái đơn hàng |
| `reviews` | Đánh giá của Khách hàng sau khi hoàn thành |
| `payments` | Lịch sử thanh toán & hoa hồng |

### Sơ đồ quan hệ (ERD đơn giản)

```
users ──────────────┐
                    ├──► bookings ──► payments
workers ────────────┘         │
   │                          └──► reviews
   └──► worker_services
              │
              └──► categories
```

### Mô hình hoa hồng (Commission)

Mỗi khi một booking hoàn thành:
- **Tổng tiền khách trả** = `total_price`
- **Hoa hồng hệ thống** = `total_price × 15.5%` → lưu vào `commission_fee`
- **Thợ nhận được** = `total_price × 84.5%` → lưu vào `worker_earnings`

Dữ liệu này được tính sẵn và lưu vào bảng `bookings` tại thời điểm tạo đơn.

---

## 🔒 Chính sách bảo mật (Security Policy)

Hệ thống áp dụng chuẩn bảo mật nghiêm ngặt cho tài khoản người dùng:
- **Băm mật khẩu (Hashing):** Toàn bộ mật khẩu của Khách hàng và Thợ đều được mã hóa bằng `bcryptjs` (salt 10 rounds) trước khi lưu trữ vào PostgreSQL.
- **Quy tắc đặt mật khẩu:** Cả Client và API đều xác thực mật khẩu phải thỏa mãn:
  - Độ dài từ **8 đến 16 ký tự**.
  - Ít nhất **1 chữ cái in hoa**.
  - Ít nhất **4 chữ số**.
  - Ít nhất **1 ký tự đặc biệt** (VD: `@, #, $, %...`).

---

## 🌐 Các trang web hiện có

### Web Client (`/web-client`) — localhost:3000

| Route | Trang | Mô tả |
|-------|-------|-------|
| `/` | Trang chủ | Giới thiệu dịch vụ, 2 CTA chính |
| `/login` | Đăng nhập | Form login + đăng nhập mạng xã hội |
| `/register` | Chọn vai trò | Chọn "Thợ" hoặc "Khách hàng" |
| `/register/customer` | Đăng ký khách hàng | Form nhập thông tin cá nhân |
| `/register/worker` | Đăng ký thợ | Form CV thu nhỏ gồm 3 phần |

### Web Admin (`/web-admin`) — localhost:5173

Dashboard quản trị với các chức năng quản lý người dùng, thợ, đơn hàng và báo cáo doanh thu. Hỗ trợ Light/Dark mode.

---

## 🔑 Biến môi trường cần cấu hình

### Backend (`backend/.env`)

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=apptimtho
```

> Sau này khi tích hợp thêm dịch vụ, bổ sung các biến sau:

```env
# JWT Authentication
JWT_SECRET=your_jwt_secret_key_here

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Zalo API (OTP)
ZALO_APP_ID=
ZALO_APP_SECRET=

# Upload file (Cloudinary hoặc AWS S3)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## 📱 Công nghệ & Công cụ sử dụng

| Layer | Công nghệ & Thư viện | Vai trò / Lý do sử dụng |
|-------|----------|----------|
| **Backend API** | Node.js, Express.js, pg (node-postgres) | API Server chính, xử lý logic RESTful, xác thực, luồng booking. |
| **Web Admin** | React 19, Vite, TailwindCSS | Dashboard quản trị nhanh, nhẹ. Dùng Canvas/SVG cho biểu đồ, xuất file Excel quản lý tài chính. |
| **Web Client** | Next.js (App Router), TailwindCSS | Cổng thông tin tối ưu SEO, SSR cho Khách và Thợ. |
| **Mobile App** | Expo React Native, Expo Router | Ứng dụng di động đa nền tảng. Sử dụng **FlashList**, **Reanimated**, **expo-image** tối ưu hiệu năng UI. |
| **Database** | PostgreSQL 15+ | Cơ sở dữ liệu quan hệ chính lưu trữ mọi thông tin toàn vẹn. |
| **Realtime / Chat** | Supabase Realtime | Được dùng riêng biệt cho tính năng in-app chat cực kỳ mượt mà. (Booking dùng Short-polling từ Backend). |

---

## 📋 Trạng thái tính năng (Feature Status)

### ✅ Đã hoàn thiện

#### 1. Hệ thống Khách hàng & Thợ (Web/Mobile)
- [x] **Đồng bộ hóa toàn diện**: Đăng nhập/Đăng ký phân quyền, đồng bộ trạng thái Auth và dữ liệu giữa Web Client, Mobile App và Backend.
- [x] **Mobile App Tối ưu hiệu năng**: Cấu trúc kiến trúc Expo Router (tách biệt services/types/utils). Tối ưu hóa UI/UX cực cao bằng **FlashList**, **Reanimated**, **expo-image**, Bottom Sheets, Haptic feedback, Deep linking.
- [x] **In-app Chat**: Nhắn tin trực tiếp giữa Khách và Thợ sử dụng Supabase Realtime.
- [x] **Luồng đặt thợ (Booking Lifecycle)**: Chấp nhận, từ chối, hoàn thành đơn. Trạng thái cập nhật thời gian thực bằng Short-polling tối ưu.
- [x] **Ví tiền & Doanh thu Thợ**: Theo dõi doanh thu (Dual-wallet: Cash/Credit), tính toán tự động hoa hồng (15.5% hệ thống, 84.5% Thợ). Giao diện Wallet bằng SVG Charts.
- [x] **Xác minh danh tính (eKYC)**: Luồng gửi tài liệu chứng chỉ, CCCD từ phía Thợ để Admin duyệt trước khi hoạt động.

#### 2. Hệ thống Quản trị (Web Admin)
- [x] **Admin Dashboard Tổng quan**: Biểu đồ Canvas thống kê doanh thu, người dùng, hệ thống tracking.
- [x] **CRM Quản lý Khách hàng & Thợ**: Panel chi tiết nâng cao (Customer Detail Panel), theo dõi log, lịch sử chat, các cờ lừa đảo (fraud signals).
- [x] **Quyền lực Admin (Power Actions)**: Hỗ trợ ép buộc hoàn tiền (forced refunds), khóa/mở/ban tài khoản vi phạm.
- [x] **Duyệt hồ sơ eKYC**: Giao diện duyệt xác minh danh tính và chứng chỉ Thợ.
- [x] **Quản lý Dịch vụ**: Cấu hình bảng giá, danh mục (categories), tỷ lệ hoa hồng linh hoạt.
- [x] **Tài chính & Rút tiền**: Xử lý duyệt yêu cầu rút tiền của Thợ, tự động tổng hợp báo cáo và xuất ra file Excel.

### 🔨 Cần tích hợp thêm (TODO)

- [ ] **OAuth**: Tích hợp đăng nhập nhanh Google, Zalo, Facebook.
- [ ] **OTP SMS/Zalo**: Xác thực số điện thoại thực khi đăng ký để chống spam.
- [ ] **Thanh toán trực tuyến**: Tích hợp cổng thanh toán (VNPay/MoMo/ZaloPay) cho khách hàng nạp Credit.
- [ ] **Bản đồ trực tiếp**: Tích hợp Google Maps API / React Native Maps theo dõi vị trí Thợ di chuyển.
- [ ] **Upload ảnh**: Tích hợp Cloudinary hoặc AWS S3 hoàn thiện thay thế upload local.

---

## 🛠️ Hướng dẫn bảo trì

### Thêm dịch vụ mới (Category)

Mở PostgreSQL và chạy lệnh SQL:

```sql
INSERT INTO categories (id, name, icon_url)
VALUES (uuid_generate_v4(), 'Tên dịch vụ mới', 'https://url-icon.com/icon.png');
```

Sau đó cập nhật danh sách trong file:
`web-client/src/app/register/worker/page.js` → hằng số `SPECIALTIES`

### Thay đổi tỷ lệ hoa hồng

Tìm tất cả chỗ hiển thị `15,5%` hoặc `15.5%` trong dự án:
```
web-client/src/app/page.js         (CTA section)
web-client/src/app/register/worker/page.js  (ghi chú tài chính)
```

Sau này khi có logic tính toán trong backend, cũng cần cập nhật hằng số tại đó.

### Thêm ngân hàng mới

File: `web-client/src/app/register/worker/page.js`
Tìm hằng số `BANKS` và thêm tên ngân hàng vào mảng.

### Thêm quận/huyện mới

File: `web-client/src/app/register/worker/page.js`
Tìm hằng số `DISTRICTS_HCM` và thêm tên quận/huyện vào mảng.

### Thêm route mới cho web-client

Do cấu trúc Next.js của dự án có 2 thư mục `app/` và `src/app/`, **mỗi khi tạo trang mới** cần làm 2 việc:

1. Tạo file thật tại: `src/app/<tên-trang>/page.js`
2. Tạo file re-export tại: `app/<tên-trang>/page.tsx` với nội dung:
   ```ts
   export { default } from '../src/app/<tên-trang>/page';
   ```

---

## 🏗️ Kiến trúc hệ thống

```
┌─────────────────────────────────────────────────┐
│                   NGƯỜI DÙNG                     │
│   Khách hàng          Thợ sửa chữa        Admin  │
└────────┬──────────────────┬──────────────────┬───┘
         │                  │                  │
    ┌────▼────┐        ┌────▼────┐       ┌─────▼────┐
    │  Mobile │        │  Mobile │       │  Web     │
    │  App    │        │  App    │       │  Admin   │
    │ (Expo)  │        │ (Expo)  │       │  (Vite)  │
    └────┬────┘        └────┬────┘       └─────┬────┘
         │                  │                  │
         └──────────────────┴──────────────────┘
                            │
                   ┌────────▼────────┐
                   │  Backend API    │
                   │  (Express.js)   │
                   │  Port: 5000     │
                   └────────┬────────┘
                            │
                   ┌────────▼────────┐
                   │  PostgreSQL DB  │
                   │  apptimtho      │
                   └─────────────────┘
```

---

## 📞 Thông tin liên hệ & bàn giao

> Phần này được điền bởi bên bán trước khi bàn giao.

| Thông tin | Giá trị |
|-----------|---------|
| Tên dự án | AppTimTho |
| Phiên bản bàn giao | v1.0.0 |
| Ngày bàn giao | __________________ |
| Bên bán | __________________ |
| Bên mua | __________________ |
| Bảo hành sau bàn giao | __________________ |

---

*README này được tạo để đảm bảo bên tiếp nhận có thể tự vận hành và bảo trì hệ thống mà không cần liên hệ lại bên bàn giao.*
