import React, { useState, useEffect } from 'react';
import {Navigate} from 'react-router-dom';
import {jwtDecode} from 'jwt-Decode';
import api from '../api';
import {ACCESS_TOKEN, REFRESH_TOKEN} from '../constants';


function ProtectedRoute({children}) {
    const [isAutherized, setIsAutherized] = useState(null);

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try {
            const response = await api.post('/api/token/refresh/', {refresh: refreshToken});
            if (response.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                setIsAutherized(true);
            } else {
                localStorage.removeItem(ACCESS_TOKEN);
                localStorage.removeItem(REFRESH_TOKEN);
                setIsAutherized(false);
            }
        } catch (error) {
            localStorage.removeItem(ACCESS_TOKEN);
            localStorage.removeItem(REFRESH_TOKEN);
            setIsAutherized(false);    
    } }

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setIsAutherized(false);
            return;
        }
        try {
            const {exp} = jwtDecode(token);
            if (Date.now() >= exp * 1000) {
                await refreshToken();
            }
            setIsAutherized(true);
        } catch (error) {
            setIsAutherized(false);
        }
    }

    useEffect(() => {
        auth();
    }, []);

    if (isAutherized === null) {
        return <h1>Loading...</h1>;
    }

    return isAutherized ? children : <Navigate to="/login" />;
}


export default ProtectedRoute;