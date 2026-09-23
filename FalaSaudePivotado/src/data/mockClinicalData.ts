import { Patient, TranscriptUtterance, ClinicalDecision, AuditEvent } from '../types/clinical';

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'p-01',
    name: 'Ana Maria Vasconcelos',
    age: 42,
    birthDate: '14/06/1982',
    recordNumber: '774.209/SP',
    triage: 'laranja',
    triageLabel: 'Laranja • Muito Urgente',
    waitTime: '08 min',
    waitTimeMinutes: 8,
    chiefComplaint: 'Dor em Fossa Ilíaca Direita há 18h com febre aferida',
    vitalsSummary: 'PA 118x76 • Tax 38.3°C • Abdome doloroso à descompressão',
    status: 'revisao_pendente',
    statusLabel: 'Revisão Pendente',
    room: 'Consultório 02',
    caseKey: 'ana'
  },
  {
    id: 'p-02',
    name: 'José Bonifácio dos Santos',
    age: 67,
    birthDate: '11/03/1957',
    recordNumber: '49.102-M',
    triage: 'amarelo',
    triageLabel: 'Amarelo • Urgente',
    waitTime: '12 min',
    waitTimeMinutes: 12,
    chiefComplaint: 'Episódio de cefaleia tensional e tontura postural',
    vitalsSummary: 'HGT 142 mg/dL • PA 134x86 • Sem déficits motores',
    status: 'espera',
    statusLabel: 'Exceção sem Decisão',
    room: 'Consultório 03',
    caseKey: 'jose'
  },
  {
    id: 'p-03',
    name: 'Carlos Eduardo Mendes',
    age: 34,
    birthDate: '22/08/1990',
    recordNumber: '492.019/SP',
    triage: 'verde',
    triageLabel: 'Verde • Pouco Urgente',
    waitTime: '14 min',
    waitTimeMinutes: 14,
    chiefComplaint: 'Entorse de tornozelo direito com edema e dor à palpação',
    vitalsSummary: 'PA 128x84 • FC 82 bpm • SpO2 98% • Afebril',
    status: 'rascunho_pronto',
    statusLabel: 'Rascunho Pronto',
    room: 'Box 04 • Ortopedia',
    caseKey: 'carlos'
  },
  {
    id: 'p-04',
    name: 'Maria da Conceição Silva',
    age: 71,
    birthDate: '03/02/1954',
    recordNumber: '104.992-E',
    triage: 'vermelho',
    triageLabel: 'Vermelho • Emergência Imediata',
    waitTime: '00 min',
    waitTimeMinutes: 0,
    chiefComplaint: 'Dor torácica opressiva irradiada para MSE, sudorese e dispneia',
    vitalsSummary: 'PA 82x48 • FC 132 • SpO2 86% • Suspeita IAM com Supra',
    status: 'critico_stat',
    statusLabel: 'Escuta Suspensa (STAT)',
    room: 'Sala Vermelha #01',
    caseKey: 'maria'
  },
  {
    id: 'p-05',
    name: 'Beatriz Lima dos Reis',
    age: 29,
    birthDate: '19/11/1994',
    recordNumber: '318.441/SP',
    triage: 'verde',
    triageLabel: 'Verde • Pouco Urgente',
    waitTime: '18 min',
    waitTimeMinutes: 18,
    chiefComplaint: 'Contusão no punho com edema leve após queda leve',
    vitalsSummary: 'Mobilidade preservada • Sem deformidades • PA 120x80',
    status: 'escuta',
    statusLabel: 'Escuta em Curso',
    room: 'Consultório 04',
    caseKey: 'carlos'
  },
  {
    id: 'p-06',
    name: 'Roberto Neves Pimentel',
    age: 41,
    birthDate: '05/09/1983',
    recordNumber: '128.940/SP',
    triage: 'azul',
    triageLabel: 'Azul • Não Urgente',
    waitTime: '45 min',
    waitTimeMinutes: 45,
    chiefComplaint: 'Cefaleia tensional e mialgia pós-estresse laboral',
    vitalsSummary: 'Afebril • Sem sinais meníngeos • Glasgow 15',
    status: 'espera',
    statusLabel: 'Aguardando',
    room: 'Recepção Ambulatório',
    caseKey: 'jose'
  }
];

