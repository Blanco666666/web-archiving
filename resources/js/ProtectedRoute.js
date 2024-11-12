import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    // Retrieve token and user from local storage
    const token = localStorage.getItem('token');
    const user = token ? JSON.parse(localStorage.getItem('user')) : null;


    const isUserAuthenticated = !!token && user !== null;


    const userRole = isUserAuthenticated ? user.role : null;


    const location = useLocation();

  
    const isRoleAllowed = allowedRoles.length === 0 || allowedRoles.includes(userRole);

   
    if (!isUserAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!isRoleAllowed) {

        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
