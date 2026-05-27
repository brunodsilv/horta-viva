import React from 'react';

export default function Dashboard({ setTelaAtual }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-8 flex items-center justify-center font-sans">
      <div className="bg-white border-[6px] border-green-800 rounded-3xl p-8 max-w-lg w-full text-center shadow-[0_8px_0_0_#166534]">
        <h1 className="text-3xl font-black text-green-800 mb-4">Dashboard Conectado!</h1>
        <p className="font-bold text-amber-900 mb-6">Parabéns, a sua arquitetura agora é profissional.</p>
        
        {/* NOVO BOTÃO: ACESSO DO PROFESSOR */}
        <button 
          onClick={() => setTelaAtual('painel-professor')} 
          className="w-full mb-4 bg-amber-500 text-white font-black px-6 py-3 rounded-xl border-4 border-amber-800 shadow-[0_4px_0_0_#92400e] active:translate-y-1 active:shadow-none uppercase"
        >
          👨‍🏫 Acessar Base do Mestre
        </button>

        <button 
          onClick={() => setTelaAtual('login')} 
          className="w-full bg-red-500 text-white font-black px-6 py-3 rounded-xl border-4 border-red-800 shadow-[0_4px_0_0_#991b1b] active:translate-y-1 active:shadow-none uppercase"
        >
          Sair do Jogo
        </button>
      </div>
    </div>
  );
}