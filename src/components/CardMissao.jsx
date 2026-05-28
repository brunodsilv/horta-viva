// src/components/CardMissao.jsx
import React from 'react';
import Carregamento from '../components/Carregamento';

export default function CardMissao({ titulo, descricao, xp, children }) {
  return (
    <div className="bg-[#fffdf0] border-[6px] border-green-600 rounded-[2rem] p-6 shadow-[0_8px_0_0_rgba(22,101,52,1)] flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-black text-green-800 leading-tight">{titulo}</h2>
          <span className="bg-amber-100 text-amber-800 border-2 border-amber-400 font-black px-3 py-1 rounded-full text-xs uppercase tracking-wider shrink-0">
            ⭐ {xp} XP
          </span>
        </div>
        <p className="font-bold text-green-700 text-sm border-t-2 border-green-100 pt-3 leading-relaxed">
          {descricao}
        </p>
      </div>
      
      {/* renderiza qualquer botão que você colocar dentro do componente */}
      {children && (
        <div className="mt-6">
          {children}
        </div>
      )}
    </div>
  );
}