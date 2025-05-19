import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const login = (email, password) => {
  return api.post('/auth/login', { email, password });
};

// Agent API
export const getAgents = () => {
  return api.get('/agents');
};

export const createAgent = (agentData) => {
  return api.post('/agents', agentData);
};

export const updateAgent = (id, agentData) => {
  return api.put(`/agents/${id}`, agentData);
};

export const deleteAgent = (id) => {
  return api.delete(`/agents/${id}`);
};

// Upload API
export const uploadFile = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getEntries = () => {
  return api.get('/upload/entries');
};

export const getEntriesByAgent = (agentId) => {
  return api.get(`/upload/entries/agent/${agentId}`);
}; 