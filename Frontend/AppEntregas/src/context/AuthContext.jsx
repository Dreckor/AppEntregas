import { createContext, useState, useContext, useEffect } from "react";

import Cookies from "js-cookie";

import {fetchUsersRequets, loginRequets, verifyTokenRequest} from '../api/auth.js';

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
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
  
    const signIn = async (user) => {
        try {
          const res = await loginRequets(user);
          
          setIsAuthenticated(true);
          setUser(res.data);
          
        } catch (error) {
          setErrors([error.response]);
          setIsAuthenticated(false);
        }
      };

      const getUsers = async () =>{
        try {
          const res = await fetchUsersRequets();
          return res.data;
        } catch (error) {
          setErrors([error.response]);
        }
      }

      useEffect(() => {
        const checkLogin = async () => {
          const cookies = Cookies.get();
          if (!cookies.token) {
            setIsAuthenticated(false);
            setLoading(false);
            return;
          }
    
          try {
            const res = await verifyTokenRequest(cookies.token);
            if (!res.data) return setIsAuthenticated(false);
            setIsAuthenticated(true);
            setUser(res.data);
            setLoading(false);
          } catch (error) {
           
            setIsAuthenticated(false);
            setLoading(false);
          }
        };
        checkLogin();
      }, []);
    return (
      <AuthContext.Provider value={{ signIn, user,isAuthenticated,errors, loading, getUsers }}>
        {children}
      </AuthContext.Provider>
    );
  };
