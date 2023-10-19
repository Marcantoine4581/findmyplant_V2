import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Search from './Search';
import Pagination from './Pagination';
import PlantItem from './PlantItem';
import '../styles/Products.css';

function Products() {
    const apiUrl = process.env.REACT_APP_API_URL;
    const endpoint = process.env.REACT_APP_END_POINT_PRODUCTS;
    const [totalProducts, setTotalProducts] = useState('');
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchCity, setSearchCity] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    let [itemsPerPage, setItemsPerPage ] = useState(3); // Number of items per page
    const [isSearchPending, setIsSearchPending] = useState(false);


    useEffect(() => {
        if (!isSearchPending) {
            fetch(`${apiUrl}${endpoint}?page=${currentPage}&limit=${itemsPerPage}&name=${searchTerm}&city=${searchCity}`)
                .then(response => response.json())
                .then(data => {
                    setTotalProducts(data.totalProducts);
                    setData(data.product);
                    if (itemsPerPage > data.backendLimit) {
                        setItemsPerPage(data.backendLimit);
                    }
                });
        }
    // eslint-disable-next-line
    }, [apiUrl, endpoint, currentPage, itemsPerPage, isSearchPending]);

    const handleSearchCity = event => {
        setSearchCity(event.target.value);
    };

    const handleSearchButtonClick = () => {
        setIsSearchPending(true);
        setCurrentPage(1);
        fetch(`${apiUrl}${endpoint}?page=1&limit=${itemsPerPage}&name=${searchTerm}&city=${searchCity}`)
            .then(response => response.json())
            .then(data => {
                setTotalProducts(data.totalProducts);
                setData(data.product);
                if (itemsPerPage > data.backendLimit) {
                    setItemsPerPage(data.backendLimit);
                }
            });
    };

    // Pagination part:
    // Calculate the total number of pages
    const totalPages = Math.ceil(totalProducts / itemsPerPage);
    // Function to go to the next page
    const nextPage = () => {
        if (currentPage < totalPages) {
            setIsSearchPending(false);
            setCurrentPage(currentPage + 1);
        }
    };

    // Function to go to the previous page
    const prevPage = () => {
        if (currentPage > 1) {
            setIsSearchPending(false);
            setCurrentPage(currentPage - 1);
        }
    };

    // Function to jump to a specific page
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setIsSearchPending(false);
            setCurrentPage(page);
        }
    };
 
    return (
        <div>
            <Search
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                searchCity={searchCity}
                handleSearchCity={handleSearchCity}
                handleSearchButtonClick={handleSearchButtonClick}
            />

            <article className='fmp-plant-list'>
                {data.length > 0 ? (
                    data.map(({ _id, userId, imageUrl, plantName, price, condition }) => (
                        <Link to={`/product/${_id}`} key={_id}>
                            <PlantItem
                                _id={_id}
                                userName={userId.userName}
                                imageUrl={imageUrl}
                                plantName={plantName}
                                price={price}
                                condition={condition}
                                city={userId.adress.city}
                                postalCode={userId.adress.postalCode}
                            />
                        </Link>
                    ))
                ) : (
                    <p>Aucune plante n&apos;a été trouvée.</p>
                )}
            </article>

            {/* Show pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onNextPage={nextPage}
                onPrevPage={prevPage}
                onGoToPage={goToPage}
            />
        </div>
    );
}

export default Products;