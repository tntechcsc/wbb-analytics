/*
 privateRoute.js
    This is the page where the user can only access the page if they are authenticated.
*/
import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/AuthProvider'

const PrivateRoutes = () => {
    const user = useAuth();
    /*
     force the user back to the login page if the try to move to another page when they have yet to login
    */
    if (!user.token) 
    {
    return <Navigate to="/"/>
    }
    return <Outlet/>;
}

export default PrivateRoutes
