import { Patient } from '../types/tb';

export interface CalculatedDose {
  code: string;
  drugName: string;
  mgPerKgDay: number;
  calculatedMg: number;
  recommendedMg: number;
  tabletDispenseThai: string;
  specialWarning?: string;
  renalDoseNote?: string;
}

export function calculateCrCl(age: number, weight: number, scr: number, gender: 'ชาย' | 'หญิง'): number {
  if (!age || !weight || !scr || scr <= 0) return 0;
  let crcl = ((140 - age) * weight) / (72 * scr);
  if (gender === 'หญิง') crcl *= 0.85;
  return Math.round(crcl * 10) / 10;
}

export function calculateFirstLineDoses(weight: number, crcl?: number): CalculatedDose[] {
  const isLowWeight = weight < 50;
  const isRenalFailure = crcl !== undefined && crcl < 30;

  // H: 4-6 mg/kg (standard 5 mg/kg, max 300)
  const hMg = Math.min(Math.round(weight * 5), 300);
  const hRecommended = 300; // In adults, standard is 300 mg/day
  const hTablets = "INH (100 mg): 3 เม็ด วันละ 1 ครั้ง ก่อนนอน";

  // R: 8-12 mg/kg (standard 10 mg/kg, max 600)
  const rMg = Math.min(Math.round(weight * 10), 600);
  const rRecommended = isLowWeight ? 450 : 600;
  const rTablets = isLowWeight 
    ? "Rifampicin (450 mg): 1 แคปซูล วันละ 1 ครั้ง ก่อนนอน (หรือ 300 mg 1.5 แคปซูล)"
    : "Rifampicin (300 mg): 2 แคปซูล (600 mg) วันละ 1 ครั้ง ก่อนนอน";

  // Z: 20-30 mg/kg (standard 25 mg/kg, max 2000)
  const zMg = Math.min(Math.round(weight * 25), 2000);
  let zRecommended: number;
  let zTablets: string;
  if (weight < 40) {
    zRecommended = 750;
    zTablets = "PZA (500 mg): 1 เม็ดครึ่ง (750 mg) วันละ 1 ครั้ง ก่อนนอน";
  } else if (weight < 50) {
    zRecommended = 1000;
    zTablets = "PZA (500 mg): 2 เม็ด (1,000 mg) วันละ 1 ครั้ง ก่อนนอน";
  } else if (weight <= 70) {
    zRecommended = 1500;
    zTablets = "PZA (500 mg): 3 เม็ด (1,500 mg) วันละ 1 ครั้ง ก่อนนอน";
  } else {
    zRecommended = 2000;
    zTablets = "PZA (500 mg): 4 เม็ด (2,000 mg) วันละ 1 ครั้ง ก่อนนอน";
  }

  // E: 15-20 mg/kg (standard 15 mg/kg, max 1600)
  const eMg = Math.min(Math.round(weight * 15), 1600);
  let eRecommended: number;
  let eTablets: string;
  if (weight < 40) {
    eRecommended = 600;
    eTablets = "EMB (400 mg): 1 เม็ดครึ่ง (600 mg) วันละ 1 ครั้ง ก่อนนอน";
  } else if (weight < 50) {
    eRecommended = 800;
    eTablets = "EMB (400 mg): 2 เม็ด (800 mg) วันละ 1 ครั้ง ก่อนนอน";
  } else if (weight <= 70) {
    eRecommended = 1000; // or 1200
    eTablets = "EMB (400 mg): 2.5 - 3 เม็ด (1,000 - 1,200 mg) หรือ EMB (500 mg) 2 เม็ด ก่อนนอน";
  } else {
    eRecommended = 1600;
    eTablets = "EMB (400 mg): 4 เม็ด (1,600 mg) วันละ 1 ครั้ง ก่อนนอน";
  }

  const result: CalculatedDose[] = [
    {
      code: "H",
      drugName: "Isoniazid (H)",
      mgPerKgDay: 5,
      calculatedMg: hMg,
      recommendedMg: hRecommended,
      tabletDispenseThai: hTablets,
      specialWarning: "ควรเสริม Vit B co 1*3 pc (วันละ 3 ครั้ง ครั้งละ 1 เม็ด หลังอาหาร รวม 3 เม็ด/วัน) ทดแทน Vit B6 ตามคลังยา รพ.เขาชัยสน เพื่อป้องกันปลายประสาทอักเสบจาก INH",
      renalDoseNote: isRenalFailure ? "CrCl < 30: อาจให้ 300 mg/day หรือ 300 mg สัปดาห์ละ 3 ครั้ง (หลังฟอกเลือด)" : "ไม่ต้องปรับขนาดยา"
    },
    {
      code: "R",
      drugName: "Rifampicin (R)",
      mgPerKgDay: 10,
      calculatedMg: rMg,
      recommendedMg: rRecommended,
      tabletDispenseThai: rTablets,
      specialWarning: "ปัสสาวะและสารคัดหลั่งจะเปลี่ยนเป็นสีส้มแดง ไม่เป็นอันตราย ระวังอันตรกิริยากับยาต้านไวรัส HIV, Warfarin, ยาคุมกำเนิด",
      renalDoseNote: "ไม่ต้องปรับขนาดยาในผู้ป่วยไตวาย (ขับออกทางตับ)"
    },
    {
      code: "Z",
      drugName: "Pyrazinamide (Z)",
      mgPerKgDay: 25,
      calculatedMg: zMg,
      recommendedMg: isRenalFailure ? Math.round(weight * 25) : zRecommended,
      tabletDispenseThai: isRenalFailure 
        ? `ปรับเป็น 25-35 mg/kg สัปดาห์ละ 3 ครั้ง (ให้วันละ ~${Math.round(weight * 25 / 500) * 500} mg หลังฟอกเลือด)`
        : zTablets,
      specialWarning: "ยาที่มีพิษต่อตับสูงสุดในกลุ่ม หากตับอักเสบ (DILI) รุนแรง แนะนำงดใช้ถาวร และอาจทำให้กรดยูริกสูงปวดข้อ",
      renalDoseNote: isRenalFailure ? "⚠️ สำคัญมาก: ต้องปรับเป็นสัปดาห์ละ 3 ครั้ง (Mon-Wed-Fri หลังฟอกเลือด) ห้ามให้ทุกวัน" : "ปกติ"
    },
    {
      code: "E",
      drugName: "Ethambutol (E)",
      mgPerKgDay: 15,
      calculatedMg: eMg,
      recommendedMg: isRenalFailure ? Math.round(weight * 15) : eRecommended,
      tabletDispenseThai: isRenalFailure
        ? `ปรับเป็น 15-25 mg/kg สัปดาห์ละ 3 ครั้ง (ให้วันละ ~${Math.round(weight * 15 / 400) * 400} mg หลังฟอกเลือด)`
        : eTablets,
      specialWarning: "ระวังจอประสาทตาอักเสบ (Optic Neuritis) แจ้งผู้ป่วยให้สังเกตอาการตามัว แยกสีแดง-เขียวไม่ออก",
      renalDoseNote: isRenalFailure ? "⚠️ สำคัญมาก: ยาขับออกทางไตสูง ต้องลดความถี่เป็นสัปดาห์ละ 3 ครั้ง เพื่อป้องกันพิษต่อจอประสาทตา" : "ปกติ"
    },
    {
      code: "Bco",
      drugName: "Vitamin B Complex (Vit B co)",
      mgPerKgDay: 0,
      calculatedMg: 0,
      recommendedMg: 0,
      tabletDispenseThai: "Vit B co: 1 เม็ด วันละ 3 ครั้ง หลังอาหาร (1*3 pc) [ทดแทน Vit B6]",
      specialWarning: "รพ.เขาชัยสน ไม่มี Vit B6 ในคลังยา จ่าย Vit B co 1*3 pc (3 เม็ด/วัน) ทดแทน เพื่อป้องกันอาการชาปลายประสาทจาก INH",
      renalDoseNote: "ไม่ต้องปรับขนาดยา"
    }
  ];

  return result;
}

