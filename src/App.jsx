import { useState } from 'react';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Dashboard from './pages/Dashboard';
import PainelProfessor from './pages/PainelProfessor';
import MapaMissoes from './pages/MapaMissoes';
import Ranking from './pages/Ranking'; 

export default function App() {
  const [telaAtual, setTelaAtual] = useState('login');

  if (telaAtual === 'login') return <Login setTelaAtual={setTelaAtual} />;
  if (telaAtual === 'cadastro') return <Cadastro setTelaAtual={setTelaAtual} />;
  if (telaAtual === 'dashboard') return <Dashboard setTelaAtual={setTelaAtual} />;
  if (telaAtual === 'painel-professor') return <PainelProfessor setTelaAtual={setTelaAtual} />;
  if (telaAtual === 'mapa-missoes') return <MapaMissoes setTelaAtual={setTelaAtual} />;
  if (telaAtual === 'ranking') return <Ranking setTelaAtual={setTelaAtual} />; 

  return null;
}