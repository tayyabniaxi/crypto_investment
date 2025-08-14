// export const API_BASE_URL = 'http://54.166.130.30:5000/api';
 export const API_BASE_URL = 'http://localhost:5000/api';

export const buildApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};