import { createContext, useState, useContext, useEffect } from "react";
import { fetchUsersRequets } from "../api/auth.js";
import { updateUserRequest, deleteUserRequest, createUserRequest } from "../api/users.js";

export const UserContext = createContext();

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};

export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [repartidores, setRepartidores] = useState([]);
    const [administradores, setAdministradores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetchUsersRequets();
            setUsers(res.data.users);
            setRepartidores(res.data.repartidores);
            setAdministradores(res.data.administradores);
        } catch (err) {
            setError(err.response ? err.response.data : "Server error");
        } finally {
            setLoading(false);
        }
    };

    const createUser = async (user) => {
        try {
            const res = await createUserRequest(user);
            if(res.status != 200){
                throw new Error(res)
            }
        }
         catch (err) {
            setError(err.response ? err.response.data : "Server error");
        }
    }

    const updateUser = async (id, updatedData) => {
        try {
            const res = await updateUserRequest(id, updatedData);
            const updatedUser = res.data;

            // Update user in the respective role array
            if (updatedUser.role === "user") {
                setUsers(prevUsers => prevUsers.map(user => (user.id === id ? updatedUser : user)));
            } else if (updatedUser.role === "repartidor") {
                setRepartidores(prevRepartidores => prevRepartidores.map(user => (user.id === id ? updatedUser : user)));
            } else if (updatedUser.role === "admin") {
                setAdministradores(prevAdministradores => prevAdministradores.map(user => (user.id === id ? updatedUser : user)));
            }
        } catch (err) {
            setError(err.response ? err.response.data : "Server error");
        }
    };

    const deleteUser = async (id) => {
        try {
            await deleteUserRequest(id);

            setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
            setRepartidores(prevRepartidores => prevRepartidores.filter(user => user.id !== id));
            setAdministradores(prevAdministradores => prevAdministradores.filter(user => user.id !== id));
        } catch (err) {
            setError(err.response ? err.response.data : "Server error");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <UserContext.Provider value={{ users, repartidores, administradores, fetchUsers, updateUser, deleteUser,createUser, loading, error }}>
            {children}
        </UserContext.Provider>
    );
};
