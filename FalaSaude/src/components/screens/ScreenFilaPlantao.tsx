import React, { useState } from 'react';
import { Patient, ScreenId, TriageCategory } from '../../types/clinical';

interface ScreenFilaPlantaoProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient, targetScreen?: ScreenId) => void;
  onCallPatient: (patient: Patient) => void;
  onNavigate: (screenId: ScreenId) => void;
}

export const ScreenFilaPlantao: React.FC<ScreenFilaPlantaoProps> = ({
  patients,
  onSelectPatient,
  onCallPatient,
  onNavigate,
}) => {
  const [filterTriage, setFilterTriage] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPatients = patients.filter((p) => {
    const matchesFilter = filterTriage === 'todos' || p.triage === filterTriage;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.chiefComplaint.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.recordNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getTriageBadge = (triage: TriageCategory) => {
    switch (triage) {
      case 'vermelho':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ba1a1a]/10 text-[#ba1a1a] text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a]"></span>
            Vermelho (Emergência)
          </span>
        );
      case 'laranja':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ea580c]/10 text-[#ea580c] text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c]"></span>
            Laranja (Muito Urgente)
          </span>
        );
      case 'amarelo':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ca8a04]/10 text-[#ca8a04] text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ca8a04]"></span>
            Amarelo (Urgente)
          </span>
        );
      case 'verde':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#16a34a]/10 text-[#16a34a] text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]"></span>
            Verde (Pouco Urgente)
          </span>
        );
      case 'azul':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#2563eb]/10 text-[#2563eb] text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb]"></span>
            Azul (Não Urgente)
          </span>
        );
    }
  };

  const getStatusBadge = (status: Patient['status']) => {
    switch (status) {
      case 'critico_stat':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] text-[#ba1a1a] font-bold">
            <span className="material-symbols-outlined text-[14px]">crisis_alert</span>
            Trava STAT Ativa
          </span>
        );
      case 'revisao_pendente':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] text-[#92400e] font-semibold">
            <span className="material-symbols-outlined text-[14px]">error_outline</span>
            Revisão Pendente
          </span>
        );
      case 'rascunho_pronto':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] text-[#006a61] font-semibold">
            <span className="material-symbols-outlined text-[14px]">task_alt</span>
            Rascunho Pronto
          </span>
        );
      case 'escuta':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] text-[#006a61] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#006a61] animate-pulse"></span>
            Escuta em Curso
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] text-[#76777d]">
            <span className="material-symbols-outlined text-[14px]">schedule</span>
            Em Espera
          </span>
        );
    }
  };

  return (
    <main className="w-full pt-24 pb-16 bg-[#f8f9ff] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col gap-6">
        {/* Top Banner and Quick Metrics */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-[#86f2e4]/30 text-[#006f66] font-mono text-[11px] font-bold">
                TELA 1 DE 6
              </span>
              <h1 className="text-[22px] font-bold text-[#0b1c30]">Fila do Plantão de Emergência</h1>
            </div>
            <p className="text-[13px] text-[#45464d] mt-0.5">
              Classificação Manchester em tempo real • Protocolo de Escuta IA Passiva Homologado CFM 2.314/2022
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('consentimento')}
              className="px-3.5 py-2 bg-[#ffffff] hover:bg-[#eff4ff] text-[#006a61] border border-[#d3e4fe] rounded-lg text-[12px] font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              Checar Termos de Consentimento
            </button>
            <button
              onClick={() => {
                const p = patients.find((x) => x.caseKey === 'carlos') || patients[0];
                onSelectPatient(p, 'atendimento');
              }}
              className="px-4 py-2 bg-[#006a61] hover:bg-[#005049] text-white rounded-lg text-[12px] font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">mic</span>
              Iniciar Atendimento com Escuta
            </button>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="bg-[#ffffff] p-4 rounded-xl border border-[#e5eeff] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#76777d]">Total em Espera</span>
              <div className="w-7 h-7 rounded-lg bg-[#eff4ff] text-[#006a61] flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px]">group</span>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-[24px] font-bold text-[#0b1c30]">14</span>
              <span className="text-[11px] text-[#76777d] ml-1.5">pacientes triados</span>
            </div>
            <div className="w-full bg-[#eff4ff] h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div className="bg-[#006a61] h-full w-[65%] rounded-full"></div>
            </div>
          </div>

          <div className="bg-[#ffffff] p-4 rounded-xl border border-[#e5eeff] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#76777d]">Tempo Porta-Médico</span>
              <div className="w-7 h-7 rounded-lg bg-[#eff4ff] text-[#006a61] flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px]">timer</span>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-[24px] font-bold text-[#0b1c30]">11 min</span>
              <span className="text-[11px] text-[#16a34a] font-semibold ml-1.5">↓ 42% c/ IA</span>
            </div>
            <div className="w-full bg-[#eff4ff] h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div className="bg-[#16a34a] h-full w-[80%] rounded-full"></div>
            </div>
          </div>

          <div className="bg-[#ffffff] p-4 rounded-xl border border-[#e5eeff] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#76777d]">Consultas c/ Escuta</span>
              <div className="w-7 h-7 rounded-lg bg-[#eff4ff] text-[#006a61] flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px]">graphic_eq</span>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-[24px] font-bold text-[#0b1c30]">28</span>
              <span className="text-[11px] text-[#76777d] ml-1.5">concluídas hoje</span>
            </div>
            <div className="w-full bg-[#eff4ff] h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div className="bg-[#006a61] h-full w-[92%] rounded-full"></div>
            </div>
          </div>

          <div className="bg-[#ffffff] p-4 rounded-xl border border-[#e5eeff] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#76777d]">Salvaguardas CFM</span>
              <div className="w-7 h-7 rounded-lg bg-[#86f2e4]/30 text-[#006f66] flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px]">verified</span>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-[24px] font-bold text-[#006a61]">100%</span>
              <span className="text-[11px] text-[#006a61] font-semibold ml-1.5">Zero alucinação</span>
            </div>
            <div className="w-full bg-[#eff4ff] h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div className="bg-[#006a61] h-full w-full rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-[#ffffff] p-3 rounded-xl border border-[#e5eeff] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Triage Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <span className="text-[11px] font-mono text-[#76777d] mr-1 hidden sm:inline">Filtrar:</span>
            {[
              { id: 'todos', label: 'Todos (14)' },
              { id: 'vermelho', label: 'Vermelho (1)' },
              { id: 'laranja', label: 'Laranja (2)' },
              { id: 'amarelo', label: 'Amarelo (4)' },
              { id: 'verde', label: 'Verde (5)' },
              { id: 'azul', label: 'Azul (2)' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterTriage(f.id)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  filterTriage === f.id
                    ? 'bg-[#006a61] text-white shadow-xs'
                    : 'bg-[#eff4ff] text-[#45464d] hover:bg-[#e5eeff]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="w-full md:w-72 relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-[#76777d]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome, queixa ou prontuário..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#eff4ff] text-[#0b1c30] text-[12px] border border-[#e5eeff] focus:outline-none focus:ring-1 focus:ring-[#006a61]"
            />
          </div>
        </div>

        {/* Patient Table */}
        <div className="bg-[#ffffff] rounded-xl border border-[#e5eeff] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#eff4ff]/60 border-b border-[#e5eeff] text-[11px] font-mono uppercase text-[#76777d]">
                  <th className="py-3 px-4">Risco Manchester</th>
                  <th className="py-3 px-4">Paciente & Prontuário</th>
                  <th className="py-3 px-4">Queixa & Triagem</th>
                  <th className="py-3 px-4">Status da Escuta</th>
                  <th className="py-3 px-4 text-right">Ação Clínica</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5eeff]">
                {filteredPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="hover:bg-[#eff4ff]/30 transition-colors group cursor-pointer"
                    onClick={() => onSelectPatient(patient)}
                  >
                    {/* Triage category */}
                    <td className="py-3.5 px-4 align-middle">
                      <div className="flex flex-col gap-1">
                        {getTriageBadge(patient.triage)}
                        <span className="text-[10px] text-[#76777d] font-mono pl-1">
                          Espera: <strong>{patient.waitTime}</strong>
                        </span>
                      </div>
                    </td>

                    {/* Patient info */}
                    <td className="py-3.5 px-4 align-middle">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#0b1c30] text-[14px]">{patient.name}</span>
                          <span className="text-[12px] text-[#76777d]">{patient.age} anos</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-mono text-[#76777d]">
                          <span>Prontuário: #{patient.recordNumber}</span>
                          <span>•</span>
                          <span className="text-[#006a61]">{patient.room}</span>
                        </div>
                      </div>
                    </td>

                    {/* Complaint & Vitals */}
                    <td className="py-3.5 px-4 align-middle max-w-xs">
                      <p className="text-[13px] text-[#0b1c30] font-medium leading-snug line-clamp-1">
                        {patient.chiefComplaint}
                      </p>
                      <span className="text-[11px] font-mono text-[#76777d] block mt-0.5">
                        {patient.vitalsSummary}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                      {getStatusBadge(patient.status)}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 align-middle text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onCallPatient(patient)}
                          className="px-2.5 py-1 rounded-full border border-[#e5eeff] hover:bg-[#eff4ff] text-[#45464d] text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                          title="Chamar paciente no painel sonoro"
                        >
                          <span className="material-symbols-outlined text-[14px]">notifications</span>
                          Chamar
                        </button>

                        {patient.status === 'rascunho_pronto' && (
                          <button
                            onClick={() => onSelectPatient(patient, 'rascunho')}
                            className="px-3 py-1 rounded-full bg-[#006a61] hover:bg-[#005049] text-white text-[11px] font-bold shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <span>Revisar Rascunho</span>
                            <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                          </button>
                        )}

                        {patient.status === 'revisao_pendente' && (
                          <button
                            onClick={() => onSelectPatient(patient, 'rascunho')}
                            className="px-3 py-1 rounded-full bg-[#ea580c] hover:bg-[#c2410c] text-white text-[11px] font-bold shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <span>Resolver Pendências</span>
                            <span className="material-symbols-outlined text-[13px]">error</span>
                          </button>
                        )}

                        {patient.status === 'critico_stat' && (
                          <button
                            onClick={() => onSelectPatient(patient, 'consentimento')}
                            className="px-3 py-1 rounded-full bg-[#ba1a1a] hover:bg-[#991b1b] text-white text-[11px] font-bold shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <span>Ver Trava STAT</span>
                            <span className="material-symbols-outlined text-[13px]">crisis_alert</span>
                          </button>
                        )}

                        {patient.status === 'escuta' && (
                          <button
                            onClick={() => onSelectPatient(patient, 'atendimento')}
                            className="px-3 py-1 rounded-full bg-[#006a61] hover:bg-[#005049] text-white text-[11px] font-bold shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <span>Retomar Escuta</span>
                            <span className="material-symbols-outlined text-[13px]">graphic_eq</span>
                          </button>
                        )}

                        {patient.status === 'espera' && (
                          <button
                            onClick={() => {
                              if (patient.caseKey === 'jose') {
                                onSelectPatient(patient, 'excecao');
                              } else {
                                onSelectPatient(patient, 'consentimento');
                              }
                            }}
                            className="px-3 py-1 rounded-full bg-[#0b1c30] hover:bg-[#131b2e] text-white text-[11px] font-bold shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <span>Iniciar Atendimento</span>
                            <span className="material-symbols-outlined text-[13px]">stethoscope</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table pagination & footer */}
          <div className="py-3 px-4 bg-[#eff4ff]/30 border-t border-[#e5eeff] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#76777d]">
            <span>Exibindo {filteredPatients.length} de {patients.length} pacientes na fila prioritária</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[#006a61] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
                Servidor de Triagem Conectado (Latência 12ms)
              </span>
            </div>
          </div>
        </div>

        {/* Regulatory Disclaimer CFM */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-xl border border-[#e5eeff] text-[11px] font-mono text-[#76777d]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#006a61]">verified_user</span>
            <span>
              IA passiva estrita: apenas documentação auditada (CFM 2.314/2022). Zero inferência diagnóstica autônoma.
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[#006a61] font-semibold">Escuta Operacional (180ms)</span>
            <button
              onClick={() => onNavigate('auditoria')}
              className="text-[#006a61] underline hover:text-[#005049] cursor-pointer"
            >
              Logs de Auditoria
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
