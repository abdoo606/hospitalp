import React, { useState } from 'react';
import { useHospitalStore } from '../store/hospitalStore';
import { CheckCircle, Pill, Users, Search, Printer, AlertTriangle } from 'lucide-react';

export const NurseDashboard: React.FC = () => {
  const store = useHospitalStore();
  const [activeTab, setActiveTab] = useState('medications');
  const [searchTerm, setSearchTerm] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const activePatients = store.patients.filter(p => p.status === 'نشط');

  const pendingMedications: { recordId: string; prescriptionId: string; patientName: string; patientRoom: string; medication: string; dosage: string; frequency: string; diagnosis: string; doctorName: string }[] = [];
  const givenMedications: { recordId: string; prescriptionId: string; patientName: string; medication: string; dosage: string; givenAt: string; givenBy: string }[] = [];

  store.medicalRecords.forEach(record => {
    const patient = store.patients.find(p => p.id === record.patientId);
    if (!patient || patient.status !== 'نشط') return;

    record.prescriptions.forEach(rx => {
      if (!rx.givenAt) {
        pendingMedications.push({
          recordId: record.id,
          prescriptionId: rx.id,
          patientName: patient.name,
          patientRoom: patient.roomNumber || '-',
          medication: rx.medication,
          dosage: rx.dosage,
          frequency: rx.frequency,
          diagnosis: record.diagnosis,
          doctorName: record.doctorName,
        });
      } else {
        givenMedications.push({
          recordId: record.id,
          prescriptionId: rx.id,
          patientName: patient.name,
          medication: rx.medication,
          dosage: rx.dosage,
          givenAt: rx.givenAt,
          givenBy: rx.givenBy || '',
        });
      }
    });
  });

  const handleMarkGiven = (recordId: string, prescriptionId: string) => {
    if (!store.currentUser) return;
    store.markMedicationGiven(recordId, prescriptionId, store.currentUser.name);
    setSuccessMsg('تم تسجيل إعطاء الدواء بنجاح');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handlePrint = () => { window.print(); };

  return (
    <div className="min-h-screen pt-4 lg:pt-8 px-3 lg:px-6 pb-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-gradient">👩‍⚕️ لوحة التمريض</h1>
            <p className="text-xs text-slate-500 mt-1 tracking-wider">{store.currentUser?.name} - {store.currentUser?.department}</p>
          </div>
          <button onClick={handlePrint} className="no-print btn-luxury btn-luxury-outline flex items-center gap-2 !py-3 !px-5">
            <Printer size={16} />
            طباعة
          </button>
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
            { label: 'المرضى النشطين', value: activePatients.length, icon: '👥', color: 'border-blue-500' },
            { label: 'أدوية معلقة', value: pendingMedications.length, icon: '⏳', color: 'border-warning' },
            { label: 'أدوية مُعطاة', value: givenMedications.length, icon: '✅', color: 'border-success' },
            { label: 'إجمالي الأدوية', value: pendingMedications.length + givenMedications.length, icon: '💊', color: 'border-primary' },
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
          {[
            { key: 'medications', label: 'الأدوية المعلقة', icon: Pill },
            { key: 'given', label: 'الأدوية المُعطاة', icon: CheckCircle },
            { key: 'patients', label: 'المرضى النشطين', icon: Users },
          ].map(tab => (
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

        {/* Pending Medications */}
        {activeTab === 'medications' && (
          <div className="space-y-3 animate-fadeIn">
            {pendingMedications.length === 0 ? (
              <div className="glass-card p-16 text-center border border-dark-border">
                <CheckCircle size={48} className="mx-auto mb-4 text-success opacity-50" />
                <p className="text-slate-400">لا توجد أدوية معلقة - جميع الأدوية تم إعطاؤها 🎉</p>
              </div>
            ) : (
              pendingMedications.map((med, i) => (
                <div key={i} className="glass-card p-5 border border-warning/20 card-luxury animate-fadeIn" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-warning/10 flex items-center justify-center shrink-0">
                        <AlertTriangle size={20} className="text-warning" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white font-bold">{med.patientName}</h3>
                          <span className="badge-luxury bg-dark-card text-slate-400">غرفة {med.patientRoom}</span>
                        </div>
                        <p className="text-xs text-slate-500 mb-2">التشخيص: {med.diagnosis}</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="badge-luxury bg-primary/10 text-primary-light">💊 {med.medication}</span>
                          <span className="text-xs text-slate-400">الجرعة: {med.dosage}</span>
                          <span className="text-xs text-slate-400">التكرار: {med.frequency}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-2">👨‍⚕️ {med.doctorName}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleMarkGiven(med.recordId, med.prescriptionId)}
                      className="no-print btn-luxury btn-luxury-teal !py-2.5 whitespace-nowrap"
                    >
                      ✅ تم الإعطاء
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Given Medications */}
        {activeTab === 'given' && (
          <div className="glass-card border border-dark-border overflow-hidden animate-fadeIn">
            <div className="overflow-x-auto">
              <table className="w-full text-sm table-luxury">
                <thead>
                  <tr>
                    <th className="text-right p-4">المريض</th>
                    <th className="text-right p-4">الدواء</th>
                    <th className="text-right p-4">الجرعة</th>
                    <th className="text-right p-4">وقت الإعطاء</th>
                    <th className="text-right p-4">بواسطة</th>
                  </tr>
                </thead>
                <tbody>
                  {givenMedications.map((med, i) => (
                    <tr key={i} className="border-t border-dark-border">
                      <td className="p-4 text-white font-bold">{med.patientName}</td>
                      <td className="p-4 text-primary-light">💊 {med.medication}</td>
                      <td className="p-4 text-slate-400">{med.dosage}</td>
                      <td className="p-4 text-slate-400 text-xs">{med.givenAt}</td>
                      <td className="p-4 text-slate-400 text-xs">{med.givenBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Active Patients */}
        {activeTab === 'patients' && (
          <div className="animate-fadeIn">
            <div className="no-print relative mb-4">
              <Search size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="بحث عن مريض..." className="w-full pr-12 pl-4 py-3 input-luxury text-sm" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activePatients.filter(p => p.name.includes(searchTerm)).map(patient => {
                const patientRecords = store.medicalRecords.filter(r => r.patientId === patient.id);
                const patientMeds = patientRecords.flatMap(r => r.prescriptions);
                const pendingCount = patientMeds.filter(m => !m.givenAt).length;

                return (
                  <div key={patient.id} className="glass-card p-5 border border-dark-border card-luxury">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white text-lg font-black">
                        {patient.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-white font-bold">{patient.name}</h3>
                        <p className="text-xs text-slate-500">{patient.age} سنة - غرفة {patient.roomNumber || '-'}</p>
                      </div>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="text-slate-500">🩸 فصيلة الدم: <span className="text-red-400 font-bold">{patient.bloodType}</span></div>
                      <div className="text-slate-500">💊 أدوية معلقة: <span className={pendingCount > 0 ? 'text-warning font-bold' : 'text-success font-bold'}>{pendingCount}</span></div>
                      <div className="text-slate-500">📋 سجلات: {patientRecords.length}</div>
                    </div>
                    {patientRecords.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-dark-border">
                        <p className="text-xs text-slate-500 mb-1">آخر تشخيص:</p>
                        <p className="text-xs text-gold">{patientRecords[patientRecords.length - 1].diagnosis}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
