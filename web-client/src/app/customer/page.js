import React from 'react';

export default function CustomerPortal() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 min-h-screen relative shadow-sm">
        
        {/* 1. Header */}
        <div className="px-5 pt-6 pb-4 bg-white dark:bg-gray-800 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 mb-1 cursor-pointer">
            <span className="text-red-500">📍</span>
            <span className="font-medium truncate">144 Xuân Thủy, Cầu Giấy</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              Chào buổi sáng, Nguyễn Văn A <span className="ml-2 text-2xl">👋</span>
            </h1>
            <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 relative text-gray-600 dark:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
            </button>
          </div>
        </div>

        {/* 2. Search Bar & Banner */}
        <div className="px-5 py-2">
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <span className="text-gray-400 text-lg">🔍</span>
            </div>
            <input 
              type="text" 
              placeholder="Bạn đang cần sửa gì hôm nay?" 
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 p-5 text-white shadow-md relative overflow-hidden mb-8">
            <div className="relative z-10 w-2/3">
              <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2 py-1 rounded-lg inline-block mb-2 text-white">Ưu đãi mới</span>
              <h2 className="text-lg font-bold mb-1 leading-tight">Giảm 15% phí dịch vụ</h2>
              <p className="text-sm text-blue-100 mb-3">Cho lần gọi thợ đầu tiên!</p>
              <button className="bg-white text-blue-600 text-xs font-bold px-4 py-2 rounded-xl shadow-sm hover:bg-blue-50 transition-colors cursor-pointer">
                Lấy Mã Ngay
              </button>
            </div>
            <div className="absolute -right-6 -bottom-6 text-8xl opacity-20 transform -rotate-12">
              🎁
            </div>
          </div>
        </div>

        {/* 3. Lưới Danh Mục Dịch Vụ */}
        <div className="px-5 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Dịch Vụ Nổi Bật</h3>
            <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">Xem tất cả</button>
          </div>
          <div className="grid grid-cols-3 gap-x-4 gap-y-6">
            {[
              { icon: '❄️', name: 'Điện lạnh', color: 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-500' },
              { icon: '💧', name: 'Sửa ống nước', color: 'bg-blue-100 dark:bg-blue-900/40 text-blue-500' },
              { icon: '🔌', name: 'Điện gia dụng', color: 'bg-orange-100 dark:bg-orange-900/40 text-orange-500' },
              { icon: '💻', name: 'PC / Laptop', color: 'bg-purple-100 dark:bg-purple-900/40 text-purple-500' },
              { icon: '🚪', name: 'Mộc & Nội thất', color: 'bg-amber-100 dark:bg-amber-900/40 text-amber-500' },
              { icon: '🧹', name: 'Vệ sinh', color: 'bg-teal-100 dark:bg-teal-900/40 text-teal-500' }
            ].map((cat, idx) => (
              <div key={idx} className="flex flex-col items-center group cursor-pointer">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-2 ${cat.color} group-hover:scale-105 transition-transform shadow-sm`}>
                  {cat.icon}
                </div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center leading-tight">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Thợ Uy Tín Gần Bạn */}
        <div className="pl-5 mb-10 overflow-hidden">
          <div className="flex justify-between items-center mb-4 pr-5">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Thợ Uy Tín Gần Bạn</h3>
          </div>
          <div className="flex overflow-x-auto pb-4 pr-5 -mx-5 px-5 space-x-4 snap-x hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <style dangerouslySetInnerHTML={{__html: `
              .hide-scrollbar::-webkit-scrollbar { display: none; }
            `}} />
            
            {[
              { name: 'Trần Văn Cường', spec: 'Chuyên Điện lạnh', rating: '4.9', reviews: 120, dist: '1.2 km', avatar: 'https://i.pravatar.cc/150?img=11' },
              { name: 'Lê Hoàng Hải', spec: 'Sửa ống nước', rating: '4.8', reviews: 85, dist: '2.5 km', avatar: 'https://i.pravatar.cc/150?img=33' },
              { name: 'Phạm Đức Anh', spec: 'Điện gia dụng', rating: '5.0', reviews: 204, dist: '3.1 km', avatar: 'https://i.pravatar.cc/150?img=53' }
            ].map((worker, idx) => (
              <div key={idx} className="min-w-[240px] bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 shadow-sm snap-center flex-shrink-0">
                <div className="flex items-start space-x-3 mb-3">
                  <img src={worker.avatar} alt={worker.name} className="w-14 h-14 rounded-full object-cover border-2 border-gray-50 dark:border-gray-700" />
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm flex items-center">
                      {worker.name}
                    </h4>
                    <div className="flex items-center mt-1 space-x-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-[10px] font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-1.5 py-0.5 rounded">Đã xác minh</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{worker.spec}</span>
                  <div className="flex items-center">
                    <span className="text-yellow-400 mr-1">⭐️</span>
                    <span className="font-bold text-gray-900 dark:text-white">{worker.rating}</span>
                    <span className="ml-1">({worker.reviews})</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button className="flex-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold py-2 rounded-xl text-xs hover:bg-blue-100 transition-colors cursor-pointer">
                    Xem hồ sơ
                  </button>
                  <button className="flex-1 bg-blue-600 text-white font-bold py-2 rounded-xl text-xs hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 dark:shadow-none cursor-pointer">
                    Gọi ngay
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
          <div className="max-w-md mx-auto flex justify-between px-6 py-3">
            {[
              { icon: '🏠', label: 'Trang chủ', active: true },
              { icon: '📋', label: 'Đơn hàng', active: false },
              { icon: '💬', label: 'Tin nhắn', active: false },
              { icon: '👤', label: 'Tài khoản', active: false }
            ].map((tab, idx) => (
              <button key={idx} className="flex flex-col items-center space-y-1 cursor-pointer">
                <span className={`text-xl ${!tab.active && 'opacity-60 grayscale'}`}>{tab.icon}</span>
                <span className={`text-[10px] font-medium ${tab.active ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
                  {tab.label}
                </span>
                {tab.active && <div className="w-1 h-1 bg-blue-600 rounded-full mt-1"></div>}
              </button>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
}
