// src/components/Cabecalho.jsx
import React from 'react';

export default function Cabecalho({ titulo, icone, aoClicarVoltar, tema = 'amber' }) {
  // Dicionário de cores para os temas disponíveis
  const estilos = {
    amber: {
      bordaLinha: 'border-amber-200',
      textoTitulo: 'text-amber-700',
      botao: 'bg-white border-4 border-amber-500 text-amber-800 shadow-[0_4px_0_0_#b45309]'
    },
    green: {
      bordaLinha: 'border-green-200',
      textoTitulo: 'text-green-800',
      botao: 'bg-white border-4 border-green-700 text-green-800 shadow-[0_4px_0_0_#166534]'
    }
  };

  // Se não passar tema, ele usa o 'amber' por padrão
  const corAtual = estilos[tema] || estilos.amber;

  return (
    <div className={`flex justify-between items-center mb-8 border-b-4 ${corAtual.bordaLinha} pb-4`}>
      <h1 className={`text-3xl font-black ${corAtual.textoTitulo} uppercase tracking-wide flex items-center gap-2`}>
        {icone && <span>{icone}</span>}
        {titulo}
      </h1>
      <button 
        onClick={aoClicarVoltar}
        className={`${corAtual.botao} font-black px-4 py-2 rounded-xl active:translate-y-1 active:shadow-none transition-all uppercase text-sm`}
      >
        ⬅ Voltar
      </button>
    </div>
  );
}