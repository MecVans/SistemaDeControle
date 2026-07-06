import { useState } from 'react';
import GerenciamentoPessoas from './componentes/GerenciamentoPessoas';
import GerenciamentoTransacoes from './componentes/GerenciamentoTransacoes';
import ConsultaTotais from './componentes/ConsultaTotais';

export default function App() {
  const [abaAtiva, setAbaAtiva] = useState<'pessoas' | 'transacoes' | 'totais'>('pessoas');
  const [atualizarChave, setAtualizarChave] = useState(0);

  // Força os componentes a atualizarem seus estados quando há alterações cruzadas
  const dispararAtualizacao = () => {
    setAtualizarChave(prev => prev + 1);
  };

  return (
    // Menu no estilo de abas para melhorar a navegação
    <div style={{ maxWidth: '1000px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ lineHeight: '1.4', textAlign: 'center', padding: '20px 0', 
      borderBottom: '2px solid #eee', paddingBottom: '10px'}}>
        <h1>Sistema de Controle de Gastos Residenciais</h1>
      </header>

      <nav style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
        <button 
          onClick={() => setAbaAtiva('pessoas')}
          style={{
            padding: '10px 20px',
            backgroundColor: abaAtiva === 'pessoas' ? '#333' : '#f0f0f0',
            color: abaAtiva === 'pessoas' ? 'white' : 'black',
            border: '1px solid #ccc',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Moradores (Pessoas)
        </button>
        <button 
          onClick={() => setAbaAtiva('transacoes')}
          style={{
            padding: '10px 20px',
            backgroundColor: abaAtiva === 'transacoes' ? '#333' : '#f0f0f0',
            color: abaAtiva === 'transacoes' ? 'white' : 'black',
            border: '1px solid #ccc',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Transações
        </button>
        <button 
          onClick={() => setAbaAtiva('totais')}
          style={{
            padding: '10px 20px',
            backgroundColor: abaAtiva === 'totais' ? '#333' : '#f0f0f0',
            color: abaAtiva === 'totais' ? 'white' : 'black',
            border: '1px solid #ccc',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Balanço e Totais
        </button>
      </nav>
      
      <main style={{ marginTop: '20px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#fafafa' }}>
        {abaAtiva === 'pessoas' && (
          <GerenciamentoPessoas onAtualizarDados={dispararAtualizacao} />
        )}
        {abaAtiva === 'transacoes' && (
          <GerenciamentoTransacoes onAtualizarDados={dispararAtualizacao} />
        )}
        {abaAtiva === 'totais' && (
          <ConsultaTotais atualizarChave={atualizarChave} />
        )}
      </main>
    </div>
  );
}