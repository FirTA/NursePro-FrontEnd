import axios from 'axios';


export const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',    
  headers: {
      'Content-Type': 'application/json',
  }
});

export const APIRequestWithHeaders = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    Authorization: localStorage.getItem("access_token")
      ? `Bearer ${localStorage.getItem("access_token")}`
      : "",
  },
});


export const validateToken = (token) => {
  return APIRequestWithHeaders.post('verifytoken/', { token: token });
};
