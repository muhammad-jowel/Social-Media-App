import React from 'react';
import UserStore from '../../store/UserStore';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({children}) => {

    const { isLogin } = UserStore();
    
     
    if (!isLogin()) {
        return <Navigate to='/login'/>;
    } 
    return children;
    
};

export default ProtectedRoute;