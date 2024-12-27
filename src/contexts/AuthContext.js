import React, { createContext, useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAxiosInterceptors } from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loaderCount, setLoaderCount] = useState(0);
  const navigate = useNavigate();

  const login = (userData) => {
    localStorage.setItem('token', userData.token);
    setUser(userData); 
    if (userData.role === 'Admin') {
      navigate('/admin/dashboard');
    } else if (userData.role === 'Manager') {
      navigate('/manager/dashboard');
    } else if (userData.role === 'Guest') {
      navigate('/guest/properties');
    }
  };

  const incrementLoader = useCallback(() => setLoaderCount((prev) => prev + 1), []);
  const decrementLoader = useCallback(() => setLoaderCount((prev) => prev - 1), []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    navigate('/login');
  };
  useAxiosInterceptors(incrementLoader, decrementLoader);
 
  return (
    <AuthContext.Provider value={{ user, login, logout, incrementLoader, decrementLoader, loaderCount }}>
      {children}
    </AuthContext.Provider>
  );
};
