import '../styles/AccountProducts.css'
import NavBar from '../components/NavBar'
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import moment from 'moment';

function AccountProducts() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const endpointproduct = process.env.REACT_APP_END_POINT_PRODUCTS;
  const endpointuser = process.env.REACT_APP_END_POINT_USER;
  const [data, setData] = useState([]);
  const uid = localStorage.getItem('userId');

  useEffect(() => {
    axios.get(`${apiUrl}${endpointuser}${uid}/products`)
        .then(res => {
            setData(res.data.products);
        })
        .catch(error => console.log(error))
}, [uid, apiUrl, endpointuser]);

  const handleDeleteProduct = (productId) => {
    axios.delete(`${apiUrl}${endpointproduct}${productId}`)
      .then((response) => {
        console.log(response);
        const updatedData = data.filter((product) => product._id !== productId);
        setData(updatedData);
      })
      .catch((error) => {
        console.error('Erreur lors de la suppression du produit :', error);
      });
  };

  const handleSwitchToggle = (productId) => {
    const updatedProduct = data.find((product) => product._id === productId);
    console.log('updatedProduct = ', updatedProduct);
    const updatedAvailability = !updatedProduct.status;
    console.log('updatedAvailability = ', updatedAvailability);

    axios.put(`${apiUrl}${endpointproduct}${productId}`, { status: updatedAvailability })
      .then((response) => {
        console.log(response);
        const updatedData = data.map((product) => {
          if (product._id === productId) {
            return { ...product, status: updatedAvailability };
          }
          return product;
        });
        setData(updatedData);
      })
      .catch((error) => {
        console.error('Erreur lors de la mise à jour de la disponibilité du produit :', error);
      });
  };

  return (
    <div>
      <NavBar />
      <div className='accountProducts-wrapper'>
        <h1 className="title">Mes annonces</h1>
        <article className='accountProducts'>
          {data.map(({ _id, imageUrl, plantName, price, condition, status, createAt }, index) => (
            <div className='accountProducts-details' key={`${_id}-${index}`}>
              <div className='accountProducts-mobile'>
                <div className='plant-cover' style={{ backgroundImage: `url(${imageUrl})` }}></div>
                <div className='accountProducts-details-text'>
                  <p>{plantName}</p>
                  {!price ? <p>{condition}</p> : <p>Prix : {price} €</p>}
                  <p>Date de création : {moment(createAt).format('DD-MM-YYYY')}</p>
                </div>
              </div>
              
              <div className='accountProducts-mobile'>
                <div className='accountProducts-button'>
                  <button className='modify'>
                  <Link to={`/user/${uid}/modify-ad/${_id}`} key={_id}>
                      Modifier
                  </Link>
                  </button>
                  <button className='delete' onClick={() => handleDeleteProduct(_id)}>Supprimer</button>
                </div>
                <Form>
                  <Form.Check
                    type="switch"
                    checked={status}
                    id={_id}
                    label="Disponibilité"
                    onChange={() => handleSwitchToggle(_id)}
                  />
                </Form>
              </div>
            </div>
          ))}
        </article>
      </div>
    </div>
  );
}

export default AccountProducts;