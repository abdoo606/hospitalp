import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'admin' | 'doctor' | 'nurse' | 'patient';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  specialization?: string;
  department?: string;
  createdAt: string;
  isOnDuty?: boolean;
  shiftStart?: string;
  shiftEnd?: string;
}

export interface Patient {
  id: string;
  odNumber: string; // رقم الملف
  userId: string;
  name: string;
  age: number;
  gender: 'ذكر' | 'أنثى';
  phone: string;
  bloodType: string;
  address: string;
  emergencyContact: string;
  insuranceNumber?: string;
  insuranceCompany?: string;
  status: 'نشط' | 'خرج' | 'متوفى';
  admissionDate: string;
  dischargeDate?: string;
  roomNumber?: string;
  nationality?: string;
  idNumber?: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  date: string;
  diagnosis: string;
  symptoms: string;
  notes: string;
  prescriptions: Prescription[];
  labResults: LabResult[];
  vitalSigns?: VitalSigns;
  attachments?: string[];
}

export interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
  givenAt?: string;
  givenBy?: string;
}

export interface LabResult {
  id: string;
  testName: string;
  result: string;
  normalRange: string;
  status: 'طبيعي' | 'مرتفع' | 'منخفض' | 'غير طبيعي';
  date: string;
}

export interface VitalSigns {
  bloodPressure: string;
  heartRate: number;
  temperature: number;
  oxygenSaturation: number;
  weight?: number;
  height?: number;
  respiratoryRate?: number;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  headDoctor?: string;
  bedsCount: number;
  occupiedBeds: number;
  icon: string;
  floor?: string;
  phone?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  department: string;
  status: 'مؤكد' | 'ملغي' | 'مكتمل' | 'في الانتظار';
  notes?: string;
  cost: number;
  type: 'كشفية' | 'متابعة' | 'طوارئ' | 'عملية';
}

export interface FinancialRecord {
  id: string;
  patientId: string;
  patientName: string;
  type: 'كشفية' | 'عملية' | 'تحاليل' | 'أشعة' | 'أدوية' | 'إقامة' | 'أخرى';
  amount: number;
  date: string;
  paid: boolean;
  description: string;
  invoiceNumber?: string;
}

export interface DutySchedule {
  id: string;
  staffId: string;
  staffName: string;
  role: 'doctor' | 'nurse';
  department: string;
  date: string;
  shiftType: 'صباحي' | 'مسائي' | 'ليلي';
  shiftStart: string;
  shiftEnd: string;
}

export interface VisitingHours {
  department: string;
  days: string;
  hours: string;
}

export interface InsuranceCompany {
  id: string;
  name: string;
  logo?: string;
  coveragePercentage: number;
}

interface HospitalState {
  // Auth
  currentUser: User | null;
  users: User[];
  
  // Data
  patients: Patient[];
  medicalRecords: MedicalRecord[];
  departments: Department[];
  appointments: Appointment[];
  financialRecords: FinancialRecord[];
  dutySchedules: DutySchedule[];
  visitingHours: VisitingHours[];
  insuranceCompanies: InsuranceCompany[];
  
  // UI
  currentPage: string;
  sidebarOpen: boolean;
  
  // Actions
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (user: Omit<User, 'id' | 'createdAt'>) => boolean;
  
  setCurrentPage: (page: string) => void;
  toggleSidebar: () => void;
  
