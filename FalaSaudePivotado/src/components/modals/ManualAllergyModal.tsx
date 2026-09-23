import React, { useState } from 'react';

interface ManualAllergyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (substance: string) => void;
}

export const ManualAllergyModal: React.FC<ManualAllergyModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [substance, setSubstance] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#131b2e]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#ffffff] border border-[#e5eeff] rounded-xl max-w-md w-full p-6 shadow-xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0b1c30] text-[22px]">edit_note</span>
            <h4 className="font-bold text-[#0b1c30] text-[15px]">Informar Alergia Manualmente</h4>
          </div>
          <button onClick={onClose} className="text-[#76777d] hover:text-[#0b1c30] cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <p className="text-[13px] text-[#45464d] leading-relaxed">
          Informe o medicamento ou componente químico referido diretamente pelo paciente ou acompanhante durante a anamnese:
        </p>

        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] text-[#0b1c30] font-semibold">Fármaco / Substância Alergênica</label>
          <input
            type="text"
            value={substance}
            onChange={(e) => setSubstance(e.target.value)}
            placeholder="Ex: Dipirona Sódica, Ibuprofeno, Penicilina..."
            className="w-full p-2.5 rounded-lg bg-[#eff4ff] text-[#0b1c30] text-[13px] border border-[#e5eeff] focus:outline-none focus:ring-2 focus:ring-[#006a61]"
            autoFocus
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-3.5 py-2 text-[#45464d] hover:text-[#0b1c30] text-[12px] font-medium transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onSubmit(substance.trim() || 'Dipirona Sódica');
              onClose();
            }}
            className="px-4 py-2 bg-[#006a61] hover:bg-[#005049] text-white text-[12px] font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
          >
            Confirmar & Liberar Assinatura
          </button>
        </div>
      </div>
    </div>
  );
};
