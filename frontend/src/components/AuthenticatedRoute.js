import React from "react";
import { Navigate } from 'react-router-dom'
import { accountService } from "../services/accountService";


const AuthenticatedRoute = ({children}) => {
    if(!accountService.isLogged()){
        return <Navigate to="/login" />
    }
    return children
};

export default AuthenticatedRoute;