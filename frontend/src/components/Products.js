import PlantItem from './PlantItem'
import '../styles/Products.css'
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Search from './Search';
import Pagination from './Pagination';

function Products() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const endpoint = process.env.REACT_APP_END_POINT_PRODUCTS;
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12); // Number of items per page


  useEffect(() => {
    fetch(`${apiUrl}${endpoint}`)
      .then(response => response.json())
      .then(data => {
        setIsLoading(false);
        // get products with the status "true"
        const dataStatusTrue = data.product.filter(item => item.status === true);
        const sortedData = dataStatusTrue.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
        setData(sortedData);
        setFilteredData(sortedData);
      });
  }, [apiUrl, endpoint]);

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };

  const handleSearchCity = event => {
    setSearchCity(event.target.value);
  };

  const handleSearchButtonClick = () => {
    const filtered = data.filter(item => {
      if (searchTerm && searchCity) {
        return (
          item.plantName.toLowerCase().includes(searchTerm.toLowerCase()) &&
          item.userId.adress.city.toLowerCase().includes(searchCity.toLowerCase())
        );
      } else if (searchTerm) {
        return item.plantName.toLowerCase().includes(searchTerm.toLowerCase());
      } else if (searchCity) {
        return item.userId.adress.city.toLowerCase().includes(searchCity.toLowerCase());
      }
      return true; // if no criteria specified, return all elements.
    });
  
    setFilteredData(filtered);
  };
    // Pagination part:
    // Calculate the total number of pages
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    // Function to go to the next page
    const nextPage = () => {
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      }
    };
  
    // Function to go to the previous page
    const prevPage = () => {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    };
  
    // Function to jump to a specific page
    const goToPage = (page) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    };
  
    // Calculate the start and end index of the elements displayed on the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
  
    // Get the elements to display on the current page
    const itemsToDisplay = filteredData.slice(startIndex, endIndex);


  return (
    <div>
      
      <Search
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        searchCity={searchCity}
        handleSearchCity={handleSearchCity}
        handleSearchButtonClick={handleSearchButtonClick}
      />

      {isLoading && 
      <div>
        <p className='loading'> Ce site web est un projet et le serveur s'arrête en cas d'inactivité.</p>
        <p className='loading'> Merci de patienter quelques secondes.</p>
      </div>
      }

      <article className='fmp-plant-list'>
        {itemsToDisplay.map(({ _id, userId, imageUrl, plantName, price, condition }) => (
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
        ))}
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