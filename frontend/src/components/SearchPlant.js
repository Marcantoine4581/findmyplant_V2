import React, { useEffect } from 'react';
import '../styles/Search.css'
import { useState } from 'react';
import PlantData from '../noms.json';
import Form from 'react-bootstrap/Form';

function SearchPlant({ searchTerm, handleSearch }) {
	const uniquePlantData = Array.from(new Set(PlantData.map(op => op.nom_francais)));
	const filteredOptions = uniquePlantData.filter(nom_francais =>
		nom_francais.toLowerCase().includes(searchTerm.toLowerCase())
	);
	const [selectedItem, setSelectedItem] = useState('');
	const [showResults, setShowResults] = useState(false);

	const handleDataItemClick = (nom) => {
		setSelectedItem(nom); // Update state with value of selected dataItem
		handleSearch({ plantName: nom });
		setShowResults(false);
	};

	const handleClearSelectedItem = () => {
		setSelectedItem('');
		handleSearch({ plantName: '' });
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

	return (
		<div>
			<div className="createdAd-plantName">
				<Form.Group controlId="plantName" className="createAd-group" onClick={handleShowResults}>
					<Form.Label>Nom de la plante</Form.Label>
					<Form.Control
						className='createAd-input'
						type="text"
						placeholder="Nom de la plante"
						value={selectedItem || searchTerm}
						onChange={(e) => handleSearch({ plantName: e.target.value })}
					/>
				</Form.Group>

				{(selectedItem) && (
					<button className='clear-selection' onClick={handleClearSelectedItem}>
						Modifier
					</button>
				)}

				{(!selectedItem && searchTerm.length >= 3) && (
					<button className='validation' type="button" onClick={handlevalidation}>
						Valider
					</button>
				)}
				{showResults && searchTerm.length >= 3 && (
					<div className='dataResult' >
						{filteredOptions.slice(0, 10).map((nom, index) => <p key={index} className='dataItem' onClick={() => handleDataItemClick(nom)}>{nom}</p>)}
					</div>
				)}
			</div>
		</div>
	);
}

export default SearchPlant