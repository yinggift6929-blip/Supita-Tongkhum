import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  FileText, 
  MessageSquare, 
  Plus, 
  Pill, 
  Calendar, 
  Clock, 
  UserCheck, 
  Activity,
  ChevronRight,
  TrendingUp,
  Heart,
  Scale
} from 'lucide-react';
import { Patient, ADRRecord, SOAPNote, MultidisciplinaryNote } from '../types/tb';
import { getPatientTimelineStats, calculateFirstLineDoses } from '../utils/tbCalculations';
import { DRUG_INTERACTIONS } from '../data/cpgData';

interface PatientRegistryProps {
  patients: Patient[];
  selectedPatientId: string;
  onSelectPatient: (id: string) => void;
  onToggleSputumStatus: (id: string) => void;
  onOpenCheerUpModal: () => void;
  onOpenAdrModal: () => void;
  onOpenSoapModal: () => void;
  onAddMultiNote: (patientId: string, text: string) => void;
  onAdvanceMonth: (patientId: string) => void;
}

export const PatientRegistry: React.FC<PatientRegistryProps> = ({
  patients,
  selectedPatientId,
  onSelectPatient,
  onToggleSputumStatus,
  onOpenCheerUpModal,
  onOpenAdrModal,
  onOpenSoapModal,
  onAddMultiNote,
  onAdvanceMonth
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [weightFilter, setWeightFilter] = useState<'all' | 'low' | 'normal'>('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [detailTab, setDetailTab] = useState<'adr' | 'soap' | 'multidisciplinary' | 'ddi'>('adr');
  const [newNoteInput, setNewNoteInput] = useState('');

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  const filteredPatients = patients.filter(p => {
    const term = searchTerm.toLowerCase();
    const matchSearch = p.name.toLowerCase().includes(term) || p.hn.includes(term) || p.id.toLowerCase().includes(term);
    const matchWeight = weightFilter === 'all' ? true : weightFilter === 'low' ? p.weight < 50 : p.weight >= 50;
    const matchType = typeFilter === 'all' ? true : p.patientType.includes(typeFilter);
    return matchSearch && matchWeight && matchType;
  });

  const timelineStats = getPatientTimelineStats(selectedPatient);
  const isLowWeight = selectedPatient.weight < 50;
  const calculatedDoses = calculateFirstLineDoses(selectedPatient.weight);

  // Check matching DDIs for concomitant medications
  const matchedDdis = DRUG_INTERACTIONS.filter(ddi => 
    (selectedPatient.concomitantMeds || []).some(med => 
      med.toLowerCase().includes(ddi.drug.toLowerCase().split(' ')[0].toLowerCase()) ||
      ddi.drug.toLowerCase().includes(med.toLowerCase().split(' ')[0].toLowerCase())
    )
  );

  const handlePostNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteInput.trim()) return;
    onAddMultiNote(selectedPatient.id, newNoteInput.trim());
    setNewNoteInput('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* LEFT SIDEBAR: PATIENT LIST & FILTERS */}
      <div className="lg:col-span-4 space-y-4">
        {/* Filters Card */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="ค้นหาชื่อผู้ป่วย, HN, หรือรหัส TB..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                กลุ่มน้ำหนักตัว
              </label>
              <select
                value={weightFilter}
                onChange={(e) => setWeightFilter(e.target.value as any)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="all">ทั้งหมด ({patients.length})</option>
                <option value="low">BW &lt; 50 kg (แยกเม็ด)</option>
                <option value="normal">BW ≥ 50 kg (มาตรฐาน)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                ประเภทผู้ป่วย
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="all">ทุกประเภท</option>
                <option value="DS-TB">DS-TB (ไวต่อยา)</option>
                <option value="MDR">MDR/RR-TB (ดื้อยา)</option>
                <option value="Allergy">DILI / แพ้ยา</option>
                <option value="HIV">TB / HIV</option>
              </select>
            </div>
          </div>
        </div>

        {/* Patient List Container */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="p-3 bg-slate-100/70 border-b border-slate-200 flex justify-between items-center text-xs">
            <span className="font-bold text-slate-600 flex items-center gap-1.5">
              <span>รายชื่อผู้ป่วยที่ดูแล</span>
              <span className="bg-teal-700 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {filteredPatients.length}
              </span>
            </span>
            <span className="text-[11px] text-slate-500">คลิกเพื่อดูรายละเอียด</span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[560px] overflow-y-auto">
            {filteredPatients.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                ไม่พบข้อมูลผู้ป่วยที่ตรงตามเงื่อนไข
              </div>
            ) : (
              filteredPatients.map(p => {
                const isSelected = selectedPatientId === p.id;
                const stats = getPatientTimelineStats(p);
                const hasDili = p.adrRecords.some(r => r.reaction.includes('DILI') || r.reaction.includes('Liver'));

                return (
                  <div
                    key={p.id}
                    onClick={() => onSelectPatient(p.id)}
                    className={`p-3.5 cursor-pointer transition-all border-l-4 ${
                      isSelected
                        ? 'bg-teal-50/90 border-teal-600 shadow-inner'
                        : 'hover:bg-slate-50/80 border-transparent'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-black text-teal-800">{p.id}</span>
                          <span className="text-[10px] text-slate-500 font-mono">HN: {p.hn}</span>
                          {p.patientType.includes('MDR') && (
                            <span className="px-1.5 py-0.2 bg-purple-100 text-purple-800 font-black text-[9px] rounded border border-purple-200">
                              MDR
                            </span>
                          )}
                          {hasDili && (
                            <span className="px-1.5 py-0.2 bg-amber-100 text-amber-900 font-black text-[9px] rounded border border-amber-200">
                              DILI
                            </span>
                          )}
                          {p.hivStatus === 'Positive' && (
                            <span className="px-1.5 py-0.2 bg-rose-100 text-rose-800 font-black text-[9px] rounded border border-rose-200">
                              HIV(+)
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm mt-0.5">{p.name}</h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                          <span>
                            BW:{' '}
                            <strong className={p.weight < 50 ? 'text-amber-700 font-bold' : 'text-slate-700'}>
                              {p.weight} kg
                            </strong>
                          </span>
                          <span>•</span>
                          <span>อายุ {p.age} ปี ({p.gender})</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full inline-block ${
                          stats.percent >= 100 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                            : 'bg-teal-100 text-teal-800 border border-teal-300'
                        }`}>
                          {stats.percent}%
                        </span>
                        <span className="block text-[10px] text-slate-400 mt-1">
                          เดือน {stats.currentM}/{stats.regMonths}
                        </span>
                      </div>
                    </div>

                    {/* Mini Progress */}
                    <div className="mt-2.5">
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            stats.percent >= 100 ? 'bg-emerald-500' : 'bg-teal-600'
                          }`}
                          style={{ width: `${stats.percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* RIGHT MAIN PANEL: SELECTED PATIENT CLINICAL FILE */}
      <div className="lg:col-span-8 space-y-5">
        {/* PATIENT PROFILE HEADER CARD */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="bg-gradient-to-r from-teal-50 via-slate-50 to-emerald-50 p-4 rounded-2xl border border-teal-100/90 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-13 h-13 bg-teal-800 text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-md shadow-teal-900/20">
                <UserCheck className="w-7 h-7 text-teal-200" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-black text-slate-900">{selectedPatient.name}</h2>
                  <span className="text-xs bg-teal-900 text-white font-mono px-2 py-0.5 rounded-md font-bold shadow-sm">
                    HN: {selectedPatient.hn}
                  </span>
                  <span className="text-xs bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-md">
                    ID: {selectedPatient.id}
                  </span>
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md border border-emerald-300">
                    ความร่วมมือยา: {selectedPatient.adherenceRate}%
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 mt-1.5 font-medium">
                  <span>
                    <strong className="text-slate-800">อายุ:</strong> {selectedPatient.age} ปี ({selectedPatient.gender})
                  </span>
                  <span>•</span>
                  <span>
                    <strong className="text-slate-800">น้ำหนัก:</strong>{' '}
                    <span className={isLowWeight ? 'text-amber-700 font-bold' : 'text-slate-900 font-bold'}>
                      {selectedPatient.weight} kg
                    </span>{' '}
                    (ส่วนสูง {selectedPatient.height} cm / BMI: {selectedPatient.bmi})
                  </span>
                  <span>•</span>
                  <span>
                    <strong className="text-slate-800">การกำกับยา (DOTs):</strong> {selectedPatient.dotType}
                  </span>
                  <span>•</span>
                  <span>
                    <strong className="text-slate-800">HIV Status:</strong> {selectedPatient.hivStatus}
                  </span>
                </div>

                <div className="mt-1 text-xs text-teal-950 font-semibold flex items-center gap-1.5">
                  <span className="text-slate-500 font-normal">การวินิจฉัย:</span>
                  <span className="bg-teal-100/70 text-teal-900 px-2 py-0.5 rounded font-bold">
                    {selectedPatient.diagnosis}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={onOpenCheerUpModal}
                className="px-3.5 py-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-white text-xs font-black rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-200 animate-spin" />
                <span>เปิดโหมด Cheer Up ให้กำลังใจ</span>
              </button>

              <button
                onClick={() => onAdvanceMonth(selectedPatient.id)}
                className="px-3 py-2 bg-teal-50 hover:bg-teal-100 border border-teal-300 text-teal-900 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                title="บันทึกการกินยาครบ 1 เดือน เพื่อเลื่อน Month of Treatment"
              >
                <TrendingUp className="w-3.5 h-3.5 text-teal-700" />
                <span>+1 เดือน (ทานยาครบ)</span>
              </button>

              <button
                onClick={() => onToggleSputumStatus(selectedPatient.id)}
                className={`px-3 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 border transition-all cursor-pointer ${
                  selectedPatient.sputumStatus === 'Positive'
                    ? 'bg-rose-100 text-rose-800 border-rose-300 hover:bg-rose-200'
                    : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                }`}
                title="คลิกเพื่อสลับสถานะเสมหะ AFB Positive / Negative"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>
                  {selectedPatient.sputumStatus === 'Positive' ? 'ผล Sputum: (+) บวก' : 'ผล Sputum: (-) ลบ'}
                </span>
              </button>
            </div>
          </div>

          {/* 📊 SCALE แสดงการกินยาของผู้ป่วย (TREATMENT PROGRESS SCALE ROADMAP) */}
          <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white p-5 rounded-2xl shadow-xl border border-slate-800 space-y-4">
            <div className="flex flex-wrap justify-between items-center border-b border-slate-800 pb-3 gap-2">
              <div>
                <span className="text-[11px] font-black text-teal-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-amber-400" />
                  SCALE แสดงการกินยาของผู้ป่วย (TREATMENT PROGRESS SCALE)
                </span>
                <h3 className="text-base font-extrabold text-white mt-0.5 flex items-center gap-2">
                  <span>{timelineStats.cheerBadge}</span>
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block font-medium">ความก้าวหน้าการกินยา</span>
                <span className="text-2xl font-black text-amber-400 font-mono tracking-tight">
                  {timelineStats.percent}%
                </span>
              </div>
            </div>

            {/* Motivational Speech Bubble */}
            <div className="bg-teal-950/60 border border-teal-500/30 p-3.5 rounded-xl flex items-start gap-3">
              <Heart className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-teal-100 font-medium leading-relaxed">
                  "{timelineStats.cheerMessage}"
                </p>
                <span className="text-[10px] text-teal-300/80 block mt-1">
                  ระยะปัจจุบัน: <strong className="text-amber-300">{timelineStats.stageTitle}</strong> (กินยามาแล้ว {timelineStats.currentM} จากเป้าหมาย {timelineStats.regMonths} เดือน)
                </span>
              </div>
            </div>

            {/* The Visual Scale Bar */}
            <div className="pt-6 pb-2 px-2">
              <div className="relative">
                {/* Background tracks */}
                <div className="h-5 bg-slate-800 rounded-full w-full overflow-hidden flex border border-slate-700/80">
                  {/* Intensive Phase (first 2 months) */}
                  <div 
                    className="bg-blue-600/70 h-full relative" 
                    style={{ width: `${Math.min((2 / timelineStats.regMonths) * 100, 100)}%` }} 
                    title="ระยะเข้มข้น (Intensive Phase 2 เดือน)"
                  />
                  {/* Continuation Phase */}
                  <div 
                    className="bg-emerald-600/70 h-full relative" 
                    style={{ width: `${Math.max(0, Math.min(((selectedPatient.regimenMonths - 2) / timelineStats.regMonths) * 100, 100))}%` }} 
                    title="ระยะสมาน (Continuation Phase)"
                  />
                  {/* Extended Phase (if active) */}
                  {selectedPatient.extendedPhase && (
                    <div 
                      className="bg-rose-600/80 h-full animate-pulse" 
                      style={{ width: `${(selectedPatient.extendedMonths / timelineStats.regMonths) * 100}%` }} 
                      title="ขยายเวลาทานยาเพิ่ม 2 เดือน (Sputum Positive)"
                    />
                  )}
                </div>

                {/* Actual Progress Fill */}
                <div 
                  className="absolute top-0 left-0 h-5 bg-gradient-to-r from-teal-400 via-emerald-400 to-amber-300 rounded-full shadow-lg opacity-90 transition-all duration-700" 
                  style={{ width: `${timelineStats.percent}%` }} 
                />

                {/* Animated Current Month Pin Marker */}
                <div 
                  className="absolute -top-5 transform -translate-x-1/2 transition-all duration-700 z-20 flex flex-col items-center"
                  style={{ left: `${Math.max(3, Math.min(timelineStats.percent, 97))}%` }}
                >
                  <div className="bg-amber-400 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full shadow-xl border border-white flex items-center gap-1 whitespace-nowrap">
                    <Clock className="w-3 h-3 text-slate-950" />
                    <span>กินยาถึงเดือนที่ {timelineStats.currentM}</span>
                  </div>
                  <div className="w-2.5 h-2.5 bg-amber-400 rotate-45 -mt-1 shadow-md"></div>
                </div>
              </div>

              {/* Milestone Markers */}
              <div className="flex justify-between mt-5 text-[11px] text-slate-400 font-medium">
                <div className="flex flex-col items-start">
                  <span className="text-slate-300 font-bold">Month 0</span>
                  <span className="text-[10px] text-slate-500">เริ่มรักษา</span>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-cyan-400 font-bold">Month 2</span>
                  <span className="text-[10px] text-cyan-300/80">ตรวจเสมหะ (จบ Intensive)</span>
                </div>

                {timelineStats.regMonths > 6 && (
                  <div className="flex flex-col items-center">
                    <span className="text-teal-400 font-bold">Month 5</span>
                    <span className="text-[10px] text-teal-300/80">ตรวจเสมหะซ้ำ</span>
                  </div>
                )}

                <div className="flex flex-col items-end">
                  <span className="text-amber-400 font-bold">
                    Month {timelineStats.regMonths}
                    {selectedPatient.extendedPhase && ' (+2M)'}
                  </span>
                  <span className="text-[10px] text-amber-300/80">เป้าหมายทานยาครบ / หายขาด</span>
                </div>
              </div>
            </div>
          </div>

          {/* ⚠️ WEIGHT CLINICAL GUIDANCE BANNER (<50 kg vs >=50 kg) */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isLowWeight 
              ? 'bg-amber-50/90 border-amber-300 text-amber-950' 
              : 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
          }`}>
            <div className="flex items-start gap-3">
              {isLowWeight ? (
                <div className="p-2 bg-amber-200/80 text-amber-900 rounded-xl shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              ) : (
                <div className="p-2 bg-emerald-200/80 text-emerald-900 rounded-xl shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              )}
              <div className="space-y-1.5 flex-1 text-xs">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="font-black text-sm">
                    {isLowWeight
                      ? `⚠️ คำเตือน CPG 2021: น้ำหนักตัวผู้ป่วยน้อยกว่า 50 กก. (${selectedPatient.weight} kg) - ต้องคำนวณแยกเม็ด`
                      : `✅ น้ำหนักตัวอยู่ในเกณฑ์มาตรฐาน (${selectedPatient.weight} kg) - สามารถใช้ FDC หรือยาแยกเม็ดขนาดปกติได้`}
                  </h4>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                    isLowWeight ? 'bg-amber-200 text-amber-950' : 'bg-emerald-200 text-emerald-950'
                  }`}>
                    {isLowWeight ? 'แยกเม็ดตามน้ำหนัก (Separate Tablets)' : 'สูตรมาตรฐาน 4FDC 4 เม็ด หรือแยกเม็ด'}
                  </span>
                </div>

                <p className="leading-relaxed">
                  {isLowWeight
                    ? 'ห้ามจ่ายยา Fixed-Dose Combination (FDC) 4 เม็ดในผู้ป่วยน้ำหนัก < 50 kg เพราะจะได้รับยา Pyrazinamide และ Ethambutol เกินขนาด ทำให้เสี่ยงต่อ DILI และจอประสาทตาอักเสบ'
                    : 'ผู้ป่วยน้ำหนัก ≥ 50 kg สามารถรับประทาน 4FDC วันละ 4 เม็ดก่อนอาหารเช้า หรือเลือกรับประทานยาแยกเม็ดสูตรมาตรฐาน'}
                </p>

                {/* Specific tablet dispensing breakdown */}
                {isLowWeight && (
                  <div className="mt-2.5 pt-2.5 border-t border-amber-200/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold">
                    {calculatedDoses.map(d => (
                      <div key={d.code} className="bg-white/80 p-2 rounded-xl border border-amber-200 flex items-center justify-between">
                        <span className="font-bold text-slate-800">{d.drugName}:</span>
                        <span className="text-amber-900 font-mono text-[11px]">{d.tabletDispenseThai.split(' วันละ')[0]}</span>
                      </div>
                    ))}
                    <div className="bg-white/80 p-2 rounded-xl border border-amber-200 flex items-center justify-between sm:col-span-2">
                      <span className="font-bold text-slate-800">Pyridoxine (Vitamin B6):</span>
                      <span className="text-amber-900 font-mono text-[11px]">50 mg วันละ 1 เม็ด (ป้องกันปลายประสาทอักเสบ)</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SPUTUM (+) ALERT BANNER IF ACTIVE */}
          {selectedPatient.extendedPhase && (
            <div className="p-4 bg-rose-50 border border-rose-300 rounded-2xl text-rose-950 text-xs flex items-start gap-3 shadow-sm animate-pulse">
              <div className="p-2 bg-rose-200 text-rose-900 rounded-xl shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-rose-900 text-sm">
                  🚨 CPG 2021 ข้อบ่งชี้การขยายระยะเวลาทานยา (Sputum AFB Positive at Month 2)
                </h4>
                <p className="leading-relaxed">
                  เนื่องจากผลตรวจเสมหะย้อมเชื้อ AFB ยังคงเป็นบวก (+ positive) ในเดือนที่ 2 ตามแนวทาง CPG 2021 แนะนำให้:
                </p>
                <ul className="list-disc pl-5 space-y-0.5 font-medium text-rose-900">
                  <li>ขยายระยะเวลาทานยาต่ออีก 2 เดือน (รวมเป็น 8-9 เดือน)</li>
                  <li>ส่งตรวจเสมหะทดสอบความไวต่อยา (DST) หรือ GeneXpert เพื่อคัดกรองเชื้อดื้อยา Rifampicin ทันที</li>
                  <li>ประเมินความสม่ำเสมอในการรับประทานยา (Adherence) และพิจารณาปรับระบบ DOTs ให้เข้มงวด</li>
                </ul>
              </div>
            </div>
          )}

          {/* ACTIVE ALERTS LIST */}
          {selectedPatient.alerts.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                การแจ้งเตือนทางคลินิก (Clinical Alerts & Warnings)
              </span>
              <div className="space-y-1.5">
                {selectedPatient.alerts.map(alt => (
                  <div
                    key={alt.id}
                    className={`p-2.5 rounded-xl border text-xs flex items-center gap-2.5 ${
                      alt.type === 'Critical'
                        ? 'bg-rose-50 border-rose-200 text-rose-900 font-semibold'
                        : alt.type === 'Warning'
                        ? 'bg-amber-50 border-amber-200 text-amber-900 font-semibold'
                        : 'bg-blue-50 border-blue-200 text-blue-900'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{alt.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CLINICAL TABS: ADR RECORDS / SOAP NOTES / MULTIDISCIPLINARY COLLABORATION / DDI */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          {/* Tabs bar */}
          <div className="flex border-b border-slate-200 bg-slate-50/70 p-1.5 gap-1.5 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setDetailTab('adr')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                detailTab === 'adr'
                  ? 'bg-white text-teal-900 shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
              <span>บันทึกอาการไม่พึงประสงค์ (ADR)</span>
              <span className="bg-amber-100 text-amber-900 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {selectedPatient.adrRecords.length}
              </span>
            </button>

            <button
              onClick={() => setDetailTab('soap')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                detailTab === 'soap'
                  ? 'bg-white text-teal-900 shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-teal-600" />
              <span>บันทึก SOAP Note (เภสัชกร)</span>
              <span className="bg-teal-100 text-teal-900 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {selectedPatient.soapNotes.length}
              </span>
            </button>

            <button
              onClick={() => setDetailTab('multidisciplinary')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                detailTab === 'multidisciplinary'
                  ? 'bg-white text-teal-900 shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
              <span>ทีมสหสาขาวิชาชีพ (MDT Notes)</span>
              <span className="bg-indigo-100 text-indigo-900 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {selectedPatient.multidisciplinaryNotes.length}
              </span>
            </button>

            <button
              onClick={() => setDetailTab('ddi')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                detailTab === 'ddi'
                  ? 'bg-white text-teal-900 shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <Pill className="w-3.5 h-3.5 text-rose-500" />
              <span>ยาที่ใช้ร่วม & อันตรกิริยา (DDI)</span>
              {matchedDdis.length > 0 && (
                <span className="bg-rose-100 text-rose-800 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {matchedDdis.length} แจ้งเตือน
                </span>
              )}
            </button>
          </div>

          <div className="p-5">
            {/* SUBTAB 1: ADR RECORDS */}
            {detailTab === 'adr' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                      <span>ประวัติอาการไม่พึงประสงค์จากการใช้ยา (ADR & DILI Registry)</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      บันทึกเหตุการณ์แพ้ยา พิษต่อตับ (DILI) ชาปลายมือปลายเท้า หรือผลข้างเคียงอื่นๆ
                    </p>
                  </div>
                  <button
                    onClick={onOpenAdrModal}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ บันทึก ADR ใหม่</span>
                  </button>
                </div>

                {selectedPatient.adrRecords.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs">
                    ไม่พบประวัติอาการไม่พึงประสงค์จากการใช้ยาในผู้ป่วยรายนี้
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedPatient.adrRecords.map(adr => (
                      <div
                        key={adr.id}
                        className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2 hover:shadow-sm transition-all"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-black text-xs text-teal-900 bg-teal-100 px-2 py-0.5 rounded">
                              {adr.drug}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              adr.severity === 'Severe' || adr.severity === 'Life-threatening'
                                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                : adr.severity === 'Moderate'
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-slate-200 text-slate-700'
                            }`}>
                              ระดับ: {adr.severity}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              วันที่เกิดเหตุ: {adr.date}
                            </span>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            adr.status === 'Resolved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {adr.status === 'Resolved' ? 'คลี่คลายแล้ว' : 'กำลังติดตาม'}
                          </span>
                        </div>

                        <p className="text-xs text-slate-800 font-semibold">
                          อาการที่พบ: <span className="font-normal text-slate-700">{adr.reaction}</span>
                        </p>

                        <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs text-slate-700">
                          <strong className="text-teal-900">การจัดการทางคลินิก (Action Taken):</strong> {adr.action}
                        </div>

                        <div className="text-[10px] text-slate-400 text-right">
                          ผู้บันทึก: {adr.reporter}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SUBTAB 2: SOAP NOTES */}
            {detailTab === 'soap' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                      <span>บันทึกการบริบาลทางเภสัชกรรม (Pharmacist Clinical SOAP Notes)</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      บันทึก Subjective, Objective, Assessment และ Plan ตามมาตรฐานวิชาชีพ
                    </p>
                  </div>
                  <button
                    onClick={onOpenSoapModal}
                    className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ เขียน SOAP Note</span>
                  </button>
                </div>

                {selectedPatient.soapNotes.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs">
                    ยังไม่มีบันทึก SOAP Note สำหรับผู้ป่วยรายนี้
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedPatient.soapNotes.map(soap => (
                      <div
                        key={soap.id}
                        className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
                      >
                        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-xs text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded-md">
                              ปัญหา: {soap.problem}
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium">วันที่: {soap.date}</span>
                          </div>
                          <span className="text-[11px] text-slate-600 font-semibold">{soap.author}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                            <span className="font-bold text-teal-800 block text-[11px] uppercase tracking-wider">
                              [S] Subjective:
                            </span>
                            <p className="text-slate-700 leading-relaxed">{soap.subjective || '-'}</p>
                          </div>

                          <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                            <span className="font-bold text-teal-800 block text-[11px] uppercase tracking-wider">
                              [O] Objective:
                            </span>
                            <p className="text-slate-700 leading-relaxed">{soap.objective || '-'}</p>
                          </div>

                          <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1 md:col-span-2">
                            <span className="font-bold text-teal-800 block text-[11px] uppercase tracking-wider">
                              [A] Assessment:
                            </span>
                            <p className="text-slate-700 leading-relaxed">{soap.assessment || '-'}</p>
                          </div>

                          <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-1 md:col-span-2">
                            <span className="font-bold text-emerald-900 block text-[11px] uppercase tracking-wider">
                              [P] Plan:
                            </span>
                            <p className="text-emerald-950 font-medium leading-relaxed whitespace-pre-line">
                              {soap.plan || '-'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SUBTAB 3: MULTIDISCIPLINARY NOTES */}
            {detailTab === 'multidisciplinary' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                    <span>กระดานสื่อสารทีมสหสาขาวิชาชีพ (MDT Collaboration Hub)</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    ประสานงานระหว่างเภสัชกร แพทย์ พยาบาลคลินิกวัณโรค และผู้กำกับการกินยา (DOTs)
                  </p>
                </div>

                {/* New message input */}
                <form onSubmit={handlePostNote} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="พิมพ์ข้อความส่งต่อทีมสหสาขา (เช่น แจ้งผล LFT, นัดหมาย หรือความร่วมมือยา)..."
                    value={newNoteInput}
                    onChange={(e) => setNewNoteInput(e.target.value)}
                    className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer whitespace-nowrap"
                  >
                    ส่งข้อความ
                  </button>
                </form>

                {/* Notes Feed */}
                <div className="space-y-2.5 max-h-[350px] overflow-y-auto">
                  {selectedPatient.multidisciplinaryNotes.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs">
                      ยังไม่มีบันทึกข้อความจากทีมสหสาขาวิชาชีพ
                    </div>
                  ) : (
                    selectedPatient.multidisciplinaryNotes.map(note => {
                      const isPharmacist = note.role === 'Pharmacist' || note.sender.includes('เภสัช');
                      const isPhysician = note.role === 'Physician' || note.sender.includes('พญ') || note.sender.includes('นพ');
                      const isNurse = note.role === 'Nurse' || note.sender.includes('พว');

                      return (
                        <div
                          key={note.id}
                          className="p-3 rounded-xl border border-slate-200 bg-white shadow-xs space-y-1"
                        >
                          <div className="flex justify-between items-center text-xs">
                            <div className="flex items-center gap-2">
                              <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                                isPharmacist
                                  ? 'bg-teal-100 text-teal-900 border border-teal-200'
                                  : isPhysician
                                  ? 'bg-blue-100 text-blue-900 border border-blue-200'
                                  : isNurse
                                  ? 'bg-purple-100 text-purple-900 border border-purple-200'
                                  : 'bg-slate-100 text-slate-800'
                              }`}>
                                {note.sender}
                              </span>
                              <span className="text-[10px] text-slate-400">{note.date}</span>
                            </div>
                          </div>
                          <p className="text-xs text-slate-700 pl-1">{note.text}</p>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* SUBTAB 4: DDI & CONCOMITANT MEDS */}
            {detailTab === 'ddi' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-sm text-slate-800">
                    รายการยาที่ใช้ร่วม & ตรวจสอบปฏิกิริยาระหว่างยา (Drug Interactions)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Rifampicin เป็น Potent CYP3A4 & P-gp Inducer จึงต้องเฝ้าระวังยาที่ทานร่วมอย่างใกล้ชิด
                  </p>
                </div>

                {/* Patient's current meds list */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-600 block mb-2">
                    ยาประจำตัวและยาที่ผู้ป่วยรับประทานร่วม:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {(selectedPatient.concomitantMeds || []).length === 0 ? (
                      <span className="text-xs text-slate-400">ไม่มีข้อมูลยาประจำตัว</span>
                    ) : (
                      (selectedPatient.concomitantMeds || []).map((med, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 shadow-xs flex items-center gap-1.5"
                        >
                          <Pill className="w-3 h-3 text-teal-600" />
                          <span>{med}</span>
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Matched DDI Alerts */}
                {matchedDdis.length === 0 ? (
                  <div className="p-6 text-center text-emerald-800 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                    <span>ไม่พบอันตรกิริยาทางยารุนแรงกับรายการยาที่ระบุในปัจจุบัน</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-rose-700 block">
                      ⚠️ พบข้อควรระวังอันตรกิริยากับยาต้านวัณโรค:
                    </span>
                    {matchedDdis.map((ddi, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/70 text-xs space-y-2"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-black text-rose-950 text-sm">{ddi.drug}</span>
                          <span className="bg-rose-200 text-rose-900 font-bold px-2 py-0.5 rounded text-[10px]">
                            {ddi.severity}
                          </span>
                        </div>
                        <p className="text-slate-800 font-medium">
                          <strong>กลไก:</strong> {ddi.mechanism}
                        </p>
                        <div className="p-2.5 bg-white rounded-lg border border-rose-200 text-rose-950 font-semibold">
                          <strong>คำแนะนำของเภสัชกร:</strong> {ddi.pharmacistRecommendation}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
