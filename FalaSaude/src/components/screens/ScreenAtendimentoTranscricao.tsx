import React, { useState, useEffect } from 'react';
import { Patient, ScreenId, TranscriptUtterance, ClinicalDecision } from '../../types/clinical';
import { TRANSCRIPT_CARLOS, INITIAL_DECISIONS_CARLOS } from '../../data/mockClinicalData';

interface ScreenAtendimentoTranscricaoProps {
  patient: Patient;
  onNavigate: (screenId: ScreenId) => void;
  onSelectCase: (caseKey: 'carlos' | 'ana' | 'jose' | 'maria') => void;
}

export const ScreenAtendimentoTranscricao: React.FC<ScreenAtendimentoTranscricaoProps> = ({
  patient,
  onNavigate,
}) => {
  const [isRecording, setIsRecording] = useState(true);
  const [seconds, setSeconds] = useState(225); // 03:45
  const [transcript, setTranscript] = useState<TranscriptUtterance[]>(TRANSCRIPT_CARLOS);
  const [decisions] = useState<ClinicalDecision[]>(INITIAL_DECISIONS_CARLOS);
  const [newSpeechRole, setNewSpeechRole] = useState<'doctor' | 'patient'>('patient');
  const [newSpeechText, setNewSpeechText] = useState('');

  // Live timer effect
  useEffect(() => {
    if (!isRecording) return;
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddSpeech = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpeechText.trim()) return;

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    const newUtterance: TranscriptUtterance = {
      id: `live-${Date.now()}`,
      speaker: newSpeechRole === 'doctor' ? 'Dr. Renato Guimarães' : patient.name,
      role: newSpeechRole,
      timestamp: timeStr,
      text: newSpeechText.trim(),
    };

    setTranscript((prev) => [...prev, newUtterance]);
    setNewSpeechText('');
  };

  return (
    <main className="w-full pt-20 pb-16 bg-[#f8f9ff] min-h-screen">
      {/* Consultation Sticky Header */}
      <div className="w-full bg-[#ffffff] border-b border-[#e5eeff] px-4 lg:px-6 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Patient summary chip */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#eff4ff] text-[#006a61] flex items-center justify-center font-bold text-[16px] border border-[#d3e4fe]">
              CM
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
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono text-[#76777d] mt-0.5">
                <span>Início: 14:22:10</span>
                <span>•</span>
                <span className="flex items-center gap-1 font-semibold text-[#006a61]">
                  <span className="material-symbols-outlined text-[14px]">timer</span>
                  Duração: {formatTimer(seconds)}
                </span>
                <span>•</span>
                <span>Box 04 • Ortopedia Geral</span>
              </div>
            </div>
          </div>

          {/* Active recording indicator and actions */}
          <div className="flex items-center gap-3 flex-wrap self-end lg:self-auto">
            {/* Audio Waveform bar */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#eff4ff] rounded-full border border-[#d3e4fe]">
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isRecording ? 'bg-[#10b981] animate-pulse' : 'bg-[#76777d]'
                  }`}
                ></span>
                <span className="text-[11px] font-mono text-[#006a61] font-semibold uppercase tracking-wider">
                  {isRecording ? 'Escuta Ativa' : 'Pausado'}
                </span>
              </div>
              <div className="h-3 w-px bg-[#c6c6cd]"></div>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[#006a61] text-[16px]">mic</span>
                {/* Visualizer bars */}
                <div className="flex items-end gap-0.5 h-3.5 w-8 pb-0.5">
                  <span
                    className={`w-1 bg-[#006a61] rounded-full ${
                      isRecording ? 'h-1.5 animate-pulse' : 'h-1'
                    }`}
                  ></span>
                  <span
                    className={`w-1 bg-[#006a61] rounded-full ${
                      isRecording ? 'h-3 animate-pulse' : 'h-1'
                    }`}
                    style={{ animationDelay: '150ms' }}
                  ></span>
                  <span
                    className={`w-1 bg-[#006a61] rounded-full ${
                      isRecording ? 'h-2 animate-pulse' : 'h-1'
                    }`}
                    style={{ animationDelay: '300ms' }}
                  ></span>
                  <span
                    className={`w-1 bg-[#006a61] rounded-full ${
                      isRecording ? 'h-3.5 animate-pulse' : 'h-1'
                    }`}
                    style={{ animationDelay: '450ms' }}
                  ></span>
                </div>
              </div>
            </div>

            {/* Pause / Resume Button */}
            <button
              onClick={() => setIsRecording(!isRecording)}
              className="px-3 py-1.5 rounded-lg border border-[#e5eeff] hover:bg-[#eff4ff] text-[#45464d] text-[12px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">
                {isRecording ? 'pause' : 'play_arrow'}
              </span>
              <span>{isRecording ? 'Pausar' : 'Retomar'}</span>
            </button>

            {/* Conclude consultation */}
            <button
              onClick={() => onNavigate('rascunho')}
              className="px-4 py-1.5 bg-[#006a61] hover:bg-[#005049] text-white rounded-lg text-[12px] font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">fact_check</span>
              <span>Finalizar & Revisar Rascunho</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 3-Column Consultation View */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT COLUMN: Triagem & Resumo do Paciente (3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* Card: Triagem Manchester */}
          <div className="bg-[#ffffff] rounded-xl p-4 border border-[#e5eeff] shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#e5eeff]">
              <span className="text-[11px] font-mono text-[#76777d] uppercase tracking-wider font-semibold">
                Classificação de Risco
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#16a34a]/10 text-[#16a34a] font-mono text-[10px] font-bold">
                MANCHESTER VERDE
              </span>
            </div>

            <div className="flex flex-col gap-1.5 text-[12px]">
              <div className="flex justify-between">
                <span className="text-[#76777d]">Tempo de Espera:</span>
                <span className="font-semibold text-[#0b1c30]">14 min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#76777d]">Destino:</span>
                <span className="font-semibold text-[#006a61]">Box 04 • Ortopedia</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#76777d]">Enfermeiro Triagem:</span>
                <span className="font-semibold text-[#0b1c30]">Fabio R. COREN/SP</span>
              </div>
            </div>
          </div>

          {/* Card: Sinais Vitais */}
          <div className="bg-[#ffffff] rounded-xl p-4 border border-[#e5eeff] shadow-xs flex flex-col gap-3">
            <span className="text-[11px] font-mono text-[#76777d] uppercase tracking-wider font-semibold pb-2 border-b border-[#e5eeff]">
              Sinais Vitais na Admissão
            </span>

            <div className="grid grid-cols-2 gap-2 text-[12px]">
              <div className="p-2 bg-[#eff4ff]/60 rounded-lg border border-[#e5eeff]">
                <span className="text-[10px] text-[#76777d] block font-mono">PA</span>
                <span className="font-bold text-[#0b1c30]">128/84 mmHg</span>
              </div>
              <div className="p-2 bg-[#eff4ff]/60 rounded-lg border border-[#e5eeff]">
                <span className="text-[10px] text-[#76777d] block font-mono">FC</span>
                <span className="font-bold text-[#0b1c30]">82 bpm</span>
              </div>
              <div className="p-2 bg-[#eff4ff]/60 rounded-lg border border-[#e5eeff]">
                <span className="text-[10px] text-[#76777d] block font-mono">SpO2</span>
                <span className="font-bold text-[#0b1c30]">98% em A/A</span>
              </div>
              <div className="p-2 bg-[#eff4ff]/60 rounded-lg border border-[#e5eeff]">
                <span className="text-[10px] text-[#76777d] block font-mono">Temperatura</span>
                <span className="font-bold text-[#0b1c30]">36.4°C</span>
              </div>
            </div>
          </div>

          {/* Card: Queixa Principal */}
          <div className="bg-[#ffffff] rounded-xl p-4 border border-[#e5eeff] shadow-xs flex flex-col gap-2">
            <span className="text-[11px] font-mono text-[#76777d] uppercase tracking-wider font-semibold">
              História Breve de Entrada
            </span>
            <p className="text-[12px] text-[#0b1c30] leading-relaxed">
              "Entorse de tornozelo direito com inversão forçada durante jogo esportivo há 16 horas. Dor intensa no
              maléolo lateral com incapacidade de descarga de peso total."
            </p>
          </div>

          {/* Card: Alergias Registradas */}
          <div className="bg-[#ffffff] rounded-xl p-4 border border-[#e5eeff] shadow-xs flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#76777d] uppercase tracking-wider font-semibold">
                Alergias Referidas
              </span>
              <span className="material-symbols-outlined text-[16px] text-[#10b981]">check_circle</span>
            </div>
            <p className="text-[12px] text-[#006a61] font-semibold">
              Nenhuma alergia conhecida ou referida pelo paciente.
            </p>
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
                  Transcrição Contínua em Tempo Real
                </h3>
              </div>
              <span className="text-[11px] font-mono text-[#006a61] flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-ping"></span>
                Diarização Ativa • 2 Locutores
              </span>
            </div>

            {/* Transcript stream */}
            <div className="p-5 flex flex-col gap-4 max-h-[520px] overflow-y-auto">
              {transcript.map((item) => {
                const isDoc = item.role === 'doctor';
                return (
                  <div
                    key={item.id}
                    className={`flex flex-col gap-1 p-3.5 rounded-xl transition-all ${
                      isDoc
                        ? 'bg-[#eff4ff]/50 border border-[#d3e4fe]/60'
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
                          Ancoragem: {item.evidenceId} ({item.confidence})
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Simulated Live Input Bar */}
            <form onSubmit={handleAddSpeech} className="p-3 bg-[#eff4ff]/40 border-t border-[#e5eeff] flex flex-col gap-2">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2 font-mono text-[#76777d]">
                  <span>Simular locutor:</span>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="speaker"
                      checked={newSpeechRole === 'doctor'}
                      onChange={() => setNewSpeechRole('doctor')}
                    />
                    <span className="text-[#006a61] font-semibold">Dr. Renato (Médico)</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="speaker"
                      checked={newSpeechRole === 'patient'}
                      onChange={() => setNewSpeechRole('patient')}
                    />
                    <span className="text-[#0b1c30] font-semibold">Carlos (Paciente)</span>
                  </label>
                </div>
                <span className="text-[10px] font-mono text-[#76777d]">IA passiva transcrevendo</span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newSpeechText}
                  onChange={(e) => setNewSpeechText(e.target.value)}
                  placeholder="Inserir fala do médico ou paciente para testar transcrição..."
                  className="flex-1 px-3 py-2 rounded-lg bg-white border border-[#e5eeff] text-[12px] text-[#0b1c30] focus:outline-none focus:ring-1 focus:ring-[#006a61]"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-[#006a61] hover:bg-[#005049] text-white rounded-lg text-[12px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">send</span>
                  Inserir
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Decisões Clínicas Detectadas (3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="bg-[#ffffff] rounded-2xl border border-[#e5eeff] shadow-xs p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#e5eeff]">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#006a61] text-[18px]">auto_awesome</span>
                <h3 className="font-bold text-[#0b1c30] text-[13px]">Decisões Detectadas</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#86f2e4]/30 text-[#006f66] font-mono text-[10px] font-bold">
                {decisions.length} Atos
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {decisions.map((dec) => (
                <div
                  key={dec.id}
                  className="p-3 rounded-xl bg-[#eff4ff]/50 border border-[#d3e4fe] flex flex-col gap-1.5 shadow-xs"
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
                      {dec.evidenceTimestamp}
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
              ))}
            </div>

            {/* Safety Score Card */}
            <div className="p-3 bg-[#f8f9ff] rounded-xl border border-[#e5eeff] flex flex-col gap-1 text-[11px]">
              <div className="flex justify-between items-center">
                <span className="text-[#76777d] font-mono">Precisão Acústica:</span>
                <span className="font-bold text-[#006a61]">99.2% (Ótima)</span>
              </div>
              <div className="w-full bg-[#eff4ff] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#006a61] h-full w-[99%]"></div>
              </div>
              <span className="text-[10px] text-[#76777d] mt-1 leading-tight">
                Processamento local de áudio protegido sob o sigilo médico do CFM.
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
