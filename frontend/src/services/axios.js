import axios from "axios";
import  store  from "../store/index";
import { clearCredentials } from "../store/slices/authSlice";

const api = axios.create({
  baseURL: "https://edviron-software-developer-assessment-xeqi.onrender.com/api",
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      store.dispatch(clearCredentials());
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