export const TRANSCRIPT_CARLOS: TranscriptUtterance[] = [
  {
    id: 't-01',
    speaker: 'Dr. Renato Guimarães',
    role: 'doctor',
    timestamp: '14:22:15',
    text: 'Boa tarde, Carlos. Sou o Dr. Renato. Me conte com detalhes o que houve com seu pé e tornozelo.'
  },
  {
    id: 't-02',
    speaker: 'Carlos Eduardo Mendes',
    role: 'patient',
    timestamp: '14:22:28',
    text: 'Boa tarde, doutor. Eu estava jogando futebol society ontem à noite e, ao apoiar o pé no chão para mudar de direção, meu tornozelo direito virou para dentro com um estalo forte. Na hora inchou muito e quase não consegui pisar.'
  },
  {
    id: 't-03',
    speaker: 'Dr. Renato Guimarães',
    role: 'doctor',
    timestamp: '14:22:45',
    text: 'Certo. Você conseguiu colocar peso nele após a torção? Consegue caminhar pelo menos quatro passos?'
  },
  {
    id: 't-04',
    speaker: 'Carlos Eduardo Mendes',
    role: 'patient',
    timestamp: '14:22:58',
    text: 'Não, doutor. Dói demais se eu tentar apoiar o calcanhar. Tive que vir pulando de um pé só com ajuda do meu irmão.'
  },
  {
    id: 't-05',
    speaker: 'Dr. Renato Guimarães',
    role: 'doctor',
    timestamp: '14:23:18',
    text: 'Examinando aqui: observo edema moderado perimaleolar lateral, dor intensa à palpação sobre a borda posterior do maléolo lateral e ligamento talofibular anterior. Critérios de Ottawa positivos.',
    evidenceId: 'EVID-PHYS-01',
    confidence: '99.4%'
  },
  {
    id: 't-06',
    speaker: 'Dr. Renato Guimarães',
    role: 'doctor',
    timestamp: '14:23:35',
    text: 'Carlos, pela incapacidade de carga e a dor maleolar, vou solicitar um Raio-X de Tornozelo Direito nas incidências Anteroposterior e Perfil para afastar fratura óssea.',
    evidenceId: 'EVID-RX-0218',
    confidence: '99.1%'
  },
  {
    id: 't-07',
    speaker: 'Dr. Renato Guimarães',
    role: 'doctor',
    timestamp: '14:23:52',
    text: 'Além disso, você tem alergia a algum medicamento, como dipirona, paracetamol ou anti-inflamatórios?'
  },
  {
    id: 't-08',
    speaker: 'Carlos Eduardo Mendes',
    role: 'patient',
    timestamp: '14:24:02',
    text: 'Não, doutor. Nunca tive reação alérgica a nenhum remédio. Costumo tomar dipirona e ibuprofeno sem problemas.',
    evidenceId: 'EVID-ALLERGY-NEG',
    confidence: '98.8%'
  },
  {
    id: 't-09',
    speaker: 'Dr. Renato Guimarães',
    role: 'doctor',
    timestamp: '14:24:16',
    text: 'Excelente. Vou prescrever Dipirona 1g via oral agora para alívio imediato da dor, gelo local 20 minutos três vezes ao dia e imobilização provisória com tala gessada surupodálica. Em seguida, encaminharei você para o parecer da Ortopedia e Traumatologia.',
    evidenceId: 'EVID-PLAN-03',
    confidence: '99.5%'
  }
];

