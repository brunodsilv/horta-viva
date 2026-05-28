import React, { useState } from 'react';
import { auth } from '../firebase'; 
import { signInWithEmailAndPassword } from 'firebase/auth';
import Alerta from '../components/Alerta';

export default function Login({ setTelaAtual }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [chaveProfessor, setChaveProfessor] = useState('');
  const [mensagemErro, setMensagemErro] = useState('');

  const fazerLogin = async (tipo) => {
    setMensagemErro('');
    if (!email || !senha) {
      setMensagemErro('Por favor, preencha todos os campos!');
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      alert(`Bem-vindo de volta! Login efetuado com sucesso.`);
      setTelaAtual('dashboard');
    } catch (error) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        setMensagemErro('E-mail ou senha incorretos.');
      } else {
        setMensagemErro('Erro ao conectar ao sistema. Tente novamente.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#eef7ec] flex flex-col items-center justify-center p-4 font-sans text-amber-950">
      <div className="max-w-5xl w-full flex flex-col items-center relative z-10">
        
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black text-green-800 drop-shadow-sm flex items-center justify-center gap-3">
            🌱 EuriHorta 🌻
          </h1>
          <p className="text-lg font-bold text-green-700 mt-2 tracking-wide uppercase">
            Aventura Verde - Gamificação da Horta Escolar
          </p>
        </div>

        <Alerta texto={mensagemErro} tipo="erro" />

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* CARTÃO ALUNO */}
          <div className="bg-[#fffdf0] border-[6px] border-green-600 rounded-[2rem] p-8 shadow-[0_8px_0_0_rgba(22,101,52,1)] flex flex-col items-center">
            <div className="text-7xl mb-4 drop-shadow-md">👧🏽👦🏻</div>
            <h2 className="text-3xl font-black text-green-800 mb-2">Sou Aluno</h2>
            <div className="w-full space-y-4 mt-4">
              <input type="email" placeholder="Seu e-mail escolar" className="w-full p-4 bg-white border-4 border-green-300 rounded-xl font-bold focus:outline-none focus:border-green-600 text-center" onChange={(e) => setEmail(e.target.value)} />
              <input type="password" placeholder="Sua senha" className="w-full p-4 bg-white border-4 border-green-300 rounded-xl font-bold tracking-widest focus:outline-none focus:border-green-600 text-center" onChange={(e) => setSenha(e.target.value)} />
              <button onClick={() => fazerLogin('Aluno')} className="w-full mt-2 bg-green-500 border-4 border-green-800 text-white font-black text-xl py-4 rounded-2xl shadow-[0_6px_0_0_#166534] active:shadow-none active:translate-y-[6px] transition-all uppercase tracking-wide">
                Entrar
              </button>
            </div>
          </div>

          {/* CARTÃO PROFESSOR */}
          <div className="bg-[#fffdf0] border-[6px] border-amber-500 rounded-[2rem] p-8 shadow-[0_8px_0_0_rgba(180,83,9,1)] flex flex-col items-center">
            <div className="text-7xl mb-4 drop-shadow-md">👨‍🏫👩‍🏫</div>
            <h2 className="text-3xl font-black text-amber-700 mb-2">Sou Professor</h2>
            <div className="w-full space-y-4 mt-4">
              <input type="email" placeholder="E-mail do professor" className="w-full p-4 bg-white border-4 border-amber-300 rounded-xl font-bold focus:outline-none focus:border-amber-500 text-center" onChange={(e) => setEmail(e.target.value)} />
              <input type="password" placeholder="Senha de acesso" className="w-full p-4 bg-white border-4 border-amber-300 rounded-xl font-bold tracking-widest focus:outline-none focus:border-amber-500 text-center" onChange={(e) => setSenha(e.target.value)} />
              <button onClick={() => fazerLogin('Professor')} className="w-full mt-2 bg-amber-400 border-4 border-amber-700 text-amber-900 font-black text-xl py-4 rounded-2xl shadow-[0_6px_0_0_#b45309] active:shadow-none active:translate-y-[6px] transition-all uppercase tracking-wide">
                Entrar
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button onClick={() => setTelaAtual('cadastro')} className="text-green-800 hover:text-green-600 font-black text-xl uppercase tracking-wide transition-colors bg-green-200 px-6 py-3 rounded-full border-4 border-green-800 shadow-[0_4px_0_0_#166534] active:translate-y-1 active:shadow-none">
            Criar Nova Conta ➜
          </button>
        </div>

      </div>
    </div>
  );
}