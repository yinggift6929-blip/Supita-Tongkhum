import * as XLSX from 'xlsx';
import { Patient, PatientVisit, DispensedItem } from '../types/tb';

export interface ParsedRequisitionRow {
  rowNumber: number;
  hn: string;
  name: string;
  visitDate: string;
  weight: number;
  regimen: string;
  daysOfSupply: number;
  dispensedItemsText?: string;
  nextAppointmentDate?: string;
  nurseRequisitionBy?: string;
  dispensedBy?: string;
  notes?: string;
  status: 'valid' | 'warning' | 'error';
  errorMessage?: string;
  matchedPatient?: Patient;
}

// Normalize Thai date strings (e.g., "04/11/2026", "2026-11-04", or Excel serial dates)
export function normalizeDate(value: any): string {
  if (!value) return '';

  if (typeof value === 'number') {
    // Excel serial date to JS Date
    const excelEpoch = new Date(1899, 11, 30);
    const date = new Date(excelEpoch.getTime() + value * 86400000);
    return date.toISOString().split('T')[0];
  }

  const str = String(value).trim();
  // Check for YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    return str;
  }
  // Check for DD/MM/YYYY or DD-MM-YYYY
  const parts = str.split(/[/.-]/);
  if (parts.length === 3) {
    let day = parseInt(parts[0], 10);
    let month = parseInt(parts[1], 10);
    let year = parseInt(parts[2], 10);

    // If Buddhist Era (e.g. 2569 -> 2026)
    if (year > 2500) {
      year -= 543;
    }

    if (year < 100) {
      year += 2000;
    }

    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    return `${year}-${pad(month)}-${pad(day)}`;
  }

  return str;
}

// Parse uploaded Excel / CSV File
export async function parseExcelRequisitionFile(
  file: File,
  existingPatients: Patient[]
): Promise<ParsedRequisitionRow[]> {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  // Convert to JSON array of objects
  const rawRows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

  const results: ParsedRequisitionRow[] = [];

  rawRows.forEach((row, index) => {
    // Helper to find value by multiple possible header keys
    const findValue = (possibleKeys: string[]): any => {
      for (const key of possibleKeys) {
        for (const actualKey of Object.keys(row)) {
          if (actualKey.trim().toLowerCase().includes(key.toLowerCase())) {
            return row[actualKey];
          }
        }
      }
      return '';
    };

    const hnRaw = findValue(['hn', 'เลขประจำตัว', 'hospital no', 'รหัส']);
    const hn = String(hnRaw || '').trim();

    const name = String(findValue(['ชื่อ', 'ชื่อ-สกุล', 'name', 'ผู้ป่วย']) || '').trim();
    const visitDateRaw = findValue(['วันที่เบิก', 'วันที่รับยา', 'วันที่', 'date', 'visit']);
    const visitDate = normalizeDate(visitDateRaw) || new Date().toISOString().split('T')[0];

    const weightRaw = findValue(['น้ำหนัก', 'weight', 'bw', 'กก']);
    const weight = parseFloat(weightRaw) || 0;

    const regimen = String(findValue(['สูตรยา', 'regimen', 'สูตรการรักษา']) || '').trim() || '2(HRZE) / 4(HR)';
    const daysRaw = findValue(['จำนวนวัน', 'วัน', 'days', 'ระยะเวลา', 'สัปดาห์']);
    let daysOfSupply = parseInt(daysRaw, 10) || 7;
    if (String(daysRaw).includes('2 สัปดาห์') || String(daysRaw).includes('14')) {
      daysOfSupply = 14;
    } else if (String(daysRaw).includes('1 เดือน') || String(daysRaw).includes('28') || String(daysRaw).includes('30')) {
      daysOfSupply = 28;
    }

    const itemsText = String(findValue(['รายการยา', 'ยาที่เบิก', 'จำนวนเม็ด', 'ยา', 'medication', 'items']) || '').trim();
    const nextApptRaw = findValue(['วันนัด', 'นัดครั้งต่อไป', 'next appt', 'นัดติดตาม', 'appointment']);
    const nextAppointmentDate = normalizeDate(nextApptRaw) || '';

    const nurse = String(findValue(['พยาบาล', 'ผู้เบิก', 'nurse', 'ผู้ส่ง']) || '').trim() || 'พยาบาลคลินิกวัณโรค';
    const notes = String(findValue(['หมายเหตุ', 'อาการ', 'บันทึก', 'note', 'comment']) || '').trim();

    // Reconcile with existing patient
    const matchedPatient = existingPatients.find(
      p => (hn && p.hn.includes(hn)) || (name && p.name.includes(name))
    );

    let status: 'valid' | 'warning' | 'error' = 'valid';
    let errorMessage: string | undefined = undefined;

    if (!hn && !name) {
      status = 'error';
      errorMessage = 'ไม่พบเลข HN หรือชื่อผู้ป่วยในแถวนี้';
    } else if (weight <= 0) {
      status = 'warning';
      errorMessage = 'ไม่มีการระบุน้ำหนักตัว (ควรระบุเพื่อตรวจสอบขนาดยา)';
    }

    results.push({
      rowNumber: index + 2, // 1-indexed, accounting for header row
      hn: hn || (matchedPatient?.hn || 'ไม่ระบุ'),
      name: name || (matchedPatient?.name || 'ผู้ป่วย'),
      visitDate,
      weight: weight || (matchedPatient?.weight || 50),
      regimen: regimen || (matchedPatient?.regimenName || '2HRZE/4HR'),
      daysOfSupply,
      dispensedItemsText: itemsText,
      nextAppointmentDate,
      nurseRequisitionBy: nurse,
      notes,
      status,
      errorMessage,
      matchedPatient
    });
  });

  return results;
}

