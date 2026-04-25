# 🔧 AppTimTho — Nền tảng kết nối thợ sửa chữa

> Hệ thống full-stack kết nối **Khách hàng** (người có nhu cầu sửa chữa) với **Thợ sửa chữa** (đối tác), vận hành theo mô hình hoa hồng **15,5%** trên mỗi giao dịch.

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
| `users` | Tài khoản Khách hàng |
| `workers` | Tài khoản Thợ sửa chữa (đối tác) |
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

## 📱 Công nghệ sử dụng

| Layer | Công nghệ |
|-------|----------|
| **Backend API** | Node.js, Express.js v5, PostgreSQL, pg (node-postgres) |
| **Web Admin** | React 19, Vite 8, React Router v7, Lucide React |
| **Web Client** | Next.js 16 (App Router), TailwindCSS v4 |
| **Mobile App** | Expo SDK, React Native, Expo Router |
| **Database** | PostgreSQL 15+ |

---

## 📋 Trạng thái tính năng (Feature Status)

### ✅ Đã hoàn thiện (UI/UX)

- [x] Trang chủ web-client với đầy đủ sections
- [x] Trang đăng nhập (UI hoàn chỉnh)
- [x] Luồng đăng ký: chọn vai trò → form Khách hàng / form Thợ
- [x] Dashboard Admin (Light/Dark mode)
- [x] Cấu trúc Database hoàn chỉnh (8 bảng)
- [x] Cấu trúc Mobile App khung ban đầu (Expo Router)

### 🔨 Cần tích hợp thêm (TODO)

- [ ] **API đăng nhập/đăng ký**: Kết nối form web với backend `POST /api/auth`
- [ ] **OAuth**: Tích hợp đăng nhập Google, Zalo, Facebook
- [ ] **OTP SMS/Zalo**: Xác thực số điện thoại khi đăng ký
- [ ] **Upload ảnh**: CCCD, avatar Thợ → Cloudinary hoặc AWS S3
- [ ] **Luồng đặt thợ (Booking)**: Khách tìm, chọn, đặt thợ
- [ ] **Thanh toán thực**: Tích hợp cổng thanh toán (VNPay/MoMo/ZaloPay)
- [ ] **Chuyển tiền tự động**: Hệ thống tự trích 15,5% và chuyển 84,5% cho Thợ
- [ ] **Real-time**: WebSocket để Thợ nhận đơn ngay lập tức
- [ ] **Admin duyệt Thợ**: Quy trình duyệt hồ sơ trong web-admin
- [ ] **Bản đồ**: Google Maps API cho vị trí Thợ và Khách

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
