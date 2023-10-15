import PropTypes from 'prop-types';
import '../styles/PlantItem.css';

function PlantItem({ _id, userName, imageUrl, plantName, price, condition, city, postalCode }) {
    return (
        <div key={_id} className='fmp-plant-item'>
            <div className='fmp-plant-item-userName'>{userName}</div>
            <div className='fmp-plant-item-city'>{city ? city : null} {postalCode ? postalCode : null}</div>
            <div className='fmp-plant-item-cover-condition' style={{ backgroundImage: `url(${imageUrl[0]})` }}>
                <p className='fmp-condition'>{condition}</p>
            </div>
            {plantName}
            <div className='fmp-price'>
                {price ? (
                    <span>{price} €</span>
                ) : null}
            </div>
        </div>
    );
}

PlantItem.propTypes = {
    _id: PropTypes.node.isRequired,
    userName: PropTypes.node.isRequired,
    imageUrl: PropTypes.node.isRequired,
    plantName: PropTypes.node.isRequired,
    price: PropTypes.node.isRequired,
    condition: PropTypes.node.isRequired,
    city: PropTypes.node.isRequired,
    postalCode: PropTypes.node.isRequired,
};

export default PlantItem;