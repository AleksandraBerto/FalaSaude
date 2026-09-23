import React, { useState } from 'react';

interface PrintGuidesModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  recordNumber: string;
}

export const PrintGuidesModal: React.FC<PrintGuidesModalProps> = ({
  isOpen,
  onClose,
  patientName,
  recordNumber,
}) => {
  const [printedFeedback, setPrintedFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePrint = (title: string) => {
    setPrintedFeedback(`Guia "${title}" enviada com sucesso para impressão.`);
    setTimeout(() => setPrintedFeedback(null), 3500);
  };

  const handlePrintAll = () => {
    setPrintedFeedback('Todas as guias homologadas foram emitidas e assinadas digitalmente com ICP-Brasil.');
    setTimeout(() => {
      setPrintedFeedback(null);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#131b2e]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#ffffff] border border-[#e5eeff] rounded-2xl max-w-3xl w-full p-6 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#e5eeff] pb-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006a61] text-[22px]">print</span>
              <h3 className="text-[17px] text-[#0b1c30] font-bold">Central de Emissão e Impressão de Guias</h3>
              <span className="px-2 py-0.5 bg-[#86f2e4]/30 text-[#006f66] font-mono text-[10px] rounded font-semibold">
                CFM 2.314/22
              </span>
            </div>
            <p className="text-[12px] text-[#45464d] mt-1">
              Paciente: <strong>{patientName}</strong> • Prontuário: <strong>{recordNumber}</strong> • CRM-SP 148.920
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#76777d] hover:text-[#0b1c30] p-1 rounded-md hover:bg-[#eff4ff] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {printedFeedback && (
          <div className="p-3 bg-[#10b981]/10 border border-[#10b981]/30 rounded-xl text-[#065f46] text-[12px] flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>{printedFeedback}</span>
          </div>
        )}

        {/* Guides list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Guide 1: SADT USG / RX */}
          <div className="border border-[#e5eeff] rounded-xl p-4 bg-[#eff4ff]/30 flex flex-col justify-between gap-3 shadow-xs">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[#006a61] font-mono text-[11px] font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">assignment</span> SADT / Diagnóstico por Imagem
                </span>
                <span className="font-mono text-[10px] text-[#76777d]">TUSS: 4.09.01.23-8</span>
              </div>
              <h4 className="font-bold text-[#0b1c30] text-[14px]">Ultrassonografia de Abdome Total</h4>
              <p className="text-[12px] text-[#45464d] leading-relaxed">
                Indicação clínica: Dor aguda em Fossa Ilíaca Direita + febre há 18h. Suspeita de apendicite aguda.
              </p>
              <div className="text-[11px] font-mono text-[#006a61] flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-[13px]">verified</span> Ancoragem: Transcrição 15:31:40
              </div>
            </div>
            <button
              onClick={() => handlePrint('Ultrassonografia de Abdome Total')}
              className="px-3 py-1.5 bg-[#ffffff] hover:bg-[#e5eeff] text-[#0b1c30] border border-[#d3e4fe] font-semibold text-[12px] rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">print</span>
              Imprimir Guia SADT
            </button>
          </div>

          {/* Guide 2: Alerta de Alergia */}
          <div className="border border-[#fef08a] rounded-xl p-4 bg-[#fffbeb] flex flex-col justify-between gap-3 shadow-xs">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[#92400e] font-mono text-[11px] font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">warning</span> Aditivo de Segurança do Paciente
                </span>
                <span className="font-mono text-[10px] text-[#b45309] font-bold">ALERTA VERMELHO</span>
              </div>
              <h4 className="font-bold text-[#0b1c30] text-[14px]">Alerta de Alergia a Dipirona</h4>
              <p className="text-[12px] text-[#45464d] leading-relaxed">
                Hipersensibilidade grave tipo anafilática relatada. Para etiquetagem de pulseira, leito e prescrição médica.
              </p>
              <div className="text-[11px] font-mono text-[#92400e] flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-[13px]">shield</span> Bloqueio automático de prescrição
              </div>
            </div>
            <button
              onClick={() => handlePrint('Alerta de Alergia a Dipirona')}
              className="px-3 py-1.5 bg-[#fef3c7] hover:bg-[#fde68a] text-[#78350f] border border-[#fef08a] font-semibold text-[12px] rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">print</span>
              Imprimir Etiqueta e Pulseira
            </button>
          </div>

          {/* Guide 3: Hemograma + PCR */}
          <div className="border border-[#e5eeff] rounded-xl p-4 bg-[#eff4ff]/30 flex flex-col justify-between gap-3 shadow-xs">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[#006a61] font-mono text-[11px] font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">biotech</span> Análises Clínicas / Laboratório
                </span>
                <span className="font-mono text-[10px] text-[#76777d]">TUSS: 4.03.04.36-1</span>
              </div>
              <h4 className="font-bold text-[#0b1c30] text-[14px]">Hemograma Completo + PCR Quantitativa</h4>
              <p className="text-[12px] text-[#45464d] leading-relaxed">
                Avaliação de leucocitose com desvio e atividade inflamatória aguda. Coleta no leito STAT.
              </p>
            </div>
            <button
              onClick={() => handlePrint('Hemograma Completo + PCR')}
              className="px-3 py-1.5 bg-[#ffffff] hover:bg-[#e5eeff] text-[#0b1c30] border border-[#d3e4fe] font-semibold text-[12px] rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">print</span>
              Imprimir Requisição Laboratorial
            </button>
          </div>

          {/* Guide 4: Impressora Térmica do Posto */}
          <div className="border border-[#e5eeff] rounded-xl p-4 bg-white flex flex-col justify-between gap-3 shadow-xs">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[#45464d] font-mono text-[11px] font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">receipt_long</span> Posto de Enfermagem
                </span>
                <span className="font-mono text-[10px] text-[#006a61] font-semibold">Térmica 80mm</span>
              </div>
              <h4 className="font-bold text-[#0b1c30] text-[14px]">Comprovante de Atendimento do Paciente</h4>
              <p className="text-[12px] text-[#45464d] leading-relaxed">
                Ticket térmico com orientações gerais, número de atendimento e QR code para acompanhar laudo no smartphone.
              </p>
            </div>
            <button
              onClick={() => handlePrint('Comprovante Térmico')}
              className="px-3 py-1.5 bg-[#eff4ff] hover:bg-[#e5eeff] text-[#006a61] border border-[#d3e4fe] font-semibold text-[12px] rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">receipt</span>
              Emitir no Posto de Enfermagem
            </button>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#e5eeff]">
          <span className="font-mono text-[11px] text-[#76777d] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#006a61]">verified</span>
            Certificado Digital ICP-Brasil Homologado • Validade Jurídica Plena
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
              className="px-5 py-2 bg-[#006a61] hover:bg-[#005049] text-white font-semibold text-[12px] rounded-lg flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              Emitir & Imprimir Todos os Documentos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
