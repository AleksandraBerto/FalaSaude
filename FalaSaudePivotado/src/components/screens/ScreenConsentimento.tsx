import React, { useState } from 'react';
import { Patient, ScreenId } from '../../types/clinical';

interface ScreenConsentimentoProps {
  currentPatient: Patient;
  onNavigate: (screenId: ScreenId) => void;
  onSelectCase?: (caseKey: 'carlos' | 'ana' | 'jose' | 'maria') => void;
}

export const ScreenConsentimento: React.FC<ScreenConsentimentoProps> = ({
  currentPatient,
  onNavigate,
}) => {
  const isEmergency = currentPatient.caseKey === 'maria' || currentPatient.status === 'critico_stat';
  const [consentStatus, setConsentStatus] = useState<'pending' | 'accepted' | 'declined'>('accepted');

  const patientInitials = currentPatient.name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <main className="w-full pt-24 pb-32 bg-[#f8f9ff] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col gap-6">
        {/* Top bar with screen indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#e5eeff]">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-[#86f2e4]/30 text-[#006f66] font-mono text-[11px] font-bold">
                TELA 2 DE 6
              </span>
              <h1 className="text-[22px] font-bold text-[#0b1c30]">Consentimento & Regra de Emergência</h1>
            </div>
            <p className="text-[13px] text-[#45464d] mt-0.5">
              Salvaguardas ético-legais CFM 2.314/22 e LGPD para captação acústica em ambiente de urgência
            </p>
          </div>

          {/* Clean indicator without case switcher */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#eff4ff] text-[#006a61] border border-[#d3e4fe] rounded-lg text-[12px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#006a61]"></span>
              {currentPatient.name} ({currentPatient.triageLabel})
            </span>
          </div>
        </div>

        {/* CASE: CONSENTIMENTO LÚCIDO (Carlos, Ana, José, etc.) */}
        {!isEmergency && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            {/* Patient Header Banner */}
            <div className="w-full bg-[#ffffff] rounded-2xl p-5 border border-[#e5eeff] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#eff4ff] text-[#006a61] flex items-center justify-center font-bold text-[18px]">
                  {patientInitials}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[17px] font-bold text-[#0b1c30]">{currentPatient.name}</span>
                    <span className="text-[12px] text-[#76777d]">{currentPatient.age} anos</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#16a34a]/10 text-[#16a34a] font-mono text-[11px] font-semibold">
                      {currentPatient.triageLabel} • {currentPatient.room}
                    </span>
                  </div>
                  <span className="text-[12px] text-[#45464d] mt-0.5">
                    <strong>Queixa:</strong> {currentPatient.chiefComplaint} • Lúcido e orientado • Sem rebaixamento
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start md:self-auto">
                <span className="text-[11px] font-mono text-[#006a61] bg-[#eff4ff] px-2.5 py-1 rounded-lg border border-[#d3e4fe] flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-[14px]">mic</span>
                  Canal Acústico Aguardando
                </span>
              </div>
            </div>

            {/* Notification Banner based on state */}
            {consentStatus === 'accepted' && (
              <div className="p-4 rounded-xl flex items-center gap-3 bg-[#10b981]/10 text-[#065f46] border border-[#10b981]/20">
                <span className="material-symbols-outlined text-[24px] text-[#10b981]">check_circle</span>
                <div className="text-[13px] leading-snug">
                  <strong>Consentimento Verbal Registrado com Sucesso:</strong> Microfone ativado em modo assistido
                  passivo. Iniciando transcrição ambiente e escuta clínica v2.4 em conformidade com o Art. 7º da LGPD.
                </div>
              </div>
            )}

            {consentStatus === 'declined' && (
              <div className="p-4 rounded-xl flex items-center gap-3 bg-[#eff4ff] text-[#45464d] border border-[#e5eeff]">
                <span className="material-symbols-outlined text-[24px] text-[#ba1a1a]">cancel</span>
                <div className="text-[13px] leading-snug">
                  <strong>Recusa de Escuta Ativa Registrada:</strong> Assistente IA desabilitado para esta consulta a pedido do
                  paciente. Redirecionando para documentação médica manual padrão sem gravação.
                </div>
              </div>
            )}

            {/* Main Consent Card */}
            <div className="bg-[#ffffff] rounded-2xl p-6 sm:p-8 border border-[#e5eeff] shadow-xs flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006a61] text-[22px]">record_voice_over</span>
                  <h3 className="text-[18px] font-bold text-[#0b1c30]">
                    Termo de Consentimento Verbal para Uso de Escuta Clínica Assistida
                  </h3>
                </div>
                <p className="text-[13px] text-[#45464d] leading-relaxed">
                  Antes de iniciar a captação do diálogo, o médico assistente deve ler ou informar os 3 pilares
                  de proteção de dados e obter a anuência explícita do paciente:
                </p>
              </div>

              {/* 3 Pillars of Security & LGPD */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#eff4ff]/60 border border-[#e5eeff] flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#006a61] text-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">lock</span>
                  </div>
                  <h4 className="font-bold text-[#0b1c30] text-[13px]">1. LGPD & Sigilo Profissional</h4>
                  <p className="text-[12px] text-[#45464d] leading-relaxed">
                    Os dados falados são processados exclusivamente para fins de documentação médica no prontuário, sob sigilo médico CFM.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#eff4ff]/60 border border-[#e5eeff] flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#006a61] text-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">graphic_eq</span>
                  </div>
                  <h4 className="font-bold text-[#0b1c30] text-[13px]">2. Biometria Vocal Criptografada</h4>
                  <p className="text-[12px] text-[#45464d] leading-relaxed">
                    O áudio é transmitido em canal seguro TLS 1.3 com tokenização e sem cruzamento com bancos de voz públicos.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#eff4ff]/60 border border-[#e5eeff] flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#006a61] text-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">auto_delete</span>
                  </div>
                  <h4 className="font-bold text-[#0b1c30] text-[13px]">3. Expurgo Automático em 30 Dias</h4>
                  <p className="text-[12px] text-[#45464d] leading-relaxed">
                    O arquivo de voz bruto é deletado permanentemente após 30 dias de guarda temporária, restando apenas o texto assinado.
                  </p>
                </div>
              </div>

              {/* Simulation test triggers */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#e5eeff]">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-[#76777d]">Simular Resposta:</span>
                  <button
                    onClick={() => setConsentStatus('accepted')}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      consentStatus === 'accepted'
                        ? 'bg-[#006a61] text-white shadow-xs'
                        : 'bg-[#eff4ff] text-[#006a61] hover:bg-[#e5eeff]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]">check</span>
                    Consentimento Aceito
                  </button>
                  <button
                    onClick={() => setConsentStatus('declined')}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                      consentStatus === 'declined'
                        ? 'bg-[#ba1a1a] text-white shadow-xs'
                        : 'text-[#76777d] hover:text-[#ba1a1a] bg-[#eff4ff]/60'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]">cancel</span>
                    Recusa Verbal
                  </button>
                </div>
                <span className="text-[11px] text-[#76777d]">
                  {consentStatus === 'accepted'
                    ? 'Pronto para prosseguir com captação acústica v2.4'
                    : 'Modo manual obrigatório devido à recusa verbal'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* CASE 2: EMERGÊNCIA CRÍTICA / STAT (Maria da Conceição Silva ou Pacientes Vermelhos) */}
        {isEmergency && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            {/* Patient Header Banner */}
            <div className="w-full bg-[#ffffff] rounded-2xl p-5 border border-[#ba1a1a]/30 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#ba1a1a] text-white flex items-center justify-center font-bold text-[18px]">
                  MS
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[17px] font-bold text-[#0b1c30]">Maria da Conceição Silva</span>
                    <span className="text-[12px] text-[#76777d]">71 anos (03/02/1954)</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#ba1a1a] text-white font-mono text-[11px] font-bold">
                      SALA VERMELHA #01
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-[#ba1a1a] font-semibold mt-0.5 flex-wrap">
                    <span>Dor torácica opressiva, sudorese e dispneia (Suspeita IAM c/ Supra)</span>
                    <span>•</span>
                    <span>PA 82x48</span>
                    <span>•</span>
                    <span>FC 132</span>
                    <span>•</span>
                    <span>SpO2 86%</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start md:self-auto">
                <div className="flex items-center gap-1.5 bg-[#ba1a1a] text-white px-3 py-1.5 rounded-full font-bold text-[11px]">
                  <span className="material-symbols-outlined text-[16px]">emergency</span>
                  Manchester Vermelho • Emergência Imediata (0 min)
                </div>
              </div>
            </div>

            {/* Emergency Directive Card */}
            <div className="bg-[#ffffff] rounded-2xl p-6 sm:p-8 border border-[#ba1a1a]/20 shadow-xs flex flex-col gap-6">
              {/* Alert Header */}
              <div className="p-4 bg-[#ffdad6]/60 border border-[#ba1a1a]/30 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#ba1a1a] text-[32px] shrink-0">crisis_alert</span>
                  <div className="flex flex-col">
                    <span className="font-bold uppercase tracking-wide text-[#ba1a1a] text-[13px]">
                      Protocolo de Emergência Crítica — Escuta IA Suspensa
                    </span>
                    <span className="text-[12px] text-[#45464d]">
                      Diretiva de Segurança Clínica: Protocolo de Reanimação e Código IAM (CFM Res. 2.314/22)
                    </span>
                  </div>
                </div>
                <div className="px-3 py-1 bg-white rounded-full font-mono text-[11px] text-[#ba1a1a] border border-[#ba1a1a]/30 uppercase font-bold shrink-0 self-start md:self-center">
                  Trava Mandatória Nível 1
                </div>
              </div>

              {/* Technical description */}
              <div className="p-5 bg-[#eff4ff]/40 border border-[#e5eeff] rounded-xl flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-xs text-[#ba1a1a] border border-[#e5eeff]">
                    <span className="material-symbols-outlined text-[22px]">mic_off</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="font-bold text-[#0b1c30] text-[14px]">
                      Captação Acústica Desativada em Conformidade com Diretiva Técnica
                    </h3>
                    <p className="text-[13px] text-[#0b1c30] leading-relaxed">
                      Paciente <strong>Maria da Conceição Silva, 71 anos</strong> classificada em Risco Vermelho.
                      A escuta ativa permanece <strong>automaticamente DESATIVADA</strong> para assegurar zero
                      interferência, latência ou riscos legais em intervenções críticas de suporte de vida.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 bg-white rounded-lg border border-[#e5eeff] flex flex-col gap-1">
                    <span className="text-[12px] font-bold text-[#ba1a1a] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">timer_off</span> Zero Latência
                    </span>
                    <span className="text-[11px] text-[#45464d] leading-snug">
                      Foco exclusivo em manobras de estabilização hemodinâmica.
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-[#e5eeff] flex flex-col gap-1">
                    <span className="text-[12px] font-bold text-[#ba1a1a] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">person_shield</span> Paciente Crítico
                    </span>
                    <span className="text-[11px] text-[#45464d] leading-snug">
                      Consentimento verbal dispensado na fase aguda de reanimação.
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-[#e5eeff] flex flex-col gap-1">
                    <span className="text-[12px] font-bold text-[#ba1a1a] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">assignment_turned_in</span> Registro Direto
                    </span>
                    <span className="text-[11px] text-[#45464d] leading-snug">
                      Prontuário manual com formulário de emergência STAT ativo.
                    </span>
                  </div>
                </div>
              </div>

              {/* Hardware note */}
              <div className="flex items-center gap-1.5 text-[#76777d] font-mono text-[11px] pt-2">
                <span className="material-symbols-outlined text-[15px] text-[#ba1a1a]">lock</span>
                <span>Microfone fisicamente desenergizado no barramento USB (#SYS-RED-EMERG)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Action Bar - Passo 2 */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#ffffff]/95 backdrop-blur-md border-t border-[#e5eeff] px-4 lg:px-8 py-3 shadow-lg">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Left Info */}
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                isEmergency
                  ? 'bg-[#ba1a1a] text-white'
                  : consentStatus === 'accepted'
                  ? 'bg-[#86f2e4]/40 text-[#006f66]'
                  : 'bg-[#fffbeb] text-[#ba1a1a]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isEmergency ? 'crisis_alert' : consentStatus === 'accepted' ? 'verified_user' : 'cancel'}
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#0b1c30] text-[13px]">
                  {isEmergency
                    ? 'Protocolo STAT Ativo: Maria da Conceição Silva'
                    : `${currentPatient.name} (${currentPatient.triageLabel})`}
                </span>
                <span
                  className={`px-2 py-0.2 rounded font-mono text-[10px] font-bold ${
                    isEmergency
                      ? 'bg-[#ba1a1a] text-white'
                      : consentStatus === 'accepted'
                      ? 'bg-[#10b981]/10 text-[#065f46]'
                      : 'bg-[#ffdad6] text-[#ba1a1a]'
                  }`}
                >
                  {isEmergency
                    ? 'SALA VERMELHA'
                    : consentStatus === 'accepted'
                    ? 'CONSENTIMENTO VERBAL ACEITO'
                    : 'RECUSA REGISTRADA'}
                </span>
              </div>
              <p className="text-[11px] text-[#76777d]">
                {isEmergency
                  ? 'Escuta de IA suspensa para segurança do paciente crítico. Prontuário em modo emergência manual.'
                  : consentStatus === 'accepted'
                  ? 'Salvaguarda LGPD & CFM 2.314/22 atendida. Canal acústico pronto para escuta passiva.'
                  : 'O paciente recusou captação. O atendimento deve ser conduzido com digitação manual.'}
              </p>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={() => onNavigate('fila-do-plantao')}
              className="px-4 py-2 bg-[#eff4ff] hover:bg-[#e5eeff] text-[#006a61] border border-[#d3e4fe] font-semibold text-[12px] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Voltar à Fila</span>
            </button>

            {isEmergency ? (
              <button
                onClick={() => {
                  alert('Prontuário Crítico Manual (STAT) aberto com código IAM acionado!');
                }}
                className="px-5 py-2 bg-[#ba1a1a] hover:bg-[#991b1b] text-white font-bold text-[12px] rounded-lg transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">note_add</span>
                <span>Abrir Prontuário Crítico Manual (STAT)</span>
              </button>
            ) : (
              <button
                onClick={() => onNavigate('atendimento')}
                disabled={consentStatus === 'declined'}
                className={`px-5 py-2 font-bold text-[12px] rounded-lg transition-all flex items-center gap-1.5 shadow-sm ${
                  consentStatus === 'declined'
                    ? 'bg-[#c6c6cd] text-white cursor-not-allowed'
                    : 'bg-[#006a61] hover:bg-[#005049] text-white cursor-pointer'
                }`}
              >
                <span>Avançar para Consulta com Escuta</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
