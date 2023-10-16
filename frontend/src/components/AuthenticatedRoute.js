import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { accountService } from '../services/accountService';


const AuthenticatedRoute = ({ children }) => {
    if (!accountService.isLogged()) {
        return <Navigate to="/login" />;
    }
    return children;
};

AuthenticatedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AuthenticatedRoute;
