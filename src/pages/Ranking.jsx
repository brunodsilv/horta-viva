import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import Cabecalho from "../components/Cabecalho";

export default function Ranking({ setTelaAtual }) {
  const [alunos, setAlunos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const referenciarUsuarios = collection(db, "usuarios");

    // o ranking atualiza em tempo real!
    const pararObservacao = onSnapshot(referenciarUsuarios, (snapshot) => {
      const listaAlunos = [];
      snapshot.forEach((doc) => {
        const dados = doc.data();
        if (dados.tipo === "Aluno") {
          // Puxa o aluno e garante que o XP seja 0 caso ele tenha acabado de criar a conta
          listaAlunos.push({ id: doc.id, nome: dados.nome, xp: dados.xp || 0 });
        }
      });

      // ordena do maior XP para o menor
      listaAlunos.sort((a, b) => b.xp - a.xp);

      setAlunos(listaAlunos);
      setCarregando(false);
    });

    return () => pararObservacao();
  }, []);

  return (
    <div className="min-h-screen bg-[#eef7ec] p-6 font-sans text-amber-950 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        <Cabecalho
          titulo="Ranking da Horta"
          icone="🏆"
          aoClicarVoltar={() => setTelaAtual("dashboard")}
          tema="amber"
        />

        {/* Lista do Ranking */}
        <div className="bg-white border-[6px] border-amber-500 rounded-[2rem] p-6 shadow-[0_8px_0_0_rgba(180,83,9,1)]">
          {carregando ? (
            <p className="text-center font-black text-amber-700 animate-pulse uppercase">
              Calculando pontuações...
            </p>
          ) : alunos.length === 0 ? (
            <p className="text-center font-bold text-amber-800">
              Nenhum aluno registrado na horta ainda!
            </p>
          ) : (
            <div className="space-y-4">
              {alunos.map((aluno, index) => {
                // Lógica para dar cores diferentes para os 3 primeiros colocados
                let medalha = "";
                let corFundo = "bg-amber-50";
                let corBorda = "border-amber-200";

                if (index === 0) {
                  medalha = "🥇";
                  corFundo = "bg-yellow-100";
                  corBorda = "border-yellow-400";
                } else if (index === 1) {
                  medalha = "🥈";
                  corFundo = "bg-gray-100";
                  corBorda = "border-gray-400";
                } else if (index === 2) {
                  medalha = "🥉";
                  corFundo = "bg-orange-100";
                  corBorda = "border-orange-400";
                } else {
                  medalha = `${index + 1}º`;
                }

                return (
                  <div
                    key={aluno.id}
                    className={`flex justify-between items-center p-4 border-4 ${corBorda} ${corFundo} rounded-xl transition-all hover:scale-[1.02]`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-black w-8 text-center">
                        {medalha}
                      </span>
                      <span className="text-xl font-black text-amber-900 uppercase">
                        {aluno.nome}
                      </span>
                    </div>
                    <span className="bg-amber-500 text-white border-[3px] border-amber-800 font-black px-4 py-2 rounded-full shadow-[0_3px_0_0_#92400e]">
                      {aluno.xp} XP
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
