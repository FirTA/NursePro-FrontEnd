import React, { createContext, useEffect, useState } from 'react'
import { APIRequestWithHeaders, validateToken } from '../api/post';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [loadAuth, setLoadAuth] = useState(true);
    const [auth, setAuth] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        setLoadAuth(true);
        if(token){
            validateToken(token)
            .then((res) => {
                APIRequestWithHeaders.defaults.headers.common[
                    "Authorization"] = `Bearer ${res.data.token}`
                localStorage.setItem('access_token', res.data.token)
                setAuth(res.data)
            })
            .catch((e)=>{
                localStorage.removeItem('access_token');
                console.log(e);
                navigate('/login')
            })
            .finally(()=>{
                setLoadAuth(false)
            })
        } else {
            setLoadAuth(false)
        }
    },[]);
    
    return (
        <AuthContext.Provider value={{ auth, setAuth, loadAuth, setLoadAuth}}>
            {children}
        </AuthContext.Provider>
    )
} 