// Download Sample Excel Template for Nurse Requisitions
export function downloadNurseRequisitionTemplate() {
  const sampleData = [
    {
      "วันที่เบิกยา": "2026-11-04",
      "HN": "450004413",
      "ชื่อ-นามสกุล": "น.ส.โสภา หนูโม",
      "น้ำหนักตัว (กก.)": 38.6,
      "สูตรยา": "2HRE / 7HR (ตับอักเสบ งด Z)",
      "จำนวนวันที่เบิก (วัน)": 7,
      "รายการยาที่ขอเบิก": "H(300mg) 21 เม็ด, R(450mg) 7 แคปซูล, E(600mg) 14 เม็ด, Vit B co 21 เม็ด (1*3 pc)",
      "วันนัดติดตามครั้งต่อไป": "2026-11-11",
      "พยาบาลผู้ส่งเบิก": "พว.สมใจ ใจดี (พยาบาล TB รพ.เขาชัยสน)",
      "หมายเหตุ/อาการข้างเคียง": "ไม่มีอาการคลื่นไส้ตาเหลือง LFT ปกติ"
    },
    {
      "วันที่เบิกยา": "2026-11-04",
      "HN": "450003053",
      "ชื่อ-นามสกุล": "นายภาณุพงศ์ แก้วเจริญ",
      "น้ำหนักตัว (กก.)": 58.9,
      "สูตรยา": "Shorter All-Oral Bdq Regimen",
      "จำนวนวันที่เบิก (วัน)": 14,
      "รายการยาที่ขอเบิก": "Lfx(1000mg) 28 เม็ด, Cfz(100mg) 14 เม็ด, Z(1500mg) 42 เม็ด, E(1200mg) 42 เม็ด",
      "วันนัดติดตามครั้งต่อไป": "2026-11-18",
      "พยาบาลผู้ส่งเบิก": "พว.สมใจ ใจดี (พยาบาล TB รพ.เขาชัยสน)",
      "หมายเหตุ/อาการข้างเคียง": "ผิวคล้ำเล็กน้อย ไม่มีใจสั่น EKG ปกติ"
    },
    {
      "วันที่เบิกยา": "2026-11-04",
      "HN": "450009182",
      "ชื่อ-นามสกุล": "นายบุญมี เจริญศิลป์",
      "น้ำหนักตัว (กก.)": 52.0,
      "สูตรยา": "2(HRZE) / 4(HR)",
      "จำนวนวันที่เบิก (วัน)": 7,
      "รายการยาที่ขอเบิก": "4FDC 21 เม็ด (วันละ 3 เม็ด), Vit B co 21 เม็ด (1*3 pc)",
      "วันนัดติดตามครั้งต่อไป": "2026-11-11",
      "พยาบาลผู้ส่งเบิก": "พว.สมใจ ใจดี (พยาบาล TB รพ.เขาชัยสน)",
      "หมายเหตุ/อาการข้างเคียง": "มาตามนัดเสมหะยังไอเล็กน้อย"
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  // Auto-fit column widths
  worksheet['!cols'] = [
    { wch: 14 },
    { wch: 14 },
    { wch: 25 },
    { wch: 16 },
    { wch: 30 },
    { wch: 20 },
    { wch: 45 },
    { wch: 22 },
    { wch: 35 },
    { wch: 35 }
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "ใบเบิกยาวัณโรครายสัปดาห์");

  XLSX.writeFile(workbook, "TB_Nurse_Requisition_Template_KhaoChaison.xlsx");
}
