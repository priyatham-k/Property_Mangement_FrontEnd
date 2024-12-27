import axios from 'axios';
import { useEffect } from 'react';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json', 
  },
});

const useAxiosInterceptors = (incrementLoader, decrementLoader) => {
    useEffect(() => {
      const requestInterceptor = axiosInstance.interceptors.request.use(
        (config) => {
          incrementLoader();
          const token = localStorage.getItem('token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
        },
        (error) => {
          decrementLoader();
          return Promise.reject(error);
        }
      );
  
      const responseInterceptor = axiosInstance.interceptors.response.use(
        (response) => {
          decrementLoader();
          return response;
        },
        (error) => {
          decrementLoader();
          return Promise.reject(error);
        }
      );
      return () => {
        axiosInstance.interceptors.request.eject(requestInterceptor);
        axiosInstance.interceptors.response.eject(responseInterceptor);
      };
    }, [incrementLoader, decrementLoader]);
};



export {axiosInstance, useAxiosInterceptors};
