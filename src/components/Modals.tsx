import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Heart, 
  Trophy, 
  CheckCircle2, 
  UserPlus, 
  ShieldAlert, 
  FileText, 
  Printer, 
  Pill, 
  Clock, 
  Scale
} from 'lucide-react';
import { Patient, ADRRecord, SOAPNote } from '../types/tb';
import { getPatientTimelineStats, calculateFirstLineDoses } from '../utils/tbCalculations';
import { CPG_REGIMENS } from '../data/cpgData';

// ============================================================================
// 1. CHEER UP MODAL (โหมดให้กำลังใจผู้ป่วยวัณโรค)
// ============================================================================
interface CheerUpModalProps {
  patient: Patient;
  onClose: () => void;
}

export const CheerUpModal: React.FC<CheerUpModalProps> = ({ patient, onClose }) => {
  const stats = getPatientTimelineStats(patient);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-slate-900 via-teal-950 to-slate-950 text-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-teal-500/40 space-y-6 relative overflow-hidden">
        
        {/* Glow effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-full transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 rounded-2xl shadow-lg shadow-amber-500/30">
            {stats.percent >= 100 ? (
              <Trophy className="w-8 h-8" />
            ) : (
              <Sparkles className="w-8 h-8" />
            )}
          </div>
          <span className="text-[11px] font-bold text-amber-300 uppercase tracking-widest block">
            โครงการกำลังใจ เภสัชกรเคียงข้างผู้ป่วยวัณโรค
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {patient.name}
          </h2>
          <p className="text-xs text-teal-200/90 font-medium">
            HN: {patient.hn} | กินยามาแล้ว {stats.currentM} เดือน (จากเป้าหมาย {stats.regMonths} เดือน)
          </p>
        </div>

        {/* Progress Bar in Modal */}
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-teal-500/30 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-teal-300">ความก้าวหน้าสู่การหายขาด</span>
            <span className="text-xl font-black text-amber-400 font-mono">{stats.percent}%</span>
          </div>

          <div className="h-4 bg-slate-800 rounded-full w-full overflow-hidden p-0.5 border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-teal-400 via-emerald-400 to-amber-300 rounded-full shadow-md transition-all duration-1000"
              style={{ width: `${stats.percent}%` }}
            />
          </div>

          <div className="text-center text-xs font-bold text-amber-300 pt-1">
            {stats.cheerBadge}
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="bg-teal-950/70 border border-teal-400/40 p-4 rounded-2xl space-y-2 text-center">
          <p className="text-sm font-semibold text-teal-100 leading-relaxed">
            "{stats.cheerMessage}"
          </p>
          <span className="text-[11px] text-teal-300/80 block">
            — ทีมเภสัชกรคลินิกและบุคลากรทางการแพทย์ขอส่งพลังใจให้คุณในทุกๆ วันครับ
          </span>
        </div>

        {/* 3 Golden Rules for TB Cure */}
        <div className="space-y-2 text-xs">
          <span className="font-bold text-slate-300 uppercase tracking-wider block text-[10px]">
            3 เคล็ดลับสำคัญเพื่อการหายขาด 100%:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-300 font-medium">
            <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700 text-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <span>ทานยาตรงเวลา ทุกวัน ห้ามหยุดเอง</span>
            </div>
            <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700 text-center">
              <Heart className="w-4 h-4 text-rose-400 mx-auto mb-1" />
              <span>พักผ่อนให้พอ ทานอาหารที่มีโปรตีน</span>
            </div>
            <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700 text-center">
              <Pill className="w-4 h-4 text-amber-400 mx-auto mb-1" />
              <span>ฉี่สีส้มแดงเป็นเรื่องปกติ ไม่ต้องกังวล</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-teal-300 hover:to-emerald-400 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-teal-500/25 transition-all transform active:scale-95 cursor-pointer"
        >
          รับกำลังใจ & ปิดหน้าต่าง
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// 2. NEW PATIENT REGISTRATION MODAL
// ============================================================================
interface NewPatientModalProps {
  onClose: () => void;
  onSubmit: (patient: Partial<Patient>) => void;
}

export const NewPatientModal: React.FC<NewPatientModalProps> = ({ onClose, onSubmit }) => {
  const [hn, setHn] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(45);
  const [gender, setGender] = useState<'ชาย' | 'หญิง'>('ชาย');
  const [weight, setWeight] = useState<number>(48);
  const [height, setHeight] = useState<number>(160);
  const [patientType, setPatientType] = useState('New Case (DS-TB)');
  const [hivStatus, setHivStatus] = useState<'Negative' | 'Positive' | 'Unknown'>('Negative');
  const [diagnosis, setDiagnosis] = useState('Pulmonary TB, Smear Positive');
  const [regimenId, setRegimenId] = useState(weight < 50 ? 'STD_2HRZE_4HR_LOW' : 'STD_2HRZE_4HR_STD');
  const [dotType, setDotType] = useState<'Hospital DOT' | 'Health Center DOT' | 'Family DOT' | 'V-DOT' | 'Self-administered'>('Hospital DOT');

  const bmi = height > 0 ? (weight / Math.pow(height / 100, 2)).toFixed(1) : '0';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedReg = CPG_REGIMENS.find(r => r.id === regimenId) || CPG_REGIMENS[0];

    onSubmit({
      hn: hn || `${Math.floor(100000000 + Math.random() * 900000000)}`,
      name: name || 'ผู้ป่วย รายใหม่',
      age: Number(age),
      gender,
      weight: Number(weight),
      height: Number(height),
      bmi: parseFloat(bmi),
      patientType,
      hivStatus,
      diagnosis,
      regimenId: selectedReg.id,
      regimenName: selectedReg.name,
      regimenMonths: selectedReg.durationMonths,
      monthOfTreatment: 1,
      sputumStatus: 'Positive',
      extendedPhase: false,
      extendedMonths: 0,
      adherenceRate: 100,
      dotType,
      concomitantMeds: [],
      adrRecords: [],
      soapNotes: [],
      multidisciplinaryNotes: [
        {
          id: `MDT-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          sender: 'ภก.คลินิก (เภสัชกร)',
          role: 'Pharmacist',
          text: `ลงทะเบียนผู้ป่วยใหม่ น้ำหนัก ${weight} kg เริ่มต้นการรักษาด้วยสูตร ${selectedReg.name}`
        }
      ],
      alerts: Number(weight) < 50 ? [{ id: `ALT-${Date.now()}`, type: 'Warning', text: 'น้ำหนักตัวน้อย (< 50 kg) แนะนำคำนวณแยกเม็ดตามน้ำหนักตัวจริง' }] : []
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-teal-700" />
            <h3 className="font-extrabold text-base text-slate-900">ลงทะเบียนผู้ป่วยวัณโรครายใหม่ (CPG 2021)</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">เลขที่ HN</label>
              <input
                type="text"
                placeholder="เช่น 450009988"
                value={hn}
                onChange={(e) => setHn(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                required
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">ชื่อ - นามสกุล</label>
              <input
                type="text"
                placeholder="เช่น นายมานะ สุขใจ"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div>
              <label className="font-bold text-slate-700 block mb-1">อายุ (ปี)</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">เพศ</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              >
                <option value="ชาย">ชาย</option>
                <option value="หญิง">หญิง</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">น้ำหนัก (kg)</label>
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">ส่วนสูง (cm)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>
          </div>

          <div className="p-2.5 bg-teal-50 rounded-xl border border-teal-200 text-teal-950 flex justify-between items-center">
            <span>คำนวณ BMI: <strong>{bmi} kg/m²</strong></span>
            {weight < 50 && (
              <span className="text-[10px] bg-amber-200 text-amber-950 font-black px-2 py-0.5 rounded">
                BW &lt; 50 kg (แนะนำคำนวณแยกเม็ด)
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">ประเภทผู้ป่วย</label>
              <select
                value={patientType}
                onChange={(e) => setPatientType(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              >
                <option value="New Case (DS-TB)">ผู้ป่วยรายใหม่ ไวต่อยา (DS-TB)</option>
                <option value="MDR/RR-TB">ดื้อยาหลายขนาน (MDR/RR-TB)</option>
                <option value="TB / HIV Co-infection">ติดเชื้อร่วม TB / HIV</option>
                <option value="Drug Reaction / Allergy">มีประวัติแพ้ยา / DILI</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">สถานะ HIV</label>
              <select
                value={hivStatus}
                onChange={(e) => setHivStatus(e.target.value as any)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              >
                <option value="Negative">Negative (ผลลบ)</option>
                <option value="Positive">Positive (ผลบวก)</option>
                <option value="Unknown">ยังไม่ทราบผล</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">การวินิจฉัย</label>
            <input
              type="text"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">สูตรยาที่เลือกใช้ตาม CPG 2021</label>
            <select
              value={regimenId}
              onChange={(e) => setRegimenId(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-teal-950"
            >
              {CPG_REGIMENS.map(r => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.durationMonths} เดือน)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">รูปแบบการกำกับการรับประทานยา (DOTs)</label>
            <select
              value={dotType}
              onChange={(e) => setDotType(e.target.value as any)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
            >
              <option value="Hospital DOT">Hospital DOT (ที่โรงพยาบาล)</option>
              <option value="Health Center DOT">Health Center DOT (ที่ รพ.สต.)</option>
              <option value="V-DOT">V-DOT (Video DOTs ผ่านวิดีโอคอล/แอปพลิเคชัน)</option>
              <option value="Family DOT">Family DOT (สมาชิกในครอบครัวกำกับ)</option>
              <option value="Self-administered">Self-administered (รับประทานเอง)</option>
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer"
            >
              บันทึกข้อมูลผู้ป่วย
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// 3. ADD ADR MODAL (บันทึกอาการไม่พึงประสงค์จากการใช้ยา)
// ============================================================================
interface AddAdrModalProps {
  onClose: () => void;
  onSubmit: (adr: Omit<ADRRecord, 'id'>) => void;
}

export const AddAdrModal: React.FC<AddAdrModalProps> = ({ onClose, onSubmit }) => {
  const [drug, setDrug] = useState('Pyrazinamide (Z)');
  const [reaction, setReaction] = useState('');
  const [severity, setSeverity] = useState<'Mild' | 'Moderate' | 'Severe' | 'Life-threatening'>('Moderate');
  const [action, setAction] = useState('');
  const [reporter, setReporter] = useState('ภญ.สุภิตา ทองขำ (เภสัชกรคลินิก)');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reaction.trim()) return;

    onSubmit({
      date: new Date().toISOString().split('T')[0],
      drug,
      reaction,
      severity,
      action: action || 'หยุดยาที่สงสัยและติดตามอาการทางคลินิก',
      status: 'Active',
      reporter
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            <h3 className="font-extrabold text-base text-slate-900">บันทึกอาการไม่พึงประสงค์ (ADR Record)</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">ยาที่สงสัย (Suspected Drug)</label>
            <select
              value={drug}
              onChange={(e) => setDrug(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
            >
              <option value="Pyrazinamide (Z)">Pyrazinamide (Z) - พิษต่อตับ/ปวดข้อ</option>
              <option value="Isoniazid (H)">Isoniazid (H) - พิษต่อตับ/ชาปลายประสาท</option>
              <option value="Rifampicin (R)">Rifampicin (R) - พิษต่อตับ/เกล็ดเลือดต่ำ/ผื่น</option>
              <option value="Ethambutol (E)">Ethambutol (E) - จอประสาทตาอักเสบ/ตามัว</option>
              <option value="Fixed-Dose Combination (4FDC)">4FDC (สูตรเม็ดรวม)</option>
              <option value="Linezolid (Lzd)">Linezolid (Lzd) - พิษต่อไขกระดูก/ชาปลายมือ</option>
              <option value="Clofazimine (Cfz)">Clofazimine (Cfz) - ผิวคล้ำ/ท้องเสีย</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">อาการไม่พึงประสงค์ที่ตรวจพบ</label>
            <textarea
              rows={2}
              placeholder="เช่น ตับอักเสบ AST 240 U/L ตัวเหลือง, ผื่นแดงคันทั่วตัว, ชาปลายมือปลายเท้า..."
              value={reaction}
              onChange={(e) => setReaction(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              required
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">ระดับความรุนแรง (Severity)</label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as any)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
            >
              <option value="Mild">Mild (เล็กน้อย ไม่รบกวนการดำเนินชีวิต)</option>
              <option value="Moderate">Moderate (ปานกลาง ต้องรักษาเพิ่มเติม)</option>
              <option value="Severe">Severe (รุนแรง ต้องหยุดยาหรือนอน รพ.)</option>
              <option value="Life-threatening">Life-threatening (อันตรายถึงชีวิต)</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">การจัดการทางคลินิก (Action Taken)</label>
            <textarea
              rows={2}
              placeholder="เช่น หยุดยา Z ถาวร, เพิ่ม Pyridoxine 50 mg/day, เจาะ LFT ซ้ำใน 1 สัปดาห์..."
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">ผู้รายงาน (Reporter)</label>
            <input
              type="text"
              value={reporter}
              onChange={(e) => setReporter(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
            >
              บันทึก ADR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// 4. ADD SOAP NOTE MODAL (บันทึกการบริบาลทางเภสัชกรรม)
// ============================================================================
interface AddSoapModalProps {
  onClose: () => void;
  onSubmit: (soap: Omit<SOAPNote, 'id'>) => void;
}

export const AddSoapModal: React.FC<AddSoapModalProps> = ({ onClose, onSubmit }) => {
  const [problem, setProblem] = useState('');
  const [subjective, setSubjective] = useState('');
  const [objective, setObjective] = useState('');
  const [assessment, setAssessment] = useState('');
  const [plan, setPlan] = useState('');
  const [author, setAuthor] = useState('ภญ.สุภิตา ทองขำ (ภก.คลินิก)');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem.trim()) return;

    onSubmit({
      date: new Date().toISOString().split('T')[0],
      author,
      problem,
      subjective,
      objective,
      assessment,
      plan
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-700" />
            <h3 className="font-extrabold text-base text-slate-900">เขียนบันทึกการบริบาลทางเภสัชกรรม (SOAP Note)</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">ปัญหาที่พบ (Problem / DRP)</label>
            <input
              type="text"
              placeholder="เช่น ติดตามผลข้างเคียง DILI, ประเมินการขยายระยะเวลารักษาเสมหะ (+), ปรับขนาดยาตาม BW < 50kg..."
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-teal-950"
              required
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">[S] Subjective (ข้อมูลจากคำบอกเล่าผู้ป่วย)</label>
            <textarea
              rows={2}
              placeholder="อาการทั่วไป, อาการไอ, มีไข้, คลื่นไส้, เบื่ออาหาร, ความสม่ำเสมอในการกินยา..."
              value={subjective}
              onChange={(e) => setSubjective(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">[O] Objective (ข้อมูลตรวจทางห้องปฏิบัติการ/สัญญาณชีพ)</label>
            <textarea
              rows={2}
              placeholder="BW, BP, LFT (AST/ALT/TBili), Sputum AFB, CXR, EKG QTc..."
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">[A] Assessment (การประเมินปัญหาทางคลินิกและสาเหตุ)</label>
            <textarea
              rows={2}
              placeholder="ประเมินการตอบสนองต่อการรักษา, สาเหตุของอาการไม่พึงประสงค์, อันตรกิริยาระหว่างยา..."
              value={assessment}
              onChange={(e) => setAssessment(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">[P] Plan (แผนการรักษา/คำแนะนำการใช้ยา/การติดตาม)</label>
            <textarea
              rows={3}
              placeholder="1. ขนาดยาและวิธีการรับประทาน\n2. การนัดตรวจติดตามผลทางห้องปฏิบัติการ\n3. คำแนะนำแก่ผู้ป่วย"
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              className="w-full p-2 bg-emerald-50/60 border border-emerald-200 rounded-xl font-medium text-emerald-950"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">ผู้บันทึก</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
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
              บันทึก SOAP Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// 5. PRINTABLE SUMMARY MODAL
// ============================================================================
interface PrintSummaryModalProps {
  patient: Patient;
  onClose: () => void;
}

export const PrintSummaryModal: React.FC<PrintSummaryModalProps> = ({ patient, onClose }) => {
  const stats = getPatientTimelineStats(patient);
  const doses = calculateFirstLineDoses(patient.weight);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-slate-200 pb-3 no-print">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-teal-700" />
            <h3 className="font-extrabold text-base text-slate-900">สรุปเวชระเบียนการบริบาลผู้ป่วยวัณโรค (รพ.เขาชัยสน)</h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
            >
              พิมพ์เอกสาร (Print)
            </button>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Sheet */}
        <div className="space-y-4 text-xs font-sans text-slate-800">
          <div className="text-center border-b border-slate-300 pb-3">
            <h2 className="text-base font-black text-slate-950">แบบสรุปการดูแลผู้ป่วยวัณโรคและการใช้ยา (TB Pharmacy Care Summary)</h2>
            <p className="text-[11px] text-teal-800 font-bold">โรงพยาบาลเขาชัยสน จังหวัดพัทลุง</p>
            <p className="text-[10px] text-slate-600">อ้างอิงตามแนวทางการควบคุมวัณโรคประเทศไทย พ.ศ. 2564 (Thailand CPG 2021)</p>
          </div>

          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div><strong>ชื่อ-นามสกุล:</strong> {patient.name}</div>
            <div><strong>HN:</strong> {patient.hn} (ID: {patient.id})</div>
            <div><strong>อายุ / เพศ:</strong> {patient.age} ปี / {patient.gender}</div>
            <div><strong>น้ำหนักปัจจุบัน / BMI:</strong> {patient.weight} kg / {patient.bmi} kg/m²</div>
            <div><strong>การวินิจฉัย:</strong> {patient.diagnosis}</div>
            <div><strong>สถานะเสมหะ AFB:</strong> {patient.sputumStatus}</div>
            <div><strong>สูตรการรักษา:</strong> {patient.regimenName}</div>
            <div><strong>วันนัดติดตามครั้งถัดไป:</strong> <span className="font-bold text-teal-900">{patient.nextAppointmentDate || 'ไม่ได้ระบุ'}</span></div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1 mb-2">
              คำแนะนำขนาดยาตามน้ำหนักตัวจริง ({patient.weight} kg):
            </h4>
            <div className="space-y-1.5">
              {doses.map(d => (
                <div key={d.code} className="flex justify-between p-2 bg-slate-50 rounded border border-slate-200">
                  <span className="font-bold">{d.drugName}:</span>
                  <span>{d.tabletDispenseThai}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Visits Table */}
          {patient.visits && patient.visits.length > 0 && (
            <div>
              <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1 mb-2">
                ประวัติการเบิกและรับยาทุก Visit ({patient.visits.length} ครั้ง):
              </h4>
              <div className="border border-slate-200 rounded-lg overflow-hidden text-[11px]">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-1.5">วันที่</th>
                      <th className="p-1.5">น้ำหนัก</th>
                      <th className="p-1.5">สูตรยา</th>
                      <th className="p-1.5">จำนวนวัน</th>
                      <th className="p-1.5">ผลการกินยา</th>
                      <th className="p-1.5">วันนัดถัดไป</th>
                      <th className="p-1.5">ผู้จ่ายยา</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {patient.visits.map((v, i) => (
                      <tr key={v.id || i}>
                        <td className="p-1.5 font-mono">{v.visitDate}</td>
                        <td className="p-1.5">{v.weight} kg</td>
                        <td className="p-1.5">{v.regimen}</td>
                        <td className="p-1.5">{v.daysOfSupply} วัน</td>
                        <td className="p-1.5">
                          {v.medicationTakingStatus === 'incorrect' ? (
                            <span className="text-rose-700 font-bold">⚠️ ไม่ถูกต้อง ({v.incorrectReason || 'ลืมกิน'})</span>
                          ) : (
                            <span className="text-emerald-700 font-bold">✓ ถูกต้อง 100%</span>
                          )}
                        </td>
                        <td className="p-1.5 font-mono">{v.nextAppointmentDate || '-'}</td>
                        <td className="p-1.5">{v.dispensedBy || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* HosXP Clinical Note */}
          {patient.hosxpNotes && (
            <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200">
              <h4 className="font-bold text-blue-950 mb-1 flex items-center gap-1.5">
                <span>บันทึกการบริบาลเภสัชกรรม (HosXP Pharmaceutical Care):</span>
              </h4>
              <p className="text-[11px] text-slate-800 whitespace-pre-line font-mono">{patient.hosxpNotes}</p>
              <div className="text-[10px] text-blue-800 mt-1">
                บันทึกโดย: {patient.hosxpUpdatedBy || 'ภก.คลินิก'} | {patient.hosxpLastUpdated || '-'}
              </div>
            </div>
          )}

          {patient.adrRecords.length > 0 && (
            <div>
              <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1 mb-2">
                ประวัติอาการไม่พึงประสงค์ / DILI:
              </h4>
              <div className="space-y-1.5">
                {patient.adrRecords.map(adr => (
                  <div key={adr.id} className="p-2 bg-amber-50 rounded border border-amber-200 text-[11px]">
                    <strong>{adr.drug}:</strong> {adr.reaction} ({adr.severity}) - การจัดการ: {adr.action}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-200 flex justify-between items-end text-[11px] text-slate-500">
            <div>
              วันที่พิมพ์: {new Date().toLocaleDateString('th-TH')}
            </div>
            <div className="text-right">
              ลงชื่อ....................................................... ภก.คลินิก รพ.เขาชัยสน
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
