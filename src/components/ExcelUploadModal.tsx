import React, { useState, useRef } from 'react';
import { 
  FileSpreadsheet, 
  Upload, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Check, 
  ArrowRight,
  Info,
  Calendar,
  Pill,
  Clock
} from 'lucide-react';
import { Patient, PatientVisit } from '../types/tb';
import { 
  parseExcelRequisitionFile, 
  downloadNurseRequisitionTemplate, 
  ParsedRequisitionRow 
} from '../utils/excelImport';

interface ExcelUploadModalProps {
  existingPatients: Patient[];
  onClose: () => void;
  onImportSuccess: (importedRows: ParsedRequisitionRow[]) => void;
}

export const ExcelUploadModal: React.FC<ExcelUploadModalProps> = ({
  existingPatients,
  onClose,
  onImportSuccess
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [parsedRows, setParsedRows] = useState<ParsedRequisitionRow[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setErrorMsg('');
    setLoading(true);

    try {
      const rows = await parseExcelRequisitionFile(selectedFile, existingPatients);
      setParsedRows(rows);
      if (rows.length === 0) {
        setErrorMsg('ไม่พบข้อมูลผู้ป่วยในไฟล์ หรือรูปแบบตารางไม่ตรงตามกำหนด');
      }
    } catch (err: any) {
      setErrorMsg(`เกิดข้อผิดพลาดในการอ่านไฟล์ Excel: ${err.message || 'โปรดตรวจสอบรูปแบบไฟล์'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (!droppedFile) return;

    setFile(droppedFile);
    setErrorMsg('');
    setLoading(true);

    try {
      const rows = await parseExcelRequisitionFile(droppedFile, existingPatients);
      setParsedRows(rows);
      if (rows.length === 0) {
        setErrorMsg('ไม่พบข้อมูลผู้ป่วยในไฟล์ หรือรูปแบบตารางไม่ตรงตามกำหนด');
      }
    } catch (err: any) {
      setErrorMsg(`เกิดข้อผิดพลาดในการอ่านไฟล์: ${err.message || 'โปรดตรวจสอบรูปแบบไฟล์'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmImport = () => {
    if (parsedRows.length === 0) return;
    onImportSuccess(parsedRows);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center font-black shadow-sm">
              <FileSpreadsheet className="w-7 h-7 text-emerald-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                  อัปโหลดไฟล์เบิกยาผู้ป่วยรายสัปดาห์ (Weekly Nurse Requisition Import)
                </h3>
                <span className="bg-emerald-100 text-emerald-900 font-black text-[10px] px-2 py-0.5 rounded-full">
                  Excel / CSV
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                รองรับไฟล์เบิกยาที่ส่งจากพยาบาลคลินิกวัณโรค รพ.เขาชัยสน นำเข้าประวัติ visit และอัปเดตวันนัดอัตโนมัติ
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Template Download Banner */}
        <div className="bg-teal-50/70 p-3.5 rounded-2xl border border-teal-200 flex flex-wrap justify-between items-center gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Info className="w-4 h-4 text-teal-700 shrink-0" />
            <span className="text-teal-950 font-medium">
              หากยังไม่มีแบบฟอร์ม สามารถดาวน์โหลดไฟล์แม่แบบ Excel สำหรับให้พยาบาลกรอกข้อมูลเบิกยาได้ที่นี่
            </span>
          </div>
          <button
            onClick={downloadNurseRequisitionTemplate}
            className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ดาวน์โหลดแม่แบบ Excel (Template)</span>
          </button>
        </div>

        {/* Dropzone Area */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`p-6 sm:p-8 rounded-2xl border-2 border-dashed text-center transition-all cursor-pointer ${
            file
              ? 'bg-emerald-50/50 border-emerald-400'
              : 'bg-slate-50 border-slate-300 hover:bg-slate-100/60'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".xlsx, .xls, .csv"
            className="hidden"
          />

          <div className="max-w-md mx-auto space-y-2">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-xs border border-slate-200 mx-auto flex items-center justify-center text-teal-700">
              <Upload className="w-6 h-6 animate-bounce" />
            </div>
            <h4 className="font-extrabold text-sm text-slate-800">
              {file ? `ไฟล์ที่เลือก: ${file.name}` : 'ลากไฟล์ Excel (.xlsx, .xls, .csv) มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์'}
            </h4>
            <p className="text-xs text-slate-500">
              ระบบจะจับคู่วันที่เบิก, HN, ชื่อผู้ป่วย, น้ำหนักตัว, สูตรยา, จำนวนวัน, รายการยา, และวันนัดติดตามให้อัตโนมัติ
            </p>
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-rose-950 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Preview Table if rows parsed */}
        {parsedRows.length > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800">
                ตัวอย่างข้อมูลที่จะนำเข้า ({parsedRows.length} รายการ):
              </span>
              <span className="text-[11px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                พบผู้ป่วยตรงกับระบบ {parsedRows.filter(r => r.matchedPatient).length} คน
              </span>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs max-h-[260px] overflow-y-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 sticky top-0">
                  <tr>
                    <th className="p-2.5">แถว</th>
                    <th className="p-2.5">วันที่เบิก</th>
                    <th className="p-2.5">HN / ชื่อผู้ป่วย</th>
                    <th className="p-2.5">น้ำหนัก (kg)</th>
                    <th className="p-2.5">สูตรยา / วันยา</th>
                    <th className="p-2.5">วันนัดครั้งต่อไป</th>
                    <th className="p-2.5">สถานะในระบบ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {parsedRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-2.5 font-mono text-slate-400">{row.rowNumber}</td>
                      <td className="p-2.5 font-mono text-slate-800">{row.visitDate}</td>
                      <td className="p-2.5">
                        <div className="font-bold text-slate-900">{row.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">HN: {row.hn}</div>
                      </td>
                      <td className="p-2.5">
                        <span className={row.weight < 50 ? 'text-amber-700 font-bold' : 'text-slate-800'}>
                          {row.weight} kg
                        </span>
                        {row.weight < 50 && (
                          <span className="block text-[9px] text-amber-700 font-bold">(BW &lt; 50)</span>
                        )}
                      </td>
                      <td className="p-2.5">
                        <div className="font-bold text-teal-900">{row.regimen}</div>
                        <div className="text-[10px] text-slate-500">{row.daysOfSupply} วัน</div>
                      </td>
                      <td className="p-2.5 font-mono text-slate-800">
                        {row.nextAppointmentDate || <span className="text-slate-400">-</span>}
                      </td>
                      <td className="p-2.5">
                        {row.matchedPatient ? (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                            ตรงกับผู้ป่วยเดิม
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded">
                            ผู้ป่วยใหม่
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="pt-2 border-t border-slate-100 flex justify-end gap-2 text-xs">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleConfirmImport}
            disabled={parsedRows.length === 0}
            className={`px-5 py-2 font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer ${
              parsedRows.length > 0
                ? 'bg-teal-700 hover:bg-teal-800 text-white'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>ยืนยันนำเข้าข้อมูล ({parsedRows.length} รายการ)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
