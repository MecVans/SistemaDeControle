import { useEffect, useState } from 'react';
import api from '../api';

// Arquivo responsável por receber os dados e calcular as transações para a aba "Balanço e Totais"
interface TotaisPessoa {
  id: string;
  nome: string;
  idade: number;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

interface ResumoGeral {
  totalReceitas: number;
  totalDespesas: number;
  saldoLiquido: number;
}

interface ConsultaTotaisProps {
  atualizarChave: number; // Força a atualização da tabela se houver mudanças nas outras abas
}

export default function ConsultaTotais({ atualizarChave }: ConsultaTotaisProps) {
  const [pessoasTotais, setPessoasTotais] = useState<TotaisPessoa[]>([]);
  const [resumo, setResumo] = useState<ResumoGeral | null>(null);

  const carregarTotais = async () => {
    try {
      const resposta = await api.get('/pessoas/totais');
      setPessoasTotais(resposta.data.pessoas);
      setResumo(resposta.data.resumoGeral);
    } catch (err) {
      console.error("Erro ao buscar painel de totais:", err);
    }
  };

  useEffect(() => {
    carregarTotais();
  }, [atualizarChave]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ color: '#2c3e50', marginBottom: '10px' }}>Consulta de Totais por Residente</h2>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr style={{ backgroundColor: '#e0e0e0' }}>
            <th style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'left', color: '#333' }}>Morador</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'left', color: '#333' }}>Idade</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #ccc', textAlign: 'left', color: 'green' }}>(+) Receitas</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #ccc', textAlign: 'left', color: 'red' }}>(-) Despesas</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #ccc', textAlign: 'left', color: '#333' }}>(=) Saldo Individual</th>
          </tr>
        </thead>
        <tbody>
          {pessoasTotais.map((p) => (
            <tr key={p.id}>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'left', fontWeight: 'bold' }}>{p.nome}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'left' }}>{p.idade} anos</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd', color: 'green', textAlign: 'left' }}>R$ {p.totalReceitas.toFixed(2)}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd', color: 'red', textAlign: 'left' }}>R$ {p.totalDespesas.toFixed(2)}</td>
              <td style={{ 
                padding: '10px', 
                borderBottom: '1px solid #ddd',
                fontWeight: 'bold', textAlign: 'left',
                color: p.saldo >= 0 ? '#1b5e20' : '#b71c1c'
              }}>
                R$ {p.saldo.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {resumo && (
        <div style={{ 
          marginTop: '30px', 
          padding: '20px', 
          backgroundColor: '#eceff1', 
          borderRadius: '4px',
          borderLeft: '6px solid #37474f'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>Balanço Geral Residencial</h3>
          <p><strong>Total de Receitas Acumulado:</strong> <span style={{ color: 'green' }}>R$ {resumo.totalReceitas.toFixed(2)}</span></p>
          <p><strong>Total de Despesas Acumulado:</strong> <span style={{ color: 'red' }}>R$ {resumo.totalDespesas.toFixed(2)}</span></p>
          <hr />
          <h4 style={{ margin: '10px 0 0 0', color: '#2c3e50' }}>
            Saldo Líquido Geral: {' '}
            <span style={{ color: resumo.saldoLiquido >= 0 ? 'green' : 'red' }}>
              R$ {resumo.saldoLiquido.toFixed(2)}
            </span>
          </h4>
        </div>
      )}
    </div>
  );
}