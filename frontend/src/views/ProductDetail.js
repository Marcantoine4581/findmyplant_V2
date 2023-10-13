import NavBar from '../components/NavBar'
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ProductDetail.css'

export default function ProductDetail() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const endpointproduct = process.env.REACT_APP_END_POINT_PRODUCTS;
  const { id } = useParams()
  const [data, setData] = useState('');
  const [mailVisible, setMailVisible] = useState(false);

  const handleClick = () => {
    setMailVisible(true);
  };

  useEffect(() => {
    axios.get(`${apiUrl}${endpointproduct}` + id)
      .then(res => {
        setData(res.data.product)
      })
      .catch(error => console.log(error))
  }, [id, apiUrl, endpointproduct]);

  if (!data) {
    return null; // Return a loading state or placeholder while data is being fetched
  }

  return (
    <div >
      <NavBar />
      <div className='plant-detail-wrapper'>
        <div>
          <div className='plant-detail-cover-background'>
            <a href={data.imageUrl}>
              <img src={data.imageUrl} alt="image_plante" />
            </a>
          </div>
          <div className='plant-detail-name-price-condition'>
            <div className='plant-detail-name-condition'>
              <p className='plant-detail-name'>{data.plantName}</p>
              {data.price ? (
                <p>{data.price} €</p>
              ) : null}
            </div>
            <p className='plant-detail-condition'>{data.condition}</p>
          </div>
          <div className='plant-detail-description'>
            <p className='plant-detail-description-title'>Description</p>
            <p>{data.comment}</p>
          </div>
        </div>
        <div className='plant-detail-contact'>
          <p className='plant-detail-userName'>{data.userId.userName}</p>
          <button className='contact-button' onClick={handleClick}>Contacter</button>
          {mailVisible && <p className='plant-detail-email'><a href={`mailto:${data.userId.email}`}>{data.userId.email}</a></p>}

        </div>
      </div>
    </div>
  )
}