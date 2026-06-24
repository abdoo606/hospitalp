import React, { useState } from 'react';
import { useHospitalStore } from '../store/hospitalStore';
import { Users, FileText, Plus, Search, Printer, X, Calendar, Stethoscope, ClipboardList, CheckCircle } from 'lucide-react';

export const DoctorDashboard: React.FC = () => {
  const store = useHospitalStore();
  const [activeTab, setActiveTab] = useState('patients');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [showPatientDetails, setShowPatientDetails] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const [newRecord, setNewRecord] = useState({
    diagnosis: '', symptoms: '', notes: '',
    prescriptions: [{ medication: '', dosage: '', frequency: '', duration: '' }],
    labResults: [{ testName: '', result: '', normalRange: '', status: 'طبيعي' as const }],
    vitalSigns: { bloodPressure: '', heartRate: 0, temperature: 37, oxygenSaturation: 98 },
  });

  const doctorRecords = store.medicalRecords.filter(r => r.doctorId === store.currentUser?.id);
  const doctorAppointments = store.appointments.filter(a => a.doctorId === store.currentUser?.id);
  const uniquePatientIds = [...new Set(doctorRecords.map(r => r.patientId))];
  const myPatients = store.patients.filter(p => uniquePatientIds.includes(p.id));

  const addPrescription = () => {
    setNewRecord(r => ({ ...r, prescriptions: [...r.prescriptions, { medication: '', dosage: '', frequency: '', duration: '' }] }));
  };

  const addLabResult = () => {
    setNewRecord(r => ({ ...r, labResults: [...r.labResults, { testName: '', result: '', normalRange: '', status: 'طبيعي' as const }] }));
  };

  const handleSubmitRecord = () => {
    if (!selectedPatientId || !newRecord.diagnosis) return;
    const patient = store.patients.find(p => p.id === selectedPatientId);
    if (!patient || !store.currentUser) return;

    store.addMedicalRecord({
      patientId: selectedPatientId,
      doctorId: store.currentUser.id,
      doctorName: store.currentUser.name,
      date: new Date().toISOString().split('T')[0],
      diagnosis: newRecord.diagnosis,
      symptoms: newRecord.symptoms,
      notes: newRecord.notes,
      prescriptions: newRecord.prescriptions.filter(p => p.medication).map(p => ({ ...p, id: Math.random().toString(36).substr(2, 9) })),
      labResults: newRecord.labResults.filter(l => l.testName).map(l => ({ ...l, id: Math.random().toString(36).substr(2, 9), date: new Date().toISOString().split('T')[0] })),
      vitalSigns: newRecord.vitalSigns.bloodPressure ? newRecord.vitalSigns : undefined,
    });

    setShowAddRecord(false);
    setSelectedPatientId('');
    setNewRecord({
      diagnosis: '', symptoms: '', notes: '',
      prescriptions: [{ medication: '', dosage: '', frequency: '', duration: '' }],
      labResults: [{ testName: '', result: '', normalRange: '', status: 'طبيعي' }],
      vitalSigns: { bloodPressure: '', heartRate: 0, temperature: 37, oxygenSaturation: 98 },
    });
    setSuccessMsg('تم إضافة السجل الطبي بنجاح');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handlePrint = () => { window.print(); };

  const tabs = [
    { key: 'patients', label: 'مرضاي', icon: Users },
    { key: 'all-patients', label: 'جميع المرضى', icon: ClipboardList },
    { key: 'appointments', label: 'المواعيد', icon: Calendar },
    { key: 'records', label: 'السجلات', icon: FileText },
  ];

  return (
    <div className="min-h-screen pt-4 lg:pt-8 px-3 lg:px-6 pb-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-gradient">👨‍⚕️ لوحة الطبيب</h1>
            <p className="text-xs text-slate-500 mt-1 tracking-wider">{store.currentUser?.name} - {store.currentUser?.specialization}</p>
          </div>
          <div className="flex items-center gap-2 no-print">
            <button onClick={() => setShowAddRecord(true)} className="btn-luxury btn-luxury-primary flex items-center gap-2 !py-3 !px-5">
              <Plus size={16} />
              إضافة سجل طبي
            </button>
            <button onClick={handlePrint} className="btn-luxury btn-luxury-outline flex items-center gap-2 !py-3 !px-5">
              <Printer size={16} />
            </button>
          </div>
        </div>

        {successMsg && (
          <div className="flex items-center gap-2 p-4 border border-success/30 bg-success/10 text-success text-sm mb-4 animate-fadeIn">
            <CheckCircle size={16} />
            {successMsg}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'مرضاي', value: myPatients.length, icon: '👥', color: 'border-blue-500' },
            { label: 'السجلات', value: doctorRecords.length, icon: '📋', color: 'border-primary' },
            { label: 'المواعيد', value: doctorAppointments.length, icon: '📅', color: 'border-gold' },
            { label: 'مواعيد اليوم', value: doctorAppointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length, icon: '⏰', color: 'border-purple-500' },
          ].map((stat, i) => (
            <div key={i} className={`glass-card p-4 border-r-4 ${stat.color}`}>
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-xl font-black text-white">{stat.value}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="no-print flex overflow-x-auto gap-1 mb-6 pb-2 border-b border-dark-border">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-bold whitespace-nowrap transition-all duration-300 tracking-wider uppercase ${
                activeTab === tab.key ? 'text-gold border-b-2 border-gold bg-gold/5' : 'text-slate-500 hover:text-gold'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Add Record Modal */}
        {showAddRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 no-print" onClick={() => setShowAddRecord(false)}>
            <div className="glass-card p-6 border border-dark-border w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-fadeIn" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gold uppercase tracking-wider">📝 إضافة سجل طبي جديد</h2>
                <button onClick={() => setShowAddRecord(false)} className="text-slate-500 hover:text-white"><X size={24} /></button>
              </div>

              <div className="mb-4">
                <label className="text-xs text-slate-500 mb-2 block uppercase tracking-wider">اختر المريض *</label>
                <select value={selectedPatientId} onChange={e => setSelectedPatientId(e.target.value)} className="w-full p-3 input-luxury text-sm">
                  <option value="">-- اختر مريض --</option>
                  {store.patients.filter(p => p.status === 'نشط').map(p => (
                    <option key={p.id} value={p.id}>{p.name} - {p.age} سنة - {p.bloodType}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs text-slate-500 mb-2 block uppercase tracking-wider">التشخيص *</label>
                  <input value={newRecord.diagnosis} onChange={e => setNewRecord(r => ({ ...r, diagnosis: e.target.value }))} className="w-full p-3 input-luxury text-sm" placeholder="التشخيص" />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-2 block uppercase tracking-wider">الأعراض</label>
                  <input value={newRecord.symptoms} onChange={e => setNewRecord(r => ({ ...r, symptoms: e.target.value }))} className="w-full p-3 input-luxury text-sm" placeholder="الأعراض" />
                </div>
              </div>

              <div className="mb-4">
                <label className="text-xs text-slate-500 mb-2 block uppercase tracking-wider">ملاحظات</label>
                <textarea value={newRecord.notes} onChange={e => setNewRecord(r => ({ ...r, notes: e.target.value }))} rows={2} className="w-full p-3 input-luxury text-sm resize-none" placeholder="ملاحظات إضافية" />
              </div>

              <div className="mb-4">
                <h3 className="text-xs font-bold text-gold mb-3 uppercase tracking-wider">🫀 العلامات الحيوية</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <input value={newRecord.vitalSigns.bloodPressure} onChange={e => setNewRecord(r => ({ ...r, vitalSigns: { ...r.vitalSigns, bloodPressure: e.target.value } }))} placeholder="ضغط الدم" className="p-3 input-luxury text-xs" />
                  <input type="number" value={newRecord.vitalSigns.heartRate || ''} onChange={e => setNewRecord(r => ({ ...r, vitalSigns: { ...r.vitalSigns, heartRate: +e.target.value } }))} placeholder="نبض القلب" className="p-3 input-luxury text-xs" />
                  <input type="number" step="0.1" value={newRecord.vitalSigns.temperature || ''} onChange={e => setNewRecord(r => ({ ...r, vitalSigns: { ...r.vitalSigns, temperature: +e.target.value } }))} placeholder="الحرارة" className="p-3 input-luxury text-xs" />
                  <input type="number" value={newRecord.vitalSigns.oxygenSaturation || ''} onChange={e => setNewRecord(r => ({ ...r, vitalSigns: { ...r.vitalSigns, oxygenSaturation: +e.target.value } }))} placeholder="الأكسجين %" className="p-3 input-luxury text-xs" />
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-gold uppercase tracking-wider">💊 الأدوية</h3>
                  <button onClick={addPrescription} className="text-xs text-primary-light hover:underline">+ إضافة دواء</button>
                </div>
                {newRecord.prescriptions.map((rx, i) => (
                  <div key={i} className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
                    <input value={rx.medication} onChange={e => { const p = [...newRecord.prescriptions]; p[i] = { ...p[i], medication: e.target.value }; setNewRecord(r => ({ ...r, prescriptions: p })); }} placeholder="اسم الدواء" className="p-2 input-luxury text-xs" />
                    <input value={rx.dosage} onChange={e => { const p = [...newRecord.prescriptions]; p[i] = { ...p[i], dosage: e.target.value }; setNewRecord(r => ({ ...r, prescriptions: p })); }} placeholder="الجرعة" className="p-2 input-luxury text-xs" />
                    <input value={rx.frequency} onChange={e => { const p = [...newRecord.prescriptions]; p[i] = { ...p[i], frequency: e.target.value }; setNewRecord(r => ({ ...r, prescriptions: p })); }} placeholder="التكرار" className="p-2 input-luxury text-xs" />
                    <input value={rx.duration} onChange={e => { const p = [...newRecord.prescriptions]; p[i] = { ...p[i], duration: e.target.value }; setNewRecord(r => ({ ...r, prescriptions: p })); }} placeholder="المدة" className="p-2 input-luxury text-xs" />
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-gold uppercase tracking-wider">🔬 نتائج الفحوصات</h3>
                  <button onClick={addLabResult} className="text-xs text-primary-light hover:underline">+ إضافة فحص</button>
                </div>
                {newRecord.labResults.map((lr, i) => (
                  <div key={i} className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
                    <input value={lr.testName} onChange={e => { const l = [...newRecord.labResults]; l[i] = { ...l[i], testName: e.target.value }; setNewRecord(r => ({ ...r, labResults: l })); }} placeholder="اسم الفحص" className="p-2 input-luxury text-xs" />
                    <input value={lr.result} onChange={e => { const l = [...newRecord.labResults]; l[i] = { ...l[i], result: e.target.value }; setNewRecord(r => ({ ...r, labResults: l })); }} placeholder="النتيجة" className="p-2 input-luxury text-xs" />
                    <input value={lr.normalRange} onChange={e => { const l = [...newRecord.labResults]; l[i] = { ...l[i], normalRange: e.target.value }; setNewRecord(r => ({ ...r, labResults: l })); }} placeholder="المعدل الطبيعي" className="p-2 input-luxury text-xs" />
                    <select value={lr.status} onChange={e => { const l = [...newRecord.labResults]; l[i] = { ...l[i], status: e.target.value as any }; setNewRecord(r => ({ ...r, labResults: l })); }} className="p-2 input-luxury text-xs">
                      <option value="طبيعي">طبيعي</option>
                      <option value="مرتفع">مرتفع</option>
                      <option value="منخفض">منخفض</option>
                      <option value="غير طبيعي">غير طبيعي</option>
                    </select>
                  </div>
                ))}
              </div>

              <button onClick={handleSubmitRecord} className="w-full btn-luxury btn-luxury-teal">
                حفظ السجل الطبي
              </button>
            </div>
          </div>
        )}

        {/* Patient Details Modal */}
        {showPatientDetails && (
          <PatientDetailsModal patientId={showPatientDetails} onClose={() => setShowPatientDetails(null)} store={store} />
        )}

        {/* My Patients */}
        {activeTab === 'patients' && (
          <div className="animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myPatients.map(patient => {
                const records = doctorRecords.filter(r => r.patientId === patient.id);
                return (
                  <div key={patient.id} className="glass-card p-5 border border-dark-border card-luxury cursor-pointer" onClick={() => setShowPatientDetails(patient.id)}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-gold to-gold-light flex items-center justify-center text-dark text-lg font-black">
                          {patient.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-white font-bold">{patient.name}</h3>
                          <p className="text-xs text-slate-500">{patient.age} سنة - {patient.gender}</p>
                        </div>
                      </div>
                      <span className={`badge-luxury ${
                        patient.status === 'نشط' ? 'bg-success/10 text-success' : patient.status === 'خرج' ? 'bg-blue-500/10 text-blue-400' : 'bg-red-500/10 text-red-400'
                      }`}>{patient.status}</span>
                    </div>
                    <div className="space-y-1 text-xs text-slate-500">
                      <div>🩸 فصيلة الدم: <span className="text-red-400 font-bold">{patient.bloodType}</span></div>
                      <div>🏥 الغرفة: {patient.roomNumber || '-'}</div>
                      <div>📋 السجلات: {records.length}</div>
                    </div>
                  </div>
                );
              })}
              {myPatients.length === 0 && (
                <div className="col-span-full text-center py-16">
                  <Stethoscope size={48} className="mx-auto mb-4 text-slate-700" />
                  <p className="text-slate-500">لا يوجد مرضى مسجلين بعد</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* All Patients */}
        {activeTab === 'all-patients' && (
          <div className="animate-fadeIn">
            <div className="no-print relative mb-4">
              <Search size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="بحث عن مريض..." className="w-full pr-12 pl-4 py-3 input-luxury text-sm" />
            </div>
            <div className="glass-card border border-dark-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm table-luxury">
                  <thead><tr><th className="text-right p-4">رقم الملف</th><th className="text-right p-4">الاسم</th><th className="text-right p-4">العمر</th><th className="text-right p-4">فصيلة الدم</th><th className="text-right p-4">الحالة</th><th className="text-right p-4 no-print">إجراء</th></tr></thead>
                  <tbody>
                    {store.patients.filter(p => p.name.includes(searchTerm) || p.odNumber.includes(searchTerm)).map(patient => (
                      <tr key={patient.id} className="border-t border-dark-border">
                        <td className="p-4 text-gold font-mono text-xs">{patient.odNumber}</td>
                        <td className="p-4 text-white font-bold">{patient.name}</td>
                        <td className="p-4 text-slate-400">{patient.age} سنة</td>
                        <td className="p-4"><span className="badge-luxury bg-red-500/10 text-red-400">{patient.bloodType}</span></td>
                        <td className="p-4"><span className={`badge-luxury ${patient.status === 'نشط' ? 'bg-success/10 text-success' : patient.status === 'خرج' ? 'bg-blue-500/10 text-blue-400' : 'bg-red-500/10 text-red-400'}`}>{patient.status}</span></td>
                        <td className="p-4 no-print"><button onClick={() => setShowPatientDetails(patient.id)} className="btn-luxury btn-luxury-dark !py-1.5 !px-3 !text-[10px]">عرض</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Appointments */}
        {activeTab === 'appointments' && (
          <div className="glass-card border border-dark-border overflow-hidden animate-fadeIn">
            <div className="overflow-x-auto">
              <table className="w-full text-sm table-luxury">
                <thead><tr><th className="text-right p-4">المريض</th><th className="text-right p-4">التاريخ</th><th className="text-right p-4">الوقت</th><th className="text-right p-4">النوع</th><th className="text-right p-4">الحالة</th></tr></thead>
                <tbody>
                  {doctorAppointments.map(apt => (
                    <tr key={apt.id} className="border-t border-dark-border">
                      <td className="p-4 text-white font-bold">{apt.patientName}</td>
                      <td className="p-4 text-slate-400">{apt.date}</td>
                      <td className="p-4 text-slate-400">{apt.time}</td>
                      <td className="p-4"><span className="badge-luxury bg-gold/10 text-gold">{apt.type}</span></td>
                      <td className="p-4"><span className={`badge-luxury ${apt.status === 'مؤكد' ? 'bg-success/10 text-success' : apt.status === 'مكتمل' ? 'bg-blue-500/10 text-blue-400' : apt.status === 'ملغي' ? 'bg-red-500/10 text-red-400' : 'bg-warning/10 text-warning'}`}>{apt.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Records */}
        {activeTab === 'records' && (
          <div className="space-y-4 animate-fadeIn">
            {doctorRecords.map(record => {
              const patient = store.patients.find(p => p.id === record.patientId);
              return (
                <div key={record.id} className="glass-card p-5 border border-dark-border">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-base font-bold text-white">{patient?.name}</h3>
                      <p className="text-xs text-slate-500">{record.date}</p>
                    </div>
                    <button onClick={handlePrint} className="no-print p-2 hover:bg-white/5 text-slate-500"><Printer size={14} /></button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div><p className="text-xs text-slate-500 mb-1 uppercase tracking-wider">التشخيص</p><p className="text-sm text-gold">{record.diagnosis}</p></div>
                    <div><p className="text-xs text-slate-500 mb-1 uppercase tracking-wider">الأعراض</p><p className="text-sm text-slate-300">{record.symptoms}</p></div>
                  </div>
                  {record.prescriptions.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {record.prescriptions.map(rx => (
                        <span key={rx.id} className="badge-luxury bg-primary/10 text-primary-light">💊 {rx.medication}</span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const PatientDetailsModal: React.FC<{ patientId: string; onClose: () => void; store: any }> = ({ patientId, onClose, store }) => {
  const patient = store.patients.find((p: any) => p.id === patientId);
  const records = store.medicalRecords.filter((r: any) => r.patientId === patientId);
  if (!patient) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <div className="glass-card p-6 border border-dark-border w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-fadeIn" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gold uppercase tracking-wider">👤 ملف المريض</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => window.print()} className="no-print p-2 hover:bg-white/5 text-slate-500"><Printer size={16} /></button>
            <button onClick={onClose} className="no-print text-slate-500 hover:text-white"><X size={24} /></button>
          </div>
        </div>

        <div className="glass-card p-4 border border-dark-border mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div><span className="text-slate-500 text-xs uppercase tracking-wider block">رقم الملف</span><span className="text-gold font-mono">{patient.odNumber}</span></div>
            <div><span className="text-slate-500 text-xs uppercase tracking-wider block">الاسم</span><span className="text-white font-bold">{patient.name}</span></div>
            <div><span className="text-slate-500 text-xs uppercase tracking-wider block">العمر</span><span className="text-white">{patient.age} سنة</span></div>
            <div><span className="text-slate-500 text-xs uppercase tracking-wider block">فصيلة الدم</span><span className="text-red-400 font-bold">{patient.bloodType}</span></div>
            <div><span className="text-slate-500 text-xs uppercase tracking-wider block">الهاتف</span><span className="text-white">{patient.phone}</span></div>
            <div><span className="text-slate-500 text-xs uppercase tracking-wider block">الغرفة</span><span className="text-white">{patient.roomNumber || '-'}</span></div>
            <div><span className="text-slate-500 text-xs uppercase tracking-wider block">التأمين</span><span className="text-white">{patient.insuranceCompany || '-'}</span></div>
            <div><span className="text-slate-500 text-xs uppercase tracking-wider block">الحالة</span><span className={`font-bold ${patient.status === 'نشط' ? 'text-success' : patient.status === 'خرج' ? 'text-blue-400' : 'text-red-400'}`}>{patient.status}</span></div>
          </div>
        </div>

        <h3 className="text-sm font-bold text-gold mb-4 uppercase tracking-wider">📋 السجلات الطبية ({records.length})</h3>
        {records.map((record: any) => (
          <div key={record.id} className="glass-card p-4 border border-dark-border mb-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-sm font-bold text-white">{record.diagnosis}</span>
                <span className="text-xs text-slate-500 block">{record.date} - {record.doctorName}</span>
              </div>
            </div>
            {record.vitalSigns && (
              <div className="grid grid-cols-4 gap-2 mb-3">
                <div className="p-2 bg-dark-card/50 text-center"><div className="text-[10px] text-slate-500">الضغط</div><div className="text-xs font-bold text-white">{record.vitalSigns.bloodPressure}</div></div>
                <div className="p-2 bg-dark-card/50 text-center"><div className="text-[10px] text-slate-500">النبض</div><div className="text-xs font-bold text-white">{record.vitalSigns.heartRate}</div></div>
                <div className="p-2 bg-dark-card/50 text-center"><div className="text-[10px] text-slate-500">الحرارة</div><div className="text-xs font-bold text-white">{record.vitalSigns.temperature}°</div></div>
                <div className="p-2 bg-dark-card/50 text-center"><div className="text-[10px] text-slate-500">الأكسجين</div><div className="text-xs font-bold text-white">{record.vitalSigns.oxygenSaturation}%</div></div>
              </div>
            )}
            {record.prescriptions.length > 0 && (
              <div className="space-y-1">
                {record.prescriptions.map((rx: any) => (
                  <div key={rx.id} className="flex items-center justify-between p-2 bg-dark-card/50 text-xs">
                    <span className="text-white">💊 {rx.medication} - {rx.dosage}</span>
                    <span className={rx.givenAt ? 'text-success' : 'text-warning'}>{rx.givenAt ? '✅' : '⏳'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
