const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const morgan = require('morgan');
const router = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 5000;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Connect to the MongoDB using Mongoose
if (process.env.NODE_ENV === 'development') {
  mongoose.connect(process.env.MONGODB_URI_DEV)
    .then(() => console.log('Connexion à MongoDB réussie!'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));
}

if (process.env.NODE_ENV === 'production') {
  mongoose.connect(process.env.MONGODB_URI_PROD)
    .then(() => console.log('Connexion à MongoDB réussie!'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));
}

app.use(express.json());
app.use(morgan('dev'));

app.use('/', router);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
module.exports = app;