  // Patient actions
  addPatient: (patient: Omit<Patient, 'id' | 'odNumber'>) => void;
  updatePatient: (id: string, data: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  
  // Medical records
  addMedicalRecord: (record: Omit<MedicalRecord, 'id'>) => void;
  updateMedicalRecord: (id: string, data: Partial<MedicalRecord>) => void;
  
  // Department actions
  addDepartment: (dept: Omit<Department, 'id'>) => void;
  updateDepartment: (id: string, data: Partial<Department>) => void;
  deleteDepartment: (id: string) => void;
  
  // Appointment actions
  addAppointment: (apt: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: string, data: Partial<Appointment>) => void;
  
  // Financial actions
  addFinancialRecord: (record: Omit<FinancialRecord, 'id'>) => void;
  
  // Nurse actions
  markMedicationGiven: (recordId: string, prescriptionId: string, nurseName: string) => void;
  
  // User management
  deleteUser: (id: string) => void;
  updateUser: (id: string, data: Partial<User>) => void;
  
  // Duty Schedule
  addDutySchedule: (schedule: Omit<DutySchedule, 'id'>) => void;
  deleteDutySchedule: (id: string) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
const generateODNumber = () => 'OD-' + new Date().getFullYear() + '-' + Math.random().toString().slice(2, 8);

const defaultDepartments: Department[] = [
  { id: 'd1', name: 'قسم الطوارئ', description: 'الرعاية الطارئة والحالات الحرجة على مدار 24 ساعة', bedsCount: 30, occupiedBeds: 22, icon: '🚨', floor: 'الطابق الأرضي', phone: '920-001' },
  { id: 'd2', name: 'قسم القلب والأوعية الدموية', description: 'تشخيص وعلاج أمراض القلب والشرايين', headDoctor: 'د. أحمد الخالدي', bedsCount: 25, occupiedBeds: 18, icon: '❤️', floor: 'الطابق الثاني', phone: '920-002' },
  { id: 'd3', name: 'قسم جراحة العظام', description: 'جراحات العظام والمفاصل والعمود الفقري', headDoctor: 'د. سارة المنصور', bedsCount: 20, occupiedBeds: 14, icon: '🦴', floor: 'الطابق الثالث', phone: '920-003' },
  { id: 'd4', name: 'قسم طب الأطفال', description: 'رعاية شاملة للأطفال من الولادة حتى 14 سنة', headDoctor: 'د. ليلى العمري', bedsCount: 35, occupiedBeds: 28, icon: '👶', floor: 'الطابق الرابع', phone: '920-004' },
  { id: 'd5', name: 'قسم الباطنية', description: 'الأمراض الباطنية والغدد الصماء والسكري', headDoctor: 'د. محمد القاسم', bedsCount: 30, occupiedBeds: 20, icon: '🏥', floor: 'الطابق الثاني', phone: '920-005' },
  { id: 'd6', name: 'قسم طب العيون', description: 'عمليات الليزك والمياه البيضاء والزرقاء', headDoctor: 'د. عمر السعيد', bedsCount: 15, occupiedBeds: 8, icon: '👁️', floor: 'الطابق الخامس', phone: '920-006' },
  { id: 'd7', name: 'قسم النساء والتوليد', description: 'متابعة الحمل والولادة الطبيعية والقيصرية', headDoctor: 'د. فاطمة الزهراء', bedsCount: 25, occupiedBeds: 19, icon: '🤰', floor: 'الطابق السادس', phone: '920-007' },
  { id: 'd8', name: 'العناية المركزة ICU', description: 'وحدة العناية المركزة للحالات الحرجة', bedsCount: 15, occupiedBeds: 12, icon: '🫀', floor: 'الطابق الأول', phone: '920-008' },
  { id: 'd9', name: 'قسم الأشعة', description: 'أشعة سينية، رنين مغناطيسي، أشعة مقطعية', bedsCount: 0, occupiedBeds: 0, icon: '📷', floor: 'الطابق الأرضي', phone: '920-009' },
  { id: 'd10', name: 'المختبر والتحاليل', description: 'جميع أنواع التحاليل الطبية والفحوصات', bedsCount: 0, occupiedBeds: 0, icon: '🔬', floor: 'الطابق الأرضي', phone: '920-010' },
  { id: 'd11', name: 'الصيدلية', description: 'صيدلية المستشفى تعمل 24 ساعة', bedsCount: 0, occupiedBeds: 0, icon: '💊', floor: 'الطابق الأرضي', phone: '920-011' },
];

const defaultUsers: User[] = [
  { id: 'admin1', name: 'مدير النظام', email: 'admin@alhayat.med', password: 'Admin@2024', role: 'admin', phone: '0501234567', createdAt: '2024-01-01' },
  { id: 'doc1', name: 'د. أحمد الخالدي', email: 'ahmed@doctor.alhayat.med', password: 'Doctor@2024', role: 'doctor', phone: '0509876543', specialization: 'أمراض القلب والأوعية الدموية', createdAt: '2024-01-15', isOnDuty: true, shiftStart: '08:00', shiftEnd: '16:00' },
  { id: 'doc2', name: 'د. سارة المنصور', email: 'sara@doctor.alhayat.med', password: 'Doctor@2024', role: 'doctor', phone: '0507654321', specialization: 'جراحة العظام والمفاصل', createdAt: '2024-02-01', isOnDuty: true, shiftStart: '08:00', shiftEnd: '16:00' },
  { id: 'doc3', name: 'د. محمد القاسم', email: 'mohammed@doctor.alhayat.med', password: 'Doctor@2024', role: 'doctor', phone: '0503456789', specialization: 'الباطنية والغدد الصماء', createdAt: '2024-02-15', isOnDuty: false, shiftStart: '16:00', shiftEnd: '00:00' },
  { id: 'doc4', name: 'د. فاطمة الزهراء', email: 'fatima@doctor.alhayat.med', password: 'Doctor@2024', role: 'doctor', phone: '0502345678', specialization: 'النساء والتوليد', createdAt: '2024-03-01', isOnDuty: true, shiftStart: '08:00', shiftEnd: '16:00' },
  { id: 'doc5', name: 'د. عمر السعيد', email: 'omar@doctor.alhayat.med', password: 'Doctor@2024', role: 'doctor', phone: '0504567890', specialization: 'طب العيون', createdAt: '2024-03-15', isOnDuty: false },
  { id: 'doc6', name: 'د. ليلى العمري', email: 'layla@doctor.alhayat.med', password: 'Doctor@2024', role: 'doctor', phone: '0505678901', specialization: 'طب الأطفال', createdAt: '2024-04-01', isOnDuty: true, shiftStart: '00:00', shiftEnd: '08:00' },
  { id: 'nurse1', name: 'نورة الحربي', email: 'noura@nurse.alhayat.med', password: 'Nurse@2024', role: 'nurse', phone: '0502345678', department: 'قسم القلب والأوعية الدموية', createdAt: '2024-03-01', isOnDuty: true, shiftStart: '08:00', shiftEnd: '16:00' },
  { id: 'nurse2', name: 'هند السالم', email: 'hind@nurse.alhayat.med', password: 'Nurse@2024', role: 'nurse', phone: '0504567890', department: 'قسم الطوارئ', createdAt: '2024-03-15', isOnDuty: true, shiftStart: '16:00', shiftEnd: '00:00' },
  { id: 'nurse3', name: 'سلمى الرشيد', email: 'salma@nurse.alhayat.med', password: 'Nurse@2024', role: 'nurse', phone: '0506789012', department: 'العناية المركزة ICU', createdAt: '2024-04-01', isOnDuty: true, shiftStart: '00:00', shiftEnd: '08:00' },
  { id: 'nurse4', name: 'ريم العتيبي', email: 'reem@nurse.alhayat.med', password: 'Nurse@2024', role: 'nurse', phone: '0507890123', department: 'قسم جراحة العظام', createdAt: '2024-04-15', isOnDuty: false },
  { id: 'pat1', name: 'خالد العتيبي', email: 'khaled@patient.alhayat.med', password: 'Patient@2024', role: 'patient', phone: '0551234567', createdAt: '2024-04-01' },
  { id: 'pat2', name: 'فهد الدوسري', email: 'fahad@patient.alhayat.med', password: 'Patient@2024', role: 'patient', phone: '0559876543', createdAt: '2024-04-15' },
];

const defaultPatients: Patient[] = [
  { id: 'p1', odNumber: 'OD-2024-001234', userId: 'pat1', name: 'خالد العتيبي', age: 45, gender: 'ذكر', phone: '0551234567', bloodType: 'A+', address: 'الرياض - حي النزهة - شارع الملك عبدالعزيز', emergencyContact: '0559999888', insuranceNumber: 'INS-2024-001', insuranceCompany: 'بوبا العربية', status: 'نشط', admissionDate: '2024-11-15', roomNumber: 'A-201', nationality: 'سعودي', idNumber: '1087654321' },
  { id: 'p2', odNumber: 'OD-2024-001235', userId: 'pat2', name: 'فهد الدوسري', age: 32, gender: 'ذكر', phone: '0559876543', bloodType: 'O+', address: 'جدة - حي الروضة', emergencyContact: '0558888777', insuranceNumber: 'INS-2024-002', insuranceCompany: 'التعاونية', status: 'نشط', admissionDate: '2024-12-01', roomNumber: 'B-105', nationality: 'سعودي', idNumber: '1098765432' },
  { id: 'p3', odNumber: 'OD-2024-001236', userId: '', name: 'منال الشمري', age: 28, gender: 'أنثى', phone: '0553456789', bloodType: 'B+', address: 'الدمام - حي الفيصلية', emergencyContact: '0557777666', status: 'خرج', admissionDate: '2024-10-01', dischargeDate: '2024-10-15', nationality: 'سعودية', idNumber: '1076543210' },
  { id: 'p4', odNumber: 'OD-2024-001237', userId: '', name: 'عبدالله المطيري', age: 67, gender: 'ذكر', phone: '0554567890', bloodType: 'AB-', address: 'الرياض - حي العليا', emergencyContact: '0556666555', status: 'متوفى', admissionDate: '2024-09-01', dischargeDate: '2024-11-20', nationality: 'سعودي', idNumber: '1065432109' },
  { id: 'p5', odNumber: 'OD-2024-001238', userId: '', name: 'ريم الحارثي', age: 35, gender: 'أنثى', phone: '0555678901', bloodType: 'O-', address: 'مكة - حي العزيزية', emergencyContact: '0555555444', insuranceNumber: 'INS-2024-005', insuranceCompany: 'ميدغلف', status: 'نشط', admissionDate: '2025-01-05', roomNumber: 'C-301', nationality: 'سعودية', idNumber: '1054321098' },
  { id: 'p6', odNumber: 'OD-2024-001239', userId: '', name: 'ناصر الغامدي', age: 52, gender: 'ذكر', phone: '0556789012', bloodType: 'A-', address: 'الطائف - حي الشهداء', emergencyContact: '0554444333', insuranceNumber: 'INS-2024-006', insuranceCompany: 'بوبا العربية', status: 'نشط', admissionDate: '2025-01-10', roomNumber: 'D-102', nationality: 'سعودي', idNumber: '1043210987' },
];

const defaultMedicalRecords: MedicalRecord[] = [
  {
    id: 'mr1', patientId: 'p1', doctorId: 'doc1', doctorName: 'د. أحمد الخالدي',
    date: '2024-11-16', diagnosis: 'ارتفاع ضغط الدم - الدرجة الثانية',
    symptoms: 'صداع مستمر، دوخة، ضيق تنفس عند المجهود',
    notes: 'يحتاج متابعة أسبوعية وتعديل الجرعات حسب الاستجابة. ينصح بتقليل الملح والدهون.',
    prescriptions: [
      { id: 'rx1', medication: 'أملوديبين (Amlodipine)', dosage: '10mg', frequency: 'مرة يومياً صباحاً', duration: '3 أشهر', givenAt: '2024-11-16 08:00', givenBy: 'نورة الحربي' },
      { id: 'rx2', medication: 'لوسارتان (Losartan)', dosage: '50mg', frequency: 'مرتين يومياً', duration: '3 أشهر' },
      { id: 'rx3', medication: 'أسبرين (Aspirin)', dosage: '81mg', frequency: 'مرة يومياً بعد الغداء', duration: '6 أشهر', givenAt: '2024-11-16 08:00', givenBy: 'نورة الحربي' },
    ],
    labResults: [
      { id: 'lr1', testName: 'ضغط الدم', result: '160/95 mmHg', normalRange: '120/80 mmHg', status: 'مرتفع', date: '2024-11-16' },
      { id: 'lr2', testName: 'الكوليسترول الكلي', result: '240 mg/dL', normalRange: '< 200 mg/dL', status: 'مرتفع', date: '2024-11-16' },
      { id: 'lr3', testName: 'سكر الدم الصائم', result: '95 mg/dL', normalRange: '70-100 mg/dL', status: 'طبيعي', date: '2024-11-16' },
      { id: 'lr4', testName: 'وظائف الكلى (Creatinine)', result: '1.1 mg/dL', normalRange: '0.7-1.3 mg/dL', status: 'طبيعي', date: '2024-11-16' },
    ],
    vitalSigns: { bloodPressure: '160/95', heartRate: 88, temperature: 37.1, oxygenSaturation: 97, weight: 85, height: 175, respiratoryRate: 18 }
  },
  {
    id: 'mr2', patientId: 'p2', doctorId: 'doc2', doctorName: 'د. سارة المنصور',
    date: '2024-12-02', diagnosis: 'كسر مركب في عظمة الشظية (الساق اليسرى)',
    symptoms: 'ألم شديد في الساق، تورم ملحوظ، عدم القدرة على المشي، كدمات',
    notes: 'تم عمل جبيرة مؤقتة. يحتاج عملية تثبيت داخلي خلال 48 ساعة. منع الحركة تماماً.',
    prescriptions: [
      { id: 'rx4', medication: 'ايبوبروفين (Ibuprofen)', dosage: '400mg', frequency: 'ثلاث مرات يومياً بعد الأكل', duration: '10 أيام' },
      { id: 'rx5', medication: 'باراسيتامول (Paracetamol)', dosage: '500mg', frequency: 'عند الحاجة (كل 6 ساعات)', duration: '10 أيام', givenAt: '2024-12-02 14:00', givenBy: 'هند السالم' },
      { id: 'rx6', medication: 'كليكسان (Clexane)', dosage: '40mg', frequency: 'حقنة يومية', duration: '14 يوم' },
    ],
    labResults: [
      { id: 'lr5', testName: 'أشعة سينية X-Ray', result: 'كسر مركب في الثلث السفلي للشظية', normalRange: 'لا يوجد كسر', status: 'غير طبيعي', date: '2024-12-02' },
      { id: 'lr6', testName: 'صورة الدم الكاملة CBC', result: 'Hb: 14.2, WBC: 8.5, Plt: 250', normalRange: 'ضمن النطاق', status: 'طبيعي', date: '2024-12-02' },
    ],
    vitalSigns: { bloodPressure: '130/85', heartRate: 92, temperature: 37.4, oxygenSaturation: 98, weight: 72, height: 168, respiratoryRate: 20 }
  },
  {
    id: 'mr3', patientId: 'p5', doctorId: 'doc3', doctorName: 'د. محمد القاسم',
    date: '2025-01-06', diagnosis: 'التهاب المعدة الحاد مع جرثومة المعدة',
    symptoms: 'ألم شديد في المعدة، غثيان متكرر، حموضة شديدة، فقدان الشهية',
    notes: 'منع الأطعمة الحارة والمقلية والحمضيات. متابعة بعد أسبوعين لفحص الاستجابة للعلاج.',
    prescriptions: [
      { id: 'rx7', medication: 'أوميبرازول (Omeprazole)', dosage: '20mg', frequency: 'مرة يومياً قبل الفطور بنصف ساعة', duration: '4 أسابيع' },
      { id: 'rx8', medication: 'كلاريثروميسين (Clarithromycin)', dosage: '500mg', frequency: 'مرتين يومياً', duration: '14 يوم' },
      { id: 'rx9', medication: 'أموكسيسيلين (Amoxicillin)', dosage: '1000mg', frequency: 'مرتين يومياً', duration: '14 يوم' },
    ],
    labResults: [
      { id: 'lr7', testName: 'فحص جرثومة المعدة H.Pylori', result: 'إيجابي', normalRange: 'سلبي', status: 'غير طبيعي', date: '2025-01-06' },
      { id: 'lr8', testName: 'وظائف الكبد', result: 'ALT: 25, AST: 28', normalRange: 'ضمن النطاق', status: 'طبيعي', date: '2025-01-06' },
    ],
    vitalSigns: { bloodPressure: '118/75', heartRate: 78, temperature: 37.0, oxygenSaturation: 99, weight: 58, height: 162, respiratoryRate: 16 }
  },
];

const defaultAppointments: Appointment[] = [
  { id: 'apt1', patientId: 'p1', patientName: 'خالد العتيبي', doctorId: 'doc1', doctorName: 'د. أحمد الخالدي', date: '2025-02-01', time: '09:00', department: 'قسم القلب والأوعية الدموية', status: 'مؤكد', cost: 300, type: 'متابعة' },
  { id: 'apt2', patientId: 'p2', patientName: 'فهد الدوسري', doctorId: 'doc2', doctorName: 'د. سارة المنصور', date: '2025-02-03', time: '11:00', department: 'قسم جراحة العظام', status: 'مؤكد', cost: 500, type: 'متابعة' },
  { id: 'apt3', patientId: 'p5', patientName: 'ريم الحارثي', doctorId: 'doc3', doctorName: 'د. محمد القاسم', date: '2025-01-20', time: '10:30', department: 'قسم الباطنية', status: 'مكتمل', cost: 250, type: 'متابعة' },
  { id: 'apt4', patientId: 'p3', patientName: 'منال الشمري', doctorId: 'doc1', doctorName: 'د. أحمد الخالدي', date: '2025-02-05', time: '14:00', department: 'قسم القلب والأوعية الدموية', status: 'في الانتظار', cost: 300, type: 'كشفية' },
  { id: 'apt5', patientId: 'p6', patientName: 'ناصر الغامدي', doctorId: 'doc5', doctorName: 'د. عمر السعيد', date: '2025-02-10', time: '09:30', department: 'قسم طب العيون', status: 'مؤكد', cost: 400, type: 'كشفية' },
];

const defaultFinancialRecords: FinancialRecord[] = [
  { id: 'fr1', patientId: 'p1', patientName: 'خالد العتيبي', type: 'كشفية', amount: 300, date: '2024-11-16', paid: true, description: 'كشفية قسم القلب', invoiceNumber: 'INV-2024-0001' },
  { id: 'fr2', patientId: 'p1', patientName: 'خالد العتيبي', type: 'تحاليل', amount: 850, date: '2024-11-16', paid: true, description: 'تحاليل دم شاملة + دهون + كلى', invoiceNumber: 'INV-2024-0002' },
  { id: 'fr3', patientId: 'p1', patientName: 'خالد العتيبي', type: 'أدوية', amount: 420, date: '2024-11-16', paid: false, description: 'أدوية ضغط الدم (3 أشهر)', invoiceNumber: 'INV-2024-0003' },
  { id: 'fr4', patientId: 'p2', patientName: 'فهد الدوسري', type: 'كشفية', amount: 500, date: '2024-12-02', paid: true, description: 'كشفية طوارئ - عظام', invoiceNumber: 'INV-2024-0004' },
  { id: 'fr5', patientId: 'p2', patientName: 'فهد الدوسري', type: 'أشعة', amount: 1200, date: '2024-12-02', paid: true, description: 'أشعة سينية + تقرير طبي', invoiceNumber: 'INV-2024-0005' },
  { id: 'fr6', patientId: 'p2', patientName: 'فهد الدوسري', type: 'عملية', amount: 15000, date: '2024-12-10', paid: false, description: 'عملية تثبيت كسر داخلي', invoiceNumber: 'INV-2024-0006' },
  { id: 'fr7', patientId: 'p2', patientName: 'فهد الدوسري', type: 'إقامة', amount: 3000, date: '2024-12-02', paid: true, description: 'إقامة 5 أيام - غرفة خاصة', invoiceNumber: 'INV-2024-0007' },
  { id: 'fr8', patientId: 'p5', patientName: 'ريم الحارثي', type: 'كشفية', amount: 250, date: '2025-01-06', paid: true, description: 'كشفية قسم الباطنية', invoiceNumber: 'INV-2025-0001' },
  { id: 'fr9', patientId: 'p5', patientName: 'ريم الحارثي', type: 'تحاليل', amount: 600, date: '2025-01-06', paid: true, description: 'فحص جرثومة المعدة + وظائف كبد', invoiceNumber: 'INV-2025-0002' },
  { id: 'fr10', patientId: 'p4', patientName: 'عبدالله المطيري', type: 'إقامة', amount: 45000, date: '2024-09-01', paid: true, description: 'إقامة العناية المركزة - 60 يوم', invoiceNumber: 'INV-2024-0008' },
];

const defaultDutySchedules: DutySchedule[] = [
  { id: 'ds1', staffId: 'doc1', staffName: 'د. أحمد الخالدي', role: 'doctor', department: 'قسم القلب', date: new Date().toISOString().split('T')[0], shiftType: 'صباحي', shiftStart: '08:00', shiftEnd: '16:00' },
  { id: 'ds2', staffId: 'doc2', staffName: 'د. سارة المنصور', role: 'doctor', department: 'قسم العظام', date: new Date().toISOString().split('T')[0], shiftType: 'صباحي', shiftStart: '08:00', shiftEnd: '16:00' },
  { id: 'ds3', staffId: 'doc4', staffName: 'د. فاطمة الزهراء', role: 'doctor', department: 'النساء والولادة', date: new Date().toISOString().split('T')[0], shiftType: 'صباحي', shiftStart: '08:00', shiftEnd: '16:00' },
  { id: 'ds4', staffId: 'doc3', staffName: 'د. محمد القاسم', role: 'doctor', department: 'قسم الباطنية', date: new Date().toISOString().split('T')[0], shiftType: 'مسائي', shiftStart: '16:00', shiftEnd: '00:00' },
  { id: 'ds5', staffId: 'doc6', staffName: 'د. ليلى العمري', role: 'doctor', department: 'طب الأطفال', date: new Date().toISOString().split('T')[0], shiftType: 'ليلي', shiftStart: '00:00', shiftEnd: '08:00' },
  { id: 'ds6', staffId: 'nurse1', staffName: 'نورة الحربي', role: 'nurse', department: 'قسم القلب', date: new Date().toISOString().split('T')[0], shiftType: 'صباحي', shiftStart: '08:00', shiftEnd: '16:00' },
  { id: 'ds7', staffId: 'nurse2', staffName: 'هند السالم', role: 'nurse', department: 'الطوارئ', date: new Date().toISOString().split('T')[0], shiftType: 'مسائي', shiftStart: '16:00', shiftEnd: '00:00' },
  { id: 'ds8', staffId: 'nurse3', staffName: 'سلمى الرشيد', role: 'nurse', department: 'العناية المركزة', date: new Date().toISOString().split('T')[0], shiftType: 'ليلي', shiftStart: '00:00', shiftEnd: '08:00' },
];

const defaultVisitingHours: VisitingHours[] = [
  { department: 'جميع الأقسام', days: 'يومياً', hours: '04:00 م - 09:00 م' },
  { department: 'العناية المركزة', days: 'يومياً', hours: '05:00 م - 06:00 م (شخص واحد)' },
  { department: 'قسم الأطفال', days: 'يومياً', hours: '10:00 ص - 08:00 م (الوالدين فقط)' },
  { department: 'قسم النساء والولادة', days: 'يومياً', hours: '03:00 م - 08:00 م' },
];

const defaultInsuranceCompanies: InsuranceCompany[] = [
  { id: 'ins1', name: 'بوبا العربية', coveragePercentage: 80 },
  { id: 'ins2', name: 'التعاونية للتأمين', coveragePercentage: 75 },
  { id: 'ins3', name: 'ميدغلف', coveragePercentage: 70 },
  { id: 'ins4', name: 'تكافل الراجحي', coveragePercentage: 85 },
  { id: 'ins5', name: 'ملاذ للتأمين', coveragePercentage: 70 },
  { id: 'ins6', name: 'الدرع العربي', coveragePercentage: 75 },
];

export const useHospitalStore = create<HospitalState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: defaultUsers,
      patients: defaultPatients,
      medicalRecords: defaultMedicalRecords,
      departments: defaultDepartments,
      appointments: defaultAppointments,
      financialRecords: defaultFinancialRecords,
      dutySchedules: defaultDutySchedules,
      visitingHours: defaultVisitingHours,
      insuranceCompanies: defaultInsuranceCompanies,
      currentPage: 'home',
      sidebarOpen: false,

      login: (email, password) => {
        const user = get().users.find(u => u.email === email && u.password === password);
        if (user) {
          set({ currentUser: user, currentPage: user.role === 'admin' ? 'admin-dashboard' : user.role === 'doctor' ? 'doctor-dashboard' : user.role === 'nurse' ? 'nurse-dashboard' : 'patient-dashboard' });
          return true;
        }
        return false;
      },

      logout: () => set({ currentUser: null, currentPage: 'home', sidebarOpen: false }),

      register: (userData) => {
        const exists = get().users.find(u => u.email === userData.email);
        if (exists) return false;
        
        // Validate email format based on role
        const emailDomain = userData.email.split('@')[1];
        if (userData.role === 'doctor' && !emailDomain?.includes('doctor.')) return false;
        if (userData.role === 'nurse' && !emailDomain?.includes('nurse.')) return false;
        if (userData.role === 'patient' && !emailDomain?.includes('patient.')) return false;
        
        const newUser: User = { ...userData, id: generateId(), createdAt: new Date().toISOString().split('T')[0] };
        set(state => ({ users: [...state.users, newUser] }));
        if (userData.role === 'patient') {
          const newPatient: Patient = {
            id: generateId(), odNumber: generateODNumber(), userId: newUser.id, name: userData.name,
            age: 0, gender: 'ذكر', phone: userData.phone || '', bloodType: '',
            address: '', emergencyContact: '', status: 'نشط',
            admissionDate: new Date().toISOString().split('T')[0]
          };
          set(state => ({ patients: [...state.patients, newPatient] }));
        }
        return true;
      },

      setCurrentPage: (page) => set({ currentPage: page }),
      toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),

