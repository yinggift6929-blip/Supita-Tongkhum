import React, { useState } from 'react';
import { 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Phone, 
  User, 
  Pill, 
  ChevronRight, 
  X, 
  Sparkles,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { Patient } from '../types/tb';

interface UpcomingAppointmentsModalProps {
  patients: Patient[];
  onClose: () => void;
  onSelectPatient: (patientId: string) => void;
  onOpenAddVisitModal: (patientId: string) => void;
}

export const UpcomingAppointmentsModal: React.FC<UpcomingAppointmentsModalProps> = ({
  patients,
  onClose,
  onSelectPatient,
  onOpenAddVisitModal
}) => {
  const [filterTab, setFilterTab] = useState<'today' | 'overdue' | 'week' | 'all'>('today');

  // Today reference date (Thailand local time: 2026-11-04)
  const todayStr = '2026-11-04';
  const today = new Date(todayStr);

  // Group patients by appointment status
  const patientAppointments = patients.map(p => {
    if (!p.nextAppointmentDate) {
      return { patient: p, status: 'no_appt', diffDays: 999 };
    }
    const apptDate = new Date(p.nextAppointmentDate);
    const diffTime = apptDate.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

    let status: 'today' | 'overdue' | 'week' | 'future';
    if (diffDays === 0) {
      status = 'today';
    } else if (diffDays < 0) {
      status = 'overdue';
    } else if (diffDays <= 7) {
      status = 'week';
    } else {
      status = 'future';
    }

    return { patient: p, status, diffDays, apptDate: p.nextAppointmentDate };
  });

  const todayList = patientAppointments.filter(item => item.status === 'today');
  const overdueList = patientAppointments.filter(item => item.status === 'overdue');
  const weekList = patientAppointments.filter(item => item.status === 'week');
  const allUpcomingList = patientAppointments.filter(item => item.diffDays >= 0 && item.diffDays <= 30);

  const currentDisplayList = filterTab === 'today'
    ? todayList
    : filterTab === 'overdue'
    ? overdueList
    : filterTab === 'week'
    ? weekList
    : allUpcomingList;

  const handleSelectAndProceed = (patientId: string) => {
    onSelectPatient(patientId);
    onClose();
  };

  const handleAddVisitFromAppt = (patientId: string) => {
    onSelectPatient(patientId);
    onClose();
    onOpenAddVisitModal(patientId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-teal-400">
                <Calendar className="w-6 h-6" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg text-slate-900">
                  แจ้งเตือนวันนัดติดตามผู้ป่วยวัณโรค (TB Clinic Appointments)
                </h3>
                <span className="bg-teal-100 text-teal-900 font-black text-[10px] px-2 py-0.5 rounded-full">
                  รพ.เขาชัยสน
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                ประจำวันที่ 4 พฤศจิกายน 2569 • ประสานงานระหว่างเภสัชกรและพยาบาลคลินิกวัณโรค
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Counters */}
        <div className="grid grid-cols-3 gap-2.5 text-xs">
          <button
            onClick={() => setFilterTab('today')}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
              filterTab === 'today'
                ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-500/20 shadow-xs'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
            }`}
          >
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">นัดหมายวันนี้</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xl font-black text-teal-900 font-mono">{todayList.length}</span>
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-ping" />
            </div>
          </button>

          <button
            onClick={() => setFilterTab('overdue')}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
              filterTab === 'overdue'
                ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-500/20 shadow-xs'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
            }`}
          >
            <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">ขาดนัด / เลยกำหนด</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xl font-black text-rose-700 font-mono">{overdueList.length}</span>
              {overdueList.length > 0 && (
                <span className="text-[10px] bg-rose-200 text-rose-950 font-bold px-1.5 py-0.2 rounded">
                  ต้องตาม!
                </span>
              )}
            </div>
          </button>

          <button
            onClick={() => setFilterTab('week')}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
              filterTab === 'week'
                ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20 shadow-xs'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
            }`}
          >
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">ใน 7 วันข้างหน้า</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xl font-black text-amber-800 font-mono">{weekList.length}</span>
              <span className="text-[10px] text-slate-400">สัปดาห์นี้</span>
            </div>
          </button>
        </div>

        {/* Appointment Cards List */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-700">
              {filterTab === 'today'
                ? `รายการผู้ป่วยที่มีนัดวันนี้ (${todayList.length} คน)`
                : filterTab === 'overdue'
                ? `ผู้ป่วยที่เลยกำหนดนัด/ขาดนัด (${overdueList.length} คน)`
                : filterTab === 'week'
                ? `ผู้ป่วยที่มีนัดใน 7 วันข้างหน้า (${weekList.length} คน)`
                : `ผู้ป่วยทั้งหมดที่มีนัด (${allUpcomingList.length} คน)`}
            </span>
            <span className="text-[11px] text-slate-500">คลิกที่รายชื่อเพื่อเปิดข้อมูลผู้ป่วย</span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[320px] overflow-y-auto space-y-2.5 pr-1">
            {currentDisplayList.length === 0 ? (
              <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs">
                {filterTab === 'today'
                  ? 'ไม่มีผู้ป่วยที่มีนัดหมายในวันนี้'
                  : filterTab === 'overdue'
                  ? 'ยอดเยี่ยม! ไม่มีผู้ป่วยขาดนัดในระบบ'
                  : 'ไม่มีนัดหมายในช่วงเวลานี้'}
              </div>
            ) : (
              currentDisplayList.map(({ patient, status, diffDays, apptDate }) => (
                <div
                  key={patient.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    status === 'today'
                      ? 'bg-teal-50/70 border-teal-300'
                      : status === 'overdue'
                      ? 'bg-rose-50/70 border-rose-300'
                      : 'bg-white border-slate-200 hover:border-teal-300'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-black text-slate-900">{patient.name}</span>
                        <span className="text-[11px] text-slate-500 font-mono">HN: {patient.hn}</span>
                        {patient.phoneNumber && (
                          <span className="text-[11px] text-teal-800 bg-teal-100/80 px-2 py-0.5 rounded font-mono flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            <span>{patient.phoneNumber}</span>
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-2 font-medium">
                        <span>สูตรยา: <strong className="text-slate-800 font-bold">{patient.regimenName}</strong></span>
                        <span>•</span>
                        <span>BW: <strong>{patient.weight} kg</strong></span>
                        <span>•</span>
                        <span>การกำกับยา: {patient.dotType}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full inline-block ${
                        status === 'today'
                          ? 'bg-teal-600 text-white'
                          : status === 'overdue'
                          ? 'bg-rose-600 text-white animate-pulse'
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}>
                        {status === 'today'
                          ? '🔔 นัดวันนี้!'
                          : status === 'overdue'
                          ? `⚠️ ขาดนัด ${Math.abs(diffDays)} วัน`
                          : `อีก ${diffDays} วัน`}
                      </span>
                      <span className="block text-[11px] font-mono text-slate-500 mt-1">
                        {apptDate}
                      </span>
                    </div>
                  </div>

                  {/* Quick Action buttons */}
                  <div className="mt-3 pt-2 border-t border-slate-200/70 flex justify-end items-center gap-2 text-xs">
                    <button
                      onClick={() => handleAddVisitFromAppt(patient.id)}
                      className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl flex items-center gap-1 shadow-xs cursor-pointer transition-all"
                    >
                      <Pill className="w-3.5 h-3.5" />
                      <span>บันทึกมาตามนัด / จ่ายยา</span>
                    </button>

                    <button
                      onClick={() => handleSelectAndProceed(patient.id)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-all"
                    >
                      <span>ดูเวชระเบียน</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Modal Bottom CTA */}
        <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
          <span className="text-slate-500">
            ระบบตรวจสอบวันนัดอัตโนมัติทุกครั้งเมื่อเริ่มใช้งาน
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-black rounded-xl shadow-md transition-all cursor-pointer"
          >
            เข้าสู่หน้าแอปพลิเคชัน
          </button>
        </div>
      </div>
    </div>
  );
};
