import React, { useState, useEffect } from 'react';
import api from '../api';

interface Pessoa {
  id: string;
  nome: string;
  idade: number;
}

interface Transacao {
  id?: string;
  descricao: string;
  valor: number;
  tipo: string;
  pessoaId: string;
  nomePessoa?: string;
}

interface GerenciamentoTransacoesProps {
  onAtualizarDados: () => void; // Função para atualizar os totais na outra tela quando uma pessoa for criada/deletada
}

export default function GerenciamentoTransacoes({ onAtualizarDados }: GerenciamentoTransacoesProps) {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState('despesa');
  const [pessoaId, setPessoaId] = useState('');
  const [erro, setErro] = useState('');
  const [busca, setBusca] = useState(''); // Guarda o texto digitado na barra de pesquisa

  const carregarDados = async () => {
    try {
      const resTransacoes = await api.get('/transacoes');
      setTransacoes(resTransacoes.data);

      const resPessoas = await api.get('/pessoas');
      setPessoas(resPessoas.data);
    } catch (err) {
      console.error("Erro ao carregar transações/pessoas:", err);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleCadastro = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setErro('');

    // Filtro para que os campos da transação sejam preenchidos
    if (!descricao.trim() || !valor || !pessoaId) {
      setErro('Por favor, preencha todos os campos.');
      return;
    }

    // Filtro para que apenas transações válidas sejam cadastradas
    if (parseFloat(valor) <= 0) {
      setErro('O valor da transação deve ser maior que zero.');
      return;
    }

    try {
      await api.post('/transacoes', {
        descricao,
        valor: parseFloat(valor),
        tipo,
        pessoaId
      });

      setDescricao('');
      setValor('');
      carregarDados();
      onAtualizarDados(); // Atualiza o painel
    } catch (err: any) {
      // Exibe possíveis erros de validação do back-end
      setErro(err.response?.data || 'Erro ao registrar transação.');
    }
  };

  return (
    // Seção de exibição em tela, já com o CSS feito para melhorar a visualização
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ color: '#2c3e50', marginBottom: '15px' }}>Cadastro de Transações</h2>

      <form onSubmit={handleCadastro} style={{ marginBottom: '20px', display: 'grid', gap: '10px', maxWidth: '400px' }}>
        <input 
          type="text" 
          placeholder="Descrição (ex: Supermercado, Salário)" 
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          style={{ padding: '8px' }}
        />
        <input 
          type="number" 
          step="0.01"
          min="0.01" // Impede que o usuário digite ou selecione valores menores que 0.01 pelas setas
          placeholder="Valor (R$)"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          style={{ padding: '8px' }}
        />
        <select value={tipo} onChange={(e) => setTipo(e.target.value)} style={{ padding: '8px' }}>
          <option value="despesa">Despesa</option>
          <option value="receita">Receita</option>
        </select>

        <select 
          value={pessoaId} 
          onChange={(e) => setPessoaId(e.target.value)}
          style={{ padding: '8px', width: '280px' }}
        >
          <option value="">Selecione um Morador</option>
          {pessoas.map((pessoa) => (
            <option key={pessoa.id} value={pessoa.id}>
              {pessoa.nome} (ID: {pessoa.id} • {pessoa.idade} anos)
            </option>
          ))}
        </select>

        <button type="submit" style={{ padding: '10px', backgroundColor: '#0288d1', color: 'white', border: 'none', cursor: 'pointer' }}>
          Registrar Transação
        </button>
      </form>

      {erro && <p style={{ color: 'red', fontWeight: 'bold' }}>{erro}</p>}

      {/* Configuração visual da barra de pesquisa */}
      <div style={{ marginBottom: '15px', marginTop: '20px' }}>
      <input 
      type="text" 
      placeholder="Buscar por Nome/ID do morador..." 
      value={busca}
      onChange={(e) => setBusca(e.target.value)}
      style={{ padding: '8px', width: '100%', maxWidth: '400px', borderRadius: '4px', border: '1px solid #ccc', }}
      />
      </div>

      <h3>Histórico de Lançamentos</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5'}}>
            <th style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'left', color: '#333' }}>Descrição</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'left', color: '#333' }}>Pessoa</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'left', color: '#333' }}>Tipo</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'left', color: '#333' }}>Valor</th>
          </tr>
        </thead>
        <tbody>
          {transacoes
            // Configura a barra de busca na tela de transações
            .filter(t => 
            t.nomePessoa?.toLowerCase().includes(busca.toLowerCase()) || 
            t.pessoaId.toString().includes(busca)
            ) .map((t) => (
            <tr key={t.id}>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'left' }}>{t.descricao}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'left' }}>{t.nomePessoa}</td>
              <td style={{ 
                padding: '10px', 
                borderBottom: '1px solid #ddd', 
                color: t.tipo === 'receita' ? 'green' : 'red',
                fontWeight: 'bold', textAlign: 'left'
              }}>
                {t.tipo.toUpperCase()}
              </td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd',
              textAlign: 'left', color: '#333'
               }}>
                R$ {t.valor.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}