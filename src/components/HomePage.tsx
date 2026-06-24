import React from 'react';
import { useHospitalStore } from '../store/hospitalStore';
import { Heart, Shield, Clock, Users, Star, Phone, MapPin, Mail, Activity, ChevronLeft, Ambulance, Calendar, FileCheck, CreditCard } from 'lucide-react';

const stats = [
  { icon: Users, label: 'مريض سنوياً', value: '+25,000', color: 'from-blue-500 to-blue-700' },
  { icon: Activity, label: 'طبيب متخصص', value: '+150', color: 'from-primary to-primary-light' },
  { icon: Heart, label: 'عملية ناجحة', value: '+12,000', color: 'from-red-500 to-pink-600' },
  { icon: Star, label: 'سنة خبرة', value: '+30', color: 'from-gold to-gold-light' },
];

const services = [
  { icon: '🚨', title: 'الطوارئ 24/7', desc: 'فريق طوارئ متكامل جاهز على مدار الساعة لاستقبال جميع الحالات' },
  { icon: '❤️', title: 'جراحة القلب', desc: 'عمليات القلب المفتوح والقسطرة بأحدث التقنيات العالمية' },
  { icon: '🦴', title: 'جراحة العظام', desc: 'جراحات العظام والمفاصل واستبدال المفاصل بالمناظير' },
  { icon: '👶', title: 'طب الأطفال', desc: 'رعاية متكاملة للأطفال وحديثي الولادة والخدج' },
  { icon: '👁️', title: 'طب العيون', desc: 'عمليات الليزك والمياه البيضاء بأحدث أجهزة الليزر' },
  { icon: '🧠', title: 'جراحة الأعصاب', desc: 'جراحات الدماغ والعمود الفقري بدقة عالية' },
  { icon: '🤰', title: 'النساء والولادة', desc: 'متابعة الحمل والولادة الطبيعية والقيصرية' },
  { icon: '💊', title: 'صيدلية 24/7', desc: 'صيدلية متكاملة تعمل على مدار الساعة' },
];

const doctors = [
  { name: 'د. أحمد الخالدي', spec: 'استشاري أمراض القلب', img: 'https://images.pexels.com/photos/32254658/pexels-photo-32254658.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=300', exp: '15 سنة', available: true },
  { name: 'د. سارة المنصور', spec: 'استشاري جراحة العظام', img: 'https://images.pexels.com/photos/32115905/pexels-photo-32115905.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=300', exp: '12 سنة', available: true },
  { name: 'د. محمد القاسم', spec: 'استشاري الباطنية', img: 'https://images.pexels.com/photos/15962798/pexels-photo-15962798.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=300', exp: '18 سنة', available: false },
  { name: 'د. فاطمة الزهراء', spec: 'استشاري النساء والولادة', img: 'https://images.pexels.com/photos/18788957/pexels-photo-18788957.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=300', exp: '10 سنوات', available: true },
];

const quickLinks = [
  { icon: Calendar, title: 'حجز موعد', desc: 'احجز موعدك أونلاين', page: 'register' },
  { icon: FileCheck, title: 'نتائج التحاليل', desc: 'اطلع على نتائجك', page: 'login' },
  { icon: Ambulance, title: 'طلب إسعاف', desc: 'خدمة الطوارئ', page: 'contact' },
  { icon: CreditCard, title: 'الدفع الإلكتروني', desc: 'سدد فواتيرك', page: 'login' },
];

