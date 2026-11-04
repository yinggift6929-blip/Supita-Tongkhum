import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  Calendar, 
  Printer, 
  Filter, 
  Pill, 
  Award, 
  Clock, 
  ChevronRight, 
  FileSpreadsheet, 
  Activity,
  Heart,
  Search,
  Scale
} from 'lucide-react';
import { Patient, PatientVisit } from '../types/tb';

interface MonthlyDashboardProps {
  patients: Patient[];
  onSelectPatient: (patientId: string) => void;
}

export const MonthlyDashboard: React.FC<MonthlyDashboardProps> = ({
  patients,
  onSelectPatient
}) => {
  // Available month filters (Year 2569 / 2026)
  const monthOptions = [
    { value: '2026-11', label: 'พฤศจิกายน 2569 (เดือนปัจจุบัน)' },
    { value: '2026-10', label: 'ตุลาคม 2569' },
    { value: '2026-09', label: 'กันยายน 2569' },
    { value: '2026-08', label: 'สิงหาคม 2569' },
    { value: 'all', label: 'รวมทั้งปีงบประมาณ 2569 (ทั้งหมด)' }
  ];

  const [selectedMonth, setSelectedMonth] = useState<string>('2026-11');
  const [statusFilter, setStatusFilter] = useState<'all' | 'correct' | 'incorrect'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Extract all visits with patient context
  const allVisitsWithPatient = useMemo(() => {
    const list: Array<{ patient: Patient; visit: PatientVisit }> = [];
    patients.forEach(p => {
      (p.visits || []).forEach(v => {
        list.push({ patient: p, visit: v });
      });
    });
    return list;
  }, [patients]);

  // Filter visits by selected month
  const filteredVisits = useMemo(() => {
    return allVisitsWithPatient.filter(item => {
      if (selectedMonth !== 'all') {
        if (!item.visit.visitDate.startsWith(selectedMonth)) {
          return false;
        }
      }

      if (statusFilter === 'correct' && item.visit.medicationTakingStatus !== 'correct') {
        return false;
      }
      if (statusFilter === 'incorrect' && item.visit.medicationTakingStatus !== 'incorrect') {
        return false;
      }

      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchHn = item.patient.hn.includes(term);
        const matchName = item.patient.name.toLowerCase().includes(term);
        const matchReason = (item.visit.incorrectReason || '').toLowerCase().includes(term);
        if (!matchHn && !matchName && !matchReason) return false;
      }

      return true;
    });
  }, [allVisitsWithPatient, selectedMonth, statusFilter, searchTerm]);

  // Calculate adherence statistics for the selected month
  const stats = useMemo(() => {
    const monthVisits = allVisitsWithPatient.filter(item => {
      if (selectedMonth === 'all') return true;
      return item.visit.visitDate.startsWith(selectedMonth);
    });

    const totalEvaluated = monthVisits.length;
    const correctCount = monthVisits.filter(v => v.visit.medicationTakingStatus === 'correct').length;
    const incorrectCount = monthVisits.filter(v => v.visit.medicationTakingStatus === 'incorrect').length;
    const adherenceRate = totalEvaluated > 0 ? (correctCount / totalEvaluated) * 100 : 0;

    // Total missed doses
    const totalMissedDoses = monthVisits.reduce((sum, v) => sum + (v.visit.missedDosesCount || 0), 0);

    // Reasons breakdown
    const reasonCounts: Record<string, number> = {};
    monthVisits
      .filter(v => v.visit.medicationTakingStatus === 'incorrect')
      .forEach(v => {
        const reason = v.visit.incorrectReason || 'ไม่ระบุสาเหตุ';
        reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
      });

    const sortedReasons = Object.entries(reasonCounts)
      .map(([reason, count]) => ({
        reason,
        count,
        percent: incorrectCount > 0 ? (count / incorrectCount) * 100 : 0
      }))
      .sort((a, b) => b.count - a.count);

    // Patients with low weight (< 50kg) evaluated in this month
    const lowWeightVisits = monthVisits.filter(v => v.visit.weight < 50).length;

    // Clinical HosXP notes updated in this month
    const hosxpNotesCount = patients.filter(p => p.hosxpNotes && p.hosxpNotes.length > 0).length;

    return {
      totalEvaluated,
      correctCount,
      incorrectCount,
      adherenceRate: parseFloat(adherenceRate.toFixed(1)),
      totalMissedDoses,
      sortedReasons,
      lowWeightVisits,
      hosxpNotesCount
    };
  }, [allVisitsWithPatient, selectedMonth, patients]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* TOP BANNER & MONTH FILTER */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-emerald-950 text-white p-6 rounded-3xl shadow-xl border border-teal-800/40 space-y-4">
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-teal-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                โรงพยาบาลเขาชัยสน จ.พัทลุง
              </span>
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                กลุ่มงานเภสัชกรรมและคุ้มครองผู้บริโภค
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-teal-400" />
              <span>Dashboard สรุปผลการดำเนินงานการบริบาลเภสัชกรรมรายเดือน</span>
            </h1>
            <p className="text-xs text-teal-200/80 font-medium max-w-2xl">
              รายงานตัวชี้วัดการติดตามการรับประทานยาของผู้ป่วยวัณโรค (% การกินยาถูกต้อง), สาเหตุการขาดยา, และการบริบาลทางเภสัชกรรมตามเกณฑ์ CPG 2021
            </p>
          </div>

          {/* Month Selector & Print Button */}
          <div className="flex items-center gap-2.5 flex-wrap no-print">
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-1.5 flex items-center gap-2 shadow-inner">
              <Calendar className="w-4 h-4 text-teal-400 ml-2" />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-transparent text-white font-bold text-xs py-1.5 pr-3 focus:outline-none cursor-pointer"
              >
                {monthOptions.map(opt => (
                  <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handlePrint}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-xs font-bold flex items-center gap-2 transition-all border border-white/20 shadow-sm cursor-pointer"
              title="พิมพ์รายงานสรุปผลงานรายเดือน"
            >
              <Printer className="w-4 h-4 text-teal-300" />
              <span>พิมพ์รายงานสรุป</span>
            </button>
          </div>
        </div>

        {/* Selected Month Indicator Ribbon */}
        <div className="pt-2 border-t border-teal-800/60 flex flex-wrap items-center justify-between text-xs text-teal-200/90 gap-2">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>ช่วงเวลาที่ประเมิน: <strong className="text-white font-semibold">{monthOptions.find(m => m.value === selectedMonth)?.label}</strong></span>
          </div>
          <span className="text-[11px] text-teal-300/70">
            * เกณฑ์เป้าหมายกระทรวงสาธารณสุข: อัตราการรับประทานยาถูกต้องสม่ำเสมอ (Adherence) ≥ 90%
          </span>
        </div>
      </div>

      {/* 4 CORE KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: % MEDICATION ADHERENCE RATE (KEY USER REQUIREMENT #2) */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              % รับประทานยาถูกต้อง
            </span>
            <div className={`p-2 rounded-2xl ${
              stats.adherenceRate >= 90
                ? 'bg-emerald-100 text-emerald-800'
                : stats.adherenceRate >= 80
                ? 'bg-amber-100 text-amber-900'
                : 'bg-rose-100 text-rose-900'
            }`}>
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-black font-mono tracking-tight ${
                stats.adherenceRate >= 90
                  ? 'text-emerald-700'
                  : stats.adherenceRate >= 80
                  ? 'text-amber-700'
                  : 'text-rose-700'
              }`}>
                {stats.totalEvaluated > 0 ? `${stats.adherenceRate}%` : 'ไม่มีข้อมูล'}
              </span>
              <span className="text-xs font-bold text-slate-500">
                (เป้าหมาย ≥ 90%)
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden border border-slate-200">
              <div
                className={`h-full transition-all duration-700 ${
                  stats.adherenceRate >= 90
                    ? 'bg-emerald-500'
                    : stats.adherenceRate >= 80
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(stats.adherenceRate, 100)}%` }}
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">สถานะตัวชี้วัด:</span>
            <span className={`font-black px-2 py-0.5 rounded-md ${
              stats.adherenceRate >= 90
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : stats.adherenceRate >= 80
                ? 'bg-amber-50 text-amber-900 border border-amber-200'
                : 'bg-rose-50 text-rose-900 border border-rose-200'
            }`}>
              {stats.adherenceRate >= 90 ? 'ผ่านเกณฑ์มาตรฐาน CPG' : stats.adherenceRate >= 80 ? 'เกือบผ่าน (ต้องกระตุ้น)' : 'ต่ำกว่าเกณฑ์ (เสี่ยงดื้อยา)'}
            </span>
          </div>
        </div>

        {/* KPI 2: TOTAL EVALUATED VISITS */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              จำนวน Visit ที่ประเมิน
            </span>
            <div className="p-2 rounded-2xl bg-teal-100 text-teal-800">
              <Calendar className="w-5 h-5 text-teal-700" />
            </div>
          </div>

          <div>
            <span className="text-3xl font-black text-slate-900 font-mono tracking-tight">
              {stats.totalEvaluated}
            </span>
            <span className="text-xs text-slate-500 ml-1.5 font-bold">ครั้งที่เบิก/จ่ายยา</span>
          </div>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600 flex justify-between">
            <span>กินยาถูกต้อง: <strong className="text-emerald-700 font-mono">{stats.correctCount}</strong> ครั้ง</span>
            <span>ไม่ถูกต้อง: <strong className="text-rose-700 font-mono">{stats.incorrectCount}</strong> ครั้ง</span>
          </div>
        </div>

        {/* KPI 3: NON-ADHERENT / MISSED DOSES */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              จำนวนครั้งที่กินยาไม่ถูกต้อง
            </span>
            <div className="p-2 rounded-2xl bg-rose-100 text-rose-800">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
            </div>
          </div>

          <div>
            <span className="text-3xl font-black text-rose-700 font-mono tracking-tight">
              {stats.incorrectCount}
            </span>
            <span className="text-xs text-slate-500 ml-1.5 font-bold">Visit ({stats.totalEvaluated > 0 ? ((stats.incorrectCount / stats.totalEvaluated) * 100).toFixed(1) : 0}%)</span>
          </div>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600 flex justify-between">
            <span>รวมมื้อที่ลืมกิน:</span>
            <span className="font-bold text-rose-900 font-mono bg-rose-50 px-2 py-0.5 rounded">
              {stats.totalMissedDoses} มื้อ
            </span>
          </div>
        </div>

        {/* KPI 4: CLINICAL INTERVENTIONS & HOSXP CARE */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              การบริบาล HosXP & ขนาดยา
            </span>
            <div className="p-2 rounded-2xl bg-blue-100 text-blue-800">
              <Activity className="w-5 h-5 text-blue-700" />
            </div>
          </div>

          <div>
            <span className="text-3xl font-black text-blue-900 font-mono tracking-tight">
              {stats.hosxpNotesCount}
            </span>
            <span className="text-xs text-slate-500 ml-1.5 font-bold">เคสมีบันทึก HosXP</span>
          </div>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600 flex justify-between">
            <span>BW &lt; 50 kg แยกเม็ด:</span>
            <span className="font-bold text-amber-900 font-mono bg-amber-50 px-2 py-0.5 rounded">
              {stats.lowWeightVisits} ครั้ง
            </span>
          </div>
        </div>
      </div>

      {/* REASONS BREAKDOWN & RECOMMENDATIONS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: CAUSES OF NON-ADHERENCE BREAKDOWN */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>การวิเคราะห์สาเหตุการรับประทานยาไม่ถูกต้อง (Causes of Non-adherence)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                จำแนกตามข้อมูลที่เภสัชกรและพยาบาลบันทึกในแต่ละ Visit เพื่อกำหนดแผนการช่วยเหลือ
              </p>
            </div>
            <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-xl">
              พบ {stats.incorrectCount} ครั้ง
            </span>
          </div>

          {stats.sortedReasons.length === 0 ? (
            <div className="p-8 text-center text-emerald-700 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs space-y-1">
              <CheckCircle2 className="w-7 h-7 mx-auto text-emerald-600 mb-1" />
              <p className="font-bold text-sm">ยอดเยี่ยม! ในช่วงเวลานี้ผู้ป่วยทุกคนรับประทานยาถูกต้อง 100%</p>
              <p className="text-emerald-800 text-[11px]">ไม่พบการขาดยาหรือรับประทานยาผิดวิธี</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.sortedReasons.map((item, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-slate-800 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      <span>{item.reason}</span>
                    </span>
                    <span className="text-slate-700 font-mono">
                      {item.count} ครั้ง ({item.percent.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Clinical Action Tips based on Findings */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-teal-700" />
              <span>แนวทางแก้ไขปัญหาของกลุ่มงานเภสัชกรรม รพ.เขาชัยสน:</span>
            </span>
            <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px] leading-relaxed">
              <li>
                <strong>กรณีลืมทานยาวันหยุด:</strong> แนะนำให้ใช้กล่องจัดยาประจำสัปดาห์ (Weekly Pillbox) และตั้งนาฬิกาปลุกในสมาร์ตโฟน
              </li>
              <li>
                <strong>กรณีหยุดยาเพราะอาการข้างเคียง:</strong> สื่อสารความแตกต่างระหว่างผลข้างเคียงไม่อันตราย (ปัสสาวะสีส้มแดง) กับอาการแพ้ตับอักเสบ (ตาเหลือง คลื่นไส้)
              </li>
              <li>
                <strong>กรณีทานพร้อมอาหาร:</strong> ย้ำเตือนว่า Rifampicin ดูดซึมได้ดีที่สุดเมื่อท้องว่าง (ก่อนอาหาร 1 ชั่วโมง หรือหลังอาหาร 2 ชั่วโมง)
              </li>
            </ul>
          </div>
        </div>

        {/* RIGHT: SUMMARY FOR HOSPITAL PHARMACY & THERAPEUTICS COMMITTEE (PTC) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 rounded-3xl shadow-xl border border-slate-800 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest block">
                คณะกรรมการ PTC / QA
              </span>
              <h3 className="font-bold text-sm text-white">
                สรุปผลงานตามตัวชี้วัดคุณภาพ รพ.เขาชัยสน
              </h3>
            </div>
            <Award className="w-6 h-6 text-amber-400" />
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/80 flex justify-between items-center">
              <div>
                <span className="font-bold block text-slate-200">1. Adherence Rate รวม</span>
                <span className="text-[10px] text-slate-400">เป้าหมายกระทรวง ≥ 90%</span>
              </div>
              <span className={`text-base font-black font-mono ${
                stats.adherenceRate >= 90 ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {stats.adherenceRate}%
              </span>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/80 flex justify-between items-center">
              <div>
                <span className="font-bold block text-slate-200">2. การจัดยาแยกเม็ด BW &lt; 50 kg</span>
                <span className="text-[10px] text-slate-400">เป้าหมาย CPG 2021 = 100%</span>
              </div>
              <span className="text-base font-black font-mono text-emerald-400">
                100% (ป้องกัน DILI)
              </span>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/80 flex justify-between items-center">
              <div>
                <span className="font-bold block text-slate-200">3. การลงบันทึกในระบบ HosXP</span>
                <span className="text-[10px] text-slate-400">ประสานข้อมูลกับเวชระเบียน</span>
              </div>
              <span className="text-base font-black font-mono text-teal-300">
                {stats.hosxpNotesCount} รายการ
              </span>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/80 flex justify-between items-center">
              <div>
                <span className="font-bold block text-slate-200">4. การแจ้งเตือนวันนัดล่วงหน้า</span>
                <span className="text-[10px] text-slate-400">Pop-up หน้าจอเพื่อป้องกันขาดนัด</span>
              </div>
              <span className="text-base font-black font-mono text-emerald-400">
                เปิดใช้งานแล้ว
              </span>
            </div>
          </div>

          <div className="p-3 bg-teal-950/70 border border-teal-500/30 rounded-2xl text-[11px] text-teal-200 leading-relaxed">
            💡 <strong>หมายเหตุทางคลินิก:</strong> ข้อมูลการประเมินการรับประทานยาในแต่ละ Visit จะถูกนำมาประมวลผลทันทีที่เภสัชกรบันทึกจ่ายยาหรือนำเข้าไฟล์เบิกยาจากพยาบาล
          </div>
        </div>
      </div>

      {/* DETAILED VISITS & ADHERENCE LOG TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5">
        <div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
              <span>ตารางประวัติการรับประทานยาและ Visit ประจำเดือน ({filteredVisits.length} รายการ)</span>
            </h3>
            <p className="text-xs text-slate-500">
              รายละเอียดการประเมินการใช้ยาของผู้ป่วยทุกราย เพื่อติดตามการกินยาและวางแผนการดูแลต่อเนื่อง
            </p>
          </div>

          {/* Filters: Search & Status Toggle */}
          <div className="flex items-center gap-2 flex-wrap text-xs no-print">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="ค้นหาชื่อ, HN, สาเหตุ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ทั้งหมด
              </button>
              <button
                onClick={() => setStatusFilter('correct')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  statusFilter === 'correct' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                กินยาถูกต้อง
              </button>
              <button
                onClick={() => setStatusFilter('incorrect')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  statusFilter === 'incorrect' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                กินยาไม่ถูกต้อง
              </button>
            </div>
          </div>
        </div>

        {/* The Visits Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-3">วันที่ Visit</th>
                <th className="p-3">ผู้ป่วย / HN</th>
                <th className="p-3">น้ำหนักตัว</th>
                <th className="p-3">สูตรยา / วัน</th>
                <th className="p-3">ผลการประเมินการกินยา</th>
                <th className="p-3">สาเหตุที่ลืม / ขาดยา</th>
                <th className="p-3">ผู้จ่าย / พยาบาล</th>
                <th className="p-3 text-right no-print">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredVisits.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    ไม่พบข้อมูล Visit ที่ตรงตามเงื่อนไขที่เลือก
                  </td>
                </tr>
              ) : (
                filteredVisits.map((item, idx) => {
                  const isCorrect = item.visit.medicationTakingStatus === 'correct';
                  const isLowW = item.visit.weight < 50;

                  return (
                    <tr
                      key={item.visit.id || idx}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="p-3 font-mono text-slate-700 whitespace-nowrap">
                        {item.visit.visitDate}
                      </td>

                      <td className="p-3">
                        <div className="font-bold text-slate-900">{item.patient.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">HN: {item.patient.hn}</div>
                      </td>

                      <td className="p-3 font-mono">
                        <span className={isLowW ? 'font-bold text-amber-700' : 'text-slate-800'}>
                          {item.visit.weight} kg
                        </span>
                        {isLowW && (
                          <span className="block text-[9px] text-amber-800 font-bold">BW &lt; 50</span>
                        )}
                      </td>

                      <td className="p-3">
                        <div className="font-bold text-teal-950 text-[11px]">{item.visit.regimen}</div>
                        <div className="text-[10px] text-slate-500">จ่าย {item.visit.daysOfSupply} วัน</div>
                      </td>

                      <td className="p-3">
                        {isCorrect ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.8 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>กินยาถูกต้อง 100%</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.8 rounded-full text-[10px] font-black bg-rose-100 text-rose-900 border border-rose-300 animate-pulse">
                            <AlertTriangle className="w-3 h-3 text-rose-600" />
                            <span>กินยาไม่ถูกต้อง</span>
                          </span>
                        )}
                      </td>

                      <td className="p-3 max-w-xs">
                        {!isCorrect ? (
                          <div className="space-y-0.5">
                            <span className="font-bold text-rose-950 block text-[11px]">
                              {item.visit.incorrectReason || 'มีลืมทานยา'}
                            </span>
                            {item.visit.missedDosesCount ? (
                              <span className="text-[10px] text-rose-800 font-medium">
                                ลืมกิน {item.visit.missedDosesCount} มื้อ
                              </span>
                            ) : null}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">- ทานยาครบ -</span>
                        )}
                      </td>

                      <td className="p-3 text-[11px] text-slate-500 whitespace-nowrap">
                        <div>จ่าย: {item.visit.dispensedBy?.split(' ')[0] || 'ภก.คลินิก'}</div>
                        <div className="text-[10px] text-slate-400">เบิก: {item.visit.nurseRequisitionBy?.split(' ')[0] || 'พยาบาล TB'}</div>
                      </td>

                      <td className="p-3 text-right whitespace-nowrap no-print">
                        <button
                          onClick={() => onSelectPatient(item.patient.id)}
                          className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer transition-all"
                        >
                          <span>ดูแฟ้มผู้ป่วย</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
