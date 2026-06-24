import React from 'react';
import { useHospitalStore } from '../store/hospitalStore';
import { Menu, X, LogOut, Phone } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, logout, setCurrentPage, currentPage, sidebarOpen, toggleSidebar } = useHospitalStore();

  return (
    <>
      {/* Top Bar */}
      <div className="hidden lg:block bg-gradient-to-r from-dark-card via-dark to-dark-card border-b border-dark-border/50">
        <div className="max-w-[1920px] mx-auto px-8 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-6 text-slate-400">
            <span>📍 الرياض - طريق الملك فهد - بجوار برج المملكة</span>
            <span>🕐 24/7 خدمة الطوارئ</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="tel:920000000" className="flex items-center gap-2 text-gold hover:text-gold-light transition-colors">
              <Phone size={12} />
              <span className="font-bold">920-000-000</span>
            </a>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">info@alhayat-hospital.com</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="sticky top-0 z-50 bg-dark/95 backdrop-blur-xl border-b border-dark-border/50">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setCurrentPage(currentUser ? `${currentUser.role}-dashboard` : 'home')}>
              <div className="w-11 h-11 lg:w-14 lg:h-14 rounded-none bg-gradient-to-br from-gold via-gold-light to-gold flex items-center justify-center text-dark text-xl lg:text-2xl font-black shadow-lg shadow-gold/20 group-hover:shadow-gold/40 transition-all duration-500">
                ✚
              </div>
              <div>
                <h1 className="text-lg lg:text-xl font-black text-gradient tracking-wide">مستشفى الحياة</h1>
                <p className="text-[9px] lg:text-[10px] text-slate-500 tracking-[3px] uppercase">AL-HAYAT HOSPITAL</p>
              </div>
            </div>

            {/* Desktop Nav Links */}
            {!currentUser && (
              <div className="hidden lg:flex items-center gap-1">
                {[
                  { key: 'home', label: 'الرئيسية' },
                  { key: 'about', label: 'عن المستشفى' },
                  { key: 'departments', label: 'الأقسام الطبية' },
                  { key: 'doctors', label: 'أطباؤنا' },
                  { key: 'services', label: 'الخدمات' },
                  { key: 'contact', label: 'تواصل معنا' },
                ].map(item => (
                  <button
                    key={item.key}
                    onClick={() => setCurrentPage(item.key)}
                    className={`px-4 py-2 text-[13px] font-semibold tracking-wide transition-all duration-300 ${
                      currentPage === item.key
                        ? 'text-gold'
                        : 'text-slate-300 hover:text-gold'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}

            {/* Auth Buttons / User Info */}
            <div className="flex items-center gap-3">
              {currentUser ? (
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-3 px-4 py-2 border border-dark-border bg-dark-card/50">
                    <div className="w-9 h-9 bg-gradient-to-br from-gold to-gold-light flex items-center justify-center text-dark text-sm font-black">
                      {currentUser.name.charAt(0)}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">{currentUser.name}</p>
                      <p className="text-[10px] text-gold uppercase tracking-wider">
                        {currentUser.role === 'admin' ? 'ADMINISTRATOR' : currentUser.role === 'doctor' ? 'DOCTOR' : currentUser.role === 'nurse' ? 'NURSE' : 'PATIENT'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="btn-luxury btn-luxury-outline flex items-center gap-2 !py-2.5 !px-4 !text-xs !text-red-400 !border-red-500/50 hover:!bg-red-500 hover:!text-white hover:!border-red-500"
                  >
                    <LogOut size={14} />
                    <span className="hidden sm:inline">خروج</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage('login')}
                    className="btn-luxury btn-luxury-outline !py-2.5 !px-5 !text-xs"
                  >
                    تسجيل الدخول
                  </button>
                  <button
                    onClick={() => setCurrentPage('register')}
                    className="btn-luxury btn-luxury-primary !py-2.5 !px-5 !text-xs"
                  >
                    إنشاء حساب
                  </button>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2.5 border border-gold/30 text-gold hover:bg-gold/10 transition-all"
              >
                {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};
