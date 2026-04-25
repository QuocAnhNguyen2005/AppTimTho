import React from 'react';

export default function WorkerPortal() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Hero Section for Workers */}
      <section className="relative py-20 overflow-hidden border-b border-slate-100 dark:border-slate-800">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-indigo-50 to-transparent dark:from-indigo-900/20 dark:to-transparent -z-10" />
        
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block px-4 py-2 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-full font-semibold text-sm mb-6">
              Dành riêng cho đối tác
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              Tự Do Tài Chính. <br/>
              <span className="text-indigo-600 dark:text-indigo-400">Làm Chủ Thu Nhập.</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              Gia nhập mạng lưới hàng ngàn thợ sửa chữa xuất sắc. Nhận việc đều đặn mỗi ngày, chủ động thời gian và nhận thanh toán nhanh chóng.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg transition-all transform hover:-translate-y-1">
                Đăng Ký Tài Khoản Thợ
              </button>
              <button className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl font-bold shadow-sm transition-all">
                Đăng Nhập
              </button>
            </div>
          </div>
          
          <div className="hidden md:block">
            {/* Visual placeholder for worker illustration */}
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full opacity-20 blur-3xl animate-pulse"></div>
              <div className="relative h-full w-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl shadow-2xl p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center text-xl font-bold text-indigo-600 dark:text-indigo-400">
                        A
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">Nguyễn Văn A</p>
                        <p className="text-sm text-slate-500">Thợ Điện Lạnh • ⭐ 4.9</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-500 mb-1">Thu nhập tháng</p>
                      <p className="font-bold text-green-500 text-xl">15.420.000đ</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-600">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-slate-900 dark:text-white">Sửa điều hòa không mát</span>
                        <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Mới nhận</span>
                      </div>
                      <p className="text-sm text-slate-500">Quận 1, TP.HCM • 2km</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-600">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-slate-900 dark:text-white">Bảo dưỡng máy giặt</span>
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">Hoàn thành</span>
                      </div>
                      <p className="text-sm text-slate-500">Quận 3, TP.HCM • +350.000đ</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-800/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Tại Sao Chọn Chúng Tôi?</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Chính sách minh bạch, ưu tiên quyền lợi cho đối tác là kim chỉ nam của chúng tôi.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-2xl flex items-center justify-center text-2xl mb-6">
                💰
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Phí Nền Tảng Thấp</h3>
              <p className="text-slate-600 dark:text-slate-400">Chỉ 15.5% hoa hồng trên mỗi đơn hàng hoàn thành. Mức phí cạnh tranh nhất trên thị trường hiện nay.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center text-2xl mb-6">
                ⏱️
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Tự Do Thời Gian</h3>
              <p className="text-slate-600 dark:text-slate-400">Bạn là ông chủ của chính mình. Chủ động bật/tắt nhận việc bất cứ khi nào bạn muốn nghỉ ngơi hoặc làm việc.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center text-2xl mb-6">
                🛡️
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Bảo Vệ Đối Tác</h3>
              <p className="text-slate-600 dark:text-slate-400">Có tổng đài hỗ trợ 24/7 xử lý các sự cố với khách hàng. Đảm bảo quyền lợi và thu nhập chính đáng của bạn.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
