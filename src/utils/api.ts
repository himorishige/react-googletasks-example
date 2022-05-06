import axios from 'axios';

export const api = axios.create({
  timeout: 10000, // 10s
});

api.interceptors.response.use(
  (response) => {
    return Promise.resolve(response);
  },
  (error) => {
    return Promise.reject(error);
  },
);
