const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const morgan = require('morgan');
const router = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 5000;
const DB_URL = process.env.NODE_ENV === 'production' ? process.env.MONGODB_URI_PROD : process.env.MONGODB_URI_DEV;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

mongoose.connect(DB_URL)
  .then(() => console.log(`Connexion à MongoDB ${process.env.NODE_ENV} réussie !`))
  .catch(() => console.log(`Echec de la connexion à MongoDB ${process.env.NODE_ENV} !`));

app.use(express.json());
app.use(morgan('dev'));

app.use('/', router);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
module.exports = app;
