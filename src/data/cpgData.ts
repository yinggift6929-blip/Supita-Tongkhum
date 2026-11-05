import { CPGRegimen, DrugDosingDetail, DrugInteraction, Patient } from '../types/tb';

export const CPG_REGIMENS: CPGRegimen[] = [
  {
    id: "STD_2HRZE_4HR_LOW",
    category: "DS-TB",
    name: "2HRZE / 4HR (BW < 50 kg)",
    description: "สูตรมาตรฐานผู้ป่วยรายใหม่ ไวต่อยา น้ำหนักตัว < 50 kg (คำนวณแยกเม็ดตามน้ำหนักตัวจริง)",
    durationMonths: 6,
    type: "New / Sensitive",
    dosingInfo: "H(300mg) + R(450mg) + Z(750-1000mg) + E(600-800mg) ใน 2 เดือนแรก",
    phase1: "2 เดือน (HRZE)",
    phase2: "4 เดือน (HR)",
    referenceTable: "ตาราง 3.1 & 3.2",
    keyNotes: "ห้ามใช้สูตร FDC 4 เม็ดในคนไข้น้ำหนักน้อยเกินไป เพราะเสี่ยงต่อการได้รับยา Z หรือ E เกินขนาดและเกิดพิษต่อตับ/สายตา"
  },
  {
    id: "STD_2HRZE_4HR_STD",
    category: "DS-TB",
    name: "2(HRZE) / 4(HR) (BW ≥ 50 kg)",
    description: "สูตรมาตรฐานผู้ป่วยรายใหม่ ไวต่อยา น้ำหนักตัว ≥ 50 kg (FDC หรือ Dose มาตรฐาน)",
    durationMonths: 6,
    type: "New / Sensitive",
    dosingInfo: "H(300mg) + R(600mg) + Z(1500mg) + E(1000-1200mg) หรือ 4FDC 4 เม็ด/วัน ใน 2 เดือนแรก",
    phase1: "2 เดือน (HRZE)",
    phase2: "4 เดือน (HR)",
    referenceTable: "ตาราง 3.1",
    keyNotes: "หากใช้ Fixed-Dose Combination (FDC): น้ำหนัก 38-54 kg = 3 เม็ด, 55-70 kg = 4 เม็ด, >70 kg = 5 เม็ด"
  },
  {
    id: "STD_EXTENDED_CNS_BONE",
    category: "DS-TB",
    name: "2HRZE / 7-10HR (TB สมอง/กระดูกและข้อ)",
    description: "สูตรขยายระยะเวลาสำหรับ TB เยื่อหุ้มสมอง (TB Meningitis) หรือ TB กระดูกและข้อ (Bone/Joint)",
    durationMonths: 12,
    type: "Severe Extrapulmonary",
    dosingInfo: "HRZE 2 เดือนแรก ตามด้วย HR อีก 7-10 เดือน (รวม 9-12 เดือน) พร้อมพิจารณา Dexamethasone/Prednisolone ในระยะแรก",
    phase1: "2 เดือน (HRZE)",
    phase2: "7-10 เดือน (HR)",
    referenceTable: "บทที่ 3 ข้อ 3.3",
    keyNotes: "ใน TB เยื่อหุ้มสมอง แนะนำให้สเตียรอยด์ (Dexamethasone หรือ Prednisolone) ร่วมด้วย 6-8 สัปดาห์แรก แล้วค่อยๆ ปรับลดยา"
  },
  {
    id: "MONO_H_FQ_SENS",
    category: "DR-TB (Mono/Poly)",
    name: "6RZEFQs (ดื้อ Isoniazid / ไม่ดื้อ FQs)",
    description: "ตาราง 6.2: กรณีดื้อ H ขนานเดียว (Hr-TB) และผลตรวจไวต่อยา Fluoroquinolones (Lfx/Mfx)",
    durationMonths: 6,
    type: "Hr-TB",
    dosingInfo: "R + Z + E + Levofloxacin (หรือ Moxifloxacin) นาน 6 เดือนเต็ม",
    phase1: "6 เดือน (RZE + FQs)",
    phase2: "-",
    referenceTable: "ตาราง 6.2",
    keyNotes: "ตรวจผลความไวต่อ Fluoroquinolones ก่อนเริ่มสูตรนี้ทุกราย แนะนำให้ Levofloxacin 750-1000 mg/day"
  },
  {
    id: "MONO_H_FQ_RES",
    category: "DR-TB (Mono/Poly)",
    name: "6RZE (ดื้อ Isoniazid / ดื้อหรือสงสัยดื้อ FQs)",
    description: "ตาราง 6.2: กรณีดื้อ H ขนานเดียว และดื้อหรือไม่แน่ใจผลตรวจ Fluoroquinolones",
    durationMonths: 6,
    type: "Hr-TB",
    dosingInfo: "R + Z + E นาน 6 เดือนเต็ม",
    phase1: "6 เดือน (RZE)",
    phase2: "-",
    referenceTable: "ตาราง 6.2",
    keyNotes: "ไม่ควรเติมยาตัวใหม่เพียงตัวเดียวเข้าไปในสูตรที่สงสัยล้มเหลว"
  },
  {
    id: "MONO_Z",
    category: "DR-TB (Mono/Poly)",
    name: "2HRE / 7HR (ดื้อ Pyrazinamide หรือ M. bovis)",
    description: "ตาราง 6.2: กรณีดื้อ Z ขนานเดียว หรือติดเชื้อ M. bovis ซึ่งดื้อ Z ตามธรรมชาติ",
    durationMonths: 9,
    type: "Mono-Z",
    dosingInfo: "2 เดือน (HRE) ตามด้วย 7 เดือน (HR) รวม 9 เดือน",
    phase1: "2 เดือน (HRE)",
    phase2: "7 เดือน (HR)",
    referenceTable: "ตาราง 6.2",
    keyNotes: "เชื้อ Mycobacterium bovis ดื้อต่อ Pyrazinamide ตามธรรมชาติ ต้องขยายระยะเวลาเป็น 9 เดือน"
  },
  {
    id: "MONO_E",
    category: "DR-TB (Mono/Poly)",
    name: "2HRZ / 4HR (ดื้อ Ethambutol ขนานเดียว)",
    description: "ตาราง 6.2: กรณีดื้อ E ขนานเดียว โดยยังไวต่อ H, R, Z",
    durationMonths: 6,
    type: "Mono-E",
    dosingInfo: "2 เดือน (HRZ) ตามด้วย 4 เดือน (HR) รวม 6 เดือน",
    phase1: "2 เดือน (HRZ)",
    phase2: "4 เดือน (HR)",
    referenceTable: "ตาราง 6.2",
    keyNotes: "สามารถใช้ระยะเวลา 6 เดือนเท่าเดิมได้หาก H, R, Z ยังไวดี"
  },
  {
    id: "POLY_HZ",
    category: "DR-TB (Mono/Poly)",
    name: "9-12 REFQs (ดื้อ H + Z พร้อมกัน)",
    description: "ตาราง 6.2: กรณีดื้อทั้ง Isoniazid และ Pyrazinamide พร้อมกัน",
    durationMonths: 12,
    type: "Poly-DR",
    dosingInfo: "R + E + Levofloxacin (หรือ Mfx) นาน 9-12 เดือน",
    phase1: "9-12 เดือน (REFQs)",
    phase2: "-",
    referenceTable: "ตาราง 6.2",
    keyNotes: "ติดตามผลตรวจเสมหะเพาะเชื้อและประเมินภาพรังสีทรวงอกอย่างต่อเนื่อง"
  },
  {
    id: "POLY_HE",
    category: "DR-TB (Mono/Poly)",
    name: "6-9 RZFQs (ดื้อ H + E พร้อมกัน)",
    description: "ตาราง 6.2: กรณีดื้อทั้ง Isoniazid และ Ethambutol พร้อมกัน",
    durationMonths: 9,
    type: "Poly-DR",
    dosingInfo: "R + Z + Levofloxacin (หรือ Mfx) นาน 6-9 เดือน",
    phase1: "6-9 เดือน (RZFQs)",
    phase2: "-",
    referenceTable: "ตาราง 6.2",
    keyNotes: "พิจารณาให้ 9 เดือนในผู้ป่วยที่มีรอยโรคในปอดกว้างขวางหรือมีโพรงแผล (Cavity)"
  },
  {
    id: "MDR_SHORTER_ALL_ORAL",
    category: "MDR/RR-TB",
    name: "Shorter All-Oral Bdq Regimen (9-11 เดือน)",
    description: "สูตรสั้นกินล้วนสำหรับ MDR/RR-TB (4-6 Bdq-Lfx-Pto-Cfz-Z-E-Hh / 5 Lfx-Cfz-Z-E)",
    durationMonths: 11,
    type: "MDR/RR-TB",
    dosingInfo: "4-6 เดือน (Bdq+Lfx+Pto+Cfz+Z+E+High-dose H) / 5 เดือน (Lfx+Cfz+Z+E)",
    phase1: "4-6 เดือน (Bdq-Lfx-Pto-Cfz-Z-E-Hh)",
    phase2: "5 เดือน (Lfx-Cfz-Z-E)",
    referenceTable: "บทที่ 6 ข้อ 6.2",
    keyNotes: "สูตรแนะนำอันดับแรกสำหรับ MDR/RR-TB ที่ไม่เคยดื้อยา Second-line และไม่มีประวัติสัมผัสยาเกิน 1 เดือน ติดตาม EKG (QTc) สม่ำเสมอ"
  },
  {
    id: "MDR_BPAL_REGIMEN",
    category: "MDR/RR-TB",
    name: "BPaL / BPaLM Regimen (6 เดือน)",
    description: "สูตรใหม่ 6 เดือน Bedaquiline + Pretomanid + Linezolid (± Moxifloxacin)",
    durationMonths: 6,
    type: "MDR/Pre-XDR",
    dosingInfo: "Bdq (400mg 2 สัปดาห์แรก แล้ว 200mg 3 ครั้ง/สัปดาห์) + Pa (200mg/วัน) + Lzd (600mg/วัน) ± Mfx (400mg/วัน) นาน 26 สัปดาห์",
    phase1: "6 เดือน (BPaLM)",
    phase2: "-",
    referenceTable: "CPG 2021 Update / WHO 2022",
    keyNotes: "ต้องติดตามอาการข้างเคียงของ Linezolid อย่างใกล้ชิด (Peripheral neuropathy, Myelosuppression, Optic neuritis)"
  },
  {
    id: "MDR_LONGER_INDIVIDUAL",
    category: "MDR/RR-TB",
    name: "Individualized Longer Regimen (≥ 18 เดือน)",
    description: "สูตรยาวปรับเฉพาะรายจากกลุ่มยา WHO Group A, B, C (อ้างอิง ตาราง 6.1)",
    durationMonths: 18,
    type: "MDR/Pre-XDR",
    dosingInfo: "เลือกใช้อย่างน้อย 4 ขนานในระยะแรก (Group A: Lfx/Mfx, Bdq, Lzd | Group B: Cfz, Cs/Trd)",
    phase1: "6-8 เดือน (Intensive Phase)",
    phase2: "12-14 เดือน (Continuation Phase)",
    referenceTable: "ตาราง 6.1",
    keyNotes: "ใช้ในผู้ป่วยที่ไม่เข้าเกณฑ์สูตรสั้น เช่น ดื้อต่อ FQs, เคยใช้ยา Second-line มาก่อน, หรือทนต่อยาบางตัวในสูตรสั้นไม่ได้"
  },
  {
    id: "ADR_HEPATIC_2HEP",
    category: "Drug Reaction / Allergy",
    name: "2HRE / 7HR (ตับอักเสบ งด Pyrazinamide)",
    description: "กรณีเกิด Hepatotoxicity จาก Z หรือต้องหลีกเลี่ยงยาที่มีพิษต่อตับสูง (ใช้ยา Hepatotoxic 2 ชนิด: H & R)",
    durationMonths: 9,
    type: "Hepato-safe (2 Hepatotoxic)",
    dosingInfo: "2 เดือน (HRE) ตามด้วย 7 เดือน (HR) รวม 9 เดือน",
    phase1: "2 เดือน (HRE)",
    phase2: "7 เดือน (HR)",
    referenceTable: "บทที่ 5 ตาราง 5.2",
    keyNotes: "สูตรปลอดภัยต่อตับระดับปานกลาง ใช้เมื่อพิสูจน์ได้ว่า Z เป็นสาเหตุของ DILI หรือผู้ป่วยมีโรคตับเรื้อรังคงที่"
  },
  {
    id: "ADR_HEPATIC_1HEP",
    category: "Drug Reaction / Allergy",
    name: "12-18 HE + Lfx (ตับอักเสบรุนแรง/งด R&Z)",
    description: "กรณีตับอักเสบรุนแรง (Fulminant) หรือตับแข็งรุนแรง หลีกเลี่ยง R และ Z (ใช้ยา Hepatotoxic 1 ชนิดคือ H)",
    durationMonths: 18,
    type: "Hepato-safe (1 Hepatotoxic)",
    dosingInfo: "H + E + Levofloxacin นาน 12-18 เดือน",
    phase1: "12-18 เดือน (HE + Lfx)",
    phase2: "-",
    referenceTable: "บทที่ 5 ตาราง 5.2",
    keyNotes: "ใช้เมื่อผู้ป่วยไม่สามารถทนต่อ Rifampicin และ Pyrazinamide ได้"
  },
  {
    id: "ADR_HEPATIC_NON_HEP",
    category: "Drug Reaction / Allergy",
    name: "18-24 E + Lfx + Cfz + Amk/Lzd (งด H, R, Z ทั้งหมด)",
    description: "กรณีตับวายขั้นวิกฤต หรือไม่สามารถใช้ยาที่มีพิษต่อตับได้เลย (0 Hepatotoxic drugs)",
    durationMonths: 24,
    type: "Zero-Hepatotoxic",
    dosingInfo: "Ethambutol + Levofloxacin + Clofazimine + (Amikacin ฉีด 2-3 เดือนแรก หรือ Linezolid) นาน 18-24 เดือน",
    phase1: "2-3 เดือนแรก (E + Lfx + Cfz + Amk)",
    phase2: "18-21 เดือนหลัง (E + Lfx + Cfz)",
    referenceTable: "บทที่ 5 ตาราง 5.2",
    keyNotes: "สูตรปลอดพิษต่อตับ 100% แต่ประสิทธิภาพต่ำกว่าและต้องรักษานาน 18-24 เดือน"
  }
];

