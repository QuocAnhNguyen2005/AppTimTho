import Link from 'next/link';
import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-40">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-900 -z-10" />
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-indigo-300/30 dark:bg-indigo-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-96 h-96 bg-purple-300/30 dark:bg-purple-900/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 animate-fade-in-up">
            Giải quyết sự cố <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Chỉ trong 5 phút
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10 animate-fade-in-up delay-100">
            TìmThợ là nền tảng kết nối thợ sửa chữa gia dụng, điện lạnh, ống nước với khách hàng. 
            Giá cả minh bạch, thợ đã được xác minh danh tính.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-200">
            <Link 
              href="/customer" 
              className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-1"
            >
              Tìm Thợ Ngay
            </Link>
            <Link 
              href="/worker" 
              className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-100 dark:border-slate-700 rounded-2xl font-bold text-lg shadow-sm transition-all transform hover:-translate-y-1"
            >
              Trở Thành Đối Tác
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-white dark:bg-slate-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Dịch Vụ Phổ Biến</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Các dịch vụ sửa chữa được yêu cầu nhiều nhất trên hệ thống của chúng tôi.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="group bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors shadow-sm hover:shadow-xl">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                ⚡
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Sửa Điện Gia Dụng</h3>
              <p className="text-slate-600 dark:text-slate-400">Khắc phục chập cháy, thay mới đường dây, lắp đặt thiết bị điện an toàn cho gia đình.</p>
            </div>

            {/* Service 2 */}
            <div className="group bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-500 transition-colors shadow-sm hover:shadow-xl">
              <div className="w-16 h-16 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                ❄️
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Điện Lạnh</h3>
              <p className="text-slate-600 dark:text-slate-400">Bảo dưỡng điều hòa, sửa chữa tủ lạnh, máy giặt tận nhà nhanh chóng và chuyên nghiệp.</p>
            </div>

            {/* Service 3 */}
            <div className="group bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-500 transition-colors shadow-sm hover:shadow-xl">
              <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                🚰
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Đường Ống Nước</h3>
              <p className="text-slate-600 dark:text-slate-400">Xử lý rò rỉ, thông tắc bồn cầu, chậu rửa, lắp đặt thiết bị vệ sinh cao cấp.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-600 -z-10" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 -z-10" />
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Sẵn sàng gia tăng thu nhập?
          </h2>
          <p className="text-indigo-100 text-lg max-w-2xl mx-auto mb-10">
            Tham gia cộng đồng hàng ngàn thợ sửa chữa chuyên nghiệp. Tự do thời gian, thu nhập hấp dẫn với mức phí nền tảng cạnh tranh nhất thị trường.
          </p>
          <Link 
            href="/worker" 
            className="inline-block px-10 py-5 bg-white text-indigo-600 hover:bg-indigo-50 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
          >
            Đăng Ký Làm Thợ Ngay
          </Link>
        </div>
      </section>
    </div>
  );
}
