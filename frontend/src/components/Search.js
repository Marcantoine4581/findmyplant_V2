import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import PlantData from '../listPlants.json';
import '../styles/Search.css';

function Search({ searchTerm, setSearchTerm, searchCity, handleSearchCity, handleSearchButtonClick }) {
    const filteredOptions = PlantData.filter(nom_francais =>
        nom_francais.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const [selectedItem, setSelectedItem] = useState('');
    const [showResults, setShowResults] = useState(false);


    const handleDataItemClick = (nom) => {
        setSelectedItem(nom); // Update state with value of selected dataItem
        setShowResults(false);
    };

    const handleClearSelectedItem = () => {
        setSelectedItem('');
        setSearchTerm('');
        setShowResults(true);
    };
    const handleShowResults = () => {
        setShowResults(true);
    };

    const handlevalidation = () => {
        setShowResults(false);
    };

    useEffect(() => {
        if (searchTerm.length >= 3 && filteredOptions.length === 0) {
            setShowResults(false);
        }
    }, [searchTerm, filteredOptions]);

    const handleSearch = event => {
        setSearchTerm(event.target.value);
    };

    return (
        <div className='fmp-search'>
            <div className='search-box'>
                <label className='fmp-search-input' onClick={handleShowResults}>
                    <input
                        list='plant'
                        className='fmp-search-input-input'
                        type='text'
                        value={selectedItem || searchTerm}
                        placeholder='Rechercher une plante'
                        onChange={handleSearch}
                    />
                </label>
                {selectedItem && (
                    <button className='clear-selection' onClick={handleClearSelectedItem}>
                        X
                    </button>
                )}
                {(!selectedItem && searchTerm.length >= 3) && (
                    <button className='validation' type="button" onClick={handlevalidation}>
                        Valider
                    </button>
                )}
                {showResults && searchTerm.length >= 3 && (
                    <div className='dataResult'>
                        {filteredOptions.slice(0, 40).map((nom, index) => <p key={index} className='dataItem' onClick={() => handleDataItemClick(nom)}>{nom}</p>)}
                    </div>
                )}

                <label className='fmp-search-input'>
                    <input
                        className='fmp-search-input-input'
                        type="text"
                        value={searchCity}
                        placeholder="Rechercher une ville"
                        onChange={handleSearchCity}
                    />
                </label>
                <button className='button-search' onClick={handleSearchButtonClick}>
                    Rechercher
                </button>
            </div>
        </div>
    );
}

Search.propTypes = {
    searchTerm: PropTypes.string,
    setSearchTerm: PropTypes.func,
    // handleSearch: PropTypes.func,
    searchCity: PropTypes.string,
    handleSearchCity: PropTypes.func,
    handleSearchButtonClick: PropTypes.func,
};

export default Search;