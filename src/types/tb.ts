export interface ADRRecord {
  id: string;
  date: string;
  drug: string;
  reaction: string;
  severity: 'Mild' | 'Moderate' | 'Severe' | 'Life-threatening';
  action: string;
  status: 'Active' | 'Resolved' | 'Under Investigation';
  reporter: string;
}

export interface SOAPNote {
  id: string;
  date: string;
  author: string;
  problem: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export interface MultidisciplinaryNote {
  id: string;
  date: string;
  sender: string;
  role: 'Pharmacist' | 'Physician' | 'Nurse' | 'DOTs Worker';
  text: string;
}

export interface AlertItem {
  id: string;
  type: 'Critical' | 'Warning' | 'Info' | 'Success';
  text: string;
  date?: string;
}

export interface DispensedItem {
  drugName: string;
  quantity: string;
  instructions?: string;
}

export interface PatientVisit {
  id: string;
  visitDate: string; // YYYY-MM-DD
  weight: number; // kg at this visit
  regimen: string; // Regimen at this visit
  daysOfSupply: number; // e.g. 7, 14, 28 days
  dispenseStatus: 'Pending' | 'Dispensed' | 'Verified'; // รอจัด/จ่าย หรือ จ่ายยาแล้ว
  medicationTakingStatus?: 'correct' | 'incorrect'; // การประเมิน: กินยาถูกต้อง หรือ กินยาไม่ถูกต้อง
  incorrectReason?: string; // สาเหตุหากกินยาไม่ถูกต้อง (เช่น ลืมกินยา, ผลข้างเคียง, หยุดยาเอง)
  missedDosesCount?: number; // จำนวนมื้อที่ลืมกินยา
  dispensedBy?: string; // เภสัชกรผู้จ่ายยา
  nurseRequisitionBy?: string; // พยาบาลผู้ส่งใบเบิกยา
  dispensedItems?: DispensedItem[]; // รายการยาและจำนวนเม็ดที่จ่าย
  nextAppointmentDate?: string; // วันที่นัดติดตามครั้งต่อไป
  notes?: string; // บันทึกเพิ่มเติม หรือ ผลการติดตาม
  sideEffectsNoted?: string; // อาการข้างเคียงที่ตรวจพบ
}

export interface PatientCustomDoses {
  hTabs?: number; // Isoniazid (100mg) เม็ด
  rTabs?: number; // Rifampicin แคปซูล
  zTabs?: number; // Pyrazinamide (500mg) เม็ด
  eTabs?: number; // Ethambutol (400mg) เม็ด
  vitBcoSig?: string; // e.g. "1*3 pc"
  fdcTabs?: number; // 4FDC เม็ด
  mode?: 'split' | 'fdc';
}

export interface Patient {
  id: string;
  hn: string;
  name: string;
  age: number;
  gender: 'ชาย' | 'หญิง';
  weight: number;
  height: number;
  bmi: number;
  patientType: string;
  hivStatus: 'Negative' | 'Positive' | 'Unknown';
  diagnosis: string;
  regimenId: string;
  regimenName: string;
  regimenMonths: number;
  monthOfTreatment: number;
  sputumStatus: 'Negative' | 'Positive';
  extendedPhase: boolean;
  extendedMonths: number;
  adherenceRate: number; // e.g., 95%
  dotType: 'Hospital DOT' | 'Health Center DOT' | 'Family DOT' | 'V-DOT' | 'Self-administered';
  concomitantMeds?: string[];
  scr?: number;
  nextAppointmentDate?: string; // วันที่นัดครั้งถัดไป
  phoneNumber?: string; // เบอร์โทรศัพท์ผู้ป่วย/ญาติ
  visits: PatientVisit[]; // ประวัติการเบิกและรับยาทุก Visit
  hosxpNotes?: string; // บันทึกการบริบาลเภสัชกรรมจากระบบ HosXP
  hosxpLastUpdated?: string; // วันเวลาที่อัปเดตข้อมูล HosXP ล่าสุด
  hosxpUpdatedBy?: string; // ผู้บันทึกข้อมูล HosXP
  customDoses?: PatientCustomDoses; // สูตรยาและจำนวนเม็ดที่เภสัชกรปรับแต่งรายบุคคล
  lft?: {
    ast: number;
    alt: number;
    tbili: number;
    alp?: number;
    date: string;
  };
  rechallengeStatus?: {
    active: boolean;
    currentStep: number;
    hPassed?: boolean;
    rPassed?: boolean;
    zPassed?: boolean;
    notes?: string;
  };
  adrRecords: ADRRecord[];
  soapNotes: SOAPNote[];
  multidisciplinaryNotes: MultidisciplinaryNote[];
  alerts: AlertItem[];
}

export interface CPGRegimen {
  id: string;
  category: 'DS-TB' | 'DR-TB (Mono/Poly)' | 'MDR/RR-TB' | 'Drug Reaction / Allergy' | 'Special Population';
  name: string;
  description: string;
  durationMonths: number;
  type: string;
  dosingInfo: string;
  phase1: string;
  phase2: string;
  referenceTable?: string;
  keyNotes?: string;
}

export interface DrugDosingDetail {
  code: string;
  genericName: string;
  thaiName: string;
  dailyDoseMgPerKg: string;
  standardDoseMg: string;
  maxDoseMg: number;
  availableStrengths: string;
  takeTiming: string;
  adverseEffects: string;
  monitoring: string;
  renalAdjustment: string;
  hepaticNotes: string;
}

export interface DrugInteraction {
  drug: string;
  category: string;
  mechanism: string;
  severity: 'Major / Contraindicated' | 'Moderate / Dose Adjust' | 'Minor / Monitor';
  clinicalImpact: string;
  pharmacistRecommendation: string;
}
