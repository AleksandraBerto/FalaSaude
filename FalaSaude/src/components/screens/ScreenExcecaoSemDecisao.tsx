import React, { useState } from 'react';
import { Patient, ScreenId } from '../../types/clinical';
import { TRANSCRIPT_JOSE } from '../../data/mockClinicalData';

interface ScreenExcecaoSemDecisaoProps {
  currentPatient: Patient;
  onNavigate: (screenId: ScreenId) => void;
  onSelectCase: (caseKey: 'carlos' | 'ana' | 'jose' | 'maria') => void;
}

export const ScreenExcecaoSemDecisao: React.FC<ScreenExcecaoSemDecisaoProps> = ({
  currentPatient,
  onNavigate,
}) => {
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
  const [highlightSymptoms, setHighlightSymptoms] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [manualNote, setManualNote] = useState('');
  const [showManualModal, setShowManualModal] = useState(false);

  const handleDischarge = () => {
    setActionFeedback(
      'Alta com Orientações Gerais confirmada! Documento estruturado: Repouso, hidratação de 2L/dia e higiene do sono vinculados ao prontuário.'
    );
    setTimeout(() => {
      onNavigate('auditoria');
    }, 2500);
  };

  const handleCopyTranscript = () => {
    const fullText = TRANSCRIPT_JOSE.map((t) => `[${t.timestamp}] ${t.speaker}: ${t.text}`).join('\n\n');
    navigator.clipboard?.writeText(fullText);
    setActionFeedback('Transcrição completa (1.240 palavras) copiada para a área de transferência!');
    setTimeout(() => setActionFeedback(null), 3000);
  };

  return (
    <main className="w-full pt-24 pb-20 bg-[#f8f9ff] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col gap-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#e5eeff]">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-[#86f2e4]/30 text-[#006f66] font-mono text-[11px] font-bold">
                TELA 5 DE 6
              </span>
              <h1 className="text-[22px] font-bold text-[#0b1c30]">Exceção Sem Decisão Detectada</h1>
            </div>
            <p className="text-[13px] text-[#45464d] mt-0.5">
              Salvaguarda Anti-Alucinação e Protocolo de Consulta Neutra • Diretriz CFM 2.314/2022
            </p>
          </div>

          <button
            onClick={() => onNavigate('fila-do-plantao')}
            className="px-3.5 py-1.5 bg-white hover:bg-[#eff4ff] text-[#006a61] border border-[#d3e4fe] rounded-lg text-[12px] font-semibold transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Voltar à Fila
          </button>
        </div>

        {/* 2-Columns Layout: Left = Patient & Safety Info, Right = Neutral Alert & Pathways */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: Patient Info & Safeguard Explanation (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* Patient Card */}
            <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#e5eeff] shadow-xs flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#eff4ff] text-[#006a61] flex items-center justify-center font-bold text-[16px] border border-[#d3e4fe]">
                  JB
                </div>
                <div className="flex flex-col">
                  <h3 className="font-bold text-[#0b1c30] text-[15px]">José Bonifácio dos Santos</h3>
                  <span className="text-[11px] text-[#76777d]">67 anos • Prontuário #49.102-M</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#e5eeff] flex flex-col gap-1.5 text-[12px]">
                <div className="flex justify-between">
                  <span className="text-[#76777d]">Manchester:</span>
                  <span className="font-semibold text-[#ca8a04]">Amarelo (Urgente)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#76777d]">Queixa Inicial:</span>
                  <span className="font-semibold text-[#0b1c30]">Cefaleia & Tontura</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#76777d]">Glicemia (HGT):</span>
                  <span className="font-mono text-[#0b1c30]">142 mg/dL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#76777d]">Pressão Arterial:</span>
                  <span className="font-mono text-[#0b1c30]">134/86 mmHg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#76777d]">Exame Neurológico:</span>
                  <span className="text-[#006a61] font-semibold">Sem Déficits Focais</span>
                </div>
              </div>
            </div>

            {/* Safeguard explanation */}
            <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#e5eeff] shadow-xs flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[#006a61]">
                <span className="material-symbols-outlined text-[20px]">shield_with_heart</span>
                <h4 className="font-bold text-[13px] text-[#0b1c30]">Por que esta guarda existe?</h4>
              </div>

              <div className="flex flex-col gap-2.5 text-[12px] text-[#45464d] leading-relaxed">
                <p>
                  <strong>Zero Presunção Diagnóstica:</strong> Quando o profissional assistente não declara verbalmente
                  pedidos de imagem, sangue ou receitas durante o diálogo, a IA <strong>jamais inventa ou sugere exames por conta própria</strong>.
                </p>
                <p>
                  <strong>Proteção Contra Fadiga de Plantão:</strong> Evita que consultas puramente orientativas
                  tenham solicitações incluídas acidentalmente por clique automático.
                </p>
                <p>
                  <strong>Fidelidade Estrita ao CFM:</strong> Cumpre integralmente o artigo 3º da Resolução CFM
                  2.314/22 para inteligência artificial médica passiva.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Neutral Notification Block & Actions (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-5">
            {/* Central Reassuring Neutral Card */}
            <div className="bg-[#ffffff] rounded-2xl p-6 sm:p-8 border border-[#e5eeff] shadow-xs flex flex-col gap-6 text-center">
              <div className="flex flex-col items-center max-w-lg mx-auto">
                <div className="w-14 h-14 rounded-2xl bg-[#eff4ff] text-[#006a61] flex items-center justify-center mb-3 shadow-xs">
                  <span className="material-symbols-outlined text-[30px]">check_circle</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#eff4ff] text-[#006a61] font-mono text-[11px] font-semibold mb-2">
                  Consulta de Anamnese & Orientação Clínica
                </span>
                <h2 className="text-[20px] font-bold text-[#0b1c30]">
                  Nenhum exame ou encaminhamento foi solicitado
                </h2>
                <p className="text-[13px] text-[#45464d] leading-relaxed mt-2">
                  Durante o diálogo gravado de 14 minutos, não foram verbalizados pedidos de exames laboratoriais,
                  receitas adicionais ou pareceres com especialistas. O prontuário permanece neutro, sem rascunhos automáticos.
                </p>
              </div>

              {/* 3 Status Columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 border-y border-[#e5eeff] py-5 text-left">
                <div className="p-3 bg-[#eff4ff]/30 rounded-xl border border-[#e5eeff] flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-[#76777d] text-[11px] font-mono">
                    <span className="material-symbols-outlined text-[15px]">medication</span>
                    <span>Prescrição Farmacológica</span>
                  </div>
                  <span className="font-bold text-[#0b1c30] text-[13px]">Não verbalizada</span>
                  <span className="text-[11px] text-[#76777d]">Sem menção a novos medicamentos</span>
                </div>

                <div className="p-3 bg-[#eff4ff]/30 rounded-xl border border-[#e5eeff] flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-[#76777d] text-[11px] font-mono">
                    <span className="material-symbols-outlined text-[15px]">biotech</span>
                    <span>Exames Complementares</span>
                  </div>
                  <span className="font-bold text-[#0b1c30] text-[13px]">Nenhum pedido</span>
                  <span className="text-[11px] text-[#76777d]">Sem pedidos laboratoriais/imagem</span>
                </div>

                <div className="p-3 bg-[#eff4ff]/30 rounded-xl border border-[#e5eeff] flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-[#76777d] text-[11px] font-mono">
                    <span className="material-symbols-outlined text-[15px]">person_search</span>
                    <span>Encaminhamentos</span>
                  </div>
                  <span className="font-bold text-[#0b1c30] text-[13px]">Não requerido</span>
                  <span className="text-[11px] text-[#76777d]">Sem necessidade de parecer</span>
                </div>
              </div>

              {/* Actions row */}
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-mono text-[#76777d] uppercase tracking-wider font-semibold text-left">
                  Conduta Médica Desejada:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={handleDischarge}
                    className="p-3 bg-[#006a61] hover:bg-[#005049] text-white rounded-xl text-[12px] font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">task_alt</span>
                    <span>Alta com Orientações</span>
                  </button>

                  <button
                    onClick={() => setShowManualModal(true)}
                    className="p-3 bg-[#eff4ff] hover:bg-[#e5eeff] text-[#006a61] border border-[#d3e4fe] rounded-xl text-[12px] font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit_note</span>
                    <span>Preencher Manualmente</span>
                  </button>

                  <button
                    onClick={() => setIsTranscriptOpen(!isTranscriptOpen)}
                    className="p-3 bg-white hover:bg-[#eff4ff] text-[#0b1c30] border border-[#e5eeff] rounded-xl text-[12px] font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">description</span>
                    <span>{isTranscriptOpen ? 'Ocultar Transcrição' : 'Rever Transcrição'}</span>
                  </button>
                </div>
              </div>

              {/* Action feedback message */}
              {actionFeedback && (
                <div className="p-3.5 rounded-xl bg-[#10b981]/10 text-[#065f46] text-[12px] border border-[#10b981]/30 flex items-center gap-2 text-left animate-fadeIn">
                  <span className="material-symbols-outlined text-[20px] text-[#10b981]">check_circle</span>
                  <span>{actionFeedback}</span>
                </div>
              )}
            </div>

            {/* Collapsible Transcript Accordion */}
            <div className="bg-[#ffffff] rounded-2xl border border-[#e5eeff] shadow-xs overflow-hidden">
              <button
                onClick={() => setIsTranscriptOpen(!isTranscriptOpen)}
                className="w-full px-5 py-3.5 bg-[#eff4ff]/60 hover:bg-[#eff4ff] transition-colors flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#006a61] text-[20px]">history_edu</span>
                  <div>
                    <span className="font-bold text-[#0b1c30] text-[13px] block">
                      Registro Completo da Transcrição
                    </span>
                    <span className="text-[11px] text-[#76777d]">
                      1.240 palavras gravadas e sincronizadas • Prova de auditoria CFM
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-[#006a61] font-semibold">
                    {isTranscriptOpen ? 'Recolher' : 'Exibir Transcrição'}
                  </span>
                  <span
                    className={`material-symbols-outlined text-[20px] text-[#76777d] transition-transform duration-200 ${
                      isTranscriptOpen ? 'rotate-180' : ''
                    }`}
                  >
                    expand_more
                  </span>
                </div>
              </button>

              {isTranscriptOpen && (
                <div className="p-5 flex flex-col gap-4 border-t border-[#e5eeff]">
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#e5eeff]">
                    <span className="text-[10px] font-mono text-[#76777d] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
                      CANAL 01 • ÁUDIO SINCRONIZADO
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopyTranscript}
                        className="px-2.5 py-1 bg-[#eff4ff] hover:bg-[#e5eeff] rounded text-[11px] font-semibold text-[#006a61] flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[14px]">content_copy</span>
                        Copiar Diálogo
                      </button>
                      <button
                        onClick={() => setHighlightSymptoms(!highlightSymptoms)}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer ${
                          highlightSymptoms
                            ? 'bg-[#006a61] text-white'
                            : 'bg-[#eff4ff] text-[#006a61] hover:bg-[#e5eeff]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">search_insights</span>
                        {highlightSymptoms ? 'Sintomas Destacados' : 'Destacar Sintomas'}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 max-h-80 overflow-y-auto pr-1">
                    {TRANSCRIPT_JOSE.map((t) => (
                      <div
                        key={t.id}
                        className={`p-3 rounded-xl border text-[12px] ${
                          t.role === 'doctor'
                            ? 'bg-[#eff4ff]/40 border-[#d3e4fe]'
                            : 'bg-white border-[#e5eeff]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={`font-bold ${
                              t.role === 'doctor' ? 'text-[#006a61]' : 'text-[#0b1c30]'
                            }`}
                          >
                            {t.speaker}
                          </span>
                          <span className="text-[10px] font-mono text-[#76777d]">{t.timestamp}</span>
                        </div>
                        <p className="text-[#0b1c30] leading-relaxed">
                          {highlightSymptoms && t.text.includes('cabeça pesada') ? (
                            <span>
                              Boa tarde, doutor. Eu ando com uma sensação de{' '}
                              <mark className="bg-[#fef08a] px-1 rounded">cabeça pesada faz uns três dias</mark>
                              , como se tivesse uma faixa apertando minha nuca. Hoje cedo quando levantei da cama rápido
                              deu uma <mark className="bg-[#fef08a] px-1 rounded">tonturazinha de leve</mark>...
                            </span>
                          ) : (
                            t.text
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Manual Document Modal */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 bg-[#131b2e]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 flex flex-col gap-4 shadow-xl border border-[#e5eeff]">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#0b1c30] text-[16px]">Inserir Conduta Manual</h3>
              <button
                onClick={() => setShowManualModal(false)}
                className="text-[#76777d] hover:text-[#0b1c30] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="text-[12px] text-[#45464d]">
              Caso deseje solicitar exames ou medicações não verbalizados durante o atendimento com Seu José Bonifácio:
            </p>

            <textarea
              value={manualNote}
              onChange={(e) => setManualNote(e.target.value)}
              placeholder="Ex: Solicito Hemograma completo ou Prescrevo Dipirona 500mg se dor..."
              rows={4}
              className="w-full p-3 rounded-xl bg-[#eff4ff] text-[#0b1c30] text-[13px] border border-[#e5eeff] focus:outline-none focus:ring-1 focus:ring-[#006a61]"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowManualModal(false)}
                className="px-3.5 py-1.5 text-[#45464d] text-[12px]"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setShowManualModal(false);
                  setActionFeedback(`Conduta manual adicionada com sucesso: "${manualNote || 'Orientações registradas'}"`);
                  setTimeout(() => onNavigate('auditoria'), 2000);
                }}
                className="px-4 py-2 bg-[#006a61] hover:bg-[#005049] text-white rounded-lg text-[12px] font-bold"
              >
                Gravar Conduta Manual
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
