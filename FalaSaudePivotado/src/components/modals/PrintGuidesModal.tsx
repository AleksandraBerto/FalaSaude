import React, { useState } from 'react';

interface GuideItem {
  id: string;
  type: 'sadt' | 'alert' | 'lab' | 'ticket';
  title: string;
  code: string;
  category: string;
  indication: string;
  justification: string;
  cid: string;
  transcriptionAnchor?: string;
  manualNote: string;
  status: 'pending' | 'printed';
}

interface PrintGuidesModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  recordNumber: string;
}

const INITIAL_GUIDES: GuideItem[] = [
  {
    id: 'guide-sadt',
    type: 'sadt',
    title: 'Ultrassonografia de Abdome Total',
    code: 'TUSS: 4.09.01.23-8',
    category: 'SADT / Diagnóstico por Imagem',
    indication: 'Dor aguda intensa em Fossa Ilíaca Direita + febre de 38.2°C há 18h. Suspeita clínica de apendicite aguda.',
    justification: 'Descompressão brusca dolorosa em ponto de McBurney (Blumberg positivo). Necessidade de confirmação de espessamento apendicular para programação cirúrgica.',
    cid: 'CID-10: K35.8 (Outras apendicites agudas e as não especificadas)',
    transcriptionAnchor: 'Transcrição 15:31:40',
    manualNote: 'Paciente em jejum prévio de 6 horas. Prioridade ALTA - Urgência Cirúrgica.',
    status: 'pending',
  },
  {
    id: 'guide-alert',
    type: 'alert',
    title: 'Alerta de Alergia a Dipirona & Pirazolonas',
    code: 'PROTOCOLO SEG: #ALERG-04',
    category: 'Aditivo de Segurança do Paciente',
    indication: 'Hipersensibilidade grave tipo anafilática relatada prévia. Proibida administração em qualquer via ou diluição.',
    justification: 'Paciente relata episódio prévio de edema de glote e urticária extensa após uso de Novalgina/Dipirona endovenosa.',
    cid: 'CID-10: T88.7 (Efeito adverso não especificado de droga)',
    transcriptionAnchor: 'Transcrição 15:30:12',
    manualNote: 'Fixar pulseira vermelha de alerta imediatamente no membro superior esquerdo e sinalizar prontuário físico.',
    status: 'pending',
  },
  {
    id: 'guide-lab',
    type: 'lab',
    title: 'Hemograma Completo + PCR Quantitativa',
    code: 'TUSS: 4.03.04.36-1',
    category: 'Análises Clínicas / Laboratório',
    indication: 'Avaliação de leucocitose com desvio escalonado e dosagem de proteína C reativa para mensuração de atividade inflamatória.',
    justification: 'Apoio diagnóstico e estratificação de risco para quadro de abdome agudo inflamatório em sala de observação.',
    cid: 'CID-10: R10.0 (Abdome agudo)',
    transcriptionAnchor: 'Transcrição 15:31:40',
    manualNote: 'Coleta no leito STAT. Liberar resultado de PCR com urgência para conduta cirúrgica.',
    status: 'pending',
  },
  {
    id: 'guide-ticket',
    type: 'ticket',
    title: 'Comprovante de Atendimento do Paciente',
    code: 'TÉRMICA 80MM / CFM 2.314/22',
    category: 'Posto de Enfermagem & Recepção',
    indication: 'Orientações pós-atendimento, comprovante de permanência hospitalar e chave de acesso para visualização de exames.',
    justification: 'Garantia de transparência e cumprimento da Resolução CFM 2.314/2022 sobre atendimento de urgência registrado em prontuário.',
    cid: 'Atendimento Ambulatorial / UPA 24h',
    transcriptionAnchor: 'Consulta Finalizada',
    manualNote: 'Retornar imediatamente ao pronto-atendimento se houver piora da dor ou febre > 38,5°C.',
    status: 'pending',
  },
];

