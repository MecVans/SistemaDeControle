# Sistema de Controle de Gastos Residenciais

Este é um sistema completo para gestão e controle de despesas e receitas residenciais. O projeto foi desenvolvido com uma arquitetura dividida entre uma API no Back-end e uma interface dinâmica no Front-end.

## Funcionalidades Principais
- **Cadastro de Moradores:** Sistema seguro com geração de IDs numéricos aleatórios de 6 dígitos à prova de duplicação.
- **Regras específicas com validações definidas:**
  - Menores de 18 anos são impedidos de cadastrar receitas (apenas despesas são permitidas).
  - Filtro para aceitar apenas transações válidas (Maiores que R$ 0).
  - Validação de idade estrita entre 0 e 150 anos.
  - Restrição de nomes apenas para letras (Com acento, padrão brasileiro) e espaços. Sem letras ou caracteres especiais.
- **Aba de transações**: Aba com informações das transações por usuário, com busca por nome ou ID da pessoa, para facilitar a identificação.
- **Balanço Geral:** Resumo das receitas, despesas e saldo líquido individual e coletivo.

## Tecnologias Utilizadas
- **Back-end:** C#, .NET 10.0, ASP.NET Core Web API, Entity Framework Core, SQLite.
- **Front-end:** React, TypeScript, Vite.

## Como Executar o Projeto

Você pode escolher uma das duas formas abaixo para rodar o sistema:

### Opção 1: Execução Simplificada com Docker (Recomendado)
Certifique-se de ter o Docker instalado e execute o comando abaixo na raiz do projeto:

```
docker-compose up --build
```

Após a compilação, acesse o sistema pelo navegador em: http://localhost:5173

### Opção 2: Execução Manual

Navegue até a pasta do back-end: Atualmente sendo o diretório "ControleDeGastos" (sem aspas)
Execute o comando para restaurar as dependências e iniciar a API: 
```
dotnet run
```
A API inicializará e o banco de dados SQLite (gastos.db) será criado automaticamente.

Executando o Front-end (React): 
Abra um novo terminal (recomendo o **Command Prompt**) e navegue até a pasta do front-end, que atualmente é a "ControleDeGastosFront" (sem aspas):
Instale as dependências necessárias com o comando:
```
npm install
```

Inicie o servidor de desenvolvimento do Vite:
```
npm run dev
```

Após a inicialização, acesse o sistema pelo navegador em: http://localhost:5173
