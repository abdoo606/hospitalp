import React, { useState } from 'react';
import { useHospitalStore } from '../store/hospitalStore';
import {
  BarChart3, Users, DollarSign, Skull, Building2,
  Trash2, Plus, Search, Printer, UserPlus, X,
  FileText, ArrowUpRight, ArrowDownRight, Stethoscope, Calendar
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const COLORS = ['#d4af37', '#14b8a6', '#3b82f6', '#ef4444', '#8b5cf6', '#f59e0b', '#10b981', '#ec4899'];

export const AdminDashboard: React.FC = () => {
  const store = useHospitalStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDept, setShowAddDept] = useState(false);
  const [newDept, setNewDept] = useState({ name: '', description: '', bedsCount: 0, occupiedBeds: 0, icon: '🏥', floor: '', phone: '' });

  const totalRevenue = store.financialRecords.reduce((sum, r) => sum + r.amount, 0);
  const paidRevenue = store.financialRecords.filter(r => r.paid).reduce((sum, r) => sum + r.amount, 0);
  const unpaidRevenue = totalRevenue - paidRevenue;
  const totalPatients = store.patients.length;
  const activePatients = store.patients.filter(p => p.status === 'نشط').length;
  const deceasedPatients = store.patients.filter(p => p.status === 'متوفى').length;
  const dischargedPatients = store.patients.filter(p => p.status === 'خرج').length;
  const totalDoctors = store.users.filter(u => u.role === 'doctor').length;
  const totalNurses = store.users.filter(u => u.role === 'nurse').length;

  const revenueByType = store.financialRecords.reduce((acc: Record<string, number>, r) => {
    acc[r.type] = (acc[r.type] || 0) + r.amount;
    return acc;
  }, {});

  const pieData = Object.entries(revenueByType).map(([name, value]) => ({ name, value }));

  const monthlyData = [
    { month: 'يناير', revenue: 145000, patients: 220 },
    { month: 'فبراير', revenue: 152000, patients: 235 },
    { month: 'مارس', revenue: 148000, patients: 228 },
    { month: 'أبريل', revenue: 161000, patients: 255 },
    { month: 'مايو', revenue: 155000, patients: 242 },
    { month: 'يونيو', revenue: 167000, patients: 268 },
    { month: 'يوليو', revenue: 172000, patients: 275 },
    { month: 'أغسطس', revenue: 158000, patients: 248 },
    { month: 'سبتمبر', revenue: 163000, patients: 260 },
    { month: 'أكتوبر', revenue: 170000, patients: 272 },
    { month: 'نوفمبر', revenue: 175000, patients: 280 },
    { month: 'ديسمبر', revenue: 182000, patients: 295 },
  ];

  const patientStatusData = [
    { name: 'نشط', value: activePatients, color: '#10b981' },
    { name: 'خرج', value: dischargedPatients, color: '#3b82f6' },
    { name: 'متوفى', value: deceasedPatients, color: '#ef4444' },
  ];

  const handlePrint = () => { window.print(); };

  const handleAddDept = () => {
    if (newDept.name) {
      store.addDepartment(newDept);
      setNewDept({ name: '', description: '', bedsCount: 0, occupiedBeds: 0, icon: '🏥', floor: '', phone: '' });
      setShowAddDept(false);
    }
  };

  const tabs = [
    { key: 'overview', label: 'نظرة عامة', icon: BarChart3 },
    { key: 'patients', label: 'المرضى', icon: Users },
    { key: 'finance', label: 'الأرباح والمالية', icon: DollarSign },
    { key: 'departments', label: 'الأقسام', icon: Building2 },
    { key: 'staff', label: 'الموظفين', icon: UserPlus },
    { key: 'duty', label: 'جدول المناوبات', icon: Calendar },
    { key: 'reports', label: 'التقارير', icon: FileText },
  ];

  return (
    <div className="min-h-screen pt-4 lg:pt-8 px-3 lg:px-6 pb-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-gradient">لوحة التحكم</h1>
            <p className="text-xs text-slate-500 mt-1 tracking-wider">مرحباً {store.currentUser?.name} - مدير النظام</p>
          </div>
          <button onClick={handlePrint} className="no-print btn-luxury btn-luxury-primary flex items-center gap-2 !py-3 !px-6">
            <Printer size={16} />
            طباعة التقرير
          </button>
        </div>

        {/* Tabs */}
        <div className="no-print flex overflow-x-auto gap-1 mb-6 pb-2 border-b border-dark-border">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-bold whitespace-nowrap transition-all duration-300 tracking-wider uppercase ${
                activeTab === tab.key
                  ? 'text-gold border-b-2 border-gold bg-gold/5'
                  : 'text-slate-500 hover:text-gold hover:bg-gold/5'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: DollarSign, label: 'إجمالي الإيرادات', value: `${totalRevenue.toLocaleString()}`, sub: `محصّل: ${paidRevenue.toLocaleString()} ر.س`, color: 'border-success', trend: '+12%', up: true },
                { icon: Users, label: 'إجمالي المرضى', value: totalPatients, sub: `نشط حالياً: ${activePatients}`, color: 'border-blue-500', trend: '+8%', up: true },
                { icon: Skull, label: 'حالات الوفاة', value: deceasedPatients, sub: `من أصل ${totalPatients} مريض`, color: 'border-red-500', trend: '-3%', up: false },
                { icon: Stethoscope, label: 'الطاقم الطبي', value: totalDoctors + totalNurses, sub: `${totalDoctors} طبيب | ${totalNurses} ممرض`, color: 'border-purple-500', trend: '+5%', up: true },
              ].map((stat, i) => (
                <div key={i} className={`glass-card p-5 border-r-4 ${stat.color} card-luxury`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-dark-card flex items-center justify-center">
                      <stat.icon size={18} className="text-gold" />
                    </div>
                    <span className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${stat.up ? 'text-success' : 'text-red-400'}`}>
                      {stat.up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                      {stat.trend}
                    </span>
                  </div>
                  <div className="text-2xl font-black text-white">{stat.value}</div>
                  <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">{stat.label}</div>
                  <div className="text-[10px] text-slate-600 mt-0.5">{stat.sub}</div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-card p-6 border border-dark-border">
                <h3 className="text-sm font-bold text-gold mb-4 tracking-wider uppercase">📊 الإيرادات الشهرية</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 10 }} />
                    <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} />
                    <Tooltip contentStyle={{ background: '#111827', border: '1px solid #1f2937', color: '#fff', fontSize: 11 }} />
                    <Area type="monotone" dataKey="revenue" stroke="#d4af37" fill="url(#colorRev)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="glass-card p-6 border border-dark-border">
                <h3 className="text-sm font-bold text-gold mb-4 tracking-wider uppercase">📈 حالات المرضى</h3>
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={patientStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                        {patientStatusData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#111827', border: '1px solid #1f2937', color: '#fff', fontSize: 11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center gap-6 mt-2">
                  {patientStatusData.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3" style={{ backgroundColor: item.color }}></div>
                      <span className="text-slate-400">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Revenue by Type */}
            <div className="glass-card p-6 border border-dark-border">
              <h3 className="text-sm font-bold text-gold mb-4 tracking-wider uppercase">💰 الإيرادات حسب النوع</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pieData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: '#111827', border: '1px solid #1f2937', color: '#fff', fontSize: 11 }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {pieData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Patients Tab */}
        {activeTab === 'patients' && (
          <div className="animate-fadeIn">
            <div className="no-print flex items-center gap-3 mb-4">
              <div className="relative flex-1">
                <Search size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="بحث عن مريض..."
                  className="w-full pr-12 pl-4 py-3 input-luxury text-sm"
                />
              </div>
            </div>
            <div className="glass-card border border-dark-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm table-luxury">
                  <thead>
                    <tr>
                      <th className="text-right p-4">رقم الملف</th>
                      <th className="text-right p-4">الاسم</th>
                      <th className="text-right p-4">العمر</th>
                      <th className="text-right p-4">فصيلة الدم</th>
                      <th className="text-right p-4">التأمين</th>
                      <th className="text-right p-4">الغرفة</th>
                      <th className="text-right p-4">الحالة</th>
                      <th className="text-right p-4 no-print">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {store.patients
                      .filter(p => p.name.includes(searchTerm) || p.odNumber.includes(searchTerm))
                      .map(patient => (
                        <tr key={patient.id} className="border-t border-dark-border">
                          <td className="p-4 text-gold font-mono text-xs">{patient.odNumber}</td>
                          <td className="p-4 text-white font-bold">{patient.name}</td>
                          <td className="p-4 text-slate-400">{patient.age}</td>
                          <td className="p-4"><span className="badge-luxury bg-red-500/10 text-red-400">{patient.bloodType}</span></td>
                          <td className="p-4 text-slate-400 text-xs">{patient.insuranceCompany || '-'}</td>
                          <td className="p-4 text-slate-400">{patient.roomNumber || '-'}</td>
                          <td className="p-4">
                            <span className={`badge-luxury ${
                              patient.status === 'نشط' ? 'bg-success/10 text-success' :
                              patient.status === 'خرج' ? 'bg-blue-500/10 text-blue-400' :
                              'bg-red-500/10 text-red-400'
                            }`}>{patient.status}</span>
                          </td>
                          <td className="p-4 no-print">
                            <button onClick={() => store.deletePatient(patient.id)} className="p-2 hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-all">
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Finance Tab */}
        {activeTab === 'finance' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-card p-5 border-r-4 border-gold">
                <div className="text-xs text-slate-500 uppercase tracking-wider">إجمالي الإيرادات</div>
                <div className="text-2xl font-black text-white mt-1">{totalRevenue.toLocaleString()} <span className="text-sm text-slate-500">ر.س</span></div>
              </div>
              <div className="glass-card p-5 border-r-4 border-success">
                <div className="text-xs text-slate-500 uppercase tracking-wider">المحصّل</div>
                <div className="text-2xl font-black text-success mt-1">{paidRevenue.toLocaleString()} <span className="text-sm text-slate-500">ر.س</span></div>
              </div>
              <div className="glass-card p-5 border-r-4 border-red-500">
                <div className="text-xs text-slate-500 uppercase tracking-wider">غير محصّل</div>
                <div className="text-2xl font-black text-red-400 mt-1">{unpaidRevenue.toLocaleString()} <span className="text-sm text-slate-500">ر.س</span></div>
              </div>
            </div>

            <div className="glass-card border border-dark-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm table-luxury">
                  <thead>
                    <tr>
                      <th className="text-right p-4">رقم الفاتورة</th>
                      <th className="text-right p-4">المريض</th>
                      <th className="text-right p-4">النوع</th>
                      <th className="text-right p-4">الوصف</th>
                      <th className="text-right p-4">المبلغ</th>
                      <th className="text-right p-4">التاريخ</th>
                      <th className="text-right p-4">الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {store.financialRecords.map(record => (
                      <tr key={record.id} className="border-t border-dark-border">
                        <td className="p-4 text-gold font-mono text-xs">{record.invoiceNumber || '-'}</td>
                        <td className="p-4 text-white font-medium">{record.patientName}</td>
                        <td className="p-4"><span className="badge-luxury bg-primary/10 text-primary-light">{record.type}</span></td>
                        <td className="p-4 text-slate-400 text-xs max-w-[200px] truncate">{record.description}</td>
                        <td className="p-4 text-white font-bold">{record.amount.toLocaleString()} ر.س</td>
                        <td className="p-4 text-slate-500 text-xs">{record.date}</td>
                        <td className="p-4">
                          <span className={`badge-luxury ${record.paid ? 'bg-success/10 text-success' : 'bg-red-500/10 text-red-400'}`}>
                            {record.paid ? 'مدفوع' : 'غير مدفوع'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Departments Tab */}
        {activeTab === 'departments' && (
          <div className="animate-fadeIn">
            <div className="no-print flex justify-end mb-4">
              <button onClick={() => setShowAddDept(true)} className="btn-luxury btn-luxury-primary flex items-center gap-2 !py-3 !px-6">
                <Plus size={16} />
                إضافة قسم
              </button>
            </div>

            {showAddDept && (
              <div className="glass-card p-6 border border-gold/20 mb-6 no-print animate-fadeIn">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-gold uppercase tracking-wider">إضافة قسم جديد</h3>
                  <button onClick={() => setShowAddDept(false)} className="text-slate-500 hover:text-white"><X size={20} /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input value={newDept.name} onChange={e => setNewDept(d => ({ ...d, name: e.target.value }))} placeholder="اسم القسم" className="p-3 input-luxury text-sm" />
                  <input value={newDept.description} onChange={e => setNewDept(d => ({ ...d, description: e.target.value }))} placeholder="الوصف" className="p-3 input-luxury text-sm" />
                  <input value={newDept.floor} onChange={e => setNewDept(d => ({ ...d, floor: e.target.value }))} placeholder="الطابق" className="p-3 input-luxury text-sm" />
                  <input type="number" value={newDept.bedsCount || ''} onChange={e => setNewDept(d => ({ ...d, bedsCount: +e.target.value }))} placeholder="عدد الأسرّة" className="p-3 input-luxury text-sm" />
                  <input value={newDept.phone} onChange={e => setNewDept(d => ({ ...d, phone: e.target.value }))} placeholder="رقم الهاتف" className="p-3 input-luxury text-sm" />
                  <select value={newDept.icon} onChange={e => setNewDept(d => ({ ...d, icon: e.target.value }))} className="p-3 input-luxury text-sm">
                    {['🏥', '❤️', '🦴', '👶', '👁️', '🧠', '🫁', '🦷', '🚨', '🫀', '🤰', '📷', '🔬', '💊'].map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>
                <button onClick={handleAddDept} className="mt-4 btn-luxury btn-luxury-teal !py-2 !px-6">إضافة</button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {store.departments.map(dept => (
                <div key={dept.id} className="glass-card p-5 border border-dark-border card-luxury group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-3xl">{dept.icon}</div>
                    <button onClick={() => store.deleteDepartment(dept.id)} className="no-print opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">{dept.name}</h3>
                  <p className="text-xs text-slate-500 mb-3">{dept.description}</p>
                  {dept.headDoctor && <p className="text-xs text-gold mb-2">👨‍⚕️ {dept.headDoctor}</p>}
                  {dept.floor && <p className="text-xs text-slate-500 mb-2">📍 {dept.floor}</p>}
                  {dept.bedsCount > 0 && (
                    <>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-slate-500">الأسرّة: {dept.bedsCount}</span>
                        <span className={dept.occupiedBeds / dept.bedsCount > 0.8 ? 'text-red-400' : 'text-success'}>مشغولة: {dept.occupiedBeds}</span>
                      </div>
                      <div className="w-full bg-dark h-1.5">
                        <div className={`h-1.5 ${dept.occupiedBeds / dept.bedsCount > 0.8 ? 'bg-red-500' : 'bg-success'}`} style={{ width: `${(dept.occupiedBeds / dept.bedsCount) * 100}%` }}></div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Staff Tab */}
        {activeTab === 'staff' && (
          <div className="animate-fadeIn">
            <div className="glass-card border border-dark-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm table-luxury">
                  <thead>
                    <tr>
                      <th className="text-right p-4">الاسم</th>
                      <th className="text-right p-4">البريد</th>
                      <th className="text-right p-4">الدور</th>
                      <th className="text-right p-4">الهاتف</th>
                      <th className="text-right p-4">التخصص/القسم</th>
                      <th className="text-right p-4">المناوبة</th>
                      <th className="text-right p-4 no-print">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {store.users.map(user => (
                      <tr key={user.id} className="border-t border-dark-border">
                        <td className="p-4 text-white font-bold">{user.name}</td>
                        <td className="p-4 text-slate-400 text-xs font-mono">{user.email}</td>
                        <td className="p-4">
                          <span className={`badge-luxury ${
                            user.role === 'admin' ? 'bg-gold/10 text-gold' :
                            user.role === 'doctor' ? 'bg-primary/10 text-primary-light' :
                            user.role === 'nurse' ? 'bg-purple-500/10 text-purple-400' :
                            'bg-blue-500/10 text-blue-400'
                          }`}>
                            {user.role === 'admin' ? 'مدير' : user.role === 'doctor' ? 'طبيب' : user.role === 'nurse' ? 'ممرض/ة' : 'مريض'}
                          </span>
                        </td>
                        <td className="p-4 text-slate-400 text-xs">{user.phone}</td>
                        <td className="p-4 text-slate-400 text-xs">{user.specialization || user.department || '-'}</td>
                        <td className="p-4">
                          {user.isOnDuty !== undefined && (
                            <span className={`badge-luxury ${user.isOnDuty ? 'bg-success/10 text-success' : 'bg-slate-500/10 text-slate-400'}`}>
                              {user.isOnDuty ? '● مناوب' : '○ خارج المناوبة'}
                            </span>
                          )}
                        </td>
                        <td className="p-4 no-print">
                          {user.role !== 'admin' && (
                            <button onClick={() => store.deleteUser(user.id)} className="p-2 hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-all">
                              <Trash2 size={14} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Duty Schedule Tab */}
        {activeTab === 'duty' && (
          <div className="animate-fadeIn">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gold mb-4">📅 جدول المناوبات - {new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {['صباحي', 'مسائي', 'ليلي'].map(shift => (
                <div key={shift} className="glass-card p-5 border border-dark-border">
                  <h4 className={`text-sm font-bold mb-4 pb-2 border-b border-dark-border ${
                    shift === 'صباحي' ? 'text-success' : shift === 'مسائي' ? 'text-warning' : 'text-purple-400'
                  }`}>
                    {shift === 'صباحي' ? '☀️' : shift === 'مسائي' ? '🌅' : '🌙'} الدوام {shift}
                    <span className="text-xs text-slate-500 mr-2">
                      ({shift === 'صباحي' ? '08:00 - 16:00' : shift === 'مسائي' ? '16:00 - 00:00' : '00:00 - 08:00'})
                    </span>
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">الأطباء</p>
                      {store.dutySchedules.filter(s => s.role === 'doctor' && s.shiftType === shift).map(s => (
                        <div key={s.id} className="flex items-center justify-between p-2 bg-dark-card/50 mb-1">
                          <span className="text-sm text-white">{s.staffName}</span>
                          <span className="text-xs text-slate-500">{s.department}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">الممرضين</p>
                      {store.dutySchedules.filter(s => s.role === 'nurse' && s.shiftType === shift).map(s => (
                        <div key={s.id} className="flex items-center justify-between p-2 bg-dark-card/50 mb-1">
                          <span className="text-sm text-white">{s.staffName}</span>
                          <span className="text-xs text-slate-500">{s.department}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-6 border border-dark-border">
                <h3 className="text-sm font-bold text-gold mb-4 uppercase tracking-wider">📋 ملخص المرضى</h3>
                <div className="space-y-3">
                  {[
                    { label: 'إجمالي المرضى', value: totalPatients },
                    { label: 'المرضى النشطين', value: activePatients },
                    { label: 'حالات الخروج', value: dischargedPatients },
                    { label: 'حالات الوفاة', value: deceasedPatients },
                    { label: 'عدد الأقسام', value: store.departments.length },
                    { label: 'إجمالي المواعيد', value: store.appointments.length },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-dark-border last:border-0">
                      <span className="text-sm text-slate-400">{item.label}</span>
                      <span className="text-sm font-bold text-white">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6 border border-dark-border">
                <h3 className="text-sm font-bold text-gold mb-4 uppercase tracking-wider">💰 ملخص مالي</h3>
                <div className="space-y-3">
                  {[
                    { label: 'إجمالي الإيرادات', value: `${totalRevenue.toLocaleString()} ر.س`, color: 'text-white' },
                    { label: 'المبالغ المحصّلة', value: `${paidRevenue.toLocaleString()} ر.س`, color: 'text-success' },
                    { label: 'المبالغ المعلقة', value: `${unpaidRevenue.toLocaleString()} ر.س`, color: 'text-red-400' },
                    { label: 'نسبة التحصيل', value: `${((paidRevenue / totalRevenue) * 100).toFixed(1)}%`, color: 'text-gold' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-dark-border last:border-0">
                      <span className="text-sm text-slate-400">{item.label}</span>
                      <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-center no-print">
              <button onClick={handlePrint} className="btn-luxury btn-luxury-primary flex items-center gap-2">
                <Printer size={16} />
                طباعة التقرير الكامل
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
