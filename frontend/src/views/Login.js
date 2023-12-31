import { useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import NavBar from '../components/NavBar';
import { accountService } from '../services/accountService';
import '../styles/Login.css';
import '../styles/ErrorMessage.css';


export default function Login() {
    const apiUrl = process.env.REACT_APP_API_URL;
    const endpointauth = process.env.REACT_APP_END_POINT_AUTH;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        axios
            .post(`${apiUrl}${endpointauth}login`, { email, password })
            .then((res) => {
                accountService.saveToken(res.data.token);
                accountService.saveUserId(res.data.userId);
                navigate('/');
            })
            .catch((error) => {
                console.log(error);
                setMessage(error.response.data.message);
            });
    };

    return (
        <div>
            <NavBar />
            <div className="login-wrapper">
                <p className="title">Bienvenue sur FindMyPlant</p>
                <h1 className="title">Se connecter</h1>
                <form onSubmit={handleSubmit}>
                    <label>
                        <p>Email</p>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </label>
                    <label>
                        <p>Password</p>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>
                    {message && <p className="errorMessage">{message}</p>}
                    <div className="login-button">
                        <button type="submit">Se connecter</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
