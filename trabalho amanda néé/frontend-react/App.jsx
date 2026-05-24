
import React, { useState } from 'react';

export default function App() {
  const [saldo, setSaldo] = useState(1500);

  const entrada = () => setSaldo(saldo + 100);
  const saida = () => setSaldo(saldo - 100);

  return (
    <div>
      <h1>Fintech Dashboard</h1>
      <h2>Saldo Atual: R$ {saldo}</h2>

      <button onClick={entrada}>Adicionar Dinheiro</button>
      <button onClick={saida}>Remover Dinheiro</button>
    </div>
  );
}
