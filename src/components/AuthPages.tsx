import React, { useState } from 'react';
import { useHospitalStore, UserRole } from '../store/hospitalStore';
import { Mail, Lock, User, Phone, Stethoscope, Eye, EyeOff, AlertCircle, CheckCircle, Info } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, setCurrentPage } = useHospitalStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('يرجى ملء جميع الحقول'); return; }
    const success = login(email, password);
    if (!success) setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
  };

  const quickLogin = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
    login(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="glass-card p-8 border border-dark-border animate-fadeIn">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gold to-gold-light flex items-center justify-center text-dark text-2xl font-black animate-pulse-glow">
              ✚
            </div>
            <h1 className="text-2xl font-black text-gradient mb-1">تسجيل الدخول</h1>
            <p className="text-xs text-slate-500 tracking-wider">ادخل بيانات حسابك للمتابعة</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-4 border border-red-500/30 bg-red-500/10 text-red-400 text-sm mb-6">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                placeholder="البريد الإلكتروني"
                className="w-full pr-12 pl-4 py-4 input-luxury text-sm"
              />
            </div>
            <div className="relative">
              <Lock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                placeholder="كلمة المرور"
                className="w-full pr-12 pl-12 py-4 input-luxury text-sm"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-gold transition-colors">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <button type="submit" className="w-full btn-luxury btn-luxury-primary">
              تسجيل الدخول
            </button>
          </form>

          {/* Quick Login */}
          <div className="mt-8 pt-6 border-t border-dark-border">
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
              <Info size={12} />
              <span>دخول سريع للتجربة:</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: '🔑 مدير', email: 'admin@alhayat.med', pass: 'Admin@2024', color: 'border-gold/30 hover:border-gold hover:bg-gold/5' },
                { label: '👨‍⚕️ طبيب', email: 'ahmed@doctor.alhayat.med', pass: 'Doctor@2024', color: 'border-primary/30 hover:border-primary hover:bg-primary/5' },
                { label: '👩‍⚕️ ممرضة', email: 'noura@nurse.alhayat.med', pass: 'Nurse@2024', color: 'border-purple-500/30 hover:border-purple-500 hover:bg-purple-500/5' },
                { label: '🏥 مريض', email: 'khaled@patient.alhayat.med', pass: 'Patient@2024', color: 'border-blue-500/30 hover:border-blue-500 hover:bg-blue-500/5' },
              ].map(item => (
                <button
                  key={item.email}
                  onClick={() => quickLogin(item.email, item.pass)}
                  className={`py-3 px-4 text-xs font-medium text-slate-300 border ${item.color} transition-all duration-300`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-sm text-slate-500 mt-6">
            ليس لديك حساب؟{' '}
            <button onClick={() => setCurrentPage('register')} className="text-gold font-bold hover:underline">
              سجل الآن
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export const RegisterPage: React.FC = () => {
  const { register, setCurrentPage, login } = useHospitalStore();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '', role: 'patient' as UserRole, specialization: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const getEmailDomain = (role: UserRole) => {
    switch (role) {
      case 'doctor': return '@doctor.alhayat.med';
      case 'nurse': return '@nurse.alhayat.med';
      case 'patient': return '@patient.alhayat.med';
      default: return '@alhayat.med';
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { setError('يرجى ملء جميع الحقول المطلوبة'); return; }
    if (form.password !== form.confirmPassword) { setError('كلمتا المرور غير متطابقتين'); return; }
    if (form.password.length < 8) { setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل'); return; }
    
    const expectedDomain = getEmailDomain(form.role);
    if (!form.email.endsWith(expectedDomain)) {
      setError(`البريد الإلكتروني يجب أن ينتهي بـ ${expectedDomain}`);
      return;
    }
    
    const success = register({
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
      phone: form.phone,
      specialization: form.role === 'doctor' ? form.specialization : undefined,
    });

    if (success) {
      setSuccess(true);
      setTimeout(() => {
        login(form.email, form.password);
      }, 1500);
    } else {
      setError('البريد الإلكتروني مسجل مسبقاً');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="glass-card p-8 border border-dark-border animate-fadeIn">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-2xl font-black">
              📝
            </div>
            <h1 className="text-2xl font-black text-gradient-teal mb-1">حساب جديد</h1>
            <p className="text-xs text-slate-500 tracking-wider">سجل حسابك للوصول لخدماتنا</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-4 border border-red-500/30 bg-red-500/10 text-red-400 text-sm mb-4">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-4 border border-success/30 bg-success/10 text-success text-sm mb-4">
              <CheckCircle size={16} />
              تم التسجيل بنجاح! جاري تحويلك...
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="text-xs text-slate-500 mb-2 block tracking-wider uppercase">نوع الحساب</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'patient' as UserRole, label: '🏥 مريض', desc: 'للمرضى والمراجعين' },
                  { value: 'doctor' as UserRole, label: '👨‍⚕️ طبيب', desc: 'للأطباء المعتمدين' },
                ].map(role => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, role: role.value, email: '' }))}
                    className={`p-4 text-right transition-all duration-300 ${
                      form.role === role.value
                        ? 'bg-primary/10 border-2 border-primary'
                        : 'bg-dark-card/50 border border-dark-border hover:border-primary/30'
                    }`}
                  >
                    <span className="block text-sm font-bold text-white">{role.label}</span>
                    <span className="block text-[10px] text-slate-500 mt-0.5">{role.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Email Format Info */}
            <div className="flex items-start gap-2 p-3 bg-gold/5 border border-gold/20 text-xs">
              <Info size={14} className="text-gold mt-0.5 shrink-0" />
              <div>
                <p className="text-gold font-bold">صيغة البريد الإلكتروني المطلوبة:</p>
                <p className="text-slate-400 mt-1">
                  {form.role === 'doctor' && 'yourname@doctor.alhayat.med'}
                  {form.role === 'nurse' && 'yourname@nurse.alhayat.med'}
                  {form.role === 'patient' && 'yourname@patient.alhayat.med'}
                </p>
              </div>
            </div>

            <div className="relative">
              <User size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={form.name}
                onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setError(''); }}
                placeholder="الاسم الكامل *"
                className="w-full pr-12 pl-4 py-4 input-luxury text-sm"
              />
            </div>

            <div className="relative">
              <Mail size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                value={form.email}
                onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setError(''); }}
                placeholder={`البريد الإلكتروني * (مثال: name${getEmailDomain(form.role)})`}
                className="w-full pr-12 pl-4 py-4 input-luxury text-sm"
              />
            </div>

            <div className="relative">
              <Phone size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="رقم الجوال (05xxxxxxxx)"
                className="w-full pr-12 pl-4 py-4 input-luxury text-sm"
              />
            </div>

            {form.role === 'doctor' && (
              <div className="relative">
                <Stethoscope size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  value={form.specialization}
                  onChange={e => setForm(f => ({ ...f, specialization: e.target.value }))}
                  placeholder="التخصص الطبي *"
                  className="w-full pr-12 pl-4 py-4 input-luxury text-sm"
                />
              </div>
            )}

            <div className="relative">
              <Lock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                value={form.password}
                onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setError(''); }}
                placeholder="كلمة المرور * (8 أحرف على الأقل)"
                className="w-full pr-12 pl-4 py-4 input-luxury text-sm"
              />
            </div>

            <div className="relative">
              <Lock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                value={form.confirmPassword}
                onChange={e => { setForm(f => ({ ...f, confirmPassword: e.target.value })); setError(''); }}
                placeholder="تأكيد كلمة المرور *"
                className="w-full pr-12 pl-4 py-4 input-luxury text-sm"
              />
            </div>

            <button type="submit" className="w-full btn-luxury btn-luxury-teal">
              إنشاء الحساب
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            لديك حساب؟{' '}
            <button onClick={() => setCurrentPage('login')} className="text-primary-light font-bold hover:underline">
              سجل الدخول
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
