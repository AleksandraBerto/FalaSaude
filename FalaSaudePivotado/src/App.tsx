import { useState, useEffect, useRef } from 'react';
import {
  ScreenId,
  Patient,
  TranscriptUtterance,
  ClinicalDecision,
  SoapDraft,
  DoctorUser,
  MOCK_DOCTORS,
  AppNotification,
} from './types/clinical';
import {
  TRANSCRIPT_CARLOS,
  TRANSCRIPT_ANA,
  CARLOS_DECISIONS,
  ANA_DECISIONS,
} from './data/mockClinicalData';
import { getDoctorCases, EMERGENCY_CASES_BANK, ComprehensiveCase } from './data/emergencyBank50';
import { Header } from './components/Header';
import { ScreenLogin } from './components/screens/ScreenLogin';
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

// Timed arrival intervals: 3 fast cases (5s each), followed by 5 cases (60s / 1 min each)
const ARRIVAL_DELAYS = [5, 5, 5, 60, 60, 60, 60, 60];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<DoctorUser>(MOCK_DOCTORS[0]);

  // Doctor cases & live emergency queue state
  const [patients, setPatients] = useState<Patient[]>(() => {
    const initialPool = getDoctorCases(MOCK_DOCTORS[0].id);
    return initialPool.slice(0, 4);
  });
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('fila-do-plantao');
  const [selectedCase, setSelectedCase] = useState<'carlos' | 'ana' | 'jose' | 'maria'>('carlos');
  const [currentPatient, setCurrentPatient] = useState<Patient>(() => {
    const initialPool = getDoctorCases(MOCK_DOCTORS[0].id);
    return initialPool[0] || EMERGENCY_CASES_BANK[0];
  });

  // Live active listening & AI extraction state
  const [liveTranscript, setLiveTranscript] = useState<TranscriptUtterance[]>(TRANSCRIPT_CARLOS);
  const [liveDecisions, setLiveDecisions] = useState<ClinicalDecision[]>(CARLOS_DECISIONS);
  const [liveSoapDraft, setLiveSoapDraft] = useState<SoapDraft | null>(null);

  // Incoming queue simulation state
  const [nextArrivalCountdown, setNextArrivalCountdown] = useState<number | null>(null);
  
  // Hospital and shift notifications
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-cfm-1',
      title: 'Salvaguarda CFM 2.314/2022 Ativa',
      description: 'Protocolo de IA passiva estrita em operação. Prontuário sob validação médica.',
      timestamp: '14:00',
      type: 'cfm',
      read: true,
    },
    {
      id: 'notif-sys-init',
      title: 'Plantão Inicializado com Sucesso',
      description: 'Fila de emergência conectada aos guichês de recepção e triagem Manchester.',
      timestamp: '14:02',
      type: 'system',
      read: true,
    },
  ]);

  const pendingArrivalsRef = useRef<ComprehensiveCase[]>([]);
  const arrivalIndexRef = useRef<number>(0);
  const countdownIntervalRef = useRef<any>(null);

  // Modals state
  const [isStitchGalleryOpen, setIsStitchGalleryOpen] = useState(false);
  const [isManualAllergyModalOpen, setIsManualAllergyModalOpen] = useState(false);
  const [isPrintGuidesModalOpen, setIsPrintGuidesModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [callingPatient, setCallingPatient] = useState<Patient | null>(null);
  const [manualAllergySubstance, setManualAllergySubstance] = useState<string | null>(null);

  // Web Audio API hospital bell chime
  const playHospitalChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc2.frequency.setValueAtTime(880.0, ctx.currentTime); // A5

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 1.2);
      osc2.stop(ctx.currentTime + 1.2);
    } catch (_) {}
  };

  // Trigger one incoming case arrival from pending queue
  const triggerPatientArrival = () => {
    if (pendingArrivalsRef.current.length === 0) {
      setNextArrivalCountdown(null);
      return;
    }

    const nextPatient = pendingArrivalsRef.current.shift();
    if (!nextPatient) return;

    // Prepend new arrival at top of queue
    setPatients((prev) => [nextPatient, ...prev]);

    // Audio chime & bell notification
    playHospitalChime();

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}-${nextPatient.id}`,
      title: `🚨 Novo Paciente: ${nextPatient.name}`,
      description: `${nextPatient.triageLabel} • ${nextPatient.chiefComplaint}`,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      type: 'arrival',
      read: false,
      patientId: nextPatient.id,
      triageLabel: nextPatient.triageLabel,
      triage: nextPatient.triage,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Advance to next interval in sequence
    arrivalIndexRef.current += 1;
    if (
      arrivalIndexRef.current < ARRIVAL_DELAYS.length &&
      pendingArrivalsRef.current.length > 0
    ) {
      setNextArrivalCountdown(ARRIVAL_DELAYS[arrivalIndexRef.current]);
    } else {
      setNextArrivalCountdown(null);
    }
  };

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleSelectPatientFromNotification = (patientId: string) => {
    const p = patients.find((x) => x.id === patientId);
    if (p) {
      handleSelectPatient(p, 'consentimento');
    }
  };

  // Immediate simulation manual trigger for instant review
  const handleSimulateArrivalNow = () => {
    triggerPatientArrival();
  };

  // Login handler: loads specific batch of 50 cases for this doctor and starts live simulation
  const handleLogin = (doctor: DoctorUser) => {
    setCurrentUser(doctor);
    setIsAuthenticated(true);
    setCurrentScreen('fila-do-plantao');

    // Partition from 50 cases bank for this specific doctor
    const doctorPool = getDoctorCases(doctor.id);
    const initialBatch = doctorPool.slice(0, 4);
    const queueToArrive = doctorPool.slice(4);

    setPatients(initialBatch);
    setCurrentPatient(initialBatch[0]);
    pendingArrivalsRef.current = [...queueToArrive];
    arrivalIndexRef.current = 0;

    // Start countdown for the first arrival (5 seconds)
    setNextArrivalCountdown(ARRIVAL_DELAYS[0]);
  };

  // Countdown timer effect
  useEffect(() => {
    if (!isAuthenticated || nextArrivalCountdown === null) return;

    countdownIntervalRef.current = setInterval(() => {
      setNextArrivalCountdown((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          triggerPatientArrival();
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [isAuthenticated, nextArrivalCountdown]);

  // Logout handler
  const handleLogout = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    setIsAuthenticated(false);
    setNextArrivalCountdown(null);
    setCurrentScreen('fila-do-plantao');
  };

  // Handle case selection
  const handleSelectCase = (caseKey: 'carlos' | 'ana' | 'jose' | 'maria') => {
    setSelectedCase(caseKey);
    const found = patients.find((p) => p.caseKey === caseKey);
    if (found) {
      setCurrentPatient(found);
    }

    if (caseKey === 'carlos') {
      setLiveTranscript(TRANSCRIPT_CARLOS);
      setLiveDecisions(CARLOS_DECISIONS);
      setLiveSoapDraft(null);
      setCurrentScreen('rascunho');
    } else if (caseKey === 'ana') {
      setLiveTranscript(TRANSCRIPT_ANA);
      setLiveDecisions(ANA_DECISIONS);
      setLiveSoapDraft(null);
      setCurrentScreen('rascunho');
    } else if (caseKey === 'jose') {
      setCurrentScreen('excecao');
    } else if (caseKey === 'maria') {
      setCurrentScreen('consentimento');
    }
  };

  // Handle patient select from Queue: starts at Step 2 (Consentimento)
  const handleSelectPatient = (patient: Patient, targetScreen?: ScreenId) => {
    setCurrentPatient(patient);
    if (['carlos', 'ana', 'jose', 'maria'].includes(patient.caseKey)) {
      setSelectedCase(patient.caseKey as any);
    }

    // Load rich case data if present in 50 cases bank
    const fullCase = EMERGENCY_CASES_BANK.find((c) => c.id === patient.id);
    if (fullCase && fullCase.transcript && fullCase.transcript.length > 0) {
      setLiveTranscript(fullCase.transcript);
      setLiveDecisions(fullCase.decisions || []);
      setLiveSoapDraft(fullCase.soapDraft || null);
    } else if (patient.caseKey === 'carlos') {
      setLiveTranscript(TRANSCRIPT_CARLOS);
      setLiveDecisions(CARLOS_DECISIONS);
      setLiveSoapDraft(null);
    } else if (patient.caseKey === 'ana') {
      setLiveTranscript(TRANSCRIPT_ANA);
      setLiveDecisions(ANA_DECISIONS);
      setLiveSoapDraft(null);
    } else {
      // Dynamic initial utterances for newly triaged patient
      const dynamicTranscript: TranscriptUtterance[] = [
        {
          id: `t-${patient.id}-1`,
          speaker: currentUser.name,
          role: 'doctor',
          timestamp: '14:22:10',
          text: `Olá, ${patient.name.split(' ')[0]}. Sou o ${currentUser.name}. O sistema de triagem registrou ${patient.chiefComplaint}. Me conte como isso começou.`,
        },
        {
          id: `t-${patient.id}-2`,
          speaker: patient.name,
          role: 'patient',
          timestamp: '14:22:25',
          text: `Boa tarde, doutor. Começou de repente e está incomodando bastante. Vim logo para a emergência para examinar.`,
        },
      ];
      setLiveTranscript(dynamicTranscript);
      setLiveDecisions([
        {
          id: `d-${patient.id}-1`,
          type: 'exame',
          title: `Avaliação Diagnóstica para ${patient.chiefComplaint.slice(0, 32)}...`,
          description: `Conduta de urgência conforme triagem ${patient.triageLabel}`,
          status: 'confirmado',
        },
      ]);
      setLiveSoapDraft({
        subjetivo: `Paciente admitido na emergência com queixa de ${patient.chiefComplaint}. Sintomas agudos relatados na triagem.`,
        objetivo: `Sinais vitais na admissão: ${patient.vitalsSummary}. Lúcido e orientado.`,
        avaliacao: `Quadro agudo sob investigação relacionado a ${patient.chiefComplaint}.`,
        plano: `Investigação diagnóstica e conduta sintomática em leito de observação.`,
      });
    }

    if (targetScreen) {
      setCurrentScreen(targetScreen);
    } else {
      // All post-triage cases start at Step 2: Consentimento
      setCurrentScreen('consentimento');
    }
  };

  // Handle call patient
  const handleCallPatient = (patient: Patient) => {
    setCallingPatient(patient);
  };

  if (!isAuthenticated) {
    return <ScreenLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col font-sans selection:bg-[#86f2e4] selection:text-[#005049]">
      {/* Universal Fixed Header */}
      <Header
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        onOpenStitchGallery={() => setIsStitchGalleryOpen(true)}
        selectedCase={selectedCase}
        onSelectCase={handleSelectCase}
        currentUser={currentUser}
        onLogout={handleLogout}
        notifications={notifications}
        onMarkNotificationAsRead={handleMarkNotificationAsRead}
        onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
        onSelectPatientFromNotification={handleSelectPatientFromNotification}
        waitingPatientsCount={patients.filter((p) => p.status === 'espera').length || patients.length}
      />

      {/* Screen Views */}
      <div className="flex-1 flex flex-col">
        {currentScreen === 'fila-do-plantao' && (
          <ScreenFilaPlantao
            patients={patients}
            onSelectPatient={handleSelectPatient}
            onCallPatient={handleCallPatient}
            onNavigate={setCurrentScreen}
            nextArrivalCountdown={nextArrivalCountdown}
            onSimulateArrivalNow={handleSimulateArrivalNow}
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
            liveTranscript={liveTranscript}
            setLiveTranscript={setLiveTranscript}
            liveDecisions={liveDecisions}
            setLiveDecisions={setLiveDecisions}
            liveSoapDraft={liveSoapDraft}
            setLiveSoapDraft={setLiveSoapDraft}
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
            liveSoapDraft={liveSoapDraft}
            liveDecisions={liveDecisions}
            liveTranscript={liveTranscript}
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
        onSubmit={(substance: string) => {
          setManualAllergySubstance(substance);
          setIsManualAllergyModalOpen(false);
        }}
      />

      {/* 3. Print Guides Modal */}
      <PrintGuidesModal
        isOpen={isPrintGuidesModalOpen}
        onClose={() => setIsPrintGuidesModalOpen(false)}
        patientName={currentPatient.name}
        recordNumber={currentPatient.recordNumber}
      />

      {/* 4. QR Code Auditor Mobile Modal */}
      <QrCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        patientName={currentPatient.name}
        documentHash="CFM-7712-AUD-BR"
      />

      {/* 5. Patient Calling Alert Modal */}
      <PatientCallModal
        isOpen={Boolean(callingPatient)}
        patient={callingPatient}
        onClose={() => setCallingPatient(null)}
        onStartConsultation={(p) => {
          setCallingPatient(null);
          handleSelectPatient(p, 'consentimento');
        }}
      />
    </div>
  );
}
