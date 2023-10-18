const express = require('express');
const path = require('path');
const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth');
const ProductsController = require('../controllers/ProductsController');
const AuthController = require('../controllers/AuthController');
const UsersController = require('../controllers/UsersController');
const paginatedResults = require('../middleware/pagination');
const Product = require('../models/Product');

const router = express.Router();

// Authentication routes
router.post('/api/auth/signup', AuthController.signup);
router.post('/api/auth/login', AuthController.login);

// Users routes
router.get('/api/user', UsersController.getAllUser);
router.get('/api/user/:id', auth, UsersController.getOneUser);
router.get('/api/user/:id/products', auth, UsersController.getAllProductByUser);
router.put('/api/user/:id', auth, UsersController.modifyUser);
router.delete('/api/user/:id', auth, UsersController.deleteUser);

// Products routes
router.get('/api/products', paginatedResults(Product), ProductsController.getAllProducts);
router.get('/api/products/:id', ProductsController.getOneProduct);
router.post('/api/products', auth, multer.array('image'), ProductsController.createOneProduct);
router.put('/api/products/:id', auth, multer.array('image'), ProductsController.modifyProduct);
router.delete('/api/products/:id', auth, ProductsController.deleteProduct);

// Images routes
router.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = router;
