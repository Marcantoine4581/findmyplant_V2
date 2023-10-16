import NavBar from '../components/NavBar';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ProductDetail.css';
import { accountService } from '../services/accountService';
import { BsChevronCompactLeft, BsChevronCompactRight } from 'react-icons/bs';
import { PiPottedPlantLight } from 'react-icons/pi';

export default function ProductDetail() {
    const apiUrl = process.env.REACT_APP_API_URL;
    const endpointproduct = process.env.REACT_APP_END_POINT_PRODUCTS;
    const { id } = useParams();
    const [data, setData] = useState('');
    const [mailVisible, setMailVisible] = useState(false);
    const[currentIndex, setCurrentIndex] = useState(0);
    const token = accountService.getToken();
    

    const handleClick = () => {
        setMailVisible(true);
    };

    useEffect(() => {
        axios
            .get(`${apiUrl}${endpointproduct}` + id, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                setData(res.data.product);
                console.log(res.data.product);
            })
            .catch((error) => console.log(error));
    }, [id, apiUrl, endpointproduct, token]);

    if (!data) {
        return null; // Return a loading state or placeholder while data is being fetched
    }

    

    const prevImage = () => {
        const isFirstImage = currentIndex === 0;
        const prevIndex = isFirstImage ? data.imageUrl.length - 1 : currentIndex - 1;
        setCurrentIndex(prevIndex);
    };

    const nextImage = () => {
        const isLastImage = currentIndex === data.imageUrl.length - 1;
        const nextIndex = isLastImage ? 0 : currentIndex + 1;
        setCurrentIndex(nextIndex);
    };

    const goToImage = (imageIndex) => {
        setCurrentIndex(imageIndex);
    };

    return (
        <div>
            <NavBar />
            <div className="plant-detail-wrapper">
                <div>
                    <div className="plant-detail-cover-background">
                        <div className="left-arrow">
                            <BsChevronCompactLeft onClick={ prevImage } size={50} />
                        </div>
                        <a href={data.imageUrl[currentIndex]}>
                            <img src={data.imageUrl[currentIndex]} alt="image_plante" />
                        </a>
                        
                        <div className="right-arrow">
                            <BsChevronCompactRight onClick={ nextImage } size={50} />
                        </div>
                        <div className="block-icons">
                            {data.imageUrl.map((image, imageIndex) => (
                                <div className="icon-per-image" key={imageIndex} onClick={() => goToImage(imageIndex)}>
                                    <PiPottedPlantLight />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="plant-detail-name-price-condition">
                        <div className="plant-detail-name-condition">
                            <p className="plant-detail-name">{data.plantName}</p>
                            {data.price ? <p>{data.price} €</p> : null}
                        </div>
                        <p className="plant-detail-condition">{data.condition}</p>
                    </div>
                    <div className="plant-detail-description">
                        <p className="plant-detail-description-title">Description</p>
                        <p>{data.comment}</p>
                    </div>
                </div>
                <div className="plant-detail-contact">
                    <p className="plant-detail-userName">{data.userId.userName}</p>
                    <button className="contact-button" onClick={handleClick}>
                        Contacter
                    </button>
                    {mailVisible && (
                        <p className="plant-detail-email">
                            <a href={`mailto:${data.userId.email}`}>{data.userId.email}</a>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
