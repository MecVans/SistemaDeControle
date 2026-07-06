import axios from 'axios';

// Centraliza a URL do Back-end .NET. Porta padrão (5211) vinculada a API.
const api = axios.create({
  baseURL: 'http://localhost:5211/api',
});

export default api;