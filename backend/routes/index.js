const express = require('express');
const path = require('path');
const multer = require('../middleware/multer-config');
const ProductsController = require('../controllers/ProductsController');
const AuthController = require('../controllers/AuthController');
const UsersController = require('../controllers/UsersController');

const router = express.Router();

// Authentication routes
router.post('/api/auth/signup', AuthController.signup);
router.post('/api/auth/login', AuthController.login);

// Users routes
router.get('/api/user', UsersController.getAllUser);
router.get('/api/user/:id', UsersController.getOneUser);
router.get('/api/user/:id/products', UsersController.getAllProductByUser);
router.put('/api/user/:id', UsersController.modifyUser);
router.delete('/api/user/:id', UsersController.deleteUser);

// Products routes
router.get('/api/products', ProductsController.getAllProducts);
router.get('/api/products/:id', ProductsController.getOneProduct);
router.post('/api/products', multer.array('image'), ProductsController.createOneProduct);
router.put('/api/products/:id', multer.array('image'), ProductsController.modifyProduct);
router.delete('/api/products/:id', ProductsController.deleteProduct);

// Images routes
router.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = router;
