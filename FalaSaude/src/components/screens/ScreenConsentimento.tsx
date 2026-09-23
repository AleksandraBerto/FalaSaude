import React, { useState } from 'react';
import { Patient, ScreenId } from '../../types/clinical';

interface ScreenConsentimentoProps {
  currentPatient: Patient;
  onNavigate: (screenId: ScreenId) => void;
  onSelectCase: (caseKey: 'carlos' | 'ana' | 'jose' | 'maria') => void;
}

export const ScreenConsentimento: React.FC<ScreenConsentimentoProps> = ({
  currentPatient,
  onNavigate,
  onSelectCase,
}) => {
  const [activeCase, setActiveCase] = useState<'carlos' | 'maria'>(
    currentPatient.caseKey === 'maria' ? 'maria' : 'carlos'
  );
  const [consentStatus, setConsentStatus] = useState<'pending' | 'accepted' | 'declined'>('accepted');

  const handleCaseChange = (c: 'carlos' | 'maria') => {
    setActiveCase(c);
    onSelectCase(c);
    if (c === 'carlos') {
      setConsentStatus('accepted');
    }
  };

  return (
    <main className="w-full pt-24 pb-16 bg-[#f8f9ff] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col gap-6">
        {/* Top bar with screen indicator and Case switcher */}
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

          {/* Interactive Case Toggle */}
          <div className="flex items-center bg-[#eff4ff] p-1 rounded-xl border border-[#e5eeff] self-start sm:self-auto">
            <button
              onClick={() => handleCaseChange('carlos')}
              className={`px-3.5 py-1.5 rounded-lg text-[12px] font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeCase === 'carlos'
                  ? 'bg-[#ffffff] text-[#006a61] shadow-xs'
                  : 'text-[#45464d] hover:text-[#0b1c30]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              Caso 1: Consentimento Padrão (Carlos)
            </button>
            <button
              onClick={() => handleCaseChange('maria')}
              className={`px-3.5 py-1.5 rounded-lg text-[12px] font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeCase === 'maria'
                  ? 'bg-[#ba1a1a] text-[#ffffff] shadow-xs'
                  : 'text-[#45464d] hover:text-[#0b1c30]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">emergency</span>
              Caso 2: Emergência Crítica / STAT (Maria)
            </button>
          </div>
        </div>

        {/* CASE 1: CARLOS EDUARDO MENDES (Consentimento Lúcido) */}
        {activeCase === 'carlos' && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            {/* Patient Header Banner */}
            <div className="w-full bg-[#ffffff] rounded-2xl p-5 border border-[#e5eeff] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#eff4ff] text-[#006a61] flex items-center justify-center font-bold text-[18px]">
                  CM
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[17px] font-bold text-[#0b1c30]">Carlos Eduardo Mendes</span>
                    <span className="text-[12px] text-[#76777d]">34 anos (22/08/1990)</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#16a34a]/10 text-[#16a34a] font-mono text-[11px] font-semibold">
                      Manchester Verde • Box 04
                    </span>
                  </div>
                  <span className="text-[12px] text-[#45464d] mt-0.5">
                    <strong>Queixa:</strong> Entorse de tornozelo direito • PA 128x84 • FC 82 bpm • Lúcido e orientado
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
                  <button
                    onClick={() => setConsentStatus('accepted')}
                    className="px-3.5 py-2 bg-[#eff4ff] hover:bg-[#e5eeff] text-[#006a61] rounded-lg text-[12px] font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    Simular Consentimento Aceito
                  </button>
                  <button
                    onClick={() => setConsentStatus('declined')}
                    className="px-3 py-2 text-[#76777d] hover:text-[#ba1a1a] rounded-lg text-[12px] font-medium transition-colors cursor-pointer"
                  >
                    Simular Recusa
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onNavigate('fila-do-plantao')}
                    className="px-4 py-2 text-[#45464d] hover:text-[#0b1c30] text-[12px] font-medium transition-colors cursor-pointer"
                  >
                    Voltar à Fila
                  </button>
                  <button
                    onClick={() => onNavigate('atendimento')}
                    disabled={consentStatus === 'declined'}
                    className={`px-5 py-2.5 rounded-lg text-[12px] font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer ${
                      consentStatus === 'declined'
                        ? 'bg-[#c6c6cd] text-[#ffffff] cursor-not-allowed'
                        : 'bg-[#006a61] hover:bg-[#005049] text-[#ffffff]'
                    }`}
                  >
                    <span>Avançar para Consulta Assistida</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CASE 2: MARIA DA CONCEIÇÃO SILVA (Emergência Crítica / STAT) */}
        {activeCase === 'maria' && (
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

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-1.5 text-[#76777d] font-mono text-[11px]">
                  <span className="material-symbols-outlined text-[15px] text-[#ba1a1a]">lock</span>
                  <span>Microfone fisicamente desenergizado no barramento USB (#SYS-RED-EMERG)</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleCaseChange('carlos')}
                    className="px-4 py-2 bg-[#eff4ff] hover:bg-[#e5eeff] text-[#0b1c30] rounded-lg text-[12px] font-semibold border border-[#d3e4fe] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                    Voltar ao Caso 1 (Carlos)
                  </button>
                  <button
                    onClick={() => {
                      alert('Prontuário Crítico Manual (STAT) aberto com código IAM acionado!');
                    }}
                    className="px-5 py-2.5 bg-[#ba1a1a] hover:bg-[#991b1b] text-white rounded-lg text-[12px] font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">note_add</span>
                    Abrir Prontuário Crítico Manual (STAT)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
