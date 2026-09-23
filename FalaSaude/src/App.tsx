import { useState } from 'react';
import { ScreenId, Patient } from './types/clinical';
import { INITIAL_PATIENTS } from './data/mockClinicalData';
import { Header } from './components/Header';
import { ScreenFilaPlantao } from './components/screens/ScreenFilaPlantao';
import { ScreenConsentimento } from './components/screens/ScreenConsentimento';
import { ScreenAtendimentoTranscricao } from './components/screens/ScreenAtendimentoTranscricao';
import { ScreenRevisaoRascunho } from './components/screens/ScreenRevisaoRascunho';
import { ScreenExcecaoSemDecisao } from './components/screens/ScreenExcecaoSemDecisao';
import { ScreenResumoAuditoria } from './components/screens/ScreenResumoAuditoria';
import { StitchReferenceModal } from './components/modals/StitchReferenceModal';
import { ManualAllergyModal } from './components/modals/ManualAllergyModal';
import { PrintGuidesModal } from './components/modals/PrintGuidesModal';
import { QrCodeModal } from './components/modals/QrCodeModal';
import { PatientCallModal } from './components/modals/PatientCallModal';

export default function App() {
  const [patients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('fila-do-plantao');
  const [selectedCase, setSelectedCase] = useState<'carlos' | 'ana' | 'jose' | 'maria'>('carlos');
  const [currentPatient, setCurrentPatient] = useState<Patient>(
    INITIAL_PATIENTS.find((p) => p.caseKey === 'carlos') || INITIAL_PATIENTS[2]
  );

  // Modals state
  const [isStitchGalleryOpen, setIsStitchGalleryOpen] = useState(false);
  const [isManualAllergyModalOpen, setIsManualAllergyModalOpen] = useState(false);
  const [isPrintGuidesModalOpen, setIsPrintGuidesModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [callingPatient, setCallingPatient] = useState<Patient | null>(null);
  const [manualAllergySubstance, setManualAllergySubstance] = useState<string | null>(null);

  // Handle case selection
  const handleSelectCase = (caseKey: 'carlos' | 'ana' | 'jose' | 'maria') => {
    setSelectedCase(caseKey);
    const found = patients.find((p) => p.caseKey === caseKey);
    if (found) {
      setCurrentPatient(found);
    }

    // Smart route to the most characteristic screen of each case
    if (caseKey === 'carlos') {
      setCurrentScreen('rascunho');
    } else if (caseKey === 'ana') {
      setCurrentScreen('rascunho');
    } else if (caseKey === 'jose') {
      setCurrentScreen('excecao');
    } else if (caseKey === 'maria') {
      setCurrentScreen('consentimento');
    }
  };

  // Handle patient select from Queue
  const handleSelectPatient = (patient: Patient, targetScreen?: ScreenId) => {
    setCurrentPatient(patient);
    setSelectedCase(patient.caseKey);
    if (targetScreen) {
      setCurrentScreen(targetScreen);
    } else {
      if (patient.caseKey === 'jose') {
        setCurrentScreen('excecao');
      } else if (patient.caseKey === 'maria') {
        setCurrentScreen('consentimento');
      } else if (patient.status === 'rascunho_pronto' || patient.status === 'revisao_pendente') {
        setCurrentScreen('rascunho');
      } else {
        setCurrentScreen('consentimento');
      }
    }
  };

  // Handle call patient
  const handleCallPatient = (patient: Patient) => {
    setCallingPatient(patient);
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col font-sans selection:bg-[#86f2e4] selection:text-[#005049]">
      {/* Universal Fixed Header */}
      <Header
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        onOpenStitchGallery={() => setIsStitchGalleryOpen(true)}
        selectedCase={selectedCase}
        onSelectCase={handleSelectCase}
      />

      {/* Screen Views */}
      <div className="flex-1 flex flex-col">
        {currentScreen === 'fila-do-plantao' && (
          <ScreenFilaPlantao
            patients={patients}
            onSelectPatient={handleSelectPatient}
            onCallPatient={handleCallPatient}
            onNavigate={setCurrentScreen}
          />
        )}

        {currentScreen === 'consentimento' && (
          <ScreenConsentimento
            currentPatient={currentPatient}
            onNavigate={setCurrentScreen}
            onSelectCase={handleSelectCase}
          />
        )}

        {currentScreen === 'atendimento' && (
          <ScreenAtendimentoTranscricao
            patient={currentPatient}
            onNavigate={setCurrentScreen}
            onSelectCase={handleSelectCase}
          />
        )}

        {currentScreen === 'rascunho' && (
          <ScreenRevisaoRascunho
            currentPatient={currentPatient}
            onNavigate={setCurrentScreen}
            onOpenManualAllergyModal={() => setIsManualAllergyModalOpen(true)}
            onOpenPrintGuidesModal={() => setIsPrintGuidesModalOpen(true)}
            onSelectCase={handleSelectCase}
            manualAllergySubstance={manualAllergySubstance}
          />
        )}

        {currentScreen === 'excecao' && (
          <ScreenExcecaoSemDecisao
            currentPatient={currentPatient}
            onNavigate={setCurrentScreen}
            onSelectCase={handleSelectCase}
          />
        )}

        {currentScreen === 'auditoria' && (
          <ScreenResumoAuditoria
            currentPatient={currentPatient}
            onNavigate={setCurrentScreen}
            onOpenQrModal={() => setIsQrModalOpen(true)}
          />
        )}
      </div>

      {/* MODALS */}
      {/* 1. Stitch Reference Gallery Modal */}
      <StitchReferenceModal
        isOpen={isStitchGalleryOpen}
        onClose={() => setIsStitchGalleryOpen(false)}
        onSelectScreen={(screenId) => {
          setCurrentScreen(screenId);
          setIsStitchGalleryOpen(false);
        }}
      />

      {/* 2. Manual Allergy Insertion Modal */}
      <ManualAllergyModal
        isOpen={isManualAllergyModalOpen}
        onClose={() => setIsManualAllergyModalOpen(false)}
        onSubmit={(substance) => {
          setManualAllergySubstance(substance);
        }}
      />

      {/* 3. CFM Guides Printing Modal */}
      <PrintGuidesModal
        isOpen={isPrintGuidesModalOpen}
        onClose={() => setIsPrintGuidesModalOpen(false)}
        patientName={currentPatient.name}
        recordNumber={currentPatient.recordNumber}
      />

      {/* 4. Digital Authenticity QR Code Modal */}
      <QrCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        patientName={currentPatient.name}
        documentHash="SHA256: d81a9f029e71b29a88c4019bfec93012984187ac9981274012bc091297710bc"
      />

      {/* 5. Patient Audio Call Modal */}
      <PatientCallModal
        isOpen={!!callingPatient}
        onClose={() => setCallingPatient(null)}
        patient={callingPatient}
        onStartConsultation={(p) => {
          handleSelectPatient(p, 'consentimento');
        }}
      />
    </div>
  );
}
