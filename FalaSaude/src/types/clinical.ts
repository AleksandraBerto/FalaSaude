export type TriageCategory = 'vermelho' | 'laranja' | 'amarelo' | 'verde' | 'azul';

export type ScreenId =
  | 'fila-do-plantao'
  | 'consentimento'
  | 'atendimento'
  | 'rascunho'
  | 'excecao'
  | 'auditoria';

export interface Patient {
  id: string;
  name: string;
  age: number;
  birthDate?: string;
  recordNumber: string;
  triage: TriageCategory;
  triageLabel: string;
  waitTime: string;
  waitTimeMinutes: number;
  chiefComplaint: string;
  vitalsSummary: string;
  status: 'espera' | 'escuta' | 'rascunho_pronto' | 'revisao_pendente' | 'homologado' | 'critico_stat';
  statusLabel: string;
  room: string;
  caseKey: 'carlos' | 'ana' | 'jose' | 'maria';
}

export interface VitalSigns {
  pa: string;
  fc: string;
  spo2: string;
  tax: string;
  fr?: string;
  hgt?: string;
}

export interface TranscriptUtterance {
  id: string;
  speaker: string;
  role: 'doctor' | 'patient' | 'system';
  timestamp: string;
  text: string;
  evidenceId?: string;
  confidence?: string;
  isHighlighted?: boolean;
}

export interface ClinicalDecision {
  id: string;
  type: 'exame' | 'encaminhamento' | 'alergia' | 'prescricao';
  title: string;
  code?: string;
  description: string;
  status: 'detectado' | 'confirmado' | 'pendente' | 'conflito' | 'ignorado';
  evidenceTimestamp?: string;
}

export interface AuditEvent {
  timestamp: string;
  title: string;
  description: string;
  actor: string;
  hash: string;
  badge?: string;
  type: 'security' | 'clinical' | 'signature' | 'system';
}
