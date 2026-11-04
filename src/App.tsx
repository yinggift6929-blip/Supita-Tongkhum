import React, { useState } from 'react';
import { Header } from './components/Header';
import { PatientRegistry } from './components/PatientRegistry';
import { DosingCalculator } from './components/DosingCalculator';
import { RechallengeManager } from './components/RechallengeManager';
import { GuidelinesLibrary } from './components/GuidelinesLibrary';
import { 
  CheerUpModal, 
  NewPatientModal, 
  AddAdrModal, 
  AddSoapModal, 
  PrintSummaryModal 
} from './components/Modals';
import { INITIAL_PATIENTS } from './data/cpgData';
import { Patient, ADRRecord, SOAPNote } from './types/tb';

export default function App() {
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(INITIAL_PATIENTS[0].id);
  const [activeTab, setActiveTab] = useState<'registry' | 'calculator' | 'rechallenge' | 'guidelines'>('registry');

  // Modal Visibility States
  const [showCheerUpModal, setShowCheerUpModal] = useState<boolean>(false);
  const [showNewPatientModal, setShowNewPatientModal] = useState<boolean>(false);
  const [showAdrModal, setShowAdrModal] = useState<boolean>(false);
  const [showSoapModal, setShowSoapModal] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

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

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans antialiased selection:bg-teal-500 selection:text-white">
      {/* APP HEADER & NAVIGATION */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        patients={patients}
        onOpenNewPatientModal={() => setShowNewPatientModal(true)}
        onOpenPrintModal={() => setShowPrintModal(true)}
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
            TB Pharmacy Care Hub © 2026 • ออกแบบตามแนวทางการควบคุมวัณโรคประเทศไทย พ.ศ. 2564 (Thailand CPG 2021)
          </span>
          <span className="font-medium text-teal-800">
            กรมควบคุมโรค กระทรวงสาธารณสุข & สมาคมปราบวัณโรคแห่งประเทศไทย
          </span>
        </div>
      </footer>

      {/* MODALS */}
      {showCheerUpModal && (
        <CheerUpModal
          patient={selectedPatient}
          onClose={() => setShowCheerUpModal(false)}
        />
      )}

      {showNewPatientModal && (
        <NewPatientModal
          onClose={() => setShowNewPatientModal(false)}
          onSubmit={handleCreatePatient}
        />
      )}

      {showAdrModal && (
        <AddAdrModal
          onClose={() => setShowAdrModal(false)}
          onSubmit={handleAddAdr}
        />
      )}

      {showSoapModal && (
        <AddSoapModal
          onClose={() => setShowSoapModal(false)}
          onSubmit={handleAddSoap}
        />
      )}

      {showPrintModal && (
        <PrintSummaryModal
          patient={selectedPatient}
          onClose={() => setShowPrintModal(false)}
        />
      )}
    </div>
  );
}
