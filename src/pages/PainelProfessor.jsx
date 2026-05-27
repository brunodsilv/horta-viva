// src/pages/PainelProfessor.jsx
import { useState } from 'react';
import { db } from '../firebase'; 
import { collection, addDoc } from 'firebase/firestore';

export default function PainelProfessor({ setTelaAtual }) {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [xp, setXp] = useState(50); // Valor padrão de XP
  const [aviso, setAviso] = useState({ texto: '', tipo: '' });

  const salvarMissao = async () => {
    setAviso({ texto: '', tipo: '' });

    if (!titulo || !descricao || !xp) {
      setAviso({ texto: 'Preencha todos os campos da missão!', tipo: 'erro' });
      return;
    }

    try {
      // Cria a coleção "missoes" no Firestore e adiciona o documento
      await addDoc(collection(db, "missoes"), {
        titulo: titulo,
        descricao: descricao,
        xp: Number(xp),
        dataCriacao: new Date().toISOString(),
        status: 'ativa'
      });

      setAviso({ texto: '✨ Missão adicionada com sucesso ao mapa!', tipo: 'sucesso' });
      
      // Limpa os campos para cadastrar a próxima
      setTitulo('');
      setDescricao('');
      setXp(50);
      
    } catch (error) {
      console.error("Erro ao salvar missão: ", error);
      setAviso({ texto: 'Erro ao conectar com o banco de dados.', tipo: 'erro' });
    }
  };

  return (
    <div className="min-h-screen bg-[#fffdf0] p-6 font-sans text-amber-950 flex flex-col items-center">
      
      <div className="max-w-2xl w-full">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-8 border-b-4 border-amber-200 pb-4">
          <h1 className="text-3xl font-black text-amber-700 uppercase tracking-wide">
            👨‍🏫 Base do Mestre
          </h1>
          <button 
            onClick={() => setTelaAtual('dashboard')}
            className="text-amber-700 font-bold hover:text-amber-900 transition-colors"
          >
            ⬅ Voltar
          </button>
        </div>

        {/* Formulário de Nova Missão */}
        <div className="bg-white border-[6px] border-amber-500 rounded-[2rem] p-8 shadow-[0_8px_0_0_rgba(180,83,9,1)]">
          <h2 className="text-2xl font-black text-amber-800 mb-6 flex items-center gap-2">
            📜 Criar Nova Missão
          </h2>

          {aviso.texto && (
            <div className={`mb-6 p-4 border-4 rounded-xl font-black text-center uppercase tracking-wide ${aviso.tipo === 'erro' ? 'bg-red-100 border-red-500 text-red-700' : 'bg-green-100 border-green-500 text-green-700'}`}>
              {aviso.texto}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-black text-amber-900 mb-2 uppercase">Título da Missão</label>
              <input 
                type="text" 
                value={titulo}
                placeholder="Ex: Regar os tomates" 
                className="w-full p-4 bg-amber-50 border-4 border-amber-300 rounded-xl font-bold focus:outline-none focus:border-amber-600"
                onChange={(e) => setTitulo(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-black text-amber-900 mb-2 uppercase">Como Completar?</label>
              <textarea 
                value={descricao}
                placeholder="Descreva o que o aluno precisa fazer..." 
                rows="3"
                className="w-full p-4 bg-amber-50 border-4 border-amber-300 rounded-xl font-bold focus:outline-none focus:border-amber-600 resize-none"
                onChange={(e) => setDescricao(e.target.value)}
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-black text-amber-900 mb-2 uppercase">Recompensa (XP) ⭐</label>
              <input 
                type="number" 
                value={xp}
                className="w-1/3 min-w-[120px] p-4 bg-amber-50 border-4 border-amber-300 rounded-xl font-black text-xl text-amber-700 focus:outline-none focus:border-amber-600 text-center"
                onChange={(e) => setXp(e.target.value)}
              />
            </div>

            <button 
              onClick={salvarMissao}
              className="w-full mt-4 bg-amber-500 border-[4px] border-amber-800 text-white font-black text-xl py-4 rounded-2xl shadow-[0_6px_0_0_#92400e] active:shadow-none active:translate-y-[6px] transition-all uppercase tracking-wide"
            >
              Lançar Missão!
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}