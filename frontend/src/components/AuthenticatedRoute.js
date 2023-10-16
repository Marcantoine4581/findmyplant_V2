import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import jwt_decode from 'jwt-decode';
import { accountService } from '../services/accountService';


const AuthenticatedRoute = ({ children }) => {
    const token = accountService.getToken();
    

    const isTokenExpired = () => {
        if (token) {
            const { exp } = jwt_decode(token);
            const expirationTime = (exp * 1000) - 60000;
            return Date.now() >= expirationTime;
        }
        return true;
    };

    if (isTokenExpired()) {
        if (accountService.isLogged()) {
            accountService.logout();
            return <Navigate to="/login" />;
        }
        return <Navigate to="/login" />;
    }
    
    return children;
};

AuthenticatedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AuthenticatedRoute;
