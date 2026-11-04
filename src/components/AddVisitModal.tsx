import React, { useState } from 'react';
import { 
  X, 
  Pill, 
  Calendar, 
  Scale, 
  Clock, 
  CheckCircle2, 
  User, 
  AlertTriangle 
} from 'lucide-react';
import { Patient, PatientVisit } from '../types/tb';
import { CPG_REGIMENS } from '../data/cpgData';

interface AddVisitModalProps {
  patient: Patient;
  onClose: () => void;
  onSubmit: (patientId: string, visit: PatientVisit) => void;
}

export const AddVisitModal: React.FC<AddVisitModalProps> = ({
  patient,
  onClose,
  onSubmit
}) => {
  const [visitDate, setVisitDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [weight, setWeight] = useState<number>(patient.weight || 50);
  const [regimen, setRegimen] = useState<string>(patient.regimenName || '2(HRZE) / 4(HR)');
  const [daysOfSupply, setDaysOfSupply] = useState<number>(7);
  const [dispenseStatus, setDispenseStatus] = useState<'Pending' | 'Dispensed' | 'Verified'>('Dispensed');
  const [dispensedBy, setDispensedBy] = useState<string>('ภก.วิชัย ชื่นกมล (ภก.คลินิก)');
  const [nurseRequisitionBy, setNurseRequisitionBy] = useState<string>('พว.สมใจ ใจดี (พยาบาล TB)');
  const [itemsText, setItemsText] = useState<string>(() => {
    const cd = patient.customDoses;
    if (cd && cd.mode === 'split') {
      const hTotal = (cd.hTabs ?? 3) * daysOfSupply;
      const rTotal = (cd.rTabs ?? (weight < 50 ? 1 : 2)) * daysOfSupply;
      const zTotal = (cd.zTabs ?? (weight < 50 ? 2 : 3)) * daysOfSupply;
      const eTotal = (cd.eTabs ?? 2) * daysOfSupply;
      const bcoTotal = daysOfSupply * 3; // 1*3 pc
      return `H(100mg) ${hTotal} เม็ด, R ${rTotal} แคปซูล, Z(500mg) ${zTotal} เม็ด, E(400mg) ${eTotal} เม็ด, Vit B co ${bcoTotal} เม็ด (ทาน 1*3 pc)`;
    }
    return weight < 50
      ? `H(300mg) ${daysOfSupply * 3} เม็ด, R(450mg) ${daysOfSupply} แคปซูล, E(600mg) ${daysOfSupply * 2} เม็ด, Vit B co ${daysOfSupply * 3} เม็ด (ทาน 1*3 pc)`
      : `4FDC (Rimstar) ${daysOfSupply * 3} เม็ด (ทานวันละ 3 เม็ด), Vit B co ${daysOfSupply * 3} เม็ด (ทาน 1*3 pc)`;
  });
  
  // Default next appointment date based on daysOfSupply (e.g., today + 7 days)
  const defaultNextDate = () => {
    const d = new Date(visitDate);
    d.setDate(d.getDate() + daysOfSupply);
    return d.toISOString().split('T')[0];
  };

  // Medication adherence tracking (User Request #3)
  const [medicationTakingStatus, setMedicationTakingStatus] = useState<'correct' | 'incorrect'>('correct');
  const [incorrectReason, setIncorrectReason] = useState<string>('ลืมทานยา (เสาร์-อาทิตย์ / วันหยุด)');
  const [customReason, setCustomReason] = useState<string>('');
  const [missedDosesCount, setMissedDosesCount] = useState<number>(0);

  const [nextAppointmentDate, setNextAppointmentDate] = useState<string>(defaultNextDate());
  const [notes, setNotes] = useState<string>('');
  const [sideEffectsNoted, setSideEffectsNoted] = useState<string>('ไม่มีอาการผิดปกติ');

  const handleDaysChange = (days: number) => {
    setDaysOfSupply(days);
    const d = new Date(visitDate);
    d.setDate(d.getDate() + days);
    setNextAppointmentDate(d.toISOString().split('T')[0]);

    // Recalculate itemsText for new days of supply
    const cd = patient.customDoses;
    if (cd && cd.mode === 'split') {
      const hTotal = (cd.hTabs ?? 3) * days;
      const rTotal = (cd.rTabs ?? (weight < 50 ? 1 : 2)) * days;
      const zTotal = (cd.zTabs ?? (weight < 50 ? 2 : 3)) * days;
      const eTotal = (cd.eTabs ?? 2) * days;
      const bcoTotal = days * 3;
      setItemsText(`H(100mg) ${hTotal} เม็ด, R ${rTotal} แคปซูล, Z(500mg) ${zTotal} เม็ด, E(400mg) ${eTotal} เม็ด, Vit B co ${bcoTotal} เม็ด (ทาน 1*3 pc)`);
    } else {
      setItemsText(
        weight < 50
          ? `H(300mg) ${days * 3} เม็ด, R(450mg) ${days} แคปซูล, E(600mg) ${days * 2} เม็ด, Vit B co ${days * 3} เม็ด (ทาน 1*3 pc)`
          : `4FDC (Rimstar) ${days * 3} เม็ด (ทานวันละ 3 เม็ด), Vit B co ${days * 3} เม็ด (ทาน 1*3 pc)`
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalReason = incorrectReason === 'อื่นๆ' ? (customReason.trim() || 'อื่นๆ') : incorrectReason;

    const newVisit: PatientVisit = {
      id: `VISIT-${patient.id}-${Date.now()}`,
      visitDate,
      weight: Number(weight),
      regimen,
      daysOfSupply: Number(daysOfSupply),
      dispenseStatus,
      dispensedBy,
      nurseRequisitionBy,
      dispensedItems: itemsText.split(',').map(item => ({
        drugName: item.trim(),
        quantity: ''
      })),
      nextAppointmentDate,
      notes,
      sideEffectsNoted,
      medicationTakingStatus,
      incorrectReason: medicationTakingStatus === 'incorrect' ? finalReason : undefined,
      missedDosesCount: medicationTakingStatus === 'incorrect' ? Number(missedDosesCount) : 0
    };

    onSubmit(patient.id, newVisit);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-teal-700" />
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                บันทึกการเบิก/จ่ายยา (Record Patient Visit)
              </h3>
              <span className="text-xs text-slate-500">
                ผู้ป่วย: <strong className="text-teal-900">{patient.name}</strong> (HN: {patient.hn})
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">วันที่มารับยา / วันที่เบิก</label>
              <input
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                น้ำหนักตัวที่ชั่งได้ (kg)
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                  required
                />
                <span className="font-bold text-slate-500">kg</span>
              </div>
            </div>
          </div>

          {weight < 50 && (
            <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-xl text-amber-950 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>น้ำหนักตัว &lt; 50 kg แนะนำจัดยาแยกเม็ดตามน้ำหนักตัวจริง (ห้ามใช้ 4FDC 4 เม็ด)</span>
            </div>
          )}

          <div>
            <label className="font-bold text-slate-700 block mb-1">สูตรยาประจำ Visit นี้</label>
            <input
              type="text"
              value={regimen}
              onChange={(e) => setRegimen(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-teal-950"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">จำนวนวันที่จ่ายยา</label>
              <div className="flex gap-1.5">
                {[7, 14, 21, 28].map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => handleDaysChange(d)}
                    className={`flex-1 py-1.5 rounded-lg font-bold border transition-all cursor-pointer ${
                      daysOfSupply === d
                        ? 'bg-teal-700 text-white border-teal-700'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {d} วัน
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">สถานะการจ่ายยา</label>
              <select
                value={dispenseStatus}
                onChange={(e) => setDispenseStatus(e.target.value as any)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
              >
                <option value="Dispensed">จ่ายยาแล้ว (Dispensed)</option>
                <option value="Verified">เภสัชกรตรวจสอบแล้ว (Verified)</option>
                <option value="Pending">รอจ่ายยา (Pending Requisition)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">รายการยาและจำนวนเม็ดที่จ่าย</label>
            <input
              type="text"
              placeholder="เช่น 4FDC 21 เม็ด, Vit B6 7 เม็ด..."
              value={itemsText}
              onChange={(e) => setItemsText(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            />
          </div>

          {/* 🎯 MEDICATION ADHERENCE ASSESSMENT (USER REQUEST #3) */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="font-extrabold text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className={`w-4 h-4 ${medicationTakingStatus === 'correct' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>การประเมินการรับประทานยา (รอบที่ผ่านมา)</span>
              </label>
              <span className="text-[10px] text-slate-500 font-medium">บันทึกเพื่อสรุป Dashboard รายเดือน</span>
            </div>

            {/* Toggle Buttons: กินยาถูกต้อง vs กินยาไม่ถูกต้อง */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMedicationTakingStatus('correct')}
                className={`p-2.5 rounded-xl border text-left font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  medicationTakingStatus === 'correct'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-sm ring-2 ring-emerald-400/30'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                  medicationTakingStatus === 'correct' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
                }`}>
                  {medicationTakingStatus === 'correct' && <span className="text-[10px]">✓</span>}
                </div>
                <div>
                  <span className="block text-xs">กินยาถูกต้อง ครบถ้วน</span>
                  <span className="block text-[10px] font-normal text-emerald-700">ตรงเวลา ทานตอนท้องว่าง ครบทุกมื้อ</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMedicationTakingStatus('incorrect')}
                className={`p-2.5 rounded-xl border text-left font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  medicationTakingStatus === 'incorrect'
                    ? 'bg-rose-50 border-rose-500 text-rose-950 shadow-sm ring-2 ring-rose-400/30'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                  medicationTakingStatus === 'incorrect' ? 'border-rose-600 bg-rose-600 text-white' : 'border-slate-300'
                }`}>
                  {medicationTakingStatus === 'incorrect' && <span className="text-[10px]">!</span>}
                </div>
                <div>
                  <span className="block text-xs">กินยาไม่ถูกต้อง / ลืมกิน</span>
                  <span className="block text-[10px] font-normal text-rose-700">มีมื้อที่ลืมกิน หรือกินผิดวิธี</span>
                </div>
              </button>
            </div>

            {/* Reasons dropdown if incorrect */}
            {medicationTakingStatus === 'incorrect' && (
              <div className="p-3 bg-white rounded-xl border border-rose-200 space-y-2.5 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      สาเหตุหลักที่รับประทานยาไม่ถูกต้อง:
                    </label>
                    <select
                      value={incorrectReason}
                      onChange={(e) => setIncorrectReason(e.target.value)}
                      className="w-full p-2 bg-rose-50/50 border border-rose-300 rounded-lg text-slate-800 font-medium text-xs focus:ring-2 focus:ring-rose-400"
                    >
                      <option value="ลืมทานยา (เสาร์-อาทิตย์ / วันหยุด)">ลืมทานยา (เสาร์-อาทิตย์ / วันหยุด)</option>
                      <option value="หยุดยาเองจากอาการข้างเคียง (คลื่นไส้/เวียนศีรษะ/คัน)">หยุดยาเองจากอาการข้างเคียง (คลื่นไส้/เวียนศีรษะ/คัน)</option>
                      <option value="รับประทานยาผิดเวลา / ทานพร้อมอาหาร">รับประทานยาผิดเวลา / ทานพร้อมอาหาร (ดูดซึมลดลง)</option>
                      <option value="รับประทานยาไม่ครบทุกเม็ด (กลืนยายาก/เม็ดใหญ่)">รับประทานยาไม่ครบทุกเม็ด (กลืนยายาก/เม็ดใหญ่)</option>
                      <option value="หยุดยาเพราะรู้สึกอาการดีขึ้นแล้ว">หยุดยาเพราะรู้สึกอาการดีขึ้นแล้ว</option>
                      <option value="ไปต่างจังหวัด / ยาหมดก่อนวันนัด">ไปต่างจังหวัด / ยาหมดก่อนวันนัด</option>
                      <option value="ซื้อยาสมุนไพร / ยาหม้อ / ยาลูกกลอนมาร่วม">ซื้อยาสมุนไพร / ยาหม้อ / ยาลูกกลอนมาร่วม</option>
                      <option value="อื่นๆ">อื่นๆ (โปรดระบุ)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      จำนวนมื้อที่ลืมกิน / ขาดยา (มื้อ):
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        max="60"
                        value={missedDosesCount}
                        onChange={(e) => setMissedDosesCount(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full p-2 bg-rose-50/50 border border-rose-300 rounded-lg text-slate-800 font-bold text-xs"
                      />
                      <span className="font-bold text-slate-600">มื้อ</span>
                    </div>
                  </div>
                </div>

                {incorrectReason === 'อื่นๆ' && (
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">ระบุรายละเอียดสาเหตุอื่นๆ:</label>
                    <input
                      type="text"
                      placeholder="เช่น ผู้ป่วยหลับเลยเวลา, ติดงานศพ..."
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* NEXT APPOINTMENT DATE */}
          <div className="p-3.5 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl border border-teal-200 space-y-1.5">
            <label className="font-extrabold text-teal-950 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-teal-700" />
              <span>วันนัดติดตามครั้งต่อไป (Next Appointment Date)</span>
            </label>
            <input
              type="date"
              value={nextAppointmentDate}
              onChange={(e) => setNextAppointmentDate(e.target.value)}
              className="w-full p-2 bg-white border border-teal-300 rounded-xl font-bold text-slate-800"
              required
            />
            <span className="text-[10px] text-teal-800 block">
              * ข้อมูลนี้จะปรากฏใน Pop-up แจ้งเตือนวันนัดของระบบอัตโนมัติ
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">พยาบาลผู้ส่งใบเบิก</label>
              <input
                type="text"
                value={nurseRequisitionBy}
                onChange={(e) => setNurseRequisitionBy(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">เภสัชกรผู้จ่ายยา</label>
              <input
                type="text"
                value={dispensedBy}
                onChange={(e) => setDispensedBy(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">อาการข้างเคียงหรือบันทึกประจำ Visit</label>
            <input
              type="text"
              placeholder="เช่น ทานยาครบ ไม่มีตาเหลือง, ปัสสาวะสีส้มแดงปกติ..."
              value={sideEffectsNoted}
              onChange={(e) => setSideEffectsNoted(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            />
          </div>

          <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl shadow-md cursor-pointer"
            >
              บันทึกประวัติ Visit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
