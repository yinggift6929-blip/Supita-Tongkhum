import React, { useState } from 'react';
import { 
  Calculator, 
  Scale, 
  AlertCircle, 
  CheckCircle2, 
  Copy, 
  Check, 
  Pill, 
  HeartPulse, 
  ShieldAlert, 
  Info,
  Clock,
  Sparkles
} from 'lucide-react';
import { calculateCrCl, calculateFirstLineDoses, getFdcRecommendation } from '../utils/tbCalculations';
import { FIRST_LINE_DRUGS, FDC_BANDS } from '../data/cpgData';

export const DosingCalculator: React.FC = () => {
  const [weight, setWeight] = useState<number>(45);
  const [height, setHeight] = useState<number>(155);
  const [age, setAge] = useState<number>(45);
  const [gender, setGender] = useState<'ชาย' | 'หญิง'>('หญิง');
  const [scr, setScr] = useState<number>(0.8);
  const [calcMode, setCalcMode] = useState<'split' | 'fdc' | 'secondline'>('split');
  const [copied, setCopied] = useState<boolean>(false);

  // Calculations
  const bmi = height > 0 ? (weight / Math.pow(height / 100, 2)).toFixed(1) : '0';
  const crcl = calculateCrCl(age, weight, scr, gender);
  const isRenalFailure = crcl < 30;
  const isLowWeight = weight < 50;

  const firstLineCalculated = calculateFirstLineDoses(weight, crcl);
  const fdcRec = getFdcRecommendation(weight);

  // Quick weight presets
  const handlePresetWeight = (w: number) => {
    setWeight(w);
  };

  const getPrescriptionText = () => {
    if (calcMode === 'split') {
      const lines = firstLineCalculated.map(d => `- ${d.drugName}: ${d.tabletDispenseThai}`);
      lines.push('- Pyridoxine (Vitamin B6) 50 mg: 1 เม็ด วันละ 1 ครั้ง ตอนเช้า');
      return `[แผนการสั่งยาวัณโรค (แยกเม็ด) CPG 2021]\nผู้ป่วย: ${gender} อายุ ${age} ปี น้ำหนัก ${weight} kg (CrCl: ${crcl} mL/min)\n${lines.join('\n')}`;
    } else if (calcMode === 'fdc') {
      return `[แผนการสั่งยาวัณโรค (สูตรเม็ดรวม FDC) CPG 2021]\nผู้ป่วยน้ำหนัก ${weight} kg\n- 4FDC (HRZE): รับประทาน ${fdcRec.tabs4FDC} ก่อนอาหารเช้า (ใน 2 เดือนแรก)\n- 2FDC (HR): รับประทาน ${fdcRec.tabs2FDC} ก่อนอาหารเช้า (ใน 4 เดือนหลัง)\n- Pyridoxine (Vitamin B6) 50 mg วันละ 1 เม็ด`;
    } else {
      return `[คำแนะนำขนาดยา Second-line / DR-TB CPG 2021]\n- Bedaquiline: 400 mg OD (2 wk) แล้ว 200 mg 3x/wk (22 wk) พร้อมอาหาร\n- Levofloxacin: 750-1000 mg OD\n- Linezolid: 600 mg OD (ติดตาม CBC ทุก 2 สัปดาห์)\n- Clofazimine: 100 mg OD`;
    }
  };

  const handleCopyPrescription = () => {
    navigator.clipboard.writeText(getPrescriptionText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* HEADER TITLE */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-teal-700" />
              <span>เครื่องคำนวณขนาดยาวัณโรค CPG 2021 (Interactive TB Dosing Calculator)</span>
            </h2>
            <span className="bg-teal-100 text-teal-900 font-black text-[10px] px-2 py-0.5 rounded-full">
              อ้างอิงตาราง 3.1 & 3.2
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            คำนวณขนาดยาตามน้ำหนักตัวจริง (mg/kg/day), ประเมินการทำงานของไต (CrCl Cockcroft-Gault), และเทียบสูตร FDC
          </p>
        </div>

        <button
          onClick={handleCopyPrescription}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400">คัดลอกลง Clipboard แล้ว!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-teal-300" />
              <span>คัดลอกคำสั่งใช้ยา (Order Text)</span>
            </>
          )}
        </button>
      </div>

      {/* INPUT PANEL & PATIENT PARAMETERS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Scale className="w-4 h-4 text-teal-600" />
              <span>ข้อมูลกายวิภาคและค่าชีวเคมีของผู้ป่วย</span>
            </h3>

            {/* Weight Quick Buttons */}
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                เลือกค่าน้ำหนักตัวด่วน (Quick Presets)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[38.6, 42, 48, 52, 60, 68, 75].map((w) => (
                  <button
                    key={w}
                    onClick={() => handlePresetWeight(w)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      weight === w
                        ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {w} kg
                  </button>
                ))}
              </div>
            </div>

            {/* Weight Slider & Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-slate-700 flex items-center gap-1.5">
                  <span>น้ำหนักตัว (Body Weight):</span>
                  {isLowWeight && (
                    <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-bold">
                      &lt; 50 kg (แยกเม็ด)
                    </span>
                  )}
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.1"
                    min="20"
                    max="150"
                    value={weight}
                    onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                    className="w-20 p-1.5 text-center text-sm font-black bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <span className="font-bold text-slate-500">kg</span>
                </div>
              </div>
              <input
                type="range"
                min="25"
                max="100"
                step="0.5"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value))}
                className="w-full accent-teal-700 cursor-pointer"
              />
            </div>

            {/* Height & BMI */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">ส่วนสูง (cm)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">ดัชนีมวลกาย (BMI)</label>
                <div className="p-2 bg-teal-50 border border-teal-200 rounded-xl text-teal-950 font-black text-center">
                  {bmi} kg/m²
                </div>
              </div>
            </div>

            {/* Age, Gender & Serum Creatinine */}
            <div className="grid grid-cols-3 gap-2.5 text-xs pt-2 border-t border-slate-100">
              <div>
                <label className="font-bold text-slate-700 block mb-1">อายุ (ปี)</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">เพศ</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold"
                >
                  <option value="ชาย">ชาย</option>
                  <option value="หญิง">หญิง</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">SCr (mg/dL)</label>
                <input
                  type="number"
                  step="0.05"
                  value={scr}
                  onChange={(e) => setScr(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold"
                />
              </div>
            </div>

            {/* Renal Function Calculated Box */}
            <div className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
              isRenalFailure 
                ? 'bg-rose-50 border-rose-300 text-rose-950' 
                : 'bg-emerald-50 border-emerald-300 text-emerald-950'
            }`}>
              <div className="flex items-center gap-2.5">
                <HeartPulse className={`w-5 h-5 ${isRenalFailure ? 'text-rose-600' : 'text-emerald-600'}`} />
                <div>
                  <span className="font-bold block">
                    การทำงานของไต (Cockcroft-Gault CrCl):
                  </span>
                  <span className="text-[11px] opacity-80">
                    {isRenalFailure ? '⚠️ ไตวายรุนแรง (CrCl < 30 mL/min) ต้องปรับขนาดยา' : 'การทำงานของไตปกติ/ปานกลาง'}
                  </span>
                </div>
              </div>
              <span className="text-base font-black font-mono">
                {crcl} <span className="text-xs font-normal">mL/min</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Dosage Results & Guidance */}
        <div className="lg:col-span-7 space-y-4">
          {/* Mode Switcher */}
          <div className="bg-slate-200/80 p-1 rounded-2xl flex gap-1 text-xs font-bold">
            <button
              onClick={() => setCalcMode('split')}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                calcMode === 'split' ? 'bg-white text-teal-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Pill className="w-3.5 h-3.5 text-teal-600" />
              <span>คำนวณแยกเม็ด (BW &lt; 50 kg / ปรับขนาดยา)</span>
            </button>

            <button
              onClick={() => setCalcMode('fdc')}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                calcMode === 'fdc' ? 'bg-white text-teal-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Scale className="w-3.5 h-3.5 text-teal-600" />
              <span>สูตรเม็ดรวม FDC (4FDC / 2FDC)</span>
            </button>

            <button
              onClick={() => setCalcMode('secondline')}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                calcMode === 'secondline' ? 'bg-white text-teal-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-purple-600" />
              <span>ยาวัณโรคดื้อยา (Second-Line)</span>
            </button>
          </div>

          {/* MODE 1: SEPARATE TABLETS CALCULATION */}
          {calcMode === 'split' && (
            <div className="space-y-4">
              {isLowWeight && (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-2xl text-xs text-amber-950 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">เน้นย้ำตาม CPG 2021:</strong>{' '}
                    ผู้ป่วยน้ำหนักตัว &lt; 50 กก. ({weight} kg) ควรคำนวณแยกเม็ดอย่างเคร่งครัด
                    เพื่อป้องกันการเกิดภาวะพิษต่อตับ (Hepatotoxicity) จากยา Pyrazinamide และพิษต่อเส้นประสาทตาจาก Ethambutol
                  </div>
                </div>
              )}

              {isRenalFailure && (
                <div className="p-3 bg-rose-50 border border-rose-300 rounded-2xl text-xs text-rose-950 flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">⚠️ ไตวายรุนแรง (CrCl {crcl} mL/min):</strong>{' '}
                    ยา Pyrazinamide (Z) และ Ethambutol (E) ต้องปรับลดความถี่เป็น <strong>สัปดาห์ละ 3 ครั้ง</strong> (จันทร์-พุธ-ศุกร์ ให้หลังการฟอกเลือด) ห้ามให้ทุกวันเด็ดขาด!
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {firstLineCalculated.map((dose) => (
                  <div
                    key={dose.code}
                    className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-2 hover:border-teal-300 transition-all"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-xl bg-teal-100 text-teal-900 font-black flex items-center justify-center text-xs">
                          {dose.code}
                        </span>
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900">{dose.drugName}</h4>
                          <span className="text-[11px] text-slate-500 font-medium">
                            เกณฑ์ CPG: {dose.mgPerKgDay} mg/kg/day (คำนวณตามจริง: {dose.calculatedMg} mg/day)
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-slate-400 block">ขนาดแนะนำ</span>
                        <span className="text-sm font-black text-teal-800 font-mono">
                          {dose.recommendedMg} mg/day
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      <strong className="text-teal-950 font-bold block mb-0.5">การจัดยา / วิธีรับประทาน:</strong>
                      <span className="text-slate-800 font-semibold">{dose.tabletDispenseThai}</span>
                    </div>

                    <div className="text-[11px] text-slate-600 flex items-start gap-1.5 pt-1">
                      <Info className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                      <span>{dose.specialWarning}</span>
                    </div>
                  </div>
                ))}

                {/* Vit B co (ทดแทน Vit B6 ตามคลังยา รพ.เขาชัยสน) */}
                <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">วิตามินเสริมเสมอ (รพ.เขาชัยสน):</strong> Vit B co (Vitamin B Complex) รับประทานครั้งละ 1 เม็ด วันละ 3 ครั้ง หลังอาหาร (1*3 pc รวม 3 เม็ด/วัน) ทดแทน Vit B6 ตามคลังยา เพื่อป้องกันอาการปลายประสาทอักเสบจากยา Isoniazid (INH)
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MODE 2: FDC BAND CALCULATION */}
          {calcMode === 'fdc' && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">
                  สูตรยาเม็ดรวม Fixed-Dose Combination (FDC) ตามช่วงน้ำหนักตัว
                </h4>
                <p className="text-xs text-slate-500">
                  อ้างอิงตารางที่ 3.1 แนวทางการควบคุมวัณโรคประเทศไทย พ.ศ. 2564
                </p>
              </div>

              {/* Recommended for current weight */}
              <div className={`p-4 rounded-2xl border ${
                fdcRec.isWarning ? 'bg-amber-50 border-amber-300 text-amber-950' : 'bg-teal-50 border-teal-300 text-teal-950'
              }`}>
                <span className="text-[11px] font-black uppercase tracking-wider block mb-1">
                  คำแนะนำสำหรับน้ำหนัก {weight} kg:
                </span>
                <div className="grid grid-cols-2 gap-3 my-2">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block font-bold">ระยะเข้มข้น 2 เดือนแรก (4FDC)</span>
                    <span className="text-base font-black text-teal-900 font-mono">{fdcRec.tabs4FDC}</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block font-bold">ระยะสมาน 4 เดือนหลัง (2FDC)</span>
                    <span className="text-base font-black text-teal-900 font-mono">{fdcRec.tabs2FDC}</span>
                  </div>
                </div>
                <p className="text-xs font-medium">{fdcRec.guidance}</p>
              </div>

              {/* Reference Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">ช่วงน้ำหนักตัว (kg)</th>
                      <th className="p-2.5">ระยะเข้มข้น (4FDC)</th>
                      <th className="p-2.5">ระยะสมาน (2FDC)</th>
                      <th className="p-2.5">ข้อแนะนำ CPG</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {FDC_BANDS.map((band, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2.5 font-bold font-mono text-slate-900">{band.range}</td>
                        <td className="p-2.5 font-bold text-teal-800">{band.tabs4FDC}</td>
                        <td className="p-2.5 font-bold text-emerald-800">{band.tabs2FDC}</td>
                        <td className="p-2.5 text-slate-500 text-[11px]">{band.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MODE 3: SECOND-LINE / DR-TB CALCULATION */}
          {calcMode === 'secondline' && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">
                  ขนาดยาวัณโรคดื้อยา (DR-TB / Second-Line Dosing Guidelines)
                </h4>
                <p className="text-xs text-slate-500">
                  สูตรสั้น All-Oral Bdq Regimen และ WHO Group A, B, C (CPG 2021 บทที่ 6)
                </p>
              </div>

              <div className="space-y-3 text-xs">
                {/* Bedaquiline */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-sm text-purple-950">Bedaquiline (Bdq - 100 mg เม็ด)</span>
                    <span className="bg-purple-100 text-purple-900 font-bold px-2 py-0.5 rounded text-[10px]">Group A</span>
                  </div>
                  <p className="text-slate-800 font-medium">
                    - สัปดาห์ที่ 1 - 2: ทาน <strong>400 mg วันละ 1 ครั้ง</strong> (4 เม็ด)<br />
                    - สัปดาห์ที่ 3 - 24: ทาน <strong>200 mg สัปดาห์ละ 3 ครั้ง</strong> (2 เม็ด วันเว้นวัน ห่างกันอย่างน้อย 48 ชม.)
                  </p>
                  <span className="text-[11px] text-purple-800 font-semibold block">
                    * ทานพร้อมอาหารเพื่อเพิ่มการดูดซึม และติดตาม EKG (QTc interval) ทุกเดือน
                  </span>
                </div>

                {/* Levofloxacin */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-sm text-blue-950">Levofloxacin (Lfx - 500 mg เม็ด)</span>
                    <span className="bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded text-[10px]">Group A</span>
                  </div>
                  <p className="text-slate-800 font-medium">
                    - น้ำหนัก &lt; 46 kg: 750 mg วันละ 1 ครั้ง (1.5 เม็ด)<br />
                    - น้ำหนัก ≥ 46 kg: 1,000 mg วันละ 1 ครั้ง (2 เม็ด)
                  </p>
                  <span className="text-[11px] text-blue-800 font-semibold block">
                    * ปรับขนาดยาหากไตวาย (CrCl &lt; 50 mL/min) และระวังการยืด QTc
                  </span>
                </div>

                {/* Linezolid */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-sm text-rose-950">Linezolid (Lzd - 600 mg เม็ด)</span>
                    <span className="bg-rose-100 text-rose-900 font-bold px-2 py-0.5 rounded text-[10px]">Group A</span>
                  </div>
                  <p className="text-slate-800 font-medium">
                    - ขนาดยามาตรฐาน: <strong>600 mg วันละ 1 ครั้ง</strong><br />
                    - หากเกิดพิษต่อไขกระดูก (Myelosuppression) หรือชาปลายมือ: พิจารณาปรับลดเป็น 300 mg/day
                  </p>
                  <span className="text-[11px] text-rose-800 font-semibold block">
                    * ต้องตรวจ CBC ทุก 2 สัปดาห์ในเดือนแรก และทุกเดือนตลอดการใช้ยา
                  </span>
                </div>

                {/* Clofazimine */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-sm text-amber-950">Clofazimine (Cfz - 100 mg แคปซูล)</span>
                    <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded text-[10px]">Group B</span>
                  </div>
                  <p className="text-slate-800 font-medium">
                    - ขนาดยามาตรฐาน: <strong>100 mg วันละ 1 ครั้ง</strong> (พร้อมอาหาร)
                  </p>
                  <span className="text-[11px] text-amber-800 font-semibold block">
                    * ทำให้ผิวหนังและสารคัดหลั่งมีสีคล้ำอมส้มแดง (กลับสู่ปกติได้หลังหยุดยา)
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
