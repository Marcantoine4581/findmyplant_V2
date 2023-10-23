import axios from 'axios';
import NavBar from '../components/NavBar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/CreateAd.css';
import Container from 'react-bootstrap/Container';
import { useState } from 'react';
// import { useNavigate } from 'react-router';
import InputGroup from 'react-bootstrap/InputGroup';
import SearchPlant from '../components/SearchPlant';
import { accountService } from '../services/accountService';

export default function CreateAd() {
    const apiUrl = process.env.REACT_APP_API_URL;
    const endpointproduct = process.env.REACT_APP_END_POINT_PRODUCTS;
    const uid = localStorage.getItem('userId');
    const [message, setMessage] = useState('');
    const [planteNameMessage, setPlanteNameMessage] = useState('');
    const [conditionMessage, setConditionMessage] = useState('');
    const [imageMessage, setImageMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState({
        userId: uid,
        plantName: '',
        condition: '',
        price: '',
        comment: '',
        image: [],
    });
    const token = accountService.getToken();
    // const navigate = useNavigate();

    // These methods will update the state properties.
    function updateForm(value) {
        return setForm((prev) => {
            return { ...prev, ...value };
        });
    }

    function handleImageUpload(e) {
        const file = e.target.files;
        updateForm({ image: file });
    }

    // This function will handle the submission.
    async function onSubmit(e) {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        formData.append('userId', form.userId);
        formData.append('plantName', form.plantName);
        formData.append('condition', form.condition);
        formData.append('price', form.price);
        formData.append('comment', form.comment);
        for (let i = 0; i < form.image.length; i++) {
            formData.append('image', form.image[i]);
        }

        setPlanteNameMessage('');
        setConditionMessage('');
        setImageMessage('');
        setMessage('');

        await axios
            .post(`${apiUrl}${endpointproduct}`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(() => {
                setIsLoading(false);
                console.log('Creation réussi !');
                setMessage('Annonce créée avec succès!');
            })
            .catch((error) => {
                setIsLoading(false);
                if (error.response.data.message === 'Merci d\'indiquer un nom à votre plante.') {
                    setPlanteNameMessage(error.response.data.message);
                }
                if (error.response.data.message === 'Merci d\'indiquer une condition à votre annonce.') {
                    setConditionMessage(error.response.data.message);
                } 
                if (error.response.data.message === 'Merci d\'intégrer une image à votre annonce.') {
                    setImageMessage(error.response.data.message);
                } 
            });
    }

    return (
        <div>
            <NavBar />
            <Container className="createAd-wrapper">
                <div className="createdAd-title">
                    <h1>Déposer une annonce</h1>
                </div>

                <Form onSubmit={onSubmit}>
                    <SearchPlant searchTerm={form.plantName} handleSearch={updateForm} />
                    {planteNameMessage && <p className="errorMessage">{planteNameMessage}</p>}

                    {/* Select condition */}
                    <Form.Group className="createAd-group">
                        <Form.Label>Conditions: </Form.Label>
                        <div className="form-check form-check-inline">
                            <Form.Check
                                inline
                                label="Je vends"
                                type="radio"
                                name="conditionOptions"
                                id="vendre"
                                value="Je vends"
                                checked={form.condition === 'Je vends'}
                                onChange={(e) => updateForm({ condition: e.target.value })}
                            />
                        </div>
                        <div className="form-check form-check-inline">
                            <Form.Check
                                inline
                                label="Je donne"
                                type="radio"
                                name="conditionOptions"
                                id="donner"
                                value="Je donne"
                                checked={form.condition === 'Je donne'}
                                onChange={(e) => {
                                    updateForm({ condition: e.target.value });
                                    updateForm({ price: '0' });
                                }}
                            />
                        </div>
                        <div className="form-check form-check-inline">
                            <Form.Check
                                inline
                                label="Je troque"
                                type="radio"
                                name="conditionOptions"
                                id="troquer"
                                value="Je troque"
                                checked={form.condition === 'Je troque'}
                                onChange={(e) => {
                                    updateForm({ condition: e.target.value });
                                    updateForm({ price: '0' });
                                }}
                            />
                        </div>
                    </Form.Group>
                    {conditionMessage && <p className="errorMessage">{conditionMessage}</p>}

                    {/* Price */}
                    <InputGroup className="createAd-group">
                        <Form.Label className="text-price">Prix :</Form.Label>
                        <Form.Control
                            className="createAd-input"
                            aria-label="Amount (to the nearest euro)"
                            type="text"
                            value={form.price}
                            onChange={(e) => updateForm({ price: e.target.value })}
                            disabled={form.condition !== 'Je vends'}
                        />
                        <InputGroup.Text>€</InputGroup.Text>
                    </InputGroup>

                    {/* Comments */}
                    <Form.Group controlId="comments" className="createAd-group">
                        <Form.Label>Commentaires</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={form.comment}
                            onChange={(e) => updateForm({ comment: e.target.value })}
                        />
                    </Form.Group>

                    <Form.Group controlId="image" className="createAd-group">
                        <Form.Label>Image</Form.Label>
                        <Form.Control
                            className="createAd-input"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                        />
                    </Form.Group>
                    {imageMessage && <p className="errorMessage">{imageMessage}</p>}
                    <Form.Group controlId="submit" className="createAd-group">
                        <Button variant="primary" type="submit" style={{ marginTop: '20px', backgroundColor: '#16AF78', borderColor: '#16AF78' }}>
                            Créer
                        </Button>
                    </Form.Group>
                    {isLoading && <p className="infoMessage">En cours de chargement</p>}
                    {message && <p className="succesMessage">{message}</p>}
                </Form>
            </Container>
        </div>
    );
}