export const TRANSCRIPT_ANA: TranscriptUtterance[] = [
  {
    id: 't-ana-01',
    speaker: 'Dr. Marcelo Ribeiro',
    role: 'doctor',
    timestamp: '15:30:10',
    text: 'Dona Ana Maria, estou vendo na ficha que a senhora está com dor na barriga. Onde começou essa dor?'
  },
  {
    id: 't-ana-02',
    speaker: 'Ana Maria Vasconcelos',
    role: 'patient',
    timestamp: '15:30:25',
    text: 'Doutor, começou ontem à tarde em volta do umbigo, como se fosse um aperto ou cólica. Mas durante a noite a dor desceu todinha aqui para o lado direito embaixo e não passa com nada. Até tossir dói.'
  },
  {
    id: 't-ana-03',
    speaker: 'Dr. Marcelo Ribeiro',
    role: 'doctor',
    timestamp: '15:30:45',
    text: 'Teve enjoo, vômito ou febre em casa?'
  },
  {
    id: 't-ana-04',
    speaker: 'Ana Maria Vasconcelos',
    role: 'patient',
    timestamp: '15:30:58',
    text: 'Tive febre de 38,3 graus hoje de manhã e vomitei duas vezes. Perdi totalmente a fome.'
  },
  {
    id: 't-ana-05',
    speaker: 'Dr. Marcelo Ribeiro',
    role: 'doctor',
    timestamp: '15:31:20',
    text: 'Ao exame físico: descompressão dolorosa no ponto de McBurney positiva, sinal de Rovsing positivo, defesa involuntária na fossa ilíaca direita. Quadro fortemente sugestivo de apendicite aguda.',
    evidenceId: 'evid-1',
    confidence: '99.1%'
  },
  {
    id: 't-ana-06',
    speaker: 'Dr. Marcelo Ribeiro',
    role: 'doctor',
    timestamp: '15:31:40',
    text: 'Dona Ana, vamos solicitar uma Ultrassonografia de Abdome Total em caráter de urgência e exames de sangue laboratoriais: Hemograma Completo com PCR.',
    evidenceId: 'evid-1',
    confidence: '99.1%'
  },
  {
    id: 't-ana-07',
    speaker: 'Dr. Marcelo Ribeiro',
    role: 'doctor',
    timestamp: '15:32:05',
    text: 'Na triagem anotaram que a senhora não tem alergias, confere?'
  },
  {
    id: 't-ana-08',
    speaker: 'Ana Maria Vasconcelos',
    role: 'patient',
    timestamp: '15:32:18',
    text: 'Não doutor! Na triagem eu esqueci de falar porque estava com muita dor, mas eu TENHO alergia grave a Dipirona! Uma vez tomei e fechei a garganta com placas no corpo todo.',
    evidenceId: 'evid-3',
    confidence: '98.4%'
  }
];

export const TRANSCRIPT_JOSE: TranscriptUtterance[] = [
  {
    id: 't-jose-01',
    speaker: 'Dr. Marcelo Ribeiro',
    role: 'doctor',
    timestamp: '15:10:14',
    text: 'Boa tarde, Seu José Bonifácio. Pode puxar a cadeira e sentar. Conte-me com calma: o que o senhor está sentindo que o fez vir ao pronto-socorro hoje?'
  },
  {
    id: 't-jose-02',
    speaker: 'José Bonifácio dos Santos',
    role: 'patient',
    timestamp: '15:10:32',
    text: 'Boa tarde, doutor. Eu ando com uma sensação de cabeça pesada faz uns três dias, como se tivesse uma faixa apertando minha nuca. Hoje cedo quando levantei da cama rápido deu uma tonturazinha de leve, daí minha esposa achou melhor vir conferir.'
  },
  {
    id: 't-jose-03',
    speaker: 'Dr. Marcelo Ribeiro',
    role: 'doctor',
    timestamp: '15:11:05',
    text: 'O senhor teve febre, visão dupla, perda de força no braço ou na perna, dificuldade para falar ou dormência?'
  },
  {
    id: 't-jose-04',
    speaker: 'José Bonifácio dos Santos',
    role: 'patient',
    timestamp: '15:11:22',
    text: 'Graças a Deus nada disso, doutor. Mexo tudo normalmente. É mais cansaço e essa tensão nos ombros e pescoço. Dormi muito mal esses dias por causa de preocupações da família.'
  },
  {
    id: 't-jose-05',
    speaker: 'Dr. Marcelo Ribeiro',
    role: 'doctor',
    timestamp: '15:12:10',
    text: 'Fizemos seu exame neurológico completo: pupilas isocóricas e fotorreagentes, pares cranianos preservados, força muscular grau 5 simétrica em 4 membros, marcha sem desvios, sem rigidez de nuca. Pressão arterial 134 por 86, glicemia 142. Quadro típico de cefaleia do tipo tensional associada a privação de sono e estresse.'
  },
  {
    id: 't-jose-06',
    speaker: 'Dr. Marcelo Ribeiro',
    role: 'doctor',
    timestamp: '15:13:00',
    text: 'Como não há sinais de alarme ou déficits focais, não há necessidade de exames de imagem ou coleta de sangue agora. Vamos prescrever repouso, hidratação adequada de pelo menos 2 litros de água ao dia, higiene do sono e manter suas medicações de uso contínuo habitual.'
  }
];

