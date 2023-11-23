import axios from 'axios';
const apiEndpoint = process.env.REACT_APP_API_ENDPOINT;
const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
    //   'Content-Type': 'application/json',
    //   'Accept-Language': 'ja',
    },
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      const authTokens = localStorage.getItem('token');
      const token = authTokens
      console.log(authTokens)
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  axiosInstance.interceptors.response.use(
    (response) => response)

const axiosPrivate = axiosInstance;

    
export { axiosPrivate};