export const PrintGuidesModal: React.FC<PrintGuidesModalProps> = ({
  isOpen,
  onClose,
  patientName,
  recordNumber,
}) => {
  const [guides, setGuides] = useState<GuideItem[]>(INITIAL_GUIDES);
  const [selectedGuideId, setSelectedGuideId] = useState<string | null>('guide-sadt');
  const [editingGuideId, setEditingGuideId] = useState<string | null>(null);
  const [tempNoteText, setTempNoteText] = useState<string>('');
  const [printedFeedback, setPrintedFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedGuide = guides.find((g) => g.id === selectedGuideId) || null;

  const handleSelectPreview = (guideId: string) => {
    // If clicking the currently selected guide, toggle off or keep active
    if (selectedGuideId === guideId) {
      // Keep it open, or if user wants to toggle, we can let them close or stay
      setSelectedGuideId(guideId);
    } else {
      setSelectedGuideId(guideId);
    }
  };

  const handleStartEdit = (guide: GuideItem) => {
    setEditingGuideId(guide.id);
    setTempNoteText(guide.manualNote);
  };

  const handleSaveNote = (guideId: string) => {
    setGuides((prev) =>
      prev.map((g) => (g.id === guideId ? { ...g, manualNote: tempNoteText.trim() } : g))
    );
    setEditingGuideId(null);
    setPrintedFeedback('Anotação manual salva com sucesso na guia.');
    setTimeout(() => setPrintedFeedback(null), 3000);
  };

  const handleCancelEdit = () => {
    setEditingGuideId(null);
    setTempNoteText('');
  };

  const handlePrint = (title: string) => {
    setGuides((prev) =>
      prev.map((g) => (g.title === title ? { ...g, status: 'printed' } : g))
    );
    setPrintedFeedback(`Guia "${title}" enviada com sucesso para impressão com certificado ICP-Brasil.`);
    setTimeout(() => setPrintedFeedback(null), 3500);
  };

  const handlePrintAll = () => {
    setGuides((prev) => prev.map((g) => ({ ...g, status: 'printed' })));
    setPrintedFeedback('Todas as 4 guias homologadas foram emitidas e assinadas digitalmente com ICP-Brasil.');
    setTimeout(() => {
      setPrintedFeedback(null);
      onClose();
    }, 2200);
  };

  const addTemplateNote = (text: string) => {
    setTempNoteText((prev) => (prev ? `${prev} • ${text}` : text));
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#131b2e]/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div
        className={`bg-[#ffffff] border border-[#e5eeff] rounded-2xl shadow-2xl flex flex-col gap-4 max-h-[92vh] overflow-hidden transition-all duration-300 w-full ${
          selectedGuide ? 'max-w-6xl' : 'max-w-3xl'
        }`}
      >
        {/* Modal Top Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-[#e5eeff] shrink-0 bg-[#ffffff]">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="material-symbols-outlined text-[#006a61] text-[24px]">description</span>
              <h3 className="text-[17px] text-[#0b1c30] font-bold">Central de Emissão e Impressão de Guias</h3>
              <span className="px-2 py-0.5 bg-[#86f2e4]/30 text-[#006f66] font-mono text-[10px] rounded font-bold">
                CFM 2.314/22 & ICP-BRASIL
              </span>
            </div>
            <p className="text-[12px] text-[#45464d] mt-1">
              Paciente: <strong className="text-[#0b1c30]">{patientName}</strong> • Prontuário: <strong className="text-[#0b1c30]">{recordNumber}</strong> • Médico Responsável: <strong className="text-[#0b1c30]">Dr. Roberto Guimarães (CRM-SP 148.920)</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            {selectedGuide && (
              <button
                onClick={() => setSelectedGuideId(null)}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-[#76777d] hover:text-[#006a61] hover:bg-[#eff4ff] rounded-lg text-[11px] font-semibold transition-colors cursor-pointer border border-transparent hover:border-[#d3e4fe]"
                title="Ocultar painel de visualização"
              >
                <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                <span>Recolher Preview</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-[#76777d] hover:text-[#0b1c30] p-1.5 rounded-lg hover:bg-[#eff4ff] cursor-pointer transition-colors"
              title="Fechar"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Feedback alert banner */}
        {printedFeedback && (
          <div className="mx-6 px-4 py-2.5 bg-[#10b981]/10 border border-[#10b981]/30 rounded-xl text-[#065f46] text-[12px] flex items-center justify-between gap-2 shrink-0 animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span className="font-medium">{printedFeedback}</span>
            </div>
            <span className="text-[11px] font-mono text-[#065f46]/70">Autenticado</span>
          </div>
        )}

        {/* Modal Main Body: Left = Guides List, Right = Preview Panel (expands on click) */}
        <div className="px-6 flex-1 overflow-y-auto min-h-0 flex flex-col lg:flex-row gap-5">
          {/* Left Column: List of Guides with Actions organized in a clear list */}
          <div
            className={`flex flex-col gap-3 transition-all duration-300 ${
              selectedGuide ? 'w-full lg:w-[48%] shrink-0' : 'w-full'
            }`}
          >
            <div className="flex items-center justify-between pb-1">
              <span className="text-[12px] font-bold text-[#0b1c30] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#006a61]">format_list_bulleted</span>
                Guias e Documentos Prontos para Emissão ({guides.length})
              </span>
              <span className="text-[11px] font-mono text-[#76777d]">
                Clique em <strong>Visualizar</strong> para abrir o documento
              </span>
            </div>

            {/* Guides List */}
            <div className="flex flex-col gap-3.5 pb-2">
              {guides.map((guide) => {
                const isSelected = selectedGuideId === guide.id;
                const isEditing = editingGuideId === guide.id;
                const isAlert = guide.type === 'alert';

                return (
                  <div
                    key={guide.id}
                    className={`border rounded-xl p-4 transition-all flex flex-col gap-3 ${
                      isSelected
                        ? 'border-[#006a61] bg-[#eff4ff]/40 shadow-sm ring-1 ring-[#006a61]/30'
                        : isAlert
                        ? 'border-[#fef08a] bg-[#fffbeb]/70 hover:border-[#fde047]'
                        : 'border-[#e5eeff] bg-[#ffffff] hover:border-[#d3e4fe] shadow-xs'
                    }`}
                  >
                    {/* Header of Guide Item */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                              isAlert
                                ? 'bg-[#fef3c7] text-[#92400e]'
                                : 'bg-[#eff4ff] text-[#006a61]'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[13px]">
                              {isAlert ? 'warning' : 'assignment'}
                            </span>
                            {guide.category}
                          </span>
                          <span className="font-mono text-[10px] text-[#76777d]">{guide.code}</span>
                          {guide.status === 'printed' && (
                            <span className="font-mono text-[10px] bg-[#10b981]/15 text-[#065f46] font-bold px-1.5 py-0.2 rounded flex items-center gap-1">
                              <span className="material-symbols-outlined text-[12px]">check</span> Emitida
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-[#0b1c30] text-[14px] mt-1">{guide.title}</h4>
                      </div>

                      {guide.transcriptionAnchor && (
                        <span className="text-[10px] font-mono text-[#006a61] bg-white border border-[#d3e4fe] px-2 py-0.5 rounded shrink-0 hidden sm:inline-block">
                          {guide.transcriptionAnchor}
                        </span>
                      )}
                    </div>

                    {/* Indication */}
                    <p className="text-[12px] text-[#45464d] leading-relaxed">
                      {guide.indication}
                    </p>

                    {/* Manual Note Display (if exists and not editing) */}
                    {guide.manualNote && !isEditing && (
                      <div className="p-2.5 rounded-lg bg-[#fefce8] border border-[#fef08a] text-[11px] text-[#854d0e] flex items-start gap-2">
                        <span className="material-symbols-outlined text-[15px] text-[#ca8a04] shrink-0 mt-0.5">
                          edit_note
                        </span>
                        <div className="flex-1">
                          <strong className="font-semibold text-[#713f12]">Anotação Manual: </strong>
                          <span>{guide.manualNote}</span>
                        </div>
                      </div>
                    )}

                    {/* Inline Editor for Manual Note */}
                    {isEditing && (
                      <div className="p-3 bg-[#ffffff] border border-[#006a61] rounded-xl flex flex-col gap-2.5 shadow-sm">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-bold text-[#006a61] flex items-center gap-1">
                            <span className="material-symbols-outlined text-[15px]">edit</span>
                            Inserir / Editar Anotação Manual na Guia
                          </label>
                          <span className="text-[10px] text-[#76777d]">Será impressa no documento</span>
                        </div>

                        <textarea
                          value={tempNoteText}
                          onChange={(e) => setTempNoteText(e.target.value)}
                          placeholder="Digite observações clínicas, recomendações de preparo ou orientações à enfermagem..."
                          rows={2}
                          className="w-full text-[12px] p-2.5 border border-[#d3e4fe] rounded-lg focus:outline-none focus:border-[#006a61] bg-[#f8f9ff] text-[#0b1c30] resize-none"
                          autoFocus
                        />

                        {/* Quick tags */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-mono text-[#76777d]">Sugestões:</span>
                          <button
                            type="button"
                            onClick={() => addTemplateNote('Jejum 8h')}
                            className="px-2 py-0.5 bg-[#eff4ff] hover:bg-[#d3e4fe] text-[#006a61] rounded text-[10px] font-semibold transition-colors cursor-pointer"
                          >
                            + Jejum 8h
                          </button>
                          <button
                            type="button"
                            onClick={() => addTemplateNote('Prioridade STAT')}
                            className="px-2 py-0.5 bg-[#eff4ff] hover:bg-[#d3e4fe] text-[#006a61] rounded text-[10px] font-semibold transition-colors cursor-pointer"
                          >
                            + Prioridade STAT
                          </button>
                          <button
                            type="button"
                            onClick={() => addTemplateNote('Comunicar cirurgião')}
                            className="px-2 py-0.5 bg-[#eff4ff] hover:bg-[#d3e4fe] text-[#006a61] rounded text-[10px] font-semibold transition-colors cursor-pointer"
                          >
                            + Comunicar cirurgião
                          </button>
                          <button
                            type="button"
                            onClick={() => addTemplateNote('Orientar acompanhante')}
                            className="px-2 py-0.5 bg-[#eff4ff] hover:bg-[#d3e4fe] text-[#006a61] rounded text-[10px] font-semibold transition-colors cursor-pointer"
                          >
                            + Orientar acompanhante
                          </button>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#e5eeff]">
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="px-3 py-1 text-[11px] text-[#76777d] hover:text-[#0b1c30] font-medium transition-colors cursor-pointer"
                          >
                            Cancelar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveNote(guide.id)}
                            className="px-3.5 py-1 bg-[#006a61] hover:bg-[#005049] text-white font-bold text-[11px] rounded-lg transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[14px]">save</span>
                            Salvar Anotação
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Action buttons list (Imprimir, Visualizar, Editar/Anotação) */}
                    <div className="pt-2 border-t border-[#e5eeff]/80 flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* 1. Visualizar / Preview Button */}
                        <button
                          type="button"
                          onClick={() => handleSelectPreview(guide.id)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#006a61] text-white shadow-xs'
                              : 'bg-[#eff4ff] hover:bg-[#d3e4fe] text-[#006a61] border border-[#d3e4fe]'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[15px]">
                            {isSelected ? 'visibility' : 'preview'}
                          </span>
                          <span>{isSelected ? 'Visualizando' : 'Visualizar Guia'}</span>
                          {isSelected && <span className="material-symbols-outlined text-[14px]">arrow_forward</span>}
                        </button>

                        {/* 2. Editar / Adicionar Anotação */}
                        <button
                          type="button"
                          onClick={() => handleStartEdit(guide)}
                          className="px-3 py-1.5 bg-[#ffffff] hover:bg-[#eff4ff] text-[#45464d] hover:text-[#006a61] border border-[#d3e4fe] rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[15px]">
                            {guide.manualNote ? 'edit' : 'add_comment'}
                          </span>
                          <span>{guide.manualNote ? 'Editar Anotação' : 'Adicionar Anotação'}</span>
                        </button>
                      </div>

                      {/* 3. Imprimir Guia */}
                      <button
                        type="button"
                        onClick={() => handlePrint(guide.title)}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          isAlert
                            ? 'bg-[#fef3c7] hover:bg-[#fde68a] text-[#78350f] border border-[#fef08a]'
                            : 'bg-[#ffffff] hover:bg-[#e5eeff] text-[#0b1c30] border border-[#d3e4fe]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[15px]">print</span>
                        <span>Imprimir Guia</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Preview of the Document (Expanded on click) */}
          {selectedGuide ? (
            <div className="w-full lg:w-[52%] flex flex-col gap-3 shrink-0 animate-fadeIn">
              {/* Preview Control Header */}
              <div className="flex items-center justify-between bg-[#eff4ff] px-4 py-2 rounded-xl border border-[#d3e4fe]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006a61] text-[18px]">menu_book</span>
                  <span className="font-bold text-[#0b1c30] text-[12px]">
                    Visualização do Documento Impresso (Folha A4)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePrint(selectedGuide.title)}
                    className="px-3 py-1 bg-[#006a61] hover:bg-[#005049] text-white rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[14px]">print</span>
                    <span>Imprimir Esta Guia</span>
                  </button>
                  <button
                    onClick={() => setSelectedGuideId(null)}
                    className="p-1 text-[#76777d] hover:text-[#0b1c30] hover:bg-white rounded-md transition-colors cursor-pointer"
                    title="Fechar preview"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>
              </div>

              {/* Realistic Printable Paper Document Container */}
              <div className="bg-[#ffffff] border-2 border-[#d3e4fe] rounded-xl p-6 shadow-md text-[#0b1c30] flex flex-col gap-4 font-sans relative overflow-hidden">
                {/* Watermark/Security background strip */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#eff4ff]/60 -rotate-45 transform translate-x-12 -translate-y-12 pointer-events-none rounded-full" />

                {/* Document Header with Hospital Logo & SUS */}
                <div className="flex items-start justify-between border-b-2 border-[#0b1c30]/20 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#006a61] text-white flex items-center justify-center font-bold text-[18px] shadow-xs">
                      +
                    </div>
                    <div className="flex flex-col">
                      <span className="font-extrabold text-[13px] tracking-wide text-[#0b1c30] uppercase">
                        Hospital Municipal Santa Cruz
                      </span>
                      <span className="text-[10px] text-[#45464d] font-mono">
                        Rede de Urgência e Emergência • SUS / CNES 2688921
                      </span>
                      <span className="text-[10px] text-[#006a61] font-semibold">
                        {selectedGuide.category}
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end">
                    <span className="font-mono font-bold text-[11px] text-[#006a61] bg-[#eff4ff] px-2 py-0.5 rounded border border-[#d3e4fe]">
                      {selectedGuide.code}
                    </span>
                    <span className="text-[10px] text-[#76777d] mt-1 font-mono">
                      Emissão: 23/09/2026 às 15:35
                    </span>
                  </div>
                </div>

                {/* Patient Identification Card */}
                <div className="bg-[#f8f9ff] border border-[#e5eeff] rounded-lg p-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div>
                    <span className="text-[#76777d] block text-[9px] uppercase font-mono">Paciente</span>
                    <strong className="text-[#0b1c30] font-bold text-[12px]">{patientName}</strong>
                  </div>
                  <div>
                    <span className="text-[#76777d] block text-[9px] uppercase font-mono">Prontuário</span>
                    <strong className="text-[#0b1c30] font-mono">{recordNumber}</strong>
                  </div>
                  <div>
                    <span className="text-[#76777d] block text-[9px] uppercase font-mono">Cartão SUS</span>
                    <span className="font-mono text-[#45464d]">898 0012 3847 2910</span>
                  </div>
                  <div>
                    <span className="text-[#76777d] block text-[9px] uppercase font-mono">Localização</span>
                    <span className="font-semibold text-[#006a61]">Leito 04 • Obs. Adulto</span>
                  </div>
                </div>

                {/* Procedure & Clinical Indication Body */}
                <div className="flex flex-col gap-3 py-1">
                  <div className="flex items-center justify-between border-b border-[#e5eeff] pb-1">
                    <h5 className="font-bold text-[15px] text-[#006a61] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px]">health_and_safety</span>
                      {selectedGuide.title}
                    </h5>
                    <span className="font-mono text-[10px] text-[#76777d] font-semibold">
                      {selectedGuide.cid}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#45464d] font-mono">
                      Indicação Clínica & Sinais Objetivos:
                    </span>
                    <p className="text-[12px] text-[#0b1c30] bg-[#f8f9ff] p-2.5 rounded-lg border border-[#e5eeff] leading-relaxed">
                      {selectedGuide.indication}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#45464d] font-mono">
                      Justificativa Técnica do Procedimento:
                    </span>
                    <p className="text-[12px] text-[#45464d] leading-relaxed">
                      {selectedGuide.justification}
                    </p>
                  </div>

                  {/* Manual Note Section on Preview */}
                  <div className="bg-[#fffbeb] border border-[#fef08a] rounded-lg p-3 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#92400e] font-mono flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">edit_note</span>
                        Anotações Médicas e Orientações Manuais Adicionais:
                      </span>
                      <button
                        type="button"
                        onClick={() => handleStartEdit(selectedGuide)}
                        className="text-[10px] font-bold text-[#b45309] hover:underline cursor-pointer flex items-center gap-0.5"
                      >
                        <span className="material-symbols-outlined text-[12px]">edit</span>
                        Editar
                      </button>
                    </div>
                    <p className="text-[12px] text-[#78350f] font-medium leading-relaxed italic">
                      "{selectedGuide.manualNote || 'Nenhuma anotação manual adicionada até o momento. Clique em Editar para acrescentar.'}"
                    </p>
                  </div>
                </div>

                {/* Audit & Audio Anchoring */}
                {selectedGuide.transcriptionAnchor && (
                  <div className="p-2 rounded bg-[#eff4ff] border border-[#d3e4fe] flex items-center justify-between text-[10px] font-mono text-[#006a61]">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">mic</span>
                      Ancoragem Acústica: {selectedGuide.transcriptionAnchor}
                    </span>
                    <span>Código de Auditoria: #AUD-8829-2026</span>
                  </div>
                )}

                {/* Official Signatures & ICP-Brasil Seal */}
                <div className="pt-3 border-t-2 border-[#0b1c30]/20 flex items-center justify-between gap-4 mt-2">
                  <div className="flex items-center gap-2.5">
                    {/* Simulated QR Code */}
                    <div className="w-12 h-12 border-2 border-[#0b1c30] p-0.5 rounded bg-white flex flex-col justify-between">
                      <div className="flex justify-between">
                        <div className="w-2.5 h-2.5 bg-[#0b1c30]" />
                        <div className="w-2.5 h-2.5 bg-[#0b1c30]" />
                      </div>
                      <div className="flex justify-center">
                        <div className="w-2 h-2 bg-[#006a61]" />
                      </div>
                      <div className="flex justify-between">
                        <div className="w-2.5 h-2.5 bg-[#0b1c30]" />
                        <div className="w-1 h-1 bg-[#0b1c30]" />
                      </div>
                    </div>
                    <div className="flex flex-col text-[9px] font-mono text-[#76777d]">
                      <span className="font-bold text-[#0b1c30]">Validador Nacional ITI</span>
                      <span>Assinatura Digital A3</span>
                      <span className="text-[#006a61]">Hash: 7a8f9c0e2b1d</span>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end">
                    <div className="w-40 border-b border-[#0b1c30] pb-0.5 text-center">
                      <span className="font-serif italic text-[11px] text-[#0b1c30]">
                        Dr. Roberto Guimarães
                      </span>
                    </div>
                    <span className="font-bold text-[10px] text-[#0b1c30] mt-0.5">
                      DR. ROBERTO GUIMARÃES
                    </span>
                    <span className="text-[9px] text-[#45464d] font-mono">
                      CRM-SP 148.920 • RQE 82.119
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-[#e5eeff] bg-[#ffffff] shrink-0">
          <span className="font-mono text-[11px] text-[#76777d] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#006a61]">verified</span>
            Certificado Digital ICP-Brasil Homologado • Validade Jurídica Plena (Lei 14.063/20)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-[#45464d] hover:text-[#0b1c30] text-[12px] font-medium transition-colors cursor-pointer"
            >
              Fechar
            </button>
            <button
              onClick={handlePrintAll}
              className="px-5 py-2 bg-[#006a61] hover:bg-[#005049] text-white font-bold text-[12px] rounded-lg flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Emitir & Imprimir Todos os Documentos (4)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
