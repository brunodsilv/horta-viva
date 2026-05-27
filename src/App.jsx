// src/App.jsx
import { useState } from 'react';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Dashboard from './pages/Dashboard';
import PainelProfessor from './pages/PainelProfessor'; // Importamos a nova tela

export default function App() {
  const [telaAtual, setTelaAtual] = useState('login');

  if (telaAtual === 'login') return <Login setTelaAtual={setTelaAtual} />;
  if (telaAtual === 'cadastro') return <Cadastro setTelaAtual={setTelaAtual} />;
  if (telaAtual === 'dashboard') return <Dashboard setTelaAtual={setTelaAtual} />;
  if (telaAtual === 'painel-professor') return <PainelProfessor setTelaAtual={setTelaAtual} />;

  return null;
}