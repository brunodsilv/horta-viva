import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Alerta from "../components/Alerta";

export default function Cadastro({ setTelaAtual }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tipo, setTipo] = useState("Aluno");

  const [turma, setTurma] = useState("");
  const [materia, setMateria] = useState("");
  const [codigoSeguranca, setCodigoSeguranca] = useState(""); // NOVO: Estado para a chave secreta

  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const lidarComCadastro = async (e) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    if (!nome || !email || !senha) {
      setErro("Preencha todos os campos obrigatórios!");
      setCarregando(false);
      return;
    }

    if (tipo === "Aluno" && !turma) {
      setErro("Por favor, informe a sua Turma/Série (Ex: 6º D).");
      setCarregando(false);
      return;
    }

    // BLOQUEIO DE SEGURANÇA DO PROFESSOR
    if (tipo === "Professor") {
      if (!materia) {
        setErro("Por favor, informe a Matéria que você leciona.");
        setCarregando(false);
        return;
      }

      // ⚠️ ALTERE AQUI A SUA PALAVRA-CHAVE SECRETA
      if (codigoSeguranca !== "PROFEURICO2026") {
        setErro(
          "Código de segurança incorreto! Acesso de professor negado. 🛑",
        );
        setCarregando(false);
        return;
      }
    }

    try {
      const credencial = await createUserWithEmailAndPassword(
        auth,
        email,
        senha,
      );
      const usuario = credencial.user;

      const dadosUsuario = {
        nome: nome,
        email: email,
        tipo: tipo,
        xp: 0,
        missoesCompletas: [],
      };

      if (tipo === "Aluno") dadosUsuario.turma = turma;
      if (tipo === "Professor") dadosUsuario.materia = materia;

      await setDoc(doc(db, "usuarios", usuario.uid), dadosUsuario);

      alert("Conta criada com sucesso! Bem-vindo ao jogo.");
      setTelaAtual("dashboard");
    } catch (err) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        setErro("Este e-mail já está em uso.");
      } else if (err.code === "auth/weak-password") {
        setErro("A senha deve ter pelo menos 6 caracteres.");
      } else {
        setErro("Erro ao criar conta. Tente novamente.");
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eef7ec] flex items-center justify-center p-4 font-sans">
      <div className="bg-white border-[6px] border-green-700 rounded-[2rem] p-8 max-w-md w-full shadow-[0_8px_0_0_#166534]">
        <h2 className="text-3xl font-black text-center text-green-800 uppercase tracking-wide mb-2">
          Criar Conta
        </h2>
        <p className="text-center font-bold text-amber-900 text-sm mb-6">
          Entre nessa jornada verde!
        </p>

        <Alerta texto={erro} tipo="erro" />

        <form onSubmit={lidarComCadastro} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-green-900 uppercase mb-1">
              Nome Completo
            </label>
            <input
              type="text"
              placeholder="Ex: Maria Gomes"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full p-3 bg-green-50 border-4 border-green-200 rounded-xl font-bold focus:outline-none focus:border-green-600"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-green-900 uppercase mb-1">
              E-mail
            </label>
            <input
              type="email"
              placeholder="email@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-green-50 border-4 border-green-200 rounded-xl font-bold focus:outline-none focus:border-green-600"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-green-900 uppercase mb-1">
              Senha
            </label>
            <input
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full p-3 bg-green-50 border-4 border-green-200 rounded-xl font-bold focus:outline-none focus:border-green-600"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-green-900 uppercase mb-1">
              Quem é você?
            </label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full p-3 bg-green-50 border-4 border-green-200 rounded-xl font-black text-green-800 focus:outline-none focus:border-green-600"
            >
              <option value="Aluno">🎒 Sou Aluno</option>
              <option value="Professor">👨‍🏫 Sou Professor</option>
            </select>
          </div>

          {/* RENDERIZAÇÃO CONDICIONAL */}
          {tipo === "Aluno" ? (
            <div className="animate-fadeIn">
              <label className="block text-xs font-black text-blue-900 uppercase mb-1">
                Série / Turma
              </label>
              <input
                type="text"
                placeholder="Ex: 6D"
                value={turma}
                onChange={(e) => setTurma(e.target.value)}
                className="w-full p-3 bg-blue-50 border-4 border-blue-200 rounded-xl font-bold focus:outline-none focus:border-blue-600"
              />
            </div>
          ) : (
            <div className="animate-fadeIn space-y-4">
              <div>
                <label className="block text-xs font-black text-amber-900 uppercase mb-1">
                  Matéria / Disciplina
                </label>
                <input
                  type="text"
                  placeholder="Ex: Ciências, Biologia"
                  value={materia}
                  onChange={(e) => setMateria(e.target.value)}
                  className="w-full p-3 bg-amber-50 border-4 border-amber-200 rounded-xl font-bold focus:outline-none focus:border-amber-600"
                />
              </div>

              {/* CAMPO DE SEGURANÇA REINSERIDO */}
              <div>
                <label className="block text-xs font-black text-red-900 uppercase mb-1">
                  Código de Segurança 🔐
                </label>
                <input
                  type="password"
                  placeholder="Palavra-chave do Mestre"
                  value={codigoSeguranca}
                  onChange={(e) => setCodigoSeguranca(e.target.value)}
                  className="w-full p-3 bg-red-50 border-4 border-red-200 rounded-xl font-bold focus:outline-none focus:border-red-600"
                />
                <p className="text-[10px] text-red-700 mt-1 font-bold text-center">
                  Apenas professores autorizados possuem este código.
                </p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="w-full mt-2 bg-green-500 border-4 border-green-800 text-white font-black py-3 rounded-xl shadow-[0_4px_0_0_#166534] active:translate-y-1 active:shadow-none transition-all uppercase tracking-wide"
          >
            {carregando ? "Criando Jornada..." : "Começar Aventura!"}
          </button>
        </form>

        <p className="text-center text-xs font-bold text-amber-900 mt-6">
          Já tem uma conta?{" "}
          <button
            onClick={() => setTelaAtual("login")}
            className="text-green-700 font-black hover:underline"
          >
            Fazer Login
          </button>
        </p>
      </div>
    </div>
  );
}