export const HomePage: React.FC = () => {
  const { setCurrentPage, currentPage, departments, dutySchedules, visitingHours, insuranceCompanies } = useHospitalStore();

  if (currentPage === 'about') return <AboutSection />;
  if (currentPage === 'departments') return <DepartmentsSection departments={departments} setCurrentPage={setCurrentPage} />;
  if (currentPage === 'doctors') return <DoctorsSection setCurrentPage={setCurrentPage} dutySchedules={dutySchedules} />;
  if (currentPage === 'services') return <ServicesSection visitingHours={visitingHours} insuranceCompanies={insuranceCompanies} />;
  if (currentPage === 'contact') return <ContactSection />;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] lg:min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/13946261/pexels-photo-13946261.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=1920"
            alt="Hospital"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/95 via-dark/85 to-dark"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-gold/5 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <div className="animate-fadeInUp">
            <div className="inline-flex items-center gap-2 px-5 py-2 border border-gold/30 bg-gold/5 mb-8 text-gold text-xs font-bold tracking-widest uppercase">
              <Shield size={14} />
              <span>المستشفى الرائد في المملكة</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight tracking-tight">
              <span className="text-white">رعاية صحية</span>
              <br />
              <span className="text-gradient">بمعايير عالمية</span>
            </h1>
            <p className="text-base md:text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              نقدم أرقى الخدمات الطبية بأيدي نخبة من الاستشاريين والأخصائيين
              <br className="hidden md:block" />
              مع أحدث التقنيات والأجهزة الطبية العالمية
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setCurrentPage('register')}
                className="btn-luxury btn-luxury-primary w-full sm:w-auto"
              >
                احجز موعدك الآن
              </button>
              <button
                onClick={() => setCurrentPage('departments')}
                className="btn-luxury btn-luxury-outline w-full sm:w-auto"
              >
                استكشف أقسامنا
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="absolute bottom-8 left-0 right-0 px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="glass-card p-4 lg:p-5 text-center card-luxury animate-fadeIn border border-dark-border hover:border-gold/30"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className={`w-10 h-10 mx-auto mb-2 bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon size={18} className="text-white" />
                </div>
                <div className="text-xl md:text-2xl font-black text-gradient">{stat.value}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-6 bg-gradient-to-r from-gold/10 via-transparent to-gold/10 border-y border-gold/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickLinks.map((link, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(link.page)}
                className="flex items-center gap-3 p-4 glass-card-light hover:bg-gold/5 hover:border-gold/20 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-gold/10 flex items-center justify-center group-hover:bg-gold group-hover:text-dark transition-all">
                  <link.icon size={20} className="text-gold group-hover:text-dark" />
                </div>
                <div className="text-right">
                  <h4 className="text-sm font-bold text-white">{link.title}</h4>
                  <p className="text-[10px] text-slate-500">{link.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* On-Duty Staff */}
      <section className="py-16 px-4 bg-dark">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-gold text-xs font-bold tracking-[3px] uppercase">الفريق المناوب اليوم</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-3 mb-4">الأطباء والممرضين</h2>
            <div className="divider-luxury"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Doctors On Duty */}
            <div className="glass-card p-6 border border-dark-border">
              <h3 className="text-lg font-bold text-gold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-gold/10 flex items-center justify-center">👨‍⚕️</span>
                الأطباء المناوبون
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm table-luxury">
                  <thead>
                    <tr>
                      <th className="text-right p-3 text-slate-400">الطبيب</th>
                      <th className="text-right p-3 text-slate-400">القسم</th>
                      <th className="text-right p-3 text-slate-400">المناوبة</th>
                      <th className="text-right p-3 text-slate-400">الوقت</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dutySchedules.filter(s => s.role === 'doctor').slice(0, 5).map(schedule => (
                      <tr key={schedule.id} className="border-t border-dark-border">
                        <td className="p-3 text-white font-medium">{schedule.staffName}</td>
                        <td className="p-3 text-slate-400 text-xs">{schedule.department}</td>
                        <td className="p-3">
                          <span className={`badge-luxury ${
                            schedule.shiftType === 'صباحي' ? 'bg-success/10 text-success' :
                            schedule.shiftType === 'مسائي' ? 'bg-warning/10 text-warning' :
                            'bg-purple-500/10 text-purple-400'
                          }`}>{schedule.shiftType}</span>
                        </td>
                        <td className="p-3 text-slate-400 text-xs">{schedule.shiftStart} - {schedule.shiftEnd}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Nurses On Duty */}
            <div className="glass-card p-6 border border-dark-border">
              <h3 className="text-lg font-bold text-gold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-gold/10 flex items-center justify-center">👩‍⚕️</span>
                الممرضين المناوبون
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm table-luxury">
                  <thead>
                    <tr>
                      <th className="text-right p-3 text-slate-400">الممرض/ة</th>
                      <th className="text-right p-3 text-slate-400">القسم</th>
                      <th className="text-right p-3 text-slate-400">المناوبة</th>
                      <th className="text-right p-3 text-slate-400">الوقت</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dutySchedules.filter(s => s.role === 'nurse').map(schedule => (
                      <tr key={schedule.id} className="border-t border-dark-border">
                        <td className="p-3 text-white font-medium">{schedule.staffName}</td>
                        <td className="p-3 text-slate-400 text-xs">{schedule.department}</td>
                        <td className="p-3">
                          <span className={`badge-luxury ${
                            schedule.shiftType === 'صباحي' ? 'bg-success/10 text-success' :
                            schedule.shiftType === 'مسائي' ? 'bg-warning/10 text-warning' :
                            'bg-purple-500/10 text-purple-400'
                          }`}>{schedule.shiftType}</span>
                        </td>
                        <td className="p-3 text-slate-400 text-xs">{schedule.shiftStart} - {schedule.shiftEnd}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-dark to-dark-card">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-gold text-xs font-bold tracking-[3px] uppercase">خدماتنا المتميزة</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mt-3 mb-4">أقسام طبية متكاملة</h2>
            <div className="divider-luxury"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((service, i) => (
              <div
                key={i}
                className="glass-card p-6 border border-dark-border card-luxury cursor-pointer group"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-500">{service.icon}</div>
                <h3 className="text-base font-bold text-white mb-2 group-hover:text-gold transition-colors">{service.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <button onClick={() => setCurrentPage('departments')} className="btn-luxury btn-luxury-outline inline-flex items-center gap-2">
              عرض جميع الأقسام
              <ChevronLeft size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="py-20 px-4 bg-dark-card">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-gold text-xs font-bold tracking-[3px] uppercase">فريقنا الطبي</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mt-3 mb-4">نخبة الاستشاريين</h2>
            <div className="divider-luxury"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {doctors.map((doc, i) => (
              <div key={i} className="glass-card overflow-hidden border border-dark-border card-luxury group">
                <div className="relative h-72 overflow-hidden">
                  <img src={doc.img} alt={doc.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent"></div>
                  <div className="absolute top-3 right-3">
                    <span className={`badge-luxury ${doc.available ? 'bg-success/20 text-success border border-success/30' : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'}`}>
                      {doc.available ? '● متاح' : '○ غير متاح'}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 px-3 py-1 bg-gold text-dark text-[10px] font-bold tracking-wider">{doc.exp}</div>
                </div>
                <div className="p-5">
                  <h3 className="text-base font-bold text-white">{doc.name}</h3>
                  <p className="text-xs text-gold mt-1">{doc.spec}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <button onClick={() => setCurrentPage('doctors')} className="btn-luxury btn-luxury-outline inline-flex items-center gap-2">
              عرض جميع الأطباء
              <ChevronLeft size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Insurance Partners */}
      <section className="py-16 px-4 bg-dark border-y border-dark-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-gold text-xs font-bold tracking-[3px] uppercase">شركاؤنا</span>
            <h2 className="text-2xl font-black text-white mt-2">شركات التأمين المعتمدة</h2>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {insuranceCompanies.map((company, i) => (
              <div key={i} className="px-6 py-3 glass-card border border-dark-border hover:border-gold/30 transition-all">
                <span className="text-sm text-slate-300">{company.name}</span>
                <span className="text-[10px] text-gold mr-2">({company.coveragePercentage}% تغطية)</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative overflow-hidden bg-gradient-to-b from-dark-card to-dark">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/5355858/pexels-photo-5355858.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1920')] bg-cover bg-center opacity-5"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="text-gold text-xs font-bold tracking-[3px] uppercase">نحن هنا من أجلك</span>
          <h2 className="text-3xl md:text-5xl font-black text-white mt-4 mb-6">هل تحتاج استشارة طبية؟</h2>
          <p className="text-base text-slate-400 mb-10">فريقنا الطبي جاهز لمساعدتك على مدار الساعة</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setCurrentPage('contact')}
              className="btn-luxury btn-luxury-primary w-full sm:w-auto"
            >
              تواصل معنا
            </button>
            <a
              href="tel:920000000"
              className="btn-luxury btn-luxury-outline w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <Phone size={16} />
              920-000-000
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 bg-dark-card border-t border-dark-border">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-gold to-gold-light flex items-center justify-center text-dark text-xl font-black">✚</div>
                <div>
                  <h3 className="text-lg font-black text-gradient">مستشفى الحياة</h3>
                  <p className="text-[10px] text-slate-600 tracking-[2px] uppercase">AL-HAYAT HOSPITAL</p>
                </div>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed mb-6 max-w-md">
                نسعى لتقديم أفضل الخدمات الطبية بمعايير عالمية وبأيدي نخبة من الأطباء والاستشاريين المتخصصين في مختلف المجالات الطبية.
              </p>
              <div className="flex items-center gap-4">
                {['facebook', 'twitter', 'instagram', 'linkedin'].map(social => (
                  <a key={social} href="#" className="w-10 h-10 border border-dark-border flex items-center justify-center text-slate-500 hover:border-gold hover:text-gold transition-all">
                    <span className="text-xs uppercase">{social.charAt(0)}</span>
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gold mb-5 tracking-wider uppercase">روابط سريعة</h4>
              <div className="space-y-3">
                {['الرئيسية', 'عن المستشفى', 'الأقسام الطبية', 'أطباؤنا', 'تواصل معنا'].map(link => (
                  <button key={link} className="block text-sm text-slate-500 hover:text-gold hover:translate-x-1 transition-all">{link}</button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gold mb-5 tracking-wider uppercase">تواصل معنا</h4>
              <div className="space-y-4 text-sm text-slate-500">
                <div className="flex items-start gap-3">
                  <Phone size={14} className="text-gold mt-1" />
                  <div>
                    <p className="text-white font-bold">920-000-000</p>
                    <p className="text-xs">على مدار الساعة</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail size={14} className="text-gold mt-1" />
                  <div>
                    <p>info@alhayat-hospital.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={14} className="text-gold mt-1" />
                  <div>
                    <p>الرياض - طريق الملك فهد</p>
                    <p className="text-xs">بجوار برج المملكة</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-dark-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-600">© 2025 مستشفى الحياة. جميع الحقوق محفوظة</p>
            <div className="flex items-center gap-6 text-xs text-slate-600">
              <a href="#" className="hover:text-gold transition-colors">سياسة الخصوصية</a>
              <a href="#" className="hover:text-gold transition-colors">الشروط والأحكام</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Sub-pages components
const AboutSection: React.FC = () => (
  <div className="min-h-screen pt-8 pb-12 px-4">
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <span className="text-gold text-xs font-bold tracking-[3px] uppercase">تعرف علينا</span>
        <h1 className="text-4xl font-black text-gradient mt-3 mb-4">عن مستشفى الحياة</h1>
        <div className="divider-luxury"></div>
      </div>
      <div className="glass-card p-8 mb-8 border border-dark-border animate-fadeIn">
        <img src="https://images.pexels.com/photos/11781911/pexels-photo-11781911.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=1200" alt="Hospital" className="w-full h-64 object-cover mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold text-gold mb-4">رؤيتنا</h2>
            <p className="text-slate-400 leading-relaxed text-sm">
              تأسس مستشفى الحياة عام 1995 ليكون صرحاً طبياً متكاملاً يقدم أعلى مستويات الرعاية الصحية في المنطقة. نحن نؤمن بأن كل مريض يستحق أفضل رعاية ممكنة، ولذلك نستثمر في أحدث التقنيات والكوادر الطبية المؤهلة.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gold mb-4">رسالتنا</h2>
            <p className="text-slate-400 leading-relaxed text-sm">
              تقديم خدمات صحية متميزة وشاملة تتوافق مع أعلى المعايير العالمية، مع التركيز على سلامة المريض وراحته، والمساهمة في تعزيز صحة المجتمع من خلال برامج التوعية والوقاية.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {[
            { value: '+30', label: 'سنة خبرة' },
            { value: '+150', label: 'طبيب' },
            { value: '+500', label: 'سرير' },
            { value: '24/7', label: 'خدمة طوارئ' },
          ].map((item, i) => (
            <div key={i} className="text-center p-4 bg-dark-card/50 border border-dark-border">
              <div className="text-2xl font-black text-gradient">{item.value}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const DepartmentsSection: React.FC<{ departments: any[]; setCurrentPage: (p: string) => void }> = ({ departments, setCurrentPage }) => (
  <div className="min-h-screen pt-8 pb-12 px-4">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <span className="text-gold text-xs font-bold tracking-[3px] uppercase">أقسامنا الطبية</span>
        <h1 className="text-4xl font-black text-gradient mt-3 mb-4">الأقسام والتخصصات</h1>
        <div className="divider-luxury"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {departments.map((dept, i) => (
          <div key={dept.id} className="glass-card p-6 border border-dark-border card-luxury animate-fadeIn" style={{ animationDelay: `${i * 0.08}s` }}>
            <div className="flex items-start justify-between mb-4">
              <div className="text-4xl">{dept.icon}</div>
              {dept.floor && <span className="text-[10px] text-slate-500 bg-dark-card px-2 py-1">{dept.floor}</span>}
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{dept.name}</h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">{dept.description}</p>
            {dept.headDoctor && (
              <p className="text-xs text-gold mb-3">👨‍⚕️ {dept.headDoctor}</p>
            )}
            {dept.bedsCount > 0 && (
              <>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-500">الأسرّة: {dept.bedsCount}</span>
                  <span className={`${dept.occupiedBeds / dept.bedsCount > 0.8 ? 'text-red-400' : 'text-success'}`}>
                    مشغولة: {dept.occupiedBeds}
                  </span>
                </div>
                <div className="w-full bg-dark h-1.5">
                  <div
                    className={`h-1.5 transition-all ${dept.occupiedBeds / dept.bedsCount > 0.8 ? 'bg-red-500' : 'bg-success'}`}
                    style={{ width: `${(dept.occupiedBeds / dept.bedsCount) * 100}%` }}
                  ></div>
                </div>
              </>
            )}
            {dept.phone && (
              <p className="text-xs text-slate-500 mt-3">📞 {dept.phone}</p>
            )}
          </div>
        ))}
      </div>
      <div className="text-center mt-10">
        <button onClick={() => setCurrentPage('register')} className="btn-luxury btn-luxury-primary">
          احجز موعد الآن
        </button>
      </div>
    </div>
  </div>
);

const DoctorsSection: React.FC<{ setCurrentPage: (p: string) => void; dutySchedules: any[] }> = ({ setCurrentPage, dutySchedules }) => (
  <div className="min-h-screen pt-8 pb-12 px-4">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <span className="text-gold text-xs font-bold tracking-[3px] uppercase">فريقنا الطبي</span>
        <h1 className="text-4xl font-black text-gradient mt-3 mb-4">نخبة الاستشاريين</h1>
        <div className="divider-luxury"></div>
      </div>
      
      {/* On Duty Today */}
      <div className="glass-card p-6 border border-gold/20 mb-10">
        <h3 className="text-lg font-bold text-gold mb-4">🕐 المناوبون اليوم - {new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm table-luxury">
            <thead>
              <tr>
                <th className="text-right p-3 text-slate-400">الاسم</th>
                <th className="text-right p-3 text-slate-400">القسم</th>
                <th className="text-right p-3 text-slate-400">المناوبة</th>
                <th className="text-right p-3 text-slate-400">من</th>
                <th className="text-right p-3 text-slate-400">إلى</th>
              </tr>
            </thead>
            <tbody>
              {dutySchedules.filter(s => s.role === 'doctor').map(schedule => (
                <tr key={schedule.id} className="border-t border-dark-border">
                  <td className="p-3 text-white font-medium">{schedule.staffName}</td>
                  <td className="p-3 text-slate-400">{schedule.department}</td>
                  <td className="p-3">
                    <span className={`badge-luxury ${
                      schedule.shiftType === 'صباحي' ? 'bg-success/10 text-success' :
                      schedule.shiftType === 'مسائي' ? 'bg-warning/10 text-warning' :
                      'bg-purple-500/10 text-purple-400'
                    }`}>{schedule.shiftType}</span>
                  </td>
                  <td className="p-3 text-slate-400">{schedule.shiftStart}</td>
                  <td className="p-3 text-slate-400">{schedule.shiftEnd}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {doctors.map((doc, i) => (
          <div key={i} className="glass-card overflow-hidden border border-dark-border card-luxury animate-fadeIn" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="relative h-72 overflow-hidden">
              <img src={doc.img} alt={doc.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent"></div>
              <div className="absolute top-3 right-3">
                <span className={`badge-luxury ${doc.available ? 'bg-success/20 text-success' : 'bg-red-500/20 text-red-400'}`}>
                  {doc.available ? '● متاح اليوم' : '○ غير متاح'}
                </span>
              </div>
              <div className="absolute bottom-3 right-3 px-3 py-1 bg-gold text-dark text-[10px] font-bold">{doc.exp}</div>
            </div>
            <div className="p-5">
              <h3 className="text-base font-bold text-white mb-1">{doc.name}</h3>
              <p className="text-xs text-gold mb-4">{doc.spec}</p>
              <button
                onClick={() => setCurrentPage('register')}
                className="w-full btn-luxury btn-luxury-dark !py-2 !text-xs"
              >
                احجز موعد
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ServicesSection: React.FC<{ visitingHours: any[]; insuranceCompanies: any[] }> = ({ visitingHours, insuranceCompanies }) => (
  <div className="min-h-screen pt-8 pb-12 px-4">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <span className="text-gold text-xs font-bold tracking-[3px] uppercase">خدماتنا</span>
        <h1 className="text-4xl font-black text-gradient mt-3 mb-4">الخدمات والمرافق</h1>
        <div className="divider-luxury"></div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Visiting Hours */}
        <div className="glass-card p-6 border border-dark-border">
          <h3 className="text-lg font-bold text-gold mb-4">🕐 أوقات الزيارة</h3>
          <div className="space-y-3">
            {visitingHours.map((vh, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-dark-card/50 border border-dark-border">
                <span className="text-sm text-white">{vh.department}</span>
                <span className="text-xs text-slate-400">{vh.hours}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Insurance */}
        <div className="glass-card p-6 border border-dark-border">
          <h3 className="text-lg font-bold text-gold mb-4">🏥 شركات التأمين المعتمدة</h3>
          <div className="grid grid-cols-2 gap-3">
            {insuranceCompanies.map((ins, i) => (
              <div key={i} className="p-3 bg-dark-card/50 border border-dark-border text-center">
                <p className="text-sm text-white">{ins.name}</p>
                <p className="text-xs text-gold mt-1">{ins.coveragePercentage}% تغطية</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Other Services */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: '🚑', title: 'إسعاف 24/7', desc: 'خدمة إسعاف متوفرة على مدار الساعة' },
          { icon: '🅿️', title: 'مواقف سيارات', desc: 'مواقف مجانية للزوار والمرضى' },
          { icon: '☕', title: 'كافيتريا', desc: 'مطعم وكافيتريا تعمل 24 ساعة' },
          { icon: '📶', title: 'واي فاي مجاني', desc: 'إنترنت مجاني في جميع الأقسام' },
          { icon: '🛗', title: 'مصاعد', desc: 'مصاعد لذوي الاحتياجات الخاصة' },
          { icon: '🛒', title: 'صيدلية', desc: 'صيدلية متكاملة تعمل 24/7' },
          { icon: '💳', title: 'دفع إلكتروني', desc: 'قبول جميع البطاقات والتحويلات' },
          { icon: '🌐', title: 'حجز أونلاين', desc: 'احجز موعدك من أي مكان' },
        ].map((service, i) => (
          <div key={i} className="glass-card p-5 border border-dark-border text-center card-luxury">
            <div className="text-3xl mb-3">{service.icon}</div>
            <h4 className="text-sm font-bold text-white mb-1">{service.title}</h4>
            <p className="text-[10px] text-slate-500">{service.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ContactSection: React.FC = () => (
  <div className="min-h-screen pt-8 pb-12 px-4">
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <span className="text-gold text-xs font-bold tracking-[3px] uppercase">تواصل معنا</span>
        <h1 className="text-4xl font-black text-gradient mt-3 mb-4">نحن هنا لمساعدتك</h1>
        <div className="divider-luxury"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card p-8 border border-dark-border animate-fadeIn">
          <h2 className="text-xl font-bold text-gold mb-6">أرسل لنا رسالة</h2>
          <div className="space-y-4">
            <input type="text" placeholder="الاسم الكامل" className="w-full p-4 input-luxury" />
            <input type="email" placeholder="البريد الإلكتروني" className="w-full p-4 input-luxury" />
            <input type="tel" placeholder="رقم الجوال" className="w-full p-4 input-luxury" />
            <select className="w-full p-4 input-luxury">
              <option value="">نوع الاستفسار</option>
              <option value="appointment">حجز موعد</option>
              <option value="inquiry">استفسار عام</option>
              <option value="complaint">شكوى أو اقتراح</option>
              <option value="insurance">استفسار عن التأمين</option>
            </select>
            <textarea rows={4} placeholder="رسالتك..." className="w-full p-4 input-luxury resize-none"></textarea>
            <button className="w-full btn-luxury btn-luxury-primary">
              إرسال الرسالة
            </button>
          </div>
        </div>
        <div className="space-y-5 animate-slideInLeft">
          {[
            { icon: Phone, title: 'الهاتف الموحد', info: '920-000-000', sub: 'متاح 24/7' },
            { icon: Mail, title: 'البريد الإلكتروني', info: 'info@alhayat-hospital.com', sub: 'نرد خلال 24 ساعة' },
            { icon: MapPin, title: 'العنوان', info: 'الرياض - طريق الملك فهد', sub: 'بجوار برج المملكة' },
            { icon: Clock, title: 'ساعات العمل', info: 'العيادات: 8ص - 10م', sub: 'الطوارئ: 24/7' },
          ].map((item, i) => (
            <div key={i} className="glass-card p-5 border border-dark-border flex items-start gap-4 card-luxury">
              <div className="w-12 h-12 bg-gold flex items-center justify-center shrink-0">
                <item.icon size={20} className="text-dark" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">{item.title}</h3>
                <p className="text-gold text-sm">{item.info}</p>
                <p className="text-slate-500 text-xs">{item.sub}</p>
              </div>
            </div>
          ))}
          
          {/* Emergency Box */}
          <div className="glass-card p-6 border-2 border-red-500/30 bg-red-500/5">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">🚨</span>
              <h3 className="text-lg font-bold text-red-400">حالة طوارئ؟</h3>
            </div>
            <p className="text-sm text-slate-400 mb-4">اتصل فوراً على رقم الطوارئ</p>
            <a href="tel:911" className="btn-luxury w-full flex items-center justify-center gap-2 !bg-red-500 !text-white hover:!bg-red-600">
              <Phone size={18} />
              911
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
);
