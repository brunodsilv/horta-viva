import React, { useState } from 'react';
import { auth, db } from './firebase'; 
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function App() {
  // Estados partilhados
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagemErro, setMensagemErro] = useState('');
  const [telaAtual, setTelaAtual] = useState('login'); // 'login', 'cadastro' ou 'dashboard'

  // Estados específicos do Cadastro
  const [nome, setNome] = useState('');
  const [isProfessor, setIsProfessor] = useState(false);
  const [chaveProfessor, setChaveProfessor] = useState('');

  // ==========================================
  // FUNÇÃO DE LOGIN
  // ==========================================
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
      console.error(error);
    }
  };

  // ==========================================
  // FUNÇÃO DE CADASTRO
  // ==========================================
  const fazerCadastro = async () => {
    setMensagemErro('');
    
    // Validações básicas
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
      // 1. Cria o usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      // 2. Salva os dados extras no Firestore (Banco de Dados)
      // Vai criar uma coleção chamada "usuarios" e salvar o documento com o ID do usuário
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
      console.error(error);
    }
  };

  // ==========================================
  // TELA DE LOGIN
  // ==========================================
  if (telaAtual === 'login') {
    return (
      <div className="min-h-screen bg-[#eef7ec] flex flex-col items-center justify-center p-4 font-sans text-amber-950">
        
        <div className="max-w-5xl w-full flex flex-col items-center relative z-10">
          
          <div className="text-center mb-8">
            <h1 className="text-5xl font-black text-green-800 drop-shadow-sm flex items-center justify-center gap-3">
              🌱 Horta Viva 🌻
            </h1>
            <p className="text-lg font-bold text-green-700 mt-2 tracking-wide uppercase">
              Aventura Verde - Gamificação da Horta Escolar
            </p>
          </div>

          {mensagemErro && (
            <div className="mb-6 p-4 w-full max-w-md bg-red-100 border-4 border-red-500 rounded-xl text-red-700 font-black text-center uppercase tracking-wide">
              ⚠️ {mensagemErro}
            </div>
          )}

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
            <button onClick={() => { setTelaAtual('cadastro'); setMensagemErro(''); }} className="text-green-800 hover:text-green-600 font-black text-xl uppercase tracking-wide transition-colors bg-green-200 px-6 py-3 rounded-full border-4 border-green-800 shadow-[0_4px_0_0_#166534] active:translate-y-1 active:shadow-none">
              Criar Nova Conta ➜
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // TELA DE CADASTRO
  // ==========================================
  if (telaAtual === 'cadastro') {
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
                <input 
                  type="checkbox" 
                  id="prof-check" 
                  className="w-6 h-6 rounded cursor-pointer accent-amber-600"
                  onChange={(e) => setIsProfessor(e.target.checked)}
                />
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
              <button onClick={() => { setTelaAtual('login'); setMensagemErro(''); }} className="text-amber-700 hover:text-amber-900 font-black uppercase text-sm transition-colors">
                ⬅ Voltar ao Menu
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // TELA DO DASHBOARD
  // ==========================================
  if (telaAtual === 'dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-8 flex items-center justify-center font-sans">
        <div className="bg-white border-[6px] border-green-800 rounded-3xl p-8 max-w-lg w-full text-center shadow-[0_8px_0_0_#166534]">
          <h1 className="text-3xl font-black text-green-800 mb-4">Dashboard Conectado!</h1>
          <p className="font-bold text-amber-900 mb-6">Parabéns, você criou o personagem e conectou ao banco de dados Firestore.</p>
          <button onClick={() => setTelaAtual('login')} className="bg-red-500 text-white font-black px-6 py-3 rounded-xl border-4 border-red-800 shadow-[0_4px_0_0_#991b1b] active:translate-y-1 active:shadow-none uppercase">
            Sair do Jogo
          </button>
        </div>
      </div>
    );
  }

  return null;
}