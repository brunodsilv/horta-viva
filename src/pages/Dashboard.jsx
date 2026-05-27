// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function Dashboard({ setTelaAtual }) {
  const [dadosUsuario, setDadosUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // O onAuthStateChanged é um "olheiro" que verifica se há alguém logado
    const observarLogin = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Se há usuário, puxamos o documento dele lá do Firestore
        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setDadosUsuario(docSnap.data());
        }
      } else {
        // Se ninguém estiver logado, chuta de volta pro login
        setTelaAtual('login');
      }
      setCarregando(false);
    });

    // Limpeza do observador quando o componente é desmontado
    return () => observarLogin();
  }, [setTelaAtual]);

  const sairDoJogo = async () => {
    // Ao fazer signOut, o "olheiro" ali em cima percebe e redireciona a tela
    await signOut(auth);
  };

  // Tela de carregamento enquanto o Firebase busca os dados
  if (carregando) {
    return (
      <div className="min-h-screen bg-[#eef7ec] flex items-center justify-center font-sans">
        <p className="text-2xl font-black text-green-800 animate-pulse uppercase tracking-wide drop-shadow-sm">
          🌱 Carregando a Horta...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eef7ec] p-8 flex flex-col items-center justify-center font-sans">
      
      {/* CARTÃO PRINCIPAL */}
      <div className="bg-[#fffdf0] border-[6px] border-green-600 rounded-[2rem] p-8 max-w-lg w-full text-center shadow-[0_8px_0_0_rgba(22,101,52,1)] relative z-10">
        
        {/* Tag de Identificação Dinâmica */}
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-amber-400 border-4 border-amber-700 text-amber-900 font-black px-6 py-1 rounded-full text-sm uppercase tracking-widest shadow-sm">
          {dadosUsuario?.tipo || 'Jogador'}
        </div>

        <h1 className="text-3xl font-black text-green-800 mb-2 mt-4">
          Olá, {dadosUsuario?.nome || 'Aventureiro'}!
        </h1>
        <p className="font-bold text-green-700 mb-8 opacity-80">
          O que vamos fazer na horta hoje?
        </p>
        
        <div className="space-y-4">
          
          {/* BOTÃO EXCLUSIVO: PROFESSOR */}
          {dadosUsuario?.tipo === 'Professor' && (
            <button 
              onClick={() => setTelaAtual('painel-professor')} 
              className="w-full bg-amber-500 text-white font-black px-6 py-4 rounded-2xl border-[4px] border-amber-800 shadow-[0_6px_0_0_#92400e] active:translate-y-[6px] active:shadow-none uppercase transition-all tracking-wide flex items-center justify-center gap-2"
            >
              <span className="text-2xl">👨‍🏫</span> Base do Mestre
            </button>
          )}

          {/* BOTÃO EXCLUSIVO: ALUNO */}
          {dadosUsuario?.tipo === 'Aluno' && (
            <button 
              onClick={() => alert('Calma aí! O mapa de missões do aluno está em construção. 🚧')}
              className="w-full bg-blue-500 text-white font-black px-6 py-4 rounded-2xl border-[4px] border-blue-800 shadow-[0_6px_0_0_#1e40af] active:translate-y-[6px] active:shadow-none uppercase transition-all tracking-wide flex items-center justify-center gap-2"
            >
              <span className="text-2xl">🗺️</span> Ver Mapa de Missões
            </button>
          )}

          <div className="pt-4 border-t-4 border-green-200 border-dashed mt-4">
            <button 
              onClick={sairDoJogo} 
              className="w-full bg-red-500 text-white font-black px-6 py-4 rounded-2xl border-[4px] border-red-800 shadow-[0_6px_0_0_#991b1b] active:translate-y-[6px] active:shadow-none uppercase transition-all tracking-wide"
            >
              Sair do Jogo
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}