import { createContext, useState, useContext } from "react";

import {loginRequets} from '../api/auth.js';

export const AuthContext =  createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error("useAuth debe usarse con un AuthProvider");
    }
    return context;
  };

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
  
    const signIn = async (user) => {
        try {
          const res = await loginRequets(user);
          setUser(res.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.log(error);
         
        }
      };
  
    return (
      <AuthContext.Provider value={{ signIn, user,isAuthenticated }}>
        {children}
      </AuthContext.Provider>
    );
  };
