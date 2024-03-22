import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/AuthProvider'

const PrivateRoutes = () => {
    const user = useAuth();
    if (!user.token) 
    {
    console.log('route has failed');
    return <Navigate to="/"/>
    }
    return <Outlet/>;
}

export default PrivateRoutes