export function getFdcRecommendation(weight: number): { tabs4FDC: string; tabs2FDC: string; guidance: string; isWarning: boolean } {
  if (weight < 30) {
    return {
      tabs4FDC: "ไม่แนะนำให้ใช้ FDC",
      tabs2FDC: "ไม่แนะนำให้ใช้ FDC",
      guidance: "น้ำหนักน้อยกว่า 30 kg ควรคำนวณแยกเม็ดตามน้ำหนักตัวอย่างเคร่งครัด หรือใช้สูตรสำหรับเด็ก (Pediatric)",
      isWarning: true
    };
  } else if (weight <= 37) {
    return {
      tabs4FDC: "2 เม็ด วันละ 1 ครั้ง",
      tabs2FDC: "2 เม็ด วันละ 1 ครั้ง",
      guidance: "น้ำหนัก 30 - 37 kg แนะนำคำนวณแยกเม็ดถ้าทำได้ หากจำเป็นต้องใช้ FDC ให้ทาน 2 เม็ด",
      isWarning: true
    };
  } else if (weight <= 54) {
    return {
      tabs4FDC: "3 เม็ด วันละ 1 ครั้ง",
      tabs2FDC: "3 เม็ด วันละ 1 ครั้ง",
      guidance: "น้ำหนัก 38 - 54 kg ขนาดยาตามเกณฑ์มาตรฐาน CPG 2021",
      isWarning: false
    };
  } else if (weight <= 70) {
    return {
      tabs4FDC: "4 เม็ด วันละ 1 ครั้ง",
      tabs2FDC: "4 เม็ด วันละ 1 ครั้ง",
      guidance: "น้ำหนัก 55 - 70 kg ขนาดมาตรฐานที่พบบ่อยที่สุดสำหรับผู้ใหญ่",
      isWarning: false
    };
  } else {
    return {
      tabs4FDC: "5 เม็ด วันละ 1 ครั้ง",
      tabs2FDC: "5 เม็ด วันละ 1 ครั้ง",
      guidance: "น้ำหนัก > 70 kg หากมีอาการแน่นท้อง คลื่นไส้ สามารถให้ทานแบ่งมื้อหรือแยกเม็ด",
      isWarning: false
    };
  }
}