export const FIRST_LINE_DRUGS: DrugDosingDetail[] = [
  {
    code: "H",
    genericName: "Isoniazid (INH)",
    thaiName: "ไอโซไนอะซิด",
    dailyDoseMgPerKg: "4 - 6 mg/kg/day (เฉลี่ย 5 mg/kg)",
    standardDoseMg: "300 mg วันละครั้ง",
    maxDoseMg: 300,
    availableStrengths: "100 mg เม็ด, 50 mg/5 mL น้ำเชื่อม",
    takeTiming: "ก่อนนอน (hs)",
    adverseEffects: "ตับอักเสบ (Hepatotoxicity), ชาปลายมือปลายเท้า (Peripheral neuropathy), ผื่นแพ้ยา",
    monitoring: "LFT ก่อนเริ่มและเมื่อมีอาการ, อาการชาปลายประสาท",
    renalAdjustment: "ไตวายระยะสุดท้าย (CrCl < 30): ให้ 300 mg/day หรือ 300 mg สัปดาห์ละ 3 ครั้ง",
    hepaticNotes: "มีพิษต่อตับระดับปานกลาง ให้หยุดเมื่อ AST/ALT > 3x UNL ร่วมกับมีอาการ หรือ > 5x UNL แม้ไม่มีอาการ. ให้ Pyridoxine 50-100 mg/day เสมอในกลุ่มเสี่ยง"
  },
  {
    code: "R",
    genericName: "Rifampicin (RMP)",
    thaiName: "ไรแฟมพิซิน",
    dailyDoseMgPerKg: "8 - 12 mg/kg/day (เฉลี่ย 10 mg/kg)",
    standardDoseMg: "BW < 50 kg: 450 mg/day | BW ≥ 50 kg: 600 mg/day",
    maxDoseMg: 600,
    availableStrengths: "300 mg แคปซูล, 450 mg แคปซูล, 600 mg แคปซูล",
    takeTiming: "ก่อนนอน (hs)",
    adverseEffects: "ปัสสาวะ/อุจจาระ/น้ำตา/เหงื่อสีส้มแดง (ปกติ), คลื่นไส้, ตับอักเสบ (Cholestatic), Thrombocytopenia",
    monitoring: "LFT, CBC (เกล็ดเลือด), ตรวจสอบ Drug Interactions (CYP3A4 Inducer ที่แรงมาก)",
    renalAdjustment: "ไม่ต้องปรับขนาดยาในผู้ป่วยไตวาย (ขับออกทางตับเป็นหลัก)",
    hepaticNotes: "ทำให้เกิด Cholestatic jaundice หรือ Bilirubin สูงเด่นได้บ่อย และเร่งการทำงานของเอนไซม์กำจัดยาตับ"
  },
  {
    code: "Z",
    genericName: "Pyrazinamide (PZA)",
    thaiName: "ไพราซินาไมด์",
    dailyDoseMgPerKg: "20 - 30 mg/kg/day (เฉลี่ย 25 mg/kg)",
    standardDoseMg: "BW < 50 kg: 750 - 1000 mg/day | BW ≥ 50 kg: 1500 mg/day",
    maxDoseMg: 2000,
    availableStrengths: "500 mg เม็ด",
    takeTiming: "ก่อนนอน (hs)",
    adverseEffects: "พิษต่อตับรุนแรงที่สุดในกลุ่ม First-line (DILI), ปวดข้อจากกรดยูริกสูง (Hyperuricemia), ผื่นแพ้แสง",
    monitoring: "LFT, Uric acid หากมีอาการปวดข้อคล้ายเกาต์",
    renalAdjustment: "ไตวาย (CrCl < 30): ปรับเป็น 25-35 mg/kg สัปดาห์ละ 3 ครั้ง (ให้หลังฟอกเลือด)",
    hepaticNotes: "เป็นยาที่ทำให้เกิดตับอักเสบ (Hepatotoxicity) รุนแรงที่สุด หากเกิด DILI มักไม่นำกลับมา Re-challenge อีก"
  },
  {
    code: "E",
    genericName: "Ethambutol (EMB)",
    thaiName: "อีแทมบูทอล",
    dailyDoseMgPerKg: "15 - 20 mg/kg/day (เฉลี่ย 15 mg/kg)",
    standardDoseMg: "BW < 50 kg: 600 - 800 mg/day | BW ≥ 50 kg: 1000 - 1200 mg/day",
    maxDoseMg: 1600,
    availableStrengths: "400 mg เม็ด, 500 mg เม็ด",
    takeTiming: "ก่อนนอน (hs)",
    adverseEffects: "ประสาทตาอักเสบ (Retrobulbar Optic Neuritis) ตามัว แยกสีแดง-เขียวผิดปกติ, อาการชาปลายมือ",
    monitoring: "การมองเห็น (Visual Acuity) และการตรวจสี (Color Vision) ทุกเดือน",
    renalAdjustment: "ไตวาย (CrCl < 30): ปรับเป็น 15-25 mg/kg สัปดาห์ละ 3 ครั้ง (ยาขับออกทางไตสูง เสี่ยงสะสมทำลายจอประสาทตา)",
    hepaticNotes: "ไม่มีพิษต่อตับ เป็นยาที่ปลอดภัยที่สุดต่อตับในกลุ่มยาแนวหน้า"
  },
  {
    code: "S",
    genericName: "Streptomycin (SM)",
    thaiName: "สเตรปโตมัยซิน (ยาฉีด)",
    dailyDoseMgPerKg: "12 - 18 mg/kg/day (เฉลี่ย 15 mg/kg)",
    standardDoseMg: "BW < 50 kg: 500 - 750 mg IM/IV วันละครั้ง | BW ≥ 50 kg: 750 - 1000 mg (ผู้สูงอายุ > 60 ปี max 500-750 mg)",
    maxDoseMg: 1000,
    availableStrengths: "1 g/vial ผงฉีด",
    takeTiming: "ฉีดเข้ากล้ามเนื้อ (IM) หรือหยดเข้าหลอดเลือดดำ (IV) ช้าๆ",
    adverseEffects: "พิษต่อหูและการได้ยิน/การทรงตัว (Ototoxicity), พิษต่อไต (Nephrotoxicity), ปวดบริเวณที่ฉีด",
    monitoring: "BUN, Serum Creatinine, การตรวจการได้ยิน (Audiometry), อาการเวียนศีรษะทรงตัวไม่อยู่",
    renalAdjustment: "ปรับลดขนาดยาหรือยืดระยะเวลาห่างออกไปตามค่า CrCl ห้ามใช้ถ้าไตวายรุนแรง",
    hepaticNotes: "ไม่มีพิษต่อตับ ใช้เป็นยาทางเลือกเมื่อตับอักเสบขั้นรุนแรง"
  }
];

