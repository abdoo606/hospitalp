import React, { useState } from 'react';
import { useHospitalStore } from '../store/hospitalStore';
import { FileText, Calendar, Pill, Activity, Printer } from 'lucide-react';

export const PatientDashboard: React.FC = () => {
  const store = useHospitalStore();
  const [activeTab, setActiveTab] = useState('overview');

  const patient = store.patients.find(p => p.userId === store.currentUser?.id);
  const myRecords = patient ? store.medicalRecords.filter(r => r.patientId === patient.id) : [];
  const myAppointments = patient ? store.appointments.filter(a => a.patientId === patient.id) : [];

  const handlePrint = () => { window.print(); };

  if (!patient) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center px-4">
        <div className="glass-card p-10 text-center border border-dark-border max-w-md">
          <div className="text-6xl mb-4">🏥</div>
          <h2 className="text-xl font-bold text-gold mb-2">لم يتم العثور على ملف المريض</h2>
          <p className="text-sm text-slate-500">يرجى التواصل مع إدارة المستشفى لربط حسابك بملف المريض</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: 'overview', label: 'نظرة عامة', icon: Activity },
    { key: 'records', label: 'السجلات الطبية', icon: FileText },
    { key: 'medications', label: 'الأدوية', icon: Pill },
    { key: 'appointments', label: 'المواعيد', icon: Calendar },
  ];

  return (
    <div className="min-h-screen pt-4 lg:pt-8 px-3 lg:px-6 pb-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-gradient">🏥 ملفي الطبي</h1>
            <p className="text-xs text-slate-500 mt-1 tracking-wider">مرحباً {patient.name}</p>
          </div>
          <button onClick={handlePrint} className="no-print btn-luxury btn-luxury-outline flex items-center gap-2 !py-3 !px-5">
            <Printer size={16} />
            طباعة التقرير
          </button>
        </div>

        {/* Patient Info Card */}
        <div className="glass-card p-6 border border-gold/20 mb-6 animate-fadeIn">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-gold to-gold-light flex items-center justify-center text-dark text-3xl font-black shrink-0 animate-pulse-glow">
              {patient.name.charAt(0)}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1 text-sm">
              <div><span className="text-slate-500 text-xs uppercase tracking-wider block">رقم الملف</span><span className="text-gold font-mono">{patient.odNumber}</span></div>
              <div><span className="text-slate-500 text-xs uppercase tracking-wider block">الاسم</span><span className="text-white font-bold">{patient.name}</span></div>
              <div><span className="text-slate-500 text-xs uppercase tracking-wider block">العمر</span><span className="text-white">{patient.age} سنة</span></div>
              <div><span className="text-slate-500 text-xs uppercase tracking-wider block">فصيلة الدم</span><span className="text-red-400 font-bold text-lg">{patient.bloodType}</span></div>
              <div><span className="text-slate-500 text-xs uppercase tracking-wider block">الغرفة</span><span className="text-white">{patient.roomNumber || '-'}</span></div>
              <div><span className="text-slate-500 text-xs uppercase tracking-wider block">تاريخ الدخول</span><span className="text-white">{patient.admissionDate}</span></div>
              <div><span className="text-slate-500 text-xs uppercase tracking-wider block">التأمين</span><span className="text-white">{patient.insuranceCompany || '-'}</span></div>
              <div><span className="text-slate-500 text-xs uppercase tracking-wider block">الحالة</span><span className={`font-bold ${patient.status === 'نشط' ? 'text-success' : patient.status === 'خرج' ? 'text-blue-400' : 'text-red-400'}`}>{patient.status}</span></div>
            </div>
          </div>
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

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'السجلات الطبية', value: myRecords.length, icon: '📋', color: 'border-primary' },
                { label: 'المواعيد', value: myAppointments.length, icon: '📅', color: 'border-gold' },
                { label: 'الأدوية الموصوفة', value: myRecords.flatMap(r => r.prescriptions).length, icon: '💊', color: 'border-purple-500' },
                { label: 'الفحوصات', value: myRecords.flatMap(r => r.labResults).length, icon: '🔬', color: 'border-blue-500' },
              ].map((stat, i) => (
                <div key={i} className={`glass-card p-4 border-r-4 ${stat.color}`}>
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className="text-xl font-black text-white">{stat.value}</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Latest Vital Signs */}
            {myRecords.length > 0 && myRecords[myRecords.length - 1].vitalSigns && (
              <div className="glass-card p-6 border border-dark-border">
                <h3 className="text-sm font-bold text-gold mb-4 uppercase tracking-wider">🫀 آخر العلامات الحيوية</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'ضغط الدم', value: myRecords[myRecords.length - 1].vitalSigns!.bloodPressure, icon: '🩺' },
                    { label: 'نبض القلب', value: myRecords[myRecords.length - 1].vitalSigns!.heartRate + ' bpm', icon: '❤️' },
                    { label: 'الحرارة', value: myRecords[myRecords.length - 1].vitalSigns!.temperature + '°C', icon: '🌡️' },
                    { label: 'الأكسجين', value: myRecords[myRecords.length - 1].vitalSigns!.oxygenSaturation + '%', icon: '🫁' },
                  ].map((vital, i) => (
                    <div key={i} className="p-4 bg-dark-card/50 border border-dark-border text-center">
                      <div className="text-2xl mb-1">{vital.icon}</div>
                      <div className="text-xl font-black text-white">{vital.value}</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider">{vital.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Latest Diagnosis */}
            {myRecords.length > 0 && (
              <div className="glass-card p-6 border border-dark-border">
                <h3 className="text-sm font-bold text-gold mb-4 uppercase tracking-wider">📌 آخر تشخيص</h3>
                <div className="p-4 bg-dark-card/50 border border-dark-border">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-white font-bold">{myRecords[myRecords.length - 1].diagnosis}</h4>
                    <span className="text-xs text-slate-500">{myRecords[myRecords.length - 1].date}</span>
                  </div>
                  <p className="text-sm text-slate-400 mb-2">{myRecords[myRecords.length - 1].symptoms}</p>
                  <p className="text-xs text-gold">👨‍⚕️ {myRecords[myRecords.length - 1].doctorName}</p>
                  {myRecords[myRecords.length - 1].notes && (
                    <p className="text-xs text-slate-500 mt-2 p-2 bg-gold/5 border border-gold/10">💡 {myRecords[myRecords.length - 1].notes}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Medical Records */}
        {activeTab === 'records' && (
          <div className="space-y-4 animate-fadeIn">
            {myRecords.length === 0 ? (
              <div className="glass-card p-16 text-center border border-dark-border">
                <FileText size={48} className="mx-auto mb-4 text-slate-700" />
                <p className="text-slate-500">لا توجد سجلات طبية بعد</p>
              </div>
            ) : (
              myRecords.map((record, i) => (
                <div key={record.id} className="glass-card p-5 border border-dark-border animate-fadeIn" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-base font-bold text-gold">{record.diagnosis}</h3>
                      <p className="text-xs text-slate-500">{record.date} - {record.doctorName}</p>
                    </div>
                    <button onClick={handlePrint} className="no-print p-2 hover:bg-white/5 text-slate-500"><Printer size={14} /></button>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider">الأعراض</p>
                    <p className="text-sm text-slate-300">{record.symptoms}</p>
                  </div>

                  {record.notes && (
                    <div className="mb-3 p-3 bg-gold/5 border border-gold/10">
                      <p className="text-xs text-gold">💡 ملاحظات: {record.notes}</p>
                    </div>
                  )}

                  {record.vitalSigns && (
                    <div className="grid grid-cols-4 gap-2 mb-3">
                      <div className="p-2 bg-dark-card/50 text-center"><div className="text-[10px] text-slate-500">الضغط</div><div className="text-xs font-bold text-white">{record.vitalSigns.bloodPressure}</div></div>
                      <div className="p-2 bg-dark-card/50 text-center"><div className="text-[10px] text-slate-500">النبض</div><div className="text-xs font-bold text-white">{record.vitalSigns.heartRate}</div></div>
                      <div className="p-2 bg-dark-card/50 text-center"><div className="text-[10px] text-slate-500">الحرارة</div><div className="text-xs font-bold text-white">{record.vitalSigns.temperature}°</div></div>
                      <div className="p-2 bg-dark-card/50 text-center"><div className="text-[10px] text-slate-500">الأكسجين</div><div className="text-xs font-bold text-white">{record.vitalSigns.oxygenSaturation}%</div></div>
                    </div>
                  )}

                  {record.labResults.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">🔬 نتائج الفحوصات</p>
                      <div className="space-y-1">
                        {record.labResults.map(lr => (
                          <div key={lr.id} className="flex items-center justify-between p-2 bg-dark-card/50 text-xs">
                            <span className="text-white">{lr.testName}: <span className="text-slate-400">{lr.result}</span></span>
                            <span className={`badge-luxury ${
                              lr.status === 'طبيعي' ? 'bg-success/10 text-success' :
                              lr.status === 'مرتفع' ? 'bg-red-500/10 text-red-400' :
                              lr.status === 'منخفض' ? 'bg-warning/10 text-warning' :
                              'bg-red-500/10 text-red-400'
                            }`}>{lr.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {record.prescriptions.length > 0 && (
                    <div>
                      <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">💊 الأدوية</p>
                      <div className="space-y-1">
                        {record.prescriptions.map(rx => (
                          <div key={rx.id} className="flex items-center justify-between p-2 bg-dark-card/50 text-xs">
                            <span className="text-primary-light font-medium">{rx.medication} - <span className="text-slate-400">{rx.dosage} - {rx.frequency}</span></span>
                            <span className={rx.givenAt ? 'text-success' : 'text-warning'}>{rx.givenAt ? '✅ تم الإعطاء' : '⏳ في الانتظار'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Medications */}
        {activeTab === 'medications' && (
          <div className="glass-card border border-dark-border overflow-hidden animate-fadeIn">
            <div className="overflow-x-auto">
              <table className="w-full text-sm table-luxury">
                <thead>
                  <tr>
                    <th className="text-right p-4">الدواء</th>
                    <th className="text-right p-4">الجرعة</th>
                    <th className="text-right p-4">التكرار</th>
                    <th className="text-right p-4">المدة</th>
                    <th className="text-right p-4">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {myRecords.flatMap(r => r.prescriptions).map(rx => (
                    <tr key={rx.id} className="border-t border-dark-border">
                      <td className="p-4 text-primary-light font-medium">💊 {rx.medication}</td>
                      <td className="p-4 text-white">{rx.dosage}</td>
                      <td className="p-4 text-slate-400">{rx.frequency}</td>
                      <td className="p-4 text-slate-400">{rx.duration}</td>
                      <td className="p-4">
                        {rx.givenAt ? (
                          <div>
                            <span className="badge-luxury bg-success/10 text-success">تم الإعطاء</span>
                            <span className="block text-[10px] text-slate-500 mt-1">{rx.givenBy}</span>
                          </div>
                        ) : (
                          <span className="badge-luxury bg-warning/10 text-warning">في الانتظار</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Appointments */}
        {activeTab === 'appointments' && (
          <div className="glass-card border border-dark-border overflow-hidden animate-fadeIn">
            <div className="overflow-x-auto">
              <table className="w-full text-sm table-luxury">
                <thead>
                  <tr>
                    <th className="text-right p-4">الطبيب</th>
                    <th className="text-right p-4">القسم</th>
                    <th className="text-right p-4">التاريخ</th>
                    <th className="text-right p-4">الوقت</th>
                    <th className="text-right p-4">النوع</th>
                    <th className="text-right p-4">التكلفة</th>
                    <th className="text-right p-4">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {myAppointments.map(apt => (
                    <tr key={apt.id} className="border-t border-dark-border">
                      <td className="p-4 text-white font-bold">👨‍⚕️ {apt.doctorName}</td>
                      <td className="p-4 text-slate-400">{apt.department}</td>
                      <td className="p-4 text-slate-400">{apt.date}</td>
                      <td className="p-4 text-slate-400">{apt.time}</td>
                      <td className="p-4"><span className="badge-luxury bg-gold/10 text-gold">{apt.type}</span></td>
                      <td className="p-4 text-gold font-bold">{apt.cost} ر.س</td>
                      <td className="p-4">
                        <span className={`badge-luxury ${
                          apt.status === 'مؤكد' ? 'bg-success/10 text-success' :
                          apt.status === 'مكتمل' ? 'bg-blue-500/10 text-blue-400' :
                          apt.status === 'ملغي' ? 'bg-red-500/10 text-red-400' :
                          'bg-warning/10 text-warning'
                        }`}>{apt.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