export function getPatientTimelineStats(patient: Patient) {
  const regMonths = patient.extendedPhase ? patient.regimenMonths + patient.extendedMonths : patient.regimenMonths;
  const currentM = Math.min(patient.monthOfTreatment, regMonths);
  const percent = Math.min(Math.round((currentM / regMonths) * 100), 100);

  let cheerMessage = "";
  let cheerBadge = "";
  let stageTitle = "";

  if (percent < 35) {
    cheerMessage = "จุดเริ่มต้นที่ยิ่งใหญ่! การทานยาอย่างเคร่งครัดใน 2 เดือนแรก คือหัวใจสำคัญที่สุดในการกำจัดเชื้อวัณโรคให้อ่อนแอลง สู้ๆ ครับ!";
    cheerBadge = "🌱 เริ่มต้นการรักษาอย่างเข้มแข็ง";
    stageTitle = "ระยะเข้มข้น (Intensive Phase: 2 เดือนแรก)";
  } else if (percent < 70) {
    cheerMessage = "ยอดเยี่ยมมากครับ! คุณผ่านช่วงระยะเข้มข้นมาแล้ว เชื้อวัณโรคในร่างกายลดลงมหาศาล ร่างกายกำลังฟื้นฟู ทานยาต่อเนื่องตามแพทย์สั่งต่อไปนะครับ!";
    cheerBadge = "🏃‍♂️ ก้าวเข้าสู่ระยะสมาน ร่างกายดีขึ้นต่อเนื่อง";
    stageTitle = "ระยะสมานแผล (Continuation Phase)";
  } else if (percent < 100) {
    cheerMessage = `คุณเดินทางมาถึง ${percent}% แล้ว! อีกเพียงไม่กี่ก้าวก็จะหายขาดจากวัณโรคได้อย่างสมบูรณ์แบบ อย่าเพิ่งหยุดยานะครับ ชัยชนะอยู่ข้างหน้าแล้ว!`;
    cheerBadge = "🔥 อีกนิดเดียวจะถึงเป้าหมายวันหายขาด!";
    stageTitle = "ระยะโค้งสุดท้าย มุ่งสู่การหายขาดสมบูรณ์";
  } else {
    cheerMessage = "🎉 ยินดีด้วยอย่างยิ่งจากใจทีมสหสาขาวิชาชีพ! คุณมีวินัยยอดเยี่ยม รับประทานยาครบถ้วนตามแผนการรักษาและหายขาดจากวัณโรคแล้ว!";
    cheerBadge = "🏆 พิชิตวัณโรคสำเร็จ! หายขาด 100%";
    stageTitle = "การรักษาเสร็จสิ้นสมบูรณ์ (Treatment Completed / Cured)";
  }

  return { regMonths, currentM, percent, cheerMessage, cheerBadge, stageTitle };
}