      addPatient: (patient) => set(state => ({ patients: [...state.patients, { ...patient, id: generateId(), odNumber: generateODNumber() }] })),
      updatePatient: (id, data) => set(state => ({ patients: state.patients.map(p => p.id === id ? { ...p, ...data } : p) })),
      deletePatient: (id) => set(state => ({ patients: state.patients.filter(p => p.id !== id) })),

      addMedicalRecord: (record) => set(state => ({ medicalRecords: [...state.medicalRecords, { ...record, id: generateId() }] })),
      updateMedicalRecord: (id, data) => set(state => ({ medicalRecords: state.medicalRecords.map(r => r.id === id ? { ...r, ...data } : r) })),

      addDepartment: (dept) => set(state => ({ departments: [...state.departments, { ...dept, id: generateId() }] })),
      updateDepartment: (id, data) => set(state => ({ departments: state.departments.map(d => d.id === id ? { ...d, ...data } : d) })),
      deleteDepartment: (id) => set(state => ({ departments: state.departments.filter(d => d.id !== id) })),

      addAppointment: (apt) => set(state => ({ appointments: [...state.appointments, { ...apt, id: generateId() }] })),
      updateAppointment: (id, data) => set(state => ({ appointments: state.appointments.map(a => a.id === id ? { ...a, ...data } : a) })),

      addFinancialRecord: (record) => set(state => ({ financialRecords: [...state.financialRecords, { ...record, id: generateId() }] })),

      markMedicationGiven: (recordId, prescriptionId, nurseName) => {
        set(state => ({
          medicalRecords: state.medicalRecords.map(r => {
            if (r.id === recordId) {
              return {
                ...r,
                prescriptions: r.prescriptions.map(p => {
                  if (p.id === prescriptionId) {
                    return { ...p, givenAt: new Date().toLocaleString('ar-SA'), givenBy: nurseName };
                  }
                  return p;
                })
              };
            }
            return r;
          })
        }));
      },

      deleteUser: (id) => set(state => ({ users: state.users.filter(u => u.id !== id) })),
      updateUser: (id, data) => set(state => ({ users: state.users.map(u => u.id === id ? { ...u, ...data } : u) })),
      
      addDutySchedule: (schedule) => set(state => ({ dutySchedules: [...state.dutySchedules, { ...schedule, id: generateId() }] })),
      deleteDutySchedule: (id) => set(state => ({ dutySchedules: state.dutySchedules.filter(s => s.id !== id) })),
    }),
    { name: 'hospital-store-v2' }
  )
);
