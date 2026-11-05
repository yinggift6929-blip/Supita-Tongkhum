import React, { useState, useEffect } from 'react';
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
  Scale,
  Phone,
  Check,
  Edit3,
  CalendarCheck,
  Copy,
  CheckCheck,
  Database,
  ClipboardPaste,
  FileSpreadsheet,
  RotateCcw,
  Save,
  Sliders,
  Trash2,
  X
} from 'lucide-react';
import { Patient, PatientVisit, ADRRecord, SOAPNote, MultidisciplinaryNote, PatientCustomDoses } from '../types/tb';
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
  onOpenAddVisitModal: (patientId: string) => void;
  onMarkVisitDispensed: (patientId: string, visitId: string) => void;
  onUpdateNextAppointment: (patientId: string, nextDate: string) => void;
  onUpdateHosxpNotes?: (patientId: string, notes: string) => void;
  onUpdatePatientRegimen?: (patientId: string, updatedRegimen: string, customDoses?: PatientCustomDoses) => void;
  onUpdatePatientInfo?: (
    patientId: string,
    updatedData: {
      name: string;
      hn: string;
      age: number;
      gender: 'ชาย' | 'หญิง';
      weight: number;
      phoneNumber?: string;
    }
  ) => void;
  onDeletePatient?: (patientId: string) => void;
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
  onAdvanceMonth,
  onOpenAddVisitModal,
  onMarkVisitDispensed,
  onUpdateNextAppointment,
  onUpdateHosxpNotes,
  onUpdatePatientRegimen,
  onUpdatePatientInfo,
  onDeletePatient
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [weightFilter, setWeightFilter] = useState<'all' | 'low' | 'normal'>('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [detailTab, setDetailTab] = useState<'visits' | 'adr' | 'soap' | 'multidisciplinary' | 'ddi'>('visits');
  const [newNoteInput, setNewNoteInput] = useState('');

  // Editing next appointment state
  const [isEditingAppt, setIsEditingAppt] = useState(false);
  const [tempApptDate, setTempApptDate] = useState('');

  // HosXP Pharmaceutical Care state (User Request #1)
  const [isEditingHosxp, setIsEditingHosxp] = useState(false);
  const [tempHosxpNotes, setTempHosxpNotes] = useState('');
  const [copiedHosxp, setCopiedHosxp] = useState(false);

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  // Edit patient info & Delete/D/C state
  const [isEditingPatientInfo, setIsEditingPatientInfo] = useState(false);
  const [editName, setEditName] = useState('');
  const [editHn, setEditHn] = useState('');
  const [editAge, setEditAge] = useState<number>(45);
  const [editGender, setEditGender] = useState<'ชาย' | 'หญิง'>('ชาย');
  const [editWeight, setEditWeight] = useState<number>(50);
  const [editPhone, setEditPhone] = useState('');
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [dcReason, setDcReason] = useState('รักษาครบหายขาด (Cured / Treatment Completed)');

  const handleOpenEditPatientInfo = () => {
    if (!selectedPatient) return;
    setEditName(selectedPatient.name);
    setEditHn(selectedPatient.hn);
    setEditAge(selectedPatient.age);
    setEditGender(selectedPatient.gender);
    setEditWeight(selectedPatient.weight);
    setEditPhone(selectedPatient.phoneNumber || '');
    setIsEditingPatientInfo(true);
  };

  const handleSavePatientInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !editName.trim()) return;
    if (onUpdatePatientInfo) {
      onUpdatePatientInfo(selectedPatient.id, {
        name: editName.trim(),
        hn: editHn.trim() || selectedPatient.hn,
        age: Number(editAge) || selectedPatient.age,
        gender: editGender,
        weight: Number(editWeight) || selectedPatient.weight,
        phoneNumber: editPhone.trim()
      });
    }
    setIsEditingPatientInfo(false);
  };

  const handleConfirmDeletePatient = () => {
    if (!selectedPatient) return;
    if (onDeletePatient) {
      onDeletePatient(selectedPatient.id);
    }
    setShowDeleteConfirmModal(false);
  };

  const handleCopyHosxp = () => {
    const textToCopy = selectedPatient.hosxpNotes || `[การบริบาลเภสัชกรรม TB - รพ.เขาชัยสน]\nHN: ${selectedPatient.hn} | ชื่อ-สกุล: ${selectedPatient.name} | น้ำหนัก: ${selectedPatient.weight} kg\nสูตรยา: ${selectedPatient.regimenName} (Month ${selectedPatient.monthOfTreatment}/${selectedPatient.regimenMonths})\nสถานะเสมหะ: AFB ${selectedPatient.sputumStatus}\nวันนัดติดตาม: ${selectedPatient.nextAppointmentDate || '-'}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedHosxp(true);
    setTimeout(() => setCopiedHosxp(false), 2500);
  };

  const handleSaveHosxp = () => {
    if (onUpdateHosxpNotes) {
      onUpdateHosxpNotes(selectedPatient.id, tempHosxpNotes);
    }
    setIsEditingHosxp(false);
  };

  const handleInsertHosxpSnippet = (snippet: string) => {
    setTempHosxpNotes(prev => (prev ? `${prev}\n• ${snippet}` : `• ${snippet}`));
  };

  // Calculation of standard CPG default tablets based on weight
  const getCpgDefaultDoses = (weight: number) => {
    const isLowW = weight < 50;
    const defaultH = 3; // 100mg x 3 = 300mg
    const defaultR = isLowW ? 1 : 2; // 1 cap (450mg) or 2 caps (300mg x 2 = 600mg)
    const defaultZ = weight < 40 ? 1.5 : weight < 50 ? 2 : weight <= 70 ? 3 : 4;
    const defaultE = weight < 40 ? 1.5 : weight < 50 ? 2 : weight <= 70 ? 2.5 : 4;
    const defaultFdc = weight < 38 ? 2 : weight <= 54 ? 3 : weight <= 70 ? 4 : 5;

    return {
      hTabs: defaultH,
      rTabs: defaultR,
      zTabs: defaultZ,
      eTabs: defaultE,
      vitBcoSig: '1*3 pc',
      fdcTabs: defaultFdc,
      mode: isLowW ? 'split' : ('split' as const)
    };
  };

  const initialDoses = getCpgDefaultDoses(selectedPatient.weight);
  const [dosingMode, setDosingMode] = useState<'split' | 'fdc'>('split');
  const [hTabs, setHTabs] = useState<number>(selectedPatient.customDoses?.hTabs ?? initialDoses.hTabs);
  const [rTabs, setRTabs] = useState<number>(selectedPatient.customDoses?.rTabs ?? initialDoses.rTabs);
  const [zTabs, setZTabs] = useState<number>(selectedPatient.customDoses?.zTabs ?? initialDoses.zTabs);
  const [eTabs, setETabs] = useState<number>(selectedPatient.customDoses?.eTabs ?? initialDoses.eTabs);
  const [vitBcoSig, setVitBcoSig] = useState<string>(selectedPatient.customDoses?.vitBcoSig || '1*3 pc');
  const [fdcTabs, setFdcTabs] = useState<number>(selectedPatient.customDoses?.fdcTabs ?? initialDoses.fdcTabs);
  const [savedRegimenNotice, setSavedRegimenNotice] = useState<boolean>(false);

  // Sync state whenever selectedPatient changes
  useEffect(() => {
    const d = getCpgDefaultDoses(selectedPatient.weight);
    const custom = selectedPatient.customDoses;
    setDosingMode('split');
    setHTabs(custom?.hTabs ?? d.hTabs);
    setRTabs(custom?.rTabs ?? d.rTabs);
    setZTabs(custom?.zTabs ?? d.zTabs);
    setETabs(custom?.eTabs ?? d.eTabs);
    setVitBcoSig(custom?.vitBcoSig || '1*3 pc');
    setFdcTabs(custom?.fdcTabs ?? d.fdcTabs);
    setSavedRegimenNotice(false);
  }, [selectedPatient.id, selectedPatient.weight, selectedPatient.customDoses]);

  const generateRegimenSummary = (
    mode: 'split' | 'fdc',
    h: number,
    r: number,
    z: number,
    e: number,
    bco: string,
    fdc: number
  ) => {
    if (mode === 'fdc') {
      const bcoText = bco !== '0' ? ` + Vit B co ${bco}` : '';
      return `4FDC (Rimstar) ${fdc} เม็ด OD ac${bcoText}`;
    }
    const rMg = selectedPatient.weight < 50 ? `${r * 450}mg` : `${r * 300}mg`;
    const zText = z > 0 ? `, Z(${z * 500}mg) ${z} เม็ด` : '';
    const eText = e > 0 ? `, E(${e * 400}mg) ${e} เม็ด` : '';
    const bcoText = bco !== '0' ? `, Vit B co ${bco}` : '';
    return `H(${h * 100}mg) ${h} เม็ด, R(${rMg}) ${r} แคปซูล${zText}${eText}${bcoText}`;
  };

  const handleSaveRegimen = (
    newMode = dosingMode,
    newH = hTabs,
    newR = rTabs,
    newZ = zTabs,
    newE = eTabs,
    newBco = vitBcoSig,
    newFdc = fdcTabs
  ) => {
    const summary = generateRegimenSummary(newMode, newH, newR, newZ, newE, newBco, newFdc);
    if (onUpdatePatientRegimen) {
      onUpdatePatientRegimen(selectedPatient.id, summary, {
        mode: newMode,
        hTabs: newH,
        rTabs: newR,
        zTabs: newZ,
        eTabs: newE,
        vitBcoSig: newBco,
        fdcTabs: newFdc
      });
    }
    setSavedRegimenNotice(true);
    setTimeout(() => setSavedRegimenNotice(false), 3000);
  };

  const handleResetToCpg = () => {
    const d = getCpgDefaultDoses(selectedPatient.weight);
    setDosingMode(selectedPatient.weight < 50 ? 'split' : 'split');
    setHTabs(d.hTabs);
    setRTabs(d.rTabs);
    setZTabs(d.zTabs);
    setETabs(d.eTabs);
    setVitBcoSig(d.vitBcoSig);
    setFdcTabs(d.fdcTabs);

    const summary = generateRegimenSummary('split', d.hTabs, d.rTabs, d.zTabs, d.eTabs, d.vitBcoSig, d.fdcTabs);
    if (onUpdatePatientRegimen) {
      onUpdatePatientRegimen(selectedPatient.id, summary, d);
    }
    setSavedRegimenNotice(true);
    setTimeout(() => setSavedRegimenNotice(false), 3000);
  };

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

  const handleSaveAppt = () => {
    if (tempApptDate) {
      onUpdateNextAppointment(selectedPatient.id, tempApptDate);
    }
    setIsEditingAppt(false);
  };

  // Appointment status calculation
  const todayStr = '2026-11-04';
  const getApptBadge = (dateStr?: string) => {
    if (!dateStr) return null;
    const today = new Date(todayStr);
    const appt = new Date(dateStr);
    const diff = Math.round((appt.getTime() - today.getTime()) / (1000 * 3600 * 24));

    if (diff === 0) {
      return <span className="bg-teal-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">นัดวันนี้!</span>;
    } else if (diff < 0) {
      return <span className="bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">ขาดนัด {Math.abs(diff)} วัน!</span>;
    } else if (diff <= 7) {
      return <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full">อีก {diff} วัน</span>;
    } else {
      return <span className="bg-slate-100 text-slate-700 text-[10px] font-medium px-2 py-0.5 rounded-full">อีก {diff} วัน</span>;
    }
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
            <span className="text-[11px] text-slate-500">รพ.เขาชัยสน</span>
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
                          <span>{p.visits?.length || 0} visits</span>
                        </div>
                      </div>

                      <div className="text-right">
                        {getApptBadge(p.nextAppointmentDate)}
                        <span className="block text-[10px] text-slate-400 mt-1 font-mono">
                          {p.nextAppointmentDate || 'ไม่มีนัด'}
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
                  <button
                    type="button"
                    onClick={handleOpenEditPatientInfo}
                    className="px-2 py-0.5 bg-white hover:bg-teal-50 text-teal-800 border border-teal-300 rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
                    title="แก้ไขชื่อหรือข้อมูลทั่วไปของผู้ป่วย"
                  >
                    <Edit3 className="w-3 h-3 text-teal-700" />
                    <span>แก้ไข</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirmModal(true)}
                    className="px-2 py-0.5 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
                    title="จำหน่ายผู้ป่วย (D/C) หรือลบรายชื่อออกจากระบบ"
                  >
                    <Trash2 className="w-3 h-3 text-rose-600" />
                    <span>D/C / ลบ</span>
                  </button>
                  <span className="text-xs bg-teal-900 text-white font-mono px-2 py-0.5 rounded-md font-bold shadow-sm">
                    HN: {selectedPatient.hn}
                  </span>
                  <span className="text-xs bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-md">
                    ID: {selectedPatient.id}
                  </span>
                  {selectedPatient.phoneNumber && (
                    <span className="text-xs bg-teal-100 text-teal-900 font-bold px-2 py-0.5 rounded-md border border-teal-200 flex items-center gap-1 font-mono">
                      <Phone className="w-3 h-3 text-teal-700" />
                      {selectedPatient.phoneNumber}
                    </span>
                  )}
                </div>

                {/* Inline Edit Patient Info Form */}
                {isEditingPatientInfo && (
                  <form
                    onSubmit={handleSavePatientInfo}
                    className="mt-3 p-3.5 bg-white rounded-xl border border-teal-300 shadow-md space-y-2.5 text-xs animate-in fade-in duration-150"
                  >
                    <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                      <span className="font-black text-teal-950 flex items-center gap-1.5">
                        <Edit3 className="w-3.5 h-3.5 text-teal-700" />
                        <span>แก้ไขข้อมูลผู้ป่วย (Edit Patient Profile)</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsEditingPatientInfo(false)}
                        className="text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="sm:col-span-2">
                        <label className="font-bold text-slate-700 block mb-0.5">ชื่อ-นามสกุลผู้ป่วย</label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full p-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900"
                          required
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-0.5">เลข HN</label>
                        <input
                          type="text"
                          value={editHn}
                          onChange={(e) => setEditHn(e.target.value)}
                          className="w-full p-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold text-slate-900"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div>
                        <label className="font-bold text-slate-700 block mb-0.5">อายุ (ปี)</label>
                        <input
                          type="number"
                          value={editAge}
                          onChange={(e) => setEditAge(parseInt(e.target.value) || 0)}
                          className="w-full p-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold"
                          required
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-0.5">เพศ</label>
                        <select
                          value={editGender}
                          onChange={(e) => setEditGender(e.target.value as 'ชาย' | 'หญิง')}
                          className="w-full p-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold"
                        >
                          <option value="ชาย">ชาย</option>
                          <option value="หญิง">หญิง</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-0.5">น้ำหนัก (kg)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={editWeight}
                          onChange={(e) => setEditWeight(parseFloat(e.target.value) || 0)}
                          className="w-full p-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold"
                          required
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-0.5">เบอร์โทรศัพท์</label>
                        <input
                          type="text"
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          placeholder="08x-xxx-xxxx"
                          className="w-full p-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsEditingPatientInfo(false)}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg cursor-pointer"
                      >
                        ยกเลิก
                      </button>
                      <button
                        type="submit"
                        className="px-3.5 py-1 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg shadow-xs cursor-pointer flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>บันทึกการแก้ไข</span>
                      </button>
                    </div>
                  </form>
                )}

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 mt-1.5 font-medium">
                  <span>
                    <strong className="text-slate-800">อายุ:</strong> {selectedPatient.age} ปี ({selectedPatient.gender})
                  </span>
                  <span>•</span>
                  <span>
                    <strong className="text-slate-800">น้ำหนักปัจจุบัน:</strong>{' '}
                    <span className={isLowWeight ? 'text-amber-700 font-bold' : 'text-slate-900 font-bold'}>
                      {selectedPatient.weight} kg
                    </span>{' '}
                    (BMI: {selectedPatient.bmi})
                  </span>
                  <span>•</span>
                  <span>
                    <strong className="text-slate-800">DOTs:</strong> {selectedPatient.dotType}
                  </span>
                </div>

                {/* Next Appointment Indicator */}
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 text-xs bg-white px-2.5 py-1 rounded-lg border border-teal-200 shadow-xs">
                    <Calendar className="w-3.5 h-3.5 text-teal-700" />
                    <span className="font-bold text-slate-700">วันนัดติดตามครั้งถัดไป:</span>
                    <span className="font-black text-teal-900 font-mono">
                      {selectedPatient.nextAppointmentDate || 'ยังไม่ได้กำหนดวันนัด'}
                    </span>
                    {getApptBadge(selectedPatient.nextAppointmentDate)}
                  </div>

                  {isEditingAppt ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="date"
                        value={tempApptDate || selectedPatient.nextAppointmentDate || ''}
                        onChange={(e) => setTempApptDate(e.target.value)}
                        className="p-1 text-xs bg-white border border-teal-400 rounded-lg font-bold"
                      />
                      <button
                        onClick={handleSaveAppt}
                        className="px-2 py-1 bg-teal-700 text-white text-[11px] font-bold rounded-lg cursor-pointer"
                      >
                        บันทึก
                      </button>
                      <button
                        onClick={() => setIsEditingAppt(false)}
                        className="px-2 py-1 bg-slate-200 text-slate-700 text-[11px] rounded-lg cursor-pointer"
                      >
                        ยกเลิก
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setTempApptDate(selectedPatient.nextAppointmentDate || todayStr);
                        setIsEditingAppt(true);
                      }}
                      className="text-[11px] text-teal-700 hover:text-teal-900 font-bold underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>เปลี่ยนวันนัด</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => onOpenAddVisitModal(selectedPatient.id)}
                className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-teal-200" />
                <span>+ บันทึกรับยา Visit ใหม่</span>
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

          {/* 🏥 ช่องบันทึกการบริบาลเภสัชกรรม ใต้ PATIENT PROFILE (USER REQUEST #1: HOSXP INTEGRATION) */}
          <div className="bg-gradient-to-r from-blue-50/90 via-sky-50/70 to-teal-50/80 p-4 rounded-2xl border border-blue-200/90 shadow-sm space-y-3">
            <div className="flex flex-wrap justify-between items-center gap-2 border-b border-blue-200/70 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-700 text-white flex items-center justify-center shadow-xs">
                  <Database className="w-4 h-4 text-sky-200" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-black text-blue-950 uppercase tracking-wide">
                      บันทึกการบริบาลเภสัชกรรม (HosXP Pharmaceutical Care Record)
                    </h3>
                    <span className="bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded font-mono">
                      HosXP รพ.เขาชัยสน
                    </span>
                  </div>
                  <span className="text-[11px] text-blue-800/80">
                    บันทึกข้อมูลทางคลินิกเพื่อส่งต่อหรือคัดลอกไปลงในโปรแกรม HosXP
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Copy to HosXP button */}
                <button
                  type="button"
                  onClick={handleCopyHosxp}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                    copiedHosxp
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-white hover:bg-blue-50 text-blue-900 border-blue-300 shadow-xs'
                  }`}
                  title="คัดลอกข้อความสรุปการบริบาลนี้ไปวางในระบบ HosXP"
                >
                  {copiedHosxp ? (
                    <>
                      <CheckCheck className="w-3.5 h-3.5 text-white animate-bounce" />
                      <span>คัดลอกสำเร็จ!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-blue-700" />
                      <span>คัดลอกไป HosXP</span>
                    </>
                  )}
                </button>

                {/* Edit Button */}
                {!isEditingHosxp ? (
                  <button
                    type="button"
                    onClick={() => {
                      setTempHosxpNotes(selectedPatient.hosxpNotes || '');
                      setIsEditingHosxp(true);
                    }}
                    className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-sky-200" />
                    <span>แก้ไข/บันทึก</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditingHosxp(false)}
                    className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    ปิด
                  </button>
                )}
              </div>
            </div>

            {/* Content view / edit */}
            {!isEditingHosxp ? (
              <div className="space-y-2">
                <div className="bg-white/95 p-3 rounded-xl border border-blue-200/80 text-xs text-slate-800 shadow-xs whitespace-pre-line leading-relaxed font-mono">
                  {selectedPatient.hosxpNotes ? (
                    selectedPatient.hosxpNotes
                  ) : (
                    <span className="text-slate-400 font-sans italic">
                      ยังไม่มีการบันทึกข้อมูลการบริบาลเภสัชกรรมจาก HosXP สำหรับผู้ป่วยรายนี้ — คลิก "แก้ไข/บันทึก" เพื่อพิมพ์หรือวาง (Paste) ข้อมูล
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap justify-between items-center text-[10px] text-blue-900/70 pt-0.5">
                  <div className="flex items-center gap-2">
                    <span>อัปเดตล่าสุด: <strong className="font-mono text-blue-950">{selectedPatient.hosxpLastUpdated || '2026-11-04 09:30'}</strong></span>
                    <span>•</span>
                    <span>ผู้บันทึก: <strong className="text-blue-950">{selectedPatient.hosxpUpdatedBy || 'ภก.วิชัย ชื่นกมล (ภก.คลินิก)'}</strong></span>
                  </div>
                  <span className="text-slate-500 italic">
                    * สามารถกด "คัดลอกไป HosXP" เพื่อนำข้อความไป Paste ในช่อง Doctor/Pharmacist Note ได้ทันที
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5 animate-in fade-in duration-150">
                <textarea
                  rows={4}
                  value={tempHosxpNotes}
                  onChange={(e) => setTempHosxpNotes(e.target.value)}
                  placeholder="พิมพ์หรือคัดลอก (Paste) ข้อความการบริบาลเภสัชกรรม หรือข้อมูลประวัติจาก HosXP ที่นี่..."
                  className="w-full p-3 bg-white border border-blue-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-inner"
                />

                {/* Quick Snippets */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider block">
                    ข้อความสำเร็จรูปด่วน (Quick Snippets):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'ทานยาสม่ำเสมอครบถ้วน Adherence 100% ไม่มีลืมยา',
                      'ผู้ป่วยน้ำหนัก < 50 kg จ่ายแยกเม็ดตามน้ำหนักตัวจริง ป้องกัน DILI',
                      'แนะนำรับประทานยาก่อนอาหารเช้า 30-60 นาทีพร้อมน้ำเปล่า',
                      'เน้นย้ำสังเกตอาการตับอักเสบ: ตัวเหลือง ตาเหลือง คลื่นไส้ คันตามผิวหนัง',
                      'ทาน Vit B6 ต่อเนื่องป้องกันชาปลายมือปลายเท้า',
                      'นัดตรวจเสมหะและ LFT ตามกำหนด CPG 2021'
                    ].map((snippet, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleInsertHosxpSnippet(snippet)}
                        className="text-[10px] bg-white hover:bg-blue-100 text-blue-950 border border-blue-300 px-2 py-0.8 rounded-lg transition-all cursor-pointer font-medium"
                      >
                        + {snippet.slice(0, 32)}...
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1 border-t border-blue-200/70">
                  <button
                    type="button"
                    onClick={() => setIsEditingHosxp(false)}
                    className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 cursor-pointer"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveHosxp}
                    className="px-4 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>บันทึกข้อมูล HosXP</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 📊 SCALE แสดงการกินยาของผู้ป่วย (TREATMENT PROGRESS SCALE ROADMAP) */}
          <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white p-5 rounded-2xl shadow-xl border border-slate-800 space-y-4">
            <div className="flex flex-wrap justify-between items-center border-b border-slate-800 pb-3 gap-2">
              <div>
                <span className="text-[11px] font-black text-teal-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-amber-400" />
                  SCALE แสดงการกินยาของผู้ป่วย (TREATMENT PROGRESS SCALE)
                </span>
                <h3 className="text-base font-extrabold text-white mt-1 flex items-center gap-2">
                  <span>ระยะปัจจุบัน : <span className="text-amber-300">{timelineStats.stageTitle}</span></span>
                  <span className="text-xs font-medium text-slate-300">
                    (กินยามาแล้ว {timelineStats.currentM} จากเป้าหมาย {timelineStats.regMonths} เดือน)
                  </span>
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block font-medium">ความก้าวหน้าการกินยา</span>
                <span className="text-2xl font-black text-amber-400 font-mono tracking-tight">
                  {timelineStats.percent}%
                </span>
              </div>
            </div>

            {/* The Visual Scale Bar */}
            <div className="pt-6 pb-2 px-2">
              <div className="relative">
                {/* Background tracks */}
                <div className="h-5 bg-slate-800 rounded-full w-full overflow-hidden flex border border-slate-700/80">
                  <div 
                    className="bg-blue-600/70 h-full relative" 
                    style={{ width: `${Math.min((2 / timelineStats.regMonths) * 100, 100)}%` }} 
                    title="ระยะเข้มข้น (Intensive Phase 2 เดือน)"
                  />
                  <div 
                    className="bg-emerald-600/70 h-full relative" 
                    style={{ width: `${Math.max(0, Math.min(((selectedPatient.regimenMonths - 2) / timelineStats.regMonths) * 100, 100))}%` }} 
                    title="ระยะสมาน (Continuation Phase)"
                  />
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

          {/* 💊 สูตรยา & ขนาดการจัดยาประจำตัวผู้ป่วย (INTERACTIVE REGIMEN & TABLET DOSING CONFIGURATOR) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-4 sm:p-5 space-y-4">
            {/* Header & Controls */}
            <div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-800 text-white flex items-center justify-center shadow-xs">
                  <Pill className="w-5 h-5 text-teal-200" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-extrabold text-sm text-slate-900">
                      สูตรยาและจำนวนเม็ดที่ต้องรับประทาน (Regimen & Tablet Dosing)
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-900 border border-teal-200">
                      น้ำหนัก {selectedPatient.weight} kg
                    </span>
                    {isLowWeight && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-200 text-amber-950 border border-amber-300">
                        BW &lt; 50 kg (แยกเม็ด)
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500">
                    กดเลือกจำนวนเม็ดเป็นตัวเลขเพื่อปรับขนาดยาให้ตรงตามน้ำหนักตัวและอาการของผู้ป่วย
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-wrap text-xs">

                {/* Reset to CPG button */}
                <button
                  type="button"
                  onClick={handleResetToCpg}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold flex items-center gap-1 transition-all cursor-pointer"
                  title="คืนค่าขนาดยาตามเกณฑ์มาตรฐาน CPG 2021"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span>คืนค่า CPG</span>
                </button>

                {/* Save button */}
                <button
                  type="button"
                  onClick={() => handleSaveRegimen()}
                  className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5 text-teal-200" />
                  <span>{savedRegimenNotice ? 'บันทึกสำเร็จ!' : 'บันทึกสูตรยา'}</span>
                </button>
              </div>
            </div>

            {/* INTERACTIVE TABLET CONFIGURATION */}
              <div className="space-y-3">
                {/* 1. ISONIAZID (H) */}
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white transition-all space-y-2">
                  <div className="flex flex-wrap justify-between items-center gap-1">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-teal-800 text-white font-black text-xs flex items-center justify-center">
                        H
                      </span>
                      <div>
                        <span className="font-bold text-slate-900 text-xs">Isoniazid (INH 100 mg / เม็ด)</span>
                        <span className="text-[11px] text-teal-900 font-bold ml-2">
                          ทานวันละ {hTabs} เม็ด ({hTabs * 100} mg) ก่อนนอน
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">เกณฑ์ CPG: 4-6 mg/kg/day</span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-bold text-slate-600 mr-1">เลือกจำนวนเม็ด:</span>
                    {[1, 1.5, 2, 2.5, 3, 3.5, 4].map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => {
                          setHTabs(val);
                          handleSaveRegimen('split', val, rTabs, zTabs, eTabs, vitBcoSig, fdcTabs);
                        }}
                        className={`min-w-[42px] py-1 px-2.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                          hTabs === val
                            ? 'bg-teal-700 text-white border-teal-700 shadow-sm ring-2 ring-teal-400/40'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                        }`}
                      >
                        {val} เม็ด
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. RIFAMPICIN (R) */}
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white transition-all space-y-2">
                  <div className="flex flex-wrap justify-between items-center gap-1">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-red-700 text-white font-black text-xs flex items-center justify-center">
                        R
                      </span>
                      <div>
                        <span className="font-bold text-slate-900 text-xs">
                          Rifampicin ({selectedPatient.weight < 50 ? 'แคปซูล 450 mg' : 'แคปซูล 300 mg'})
                        </span>
                        <span className="text-[11px] text-red-900 font-bold ml-2">
                          ทานวันละ {rTabs} แคปซูล ({selectedPatient.weight < 50 ? `${rTabs * 450} mg` : `${rTabs * 300} mg`}) ก่อนนอน
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">เกณฑ์ CPG: 10 mg/kg/day (สูงสุด 600mg)</span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-bold text-slate-600 mr-1">เลือกจำนวนแคปซูล:</span>
                    {[1, 1.5, 2, 2.5].map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => {
                          setRTabs(val);
                          handleSaveRegimen('split', hTabs, val, zTabs, eTabs, vitBcoSig, fdcTabs);
                        }}
                        className={`min-w-[42px] py-1 px-2.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                          rTabs === val
                            ? 'bg-red-700 text-white border-red-700 shadow-sm ring-2 ring-red-400/40'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                        }`}
                      >
                        {val} แคปซูล
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. PYRAZINAMIDE (Z) */}
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white transition-all space-y-2">
                  <div className="flex flex-wrap justify-between items-center gap-1">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-amber-700 text-white font-black text-xs flex items-center justify-center">
                        Z
                      </span>
                      <div>
                        <span className="font-bold text-slate-900 text-xs">Pyrazinamide (PZA 500 mg / เม็ด)</span>
                        <span className="text-[11px] text-amber-900 font-bold ml-2">
                          {zTabs === 0 ? 'งดยา (Off Z / เข้า Continuation Phase)' : `ทานวันละ ${zTabs} เม็ด (${zTabs * 500} mg) ก่อนนอน`}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">เกณฑ์ CPG: 20-30 mg/kg/day</span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-bold text-slate-600 mr-1">เลือกจำนวนเม็ด:</span>
                    {[0, 1, 1.5, 2, 2.5, 3, 3.5, 4].map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => {
                          setZTabs(val);
                          handleSaveRegimen('split', hTabs, rTabs, val, eTabs, vitBcoSig, fdcTabs);
                        }}
                        className={`min-w-[42px] py-1 px-2.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                          zTabs === val
                            ? 'bg-amber-700 text-white border-amber-700 shadow-sm ring-2 ring-amber-400/40'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                        }`}
                      >
                        {val === 0 ? '0 (งด)' : `${val} เม็ด`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. ETHAMBUTOL (E) */}
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white transition-all space-y-2">
                  <div className="flex flex-wrap justify-between items-center gap-1">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-blue-700 text-white font-black text-xs flex items-center justify-center">
                        E
                      </span>
                      <div>
                        <span className="font-bold text-slate-900 text-xs">Ethambutol (EMB 400 mg / เม็ด)</span>
                        <span className="text-[11px] text-blue-900 font-bold ml-2">
                          {eTabs === 0 ? 'งดยา (Off E / เข้า Continuation Phase)' : `ทานวันละ ${eTabs} เม็ด (${eTabs * 400} mg) ก่อนนอน`}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">เกณฑ์ CPG: 15-20 mg/kg/day</span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-bold text-slate-600 mr-1">เลือกจำนวนเม็ด:</span>
                    {[0, 1, 1.5, 2, 2.5, 3, 3.5, 4].map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => {
                          setETabs(val);
                          handleSaveRegimen('split', hTabs, rTabs, zTabs, val, vitBcoSig, fdcTabs);
                        }}
                        className={`min-w-[42px] py-1 px-2.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                          eTabs === val
                            ? 'bg-blue-700 text-white border-blue-700 shadow-sm ring-2 ring-blue-400/40'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                        }`}
                      >
                        {val === 0 ? '0 (งด)' : `${val} เม็ด`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. VIT B CO (VITAMIN B COMPLEX - ทดแทน VIT B6 ตามที่ผู้ใช้ระบุ) */}
                <div className="p-3.5 rounded-xl border border-emerald-300 bg-emerald-50/70 space-y-2">
                  <div className="flex flex-wrap justify-between items-center gap-1">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-emerald-700 text-white font-black text-xs flex items-center justify-center">
                        B
                      </span>
                      <div>
                        <span className="font-extrabold text-emerald-950 text-xs">
                          Vitamin B Complex (Vit B co)
                        </span>
                        <span className="bg-emerald-200 text-emerald-950 text-[10px] font-black px-2 py-0.5 rounded ml-2">
                          ทดแทน Vit B6 (รพ.เขาชัยสน)
                        </span>
                        <span className="text-[11px] text-emerald-900 font-bold ml-2">
                          วิธีรับประทาน: {vitBcoSig} หลังอาหาร (รวม {vitBcoSig === '1*3 pc' ? '3 เม็ด/วัน' : vitBcoSig === '1*2 pc' ? '2 เม็ด/วัน' : vitBcoSig === '1*1 pc' ? '1 เม็ด/วัน' : '0 เม็ด'})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold text-emerald-900 mr-1">เลือกขนาดและวิธีรับประทาน:</span>
                    {[
                      { sig: '1*3 pc', label: '1*3 pc (3 เม็ด/วัน - มาตรฐาน)', desc: 'เช้า กลางวัน เย็น มื้อละ 1 เม็ด' },
                      { sig: '1*2 pc', label: '1*2 pc (2 เม็ด/วัน)', desc: 'เช้า-เย็น มื้อละ 1 เม็ด' },
                      { sig: '1*1 pc', label: '1*1 pc (1 เม็ด/วัน)', desc: 'วันละ 1 เม็ด' },
                      { sig: '0', label: '0 (งดรับประทาน)', desc: 'ไม่มีการจ่าย Vit B co' }
                    ].map(item => (
                      <button
                        key={item.sig}
                        type="button"
                        onClick={() => {
                          setVitBcoSig(item.sig);
                          handleSaveRegimen('split', hTabs, rTabs, zTabs, eTabs, item.sig, fdcTabs);
                        }}
                        className={`py-1.5 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                          vitBcoSig === item.sig
                            ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm ring-2 ring-emerald-400/40'
                            : 'bg-white hover:bg-emerald-100/60 text-emerald-950 border-emerald-300'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            {/* Bottom Summary Strip */}
            <div className="pt-3 border-t border-slate-200 flex flex-wrap justify-between items-center gap-2 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold text-slate-800">สูตรยาที่จัดปัจจุบัน:</span>
                <span className="font-mono font-bold text-teal-950 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200 shadow-xs">
                  {generateRegimenSummary(dosingMode, hTabs, rTabs, zTabs, eTabs, vitBcoSig, fdcTabs)}
                </span>
                {savedRegimenNotice && (
                  <span className="text-emerald-700 font-bold flex items-center gap-1 animate-pulse">
                    <Check className="w-3.5 h-3.5" />
                    <span>บันทึกเข้าแฟ้มผู้ป่วยเรียบร้อย!</span>
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => onOpenAddVisitModal(selectedPatient.id)}
                className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl flex items-center gap-1 shadow-xs transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ ใช้สูตรนี้บันทึก Visit รับยา</span>
              </button>
            </div>
          </div>
        </div>

        {/* CLINICAL TABS: VISITS HISTORY (NEW) / ADR RECORDS / SOAP NOTES / MULTIDISCIPLINARY COLLABORATION / DDI */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          {/* Tabs bar */}
          <div className="flex border-b border-slate-200 bg-slate-50/70 p-1.5 gap-1.5 overflow-x-auto scrollbar-none">
            {/* VISITS TAB */}
            <button
              onClick={() => setDetailTab('visits')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                detailTab === 'visits'
                  ? 'bg-white text-teal-900 shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <CalendarCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>ประวัติการรับยา & วันนัด (Visits History)</span>
              <span className="bg-teal-100 text-teal-900 text-[10px] px-1.5 py-0.2 rounded-full font-bold font-mono">
                {selectedPatient.visits?.length || 0}
              </span>
            </button>

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
                  {matchedDdis.length}
                </span>
              )}
            </button>
          </div>

          <div className="p-5">
            {/* SUBTAB 0: VISITS HISTORY (MAIN USER REQUEST) */}
            {detailTab === 'visits' && (
              <div className="space-y-4">
                <div className="flex flex-wrap justify-between items-center gap-3">
                  <div>
                    <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                      <span>ประวัติการเบิกและรับยาทุก Visit (Patient Visits & Dispensing History)</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      แสดงข้อมูลทุกครั้งที่ผู้ป่วยมารับยา: วันที่, น้ำหนักตัว, สูตรยา, จำนวนวันยาที่ได้รับ, และวันนัดติดตาม
                    </p>
                  </div>
                  <button
                    onClick={() => onOpenAddVisitModal(selectedPatient.id)}
                    className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ บันทึกรับยา Visit ใหม่</span>
                  </button>
                </div>

                {/* Weight progression summary strip */}
                {(selectedPatient.visits?.length || 0) > 1 && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between text-xs gap-2">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-teal-600" />
                      <span>แนวโน้มน้ำหนักตัว:</span>
                    </span>
                    <div className="flex items-center gap-4 text-xs font-medium">
                      <span>น้ำหนักครั้งแรก: <strong>{selectedPatient.visits[0].weight} kg</strong></span>
                      <span>➔</span>
                      <span>ครั้งล่าสุด: <strong className="text-teal-900 font-bold">{selectedPatient.visits[selectedPatient.visits.length - 1].weight} kg</strong></span>
                      {(() => {
                        const diff = (selectedPatient.visits[selectedPatient.visits.length - 1].weight - selectedPatient.visits[0].weight).toFixed(1);
                        const isGain = parseFloat(diff) > 0;
                        return (
                          <span className={`px-2 py-0.5 rounded font-black ${isGain ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
                            {isGain ? `+${diff} kg (ดีขึ้น)` : `${diff} kg`}
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                )}

                {/* Visits List */}
                {(!selectedPatient.visits || selectedPatient.visits.length === 0) ? (
                  <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs space-y-2">
                    <Calendar className="w-8 h-8 mx-auto text-slate-300" />
                    <p>ยังไม่มีประวัติ Visit หรือการเบิกยาในระบบสำหรับผู้ป่วยรายนี้</p>
                    <button
                      onClick={() => onOpenAddVisitModal(selectedPatient.id)}
                      className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>บันทึกการรับยาครั้งแรก</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Render most recent visit first */}
                    {[...selectedPatient.visits].reverse().map((visit, idx) => {
                      const isLowW = visit.weight < 50;

                      return (
                        <div
                          key={visit.id || idx}
                          className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:shadow-md transition-all space-y-3"
                        >
                          <div className="flex flex-wrap justify-between items-start gap-2 border-b border-slate-200/80 pb-2.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="w-6 h-6 rounded-lg bg-teal-800 text-white font-black text-xs flex items-center justify-center">
                                #{selectedPatient.visits.length - idx}
                              </span>
                              <span className="font-extrabold text-xs text-slate-900 flex items-center gap-1 font-mono">
                                <Calendar className="w-3.5 h-3.5 text-teal-700" />
                                <span>วันที่มารับยา: {visit.visitDate}</span>
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                visit.dispenseStatus === 'Dispensed' || visit.dispenseStatus === 'Verified'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-amber-100 text-amber-900 border border-amber-300'
                              }`}>
                                {visit.dispenseStatus === 'Dispensed' ? 'จ่ายยาแล้ว (Dispensed)' : visit.dispenseStatus === 'Verified' ? 'ตรวจสอบแล้ว' : 'รอจ่ายยา (Pending)'}
                              </span>

                              {/* Medication Adherence Badge (User Request #3) */}
                              {visit.medicationTakingStatus === 'incorrect' ? (
                                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-100 text-rose-900 border border-rose-300 flex items-center gap-1 shadow-xs">
                                  <span>⚠️ กินยาไม่ถูกต้อง:</span>
                                  <span className="font-semibold">{visit.incorrectReason || 'มีลืมทานยา'}</span>
                                  {visit.missedDosesCount ? <span className="font-bold underline text-rose-950">({visit.missedDosesCount} มื้อ)</span> : null}
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span>กินยาถูกต้องครบถ้วน</span>
                                </span>
                              )}
                            </div>

                            <div className="text-right text-xs">
                              {visit.nextAppointmentDate ? (
                                <span className="flex items-center gap-1 font-bold text-teal-900 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                                  <span>วันนัดครั้งต่อไป:</span>
                                  <span className="font-mono text-teal-950 font-black">{visit.nextAppointmentDate}</span>
                                </span>
                              ) : (
                                <span className="text-slate-400">ไม่ได้ระบุวันนัด</span>
                              )}
                            </div>
                          </div>

                          {/* Grid with Visit Key Metrics: Weight, Regimen, Days of Supply */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                            <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                                น้ำหนักตัวใน Visit นี้
                              </span>
                              <span className={`text-sm font-black ${isLowW ? 'text-amber-800 font-bold' : 'text-slate-900'}`}>
                                {visit.weight} kg {isLowW && '(BW < 50)'}
                              </span>
                            </div>

                            <div className="p-2.5 bg-white rounded-xl border border-slate-200 sm:col-span-2">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                                สูตรยา & จำนวนวันที่รับยา
                              </span>
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-teal-950">{visit.regimen}</span>
                                <span className="text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md">
                                  จ่ายยา {visit.daysOfSupply} วัน
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Dispensed Items */}
                          {visit.dispensedItems && visit.dispensedItems.length > 0 && (
                            <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs">
                              <span className="font-bold text-slate-700 block mb-1">รายการยาที่เบิก/จ่าย:</span>
                              <div className="flex flex-wrap gap-1.5">
                                {visit.dispensedItems.map((item, i) => (
                                  <span key={i} className="px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-800 font-medium">
                                    {item.drugName} {item.quantity ? `(${item.quantity})` : ''}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Notes and Handlers */}
                          <div className="flex flex-wrap justify-between items-center text-[11px] text-slate-500 gap-2 pt-1 border-t border-slate-100">
                            <div>
                              <span>ผู้เบิก: {visit.nurseRequisitionBy || 'พยาบาล TB'}</span>
                              <span className="mx-1.5">•</span>
                              <span>ผู้จ่าย: {visit.dispensedBy || 'ภก.คลินิก'}</span>
                              {visit.sideEffectsNoted && (
                                <span className="ml-2 text-slate-700 font-medium italic">
                                  "{visit.sideEffectsNoted}"
                                </span>
                              )}
                            </div>

                            {visit.dispenseStatus === 'Pending' && (
                              <button
                                onClick={() => onMarkVisitDispensed(selectedPatient.id, visit.id)}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1"
                              >
                                <Check className="w-3 h-3" />
                                <span>เภสัชกรบันทึกจ่ายยาแล้ว</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

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

                <form onSubmit={handlePostNote} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="พิมพ์ข้อความส่งต่อทีมสหสาขา (เช่น ผลตรวจ LFT, สั่งเบิกยาเพิ่ม หรือบันทึกวันนัด)..."
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

                <div className="space-y-2.5 max-h-[350px] overflow-y-auto">
                  {selectedPatient.multidisciplinaryNotes.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs">
                      ยังไม่มีบันทึกข้อความจากทีมสหสาขาวิชาชีพ
                    </div>
                  ) : (
                    selectedPatient.multidisciplinaryNotes.map(note => (
                      <div
                        key={note.id}
                        className="p-3 rounded-xl border border-slate-200 bg-white shadow-xs space-y-1"
                      >
                        <div className="flex justify-between items-center text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold px-2 py-0.5 rounded text-[10px] bg-teal-100 text-teal-900 border border-teal-200">
                              {note.sender}
                            </span>
                            <span className="text-[10px] text-slate-400">{note.date}</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-700 pl-1">{note.text}</p>
                      </div>
                    ))
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

      {/* 🗑️ CONFIRM DELETE / DISCHARGE (D/C) PATIENT MODAL */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-200 space-y-4">
            <div className="flex justify-between items-start gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">
                    ยืนยันการจำหน่าย (D/C) หรือลบรายชื่อผู้ป่วย
                  </h3>
                  <p className="text-xs text-slate-500">
                    ผู้ป่วย: <strong className="text-rose-900">{selectedPatient.name}</strong> (HN: {selectedPatient.hn})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDeleteConfirmModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-2xl text-xs text-rose-950 space-y-2">
              <label className="font-bold block">สาเหตุการจำหน่าย (D/C) / ลบออกจากทะเบียน:</label>
              <select
                value={dcReason}
                onChange={(e) => setDcReason(e.target.value)}
                className="w-full p-2 bg-white border border-rose-300 rounded-xl font-bold text-slate-800"
              >
                <option value="รักษาครบหายขาด (Cured / Treatment Completed)">รักษาครบหายขาด (Cured / Treatment Completed)</option>
                <option value="ส่งต่อรักษาที่สถานพยาบาลอื่น (Transfer Out)">ส่งต่อรักษาที่สถานพยาบาลอื่น (Transfer Out)</option>
                <option value="เปลี่ยนวินิจฉัย / ไม่ใช่วัณโรค (Diagnosis Changed)">เปลี่ยนวินิจฉัย / ไม่ใช่วัณโรค (Diagnosis Changed)</option>
                <option value="ข้อมูลซ้ำซ้อน / ลบรายชื่อ">ข้อมูลซ้ำซ้อน / ลบรายชื่อ</option>
              </select>
              <p className="text-[11px] text-rose-800 leading-relaxed">
                * เมื่อยืนยันแล้ว รายชื่อผู้ป่วยรายนี้จะถูกนำออกจากทะเบียนผู้ป่วยที่กำลังดูแลอยู่ (Active TB Registry)
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 text-xs">
              <button
                type="button"
                onClick={() => setShowDeleteConfirmModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleConfirmDeletePatient}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>ยืนยัน D/C / ลบรายชื่อ</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
