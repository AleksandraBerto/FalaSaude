import React from 'react';
import { ScreenId } from '../types/clinical';

interface HeaderProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  onOpenStitchGallery: () => void;
  selectedCase: 'carlos' | 'ana' | 'jose' | 'maria';
  onSelectCase: (caseKey: 'carlos' | 'ana' | 'jose' | 'maria') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  onOpenStitchGallery,
  selectedCase,
  onSelectCase,
}) => {
  const steps: { id: ScreenId; label: string; badge?: string }[] = [
    { id: 'fila-do-plantao', label: '1. Fila do Plantão', badge: '14' },
    { id: 'consentimento', label: '2. Consentimento', badge: 'LGPD' },
    { id: 'atendimento', label: '3. Atendimento & Escuta', badge: 'Ao Vivo' },
    { id: 'rascunho', label: '4. Rascunho & Evidências', badge: 'SOAP' },
    { id: 'excecao', label: '5. Exceção Sem Decisão', badge: 'Guarda' },
    { id: 'auditoria', label: '6. Resumo & Auditoria', badge: 'CFM' },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex flex-col">
      {/* Top hospital regulatory banner */}
      <div className="w-full bg-[#ffffff] border-b border-[#e5eeff] px-4 lg:px-6 py-1 flex items-center justify-between text-[11px] backdrop-blur-sm text-[#45464d] shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
          <span className="font-mono font-medium text-[#006a61]">SISTEMA CLÍNICO AUDITÁVEL</span>
          <span className="text-[#c6c6cd]">•</span>
          <span className="hidden sm:inline font-mono text-[#45464d]">CFM 2.314/2022 • IA Passiva Estrita</span>
          <span className="hidden md:inline text-[#c6c6cd]">•</span>
          <span className="hidden md:inline text-[#45464d]">Criptografia de Ponta a Ponta</span>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <span className="font-mono text-[11px] text-[#76777d]">Plantão Adulto • Box 04</span>
          <span className="text-[#c6c6cd]">|</span>
          <span className="font-semibold text-[#0b1c30]">Dr. Renato Guimarães (CRM/SP 148.920)</span>
        </div>
      </div>

      {/* Main Header */}
      <header className="w-full bg-[#ffffff]/95 backdrop-blur-md border-b border-[#e5eeff] px-4 lg:px-6 shadow-sm">
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Logo brand */}
          <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => onNavigate('fila-do-plantao')}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 48" fill="none" className="h-8 w-auto">
              <rect x="2" y="6" width="36" height="36" rx="10" fill="#0284c7" />
              <path d="M20 13v22M9 24h22" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
              <circle cx="28" cy="15" r="4.5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
              <path d="M26 15h4M28 13v4" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
              <text x="46" y="27" fontFamily="Plus Jakarta Sans, Inter, sans-serif" fontWeight="700" fontSize="18" fill="#0f172a" letterSpacing="-0.02em">Fala Saúde</text>
              <text x="46" y="38" fontFamily="Plus Jakarta Sans, Inter, sans-serif" fontWeight="500" fontSize="9" fill="#0284c7" letterSpacing="0.08em">ASSISTENTE CLÍNICO IA</text>
            </svg>
            <span className="hidden xl:inline-block px-2 py-0.5 rounded-full bg-[#eff4ff] text-[#006a61] text-[10px] font-mono font-semibold border border-[#d3e4fe]">
              Google Stitch Prototype
            </span>
          </div>

          {/* Navigation Steps */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#eff4ff]/80 p-1 rounded-full border border-[#e5eeff] max-w-full overflow-x-auto">
            {steps.map((step) => {
              const isActive = currentScreen === step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => onNavigate(step.id)}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-[#ffffff] text-[#0b1c30] shadow-sm font-semibold border border-[#d3e4fe]'
                      : 'text-[#45464d] hover:text-[#0b1c30] hover:bg-[#ffffff]/50'
                  }`}
                >
                  <span>{step.label}</span>
                  {step.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
                        isActive
                          ? 'bg-[#86f2e4] text-[#006f66] font-bold'
                          : 'bg-[#e5eeff] text-[#45464d]'
                      }`}
                    >
                      {step.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Case Switcher & Stitch Gallery Button */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Case selector dropdown / chips */}
            <div className="hidden md:flex items-center bg-[#eff4ff] p-0.5 rounded-lg border border-[#e5eeff]">
              <span className="text-[10px] text-[#76777d] px-2 font-mono uppercase">Caso:</span>
              <button
                onClick={() => onSelectCase('carlos')}
                className={`px-2 py-1 text-[11px] rounded transition-all ${
                  selectedCase === 'carlos'
                    ? 'bg-[#ffffff] text-[#006a61] font-semibold shadow-xs'
                    : 'text-[#45464d] hover:text-[#0b1c30]'
                }`}
                title="Caso Padrão: Trauma no tornozelo / Fluxo completo"
              >
                Carlos (Trauma)
              </button>
              <button
                onClick={() => onSelectCase('ana')}
                className={`px-2 py-1 text-[11px] rounded transition-all ${
                  selectedCase === 'ana'
                    ? 'bg-[#ffffff] text-[#92400e] font-semibold shadow-xs'
                    : 'text-[#45464d] hover:text-[#0b1c30]'
                }`}
                title="Caso Conflito: Dor FID + Alergia a Dipirona"
              >
                Ana (Alergia)
              </button>
              <button
                onClick={() => onSelectCase('jose')}
                className={`px-2 py-1 text-[11px] rounded transition-all ${
                  selectedCase === 'jose'
                    ? 'bg-[#ffffff] text-[#1e40af] font-semibold shadow-xs'
                    : 'text-[#45464d] hover:text-[#0b1c30]'
                }`}
                title="Caso Sem Decisão: Cefaleia crônica sem exame"
              >
                José (Exceção)
              </button>
              <button
                onClick={() => onSelectCase('maria')}
                className={`px-2 py-1 text-[11px] rounded transition-all ${
                  selectedCase === 'maria'
                    ? 'bg-[#ffffff] text-[#ba1a1a] font-semibold shadow-xs'
                    : 'text-[#45464d] hover:text-[#0b1c30]'
                }`}
                title="Caso Emergência: Suspeita IAM / Escuta suspensa"
              >
                Maria (STAT)
              </button>
            </div>

            {/* Button to view Stitch mockups */}
            <button
              onClick={onOpenStitchGallery}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#006a61] hover:bg-[#005049] text-[#ffffff] rounded-lg text-[12px] font-semibold transition-all shadow-sm cursor-pointer"
              title="Visualizar telas e mockups oficiais gerados no Google Stitch"
            >
              <span className="material-symbols-outlined text-[16px]">gallery_thumbnail</span>
              <span className="hidden sm:inline">Telas Stitch</span>
              <span className="bg-[#86f2e4] text-[#006f66] text-[10px] px-1.5 rounded-full font-bold">7</span>
            </button>
          </div>
        </div>

        {/* Mobile Subnav */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-[#e5eeff]">
          {steps.map((step) => {
            const isActive = currentScreen === step.id;
            return (
              <button
                key={step.id}
                onClick={() => onNavigate(step.id)}
                className={`px-2.5 py-1 rounded-full text-[11px] whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#006a61] text-[#ffffff] font-semibold'
                    : 'bg-[#eff4ff] text-[#45464d]'
                }`}
              >
                {step.label}
              </button>
            );
          })}
        </div>
      </header>
    </div>
  );
};
