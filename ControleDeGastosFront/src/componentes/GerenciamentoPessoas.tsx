import React, { useState, useEffect } from 'react';
import api from '../api';

// Definição da estrutura de dados com base no modelo C#
interface Pessoa {
  id?: string;
  nome: string;
  idade: number;
}

interface GerenciamentoPessoasProps {
  onAtualizarDados: () => void; // Função para atualizar os totais na outra tela quando uma pessoa for criada/deletada
}

export default function GerenciamentoPessoas({ onAtualizarDados }: GerenciamentoPessoasProps) {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [erro, setErro] = useState('');

  // Busca a lista de pessoas cadastradas ao carregar o componente
  const carregarPessoas = async () => {
    try {
      const resposta = await api.get('/pessoas');
      setPessoas(resposta.data);
    } catch (err) {
      console.error("Erro ao buscar pessoas:", err);
    }
  };

  useEffect(() => {
    carregarPessoas();
  }, []);

  // Envia o formulário de cadastro para a API .NET
  const handleCadastro = async (e: React.SubmitEvent) => {
  e.preventDefault();
  setErro('');

  const idadeNum = parseInt(idade);

  // Trava preventiva no Front-end para preenchimento do Nome e Idade.
  if (!nome.trim() || idade.trim() === '') {
    setErro('Por favor, preencha todos os campos.');
    return;
  }

  // Tratamento para evitar que o usuário cadastre uma idade inválida
  if (isNaN(idadeNum) || idadeNum < 0 || idadeNum > 150) {
    setErro('A idade deve ser um número entre 0 e 150 anos.');
    return;
  }

  try {
    await api.post('/pessoas', {
      nome,
      idade: idadeNum
    });
    setNome('');
    setIdade('');
    carregarPessoas();
    onAtualizarDados(); // Atualiza o dashboard global
  } catch (err: any) {
    // Seção para informar se algum erro foi encontrado ao tentar cadastrar uma pessoa
    setErro(err.response?.data || 'Erro ao cadastrar pessoa.');
  }
};

  // Seção para deletar a pessoa e apagar transações da pessoa (em cascata)
  const handleDeletar = async (id: string) => {
    if (window.confirm('Atenção: Ao deletar esta pessoa, todas as suas transações serão apagadas. Confirmar?')) {
      try {
        await api.delete(`/pessoas/${id}`);
        carregarPessoas();
        onAtualizarDados();
      } catch (err) {
        console.error("Erro ao deletar pessoa:", err);
      }
    }
  };

  return (
    // Seção de exibição na tela, já com CSS personalizado para boa visualização
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ color: '#2c3e50', marginBottom: '15px' }}>Cadastro de Pessoas</h2>
      
      <form onSubmit={handleCadastro} style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input 
          type="text" 
          placeholder="Nome Completo" 
          value={nome} 
          onChange={(e) => setNome(e.target.value)}
          style={{ padding: '8px', width: '250px' }}
        />
        <input 
          type="number" 
          placeholder="Idade" 
          min="0"
          max="150"
          value={idade} 
          onChange={(e) => setIdade(e.target.value)}
          style={{ padding: '8px', width: '80px' }}
        />
        <button type="submit" style={{ padding: '8px 15px', backgroundColor: '#2e7d32', color: 'white', border: 'none', cursor: 'pointer' }}>
          Cadastrar
        </button>
      </form>

      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      <h3 style={{ color: '#2c3e50', textAlign: 'left', marginBottom: '10px' }}>Listagem de Usuários</h3>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'left', color: '#333' }}>ID único</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'left', color: '#333' }}>Nome</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'left', color: '#333' }}>Idade</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'left', color: '#333' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {pessoas.map((p) => (
            <tr key={p.id}>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd', fontSize: '12px', color: '#666', textAlign: 'left' }}>{p.id}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'left' }}>{p.nome}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'left' }}>{p.idade} anos</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'left' }}>
                <button onClick={() => handleDeletar(p.id!)} style={{ backgroundColor: '#d32f2f', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}