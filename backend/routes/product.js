const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const productCtrl = require('../controllers/product');

router.get('/', productCtrl.getAllProducts);
router.get('/:id', productCtrl.getOneProduct);
router.post('/', multer.single('image'), productCtrl.createOneProduct);
router.put('/:id', multer.single('image'), productCtrl.modifyProduct);
router.delete('/:id', productCtrl.deleteProduct);

module.exports = router;