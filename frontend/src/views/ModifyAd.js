import NavBar from '../components/NavBar'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/CreateAd.css'
import Container from 'react-bootstrap/Container'
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import InputGroup from 'react-bootstrap/InputGroup';
import SearchPlant from '../components/SearchPlant';

import { useParams } from 'react-router-dom';
import axios from 'axios';

function ModifyAd() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const endpointproduct = process.env.REACT_APP_END_POINT_PRODUCTS;
  const { id } = useParams()
  const uid = localStorage.getItem('userId');
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    userId: "",
    plantName: "",
    condition: "",
    price: "",
    comment: "",
    image: null
  });
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${apiUrl}${endpointproduct}` + id )
        .then(res => {
            console.log(res.data.product)
            setForm(res.data.product)
            
        })
        .catch(error => console.log(error))
}, [apiUrl, endpointproduct, id]);
  
  
   // These methods will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  function handleImageUpload(e) {
    const file = e.target.files[0];
    updateForm({ image: file });
  };

  async function onSubmit(e) {
    e.preventDefault()
    if (form.price === null) {
      updateForm({ price: "0" });
    }

    const formData = new FormData();
    formData.append("userId", uid);
    formData.append("plantName", form.plantName);
    formData.append("condition", form.condition);
    formData.append("price", form.price);
    formData.append("comment", form.comment);
    formData.append("image", form.image);

    await axios.put(`${apiUrl}${endpointproduct}` + id, formData)
        .then(res => {
            console.log('Mise à jour réussie !');
            setMessage(res.data.message);
        })
        .catch(error => {
          window.alert(error);
          return;
        });
   
        navigate("/");
}

  return (
    <div>
      <NavBar />
      <Container className="createAd-wrapper">
      <div className='createdAd-title'>
          <h1>Modifier une annonce</h1>
        </div>
      
       <Form onSubmit={onSubmit}>

          <SearchPlant 
            searchTerm={form.plantName}
            handleSearch={updateForm}
          />

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
                checked={form.condition === "Je vends"}
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
                checked={form.condition === "Je donne"}
                onChange={(e) => {
                  updateForm({ condition: e.target.value });
                  updateForm({ price: "0" });
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
                checked={form.condition === "Je troque"}
                onChange={(e) => {
                  updateForm({ condition: e.target.value });
                  updateForm({ price: "0" });
                }}
              />
            </div>
          </Form.Group>        

          {/* Price */}
          <InputGroup className="createAd-group">
            <Form.Label className='text-price'>Prix :</Form.Label>
            <Form.Control
              className='createAd-input'
              aria-label="Amount (to the nearest euro)"
              type="text"
              value={form.price}
              onChange={(e) => updateForm({ price: e.target.value })}
              disabled={form.condition !== "Je vends"} 
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
              onChange={handleImageUpload}
            />
          </Form.Group>

          <Form.Group controlId="submit">
            <Button variant="primary" type="submit" style={{ marginTop: "20px" }}>
              Modifier
            </Button>
          </Form.Group>
        </Form>
      </Container>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ModifyAd;