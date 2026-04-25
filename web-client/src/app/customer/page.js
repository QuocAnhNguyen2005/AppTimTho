import React from 'react';

export default function CustomerPortal() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Tìm thợ sửa chữa quanh bạn
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Hàng ngàn thợ sửa chữa uy tín đã sẵn sàng phục vụ bạn. Lựa chọn dịch vụ để bắt đầu.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-16 relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            type="text" 
            placeholder="Bạn đang cần sửa chữa gì? (VD: Sửa máy lạnh, Thông tắc cống...)" 
            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors shadow-sm text-lg"
          />
          <button className="absolute inset-y-2 right-2 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors">
            Tìm Kiếm
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: '⚡', name: 'Điện Gia Dụng', color: 'blue' },
            { icon: '❄️', name: 'Điện Lạnh', color: 'cyan' },
            { icon: '🚰', name: 'Đường Ống Nước', color: 'teal' },
            { icon: '🔨', name: 'Mộc & Nội Thất', color: 'amber' },
            { icon: '📱', name: 'Điện Tử', color: 'indigo' },
            { icon: '🧹', name: 'Vệ Sinh', color: 'green' },
            { icon: '🔑', name: 'Sửa Khóa', color: 'yellow' },
            { icon: '🔧', name: 'Khác', color: 'slate' }
          ].map((cat, idx) => (
            <button key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-lg transition-all group flex flex-col items-center justify-center text-center">
              <div className={`w-14 h-14 bg-${cat.color}-100 dark:bg-${cat.color}-900/30 text-${cat.color}-600 dark:text-${cat.color}-400 rounded-full flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                {cat.icon}
              </div>
              <span className="font-medium text-slate-900 dark:text-white">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
