import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/AuthProvider'

const PrivateRoutes = () => {
    const user = useAuth();
    if (!user.token) 
    {
    return <Navigate to="/"/>
    }
    return <Outlet/>;
}

export default PrivateRoutes
