import React, { createContext, useContext, useMemo, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from "../hooks/useLocalStorage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [ user, setUser ] = useLocalStorage("currentUser", null);
    const [ token, setToken ] = useLocalStorage("authToken", null);
    const navigate = useNavigate();

    const login = async (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
        navigate("/dashboard");
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        navigate("/", { replace: true });
    };

    const value = useMemo(
        () => ({
            user,
            token,
            login,
            logout
        }),
        [user, token]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
}