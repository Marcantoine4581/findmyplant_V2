const express = require('express');
var morgan = require('morgan')
const fs = require('fs');
const mongoose = require('mongoose');
const productRoutes = require('./routes/product');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
require('dotenv').config()
const Product = require('./models/Product');
const path = require('path');

mongoose.connect(process.env.DB_URL) // no longer supported options
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Middleware qui extrait le corp JSON. 
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/plants', (req, res) => {
    fs.readFile('noms.json', 'utf8', (err, data) => {
        if (err) {
          console.error('Erreur lors de la lecture du fichier JSON :', err);
          res.status(500).json({ error: 'Erreur lors de la lecture du fichier JSON' });
          return;
        }
        const jsonData = JSON.parse(data);
        res.status(200).json(jsonData);
    });
});

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;