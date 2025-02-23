import React, { createContext, useState } from 'react'

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [loadAuth, setLoadAuth] = useState(true);
    const [auth, setAuth] = useState(null);

    return (
        <AuthContext.Provider value={{ auth, setAuth, loadAuth, setLoadAuth}}>
            {children}
        </AuthContext.Provider>
    )
} 
