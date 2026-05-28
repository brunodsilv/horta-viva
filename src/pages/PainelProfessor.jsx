import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; 
import { collection, addDoc, onSnapshot, doc, deleteDoc, updateDoc, getDoc, arrayUnion } from 'firebase/firestore';
import Cabecalho from '../components/Cabecalho';
import Alerta from '../components/Alerta';

export default function PainelProfessor({ setTelaAtual }) {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [xp, setXp] = useState(50);
  const [aviso, setAviso] = useState({ texto: '', tipo: '' });
  
  const [listaMissoes, setListaMissoes] = useState([]);
  const [listaAlunos, setListaAlunos] = useState([]);
  // NOVO ESTADO: Fila de aprovação de atividades
  const [solicitacoes, setSolicitacoes] = useState([]);

  useEffect(() => {
    // 1. Olheiro das Missões Ativas
    const pararMissoes = onSnapshot(collection(db, "missoes"), (snap) => {
      setListaMissoes(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // 2. Olheiro do Diário de Classe (Alunos)
    const pararAlunos = onSnapshot(collection(db, "usuarios"), (snap) => {
      const filtrados = [];
      snap.forEach(d => {
        const data = d.data();
        if (data.tipo === 'Aluno') filtrados.push({ id: d.id, ...data });
      });
      setListaAlunos(filtrados);
    });

    // 3. OLHEIRO: Solicitações pendentes de validação
    const pararSolicitacoes = onSnapshot(collection(db, "solicitacoes"), (snap) => {
      setSolicitacoes(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => { pararMissoes(); pararAlunos(); pararSolicitacoes(); };
  }, []);

  const salvarMissao = async () => {
    if (!titulo || !descricao || !xp) return;
    try {
      await addDoc(collection(db, "missoes"), { titulo, descricao, xp: Number(xp), dataCriacao: new Date().toISOString() });
      setAviso({ texto: '✨ Missão adicionada com sucesso!', tipo: 'sucesso' });
      setTitulo(''); setDescricao(''); setXp(50);
    } catch { setAviso({ texto: 'Erro ao salvar.', tipo: 'erro' }); }
  };

  const excluirMissao = async (id, name) => {
    if (window.confirm(`Apagar a missão "${name}"?`)) await deleteDoc(doc(db, "missoes", id));
  };

  // Aprovar e dar os pontos reais ao Aluno
  const aprovarAtividade = async (req) => {
    try {
      const alunoRef = doc(db, "usuarios", req.alunoId);
      const alunoSnap = await getDoc(alunoRef);

      if (alunoSnap.exists()) {
        const dados = alunoSnap.data();
        const xpAtual = dados.xp || 0;

        // 1. Atualiza a pontuação e o histórico interno do aluno
        await updateDoc(alunoRef, {
          xp: xpAtual + Number(req.xpMissao),
          missoesCompletas: arrayUnion({
            idMissao: req.idMissao,
            titulo: req.tituloMissao,
            xpGanho: req.xpMissao,
            dataValidacao: new Date().toISOString()
          })
        });

        // 2. Apaga o pedido da fila de espera
        await deleteDoc(doc(db, "solicitacoes", req.id));
        setAviso({ texto: `✔ Atividade de ${req.alunoNome} aprovada com sucesso!`, tipo: 'sucesso' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Recusar Atividade (Apenas limpa da fila)
  const recusarAtividade = async (id) => {
    if (window.confirm("Deseja recusar e arquivar este pedido de validação? O aluno não ganhará os pontos.")) {
      await deleteDoc(doc(db, "solicitacoes", id));
    }
  };

  // Zerar o Ranking de todos os Alunos
  const zerarRankingDoJogo = async () => {
    const confirmacao1 = window.confirm("⚠ ATENÇÃO! Deseja mesmo ZERAR O RANKING? Isto vai redefinir o XP de TODOS os alunos para zero.");
    if (!confirmacao1) return;

    const confirmacao2 = window.confirm("Tem a certeza absoluta? Esta operação não pode ser desfeita.");
    if (!confirmacao2) return;

    try {
      setAviso({ texto: "⚡ A redefinir pontuações do ranking...", tipo: "erro" });
      
      // Varre a lista de alunos atual e zera um por um no Firestore
      for (const aluno of listaAlunos) {
        const alunoRef = doc(db, "usuarios", aluno.id);
        await updateDoc(alunoRef, {
          xp: 0
          
        });
      }

      setAviso({ texto: "🗑️ O Ranking foi resetado com sucesso! Temporada zerada.", tipo: "sucesso" });
    } catch (error) {
      console.error(error);
      setAviso({ texto: "Erro ao resetar o ranking.", tipo: "erro" });
    }
  };

  return (
    <div className="min-h-screen bg-[#fffdf0] p-6 font-sans text-amber-950 flex flex-col items-center">
      <div className="max-w-4xl w-full">
        
        <Cabecalho 
          titulo="Base do Mestre" 
          icone="👨‍🏫" 
          aoClicarVoltar={() => setTelaAtual('dashboard')} 
          tema="amber" 
        />

        <Alerta texto={aviso.texto} tipo={aviso.tipo} />

        {/* Fila de Espera para Validação (Apenas aparece se houver pedidos) */}
        <div className="mb-8 bg-white border-[6px] border-purple-600 rounded-[2rem] p-6 shadow-[0_8px_0_0_rgba(107,33,168,1)]">
          <h2 className="text-xl font-black text-purple-800 mb-4 flex items-center gap-2">
            🔍 Validar Atividades Pendentes ({solicitacoes.length})
          </h2>
          {solicitacoes.length === 0 ? (
            <p className="text-purple-700 font-bold text-sm opacity-80">Nenhum aluno solicitou validação no momento. Tudo em ordem! 🍅</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {solicitacoes.map((req) => (
                <div key={req.id} className="bg-purple-50 border-4 border-purple-200 p-4 rounded-xl flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-black text-purple-900 text-md uppercase">{req.alunoNome}</span>
                      <span className="bg-purple-200 text-purple-800 font-black px-2 py-0.5 rounded text-xs">{req.alunoTurma}</span>
                    </div>
                    <p className="text-xs font-bold text-amber-950">Missão: <span className="font-black text-purple-700">{req.tituloMissao}</span></p>
                    <p className="text-xs font-black text-amber-600 mt-1">⭐ Recompensa: {req.xpMissao} XP</p>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => aprovarAtividade(req)} className="flex-1 bg-green-500 text-white font-black py-1.5 rounded-lg border-2 border-green-700 text-xs uppercase">Aprovar</button>
                    <button onClick={() => recusarAtividade(req.id)} className="bg-red-100 text-red-700 font-bold px-3 py-1.5 rounded-lg border-2 border-red-300 text-xs uppercase">Recusar</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Criar Missão */}
          <div className="bg-white border-[6px] border-amber-500 rounded-[2rem] p-6 shadow-[0_8px_0_0_rgba(180,83,9,1)] h-fit">
            <h2 className="text-xl font-black text-amber-800 mb-4">📜 Criar Nova Missão</h2>
            <div className="space-y-4">
              <input type="text" value={titulo} placeholder="Título da Missão" className="w-full p-3 bg-amber-50 border-4 border-amber-300 rounded-xl font-bold" onChange={(e) => setTitulo(e.target.value)} />
              <textarea value={descricao} placeholder="Descrição..." rows="2" className="w-full p-3 bg-amber-50 border-4 border-amber-300 rounded-xl font-bold resize-none" onChange={(e) => setDescricao(e.target.value)}></textarea>
              <input type="number" value={xp} className="w-full p-3 bg-amber-50 border-4 border-amber-300 rounded-xl font-black text-amber-700" onChange={(e) => setXp(e.target.value)} />
              <button onClick={salvarMissao} className="w-full bg-amber-500 border-[4px] border-amber-800 text-white font-black py-3 rounded-2xl shadow-[0_4px_0_0_#92400e]">Lançar Missão</button>
            </div>
          </div>

          {/* Missões Ativas */}
          <div className="bg-white border-[6px] border-green-600 rounded-[2rem] p-6 shadow-[0_8px_0_0_rgba(22,101,52,1)]">
            <h2 className="text-xl font-black text-green-800 mb-4">🗺️ Mapa de Missões ({listaMissoes.length})</h2>
            <div className="overflow-y-auto max-h-[300px] space-y-3">
              {listaMissoes.map((m) => (
                <div key={m.id} className="bg-green-50 border-4 border-green-300 p-3 rounded-xl flex justify-between items-center">
                  <div><h4 className="font-black text-green-800 text-sm">{m.titulo}</h4><p className="text-xs font-bold text-green-600">⭐ {m.xp} XP</p></div>
                  <button onClick={() => excluirMissao(m.id, m.titulo)} className="text-red-500 font-black text-xs uppercase">Excluir</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Diário de Classe & Botão de Reset */}
        <div className="mt-8 bg-white border-[6px] border-blue-500 rounded-[2rem] p-6 shadow-[0_8px_0_0_rgba(37,99,235,1)]">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 pb-2 border-b-4 border-blue-100">
            <h2 className="text-xl font-black text-blue-800 flex items-center gap-2">🏆 Diário: Progresso dos Alunos</h2>
            
            {/* BOTÃO DA SEGUNDA OPÇÃO: Zerar Ranking */}
            <button 
              onClick={zerarRankingDoJogo}
              className="bg-red-500 text-white font-black text-xs uppercase px-4 py-2 rounded-xl border-4 border-red-800 shadow-[0_4px_0_0_#991b1b] active:translate-y-1 active:shadow-none transition-all"
            >
              🗑️ Zerar Ranking
            </button>
          </div>
          
          <div className="space-y-3">
            {listaAlunos.map((aluno) => (
              <div key={aluno.id} className="bg-blue-50 border-4 border-blue-200 p-3 rounded-xl flex justify-between items-center">
                <div>
                  <h3 className="font-black text-blue-900 text-md uppercase">{aluno.nome} <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded ml-2">{aluno.turma || 'Sem Turma'}</span></h3>
                  <p className="text-xs font-bold text-blue-700">Missões validadas: {aluno.missoesCompletas?.length || 0}</p>
                </div>
                <span className="bg-blue-600 text-white border-2 border-blue-800 font-black px-3 py-1 rounded-full text-xs">⭐ {aluno.xp} XP</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}