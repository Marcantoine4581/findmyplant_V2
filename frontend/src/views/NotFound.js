import { Link } from 'react-router-dom';
import '../styles/NotFound.css';
import logo from '../favicon.ico';

function NotFound() {
    return (
        <div className='NotFound'>
            <h2>Oups! vous êtes sortis du jardin</h2>
            <p>Retourner sur  <Link to='/'>FindMyPlant</Link></p>
            <img src={logo} alt="Logo" />
        </div>
    );
}

export default NotFound;