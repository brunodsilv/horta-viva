import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, onSnapshot, addDoc, doc, getDoc } from 'firebase/firestore';
import Cabecalho from '../components/Cabecalho';
import CardMissao from '../components/CardMissao';
import Carregamento from '../components/Carregamento';

export default function MapaMissoes({ setTelaAtual }) {
  const [missoes, setMissoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [completandoId, setCompletandoId] = useState(null);

  useEffect(() => {
    const referenciarMissoes = collection(db, "missoes");
    const pararObservacao = onSnapshot(referenciarMissoes, (snapshot) => {
      const dadosMissoes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMissoes(dadosMissoes);
      setCarregando(false);
    });
    return () => pararObservacao();
  }, []);

  const enviarParaAprovacao = async (idMissao, tituloMissao, xpMissao) => {
    const usuarioAtual = auth.currentUser;
    if (!usuarioAtual) {
      alert("Erro: Utilizador não identificado.");
      return;
    }

    setCompletandoId(idMissao);

    try {
      const usuarioRef = doc(db, "usuarios", usuarioAtual.uid);
      const usuarioSnap = await getDoc(usuarioRef);

      if (usuarioSnap.exists()) {
        const dadosUsuario = usuarioSnap.data();

        await addDoc(collection(db, "solicitacoes"), {
          alunoId: usuarioAtual.uid,
          alunoNome: dadosUsuario.nome,
          alunoTurma: dadosUsuario.turma || "Não informada",
          idMissao: idMissao,
          tituloMissao: tituloMissao,
          xpMissao: Number(xpMissao),
          status: "pendente",
          dataSolicitacao: new Date().toISOString()
        });

        alert(`🚀 Missão enviada! Avisa o teu professor para ele validar a tua atividade e libertar os teus +${xpMissao} XP!`);
      }
    } catch (error) {
      console.error("Erro ao enviar solicitação: ", error);
      alert("Houve um erro ao enviar o teu progressos.");
    } finally {
      setCompletandoId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#eef7ec] p-6 font-sans text-amber-950 flex flex-col items-center">
      <div className="max-w-4xl w-full">
        
        <Cabecalho 
          titulo="Quadro de Missões" 
          icone="🗺️" 
          aoClicarVoltar={() => setTelaAtual('dashboard')} 
          tema="green" 
        />

        {carregando ? (
          <Carregamento mensagem="🗺️ Carregando missões..." />
        ) : missoes.length === 0 ? (
          <div className="bg-white border-4 border-amber-400 rounded-2xl p-8 text-center shadow-md">
            <p className="text-xl font-bold text-amber-800">O Mestre ainda não lançou nenhuma missão no mapa! 🍃</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {missoes.map((missao) => (
              <CardMissao 
                key={missao.id} 
                titulo={missao.titulo} 
                descricao={missao.descricao} 
                xp={missao.xp}
              >
                <button 
                  onClick={() => enviarParaAprovacao(missao.id, missao.titulo, missao.xp)}
                  disabled={completandoId === missao.id}
                  className="w-full bg-green-500 border-4 border-green-800 text-white font-black py-3 rounded-xl shadow-[0_4px_0_0_#166534] active:shadow-none active:translate-y-[4px] disabled:opacity-50 transition-all uppercase tracking-wide text-sm"
                >
                  {completandoId === missao.id ? 'A enviar...' : 'Realizei esta Missão ✔'}
                </button>
              </CardMissao>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}