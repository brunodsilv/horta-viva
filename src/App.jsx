import React, { useState } from 'react';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [telaAtual, setTelaAtual] = useState('login');

  // O App agora só repassa a função "setTelaAtual" para as páginas saberem como mudar de tela
  if (telaAtual === 'login') return <Login setTelaAtual={setTelaAtual} />;
  if (telaAtual === 'cadastro') return <Cadastro setTelaAtual={setTelaAtual} />;
  if (telaAtual === 'dashboard') return <Dashboard setTelaAtual={setTelaAtual} />;

  return null;
}