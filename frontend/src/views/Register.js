import NavBar from '../components/NavBar';
import React, { useState } from 'react';
import '../styles/Register.css';
import '../styles/ErrorMessage.css';
import { useNavigate } from "react-router";
import axios from 'axios';


export default function Signup() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const endpointauth = process.env.REACT_APP_END_POINT_AUTH;
  const [password2, setPassword2] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [postalCodeError, setPostalCodeError] = useState('');
  const navigate = useNavigate();
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.get('https://geo.api.gouv.fr/communes?codePostal=' + postalCode)
      .then(res => {
        if (res.data.length === 0) {
          setPostalCodeError("Le code postal est incorrect");
        }
        const cityName = res.data[0].nom;

        const updatedData = {
          ...data,
          adress: {
            ...data.adress,
            city: cityName,
            postalCode: postalCode
          }
        };

        setData(updatedData);

        if (data.password === password2) {
          axios.post(`${apiUrl}${endpointauth}signup`, updatedData)
            .then(res => {
              console.log(res)
              navigate('/login')
            })
            .catch(error => {
              setEmailError(error.response.data.message)
            })
        } else {
          setPasswordError("Les mots de passe ne correspondent pas");
        }
      })
      .catch(error => { console.log(error) })
  };

  return(
    <div>
      <NavBar />
      <div className="register-wrapper">
        <p className='title'>Rejoins les passionnés de plantes sur FindMyPlant</p>
        <h1 className='title'>Créer un compte</h1>
        <form onSubmit={handleSubmit}>
            <label>
                <p>Nom de l'utilisateur</p>
                <input type="text" value={data.userName} onChange={e => setData({...data, userName: e.target.value})} />
            </label>
          <label>
            <p>Email</p>
            <input type="text" value={data.email} onChange={e => setData({...data, email: e.target.value})} />
          </label>
            {emailError && <p className='errorMessage'>{emailError}</p>}
          <label>
            <p>Mot de passe</p>
            <input type="password" value={data.password} onChange={e => setData({...data, password: e.target.value})} />
          </label>
          {passwordError && <p className='errorMessage'>{passwordError}</p>}
          <label>
            <p>Confirmation du mot de passe</p>
            <input type="password" value={password2} onChange={e => setPassword2(e.target.value)} />
          </label>
          {passwordError && <p className='errorMessage'>{passwordError}</p>}
          <label>
            <p>Code postal</p>
            <input type="text" value={postalCode} onChange={e => setPostalCode(e.target.value)} />
          </label>
          {postalCodeError && <p className='errorMessage'>{postalCodeError}</p>}
          
          <div className='button'>
            <button type="submit">Continuer</button>
          </div>
        </form>
      </div>
    </div>
    
  )
}