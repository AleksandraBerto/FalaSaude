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
  caseKey: 'carlos' | 'ana' | 'jose' | 'maria' | string;
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

export interface SoapDraft {
  subjetivo: string;
  objetivo: string;
  avaliacao: string;
  plano: string;
}

export interface AiExtractionResult {
  decisions: ClinicalDecision[];
  conflicts?: Array<{
    title: string;
    description: string;
    severity: 'baixa' | 'media' | 'critica';
  }>;
  isNeutralSafeMode?: boolean;
  confidenceScore?: number;
  soapDraft?: SoapDraft;
}

export interface DoctorUser {
  id: string;
  name: string;
  email: string;
  crm: string;
  initials: string;
  specialty: string;
  boxLocation: string;
}

export const MOCK_DOCTORS: DoctorUser[] = [
  {
    id: 'doc-1',
    name: 'Dr. Renato Guimarães',
    email: 'renato.guimaraes@falasaude.med.br',
    crm: 'CRM/SP 148.920',
    initials: 'RG',
    specialty: 'Ortopedia & Traumatologia',
    boxLocation: 'Box 04 • Adulto',
  },
  {
    id: 'doc-2',
    name: 'Dra. Camila Bittencourt',
    email: 'camila.bittencourt@falasaude.med.br',
    crm: 'CRM/SP 192.405',
    initials: 'CB',
    specialty: 'Clínica Médica & Emergência',
    boxLocation: 'Box 02 • Triagem Rápida',
  },
  {
    id: 'doc-3',
    name: 'Dr. Marcelo Ribeiro',
    email: 'marcelo.ribeiro@falasaude.med.br',
    crm: 'CRM/SP 165.812',
    initials: 'MR',
    specialty: 'Cirurgia Geral & Trauma',
    boxLocation: 'Sala 01 • Emergência / Vermelho',
  },
];

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'arrival' | 'cfm' | 'alert' | 'system';
  read: boolean;
  patientId?: string;
  triageLabel?: string;
  triage?: TriageCategory;
}
