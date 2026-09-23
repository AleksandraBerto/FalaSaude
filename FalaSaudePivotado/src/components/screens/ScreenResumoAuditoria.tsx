import React, { useState } from 'react';
import { Patient, ScreenId } from '../../types/clinical';
import { AUDIT_TRAIL_DATA } from '../../data/mockClinicalData';

interface ScreenResumoAuditoriaProps {
  currentPatient: Patient;
  onNavigate: (screenId: ScreenId) => void;
  onOpenQrModal: () => void;
}

export const ScreenResumoAuditoria: React.FC<ScreenResumoAuditoriaProps> = ({
  currentPatient,
  onNavigate,
  onOpenQrModal,
}) => {
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const handleSyncPEP = () => {
    setSyncFeedback('Sincronizado com sucesso com PEP TASY / MV Soul (ID de Transação #TX-99410-CFM).');
    setTimeout(() => setSyncFeedback(null), 4000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="w-full pt-24 pb-32 bg-[#f8f9ff] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col gap-6">
        {/* Top Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-[#e5eeff]">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-[#86f2e4]/30 text-[#006f66] font-mono text-[11px] font-bold">
                TELA 6 DE 6
              </span>
              <h1 className="text-[22px] font-bold text-[#0b1c30]">
                Registro Clínico Homologado • Plantão Emergência Adulto
              </h1>
            </div>
            <p className="text-[13px] text-[#45464d] mt-0.5">
              Prontuário eletrônico certificado com trilha forense e carimbo de tempo ICP-Brasil
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-full bg-[#86f2e4]/30 border border-[#86f2e4] text-[#006f66] text-[11px] font-mono font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px]">verified</span>
              ICP-Brasil • Padrão CFM 2.314/2022 Concluído
            </span>
          </div>
        </div>

        {syncFeedback && (
          <div className="p-3.5 bg-[#10b981]/10 border border-[#10b981]/30 rounded-xl text-[#065f46] text-[12px] flex items-center gap-2 animate-fadeIn">
            <span className="material-symbols-outlined text-[20px] text-[#10b981]">check_circle</span>
            <span>{syncFeedback}</span>
          </div>
        )}

        {/* 1. Banner de Sucesso de Assinatura */}
        <div className="w-full bg-[#ffffff] rounded-2xl p-5 sm:p-6 border border-[#006a61]/20 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start md:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#86f2e4]/30 text-[#006f66] flex items-center justify-center shrink-0 border border-[#86f2e4]">
              <span className="material-symbols-outlined text-[26px]">verified</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[17px] font-bold text-[#0b1c30]">
                  Documento Clínico Assinado Digitalmente
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#86f2e4]/30 text-[#006f66] text-[11px] font-mono font-semibold flex items-center gap-1 border border-[#86f2e4]">
                  <span className="material-symbols-outlined text-[13px]">lock</span>
                  ICP-Brasil • Padrão CFM 2.314/2022
                </span>
              </div>
              <p className="text-[12px] text-[#45464d] mt-1 leading-relaxed">
                Autenticado por <strong className="text-[#0b1c30]">Dr. Renato Guimarães</strong> (CRM/SP 148.920) •
                Carimbo do Tempo: <span className="font-mono text-[#006a61] font-semibold">24/10/2024 às 14:48:12 BRT</span> •
                AC SOLUTI Multi-Hospitalar v5
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#eff4ff]/60 px-4 py-2 rounded-xl border border-[#d3e4fe] shrink-0 self-start lg:self-auto">
            <div className="flex flex-col items-start lg:items-end">
              <span className="text-[10px] font-mono uppercase text-[#76777d]">Certificado Digital</span>
              <span className="text-[11px] font-semibold text-[#0b1c30]">A3 Token Físico (ID-781902)</span>
            </div>
            <div className="h-6 w-px bg-[#c6c6cd]"></div>
            <div className="flex items-center gap-1 text-[#006a61] text-[12px] font-bold">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>Válido</span>
            </div>
          </div>
        </div>

        {/* 2. Painel de Métricas e Governança de Rastreabilidade (4 cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Metric 1 */}
          <div className="bg-[#ffffff] p-4 rounded-xl border border-[#e5eeff] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#76777d]">
                Fonte Verificável
              </span>
              <div className="w-7 h-7 rounded-lg bg-[#eff4ff] text-[#006a61] flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px]">record_voice_over</span>
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[26px] font-bold text-[#0b1c30]">4</span>
                <span className="text-[12px] text-[#006a61] font-bold">/ 4 campos (100%)</span>
              </div>
              <p className="text-[11px] text-[#76777d] mt-1 leading-snug">
                Ancoragem fonética total confirmada por transcrição pontual e triagem.
              </p>
            </div>
            <div className="w-full bg-[#eff4ff] h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-[#006a61] h-full w-full rounded-full"></div>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="bg-[#ffffff] p-4 rounded-xl border border-[#e5eeff] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#76777d]">
                Editados pelo Médico
              </span>
              <div className="w-7 h-7 rounded-lg bg-[#eff4ff] text-[#45464d] flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px]">edit_note</span>
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[26px] font-bold text-[#0b1c30]">1</span>
                <span className="text-[12px] text-[#45464d]">campo ajustado</span>
              </div>
              <p className="text-[11px] text-[#76777d] mt-1 leading-snug">
                Ajuste de lateralidade no pedido radiológico (especificação "Direito").
              </p>
            </div>
            <div className="w-full bg-[#eff4ff] h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-[#006a61] h-full w-1/4 rounded-full"></div>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="bg-[#ffffff] p-4 rounded-xl border border-[#e5eeff] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#76777d]">
                Descartados / Ignorados
              </span>
              <div className="w-7 h-7 rounded-lg bg-[#eff4ff] text-[#45464d] flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px]">remove_done</span>
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[26px] font-bold text-[#0b1c30]">1</span>
                <span className="text-[12px] text-[#45464d]">sugestão dispensada</span>
              </div>
              <p className="text-[11px] text-[#76777d] mt-1 leading-snug">
                Ultrassonografia de partes moles descartada por ausência de indicação.
              </p>
            </div>
            <div className="w-full bg-[#eff4ff] h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-[#76777d] h-full w-1/4 rounded-full"></div>
            </div>
          </div>

          {/* Metric 4 */}
          <div className="bg-[#ffffff] p-4 rounded-xl border border-[#e5eeff] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#76777d]">
                Bloqueios & Conflitos
              </span>
              <div className="w-7 h-7 rounded-lg bg-[#86f2e4]/30 text-[#006f66] flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px]">shield_with_heart</span>
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[26px] font-bold text-[#006a61]">2</span>
                <span className="text-[12px] text-[#006a61] font-bold">resoluções auditadas</span>
              </div>
              <p className="text-[11px] text-[#76777d] mt-1 leading-snug">
                Conflito de lateralidade e checagem de alergia validados com paciente.
              </p>
            </div>
            <div className="w-full bg-[#eff4ff] h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-[#006a61] h-full w-full rounded-full"></div>
            </div>
          </div>
        </div>

        {/* 3. Main Split: Documento Final Formatado (Left 7 cols) & Trilha Forense (Right 5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: Format Clinical Document */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="bg-[#ffffff] rounded-2xl p-6 sm:p-8 border border-[#e5eeff] shadow-xs flex flex-col gap-5">
              {/* Header preview */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#e5eeff]">
                <div>
                  <h3 className="text-[18px] font-bold text-[#0b1c30]">Prontuário Médico de Atendimento de Urgência</h3>
                  <p className="text-[12px] text-[#76777d]">Hospital Santa Casa de Misericórdia • Serviço de Emergência Adulto</p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-mono text-[#006a61] font-bold block">PROTOCOLO #FS-2024-8841</span>
                  <span className="text-[11px] text-[#76777d]">Data: 24/10/2024 • 14:48</span>
                </div>
              </div>

              {/* Patient Banner */}
              <div className="p-3.5 bg-[#eff4ff]/50 rounded-xl border border-[#d3e4fe] flex flex-col gap-1 text-[12px]">
                <div className="flex justify-between">
                  <span><strong>Paciente:</strong> {currentPatient.name}</span>
                  <span className="font-mono"><strong>Prontuário:</strong> #{currentPatient.recordNumber}</span>
                </div>
                <div className="flex justify-between text-[#45464d]">
                  <span>Idade: {currentPatient.age} anos • Sexo: Masculino</span>
                  <span>Classificação: {currentPatient.triageLabel}</span>
                </div>
              </div>

              {/* SOAP Formatted Sections */}
              <div className="flex flex-col gap-4 text-[12px]">
                <div>
                  <h4 className="font-bold text-[#0b1c30] text-[13px] uppercase tracking-wider mb-1">
                    1. Anamnese & História Clínica (Subjetivo)
                  </h4>
                  <p className="text-[#45464d] leading-relaxed bg-[#f8f9ff] p-3 rounded-lg border border-[#e5eeff]">
                    Paciente admitido com queixa de dor súbita em tornozelo direito após entorse por mecanismo de inversão
                    forçada durante atividade física esportiva ontem à noite. Refere estalo sonoro imediato, seguido de edema
                    e impotência funcional para deambulação. Nega sintomas prévios. Nega alergias medicamentosas conhecidas.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-[#0b1c30] text-[13px] uppercase tracking-wider mb-1">
                    2. Exame Físico Dirigido (Objetivo)
                  </h4>
                  <p className="text-[#45464d] leading-relaxed bg-[#f8f9ff] p-3 rounded-lg border border-[#e5eeff]">
                    Bom estado geral, orientado e colaborativo. Sinais vitais estáveis: PA 128x84 mmHg, FC 82 bpm, SpO2 98%
                    em ar ambiente, afebril. Edema perimaleolar lateral direito moderado. Dor intensa à palpação do maléolo
                    lateral e ligamento talofibular anterior. Critérios de Ottawa presentes para indicação radiológica.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-[#0b1c30] text-[13px] uppercase tracking-wider mb-1">
                    3. Diagnóstico Clínico (Avaliação)
                  </h4>
                  <div className="bg-[#f8f9ff] p-3 rounded-lg border border-[#e5eeff] flex flex-col gap-1">
                    <span className="font-semibold text-[#0b1c30]">
                      • Entorse e distensão do tornozelo (CID-10: S93.4)
                    </span>
                    <span className="text-[#76777d]">
                      • Investigação para fratura do maléolo lateral (CID-10: S82.6)
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-[#0b1c30] text-[13px] uppercase tracking-wider mb-1">
                    4. Conduta & Prescrição Médica (Plano)
                  </h4>
                  <div className="bg-[#f8f9ff] p-3 rounded-lg border border-[#e5eeff] flex flex-col gap-1.5 leading-relaxed">
                    <div>1. <strong>Raio-X de Tornozelo Direito (AP e Perfil)</strong> - Guia TUSS 4.08.04.05-4 emitida</div>
                    <div>2. <strong>Dipirona Sódica 1000mg VO</strong> dose única administrada no posto</div>
                    <div>3. <strong>Imobilização Provisória:</strong> Tala gessada suropodálica mantida</div>
                    <div>4. <strong>Cuidados:</strong> Crioterapia 20 min 3x/dia, repouso relativo, membro elevado</div>
                    <div>5. <strong>Encaminhamento:</strong> Parecer da Ortopedia e Traumatologia após radiografia</div>
                  </div>
                </div>
              </div>

              {/* Physician Signature Stamp */}
              <div className="mt-4 pt-4 border-t border-[#e5eeff] flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#eff4ff]/40 p-4 rounded-xl border border-[#d3e4fe]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#006a61] text-white flex items-center justify-center font-bold">
                    RG
                  </div>
                  <div>
                    <span className="font-bold text-[#0b1c30] block text-[13px]">Dr. Renato Guimarães</span>
                    <span className="text-[11px] text-[#76777d]">Médico Plantonista • CRM/SP 148.920</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-[#006a61] font-bold block">
                    CHANCELA ICP-BRASIL A3
                  </span>
                  <span className="text-[10px] font-mono text-[#76777d]">
                    SHA-256: d81a9f029e71b...7710bc
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Trilha Forense / Logs de Auditoria */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#e5eeff] shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#e5eeff]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006a61] text-[20px]">policy</span>
                  <h3 className="font-bold text-[#0b1c30] text-[14px]">Trilha Forense Imutável</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#86f2e4]/30 text-[#006f66] font-mono text-[10px] font-bold">
                  {AUDIT_TRAIL_DATA.length} Eventos
                </span>
              </div>

              {/* Timeline list */}
              <div className="flex flex-col gap-3 max-h-[580px] overflow-y-auto pr-1">
                {AUDIT_TRAIL_DATA.map((event, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#eff4ff]/30 border border-[#e5eeff] flex flex-col gap-1.5 text-[12px] relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-[#006a61] font-bold">
                        {event.timestamp}
                      </span>
                      {event.badge && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#eff4ff] text-[#45464d] border border-[#d3e4fe]">
                          {event.badge}
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-[#0b1c30] text-[12px] leading-snug">{event.title}</h4>
                    <p className="text-[11px] text-[#45464d] leading-snug">{event.description}</p>

                    <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-[#76777d]">
                      <span>{event.actor}</span>
                      <span className="text-[#006a61] font-semibold">{event.hash}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* End of audit chain indicator */}
              <div className="p-3 bg-[#f8f9ff] rounded-xl border border-[#e5eeff] flex items-center justify-between text-[11px]">
                <span className="text-[#76777d]">Integridade do Bloco:</span>
                <span className="font-mono text-[#006a61] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
                  Blockchain / Merkle Tree Válida
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar - Passo 6 (Resumo & Auditoria) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#ffffff]/95 backdrop-blur-md border-t border-[#e5eeff] px-4 lg:px-8 py-3 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Left info */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#86f2e4]/40 text-[#006f66] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">verified</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#0b1c30] text-[13px]">
                  Prontuário Homologado • {currentPatient.name}
                </span>
                <span className="px-2 py-0.2 rounded font-mono text-[10px] font-bold bg-[#10b981]/10 text-[#065f46]">
                  ICP-BRASIL CONCLUÍDO
                </span>
              </div>
              <p className="text-[11px] text-[#76777d]">
                Assinatura digital e hash criptográfico transmitidos com sucesso ao sistema hospitalar.
              </p>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end flex-wrap">
            <button
              onClick={onOpenQrModal}
              className="px-3.5 py-2 rounded-lg bg-[#ffffff] hover:bg-[#eff4ff] text-[#006a61] border border-[#d3e4fe] transition-colors font-semibold text-[12px] flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-[17px]">qr_code_2</span>
              <span>QR Code de Validação</span>
            </button>

            <button
              onClick={handleSyncPEP}
              className="px-3.5 py-2 rounded-lg bg-[#eff4ff] hover:bg-[#e5eeff] text-[#006a61] border border-[#d3e4fe] transition-colors font-semibold text-[12px] flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">cloud_sync</span>
              <span>Sincronizar PEP / TASY</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-lg bg-[#eff4ff] hover:bg-[#e5eeff] text-[#006a61] border border-[#d3e4fe] transition-colors font-semibold text-[12px] flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">print</span>
              <span>Exportar Laudo Forense PDF</span>
            </button>

            {/* Main conclusion button on the bottom right as requested */}
            <button
              onClick={() => onNavigate('fila-do-plantao')}
              className="px-5 py-2.5 bg-[#006a61] hover:bg-[#005049] text-white font-bold text-[12px] rounded-lg transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>Finalizar e Voltar para a Fila</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
