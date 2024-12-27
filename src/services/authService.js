import {axiosInstance} from "../api/axios"

const authService = {
    login: (email, password) => {
      return axiosInstance.post('/auth/login', { email, password });
    },
    register: (data) => {
      return axiosInstance.post('/auth/register', data);
    },
    getManagers: () => { 
      return axiosInstance.get('/auth/managers');
    }
}

export default authService;