export const FDC_BANDS = [
  { range: "30 - 37 kg", tabs4FDC: "2 เม็ด", tabs2FDC: "2 เม็ด", notes: "ควรพิจารณาแยกเม็ดถ้าทำได้เพื่อความแม่นยำ" },
  { range: "38 - 54 kg", tabs4FDC: "3 เม็ด", tabs2FDC: "3 เม็ด", notes: "ขนาดมาตรฐานสูตร FDC สำหรับผู้ป่วยน้ำหนักปานกลาง" },
  { range: "55 - 70 kg", tabs4FDC: "4 เม็ด", tabs2FDC: "4 เม็ด", notes: "ขนาดแนะนำยอดนิยมสำหรับผู้ใหญ่" },
  { range: "> 70 kg", tabs4FDC: "5 เม็ด", tabs2FDC: "5 เม็ด", notes: "อาจแบ่งทานหรือติดตามอาการไม่พึงประสงค์ทางระบบทางเดินอาหาร" }
];

export const RECHALLENGE_STEPS = [
  {
    step: 1,
    title: "หยุดยาและรอให้ตับฟื้นตัว (Washout Phase)",
    text: "หยุดยา TB ทั้งหมดทันที ติดตาม LFT ทุกสัปดาห์ จนกว่า AST/ALT < 2 เท่าของค่าบนปกติ (UNL) และ Total Bilirubin < 1.5 mg/dL",
    target: "AST/ALT < 2x UNL, T.Bili < 1.5 mg/dL",
    actionNote: "ระหว่างรอ หากอาการวัณโรครุนแรง พิจารณาให้ Non-hepatotoxic regimen ชั่วคราว (เช่น E + Lfx + Amikacin)"
  },
  {
    step: 2,
    title: "สัปดาห์ที่ 1: Re-challenge ยา Isoniazid (H)",
    text: "เริ่ม Isoniazid (H) ในขนาดปกติ (300 mg/day) หรือเริ่ม Challenge dose 50-100 mg ในวันแรก แล้วปรับเป็น 300 mg/day เจาะ LFT ติดตามเมื่อครบ 7 วัน",
    target: "LFT ยังคงปกติ ไม่สูงเกิน 2-3x UNL",
    actionNote: "หากเอนไซม์ตับสูงขึ้นผิดปกติ ให้หยุด H ทันที และสรุปว่าแพ้/เกิดพิษจาก H"
  },
  {
    step: 3,
    title: "สัปดาห์ที่ 2: Re-challenge ยา Rifampicin (R)",
    text: "หาก H ผ่านไปด้วยดี ให้คงยา H ไว้ และเริ่มยา Rifampicin (R) ในขนาดปกติ (450 mg หรือ 600 mg/day) เจาะ LFT ติดตามเมื่อครบ 7 วัน",
    target: "LFT และ Bilirubin ยังคงปกติ",
    actionNote: "หากเอนไซม์ตับหรือบิลิรูบินพุ่งสูงขึ้น ให้หยุด R ทันที และวางแผนใช้สูตรไร้ Rifampicin"
  },
  {
    step: 4,
    title: "สัปดาห์ที่ 3: พิจารณา Re-challenge ยา Pyrazinamide (Z)",
    text: "หากเกิด DILI รุนแรงในตอนแรก แนะนำให้ 'งดเว้น' การ Re-challenge ยา Z ถาวร และเปลี่ยนเป็นสูตร 2HRE/7HR หรือ 9HRE แทน. หากจำเป็นต้องลอง ให้เริ่ม Z ขนาด 500 mg ปรับเป็นขนาดเต็มและเจาะ LFT อย่างใกล้ชิด",
    target: "ไม่มีอาการคลื่นไส้ เบื่ออาหาร ตัวเหลือง เอนไซม์ตับปกติ",
    actionNote: "CPG 2021 ระบุชัดเจน: หาก DILI รุนแรง ไม่แนะนำให้ Re-challenge Z เพราะมีอัตราการเกิดซ้ำสูงที่สุด"
  },
  {
    step: 5,
    title: "การสรุปผลและปรับสูตรยาถาวร (Final Regimen)",
    text: "หากผ่าน H และ R ได้สำเร็จ ให้ดำเนินสูตร 2HRE / 7HR ต่อจนครบ 9 เดือน หรือปรับตามผลการ Re-challenge",
    target: "การรักษาต่อเนื่องจนครบตามแผนโดยตับไม่เกิดการอักเสบซ้ำ",
    actionNote: "บันทึกประวัติการแพ้/เกิดพิษต่อตับในระบบ รพ. และมอบบัตรเตือนแพ้ยาแก่ผู้ป่วย"
  }
];