export const INITIAL_DECISIONS_CARLOS: ClinicalDecision[] = [
  {
    id: 'dec-01',
    type: 'exame',
    title: 'Raio-X de Tornozelo Direito (AP e Perfil)',
    code: 'TUSS 4.08.04.05-4',
    description: 'Investigação de fratura maleolar após trauma rotacional com incapacidade de apoio (Critérios de Ottawa)',
    status: 'confirmado',
    evidenceTimestamp: '14:23:35'
  },
  {
    id: 'dec-02',
    type: 'encaminhamento',
    title: 'Ortopedia e Traumatologia',
    code: 'INTERCONSULTA-URG',
    description: 'Avaliação especializada pós-radiografia para conduta definitiva de lesão ligamentar',
    status: 'confirmado',
    evidenceTimestamp: '14:24:16'
  },
  {
    id: 'dec-03',
    type: 'alergia',
    title: 'Alergias Negativas',
    description: 'Sem hipersensibilidade prévia a Dipirona, Paracetamol ou AINEs referida pelo paciente',
    status: 'confirmado',
    evidenceTimestamp: '14:24:02'
  },
  {
    id: 'dec-04',
    type: 'prescricao',
    title: 'Dipirona Sódica 1g VO + Tala Gessada',
    description: 'Analgésico simples dose única agora + imobilização provisória e crioterapia 20min',
    status: 'confirmado',
    evidenceTimestamp: '14:24:16'
  }
];

export const CARLOS_DECISIONS = INITIAL_DECISIONS_CARLOS;

export const ANA_DECISIONS: ClinicalDecision[] = [
  {
    id: 'dec-ana-01',
    type: 'exame',
    title: 'Ultrassonografia de Abdome Total (Urgência)',
    code: 'TUSS 4.09.01.23-8',
    description: 'Avaliação de apendicite aguda e exclusão de diagnósticos diferenciais pélvicos',
    status: 'confirmado',
    evidenceTimestamp: '15:31:40'
  },
  {
    id: 'dec-ana-02',
    type: 'exame',
    title: 'Hemograma Completo + PCR + Urina I (STAT)',
    code: 'TUSS 4.03.04.36-1',
    description: 'Avaliação de leucocitose e marcadores inflamatórios agudos',
    status: 'confirmado',
    evidenceTimestamp: '15:31:40'
  },
  {
    id: 'dec-ana-03',
    type: 'alergia',
    title: 'Alergia Grave a Dipirona (Relatada)',
    description: 'Paciente verbalizou reação anafilática prévia com edema de glote às 15:32:18 (Conflito com triagem)',
    status: 'conflito',
    evidenceTimestamp: '15:32:18'
  },
  {
    id: 'dec-ana-04',
    type: 'encaminhamento',
    title: 'Parecer com Cirurgia Geral',
    code: 'INTERCONSULTA-URG',
    description: 'Avaliação cirúrgica imediata com jejum e hidratação venosa',
    status: 'confirmado',
    evidenceTimestamp: '15:31:40'
  }
];


export const AUDIT_TRAIL_DATA: AuditEvent[] = [
  {
    timestamp: '14:22:04 BRT',
    title: 'Consentimento Verbal LGPD Registrado',
    description: 'Paciente informado e consentiu com o assistente acústico em sala de urgência.',
    actor: 'Dr. Renato Guimarães (CRM/SP 148.920)',
    hash: 'SHA256: 9b2d8f...3a1c',
    badge: 'LGPD Art. 7º',
    type: 'security'
  },
  {
    timestamp: '14:22:10 BRT',
    title: 'Início da Sessão de Escuta Acústica',
    description: 'Canal direcional USB ativado com cancelamento de ruído hospitalar ativo.',
    actor: 'Fala Saúde Engine v2.4.1',
    hash: 'SHA256: 4a77bc...110e',
    badge: 'Áudio Seguro',
    type: 'system'
  },
  {
    timestamp: '14:23:35 BRT',
    title: 'Detecção de Conduta Clínica (Raio-X de Tornozelo D)',
    description: 'Ancoragem fonética de 99.1% com transcrição pontual e critérios de Ottawa vinculados.',
    actor: 'Módulo Semântico Clínico',
    hash: 'SHA256: 88cf12...92ab',
    badge: 'Ancoragem Fonética',
    type: 'clinical'
  },
  {
    timestamp: '14:24:02 BRT',
    title: 'Checagem de Segurança Alérgica',
    description: 'Alergia negativa verbalizada e cruzada com base de medicamentos sem conflito.',
    actor: 'Validador CFM 2.314/22',
    hash: 'SHA256: cc41a0...8f99',
    badge: 'Segurança Segura',
    type: 'security'
  },
  {
    timestamp: '14:25:12 BRT',
    title: 'Geração Estruturada de Rascunho SOAP',
    description: 'Campos Subjetivo, Objetivo, Avaliação e Plano mapeados com rastreabilidade 100%.',
    actor: 'Dr. Renato Guimarães',
    hash: 'SHA256: 510ab9...d331',
    badge: 'SOAP Validado',
    type: 'clinical'
  },
  {
    timestamp: '14:26:00 BRT',
    title: 'Assinatura Digital ICP-Brasil A3',
    description: 'Documento clínico chancelado com certificado digital padrão CFM e carimbo do tempo.',
    actor: 'Dr. Renato Guimarães (CRM/SP 148.920)',
    hash: 'SHA256: d81a9f029...7710bc',
    badge: 'ICP-Brasil CFM',
    type: 'signature'
  },
  {
    timestamp: '14:26:05 BRT',
    title: 'Sincronização Nuvem e Expurgo Programado',
    description: 'Prontuário transmitido ao PEP TASY e áudio agendado para descarte automático em 30 dias.',
    actor: 'Cloud Sync Engine',
    hash: 'SHA256: ee0981...194b',
    badge: 'Expurgo 30d',
    type: 'system'
  }
];

