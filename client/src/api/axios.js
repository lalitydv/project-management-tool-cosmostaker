// src/api/axios.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://pmt-cosmostaker-node.onrender.com/api',
});
// Attach token to every request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export default API;
