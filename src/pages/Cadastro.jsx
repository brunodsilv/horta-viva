import React, { useState } from 'react';
import { auth, db } from '../firebase'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function Cadastro({ setTelaAtual }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isProfessor, setIsProfessor] = useState(false);
  const [chaveProfessor, setChaveProfessor] = useState('');
  const [mensagemErro, setMensagemErro] = useState('');

  const fazerCadastro = async () => {
    setMensagemErro('');
    if (!nome || !email || !senha) {
      setMensagemErro('Preencha todos os campos obrigatórios!');
      return;
    }
    if (senha.length < 6) {
      setMensagemErro('A senha deve ter pelo menos 6 caracteres!');
      return;
    }
    if (isProfessor && chaveProfessor !== 'HORTA2026') {
      setMensagemErro('Chave de Professor incorreta!');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      await setDoc(doc(db, "usuarios", user.uid), {
        nome: nome,
        email: email,
        tipo: isProfessor ? 'Professor' : 'Aluno',
        dataCadastro: new Date().toISOString()
      });

      alert(`Personagem ${nome} criado com sucesso!`);
      setTelaAtual('dashboard');
      
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setMensagemErro('Este e-mail já está em uso!');
      } else {
        setMensagemErro('Erro ao criar conta. Tente novamente.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#eef7ec] p-4 flex items-center justify-center font-sans text-amber-950 py-12">
      <div className="max-w-md w-full bg-[#fffdf0] border-[6px] border-amber-500 rounded-[2rem] p-8 shadow-[0_8px_0_0_rgba(180,83,9,1)] relative z-10">
        
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black text-amber-700 drop-shadow-sm uppercase">Novo Jogador</h1>
          <p className="font-bold text-amber-800 mt-1">Crie seu personagem na Horta</p>
        </div>

        {mensagemErro && (
          <div className="mb-6 p-3 bg-red-100 border-4 border-red-500 rounded-xl text-red-700 font-black text-center text-sm uppercase tracking-wide">
            ⚠️ {mensagemErro}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-black text-amber-950 mb-1 uppercase tracking-wide">Nome Completo</label>
            <input type="text" placeholder="Como você se chama?" className="w-full p-3 bg-white border-[3px] border-amber-400 rounded-xl font-bold focus:outline-none focus:border-amber-600" onChange={(e) => setNome(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-black text-amber-950 mb-1 uppercase tracking-wide">E-mail</label>
            <input type="email" placeholder="email@escola.pt" className="w-full p-3 bg-white border-[3px] border-amber-400 rounded-xl font-bold focus:outline-none focus:border-amber-600" onChange={(e) => setEmail(e.target.value)} />
          </div>
          
          <div>
            <label className="block text-sm font-black text-amber-950 mb-1 uppercase tracking-wide">Senha Secreta</label>
            <input type="password" placeholder="Mínimo 6 caracteres" className="w-full p-3 bg-white border-[3px] border-amber-400 rounded-xl font-bold focus:outline-none focus:border-amber-600" onChange={(e) => setSenha(e.target.value)} />
          </div>
          
          <div className="my-6 p-4 bg-amber-100 border-[3px] border-amber-300 rounded-2xl">
            <div className="flex items-center gap-3">
              <input type="checkbox" id="prof-check" className="w-6 h-6 rounded cursor-pointer accent-amber-600" onChange={(e) => setIsProfessor(e.target.checked)} />
              <label htmlFor="prof-check" className="font-black text-amber-900 text-sm uppercase cursor-pointer">
                Conta de Professor 👨‍🏫
              </label>
            </div>

            {isProfessor && (
              <div className="mt-4 pt-4 border-t-[3px] border-amber-200 border-dashed">
                <label className="block text-xs font-black text-red-600 mb-2 uppercase tracking-wide">Chave Secreta da Direção</label>
                <input type="password" placeholder="Digite HORTA2026" className="w-full p-3 bg-white border-[3px] border-red-400 rounded-xl font-bold text-center text-red-700 focus:outline-none focus:border-red-600" onChange={(e) => setChaveProfessor(e.target.value)} />
              </div>
            )}
          </div>

          <button onClick={fazerCadastro} className="w-full bg-green-500 border-[3px] border-green-800 text-white font-black text-xl py-3 rounded-2xl shadow-[0_6px_0_0_#166534] active:shadow-none active:translate-y-[6px] transition-all uppercase tracking-wide">
            Salvar Jogo
          </button>

          <div className="pt-6 text-center border-t-4 border-amber-200 border-dashed mt-6">
            <button onClick={() => setTelaAtual('login')} className="text-amber-700 hover:text-amber-900 font-black uppercase text-sm transition-colors">
              ⬅ Voltar ao Menu
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}