export const STITCH_SCREENS_INFO = [
  {
    id: '0_fala_sa_de_logo',
    title: 'Fala Saúde Logo',
    type: 'brand',
    description: 'Logomarca oficial com paleta primária clínica (#0f172a, #0284c7, #38bdf8) e tipografia Plus Jakarta Sans.',
    screenshot: '/assets/stitch/0_fala_sa_de_logo_screenshot.png'
  },
  {
    id: '2_tela_1__fila_do_plant_o',
    title: 'Tela 1: Fila do Plantão',
    type: 'screen',
    screenId: 'fila-do-plantao',
    description: 'Visão de comando do plantonista com classificação Manchester, tempos de espera, consultórios e chamada sonora.',
    screenshot: '/assets/stitch/2_tela_1__fila_do_plant_o_screenshot.png'
  },
  {
    id: '5_tela_2__consentimento_e_regra_de_emerg_ncia',
    title: 'Tela 2: Consentimento e Regra de Emergência',
    type: 'screen',
    screenId: 'consentimento',
    description: 'Termo de consentimento informado, biometria vocal e a regra de exceção para pacientes inconscientes (Diretiva CFM).',
    screenshot: '/assets/stitch/5_tela_2__consentimento_e_regra_de_emerg_ncia_screenshot.png'
  },
  {
    id: '6_tela_3__atendimento_e_transcri__o_em_tempo_real',
    title: 'Tela 3: Atendimento e Transcrição em Tempo Real',
    type: 'screen',
    screenId: 'atendimento',
    description: 'Consultório com escuta ativa contínua, diarização de locutores, cronômetro e detecção automática de condutas.',
    screenshot: '/assets/stitch/6_tela_3__atendimento_e_transcri__o_em_tempo_real_screenshot.png'
  },
  {
    id: '3_tela_4__revis_o_do_rascunho_cl_nico',
    title: 'Tela 4: Revisão do Rascunho Clínico & Rastreamento',
    type: 'screen',
    screenId: 'rascunho',
    description: 'Prontuário estruturado SOAP com evidências auditáveis conectadas ao player de áudio, resolução de conflitos e emissão de guias.',
    screenshot: '/assets/stitch/3_tela_4__revis_o_do_rascunho_cl_nico_screenshot.png'
  },
  {
    id: '1_tela_5__exce__o_sem_decis_o_detectada',
    title: 'Tela 5: Exceção Sem Decisão Detectada',
    type: 'screen',
    screenId: 'excecao',
    description: 'Tratamento de caso sem pedido de exame ou receita (Seu José Bonifácio): fluxo seguro para alta com orientações.',
    screenshot: '/assets/stitch/1_tela_5__exce__o_sem_decis_o_detectada_screenshot.png'
  },
  {
    id: '4_tela_6__resumo_e_auditoria_final',
    title: 'Tela 6: Resumo e Auditoria Final',
    type: 'screen',
    screenId: 'auditoria',
    description: 'Documento clínico homologado com chancela digital ICP-Brasil, trilha forense completa e validação de autenticidade por QR Code.',
    screenshot: '/assets/stitch/4_tela_6__resumo_e_auditoria_final_screenshot.png'
  }
];
