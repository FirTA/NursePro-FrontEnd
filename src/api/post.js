import axios from "axios";

export const APIWithoutHeader = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});


export const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to set Authorization dynamically before each request
API.interceptors.request.use(
  (config) => {
 
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);



API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        const response = await APIWithoutHeader.post("/refresh-token/", {
          refresh : refreshToken,
        });
        const { access } = response.data;

        localStorage.setItem("access_token", access);
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return API(originalRequest);
      } catch (error) {
        console.log(error);
        localStorage.clear()
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const validateToken = (token) => {
  return API.post("verifytoken/", { token: token });
};