export const DRUG_INTERACTIONS: DrugInteraction[] = [
  {
    drug: "Dolutegravir (DTG) / Bictegravir (BIC)",
    category: "HIV Antiretroviral (INSTI)",
    mechanism: "Rifampicin กระตุ้น CYP3A4 และ UGT1A1 อย่างรุนแรง ทำให้ระดับยา DTG ลดลงกว่า 50-75%",
    severity: "Major / Contraindicated",
    clinicalImpact: "เสี่ยงต่อการรักษา HIV ล้มเหลวและเกิดเชื้อดื้อยา",
    pharmacistRecommendation: "ปรับเพิ่มขนาด DTG เป็น 50 mg วันละ 2 ครั้ง (ทุก 12 ชม.) ตลอดระยะเวลาที่ทาน Rifampicin และทานต่ออีก 2 สัปดาห์หลังหยุด R ส่วน BIC ห้ามใช้ร่วมกับ R"
  },
  {
    drug: "Warfarin",
    category: "Oral Anticoagulant",
    mechanism: "Rifampicin เร่งการทำลาย Warfarin ผ่าน CYP2C9 และ CYP3A4 ทำให้ระดับ Warfarin ตกฮวบ",
    severity: "Major / Contraindicated",
    clinicalImpact: "ค่า INR ลดลงอย่างมาก เสี่ยงต่อการเกิดลิ่มเลือดอุดตันซ้ำ (Thrombosis)",
    pharmacistRecommendation: "ต้องติดตามค่า INR ทุก 3-7 วัน อาจต้องเพิ่มขนาดยา Warfarin ขึ้น 2-3 เท่า และต้องปรับลดขนาดยาลงทันทีหลังหยุด Rifampicin"
  },
  {
    drug: "DOACs (Rivaroxaban, Apixaban, Dabigatran)",
    category: "Direct Oral Anticoagulants",
    mechanism: "Rifampicin กระตุ้น P-gp และ CYP3A4 ทำให้ระดับยา DOACs ลดลงมากกว่า 50%",
    severity: "Major / Contraindicated",
    clinicalImpact: "ประสิทธิภาพในการป้องกันลิ่มเลือดอุดตันล้มเหลว",
    pharmacistRecommendation: "หลีกเลี่ยงการใช้ DOACs ร่วมกับ Rifampicin แนะนำเปลี่ยนเป็น LMWH (Enoxaparin) หรือ Warfarin ที่สามารถมอนิเตอร์ INR ได้"
  },
  {
    drug: "Oral Contraceptive Pills (OCPs) / ฮอร์โมนคุมกำเนิด",
    category: "Contraception",
    mechanism: "Rifampicin เพิ่มการสลาย Estrogen และ Progesterone ในตับ",
    severity: "Major / Contraindicated",
    clinicalImpact: "ประสิทธิภาพการคุมกำเนิดล้มเหลว เสี่ยงต่อการตั้งครรภ์ไม่พึงประสงค์ระหว่างรักษาวัณโรค",
    pharmacistRecommendation: "ยาเม็ดคุมกำเนิด แผ่นแปะ และยาฝัง อาจไม่ได้ผล แนะนำให้ใช้ถุงยางอนามัย (Barrier method) หรือห่วงอนามัยคุมกำเนิด (IUD) ตลอดการรักษา"
  },
  {
    drug: "Simvastatin / Atorvastatin",
    category: "Lipid-lowering Statin",
    mechanism: "Rifampicin กระตุ้น CYP3A4 สลาย Statin จนแทบไม่เหลือระดับยาในเลือด",
    severity: "Moderate / Dose Adjust",
    clinicalImpact: "ระดับไขมัน LDL ไม่ลดลงตามเป้าหมาย",
    pharmacistRecommendation: "หากจำเป็นต้องลดไขมัน แนะนำเปลี่ยนเป็น Rosuvastatin หรือ Pravastatin (ไม่ผ่าน CYP3A4) หรือพิจารณาหยุด Statin ชั่วคราวช่วง 2-6 เดือนแรก"
  },
  {
    drug: "Sulfonylureas (Glipizide, Gliclazide)",
    category: "Antidiabetic",
    mechanism: "Rifampicin กระตุ้น CYP2C9 สลายยากลุ่ม Sulfonylurea เร็วขึ้น",
    severity: "Moderate / Dose Adjust",
    clinicalImpact: "คุมระดับน้ำตาลในเลือดไม่ได้ น้ำตาลสูงขึ้น",
    pharmacistRecommendation: "ตรวจติดตามน้ำตาลปลายนิ้ว (DTX/SMBG) สม่ำเสมอ อาจจำเป็นต้องปรับเพิ่มขนาดยาเบาหวานหรือเสริม Insulin ชั่วคราว"
  },
  {
    drug: "Bedaquiline / Fluoroquinolones / Clofazimine",
    category: "Anti-TB Drug Interaction",
    mechanism: "ยาทั้งสามตัวมีฤทธิ์ยืดระยะการบีบตัวของหัวใจ (QTc Prolongation)",
    severity: "Major / Contraindicated",
    clinicalImpact: "เสี่ยงต่อการเกิดคลื่นหัวใจเต้นผิดจังหวะชนิด Torsades de pointes (TdP) ที่เป็นอันตรายถึงชีวิต",
    pharmacistRecommendation: "ตรวจ EKG วัด QTc interval baseline และติดตามทุก 2-4 สัปดาห์ หาก QTc > 500 ms หรือเพิ่มขึ้น > 60 ms จากเดิม ให้หยุดยาและปรึกษาแพทย์ทันที ตรวจระดับ K, Mg ในเลือด"
  }
];

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: "TB-69-001",
    hn: "450004413",
    name: "น.ส.โสภา หนูโม",
    age: 42,
    gender: "หญิง",
    weight: 38.6,
    height: 152,
    bmi: 16.7,
    patientType: "Drug Reaction / Allergy",
    hivStatus: "Negative",
    diagnosis: "Pulmonary TB, Post-DILI (Re-challenge Phase)",
    regimenId: "ADR_HEPATIC_2HEP",
    regimenName: "2HRE / 7HR (ตับอักเสบ งด Pyrazinamide)",
    regimenMonths: 9,
    monthOfTreatment: 2,
    sputumStatus: "Negative",
    extendedPhase: false,
    extendedMonths: 0,
    adherenceRate: 98,
    dotType: "Hospital DOT",
    phoneNumber: "081-234-5678",
    nextAppointmentDate: "2026-11-04",
    hosxpNotes: "[HosXP Pharmacist Note - รพ.เขาชัยสน]\nผู้ป่วยหญิง 42 ปี วินิจฉัย Pulmonary TB เกิด DILI จากสูตร 4FDC เดิม (AST 210, ALT 245 U/L)\n- วันนี้มาตามนัด LFT ล่าสุด AST 32, ALT 28 (Normal) Re-challenge H (300 mg/d) ผ่านเรียบร้อยดี\n- กำลังอยู่ในขั้นตอน Re-challenge R (450 mg/d ตาม BW 38.6 kg) ร่วมกับ E (600 mg/d) และ B6 (50 mg/d)\n- ตรวจนับเม็ดยาคงเหลือ ทานยาถูกต้องครบถ้วน 100% ไม่มีลืมมื้อยา ปัสสาวะสีส้มแดงปกติ ผู้ป่วยรับทราบและปฏิบัติตามคำแนะนำดีมาก",
    hosxpLastUpdated: "2026-10-29 10:15",
    hosxpUpdatedBy: "ภก.วิชัย ชื่นกมล (ภก.คลินิก)",
    concomitantMeds: ["Pyridoxine 50 mg OD", "Omeprazole 20 mg OD"],
    scr: 0.65,
    lft: {
      ast: 32,
      alt: 28,
      tbili: 0.8,
      alp: 78,
      date: "2026-10-26"
    },
    rechallengeStatus: {
      active: true,
      currentStep: 3,
      hPassed: true,
      rPassed: false,
      zPassed: false,
      notes: "ผ่าน Re-challenge H (300 mg/d) เอนไซม์ตับปกติ ขณะนี้เริ่ม R 450 mg/d สัปดาห์แรก"
    },
    visits: [
      {
        id: "VISIT-001-1",
        visitDate: "2026-09-01",
        weight: 39.5,
        regimen: "4FDC (Rimstar) 3 เม็ด/วัน",
        daysOfSupply: 30,
        dispenseStatus: "Dispensed",
        medicationTakingStatus: "correct",
        dispensedBy: "ภก.วิชัย ชื่นกมล",
        nurseRequisitionBy: "พว.สมใจ ใจดี",
        dispensedItems: [
          { drugName: "4FDC (HRZE)", quantity: "90 เม็ด", instructions: "รับประทานครั้งละ 3 เม็ด วันละ 1 ครั้ง ก่อนอาหารเช้า" },
          { drugName: "Pyridoxine 50 mg", quantity: "30 เม็ด", instructions: "รับประทานครั้งละ 1 เม็ด วันละ 1 ครั้ง หลังอาหารเช้า" }
        ],
        nextAppointmentDate: "2026-10-01",
        notes: "เริ่มการรักษาผู้ป่วยรายใหม่ นัดตรวจติดตาม 1 เดือน",
        sideEffectsNoted: "ยังไม่มีอาการผิดปกติ"
      },
      {
        id: "VISIT-001-2",
        visitDate: "2026-10-01",
        weight: 38.0,
        regimen: "Hold all TB drugs (Post-DILI)",
        daysOfSupply: 14,
        dispenseStatus: "Dispensed",
        medicationTakingStatus: "correct",
        dispensedBy: "ภก.วิชัย ชื่นกมล",
        nurseRequisitionBy: "พว.สมใจ ใจดี",
        dispensedItems: [
          { drugName: "Omeprazole 20 mg", quantity: "14 แคปซูล", instructions: "รับประทานครั้งละ 1 แคปซูล ก่อนอาหารเช้า" }
        ],
        nextAppointmentDate: "2026-10-15",
        notes: "เกิดภาวะตับอักเสบ AST 210, ALT 245 U/L สั่งหยุดยา TB ทั้งหมดทันทีเพื่อ Washout",
        sideEffectsNoted: "คลื่นไส้ ตาเหลืองเล็กน้อย ปวดท้องใต้ชายโครงขวา"
      },
      {
        id: "VISIT-001-3",
        visitDate: "2026-10-15",
        weight: 38.2,
        regimen: "Re-challenge Step 2: Isoniazid (H)",
        daysOfSupply: 7,
        dispenseStatus: "Dispensed",
        medicationTakingStatus: "correct",
        dispensedBy: "ภก.วิชัย ชื่นกมล",
        nurseRequisitionBy: "พว.สมใจ ใจดี",
        dispensedItems: [
          { drugName: "Isoniazid (100 mg)", quantity: "21 เม็ด", instructions: "รับประทานครั้งละ 3 เม็ด วันละ 1 ครั้ง ก่อนนอน (300 mg)" },
          { drugName: "Pyridoxine 50 mg", quantity: "7 เม็ด", instructions: "รับประทานครั้งละ 1 เม็ด วันละ 1 ครั้ง หลังอาหาร" }
        ],
        nextAppointmentDate: "2026-10-22",
        notes: "ผล LFT ฟื้นตัวดี AST 38, ALT 35 U/L เริ่ม Re-challenge ยา H ขนานแรก",
        sideEffectsNoted: "มีอาการชาปลายเท้าเล็กน้อย เพิ่ม B6 เป็น 50 mg"
      },
      {
        id: "VISIT-001-4",
        visitDate: "2026-10-22",
        weight: 38.6,
        regimen: "Re-challenge Step 3: H + Rifampicin (R) + E",
        daysOfSupply: 7,
        dispenseStatus: "Dispensed",
        medicationTakingStatus: "correct",
        dispensedBy: "ภก.วิชัย ชื่นกมล",
        nurseRequisitionBy: "พว.สมใจ ใจดี",
        dispensedItems: [
          { drugName: "Isoniazid 100 mg", quantity: "21 เม็ด", instructions: "3 เม็ด OD ก่อนนอน (300 mg)" },
          { drugName: "Rifampicin 450 mg", quantity: "7 แคปซูล", instructions: "1 แคปซูล OD ก่อนนอน (450 mg ตาม BW < 50kg)" },
          { drugName: "Ethambutol 400 mg", quantity: "14 เม็ด", instructions: "1.5 เม็ด OD ก่อนนอน (600 mg)" },
          { drugName: "Pyridoxine 50 mg", quantity: "7 เม็ด", instructions: "1 เม็ด OD หลังอาหาร" }
        ],
        nextAppointmentDate: "2026-10-29",
        notes: "ผ่าน H ได้เรียบร้อย เพิ่ม R 450 mg + E 600 mg นัดติดตาม LFT ใน 1 สัปดาห์",
        sideEffectsNoted: "ปัสสาวะสีส้มแดงปกติ ไม่มีคลื่นไส้"
      },
      {
        id: "VISIT-001-5",
        visitDate: "2026-10-29",
        weight: 38.6,
        regimen: "2HRE / 7HR (ตับอักเสบ งด Z)",
        daysOfSupply: 7,
        dispenseStatus: "Dispensed",
        medicationTakingStatus: "correct",
        dispensedBy: "ภก.วิชัย ชื่นกมล",
        nurseRequisitionBy: "พว.สมใจ ใจดี",
        dispensedItems: [
          { drugName: "Isoniazid 100 mg", quantity: "21 เม็ด", instructions: "3 เม็ด OD ก่อนนอน" },
          { drugName: "Rifampicin 450 mg", quantity: "7 แคปซูล", instructions: "1 แคปซูล OD ก่อนนอน" },
          { drugName: "Ethambutol 400 mg", quantity: "14 เม็ด", instructions: "1.5 เม็ด OD ก่อนนอน" },
          { drugName: "Vit B co", quantity: "21 เม็ด", instructions: "1*3 pc หลังอาหาร (3 เม็ด/วัน)" }
        ],
        nextAppointmentDate: "2026-11-04",
        notes: "ผู้ป่วยทนต่อสูตรยา HRE ได้ดี LFT ปกติ นัดติดตามวันนี้เพื่อเจาะ LFT ซ้ำและรับยาเพิ่ม",
        sideEffectsNoted: "ไม่มีอาการคลื่นไส้อาเจียน ตาไม่เหลือง"
      }
    ],
    adrRecords: [
      {
        id: "ADR-001",
        date: "2026-10-01",
        drug: "Pyrazinamide (Z)",
        reaction: "Drug-Induced Liver Injury (DILI) - AST 210, ALT 245, T.Bili 2.1",
        severity: "Severe",
        action: "Off Z ถาวร, Hold ยาทั้งหมดจนกว่า LFT จะกลับมาปกติ",
        status: "Resolved",
        reporter: "ภก.วิชัย ชื่นกมล (เภสัชกรคลินิก)"
      },
      {
        id: "ADR-002",
        date: "2026-10-15",
        drug: "Isoniazid (H)",
        reaction: "Peripheral Numbness (อาการชาปลายมือปลายเท้า)",
        severity: "Mild",
        action: "จ่าย Vit B co 1*3 pc (วันละ 3 เม็ด หลังอาหาร) ทดแทน Vit B6 อาการชาดีขึ้น",
        status: "Resolved",
        reporter: "พว.สมใจ ใจดี (พยาบาลคลินิกวัณโรค)"
      }
    ],
    soapNotes: [
      {
        id: "SOAP-001",
        date: "2026-10-26",
        author: "ภก.วิชัย ชื่นกมล (ภก.คลินิก)",
        problem: "Post-DILI Re-challenge Protocol Assessment",
        subjective: "ผู้ป่วยหญิงไทย 42 ปี ไม่มีอาการคลื่นไส้ อาเจียน ไม่อ่อนเพลีย ตาไม่เหลือง ปัสสาวะสีส้มแดงปกติหลังเริ่ม R",
        objective: "BW 38.6 kg, BP 118/74 mmHg, LFT ล่าสุด: AST 32 U/L, ALT 28 U/L, T.Bili 0.8 mg/dL (Normal). SpO2 98%",
        assessment: "ผู้ป่วยเกิด DILI เดิมจากสูตร 4FDC สงสัย Z เป็นหลัก ขณะนี้ทำ Re-challenge H 300 mg/day ครบ 1 สัปดาห์ LFT ปกติ จึงก้าวสู่ Step 3 เริ่ม R 450 mg/day (ตาม BW 38.6 kg)",
        plan: "1. ให้ R (450 mg) + H (300 mg) + E (600 mg) + Vit B co 1*3 pc (ทดแทน Vit B6 ตามคลังยา รพ.เขาชัยสน)\n2. นัดเจาะ LFT ซ้ำอีก 1 สัปดาห์ (4 พ.ย. 2026)\n3. แนะนำสังเกตอาการเบื่ออาหาร คลื่นไส้ ตาเหลือง หากมีให้หยุดยาทันทีแล้วมา รพ."
      }
    ],
    multidisciplinaryNotes: [
      {
        id: "MDT-001",
        date: "2026-10-26",
        sender: "ภก.วิชัย (เภสัชกร)",
        role: "Pharmacist",
        text: "ผล LFT กลับสู่ปกติแล้ว ให้เริ่ม Re-challenge H เป็นตัวแรก สัปดาห์ถัดไปนัดดู LFT อีกครั้ง"
      },
      {
        id: "MDT-002",
        date: "2026-10-20",
        sender: "พญ.กานดา (อายุรแพทย์)",
        role: "Physician",
        text: "เห็นชอบตามแผนเภสัชกร หากผ่าน H และ R ได้ ให้หลีกเลี่ยง Z ถาวรและใช้สูตร 2HRE/7HR นาน 9 เดือน"
      },
      {
        id: "MDT-003",
        date: "2026-10-18",
        sender: "พว.สมใจ (พยาบาล DOTs)",
        role: "Nurse",
        text: "ผู้ป่วยให้ความร่วมมือดีมาก ทานยาตรงเวลาทุกวัน มีญาติช่วยเตือน DOTs สม่ำเสมอ"
      }
    ],
    alerts: [
      {
        id: "ALT-01",
        type: "Warning",
        text: "อยู่ระหว่าง Re-challenge ยา หลังเกิด DILI (เอนไซม์ตับเคยสูง 245 U/L) - หลีกเลี่ยง Pyrazinamide ถาวร"
      },
      {
        id: "ALT-02",
        type: "Info",
        text: "น้ำหนักตัวน้อย (< 50 kg) คำนวณขนาดยาแยกเม็ด H:300mg, R:450mg, E:600mg"
      }
    ]
  },
  {
    id: "TB-69-002",
    hn: "450003053",
    name: "นายภาณุพงศ์ แก้วเจริญ",
    age: 58,
    gender: "ชาย",
    weight: 58.9,
    height: 168,
    bmi: 20.9,
    patientType: "MDR/RR-TB",
    hivStatus: "Negative",
    diagnosis: "Pulmonary MDR-TB (Resistant to Isoniazid & Rifampicin)",
    regimenId: "MDR_SHORTER_ALL_ORAL",
    regimenName: "Shorter All-Oral Bdq Regimen (9-11 เดือน)",
    regimenMonths: 11,
    monthOfTreatment: 5,
    sputumStatus: "Negative",
    extendedPhase: false,
    extendedMonths: 0,
    adherenceRate: 96,
    dotType: "V-DOT",
    phoneNumber: "089-876-5432",
    nextAppointmentDate: "2026-11-12",
    hosxpNotes: "[HosXP Pharmacist Note - รพ.เขาชัยสน]\nผู้ป่วยชาย 58 ปี MDR-TB ตอบสนองต่อสูตร Bdq-based ดีมาก Sputum AFB เดือนที่ 4, 5 เป็นลบ ตรวจ EKG QTc 435 ms ปกติ ไม่พบหัวใจเต้นผิดจังหวะ ผิวคล้ำเล็กน้อยจาก Clofazimine ผู้ป่วยรับประทานยาถูกต้องตรงเวลาดีมาก สม่ำเสมอผ่าน V-DOTs",
    hosxpLastUpdated: "2026-10-22 14:20",
    hosxpUpdatedBy: "ภก.วิชัย ชื่นกมล (ภก.คลินิก)",
    concomitantMeds: ["Amlodipine 5 mg OD", "Potassium Chloride 500 mg OD"],
    scr: 0.92,
    lft: {
      ast: 24,
      alt: 22,
      tbili: 0.6,
      date: "2026-10-22"
    },
    visits: [
      {
        id: "VISIT-002-1",
        visitDate: "2026-06-15",
        weight: 56.5,
        regimen: "Shorter Bdq Regimen (Intensive)",
        daysOfSupply: 14,
        dispenseStatus: "Dispensed",
        medicationTakingStatus: "correct",
        dispensedBy: "ภก.วิชัย ชื่นกมล",
        nurseRequisitionBy: "พว.สมใจ ใจดี",
        dispensedItems: [
          { drugName: "Bedaquiline 100 mg", quantity: "56 เม็ด", instructions: "4 เม็ด OD พร้อมอาหาร" },
          { drugName: "Levofloxacin 500 mg", quantity: "28 เม็ด", instructions: "2 เม็ด OD" }
        ],
        nextAppointmentDate: "2026-06-29",
        notes: "เริ่มสูตรสั้น MDR-TB ตรวจ EKG Baseline QTc 418 ms"
      },
      {
        id: "VISIT-002-2",
        visitDate: "2026-10-22",
        weight: 58.9,
        regimen: "Shorter Bdq Regimen (Continuation)",
        daysOfSupply: 21,
        dispenseStatus: "Dispensed",
        medicationTakingStatus: "correct",
        dispensedBy: "ภก.วิชัย ชื่นกมล",
        nurseRequisitionBy: "พว.สมใจ ใจดี",
        dispensedItems: [
          { drugName: "Levofloxacin 500 mg", quantity: "42 เม็ด", instructions: "2 เม็ด OD" },
          { drugName: "Clofazimine 100 mg", quantity: "21 แคปซูล", instructions: "1 แคปซูล OD" },
          { drugName: "Pyrazinamide 500 mg", quantity: "63 เม็ด", instructions: "3 เม็ด OD" },
          { drugName: "Ethambutol 400 mg", quantity: "63 เม็ด", instructions: "3 เม็ด OD" }
        ],
        nextAppointmentDate: "2026-11-12",
        notes: "เดือนที่ 5 ผลเสมหะ AFB เป็นลบ EKG QTc 435 ms ปกติ",
        sideEffectsNoted: "ผิวหนังคล้ำอมส้มเล็กน้อย"
      }
    ],
    adrRecords: [
      {
        id: "ADR-101",
        date: "2026-07-10",
        drug: "Clofazimine (Cfz)",
        reaction: "Skin Pigmentation (ผิวหนังคล้ำอมส้มแดง)",
        severity: "Mild",
        action: "ให้คำปรึกษาแก่ผู้ป่วยว่าเป็นผลข้างเคียงชั่วคราวและจะค่อยๆ จางหายหลังหยุดยา แนะนำทาครีมกันแดด",
        status: "Active",
        reporter: "ภก.วิชัย ชื่นกมล (เภสัชกรคลินิก)"
      }
    ],
    soapNotes: [
      {
        id: "SOAP-101",
        date: "2026-10-22",
        author: "ภก.วิชัย ชื่นกมล (ภก.คลินิก)",
        problem: "MDR-TB Shorter All-Oral Regimen Month 5 Review",
        subjective: "ผู้ป่วยไม่มีอาการไอ เสมหะไม่มี ไม่มีเหนื่อยหอบ ไม่มีอาการใจสั่นหรือหน้ามืด",
        objective: "Sputum AFB เดือนที่ 4 และ 5 Negative, Sputum Culture รอผล, EKG QTc 435 ms (Baseline 418 ms, ปกติ < 450 ms), K 4.2 mEq/L, Mg 2.1 mg/dL",
        assessment: "ผู้ป่วย MDR-TB ตอบสนองต่อสูตร Bdq-based สั้น 11 เดือนดีมาก ผลตรวจเสมหะเป็นลบ สภาพหัวใจ QTc ปกติ ไม่มีอาการแทรกซ้อนรุนแรง",
        plan: "1. ทานยาต่อเนื่องตามแผน Phase 2 (Lfx + Cfz + Z + E)\n2. ติดตาม EKG วัด QTc ประจำเดือน\n3. ติดตามผลเสมหะเดือนที่ 6"
      }
    ],
    multidisciplinaryNotes: [
      {
        id: "MDT-101",
        date: "2026-10-22",
        sender: "ภก.วิชัย (เภสัชกร)",
        role: "Pharmacist",
        text: "EKG QTc 435 ms ปลอดภัย K/Mg ปกติ ให้ทานต่อตามแผน"
      }
    ],
    alerts: [
      {
        id: "ALT-MDR",
        type: "Info",
        text: "สูตรยา MDR-TB สั้น 9-11 เดือน (Bdq-based) ต้องติดตาม EKG (QTc interval) และอิเล็กโทรไลต์ K/Mg ทุกเดือน"
      }
    ]
  },
  {
    id: "TB-69-003",
    hn: "450009182",
    name: "นายบุญมี เจริญศิลป์",
    age: 65,
    gender: "ชาย",
    weight: 52.0,
    height: 165,
    bmi: 19.1,
    patientType: "New Case (DS-TB)",
    hivStatus: "Negative",
    diagnosis: "Pulmonary TB, Smear (+) With Sputum Delay Conversion",
    regimenId: "STD_2HRZE_4HR_STD",
    regimenName: "2(HRZE) / 4(HR) (BW ≥ 50 kg)",
    regimenMonths: 6,
    monthOfTreatment: 3,
    sputumStatus: "Positive",
    extendedPhase: true,
    extendedMonths: 2,
    adherenceRate: 85,
    dotType: "Health Center DOT",
    phoneNumber: "084-555-1234",
    nextAppointmentDate: "2026-11-01",
    hosxpNotes: "[HosXP Pharmacist Note - รพ.เขาชัยสน]\nผู้ป่วยชาย 65 ปี Sputum AFB เดือนที่ 2 ยังเป็นบวก (1+) ซักประวัติพบมีลืมทานยาวันหยุดสัปดาห์ละ 1-2 ครั้งเนื่องจากไปสวนยาง ได้ให้คำแนะนำเน้นย้ำความสำคัญของการรับประทานยาอย่างเคร่งครัดทุกวัน และประสาน รพ.สต. ในพื้นที่ให้ช่วยกำกับ DOTs อย่างใกล้ชิด ขณะนี้ขาดนัด 3 วัน ได้ประสานงานพยาบาลคลินิก TB โทรติดตามตัว",
    hosxpLastUpdated: "2026-10-10 11:45",
    hosxpUpdatedBy: "ภก.วิชัย ชื่นกมล (ภก.คลินิก)",
    concomitantMeds: ["Enalapril 5 mg OD", "Allopurinol 100 mg OD (Hold)"],
    scr: 1.15,
    visits: [
      {
        id: "VISIT-003-1",
        visitDate: "2026-08-10",
        weight: 51.5,
        regimen: "4FDC 3 เม็ด/วัน",
        daysOfSupply: 30,
        dispenseStatus: "Dispensed",
        medicationTakingStatus: "correct",
        dispensedBy: "ภก.วิชัย ชื่นกมล",
        nurseRequisitionBy: "พว.สมใจ ใจดี",
        dispensedItems: [{ drugName: "4FDC (HRZE)", quantity: "90 เม็ด" }],
        nextAppointmentDate: "2026-09-10",
        notes: "เริ่มยาเดือนแรก"
      },
      {
        id: "VISIT-003-2",
        visitDate: "2026-09-10",
        weight: 52.0,
        regimen: "4FDC 3 เม็ด/วัน",
        daysOfSupply: 30,
        dispenseStatus: "Dispensed",
        medicationTakingStatus: "incorrect",
        incorrectReason: "ลืมกินยาวันหยุดสัปดาห์ละ 1-2 ครั้งช่วงไปสวนยาง",
        missedDosesCount: 4,
        dispensedBy: "ภก.วิชัย ชื่นกมล",
        nurseRequisitionBy: "พว.สมใจ ใจดี",
        dispensedItems: [{ drugName: "4FDC (HRZE)", quantity: "90 เม็ด" }],
        nextAppointmentDate: "2026-10-10",
        notes: "นัดตรวจเสมหะสิ้นสุดเดือนที่ 2 ผู้ป่วยยอมรับลืมทานยาบางมื้อ",
        sideEffectsNoted: "ไม่มีอาการแพ้ แต่มีลืมทานยา"
      },
      {
        id: "VISIT-003-3",
        visitDate: "2026-10-10",
        weight: 52.0,
        regimen: "2HRZE / 6HR (ขยายเวลาเพิ่ม 2 เดือน)",
        daysOfSupply: 21,
        dispenseStatus: "Dispensed",
        medicationTakingStatus: "incorrect",
        incorrectReason: "ลืมทานยา 2 มื้อช่วงเสาร์-อาทิตย์",
        missedDosesCount: 2,
        dispensedBy: "ภก.วิชัย ชื่นกมล",
        nurseRequisitionBy: "พว.สมใจ ใจดี",
        dispensedItems: [{ drugName: "4FDC (HRZE)", quantity: "63 เม็ด" }, { drugName: "Pyridoxine 50 mg", quantity: "21 เม็ด" }],
        nextAppointmentDate: "2026-11-01",
        notes: "เสมหะเดือนที่ 2 ยังเป็นบวก ขยายเวลาการรักษาและจ่ายยา 21 วัน ประสาน DOTs รพ.สต.",
        sideEffectsNoted: "มีไอแห้งๆ ลืมทานยา"
      }
    ],
    adrRecords: [],
    soapNotes: [
      {
        id: "SOAP-201",
        date: "2026-10-10",
        author: "ภก.วิชัย ชื่นกมล (ภก.คลินิก)",
        problem: "Sputum AFB Positive at Month 2 / Extension Evaluation",
        subjective: "ผู้ป่วยยังมีอาการไอแห้งๆ ยอมรับว่ามีลืมทานยาวันหยุดบางสัปดาห์",
        objective: "Sputum AFB เดือนที่ 2 ยังพบเชื้อ 1+ ส่งตรวจ GeneXpert ซ้ำและส่งเพาะเชื้อทดสอบความไว",
        assessment: "Sputum smear positive at end of month 2. เข้าเกณฑ์ขยายระยะเวลาทานยา Intensive phase อีก 1 เดือน หรือขยายระยะสมานตาม CPG 2021 รวมเพิ่ม 2 เดือน",
        plan: "1. ขยายการรักษารวมเป็น 8 เดือน (2HRZE / 6HR)\n2. ส่งตรวจ DST ยืนยันเชื้อดื้อยา\n3. ปรับเปลี่ยนระบบ DOTs เป็น รพ.สต. กำกับดูแลอย่างใกล้ชิด"
      }
    ],
    multidisciplinaryNotes: [
      {
        id: "MDT-201",
        date: "2026-10-10",
        sender: "ภก.วิชัย (เภสัชกร)",
        role: "Pharmacist",
        text: "ขยายเวลาทานยาเพิ่ม 2 เดือนเนื่องจากเสมหะเดือนที่ 2 ยังเป็นบวก เน้นย้ำความสม่ำเสมอในการกินยา"
      }
    ],
    alerts: [
      {
        id: "ALT-SPUTUM-POS",
        type: "Critical",
        text: "🚨 Sputum AFB (+) ในเดือนที่ 2 ขยายเวลาการรักษาเพิ่ม 2 เดือน และส่งตรวจเพาะเชื้อทดสอบความไวต่อยา (DST)"
      },
      {
        id: "ALT-OVERDUE",
        type: "Critical",
        text: "⚠️ ขาดนัดติดตาม! เลยกำหนดนัดเมื่อ 2026-11-01 (3 วันที่แล้ว) เสี่ยงขาดยา ต้องรีบโทรติดตาม"
      }
    ]
  },
  {
    id: "TB-69-004",
    hn: "450007812",
    name: "นายสมศักดิ์ รุ่งโรจน์",
    age: 36,
    gender: "ชาย",
    weight: 62.4,
    height: 172,
    bmi: 21.1,
    patientType: "TB / HIV Co-infection",
    hivStatus: "Positive",
    diagnosis: "Pulmonary TB with HIV Co-infection (CD4 185 cells/uL)",
    regimenId: "STD_2HRZE_4HR_STD",
    regimenName: "2(HRZE) / 4(HR) (BW ≥ 50 kg)",
    regimenMonths: 6,
    monthOfTreatment: 1,
    sputumStatus: "Negative",
    extendedPhase: false,
    extendedMonths: 0,
    adherenceRate: 100,
    dotType: "Hospital DOT",
    phoneNumber: "086-777-8899",
    nextAppointmentDate: "2026-11-07",
    hosxpNotes: "[HosXP Pharmacist Note - รพ.เขาชัยสน]\nผู้ป่วยชาย 36 ปี TB ร่วมกับ HIV ได้รับสูตร 2HRZE + TLD เภสัชกรได้ตรวจพบ DDI รุนแรงระหว่าง Rifampicin กับ Dolutegravir ได้ทำการเพิ่ม Double Dose DTG 50 mg วันละ 2 ครั้งเรียบร้อยแล้ว แนะนำผู้ป่วยแยกมื้อทานยา TB เช้าก่อนอาหาร ยา HIV เย็นหลังอาหาร ผู้ป่วยเข้าใจดีมาก",
    hosxpLastUpdated: "2026-10-24 09:30",
    hosxpUpdatedBy: "ภก.วิชัย ชื่นกมล (ภก.คลินิก)",
    concomitantMeds: ["TLD (Tenofovir/Lamivudine/Dolutegravir 50mg) OD", "Dolutegravir 50 mg (เพิ่ม dose เย็น)", "Cotrimoxazole 1 tab OD"],
    scr: 0.88,
    visits: [
      {
        id: "VISIT-004-1",
        visitDate: "2026-10-24",
        weight: 62.4,
        regimen: "4FDC 4 เม็ด + Double Dose DTG",
        daysOfSupply: 14,
        dispenseStatus: "Dispensed",
        medicationTakingStatus: "correct",
        dispensedBy: "ภก.วิชัย ชื่นกมล",
        nurseRequisitionBy: "พว.สมใจ ใจดี",
        dispensedItems: [
          { drugName: "4FDC (HRZE)", quantity: "56 เม็ด", instructions: "4 เม็ด OD ก่อนอาหารเช้า" },
          { drugName: "Dolutegravir 50 mg", quantity: "14 เม็ด", instructions: "1 เม็ด OD ตอนเย็น (เสริม dose ที่สองเนื่องจากทาน Rifampicin)" },
          { drugName: "Pyridoxine 50 mg", quantity: "14 เม็ด", instructions: "1 เม็ด OD หลังอาหาร" }
        ],
        nextAppointmentDate: "2026-11-07",
        notes: "เริ่มยา TB ร่วมกับยาต้านไวรัส HIV นัดติดตาม 2 สัปดาห์",
        sideEffectsNoted: "ไม่มีอาการแพ้ยา"
      }
    ],
    adrRecords: [],
    soapNotes: [
      {
        id: "SOAP-301",
        date: "2026-10-28",
        author: "ภก.วิชัย ชื่นกมล (ภก.คลินิก)",
        problem: "Drug-Drug Interaction: Rifampicin + Dolutegravir (DTG)",
        subjective: "ผู้ป่วยไม่มีอาการแพ้ยา ทานยาตรงเวลา รับประทานยา TB ตอนเช้าก่อนอาหาร และยาต้าน HIV ตอนเย็น",
        objective: "HIV VL < 50 copies, CD4 185, เริ่มสูตร 2HRZE ร่วมกับสูตร TLD",
        assessment: "Rifampicin กระตุ้นเอนไซม์ CYP3A4/UGT1A1 ทำให้ระดับ DTG ลดลงรุนแรง ต้องเพิ่ม Double Dose DTG",
        plan: "1. ให้ทาน TLD 1 เม็ดตอนเช้า และเพิ่ม DTG 50 mg อีก 1 เม็ดตอนเย็น (ห่างกัน 12 ชม.)\n2. ทาน DTG 50 mg BID ต่อไปจนกระทั่งหยุด Rifampicin ครบ 2 สัปดาห์\n3. จ่าย Pyridoxine 50 mg ป้องกันปลายประสาทอักเสบ"
      }
    ],
    multidisciplinaryNotes: [
      {
        id: "MDT-301",
        date: "2026-10-28",
        sender: "ภก.วิชัย (เภสัชกร)",
        role: "Pharmacist",
        text: "จัด Double-dose DTG 50 mg BID ป้องกันการดื้อยาต้านไวรัส HIV เนื่องจากทานร่วมกับ Rifampicin"
      }
    ],
    alerts: [
      {
        id: "ALT-HIV-DDI",
        type: "Warning",
        text: "⚠️ อันตรกิริยาระหว่างยา Rifampicin + Dolutegravir ต้องเพิ่มขนาด DTG เป็น 50 mg วันละ 2 ครั้ง"
      }
    ]
  }
];
