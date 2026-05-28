// src/components/Carregamento.jsx
import React from 'react';

export default function Carregamento({ mensagem = '🌱 A carregar...' }) {
  return (
    <div className="min-h-screen bg-[#eef7ec] flex items-center justify-center font-sans">
      <p className="text-2xl font-black text-green-800 animate-pulse uppercase tracking-wide drop-shadow-sm">
        {mensagem}
      </p>
    </div>
  );
}