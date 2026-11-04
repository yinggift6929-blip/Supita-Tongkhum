import React from 'react';
import { 
  Users, 
  Calculator, 
  ShieldAlert, 
  BookOpen, 
  UserPlus, 
  Printer, 
  AlertTriangle, 
  Activity,
  Pill,
  FileSpreadsheet,
  Calendar,
  Clock,
  BarChart3
} from 'lucide-react';
import { Patient } from '../types/tb';

interface HeaderProps {
  activeTab: 'registry' | 'calculator' | 'rechallenge' | 'guidelines' | 'dashboard';
  setActiveTab: (tab: 'registry' | 'calculator' | 'rechallenge' | 'guidelines' | 'dashboard') => void;
  patients: Patient[];
  onOpenNewPatientModal: () => void;
  onOpenPrintModal: () => void;
  onOpenExcelModal: () => void;
  onOpenAppointmentsModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  patients,
  onOpenNewPatientModal,
  onOpenPrintModal,
  onOpenExcelModal,
  onOpenAppointmentsModal
}) => {
  const lowWeightCount = patients.filter(p => p.weight < 50).length;
  const diliCount = patients.filter(p => p.patientType.includes('Allergy') || p.patientType.includes('DILI') || p.regimenId.includes('HEPATIC')).length;
  const sputumPosCount = patients.filter(p => p.sputumStatus === 'Positive' && p.monthOfTreatment >= 2).length;

  // Appointment counts
  const todayStr = '2026-11-04';
  const todayApptCount = patients.filter(p => p.nextAppointmentDate === todayStr).length;
  const overdueCount = patients.filter(p => p.nextAppointmentDate && p.nextAppointmentDate < todayStr).length;

  return (
    <header className="bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 text-white shadow-xl sticky top-0 z-40 border-b border-teal-800/40">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-3.5 flex flex-wrap justify-between items-center gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 p-0.5 shadow-lg shadow-teal-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-teal-400">
              <Pill className="w-6 h-6 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                TB Pharmacy Care Hub
              </h1>
              <span className="bg-teal-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                รพ.เขาชัยสน จ.พัทลุง
              </span>
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                CPG 2021
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-teal-200/80 font-medium">
              ระบบบริบาลเภสัชกรรมและประสานการเบิกยาผู้ป่วยวัณโรครายสัปดาห์ร่วมกับพยาบาล
            </p>
          </div>
        </div>

        {/* Quick Clinical Badges */}
        <div className="hidden xl:flex items-center gap-2 text-xs font-semibold">
          <div className="bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-sm" title="ผู้ป่วยในระบบทั้งหมด">
            <Users className="w-3.5 h-3.5 text-teal-400" />
            <span className="text-slate-300">ผู้ป่วย:</span>
            <span className="font-bold text-white font-mono">{patients.length}</span>
          </div>

          <div className="bg-amber-950/40 border border-amber-700/60 px-3 py-1.5 rounded-xl flex items-center gap-2 text-amber-300" title="ผู้ป่วยน้ำหนักตัวน้อยกว่า 50 กก. ต้องคำนวณแยกเม็ด">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>BW &lt; 50 kg:</span>
            <span className="font-bold font-mono text-amber-200">{lowWeightCount}</span>
          </div>

          {sputumPosCount > 0 && (
            <div className="bg-rose-950/50 border border-rose-700/60 px-3 py-1.5 rounded-xl flex items-center gap-2 text-rose-300 animate-pulse" title="ผลเสมหะเดือนที่ 2 หรือ 5 ยังเป็นบวก ต้องขยายการรักษา">
              <Activity className="w-3.5 h-3.5 text-rose-400" />
              <span>Sputum (+):</span>
              <span className="font-bold font-mono text-white">{sputumPosCount}</span>
            </div>
          )}
        </div>

        {/* Action Buttons: Appointments Pop-up, Excel Requisition, New Patient, Print */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Appointments Trigger Button */}
          <button
            onClick={onOpenAppointmentsModal}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer border ${
              overdueCount > 0 || todayApptCount > 0
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 border-amber-400 shadow-amber-500/20'
                : 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
            title="เปิดหน้าต่างแจ้งเตือนวันนัดติดตามผู้ป่วยวัณโรค"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>วันนัดติดตาม</span>
            {(todayApptCount > 0 || overdueCount > 0) && (
              <span className="bg-slate-950 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black">
                {todayApptCount + overdueCount}
              </span>
            )}
          </button>

          {/* Excel Requisition Upload Button */}
          <button
            onClick={onOpenExcelModal}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer"
            title="อัปโหลดไฟล์ Excel ใบเบิกยาผู้ป่วยรายสัปดาห์จากพยาบาล"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-100" />
            <span>อัปโหลดใบเบิกยา (Excel)</span>
          </button>

          <button
            onClick={onOpenPrintModal}
            className="hidden sm:flex px-2.5 py-1.5 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
            title="พิมพ์หรือส่งออกสรุปการดูแลผู้ป่วย"
          >
            <Printer className="w-3.5 h-3.5 text-slate-300" />
            <span>พิมพ์สรุป</span>
          </button>

          <button
            onClick={onOpenNewPatientModal}
            className="px-3 py-1.5 bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-teal-300 hover:to-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-md shadow-teal-500/20 flex items-center gap-1.5 transition-all transform active:scale-95 cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-slate-950" />
            <span>+ ผู้ป่วยใหม่</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 flex gap-1.5 border-t border-slate-800/80 pt-1 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('registry')}
          className={`px-3.5 sm:px-4 py-2.5 text-xs font-bold rounded-t-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'registry'
              ? 'bg-slate-50 text-teal-950 border-t-2 border-teal-500 shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-teal-600" />
          <span>ทะเบียนผู้ป่วย, Visits & Timeline</span>
        </button>

        {/* Dashboard ผลงานบริบาลรายเดือน (User Request #2) */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-3.5 sm:px-4 py-2.5 text-xs font-bold rounded-t-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'dashboard'
              ? 'bg-slate-50 text-teal-950 border-t-2 border-teal-500 shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-teal-600" />
          <span>Dashboard ผลงานการบริบาลรายเดือน</span>
        </button>

        <button
          onClick={() => setActiveTab('calculator')}
          className={`px-3.5 sm:px-4 py-2.5 text-xs font-bold rounded-t-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'calculator'
              ? 'bg-slate-50 text-teal-950 border-t-2 border-teal-500 shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Calculator className="w-3.5 h-3.5 text-teal-600" />
          <span>คำนวณขนาดยา & สูตรยา CPG 2021</span>
        </button>

        <button
          onClick={() => setActiveTab('rechallenge')}
          className={`px-3.5 sm:px-4 py-2.5 text-xs font-bold rounded-t-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'rechallenge'
              ? 'bg-slate-50 text-teal-950 border-t-2 border-teal-500 shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
          <span>การจัดการแพ้ยา & Re-challenge (DILI)</span>
        </button>

        <button
          onClick={() => setActiveTab('guidelines')}
          className={`px-3.5 sm:px-4 py-2.5 text-xs font-bold rounded-t-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'guidelines'
              ? 'bg-slate-50 text-teal-950 border-t-2 border-teal-500 shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-teal-600" />
          <span>คู่มือ CPG & ปฏิสัมพันธ์ยา (DDI)</span>
        </button>
      </div>
    </header>
  );
};
