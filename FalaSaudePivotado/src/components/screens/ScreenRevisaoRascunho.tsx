import React, { useState } from 'react';
import { Patient, ScreenId, SoapDraft, ClinicalDecision, TranscriptUtterance } from '../../types/clinical';
import { TRANSCRIPT_ANA, TRANSCRIPT_CARLOS } from '../../data/mockClinicalData';

interface ScreenRevisaoRascunhoProps {
  currentPatient: Patient;
  onNavigate: (screenId: ScreenId) => void;
  onOpenManualAllergyModal: () => void;
  onOpenPrintGuidesModal: () => void;
  onSelectCase?: (caseKey: 'carlos' | 'ana' | 'jose' | 'maria') => void;
  manualAllergySubstance: string | null;
  liveSoapDraft?: SoapDraft | null;
  liveDecisions?: ClinicalDecision[];
  liveTranscript?: TranscriptUtterance[];
}

export const ScreenRevisaoRascunho: React.FC<ScreenRevisaoRascunhoProps> = ({
  currentPatient,
  onNavigate,
  onOpenManualAllergyModal,
  onOpenPrintGuidesModal,
  manualAllergySubstance,
  liveSoapDraft,
  liveDecisions,
  liveTranscript,
}) => {
  // Check if current patient has conflict or allergy alerts
  const isPatientConflict =
    currentPatient.status === 'revisao_pendente' ||
    currentPatient.caseKey === 'ana' ||
    (liveDecisions && liveDecisions.some((d) => d.type === 'alergia' || d.status === 'conflito'));

  // States for unresolved pendencies when conflicts exist
  const [estado1Status, setEstado1Status] = useState<'pendente' | 'aceito' | 'editado' | 'ignorado'>('aceito');
  const [estado2Resolved, setEstado2Resolved] = useState<boolean>(false);
  const [estado3Resolved, setEstado3Resolved] = useState<boolean>(false);
  const [estado3Option, setEstado3Option] = useState<'patient' | 'triagem' | null>(null);

  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playheadPos, setPlayheadPos] = useState('35%');
  const [playerTime, setPlayerTime] = useState('02:18 / 06:42');
  const [highlightedEvid, setHighlightedEvid] = useState<string | null>('evid-1');
  const [activeMeta, setActiveMeta] = useState({
    id: 'EVID-USG-0218',
    confidence: '99.1%',
    speaker: 'Dr. Renato Guimarães',
    severity: 'Exame Imagem',
  });

  // Effective state of pendencies
  const isAllergyResolved = estado2Resolved || !!manualAllergySubstance;
  const isConflictResolved = estado3Resolved;
  const pendenciasRestantes = isPatientConflict
    ? (isAllergyResolved ? 0 : 1) + (isConflictResolved ? 0 : 1)
    : 0;
  const isReadyToSign = !isPatientConflict || pendenciasRestantes === 0;

  const handleHighlightEvidence = (evid: 'evid-1' | 'evid-3') => {
    setHighlightedEvid(evid);
    if (evid === 'evid-1') {
      setPlayheadPos('35%');
      setPlayerTime('02:18 / 06:42');
      setActiveMeta({
        id: 'EVID-RX-0218',
        confidence: '99.1%',
        speaker: 'Dr. Renato Guimarães',
        severity: 'Exame Imagem',
      });
    } else {
      setPlayheadPos('62%');
      setPlayerTime('04:02 / 06:42');
      setActiveMeta({
        id: 'EVID-ALERTA-8841',
        confidence: '98.4%',
        speaker: `Paciente (${currentPatient.name})`,
        severity: 'Alta (Alergia)',
      });
    }
  };

  const handleQuickResolveAll = () => {
    setEstado1Status('aceito');
    setEstado2Resolved(true);
    setEstado3Resolved(true);
    setEstado3Option('patient');
  };

  const handleSign = () => {
    if (!isReadyToSign) return;
    alert(
      'Documento Clínico assinado digitalmente com Certificado ICP-Brasil (CRM/SP 148.920).\nRedirecionando para o laudo e auditoria final.'
    );
    onNavigate('auditoria');
  };

  const transcriptToShow =
    liveTranscript && liveTranscript.length > 0
      ? liveTranscript
      : currentPatient.caseKey === 'ana'
      ? TRANSCRIPT_ANA
      : TRANSCRIPT_CARLOS;

  const patientInitials = currentPatient.name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <main className="w-full pt-20 pb-24 bg-[#f8f9ff] min-h-screen">
      {/* Patient Top Bar (Clean, without case switcher) */}
      <div className="w-full bg-[#ffffff] border-b border-[#e5eeff] px-4 lg:px-6 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#eff4ff] text-[#006a61] flex items-center justify-center font-bold text-[16px] border border-[#d3e4fe]">
              {patientInitials}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-[17px] font-bold text-[#0b1c30]">
                  {currentPatient.name}
                </h1>
                <span className="px-2 py-0.5 rounded bg-[#eff4ff] text-[#45464d] text-[11px] font-mono">
                  {currentPatient.age} anos
                </span>
                <span className="px-2 py-0.5 rounded bg-[#86f2e4]/30 text-[#006f66] font-mono text-[11px] font-semibold">
                  Prontuário #{currentPatient.recordNumber}
                </span>
                <span className="px-2 py-0.5 rounded bg-[#e0f2fe] text-[#0369a1] font-mono text-[11px] font-semibold">
                  {currentPatient.triageLabel} (Triagem)
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#76777d] mt-0.5">
                {currentPatient.chiefComplaint} • {currentPatient.room} • Caso selecionado no Passo 1 (Fila)
              </span>
            </div>
          </div>

          {/* Action buttons (Clean: no case switcher) */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#f0fdf4] text-[#166534] border border-[#bbf7d0] rounded-lg text-[12px] font-medium">
              <span className="w-2 h-2 rounded-full bg-[#16a34a]"></span>
              Atendimento Vinculado à Triagem
            </span>

            <button
              onClick={onOpenPrintGuidesModal}
              className="px-3 py-1.5 bg-[#eff4ff] hover:bg-[#e5eeff] text-[#006a61] border border-[#d3e4fe] rounded-lg text-[12px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              Guias CFM
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left = Transcript & Audio, Right = Structured SOAP Note */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT COLUMN: Player de Áudio, Timeline e Transcrição Auditável (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Audio Player Card */}
          <div className="bg-[#ffffff] rounded-2xl p-4 border border-[#e5eeff] shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#76777d] font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-[#006a61]">play_circle</span>
                Player de Áudio Auditável (CFM)
              </span>
              <span className="text-[11px] font-mono text-[#006a61] font-bold">
                {playerTime}
              </span>
            </div>

            {/* Scrubber Waveform Bar */}
            <div className="relative w-full h-8 bg-[#eff4ff] rounded-lg overflow-hidden flex items-center px-2 cursor-pointer border border-[#d3e4fe]">
              {/* Audio waveform ticks */}
              <div className="w-full flex items-center justify-between gap-[2px] opacity-70">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-[#006a61] rounded-full"
                    style={{
                      height: `${10 + ((i * 7) % 20)}px`,
                      opacity: i < 20 ? 0.9 : 0.4,
                    }}
                  ></div>
                ))}
              </div>

              {/* Playhead marker */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-[#ea580c] shadow-md transition-all duration-300"
                style={{ left: playheadPos }}
              ></div>
            </div>

            {/* Audio Controls & Clickable Evidence Pins */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-8 h-8 rounded-full bg-[#006a61] hover:bg-[#005049] text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isPlaying ? 'pause' : 'play_arrow'}
                  </span>
                </button>
                <span className="text-[11px] font-mono text-[#76777d]">
                  {isPlaying ? 'Reproduzindo...' : 'Pausado'}
                </span>
              </div>

              {/* Evidence jump chips */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-[#76777d]">Ir para evidência:</span>
                <button
                  onClick={() => handleHighlightEvidence('evid-1')}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    highlightedEvid === 'evid-1'
                      ? 'bg-[#006a61] text-white'
                      : 'bg-[#eff4ff] text-[#006a61] hover:bg-[#e5eeff]'
                  }`}
                  title="Pular para pedido de Exame de Ultrassom"
                >
                  [02:18] USG
                </button>
                <button
                  onClick={() => handleHighlightEvidence('evid-3')}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    highlightedEvid === 'evid-3'
                      ? 'bg-[#ea580c] text-white'
                      : 'bg-[#ffdad6] text-[#ba1a1a] hover:bg-[#fde68a]'
                  }`}
                  title="Pular para confissão de alergia grave"
                >
                  [04:02] Alergia
                </button>
              </div>
            </div>

            {/* Active Evidence Metadata Card */}
            <div className="p-3 bg-[#eff4ff]/60 rounded-xl border border-[#d3e4fe] flex flex-col gap-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-[#76777d] font-mono">ID de Rastreabilidade:</span>
                <span className="font-bold font-mono text-[#006a61]">{activeMeta.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#76777d] font-mono">Confiança Fonética:</span>
                <span className="font-bold text-[#006a61]">{activeMeta.confidence}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#76777d] font-mono">Locutor Identificado:</span>
                <span className="font-semibold text-[#0b1c30]">{activeMeta.speaker}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#76777d] font-mono">Severidade / Tag:</span>
                <span className="font-bold text-[#ea580c]">{activeMeta.severity}</span>
              </div>
            </div>
          </div>

          {/* Transcript Snippets View */}
          <div className="bg-[#ffffff] rounded-2xl p-4 border border-[#e5eeff] shadow-xs flex flex-col gap-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#76777d] font-semibold pb-1 border-b border-[#e5eeff]">
              Transcrição de Suporte Auditável
            </span>

            <div className="flex flex-col gap-2.5 max-h-[400px] overflow-y-auto pr-1">
              {transcriptToShow.map((item) => {
                const isSelected = item.evidenceId === highlightedEvid;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (item.evidenceId === 'evid-1' || item.evidenceId === 'evid-3') {
                        handleHighlightEvidence(item.evidenceId as any);
                      }
                    }}
                    className={`p-3 rounded-xl border text-[12px] transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#eff4ff] border-[#006a61] ring-2 ring-[#86f2e4]'
                        : 'bg-[#ffffff] border-[#e5eeff] hover:bg-[#f8f9ff]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-bold text-[#006a61]">{item.speaker}</span>
                      <span className="font-mono text-[#76777d]">{item.timestamp}</span>
                    </div>
                    <p className="text-[#0b1c30] leading-snug">{item.text}</p>
                    {item.evidenceId && (
                      <span className="inline-block mt-1 text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#86f2e4]/30 text-[#006f66] font-semibold">
                        Tag: {item.evidenceId}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Rascunho Clínico Estruturado SOAP & Resolução de Bloqueios (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Active Pendencies Resolution Banner (Shown only if patient has conflicts or unresolved allergies) */}
          {isPatientConflict && (
            <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#e5eeff] shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#e5eeff]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#ea580c] text-[20px]">security_update_warning</span>
                  <h3 className="font-bold text-[#0b1c30] text-[14px]">
                    Painel de Salvaguardas & Pendências Clínicas
                  </h3>
                </div>
                <button
                  onClick={handleQuickResolveAll}
                  className="px-3 py-1 bg-[#eff4ff] hover:bg-[#e5eeff] text-[#006a61] font-semibold text-[11px] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">auto_fix_high</span>
                  Resolver Pendências (Demo)
                </button>
              </div>

              {/* Pendência 1: Exame USG */}
              <div className="p-3.5 rounded-xl bg-[#eff4ff]/40 border border-[#d3e4fe] flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#006a61] font-bold uppercase flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">assignment</span>
                    Exame Detectado: Ultrassonografia de Abdome Total
                  </span>
                  <span className="text-[10px] font-mono text-[#76777d]">TUSS: 4.09.01.23-8</span>
                </div>
                <p className="text-[12px] text-[#45464d]">
                  Detectado na fala às 15:31:40 ("vamos solicitar uma Ultrassonografia de Abdome Total...").
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => setEstado1Status('aceito')}
                    className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                      estado1Status === 'aceito'
                        ? 'bg-[#006a61] text-white'
                        : 'bg-[#eff4ff] text-[#006a61] hover:bg-[#e5eeff]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[13px]">done</span>
                    {estado1Status === 'aceito' ? 'Confirmado no Prontuário' : 'Aceitar'}
                  </button>
                  <button
                    onClick={() => {
                      const novo = prompt('Editar exame solicitado:', 'Ultrassonografia com Doppler');
                      if (novo) setEstado1Status('editado');
                    }}
                    className="px-2.5 py-1 text-[#45464d] hover:bg-[#eff4ff] rounded text-[11px] cursor-pointer"
                  >
                    Editar
                  </button>
                </div>
              </div>

              {/* Pendência 2: Histórico de Alergias */}
              <div
                className={`p-3.5 rounded-xl border flex flex-col gap-2 transition-all ${
                  isAllergyResolved
                    ? 'bg-[#ffffff] border-[#e5eeff]'
                    : 'bg-[#fffbeb] border-[#fef08a]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold flex items-center gap-1 text-[#92400e]">
                    <span className="material-symbols-outlined text-[15px]">
                      {isAllergyResolved ? 'check_circle' : 'warning'}
                    </span>
                    Histórico de Alergias Medicamentosas
                  </span>
                  <span className="text-[10px] font-mono text-[#76777d]">
                    {isAllergyResolved ? 'Resolvido' : 'Pendente de Resolução'}
                  </span>
                </div>

                {isAllergyResolved ? (
                  <div className="text-[12px] text-[#065f46] font-semibold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    Alergia registrada: <u>{manualAllergySubstance || 'Dipirona Sódica'}</u>. Bloqueio liberado.
                  </div>
                ) : (
                  <>
                    <p className="text-[12px] text-[#45464d]">
                      O paciente mencionou reação prévia. É mandatório registrar substância para liberar a assinatura digital.
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={onOpenManualAllergyModal}
                        className="px-3 py-1 bg-[#006a61] hover:bg-[#005049] text-white rounded-md text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[14px]">edit_note</span>
                        Informar Alergia Manualmente
                      </button>
                      <button
                        onClick={() => setEstado2Resolved(true)}
                        className="px-3 py-1 bg-white border border-[#e5eeff] text-[#45464d] rounded-md text-[11px] hover:bg-[#eff4ff] cursor-pointer"
                      >
                        Declarar Negação Formal
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Pendência 3: Conflito de Alergia */}
              <div
                className={`p-3.5 rounded-xl border flex flex-col gap-2 transition-all ${
                  isConflictResolved
                    ? 'bg-[#ffffff] border-[#e5eeff]'
                    : 'bg-[#ffdad6]/40 border-[#ba1a1a]/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold flex items-center gap-1 text-[#ba1a1a]">
                    <span className="material-symbols-outlined text-[15px]">
                      {isConflictResolved ? 'verified' : 'crisis_alert'}
                    </span>
                    Conflito Identificado: Triagem vs. Relato do Paciente
                  </span>
                  <span className="text-[10px] font-mono text-[#76777d]">
                    {isConflictResolved ? 'Resolvido' : 'Divergência Crítica'}
                  </span>
                </div>

                {isConflictResolved ? (
                  <div className="text-[12px] text-[#065f46] font-semibold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    Opção médica confirmada: {estado3Option === 'patient' ? 'Priorizado relato direto do paciente (Alergia a Dipirona)' : 'Mantido registro da triagem sob justificativa'}.
                  </div>
                ) : (
                  <>
                    <p className="text-[12px] text-[#45464d]">
                      Na triagem constava <em>"Sem alergias"</em>, mas o paciente relatou verbalmente às 15:32:18 alergia
                      grave com edema de glote a <strong>Dipirona</strong>.
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => {
                          setEstado3Resolved(true);
                          setEstado3Option('patient');
                        }}
                        className="px-3 py-1 bg-[#ba1a1a] hover:bg-[#991b1b] text-white rounded-md text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[13px]">person_alert</span>
                        Adotar Relato da Paciente (Alergia Positiva)
                      </button>
                      <button
                        onClick={() => {
                          setEstado3Resolved(true);
                          setEstado3Option('triagem');
                        }}
                        className="px-3 py-1 bg-white border border-[#e5eeff] text-[#45464d] rounded-md text-[11px] hover:bg-[#eff4ff] cursor-pointer"
                      >
                        Manter Triagem
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Structured SOAP Note Editor */}
          <div className="bg-[#ffffff] rounded-2xl p-6 border border-[#e5eeff] shadow-xs flex flex-col gap-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#e5eeff]">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#006a61] font-bold">
                  Prontuário Médico Estruturado (Padrão CFM)
                </span>
                <h3 className="text-[16px] font-bold text-[#0b1c30]">
                  Rascunho Clínico SOAP com Rastreamento Fonético
                </h3>
              </div>
              <span className="px-2.5 py-1 bg-[#eff4ff] text-[#006a61] rounded-lg font-mono text-[11px] font-semibold border border-[#d3e4fe]">
                Ancoragem 100%
              </span>
            </div>

            {/* S - Subjetivo */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#0b1c30] text-[13px] flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#006a61] text-white text-[11px] font-mono flex items-center justify-center">
                    S
                  </span>
                  Subjetivo (Anamnese & Queixa)
                </span>
                <span className="text-[10px] font-mono text-[#76777d]">Ancorado: [00:15 - 01:45]</span>
              </div>
              <div className="p-3 bg-[#eff4ff]/30 rounded-xl border border-[#e5eeff] text-[12px] text-[#0b1c30] leading-relaxed">
                {liveSoapDraft?.subjetivo ||
                  (currentPatient.caseKey === 'carlos'
                    ? 'Paciente refere dor de forte intensidade em tornozelo direito com início súbito após trauma rotacional em inversão durante futebol society ontem à noite. Refere estalo audível no momento do trauma. Nega episódios prévios. Sem outras queixas sistêmicas.'
                    : 'Paciente refere dor abdominal iniciada há 18h em região periumbilical com posterior migração para fossa ilíaca direita. Caráter contínuo e progressivo, agravada pela tosse. Refere febre não termometrada e náuseas associadas com 2 episódios de vômitos.')}
              </div>
            </div>

            {/* O - Objetivo */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#0b1c30] text-[13px] flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#006a61] text-white text-[11px] font-mono flex items-center justify-center">
                    O
                  </span>
                  Objetivo (Exame Físico & Sinais Vitais)
                </span>
                <span className="text-[10px] font-mono text-[#76777d]">Ancorado: [02:18]</span>
              </div>
              <div className="p-3 bg-[#eff4ff]/30 rounded-xl border border-[#e5eeff] text-[12px] text-[#0b1c30] leading-relaxed">
                {liveSoapDraft?.objetivo ||
                  (currentPatient.caseKey === 'carlos'
                    ? 'BEG, lúcido e orientado no tempo e espaço. Edema moderado (+2/+4) perimaleolar lateral em tornozelo direito. Dor à palpação na ponta e borda posterior do maléolo lateral e trajeto do ligamento talofibular anterior. Critérios de Ottawa positivos para indicação radiológica. Pulsos pedioso e tibial posterior cheios e simétricos. Perfusão capilar periférica < 2s.'
                    : 'REG, febril ao toque (Tax 38.3°C), anictérica, corada. Abdome plano, doloroso à palpação superficial e profunda em fossa ilíaca direita. Sinal de Blumberg (descompressão brusca) positivo. Sinal de Rovsing positivo. RHA presentes e diminuídos.')}
              </div>
            </div>

            {/* A - Avaliação */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#0b1c30] text-[13px] flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#006a61] text-white text-[11px] font-mono flex items-center justify-center">
                    A
                  </span>
                  Avaliação (Hipóteses Diagnósticas)
                </span>
                <span className="text-[10px] font-mono text-[#76777d]">Padrão CID-10</span>
              </div>
              <div className="p-3 bg-[#eff4ff]/30 rounded-xl border border-[#e5eeff] text-[12px] text-[#0b1c30] flex flex-col gap-1">
                {liveSoapDraft?.avaliacao ? (
                  <div className="font-semibold text-[#0b1c30]">{liveSoapDraft.avaliacao}</div>
                ) : currentPatient.caseKey === 'carlos' ? (
                  <>
                    <div className="flex items-center justify-between font-semibold">
                      <span>1. Entorse e distensão do tornozelo</span>
                      <span className="font-mono text-[#006a61]">CID-10: S93.4</span>
                    </div>
                    <div className="flex items-center justify-between text-[#76777d]">
                      <span>2. Hipótese a afastar: Fratura maleolar distal</span>
                      <span className="font-mono">CID-10: S82.6</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between font-semibold">
                      <span>1. Apendicite aguda não especificada</span>
                      <span className="font-mono text-[#ba1a1a]">CID-10: K35.8</span>
                    </div>
                    <div className="flex items-center justify-between text-[#76777d]">
                      <span>2. Diagnóstico diferencial: Doença inflamatória pélvica</span>
                      <span className="font-mono">CID-10: N73.9</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* P - Plano & Conduta */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#0b1c30] text-[13px] flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#006a61] text-white text-[11px] font-mono flex items-center justify-center">
                    P
                  </span>
                  Plano & Conduta Médica
                </span>
                <span className="text-[10px] font-mono text-[#76777d]">Assinatura ICP-Brasil</span>
              </div>
              <div className="p-3 bg-[#eff4ff]/30 rounded-xl border border-[#e5eeff] text-[12px] text-[#0b1c30] flex flex-col gap-1.5">
                {liveSoapDraft?.plano ? (
                  <div className="leading-relaxed whitespace-pre-line">{liveSoapDraft.plano}</div>
                ) : currentPatient.caseKey === 'carlos' ? (
                  <>
                    <div>1. Raio-X de Tornozelo Direito (AP + Perfil) - TUSS 4.08.04.05-4</div>
                    <div>2. Dipirona 1g VO dose única agora para dor</div>
                    <div>3. Imobilização com tala gessada suropodálica provisória</div>
                    <div>4. Crioterapia 20 min 3x/dia + Elevação do membro</div>
                    <div>5. Encaminhamento para interconsulta com Ortopedia e Traumatologia</div>
                  </>
                ) : (
                  <>
                    <div>1. Jejum imediato para possível abordagem cirúrgica</div>
                    <div>2. Ultrassonografia de Abdome Total em caráter de urgência (TUSS 4.09.01.23-8)</div>
                    <div>3. Hemograma Completo + PCR + Urina I (STAT)</div>
                    <div>4. Acesso venoso periférico calibroso + Hidratação venosa SF 0.9% 1000ml</div>
                    <div>5. Analgesia: Tramadol 50mg IV diluído (evitar Dipirona por histórico de alergia)</div>
                    <div>6. Parecer urgente com Cirurgia Geral</div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Signature Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#ffffff]/95 backdrop-blur-md border-t border-[#e5eeff] px-4 lg:px-8 py-3 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                isReadyToSign ? 'bg-[#86f2e4]/40 text-[#006f66]' : 'bg-[#fffbeb] text-[#ca8a04]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isReadyToSign ? 'verified' : 'lock'}
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#0b1c30] text-[13px]">
                  {isReadyToSign ? 'Pronto para Homologação Digital' : `${pendenciasRestantes} Pendência(s) Ativa(s)`}
                </span>
                <span
                  className={`px-2 py-0.2 rounded font-mono text-[10px] font-bold ${
                    isReadyToSign
                      ? 'bg-[#10b981]/10 text-[#065f46]'
                      : 'bg-[#ffdad6] text-[#ba1a1a]'
                  }`}
                >
                  {isReadyToSign ? 'LIBERADO' : 'TRAVA ATIVA'}
                </span>
              </div>
              <p className="text-[11px] text-[#76777d]">
                {isReadyToSign
                  ? 'Todas as incongruências e evidências foram sanadas em conformidade com o CFM.'
                  : 'Resolva a checagem de alergia e conflito acima para desbloquear a assinatura digital.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={onOpenPrintGuidesModal}
              className="px-3.5 py-2 bg-[#eff4ff] hover:bg-[#e5eeff] text-[#006a61] border border-[#d3e4fe] font-semibold text-[12px] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Emitir Guias</span>
            </button>

            <button
              onClick={handleSign}
              disabled={!isReadyToSign}
              className={`px-5 py-2 font-bold text-[12px] rounded-lg transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
                isReadyToSign
                  ? 'bg-[#006a61] hover:bg-[#005049] text-white cursor-pointer'
                  : 'bg-[#c6c6cd] text-white cursor-not-allowed'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">draw</span>
              <span>Assinar Prontuário CFM</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
