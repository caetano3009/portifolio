
import React, { useState } from 'react';

function App() {
  const [saldo, setSaldo] = useState(1500);

  const adicionar = () => {
    setSaldo(saldo + 100);
  };

  const remover = () => {
    setSaldo(saldo - 100);
  };

  return (
    <div>
      <h1>Fintech Dashboard</h1>
      <h2>Saldo: R$ {saldo}</h2>

      <button onClick={adicionar}>Adicionar</button>
      <button onClick={remover}>Remover</button>
    </div>
  );
}

export default App;
