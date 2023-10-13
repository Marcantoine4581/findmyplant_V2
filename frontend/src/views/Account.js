import NavBar from '../components/NavBar'
import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Account.css'
import '../styles/ErrorMessage.css';

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
            country: ''
        }
    });

    useEffect(() => {
        axios.get(`${apiUrl}${endpoint}` + uid)
            .then(res => {
                setData(res.data.user);
            })
            .catch(error => console.log(error))
    }, [uid, apiUrl, endpoint]);

    function onSubmit(e) {
        e.preventDefault()
        if (password === "" && (password === password2)) {
            axios.put(`${apiUrl}${endpoint}` + uid, data)
                .then(res => {
                    console.log('Mise à jour réussie !');
                    setMessage(res.data.message);
                })
                .catch(error => console.log(error))
        } else if (password !== "" && (password === password2)) {
            const updatedData = {
                ...data,
                password: password
            };
            setData(updatedData);

            axios.put(`${apiUrl}${endpoint}` + uid, updatedData)
                .then(res => {
                    console.log('Mise à jour réussie !');
                    setMessage(res.data.message);
                })
                .catch(error => console.log(error))
        } else {
            setPasswordError("Les mots de passe ne correspondent pas");
        }
    }

    return (
        <div>
            <NavBar />
            <div className="account-wrapper">
                <h1 className="title">Mes informations</h1>
                <form className='account-form' onSubmit={onSubmit}>
                    <label className='label-input'>
                        Nom de l'utilisateur:
                        <input
                            type="text"
                            value={data.userName}
                            onChange={e => setData({ ...data, userName: e.target.value })}
                        />
                    </label>
                    <label className='label-input'>
                        Email:
                        <input type="text" value={data.email} onChange={e => setData({ ...data, email: e.target.value })} />
                    </label>
                    <label className='label-input'>
                        Nouveau mot de passe:
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                    </label>
                    {passwordError && <p className='errorMessage'>{passwordError}</p>}
                    <label className='label-input'>
                        Confirmation du mot de passe:
                        <input type="password" value={password2} onChange={e => setPassword2(e.target.value)} />
                    </label>
                    {passwordError && <p className='errorMessage'>{passwordError}</p>}

                    <p>Adresse: </p>
                    <label className='label-input'>
                        Rue:
                        <input type="text" value={data.adress.street} onChange={e => setData({ ...data, adress: { ...data.adress, street: e.target.value } })} />
                    </label>
                    <label className='label-input'>
                        Ville:
                        <input type="text" value={data.adress.city} onChange={e => setData({ ...data, adress: { ...data.adress, city: e.target.value } })} />
                    </label>
                    <label className='label-input'>
                        Code postal:
                        <input type="text" value={data.adress.postalCode} onChange={e => setData({ ...data, adress: { ...data.adress, postalCode: e.target.value } })} />
                    </label>
                    <label className='label-input'>
                        Pays:
                        <input type="text" value={data.adress.country} onChange={e => setData({ ...data, adress: { ...data.adress, country: e.target.value } })} />
                    </label>
                    <div className='account-button'>
                        <button type="submit">Mettre à jour</button>
                    </div>
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>

    )
}