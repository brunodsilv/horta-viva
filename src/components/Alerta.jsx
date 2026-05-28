// src/components/Alerta.jsx
import React from 'react';

export default function Alerta({ texto, tipo }) {
  // Se não houver texto para mostrar, o componente "some" da tela automaticamente
  if (!texto) return null;

  // Lógica para decidir as cores baseadas no tipo de alerta
  const ehErro = tipo === 'erro';
  const estiloCores = ehErro 
    ? 'bg-red-100 border-red-500 text-red-700' 
    : 'bg-green-100 border-green-500 text-green-700';

  return (
    <div className={`mb-6 p-4 border-4 rounded-xl font-black text-center uppercase tracking-wide ${estiloCores} animate-fadeIn`}>
      {texto}
    </div>
  );
}