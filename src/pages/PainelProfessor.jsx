// src/pages/PainelProfessor.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; 
import { collection, addDoc, onSnapshot, doc, deleteDoc } from 'firebase/firestore';

export default function PainelProfessor({ setTelaAtual }) {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [xp, setXp] = useState(50);
  const [aviso, setAviso] = useState({ texto: '', tipo: '' });
  
  // Novo estado para guardar a lista de missões que vêm do banco de dados
  const [listaMissoes, setListaMissoes] = useState([]);

  // useEffect com onSnapshot: O nosso "olheiro" em tempo real no Firestore
  useEffect(() => {
    const referenciarMissoes = collection(db, "missoes");
    
    const pararObservacao = onSnapshot(referenciarMissoes, (snapshot) => {
      const missoesAtualizadas = snapshot.docs.map((documento) => ({
        id: documento.id,
        ...documento.data()
      }));
      setListaMissoes(missoesAtualizadas);
    });

    // Limpa o observador quando o professor sai da tela
    return () => pararObservacao();
  }, []);

  // Função para criar missão (Mantida igual)
  const salvarMissao = async () => {
    setAviso({ texto: '', tipo: '' });

    if (!titulo || !descricao || !xp) {
      setAviso({ texto: 'Preencha todos os campos da missão!', tipo: 'erro' });
      return;
    }

    try {
      await addDoc(collection(db, "missoes"), {
        titulo: titulo,
        descricao: descricao,
        xp: Number(xp),
        dataCriacao: new Date().toISOString(),
        status: 'ativa'
      });

      setAviso({ texto: '✨ Missão adicionada com sucesso ao mapa!', tipo: 'sucesso' });
      setTitulo('');
      setDescricao('');
      setXp(50);
      
    } catch (error) {
      console.error("Erro ao salvar missão: ", error);
      setAviso({ texto: 'Erro ao conectar com o banco de dados.', tipo: 'erro' });
    }
  };

  // NOVA FUNÇÃO: Excluir Missão
  const excluirMissao = async (id, tituloMissao) => {
    const confirmacao = window.confirm(`Tem certeza que deseja apagar a missão "${tituloMissao}"?`);
    
    if (confirmacao) {
      try {
        await deleteDoc(doc(db, "missoes", id));
        setAviso({ texto: '🗑️ Missão apagada com sucesso.', tipo: 'sucesso' });
      } catch (error) {
        console.error("Erro ao excluir: ", error);
        setAviso({ texto: 'Erro ao excluir a missão.', tipo: 'erro' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#fffdf0] p-6 font-sans text-amber-950 flex flex-col items-center">
      
      <div className="max-w-4xl w-full">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-8 border-b-4 border-amber-200 pb-4">
          <h1 className="text-3xl font-black text-amber-700 uppercase tracking-wide">
            👨‍🏫 Painel do Professor
          </h1>
          <button 
            onClick={() => setTelaAtual('dashboard')}
            className="text-amber-700 font-bold hover:text-amber-900 transition-colors"
          >
            ⬅ Voltar
          </button>
        </div>

        {aviso.texto && (
          <div className={`mb-6 p-4 border-4 rounded-xl font-black text-center uppercase tracking-wide ${aviso.tipo === 'erro' ? 'bg-red-100 border-red-500 text-red-700' : 'bg-green-100 border-green-500 text-green-700'}`}>
            {aviso.texto}
          </div>
        )}

        {/* Grid para dividir a tela em duas colunas no desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* COLUNA 1: Formulário de Criação */}
          <div className="bg-white border-[6px] border-amber-500 rounded-[2rem] p-6 shadow-[0_8px_0_0_rgba(180,83,9,1)] h-fit">
            <h2 className="text-xl font-black text-amber-800 mb-6 flex items-center gap-2">
              📜 Criar Nova Missão
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-amber-900 mb-1 uppercase">Título</label>
                <input type="text" value={titulo} placeholder="Ex: Regar os tomates" className="w-full p-3 bg-amber-50 border-4 border-amber-300 rounded-xl font-bold focus:outline-none focus:border-amber-600" onChange={(e) => setTitulo(e.target.value)} />
              </div>

              <div>
                <label className="block text-xs font-black text-amber-900 mb-1 uppercase">Descrição</label>
                <textarea value={descricao} placeholder="Descreva o que fazer..." rows="3" className="w-full p-3 bg-amber-50 border-4 border-amber-300 rounded-xl font-bold focus:outline-none focus:border-amber-600 resize-none" onChange={(e) => setDescricao(e.target.value)}></textarea>
              </div>

              <div>
                <label className="block text-xs font-black text-amber-900 mb-1 uppercase">Recompensa (XP) ⭐</label>
                <input type="number" value={xp} className="w-full p-3 bg-amber-50 border-4 border-amber-300 rounded-xl font-black text-amber-700 focus:outline-none focus:border-amber-600" onChange={(e) => setXp(e.target.value)} />
              </div>

              <button onClick={salvarMissao} className="w-full mt-2 bg-amber-500 border-[4px] border-amber-800 text-white font-black py-3 rounded-2xl shadow-[0_4px_0_0_#92400e] active:shadow-none active:translate-y-[4px] transition-all uppercase tracking-wide">
                Lançar Missão
              </button>
            </div>
          </div>

          {/* COLUNA 2: Lista de Missões Ativas */}
          <div className="bg-white border-[6px] border-green-600 rounded-[2rem] p-6 shadow-[0_8px_0_0_rgba(22,101,52,1)] flex flex-col">
            <h2 className="text-xl font-black text-green-800 mb-6 flex items-center gap-2">
              🗺️ Mapa de Missões ({listaMissoes.length})
            </h2>

            <div className="overflow-y-auto max-h-[400px] pr-2 space-y-4">
              {listaMissoes.length === 0 ? (
                <p className="text-center text-green-700 font-bold opacity-70 py-8">Nenhuma missão no mapa. Crie a primeira!</p>
              ) : (
                listaMissoes.map((missao) => (
                  <div key={missao.id} className="bg-green-50 border-4 border-green-300 p-4 rounded-xl relative group">
                    <h3 className="font-black text-green-800 text-lg">{missao.titulo}</h3>
                    <p className="text-sm font-bold text-green-700 mt-1 mb-3 leading-tight">{missao.descricao}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="bg-amber-100 text-amber-800 border-2 border-amber-300 font-black px-3 py-1 rounded-full text-xs uppercase">
                        ⭐ {missao.xp} XP
                      </span>
                      <button 
                        onClick={() => excluirMissao(missao.id, missao.titulo)}
                        className="text-red-500 hover:text-red-700 font-black text-sm uppercase transition-colors"
                      >
                        Excluir 🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* ÁREA FUTURA: Progresso dos Alunos */}
        <div className="mt-8 bg-white border-[6px] border-blue-500 rounded-[2rem] p-6 shadow-[0_8px_0_0_rgba(37,99,235,1)] opacity-70">
          <h2 className="text-xl font-black text-blue-800 mb-2 flex items-center gap-2">
            🏆 Progresso dos Alunos
          </h2>
          <p className="text-blue-700 font-bold text-sm">
            painel do aluno para completar as missões.
          </p>
        </div>

      </div>
    </div>
  );
}