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
