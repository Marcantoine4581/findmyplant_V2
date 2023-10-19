import NavBar from '../components/NavBar';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import '../styles/Account.css';
import '../styles/ErrorMessage.css';
import { accountService } from '../services/accountService';

export default function Account() {
    const apiUrl = process.env.REACT_APP_API_URL;
    const endpoint = process.env.REACT_APP_END_POINT_USER;
    const uid = localStorage.getItem('userId');
    const [message, setMessage] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [data, setData] = useState({
        userName: '',
        email: '',
        password: '',
        adress: {
            street: '',
            city: '',
            postalCode: '',
            country: '',
        },
    });
    const token = accountService.getToken();
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get(`${apiUrl}${endpoint}` + uid, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                setData(res.data.user);
            })
            .catch((error) => console.log(error));
    }, [uid, apiUrl, endpoint, token]);

    function onSubmit(e) {
        e.preventDefault();
        if (password === '' && password === password2) {
            axios
                .put(`${apiUrl}${endpoint}` + uid, data, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((res) => {
                    console.log('Mise à jour réussie !');
                    setMessage(res.data.message);
                })
                .catch((error) => console.log(error));
        } else if (password !== '' && password === password2) {
            const updatedData = {
                ...data,
                password: password,
            };
            setData(updatedData);

            axios
                .put(`${apiUrl}${endpoint}` + uid, updatedData)
                .then((res) => {
                    console.log('Mise à jour réussie !');
                    setMessage(res.data.message);
                })
                .catch((error) => console.log(error));
        } else {
            setPasswordError('Les mots de passe ne correspondent pas');
        }
    }

    const handleDeleteUser = (userId) => {
        axios
            .delete(`${apiUrl}${endpoint}${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.error('Erreur lors de la suppression du produit :', error);
            });
        navigate('/');
        accountService.logout();
    };

    return (
        <div>
            <NavBar />
            <div className="account-wrapper">
                <h1 className="title">Mes informations</h1>
                <form className="account-form" onSubmit={onSubmit}>
                    <label className="label-input">
                        Nom de l&apos;utilisateur:
                        <input
                            type="text"
                            value={data.userName}
                            onChange={(e) => setData({ ...data, userName: e.target.value })}
                        />
                    </label>
                    <label className="label-input">
                        Email:
                        <input
                            type="text"
                            value={data.email}
                            onChange={(e) => setData({ ...data, email: e.target.value })}
                        />
                    </label>
                    <label className="label-input">
                        Nouveau mot de passe:
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>
                    {passwordError && <p className="errorMessage">{passwordError}</p>}
                    <label className="label-input">
                        Confirmation du mot de passe:
                        <input
                            type="password"
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                        />
                    </label>
                    {passwordError && <p className="errorMessage">{passwordError}</p>}

                    <p>Adresse: </p>
                    <label className="label-input">
                        Rue:
                        <input
                            type="text"
                            value={data.adress.street}
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    adress: { ...data.adress, street: e.target.value },
                                })
                            }
                        />
                    </label>
                    <label className="label-input">
                        Ville:
                        <input
                            type="text"
                            value={data.adress.city}
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    adress: { ...data.adress, city: e.target.value },
                                })
                            }
                        />
                    </label>
                    <label className="label-input">
                        Code postal:
                        <input
                            type="text"
                            value={data.adress.postalCode}
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    adress: { ...data.adress, postalCode: e.target.value },
                                })
                            }
                        />
                    </label>
                    <label className="label-input">
                        Pays:
                        <input
                            type="text"
                            value={data.adress.country}
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    adress: { ...data.adress, country: e.target.value },
                                })
                            }
                        />
                    </label>
                    <div className="account-button">
                        <button type="submit">Mettre à jour</button>
                        
                    </div>
                </form>
                <p className="danger-zone"> Zone de danger : si vous cliquez, cela supprimera instantanément votre compte et toutes vos plantes ! </p>
                <button
                    className="delete-account"
                    onClick={() => handleDeleteUser(uid)}
                >
                    Supprimer mon compte
                </button>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
}
