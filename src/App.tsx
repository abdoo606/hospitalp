import React, { useEffect } from 'react';
import { useHospitalStore } from './store/hospitalStore';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { LoginPage, RegisterPage } from './components/AuthPages';
import { AdminDashboard } from './components/AdminDashboard';
import { DoctorDashboard } from './components/DoctorDashboard';
import { NurseDashboard } from './components/NurseDashboard';
import { PatientDashboard } from './components/PatientDashboard';

const App: React.FC = () => {
  const { currentPage, currentUser, sidebarOpen, toggleSidebar, setCurrentPage } = useHospitalStore();

  useEffect(() => {
    if (sidebarOpen) toggleSidebar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      case 'admin-dashboard':
        return currentUser?.role === 'admin' ? <AdminDashboard /> : <LoginPage />;
      case 'doctor-dashboard':
        return currentUser?.role === 'doctor' ? <DoctorDashboard /> : <LoginPage />;
      case 'nurse-dashboard':
        return currentUser?.role === 'nurse' ? <NurseDashboard /> : <LoginPage />;
      case 'patient-dashboard':
        return currentUser?.role === 'patient' ? <PatientDashboard /> : <LoginPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-dark text-white font-cairo" dir="rtl">
      <Navbar />
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/80" onClick={toggleSidebar}></div>
          <div className="absolute top-0 right-0 w-80 h-full glass-card border-l border-dark-border p-6 animate-slideInRight overflow-y-auto">
            <div className="pt-20">
              {!currentUser ? (
                <div className="space-y-2">
                  {[
                    { key: 'home', label: 'الرئيسية', icon: '🏠' },
                    { key: 'about', label: 'عن المستشفى', icon: '📋' },
                    { key: 'departments', label: 'الأقسام الطبية', icon: '🏥' },
                    { key: 'doctors', label: 'أطباؤنا', icon: '👨‍⚕️' },
                    { key: 'services', label: 'الخدمات', icon: '⭐' },
                    { key: 'contact', label: 'تواصل معنا', icon: '📞' },
                  ].map(item => (
                    <button
                      key={item.key}
                      onClick={() => { setCurrentPage(item.key); toggleSidebar(); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all ${
                        currentPage === item.key ? 'bg-gold/10 text-gold border-r-2 border-gold' : 'text-slate-400 hover:text-gold hover:bg-gold/5'
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                  <div className="border-t border-dark-border pt-4 mt-4 space-y-2">
                    <button onClick={() => { setCurrentPage('login'); toggleSidebar(); }} className="w-full btn-luxury btn-luxury-outline !py-3">
                      تسجيل الدخول
                    </button>
                    <button onClick={() => { setCurrentPage('register'); toggleSidebar(); }} className="w-full btn-luxury btn-luxury-primary !py-3">
                      إنشاء حساب
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="glass-card p-4 border border-dark-border">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-gold to-gold-light flex items-center justify-center text-dark text-lg font-black">
                        {currentUser.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-bold">{currentUser.name}</p>
                        <p className="text-xs text-gold uppercase tracking-wider">
                          {currentUser.role === 'admin' ? 'ADMIN' : currentUser.role === 'doctor' ? 'DOCTOR' : currentUser.role === 'nurse' ? 'NURSE' : 'PATIENT'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => { setCurrentPage(`${currentUser.role}-dashboard`); toggleSidebar(); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-400 hover:text-gold hover:bg-gold/5"
                  >
                    <span className="text-lg">📊</span>
                    لوحة التحكم
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <main>
        {renderPage()}
      </main>
    </div>
  );
};

export default App;
