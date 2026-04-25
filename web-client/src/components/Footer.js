import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                T
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                Tìm<span className="text-indigo-400">Thợ</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 mb-4">
              Nền tảng kết nối thợ sửa chữa và người dùng hàng đầu Việt Nam. Nhanh chóng, uy tín và chất lượng.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Dành cho Khách hàng</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/customer" className="hover:text-white transition-colors">Tìm thợ ngay</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Các dịch vụ</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Hướng dẫn sử dụng</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Chính sách bảo hành</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Dành cho Thợ</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/worker" className="hover:text-white transition-colors">Đăng ký làm thợ</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Quy chế hoạt động</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Chính sách hoa hồng</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Cộng đồng</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Hỗ trợ</h3>
            <ul className="space-y-2 text-sm">
              <li><span className="text-slate-400">Hotline:</span> 1900 xxxx</li>
              <li><span className="text-slate-400">Email:</span> hotro@timtho.vn</li>
              <li><span className="text-slate-400">Địa chỉ:</span> 123 Đường ABC, Quận XYZ, TP.HCM</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} TìmThợ. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}
