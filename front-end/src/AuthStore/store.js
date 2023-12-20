import { createContext, useState } from "react";

export const AuthContext = createContext();

export const ProvideAuth = ({ children }) => {
    const getSession = () => {
        return JSON.parse(localStorage.getItem('session'));
    };

    
    //  set and get Token from LocalStorage
    

    const setSessionInLocalStorage = (token) => {
        localStorage.setItem('session', JSON.stringify(token))
        return true
    };

    const auth = getSession();
    const [session, setSession] = useState(auth || '');
    const setAuth = (token) => {
        setSession(token);
        setSessionInLocalStorage(token);
    };
    const { userRole, token,isAdmin } = session;
    return (
        <AuthContext.Provider value={{ userRole, token,isAdmin, setAuth }}>
            {children} 
        </AuthContext.Provider>
    )
};

