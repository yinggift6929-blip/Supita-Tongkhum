import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Clock, 
  HelpCircle, 
  Check, 
  RefreshCw,
  FileCheck,
  Stethoscope
} from 'lucide-react';
import { Patient } from '../types/tb';
import { RECHALLENGE_STEPS } from '../data/cpgData';

interface RechallengeManagerProps {
  patients: Patient[];
  selectedPatientId: string;
  onUpdatePatientRechallenge: (patientId: string, status: any) => void;
}

export const RechallengeManager: React.FC<RechallengeManagerProps> = ({
  patients,
  selectedPatientId,
  onUpdatePatientRechallenge
}) => {
  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  // Interactive LFT Checker State
  const [astInput, setAstInput] = useState<number>(selectedPatient.lft?.ast || 32);
  const [altInput, setAltInput] = useState<number>(selectedPatient.lft?.alt || 28);
  const [tbiliInput, setTbiliInput] = useState<number>(selectedPatient.lft?.tbili || 0.8);
  const [hasSymptoms, setHasSymptoms] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(selectedPatient.rechallengeStatus?.currentStep || 2);
  const [hPassed, setHPassed] = useState<boolean>(selectedPatient.rechallengeStatus?.hPassed ?? true);
  const [rPassed, setRPassed] = useState<boolean>(selectedPatient.rechallengeStatus?.rPassed ?? false);
  const [zPassed, setZPassed] = useState<boolean>(selectedPatient.rechallengeStatus?.zPassed ?? false);

  // Upper Normal Limits (UNL) approx: AST ~ 40, ALT ~ 40, TBili ~ 1.2
  const unlAst = 40;
  const unlAlt = 40;
  const astTimes = (astInput / unlAst).toFixed(1);
  const altTimes = (altInput / unlAlt).toFixed(1);

  // DILI Criteria Evaluation according to CPG 2021
  const isDili = (
    (parseFloat(astTimes) >= 5 || parseFloat(altTimes) >= 5) ||
    ((parseFloat(astTimes) >= 3 || parseFloat(altTimes) >= 3) && hasSymptoms) ||
    tbiliInput >= 2.0
  );

  const isSafeToRechallenge = (
    parseFloat(astTimes) < 2 &&
    parseFloat(altTimes) < 2 &&
    tbiliInput < 1.5
  );

  const handleSaveStepToPatient = (stepNum: number) => {
    setActiveStep(stepNum);
    onUpdatePatientRechallenge(selectedPatient.id, {
      active: true,
      currentStep: stepNum,
      hPassed,
      rPassed,
      zPassed,
      notes: `อัปเดตขั้นตอน Re-challenge เป็น Step ${stepNum} (H: ${hPassed ? 'ผ่าน' : 'รอ/ไม่ผ่าน'}, R: ${rPassed ? 'ผ่าน' : 'รอ/ไม่ผ่าน'}, Z: ${zPassed ? 'ผ่าน' : 'งดเว้น'})`
    });
  };

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white p-5 rounded-2xl shadow-xl border border-amber-800/40 space-y-2">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-amber-500 text-slate-950 rounded-2xl flex items-center justify-center font-black shadow-md">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white">
                  แนวทางการจัดการการเกิดพิษต่อตับ (DILI) & การให้ยาซ้ำ (Re-challenge Protocol)
                </h2>
                <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full uppercase">
                  CPG 2021 บทที่ 5
                </span>
              </div>
              <p className="text-xs text-amber-200/80 font-medium">
                เกณฑ์วินิจฉัย DILI, การรอให้ตับฟื้นตัว, และลำดับขั้นตอนการทดสอบยาซ้ำอย่างปลอดภัย
              </p>
            </div>
          </div>

          <div className="text-xs bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-slate-700 text-slate-300">
            ผู้ป่วยที่เลือก: <strong className="text-amber-300">{selectedPatient.name}</strong> ({selectedPatient.hn})
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: INTERACTIVE LFT EVALUATOR & DILI STAGING */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-600" />
                <span>ประเมินผลการทำงานของตับ (LFT Evaluator)</span>
              </h3>
              <span className="text-[10px] text-slate-400">UNL: AST/ALT ~ 40 U/L</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">AST (SGOT) (U/L)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={astInput}
                    onChange={(e) => setAstInput(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="text-slate-500 font-mono text-[11px] whitespace-nowrap">
                    ({astTimes}x UNL)
                  </span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">ALT (SGPT) (U/L)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={altInput}
                    onChange={(e) => setAltInput(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="text-slate-500 font-mono text-[11px] whitespace-nowrap">
                    ({altTimes}x UNL)
                  </span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Total Bilirubin (mg/dL)</label>
                <input
                  type="number"
                  step="0.1"
                  value={tbiliInput}
                  onChange={(e) => setTbiliInput(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 font-bold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasSymptoms}
                    onChange={(e) => setHasSymptoms(e.target.checked)}
                    className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
                  />
                  <span>มีอาการทางคลินิก (คลื่นไส้ อาเจียน ปวดท้อง ตัวเหลือง ตาเหลือง อ่อนเพลีย)</span>
                </label>
              </div>
            </div>

            {/* Evaluation Result Card */}
            <div className={`p-4 rounded-2xl border text-xs space-y-2 ${
              isDili 
                ? 'bg-rose-50 border-rose-300 text-rose-950'
                : isSafeToRechallenge
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-amber-50 border-amber-300 text-amber-950'
            }`}>
              <div className="flex items-center gap-2 font-black text-sm">
                {isDili ? (
                  <>
                    <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>⚠️ เข้าเกณฑ์ภาวะตับอักเสบจากยา (Active DILI)</span>
                  </>
                ) : isSafeToRechallenge ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>✅ ค่าตับกลับสู่เกณฑ์ปลอดภัย (พร้อมเริ่ม Re-challenge)</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                    <span>⏳ อยู่ระหว่างรอให้ตับฟื้นตัว (Washout Phase)</span>
                  </>
                )}
              </div>

              <p className="leading-relaxed font-medium">
                {isDili
                  ? 'เข้าเกณฑ์ข้อใดข้อหนึ่งตาม CPG 2021: AST/ALT ≥ 5x UNL หรือ ≥ 3x UNL ร่วมกับมีอาการ หรือ Total Bilirubin ≥ 2.0 mg/dL ให้ "หยุดยาทั้งหมดทันที" และติดตาม LFT ทุกสัปดาห์'
                  : isSafeToRechallenge
                  ? 'ค่า AST/ALT < 2x UNL และ Total Bilirubin < 1.5 mg/dL ตามเกณฑ์ CPG 2021 สามารถเริ่ม Re-challenge ยาตัวแรก (Isoniazid) ได้'
                  : 'เอนไซม์ตับยังคงสูงกว่า 2x UNL หรือ Bilirubin ≥ 1.5 mg/dL แนะนำให้ "คงการหยุดยาไว้ก่อน" และเจาะ LFT ซ้ำในอีก 1 สัปดาห์ หากวัณโรครุนแรงพิจารณาให้ Non-hepatotoxic bridge regimen'}
              </p>
            </div>

            {/* Safe Alternative Regimens Cheat Sheet */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
              <span className="font-extrabold text-slate-800 block">
                สูตรยาทางเลือกตามระดับความปลอดภัยต่อตับ (CPG 2021):
              </span>
              <div className="space-y-1.5 font-medium text-slate-700">
                <div className="p-2 bg-white rounded-lg border border-slate-200">
                  <strong className="text-teal-900">2HRE / 7HR (9 เดือน):</strong> ปลอดภัยปานกลาง หลีกเลี่ยง Pyrazinamide (Z) ซึ่งเป็นตัวการ DILI สูงสุด
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-200">
                  <strong className="text-amber-900">12-18 HE + Lfx (12-18 เดือน):</strong> ปลอดภัยสูง หลีกเลี่ยงทั้ง R และ Z (มีพิษต่อตับเพียง H ตัวเดียว)
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-200">
                  <strong className="text-rose-900">18-24 E + Lfx + Cfz + Amk (18-24 เดือน):</strong> ปลอดพิษต่อตับ 100% (Non-hepatotoxic) สำหรับตับวายขั้นวิกฤต
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: STEP-BY-STEP RECHALLENGE TRACKER */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-teal-600" />
                  <span>แผนภูมิขั้นตอนการ Re-challenge ตามแนวทาง CPG 2021</span>
                </h3>
                <p className="text-xs text-slate-500">
                  ลำดับการทดสอบยา: เริ่ม H -&gt; ตามด้วย R -&gt; ประเมิน Z (งดเว้นหาก DILI รุนแรง)
                </p>
              </div>

              <span className="text-xs bg-amber-100 text-amber-900 font-black px-2.5 py-1 rounded-xl">
                ขั้นตอนปัจจุบัน: Step {activeStep}
              </span>
            </div>

            {/* Steps Visual Tracker */}
            <div className="space-y-3">
              {RECHALLENGE_STEPS.map((s) => {
                const isCurrent = activeStep === s.step;
                const isPassed = activeStep > s.step;

                return (
                  <div
                    key={s.step}
                    className={`p-4 rounded-2xl border transition-all ${
                      isCurrent
                        ? 'bg-amber-50/90 border-amber-400 shadow-sm ring-1 ring-amber-400'
                        : isPassed
                        ? 'bg-slate-50/80 border-emerald-300'
                        : 'bg-white border-slate-200 opacity-70'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${
                          isPassed
                            ? 'bg-emerald-600 text-white'
                            : isCurrent
                            ? 'bg-amber-500 text-slate-950 font-black'
                            : 'bg-slate-200 text-slate-600'
                        }`}>
                          {isPassed ? <Check className="w-4 h-4" /> : s.step}
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-black text-xs text-slate-900">{s.title}</h4>
                          <p className="text-xs text-slate-700 leading-relaxed font-medium">{s.text}</p>
                          <div className="p-2 bg-white/90 rounded-lg border border-slate-200/90 text-[11px] text-slate-600">
                            <strong className="text-teal-900">เกณฑ์ประเมิน:</strong> {s.target}
                          </div>
                          <div className="text-[11px] text-amber-900 font-medium">
                            💡 <strong>ข้อควรปฏิบัติ:</strong> {s.actionNote}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSaveStepToPatient(s.step)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-amber-500 text-slate-950 hover:bg-amber-600 font-black shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                        }`}
                      >
                        {isCurrent ? 'กำลังดำเนินการ' : `เลือกขั้นตอนนี้`}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Toggle Drug Passed Checklist */}
            <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-2xl text-xs space-y-2">
              <span className="font-bold text-teal-950 block">
                สรุปผลการทดสอบยา Re-challenge ในผู้ป่วยรายนี้ ({selectedPatient.name}):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <label className="p-2.5 bg-white rounded-xl border border-teal-200 flex items-center gap-2 font-bold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hPassed}
                    onChange={(e) => setHPassed(e.target.checked)}
                    className="w-4 h-4 accent-teal-600 rounded"
                  />
                  <span>Isoniazid (H): {hPassed ? '✅ ผ่าน' : '❌ ไม่ผ่าน/รอ'}</span>
                </label>

                <label className="p-2.5 bg-white rounded-xl border border-teal-200 flex items-center gap-2 font-bold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rPassed}
                    onChange={(e) => setRPassed(e.target.checked)}
                    className="w-4 h-4 accent-teal-600 rounded"
                  />
                  <span>Rifampicin (R): {rPassed ? '✅ ผ่าน' : '❌ ไม่ผ่าน/รอ'}</span>
                </label>

                <label className="p-2.5 bg-white rounded-xl border border-teal-200 flex items-center gap-2 font-bold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={zPassed}
                    onChange={(e) => setZPassed(e.target.checked)}
                    className="w-4 h-4 accent-teal-600 rounded"
                  />
                  <span>Pyrazinamide (Z): {zPassed ? '✅ ผ่าน' : '🚫 งดเว้นถาวร'}</span>
                </label>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => handleSaveStepToPatient(activeStep)}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  บันทึกสถานะ Re-challenge ลงเวชระเบียนผู้ป่วย
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
