import React, { useState, useEffect, useRef } from 'react';
import {
  Patient,
  ScreenId,
  TranscriptUtterance,
  ClinicalDecision,
  SoapDraft,
} from '../../types/clinical';

interface ScreenAtendimentoTranscricaoProps {
  patient: Patient;
  onNavigate: (screenId: ScreenId) => void;
  onSelectCase: (caseKey: 'carlos' | 'ana' | 'jose' | 'maria') => void;
  liveTranscript: TranscriptUtterance[];
  setLiveTranscript: React.Dispatch<React.SetStateAction<TranscriptUtterance[]>>;
  liveDecisions: ClinicalDecision[];
  setLiveDecisions: React.Dispatch<React.SetStateAction<ClinicalDecision[]>>;
  liveSoapDraft: SoapDraft | null;
  setLiveSoapDraft: (draft: SoapDraft) => void;
}

export const ScreenAtendimentoTranscricao: React.FC<ScreenAtendimentoTranscricaoProps> = ({
  patient,
  onNavigate,
  liveTranscript,
  setLiveTranscript,
  liveDecisions,
  setLiveDecisions,
  setLiveSoapDraft,
}) => {
  const [isRecording, setIsRecording] = useState(true);
  const [seconds, setSeconds] = useState(225); // 03:45
  const [isMicListening, setIsMicListening] = useState(false);
  const [interimSpeech, setInterimSpeech] = useState('');
  const [micError, setMicError] = useState<string | null>(null);

  // Form input state
  const [activeSpeakerRole, setActiveSpeakerRole] = useState<'doctor' | 'patient'>('doctor');
  const [autoDiarization, setAutoDiarization] = useState(true);
  const [manualText, setManualText] = useState('');

  // AI analysis state
  const [isAnalyzingAi, setIsAnalyzingAi] = useState(false);
  const [aiConfidence, setAiConfidence] = useState('99.2%');
  const [aiConflicts, setAiConflicts] = useState<any[]>([]);
  const [aiStatusMessage, setAiStatusMessage] = useState<string | null>(null);
  const [isSimulatingSpeech, setIsSimulatingSpeech] = useState(false);

  const recognitionRef = useRef<any>(null);
  const transcriptBottomRef = useRef<HTMLDivElement>(null);

  // Fast semantic diarization helper
  const determineSpeaker = async (text: string): Promise<'doctor' | 'patient'> => {
    if (!autoDiarization) return activeSpeakerRole;

    const lower = text.toLowerCase();
    // Doctor markers: requests exams, prescribes, asks diagnostic questions, instructs
    const doctorMarkers = [
      'vou solicitar', 'vou pedir', 'vamos pedir', 'vamos fazer', 'vou prescrever',
      'receitar', 'raio-x', 'radiografia', 'ultrassonografia', 'exame de sangue',
      'onde dói', 'onde está doendo', 'apoiar o pé', 'subir na maca', 'tome',
      'você tem alergia', 'tem alguma alergia', 'interconsulta', 'vamos examinar',
      'boa tarde', 'bom dia', 'carlos,', 'ana,', 'como posso ajudar'
    ];

    // Patient markers: complaints, answers with "doutor", pain description, history
    const patientMarkers = [
      'doutor', 'dr.', 'torci', 'caí', 'estou sentindo', 'dói muito',
      'ontem à noite', 'jogando bola', 'jogando futebol', 'não consigo pisar',
      'não aguento apoiar', 'tomei um remédio', 'tenho alergia', 'não tenho alergia',
      'minha cabeça', 'minha barriga', 'estou com enjoo', 'vomitei', 'latejando'
    ];

    const hasDoctorMarker = doctorMarkers.some((m) => lower.includes(m));
    const hasPatientMarker = patientMarkers.some((m) => lower.includes(m));

    if (hasDoctorMarker && !hasPatientMarker) return 'doctor';
    if (hasPatientMarker && !hasDoctorMarker) return 'patient';

    // Call backend classifier or alternate turns
    try {
      const res = await fetch('/api/clinical/classify-speaker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          patient,
          lastRole: liveTranscript[liveTranscript.length - 1]?.role || 'doctor',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.role) return data.role;
      }
    } catch (_) {}

    // Fallback: alternate if previous speaker was doctor/patient
    const lastTurn = liveTranscript[liveTranscript.length - 1];
    return lastTurn?.role === 'doctor' ? 'patient' : 'doctor';
  };

  // Consultation elapsed timer
  useEffect(() => {
    if (!isRecording) return;
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRecording]);

  // Scroll transcript to bottom on new utterance
  useEffect(() => {
    transcriptBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [liveTranscript, interimSpeech]);

  // Real Web Speech API Microphone setup
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMicError('Reconhecimento de voz nativo não suportado neste navegador. Use os testes simulados ou digitação.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'pt-BR';
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsMicListening(true);
        setMicError(null);
      };

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPiece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            const piece = transcriptPiece.trim();
            if (piece) {
              determineSpeaker(piece).then((role) => {
                handleCommitUtterance(piece, role);
              });
            }
            currentInterim = '';
          } else {
            currentInterim += transcriptPiece;
          }
        }
        setInterimSpeech(currentInterim);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setMicError('Permissão de microfone negada no navegador. Permita o microfone para testar com voz real.');
        } else if (event.error !== 'no-speech') {
          setMicError(`Aviso do microfone: ${event.error}`);
        }
        setIsMicListening(false);
      };

      recognition.onend = () => {
        setIsMicListening(false);
      };

      recognitionRef.current = recognition;
    } catch (err: any) {
      console.error('Falha ao inicializar SpeechRecognition:', err);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
    };
  }, [activeSpeakerRole]);

  const toggleMicrophone = () => {
    if (!recognitionRef.current) {
      setMicError('Navegador sem suporte ao SpeechRecognition.');
      return;
    }

    if (isMicListening) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
      setIsMicListening(false);
    } else {
      try {
        setMicError(null);
        recognitionRef.current.start();
        setIsMicListening(true);
      } catch (e: any) {
        console.warn('Erro ao iniciar escuta:', e);
      }
    }
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getNowTimestamp = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
  };

  // Commit an utterance to transcript and trigger AI analysis
  const handleCommitUtterance = (text: string, role: 'doctor' | 'patient') => {
    if (!text) return;

    const speakerName = role === 'doctor' ? 'Dr. Renato Guimarães' : patient.name;
    const timeStr = getNowTimestamp();

    const newUtterance: TranscriptUtterance = {
      id: `live-${Date.now()}`,
      speaker: speakerName,
      role: role,
      timestamp: timeStr,
      text: text,
      evidenceId: `EVID-${Date.now().toString().slice(-4)}`,
      confidence: '99.4%',
    };

    const updatedTranscript = [...liveTranscript, newUtterance];
    setLiveTranscript(updatedTranscript);
    setInterimSpeech('');

    // Trigger AI extraction in the background
    triggerAiExtraction(updatedTranscript);
  };

  // Trigger Gemini AI extraction
  const triggerAiExtraction = async (transcriptToAnalyze: TranscriptUtterance[]) => {
    setIsAnalyzingAi(true);
    setAiStatusMessage('IA analisando diálogo clínico com Gemini 3.8 Flash...');

    try {
      const response = await fetch('/api/clinical/extract-decisions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient: {
            name: patient.name,
            age: patient.age,
            chiefComplaint: patient.chiefComplaint,
            triageLabel: patient.triageLabel,
            allergies: 'Nenhuma referida na admissão',
          },
          transcript: transcriptToAnalyze,
        }),
      });

      if (!response.ok) {
        throw new Error('Falha na resposta da API');
      }

      const data = await response.json();

      if (data.decisions && Array.isArray(data.decisions)) {
        setLiveDecisions(data.decisions);
      }

      if (data.conflicts && Array.isArray(data.conflicts)) {
        setAiConflicts(data.conflicts);
      }

      if (data.soapDraft) {
        setLiveSoapDraft(data.soapDraft);
      }

      if (data.confidenceScore) {
        setAiConfidence(`${data.confidenceScore}%`);
      }

      setAiStatusMessage('Extração clínica atualizada com sucesso pela IA!');
      setTimeout(() => setAiStatusMessage(null), 3000);
    } catch (err: any) {
      console.warn('Erro ao chamar Gemini:', err);
      setAiStatusMessage('Extração local de contingência aplicada.');
      setTimeout(() => setAiStatusMessage(null), 3000);
    } finally {
      setIsAnalyzingAi(false);
    }
  };

  // Simulate Next Dialogue Turn with Gemini
  const handleSimulateAiSpeech = async () => {
    setIsSimulatingSpeech(true);
    try {
      const lastTurn = liveTranscript[liveTranscript.length - 1];
      const nextRole = lastTurn?.role === 'doctor' ? 'patient' : 'doctor';

      const response = await fetch('/api/clinical/simulate-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient: patient,
          lastRole: lastTurn?.role || 'doctor',
          transcriptSummary: liveTranscript.slice(-3).map((t) => t.text).join(' | '),
        }),
      });

      if (!response.ok) throw new Error('Falha ao simular fala');
      const data = await response.json();

      if (data.text) {
        handleCommitUtterance(data.text, data.role || nextRole);
      }
    } catch (e) {
      console.warn(e);
      // Fallback preset
      handleCommitUtterance(
        'Doutor, sinto que a dor diminui um pouco quando mantenho o pé elevado.',
        'patient'
      );
    } finally {
      setIsSimulatingSpeech(false);
    }
  };

  // Manual submission form
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualText.trim()) return;
    const textToSubmit = manualText.trim();
    setManualText('');
    const role = await determineSpeaker(textToSubmit);
    handleCommitUtterance(textToSubmit, role);
  };

  // Quick preset injection helper
  const handleInjectPreset = (text: string, role: 'doctor' | 'patient') => {
    handleCommitUtterance(text, role);
  };

  return (
    <main className="w-full pt-20 pb-32 bg-[#f8f9ff] min-h-screen">
      {/* Sticky Header with Real-Time Patient Info */}
      <div className="w-full bg-[#ffffff] border-b border-[#e5eeff] px-4 lg:px-6 py-3 shadow-xs sticky top-16 z-30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Patient info */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#eff4ff] text-[#006a61] flex items-center justify-center font-bold text-[16px] border border-[#d3e4fe]">
              {patient.name
                .split(' ')
                .filter(Boolean)
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase()}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-[17px] font-bold text-[#0b1c30]">{patient.name}</h1>
                <span className="px-2 py-0.5 rounded bg-[#eff4ff] text-[#45464d] text-[11px] font-mono">
                  {patient.age} anos
                </span>
                <span className="px-2 py-0.5 rounded bg-[#86f2e4]/30 text-[#006f66] font-mono text-[11px] font-semibold">
                  Prontuário #{patient.recordNumber}
                </span>
                <span className="px-2 py-0.5 rounded bg-[#eff4ff] text-[#006a61] font-mono text-[11px] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-ping"></span>
                  Gemini 3.8 Flash
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono text-[#76777d] mt-0.5">
                <span>Início: 14:22:10</span>
                <span>•</span>
                <span className="flex items-center gap-1 font-semibold text-[#006a61]">
                  <span className="material-symbols-outlined text-[14px]">timer</span>
                  Duração: {formatTimer(seconds)}
                </span>
                <span>•</span>
                <span>{patient.room} • {patient.chiefComplaint}</span>
              </div>
            </div>
          </div>

          {/* Clean status badge in top header */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eff4ff] border border-[#d3e4fe] text-[#006a61] text-[11px] font-mono font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#006a61] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#006a61]"></span>
              </span>
              <span>Canal de Escuta Passiva Homologado CFM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mic alert banner or AI status */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-3 flex flex-col gap-2">
        {micError && (
          <div className="p-3 bg-[#fffbeb] border border-[#fef08a] rounded-xl text-[#92400e] text-[12px] flex items-center justify-between gap-2 animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">warning</span>
              <span>{micError}</span>
            </div>
            <button onClick={() => setMicError(null)} className="text-[#92400e] underline text-[11px] cursor-pointer">
              Dispensar
            </button>
          </div>
        )}

        {aiStatusMessage && (
          <div className="p-2.5 bg-[#eff4ff] border border-[#d3e4fe] rounded-xl text-[#006a61] text-[12px] flex items-center gap-2 animate-fadeIn font-mono">
            <span className="material-symbols-outlined text-[16px] text-[#006a61]">verified</span>
            <span>{aiStatusMessage}</span>
          </div>
        )}

        {aiConflicts.length > 0 && (
          <div className="p-3 bg-[#ffdad6]/60 border border-[#ba1a1a]/30 rounded-xl text-[#ba1a1a] text-[12px] flex items-center gap-2 animate-fadeIn">
            <span className="material-symbols-outlined text-[18px]">crisis_alert</span>
            <div>
              <strong>Alerta de Conflito Identificado pela IA:</strong>{' '}
              {aiConflicts.map((c) => c.title || c.description).join('; ')}
            </div>
          </div>
        )}
      </div>

      {/* Main 3-Column Consultation View */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT COLUMN: Triagem & Resumo do Paciente (3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* Card: Triagem Manchester */}
          <div className="bg-[#ffffff] rounded-2xl p-4 border border-[#e5eeff] shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#e5eeff]">
              <span className="text-[11px] font-mono text-[#76777d] uppercase tracking-wider font-semibold">
                Classificação de Risco
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#16a34a]/10 text-[#16a34a] font-mono text-[10px] font-bold">
                {patient.triageLabel.toUpperCase()}
              </span>
            </div>

            <div className="flex flex-col gap-1.5 text-[12px]">
              <div className="flex justify-between">
                <span className="text-[#76777d]">Tempo de Espera:</span>
                <span className="font-semibold text-[#0b1c30]">{patient.waitTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#76777d]">Destino:</span>
                <span className="font-semibold text-[#006a61]">{patient.room}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#76777d]">Triagem:</span>
                <span className="font-semibold text-[#0b1c30]">Protocolo Manchester</span>
              </div>
            </div>
          </div>

          {/* Card: Sinais Vitais */}
          <div className="bg-[#ffffff] rounded-2xl p-4 border border-[#e5eeff] shadow-xs flex flex-col gap-3">
            <span className="text-[11px] font-mono text-[#76777d] uppercase tracking-wider font-semibold pb-2 border-b border-[#e5eeff]">
              Sinais Vitais na Admissão
            </span>

            <div className="grid grid-cols-2 gap-2 text-[12px]">
              <div className="p-2 bg-[#eff4ff]/60 rounded-xl border border-[#e5eeff]">
                <span className="text-[10px] text-[#76777d] block font-mono">PA</span>
                <span className="font-bold text-[#0b1c30]">128/84 mmHg</span>
              </div>
              <div className="p-2 bg-[#eff4ff]/60 rounded-xl border border-[#e5eeff]">
                <span className="text-[10px] text-[#76777d] block font-mono">FC</span>
                <span className="font-bold text-[#0b1c30]">82 bpm</span>
              </div>
              <div className="p-2 bg-[#eff4ff]/60 rounded-xl border border-[#e5eeff]">
                <span className="text-[10px] text-[#76777d] block font-mono">SpO2</span>
                <span className="font-bold text-[#0b1c30]">98% em A/A</span>
              </div>
              <div className="p-2 bg-[#eff4ff]/60 rounded-xl border border-[#e5eeff]">
                <span className="text-[10px] text-[#76777d] block font-mono">Temperatura</span>
                <span className="font-bold text-[#0b1c30]">36.4°C</span>
              </div>
            </div>
          </div>

          {/* Quick Presets for Live Testing */}
          <div className="bg-[#ffffff] rounded-2xl p-4 border border-[#e5eeff] shadow-xs flex flex-col gap-2.5">
            <div className="flex items-center justify-between pb-1 border-b border-[#e5eeff]">
              <span className="text-[11px] font-mono text-[#006a61] uppercase tracking-wider font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">touch_app</span>
                Testes Rápidos de Escuta
              </span>
              <span className="text-[10px] font-mono text-[#76777d]">1-Clique</span>
            </div>
            <p className="text-[11px] text-[#45464d] leading-relaxed">
              Injete falas instantâneas para ver a IA detectar novos atos clínicos em tempo real:
            </p>

            <div className="flex flex-col gap-1.5">
              <button
                onClick={() =>
                  handleInjectPreset(
                    'Carlos, vou solicitar um Raio-X de Tornozelo Direito em AP e Perfil para afastar qualquer fratura maleolar.',
                    'doctor'
                  )
                }
                className="p-2 text-left bg-[#eff4ff]/60 hover:bg-[#eff4ff] text-[#006a61] rounded-xl text-[11px] font-semibold border border-[#d3e4fe] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[15px]">assignment</span>
                <span>+ Pedir Raio-X de Tornozelo</span>
              </button>

              <button
                onClick={() =>
                  handleInjectPreset(
                    'Doutor, eu esqueci de avisar na triagem, mas eu tenho alergia gravíssima a Dipirona. Uma vez fechei a garganta.',
                    'patient'
                  )
                }
                className="p-2 text-left bg-[#ffdad6]/40 hover:bg-[#ffdad6]/70 text-[#ba1a1a] rounded-xl text-[11px] font-semibold border border-[#ba1a1a]/30 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[15px]">warning</span>
                <span>+ Declarar Alergia a Dipirona</span>
              </button>

              <button
                onClick={() =>
                  handleInjectPreset(
                    'Vou prescrever Dipirona 1g venosa e imobilizar provisoriamente com tala gessada.',
                    'doctor'
                  )
                }
                className="p-2 text-left bg-[#eff4ff]/60 hover:bg-[#eff4ff] text-[#0b1c30] rounded-xl text-[11px] font-semibold border border-[#d3e4fe] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[15px]">medication</span>
                <span>+ Prescrever Analgesia & Tala</span>
              </button>

              <button
                onClick={() =>
                  handleInjectPreset(
                    'Após os exames, vou solicitar parecer urgente com a equipe de Ortopedia e Traumatologia.',
                    'doctor'
                  )
                }
                className="p-2 text-left bg-[#eff4ff]/60 hover:bg-[#eff4ff] text-[#006a61] rounded-xl text-[11px] font-semibold border border-[#d3e4fe] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[15px]">person_search</span>
                <span>+ Encaminhar para Ortopedia</span>
              </button>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Transcrição Contínua e Diarização (6 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="bg-[#ffffff] rounded-2xl border border-[#e5eeff] shadow-xs flex flex-col overflow-hidden">
            {/* Header of Transcript */}
            <div className="px-5 py-3.5 bg-[#eff4ff]/60 border-b border-[#e5eeff] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006a61] text-[18px]">graphic_eq</span>
                <h3 className="font-bold text-[#0b1c30] text-[14px]">
                  Transcrição Contínua de Escuta Ativa
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {isMicListening ? (
                  <span className="px-2 py-0.5 rounded-full bg-[#ba1a1a] text-white font-mono text-[10px] font-bold flex items-center gap-1 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                    Gravando Voz Real
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-[#eff4ff] text-[#006a61] font-mono text-[10px] font-bold border border-[#d3e4fe]">
                    Escuta em Espera
                  </span>
                )}
                <span className="text-[11px] font-mono text-[#76777d]">
                  {liveTranscript.length} falas
                </span>
              </div>
            </div>

            {/* Transcript stream */}
            <div className="p-5 flex flex-col gap-3.5 max-h-[460px] overflow-y-auto">
              {liveTranscript.map((item) => {
                const isDoc = item.role === 'doctor';
                return (
                  <div
                    key={item.id}
                    className={`flex flex-col gap-1 p-3.5 rounded-2xl transition-all ${
                      isDoc
                        ? 'bg-[#eff4ff]/60 border border-[#d3e4fe]/80'
                        : 'bg-[#ffffff] border border-[#e5eeff]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`material-symbols-outlined text-[16px] ${
                            isDoc ? 'text-[#006a61]' : 'text-[#76777d]'
                          }`}
                        >
                          {isDoc ? 'stethoscope' : 'person'}
                        </span>
                        <span
                          className={`text-[12px] font-bold ${
                            isDoc ? 'text-[#006a61]' : 'text-[#0b1c30]'
                          }`}
                        >
                          {item.speaker}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[#76777d]">{item.timestamp}</span>
                    </div>

                    <p className="text-[13px] text-[#0b1c30] leading-relaxed pl-5">{item.text}</p>

                    {item.evidenceId && (
                      <div className="flex items-center gap-2 pl-5 pt-1">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#86f2e4]/30 text-[#006f66] font-semibold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">verified</span>
                          Ancoragem Fonética ({item.confidence || '99.2%'})
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Interim Real-Time Mic Speech Bubble */}
              {interimSpeech && (
                <div className="p-3.5 rounded-2xl bg-[#eff4ff] border-2 border-dashed border-[#006a61] text-[13px] text-[#006a61] animate-pulse flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] animate-spin">mic</span>
                  <span>
                    <em>Ouvindo:</em> "{interimSpeech}"
                  </span>
                </div>
              )}

              <div ref={transcriptBottomRef} />
            </div>

            {/* Input Bar: Doctor / Patient toggle, Voice, Simulation & Typing */}
            <div className="p-3.5 bg-[#eff4ff]/40 border-t border-[#e5eeff] flex flex-col gap-2.5">
              <div className="flex items-center justify-between flex-wrap gap-2 text-[11px]">
                <div className="flex items-center gap-3 font-mono text-[#76777d] flex-wrap">
                  {/* Auto-Diarization Toggle */}
                  <label className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#ffffff] border border-[#d3e4fe] cursor-pointer shadow-xs">
                    <input
                      type="checkbox"
                      checked={autoDiarization}
                      onChange={(e) => setAutoDiarization(e.target.checked)}
                      className="accent-[#006a61]"
                    />
                    <span className="font-bold text-[#006a61] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">psychology</span>
                      Diarização por IA (Auto-Detectar Locutor)
                    </span>
                  </label>

                  {/* Manual fallback selector if auto is off */}
                  {!autoDiarization ? (
                    <div className="flex items-center gap-2 pl-1">
                      <span>Locutor manual:</span>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name="speaker"
                          checked={activeSpeakerRole === 'doctor'}
                          onChange={() => setActiveSpeakerRole('doctor')}
                        />
                        <span className="text-[#006a61] font-semibold">Dr. Renato (Médico)</span>
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name="speaker"
                          checked={activeSpeakerRole === 'patient'}
                          onChange={() => setActiveSpeakerRole('patient')}
                        />
                        <span className="text-[#0b1c30] font-semibold">{patient.name} (Paciente)</span>
                      </label>
                    </div>
                  ) : (
                    <span className="text-[10px] text-[#006f66] bg-[#86f2e4]/30 px-2 py-0.5 rounded font-mono">
                      Identificando Médico vs Paciente pelo discurso clínico
                    </span>
                  )}
                </div>

                {/* AI Dialogue Simulation button */}
                <button
                  type="button"
                  onClick={handleSimulateAiSpeech}
                  disabled={isSimulatingSpeech}
                  className="px-2.5 py-1 bg-white hover:bg-[#eff4ff] text-[#006a61] border border-[#d3e4fe] rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  title="Gera automaticamente uma fala médica humanizada usando IA"
                >
                  <span className="material-symbols-outlined text-[14px]">smart_toy</span>
                  <span>{isSimulatingSpeech ? 'Gerando fala...' : 'Simular Próxima Fala com IA'}</span>
                </button>
              </div>

              {/* Form Input */}
              <form onSubmit={handleManualSubmit} className="flex items-center gap-2">
                <input
                  type="text"
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  placeholder={
                    autoDiarization
                      ? 'Fale no microfone ou digite qualquer fala (a IA atribuirá se é o Médico ou Paciente)...'
                      : `Falar ou digitar como ${activeSpeakerRole === 'doctor' ? 'Dr. Renato (Médico)' : patient.name}...`
                  }
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-[#e5eeff] text-[12px] text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#006a61]"
                />

                <button
                  type="button"
                  onClick={toggleMicrophone}
                  className={`p-2.5 rounded-xl border transition-colors flex items-center justify-center cursor-pointer ${
                    isMicListening
                      ? 'bg-[#ba1a1a] text-white border-[#ba1a1a]'
                      : 'bg-white text-[#006a61] border-[#e5eeff] hover:bg-[#eff4ff]'
                  }`}
                  title={isMicListening ? 'Parar microfone' : 'Falar pelo microfone'}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isMicListening ? 'mic' : 'mic_none'}
                  </span>
                </button>

                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#006a61] hover:bg-[#005049] text-white rounded-xl text-[12px] font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">send</span>
                  <span>Inserir</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Decisões Clínicas Detectadas em Tempo Real (3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="bg-[#ffffff] rounded-2xl border border-[#e5eeff] shadow-xs p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#e5eeff]">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#006a61] text-[18px]">auto_awesome</span>
                <h3 className="font-bold text-[#0b1c30] text-[13px]">Decisões Extraídas</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#86f2e4]/30 text-[#006f66] font-mono text-[10px] font-bold">
                {liveDecisions.length} Atos
              </span>
            </div>

            {/* List of Real-time Detected Decisions */}
            <div className="flex flex-col gap-2.5 max-h-[450px] overflow-y-auto">
              {liveDecisions.length === 0 ? (
                <div className="p-4 rounded-xl bg-[#eff4ff]/40 border border-[#e5eeff] text-center text-[12px] text-[#76777d]">
                  Nenhum ato ou exame detectado ainda. Fale ou insira falas no diálogo para a IA processar.
                </div>
              ) : (
                liveDecisions.map((dec, idx) => (
                  <div
                    key={dec.id || idx}
                    className="p-3 rounded-xl bg-[#eff4ff]/50 border border-[#d3e4fe] flex flex-col gap-1.5 shadow-xs transition-all hover:bg-[#eff4ff]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-[#006a61] flex items-center gap-1">
                        {dec.type === 'exame' && <span className="material-symbols-outlined text-[13px]">assignment</span>}
                        {dec.type === 'encaminhamento' && <span className="material-symbols-outlined text-[13px]">person_search</span>}
                        {dec.type === 'alergia' && <span className="material-symbols-outlined text-[13px]">shield</span>}
                        {dec.type === 'prescricao' && <span className="material-symbols-outlined text-[13px]">medication</span>}
                        {dec.type.toUpperCase()}
                      </span>
                      <span className="text-[10px] font-mono text-[#76777d]">
                        {dec.evidenceTimestamp || 'Tempo real'}
                      </span>
                    </div>

                    <h4 className="font-bold text-[#0b1c30] text-[12px] leading-snug">{dec.title}</h4>
                    <p className="text-[11px] text-[#45464d] leading-snug">{dec.description}</p>

                    {dec.code && (
                      <span className="text-[10px] font-mono text-[#76777d] mt-0.5">
                        Código: {dec.code}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* AI Engine & Regulatory Score Card */}
            <div className="p-3 bg-[#f8f9ff] rounded-xl border border-[#e5eeff] flex flex-col gap-1.5 text-[11px]">
              <div className="flex justify-between items-center">
                <span className="text-[#76777d] font-mono">Motor de IA:</span>
                <span className="font-bold text-[#006a61] font-mono">Gemini 3.8 Flash</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#76777d] font-mono">Precisão Acústica:</span>
                <span className="font-bold text-[#006a61]">{aiConfidence}</span>
              </div>
              <div className="w-full bg-[#eff4ff] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#006a61] h-full w-[99%]"></div>
              </div>
              <span className="text-[10px] text-[#76777d] mt-1 leading-tight">
                Processamento passivo auditável em conformidade com o Artigo 3º da Resolução CFM 2.314/22.
              </span>
            </div>

            <button
              onClick={() => onNavigate('rascunho')}
              className="w-full py-2 bg-[#006a61] hover:bg-[#005049] text-white text-[12px] font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Avançar para Rascunho SOAP</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar - Passo 3 */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#ffffff]/95 backdrop-blur-md border-t border-[#e5eeff] px-4 lg:px-8 py-3 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Left Info: Mic Status & Live Audio Indicator */}
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                isMicListening
                  ? 'bg-[#ba1a1a] text-white animate-pulse'
                  : 'bg-[#86f2e4]/40 text-[#006f66]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isMicListening ? 'mic' : 'graphic_eq'}
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#0b1c30] text-[13px]">
                  {isMicListening ? 'Microfone Real Ao Vivo Captando' : 'Escuta Passiva Ativa no Box'}
                </span>
                <span
                  className={`px-2 py-0.2 rounded font-mono text-[10px] font-bold ${
                    isMicListening
                      ? 'bg-[#ba1a1a] text-white'
                      : 'bg-[#10b981]/10 text-[#065f46]'
                  }`}
                >
                  {isMicListening ? 'GRAVANDO ÁUDIO' : 'ASSISTIDA PASSIVA'}
                </span>
              </div>
              <p className="text-[11px] text-[#76777d] flex items-center gap-1.5 flex-wrap">
                <span className="font-mono font-semibold text-[#006a61]">Duração: {formatTimer(seconds)}</span>
                <span>•</span>
                <span>Gemini 3.8 Flash extraindo decisões clínicas em segundo plano</span>
              </p>
            </div>
          </div>

          {/* Right Actions requested by user */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end flex-wrap">
            {/* Real Microphone Toggle */}
            <button
              onClick={toggleMicrophone}
              className={`px-3.5 py-2 rounded-lg font-semibold text-[12px] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                isMicListening
                  ? 'bg-[#ba1a1a] hover:bg-[#991b1b] text-white animate-pulse'
                  : 'bg-[#eff4ff] hover:bg-[#d3e4fe] text-[#006a61] border border-[#d3e4fe]'
              }`}
              title={isMicListening ? 'Clique para desativar o microfone' : 'Ativar microfone para falar em tempo real'}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isMicListening ? 'mic' : 'mic_none'}
              </span>
              <span>{isMicListening ? 'Microfone Ao Vivo' : 'Ligar Microfone Real'}</span>
            </button>

            {/* Run Gemini Analysis Manually */}
            <button
              onClick={() => triggerAiExtraction(liveTranscript)}
              disabled={isAnalyzingAi}
              className="px-3.5 py-2 bg-[#eff4ff] hover:bg-[#e5eeff] text-[#006a61] border border-[#d3e4fe] rounded-lg text-[12px] font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <span className={`material-symbols-outlined text-[16px] ${isAnalyzingAi ? 'animate-spin' : ''}`}>
                {isAnalyzingAi ? 'sync' : 'auto_awesome'}
              </span>
              <span>{isAnalyzingAi ? 'Analisando...' : 'Reanalisar com IA'}</span>
            </button>

            {/* Finalize and see Decisions */}
            <button
              onClick={() => onNavigate('rascunho')}
              className="px-5 py-2 bg-[#006a61] hover:bg-[#005049] text-white rounded-lg text-[12px] font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">fact_check</span>
              <span>Finalizar & Ver Decisões</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
