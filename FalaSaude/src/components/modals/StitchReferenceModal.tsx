import React, { useState } from 'react';
import { STITCH_SCREENS_INFO } from '../../data/mockClinicalData';
import { ScreenId } from '../../types/clinical';

interface StitchReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScreen: (screenId: ScreenId) => void;
}

export const StitchReferenceModal: React.FC<StitchReferenceModalProps> = ({
  isOpen,
  onClose,
  onSelectScreen,
}) => {
  const [selectedIdx, setSelectedIdx] = useState(0);

  if (!isOpen) return null;

  const current = STITCH_SCREENS_INFO[selectedIdx];

  return (
    <div className="fixed inset-0 z-50 bg-[#131b2e]/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-[#ffffff] rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-[#d3e4fe]">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-[#e5eeff] flex items-center justify-between bg-[#eff4ff]/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#006a61] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">devices</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[#0b1c30] text-[16px]">Mockups e Telas do Google Stitch</h3>
                <span className="px-2 py-0.5 rounded-full bg-[#86f2e4] text-[#006f66] font-mono text-[10px] font-bold">
                  Projeto #11725044996838075730
                </span>
              </div>
              <p className="text-[12px] text-[#45464d]">
                Telas e ativos gerados originalmente pelo Google Stitch para o protótipo <strong>Fala Saúde</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#e5eeff] text-[#45464d] flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Screen selector thumbnails */}
        <div className="px-6 py-3 border-b border-[#e5eeff] bg-[#ffffff] flex items-center gap-3 overflow-x-auto">
          {STITCH_SCREENS_INFO.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setSelectedIdx(idx)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-all shrink-0 cursor-pointer border ${
                selectedIdx === idx
                  ? 'bg-[#eff4ff] border-[#006a61] text-[#006a61] shadow-xs'
                  : 'bg-white border-[#e5eeff] text-[#45464d] hover:bg-[#eff4ff]/50'
              }`}
            >
              <img
                src={item.screenshot}
                alt={item.title}
                className="w-8 h-8 rounded object-cover border border-[#e5eeff]"
              />
              <div className="flex flex-col">
                <span className="text-[11px] font-bold truncate max-w-[130px]">{item.title}</span>
                <span className="text-[9px] text-[#76777d] font-mono">Screen #{idx + 1}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Screen Preview & Details */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col lg:flex-row gap-6 bg-[#f8f9ff]">
          {/* Large Screenshot viewer */}
          <div className="lg:w-7/12 flex flex-col gap-2">
            <div className="bg-[#131b2e] rounded-xl p-2 flex items-center justify-center border border-[#e5eeff] shadow-inner max-h-[550px] overflow-hidden">
              <img
                src={current.screenshot}
                alt={current.title}
                className="w-full h-auto max-h-[530px] object-contain rounded-lg"
              />
            </div>
            <span className="text-[11px] font-mono text-[#76777d] text-center">
              Captura original do canvas do Google Stitch (Resolução nativa Figma/Web)
            </span>
          </div>

          {/* Details & Live Navigation */}
          <div className="lg:w-5/12 flex flex-col justify-between gap-4 bg-white p-5 rounded-xl border border-[#e5eeff]">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#eff4ff] text-[#006a61] text-[11px] font-mono font-bold">
                  {current.type === 'brand' ? 'Identidade Visual' : 'Tela Interativa'}
                </span>
                <span className="text-[12px] text-[#76777d]">•</span>
                <span className="text-[11px] text-[#76777d] font-mono">ID: {current.id}</span>
              </div>

              <h4 className="text-[20px] font-bold text-[#0b1c30]">{current.title}</h4>
              <p className="text-[13px] text-[#45464d] leading-relaxed">{current.description}</p>

              <div className="mt-2 p-3 rounded-lg bg-[#eff4ff] border border-[#d3e4fe] flex flex-col gap-1.5">
                <span className="text-[11px] font-bold text-[#006a61] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">verified</span>
                  Implementação Total no Applet
                </span>
                <p className="text-[12px] text-[#45464d]">
                  Todas as regras, textos, botões, modais, trilhas de auditoria e fluxos foram reconstruídos com fidelidade em React e Tailwind CSS.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-4 border-t border-[#e5eeff]">
              {current.screenId && (
                <button
                  onClick={() => {
                    onSelectScreen(current.screenId as ScreenId);
                    onClose();
                  }}
                  className="w-full py-2.5 bg-[#006a61] hover:bg-[#005049] text-white rounded-lg font-semibold text-[13px] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">launch</span>
                  Abrir esta Tela no Protótipo Interativo
                </button>
              )}
              <button
                onClick={onClose}
                className="w-full py-2 bg-[#eff4ff] hover:bg-[#e5eeff] text-[#0b1c30] rounded-lg font-medium text-[12px] transition-colors cursor-pointer"
              >
                Fechar Visualizador
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
