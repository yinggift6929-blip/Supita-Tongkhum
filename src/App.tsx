import React, { useState } from 'react';
import { Header } from './components/Header';
import { PatientRegistry } from './components/PatientRegistry';
import { DosingCalculator } from './components/DosingCalculator';
import { RechallengeManager } from './components/RechallengeManager';
import { GuidelinesLibrary } from './components/GuidelinesLibrary';
import { UpcomingAppointmentsModal } from './components/UpcomingAppointmentsModal';
import { ExcelUploadModal } from './components/ExcelUploadModal';
import { AddVisitModal } from './components/AddVisitModal';
import { MonthlyDashboard } from './components/MonthlyDashboard';
import { 
  CheerUpModal, 
  NewPatientModal, 
  AddAdrModal, 
  AddSoapModal, 
  PrintSummaryModal 
} from './components/Modals';
import { INITIAL_PATIENTS } from './data/cpgData';
import { Patient, PatientVisit, ADRRecord, SOAPNote } from './types/tb';
import { ParsedRequisitionRow } from './utils/excelImport';

export default function App() {
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(INITIAL_PATIENTS[0].id);
  const [activeTab, setActiveTab] = useState<'registry' | 'calculator' | 'rechallenge' | 'guidelines' | 'dashboard'>('registry');

  // Modal Visibility States
  // Pop-up shows on initial load before entering app as requested!
  const [showAppointmentsModal, setShowAppointmentsModal] = useState<boolean>(true);
  const [showExcelModal, setShowExcelModal] = useState<boolean>(false);
  const [showAddVisitModal, setShowAddVisitModal] = useState<boolean>(false);
  const [targetVisitPatientId, setTargetVisitPatientId] = useState<string>(INITIAL_PATIENTS[0].id);

  const [showCheerUpModal, setShowCheerUpModal] = useState<boolean>(false);
  const [showNewPatientModal, setShowNewPatientModal] = useState<boolean>(false);
  const [showAdrModal, setShowAdrModal] = useState<boolean>(false);
  const [showSoapModal, setShowSoapModal] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];
  const targetVisitPatient = patients.find(p => p.id === targetVisitPatientId) || selectedPatient;

  // Handler: Toggle Sputum AFB Status (+ / -)
  const handleToggleSputumStatus = (patientId: string) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        const isPos = p.sputumStatus === 'Positive';
        const willBePositive = !isPos;
        
        let newAlerts = [...p.alerts];
        if (willBePositive) {
          newAlerts.push({
            id: `ALT-SPUTUM-${Date.now()}`,
            type: 'Critical',
            text: '🚨 ผลเสมหะ AFB (+) ในเดือนที่ 2/5 แนะนำขยายเวลาทานยาต่ออีก 2 เดือน และส่งเพาะเชื้อทดสอบความไวต่อยา (DST)'
          });
        } else {
          newAlerts = newAlerts.filter(a => !a.text.includes('ผลเสมหะ AFB (+)'));
        }

        return {
          ...p,
          sputumStatus: willBePositive ? 'Positive' : 'Negative',
          extendedPhase: willBePositive,
          extendedMonths: willBePositive ? 2 : 0,
          alerts: newAlerts
        };
      }
      return p;
    }));
  };

  // Handler: Advance month of treatment (+1 Month)
  const handleAdvanceMonth = (patientId: string) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        const totalMonths = p.extendedPhase ? p.regimenMonths + p.extendedMonths : p.regimenMonths;
        const nextMonth = Math.min(p.monthOfTreatment + 1, totalMonths);
        return {
          ...p,
          monthOfTreatment: nextMonth
        };
      }
      return p;
    }));
  };

  // Handler: Add Multidisciplinary Team Note
  const handleAddMultiNote = (patientId: string, text: string) => {
    const newNote = {
      id: `MDT-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      sender: 'ภก.คลินิก (เภสัชกร)',
      role: 'Pharmacist' as const,
      text
    };

    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          multidisciplinaryNotes: [newNote, ...p.multidisciplinaryNotes]
        };
      }
      return p;
    }));
  };

  // Handler: Add Adverse Drug Reaction
  const handleAddAdr = (adrData: Omit<ADRRecord, 'id'>) => {
    const record: ADRRecord = {
      id: `ADR-${Date.now()}`,
      ...adrData
    };

    setPatients(prev => prev.map(p => {
      if (p.id === selectedPatientId) {
        return {
          ...p,
          adrRecords: [record, ...p.adrRecords],
          alerts: adrData.severity === 'Severe' || adrData.severity === 'Life-threatening'
            ? [
                {
                  id: `ALT-ADR-${Date.now()}`,
                  type: 'Critical',
                  text: `🚨 ประวัติแพ้ยารุนแรง (${adrData.drug}): ${adrData.reaction}`
                },
                ...p.alerts
              ]
            : p.alerts
        };
      }
      return p;
    }));
    setShowAdrModal(false);
  };

  // Handler: Add SOAP Note
  const handleAddSoap = (soapData: Omit<SOAPNote, 'id'>) => {
    const record: SOAPNote = {
      id: `SOAP-${Date.now()}`,
      ...soapData
    };

    setPatients(prev => prev.map(p => {
      if (p.id === selectedPatientId) {
        return {
          ...p,
          soapNotes: [record, ...p.soapNotes]
        };
      }
      return p;
    }));
    setShowSoapModal(false);
  };

  // Handler: Create New Patient
  const handleCreatePatient = (newPatientData: Partial<Patient>) => {
    const fullPatient: Patient = {
      id: `TB-69-00${patients.length + 1}`,
      hn: newPatientData.hn || '450000000',
      name: newPatientData.name || 'ผู้ป่วย รายใหม่',
      age: newPatientData.age || 45,
      gender: newPatientData.gender || 'ชาย',
      weight: newPatientData.weight || 50,
      height: newPatientData.height || 160,
      bmi: newPatientData.bmi || 19.5,
      patientType: newPatientData.patientType || 'New Case (DS-TB)',
      hivStatus: newPatientData.hivStatus || 'Negative',
      diagnosis: newPatientData.diagnosis || 'Pulmonary TB',
      regimenId: newPatientData.regimenId || 'STD_2HRZE_4HR_STD',
      regimenName: newPatientData.regimenName || '2(HRZE) / 4(HR)',
      regimenMonths: newPatientData.regimenMonths || 6,
      monthOfTreatment: 1,
      sputumStatus: newPatientData.sputumStatus || 'Positive',
      extendedPhase: false,
      extendedMonths: 0,
      adherenceRate: 100,
      dotType: newPatientData.dotType || 'Hospital DOT',
      phoneNumber: newPatientData.phoneNumber || '',
      nextAppointmentDate: newPatientData.nextAppointmentDate || '',
      visits: [],
      concomitantMeds: [],
      adrRecords: [],
      soapNotes: [],
      multidisciplinaryNotes: newPatientData.multidisciplinaryNotes || [],
      alerts: newPatientData.alerts || []
    };

    setPatients([fullPatient, ...patients]);
    setSelectedPatientId(fullPatient.id);
    setShowNewPatientModal(false);
  };

  // Handler: Update Rechallenge Status
  const handleUpdatePatientRechallenge = (patientId: string, status: any) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          rechallengeStatus: status,
          multidisciplinaryNotes: [
            {
              id: `MDT-${Date.now()}`,
              date: new Date().toISOString().split('T')[0],
              sender: 'ภก.คลินิก (เภสัชกร)',
              role: 'Pharmacist',
              text: `อัปเดตขั้นตอน Re-challenge: Step ${status.currentStep} (${status.notes || ''})`
            },
            ...p.multidisciplinaryNotes
          ]
        };
      }
      return p;
    }));
  };

  // Handler: Add Single Visit
  const handleAddVisit = (patientId: string, visit: PatientVisit) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        const newWeight = visit.weight || p.weight;
        const newBmi = p.height > 0 ? parseFloat((newWeight / Math.pow(p.height / 100, 2)).toFixed(1)) : p.bmi;

        let updatedAlerts = [...p.alerts];
        if (visit.nextAppointmentDate && visit.nextAppointmentDate >= '2026-11-04') {
          // Clear overdue alert if newly scheduled
          updatedAlerts = updatedAlerts.filter(a => !a.text.includes('ขาดนัด'));
        }

        return {
          ...p,
          weight: newWeight,
          bmi: newBmi,
          regimenName: visit.regimen || p.regimenName,
          nextAppointmentDate: visit.nextAppointmentDate || p.nextAppointmentDate,
          visits: [...(p.visits || []), visit],
          alerts: updatedAlerts,
          multidisciplinaryNotes: [
            {
              id: `MDT-${Date.now()}`,
              date: visit.visitDate,
              sender: 'ภก.คลินิก (เภสัชกร)',
              role: 'Pharmacist',
              text: `บันทึกการรับยา Visit ใหม่: วันที่ ${visit.visitDate}, น้ำหนัก ${newWeight} kg, สูตร ${visit.regimen}, จ่ายยา ${visit.daysOfSupply} วัน, นัดติดตาม ${visit.nextAppointmentDate || 'ไม่ระบุ'}`
            },
            ...p.multidisciplinaryNotes
          ]
        };
      }
      return p;
    }));
    setShowAddVisitModal(false);
  };

  // Handler: Mark Visit as Dispensed
  const handleMarkVisitDispensed = (patientId: string, visitId: string) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          visits: (p.visits || []).map(v => 
            v.id === visitId 
              ? { ...v, dispenseStatus: 'Dispensed' as const, dispensedBy: 'ภก.วิชัย ชื่นกมล (ภก.คลินิก)' } 
              : v
          )
        };
      }
      return p;
    }));
  };

  // Handler: Update Next Appointment Date directly
  const handleUpdateNextAppointment = (patientId: string, nextDate: string) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        let updatedAlerts = [...p.alerts];
        if (nextDate >= '2026-11-04') {
          updatedAlerts = updatedAlerts.filter(a => !a.text.includes('ขาดนัด'));
        }

        return {
          ...p,
          nextAppointmentDate: nextDate,
          alerts: updatedAlerts,
          multidisciplinaryNotes: [
            {
              id: `MDT-${Date.now()}`,
              date: new Date().toISOString().split('T')[0],
              sender: 'ภก.คลินิก (เภสัชกร)',
              role: 'Pharmacist',
              text: `ปรับเปลี่ยนวันนัดติดตามผู้ป่วยเป็น: ${nextDate}`
            },
            ...p.multidisciplinaryNotes
          ]
        };
      }
      return p;
    }));
  };

  // Handler: Update HosXP Pharmaceutical Care Notes (User Request #1)
  const handleSaveHosxpNotes = (patientId: string, notes: string) => {
    const now = new Date();
    const timeStr = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          hosxpNotes: notes,
          hosxpLastUpdated: timeStr,
          hosxpUpdatedBy: 'ภก.วิชัย ชื่นกมล (ภก.คลินิก)',
          multidisciplinaryNotes: [
            {
              id: `MDT-${Date.now()}`,
              date: now.toISOString().split('T')[0],
              sender: 'ภก.คลินิก (HosXP)',
              role: 'Pharmacist',
              text: `[บันทึก HosXP] ปรับปรุงข้อมูลการบริบาลเภสัชกรรม: ${notes.slice(0, 80)}...`
            },
            ...p.multidisciplinaryNotes
          ]
        };
      }
      return p;
    }));
  };

  // Handler: Update Patient Regimen & Tablet Dosing
  const handleUpdatePatientRegimen = (patientId: string, updatedRegimen: string, customDoses?: any) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          regimenName: updatedRegimen,
          customDoses,
          multidisciplinaryNotes: [
            {
              id: `MDT-${Date.now()}`,
              date: new Date().toISOString().split('T')[0],
              sender: 'ภก.คลินิก (เภสัชกร)',
              role: 'Pharmacist',
              text: `[ปรับสูตรยา & จำนวนเม็ด] ปรับขนาดยาประจำตัวผู้ป่วยเป็น: ${updatedRegimen}`
            },
            ...p.multidisciplinaryNotes
          ]
        };
      }
      return p;
    }));
  };

  // Handler: Update Patient Basic Info (Name, HN, Age, Gender, Weight, Phone)
  const handleUpdatePatientInfo = (
    patientId: string,
    updatedData: {
      name: string;
      hn: string;
      age: number;
      gender: 'ชาย' | 'หญิง';
      weight: number;
      phoneNumber?: string;
    }
  ) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        const newBmi = p.height > 0 ? parseFloat((updatedData.weight / Math.pow(p.height / 100, 2)).toFixed(1)) : p.bmi;
        return {
          ...p,
          ...updatedData,
          bmi: newBmi
        };
      }
      return p;
    }));
  };

  // Handler: Delete / Discharge (D/C) Patient
  const handleDeletePatient = (patientId: string) => {
    setPatients(prev => {
      const remaining = prev.filter(p => p.id !== patientId);
      if (selectedPatientId === patientId && remaining.length > 0) {
        setSelectedPatientId(remaining[0].id);
      }
      return remaining;
    });
  };

  // Handler: Import Excel Weekly Requisitions
  const handleImportExcelVisits = (importedRows: ParsedRequisitionRow[]) => {
    let updatedList = [...patients];

    importedRows.forEach(row => {
      // Find matching patient
      const matchIndex = updatedList.findIndex(
        p => (row.hn && p.hn.includes(row.hn)) || (row.name && p.name.includes(row.name))
      );

      const visitObj: PatientVisit = {
        id: `VISIT-IMP-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        visitDate: row.visitDate,
        weight: row.weight,
        regimen: row.regimen,
        daysOfSupply: row.daysOfSupply,
        dispenseStatus: 'Dispensed',
        dispensedBy: 'ภก.วิชัย ชื่นกมล (นำเข้าจากไฟล์เบิกยา)',
        nurseRequisitionBy: row.nurseRequisitionBy || 'พยาบาลคลินิก TB รพ.เขาชัยสน',
        dispensedItems: row.dispensedItemsText ? [{ drugName: row.dispensedItemsText, quantity: '' }] : [],
        nextAppointmentDate: row.nextAppointmentDate,
        notes: row.notes,
        sideEffectsNoted: 'นำเข้าจากไฟล์ใบเบิกยาพยาบาล',
        medicationTakingStatus: 'correct'
      };

      if (matchIndex >= 0) {
        // Update existing patient
        const existing = updatedList[matchIndex];
        const newWeight = row.weight > 0 ? row.weight : existing.weight;
        const newBmi = existing.height > 0 ? parseFloat((newWeight / Math.pow(existing.height / 100, 2)).toFixed(1)) : existing.bmi;

        updatedList[matchIndex] = {
          ...existing,
          weight: newWeight,
          bmi: newBmi,
          regimenName: row.regimen || existing.regimenName,
          nextAppointmentDate: row.nextAppointmentDate || existing.nextAppointmentDate,
          visits: [...(existing.visits || []), visitObj],
          multidisciplinaryNotes: [
            {
              id: `MDT-${Date.now()}`,
              date: row.visitDate,
              sender: row.nurseRequisitionBy || 'พว.สมใจ (พยาบาล TB)',
              role: 'Nurse',
              text: `[ใบเบิกยา Excel] ขอเบิกยา ${row.regimen} จำนวน ${row.daysOfSupply} วัน น้ำหนัก ${row.weight} kg นัดครั้งต่อไป ${row.nextAppointmentDate || 'ไม่ระบุ'}`
            },
            ...existing.multidisciplinaryNotes
          ]
        };
      } else {
        // Create new patient from requisition
        const newPatient: Patient = {
          id: `TB-69-00${updatedList.length + 1}`,
          hn: row.hn || `${Math.floor(100000000 + Math.random() * 900000000)}`,
          name: row.name || 'ผู้ป่วยใหม่ (จากใบเบิกยา)',
          age: 45,
          gender: 'ชาย',
          weight: row.weight || 50,
          height: 160,
          bmi: 19.5,
          patientType: 'New Case (DS-TB)',
          hivStatus: 'Negative',
          diagnosis: 'Pulmonary TB',
          regimenId: 'STD_2HRZE_4HR_STD',
          regimenName: row.regimen || '2(HRZE) / 4(HR)',
          regimenMonths: 6,
          monthOfTreatment: 1,
          sputumStatus: 'Negative',
          extendedPhase: false,
          extendedMonths: 0,
          adherenceRate: 100,
          dotType: 'Hospital DOT',
          nextAppointmentDate: row.nextAppointmentDate,
          visits: [visitObj],
          concomitantMeds: [],
          adrRecords: [],
          soapNotes: [],
          multidisciplinaryNotes: [
            {
              id: `MDT-${Date.now()}`,
              date: row.visitDate,
              sender: row.nurseRequisitionBy || 'พว.สมใจ (พยาบาล TB)',
              role: 'Nurse',
              text: `ลงทะเบียนผู้ป่วยจากการนำเข้าไฟล์เบิกยา: ${row.regimen} (${row.daysOfSupply} วัน)`
            }
          ],
          alerts: row.weight < 50 ? [{ id: `ALT-${Date.now()}`, type: 'Warning', text: 'น้ำหนักตัวน้อย (< 50 kg) แนะนำคำนวณแยกเม็ดตามน้ำหนักตัวจริง' }] : []
        };
        updatedList = [newPatient, ...updatedList];
      }
    });

    setPatients(updatedList);
  };

  // Open Add Visit Modal for a specific patient
  const handleOpenAddVisitModal = (patientId: string) => {
    setTargetVisitPatientId(patientId);
    setShowAddVisitModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans antialiased selection:bg-teal-500 selection:text-white">
      {/* APP HEADER & NAVIGATION */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        patients={patients}
        onOpenNewPatientModal={() => setShowNewPatientModal(true)}
        onOpenPrintModal={() => setShowPrintModal(true)}
        onOpenExcelModal={() => setShowExcelModal(true)}
        onOpenAppointmentsModal={() => setShowAppointmentsModal(true)}
      />

      {/* MAIN BODY WORKSPACE */}
      <main className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full">
        {activeTab === 'registry' && (
          <PatientRegistry
            patients={patients}
            selectedPatientId={selectedPatientId}
            onSelectPatient={setSelectedPatientId}
            onToggleSputumStatus={handleToggleSputumStatus}
            onOpenCheerUpModal={() => setShowCheerUpModal(true)}
            onOpenAdrModal={() => setShowAdrModal(true)}
            onOpenSoapModal={() => setShowSoapModal(true)}
            onAddMultiNote={handleAddMultiNote}
            onAdvanceMonth={handleAdvanceMonth}
            onOpenAddVisitModal={handleOpenAddVisitModal}
            onMarkVisitDispensed={handleMarkVisitDispensed}
            onUpdateNextAppointment={handleUpdateNextAppointment}
            onUpdateHosxpNotes={handleSaveHosxpNotes}
            onUpdatePatientRegimen={handleUpdatePatientRegimen}
            onUpdatePatientInfo={handleUpdatePatientInfo}
            onDeletePatient={handleDeletePatient}
          />
        )}

        {activeTab === 'dashboard' && (
          <MonthlyDashboard
            patients={patients}
            onSelectPatient={(id) => {
              setSelectedPatientId(id);
              setActiveTab('registry');
            }}
          />
        )}

        {activeTab === 'calculator' && (
          <DosingCalculator />
        )}

        {activeTab === 'rechallenge' && (
          <RechallengeManager
            patients={patients}
            selectedPatientId={selectedPatientId}
            onUpdatePatientRechallenge={handleUpdatePatientRechallenge}
          />
        )}

        {activeTab === 'guidelines' && (
          <GuidelinesLibrary />
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-4 px-4 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <span>
            TB Pharmacy Care Hub • โรงพยาบาลเขาชัยสน จังหวัดพัทลุง © 2026
          </span>
          <span className="font-medium text-teal-800">
            ระบบบริบาลผู้ป่วยวัณโรค & การเบิกจ่ายยาร่วมระหว่างพยาบาลและเภสัชกร (Thailand CPG 2021)
          </span>
        </div>
      </footer>

      {/* 🔔 1. UPCOMING APPOINTMENTS POP-UP (DISPLAYS BEFORE ENTERING APP OR ON DEMAND) */}
      {showAppointmentsModal && (
        <UpcomingAppointmentsModal
          patients={patients}
          onClose={() => setShowAppointmentsModal(false)}
          onSelectPatient={(id) => {
            setSelectedPatientId(id);
            setActiveTab('registry');
          }}
          onOpenAddVisitModal={handleOpenAddVisitModal}
        />
      )}

      {/* 📊 2. EXCEL WEEKLY REQUISITION UPLOAD MODAL */}
      {showExcelModal && (
        <ExcelUploadModal
          existingPatients={patients}
          onClose={() => setShowExcelModal(false)}
          onImportSuccess={handleImportExcelVisits}
        />
      )}

      {/* 💊 3. ADD VISIT / RECORD DISPENSE MODAL */}
      {showAddVisitModal && (
        <AddVisitModal
          patient={targetVisitPatient}
          onClose={() => setShowAddVisitModal(false)}
          onSubmit={handleAddVisit}
        />
      )}

      {/* 4. CHEER UP MODAL */}
      {showCheerUpModal && (
        <CheerUpModal
          patient={selectedPatient}
          onClose={() => setShowCheerUpModal(false)}
        />
      )}

      {/* 5. NEW PATIENT REGISTRATION MODAL */}
      {showNewPatientModal && (
        <NewPatientModal
          onClose={() => setShowNewPatientModal(false)}
          onSubmit={handleCreatePatient}
        />
      )}

      {/* 6. ADD ADR MODAL */}
      {showAdrModal && (
        <AddAdrModal
          onClose={() => setShowAdrModal(false)}
          onSubmit={handleAddAdr}
        />
      )}

      {/* 7. ADD SOAP NOTE MODAL */}
      {showSoapModal && (
        <AddSoapModal
          onClose={() => setShowSoapModal(false)}
          onSubmit={handleAddSoap}
        />
      )}

      {/* 8. PRINTABLE SUMMARY MODAL */}
      {showPrintModal && (
        <PrintSummaryModal
          patient={selectedPatient}
          onClose={() => setShowPrintModal(false)}
        />
      )}
    </div>
  );
}
