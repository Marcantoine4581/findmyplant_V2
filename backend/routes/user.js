const express = require('express');
const router = express.Router();

/* const auth = require('../middleware/auth'); */

const userCtrl = require('../controllers/user');

router.get('/', userCtrl.getAllUser);
router.get('/:id', userCtrl.getOneUser);
router.get('/:id/products', userCtrl.getAllProductByUser);
router.put('/:id', userCtrl.modifyUser);

module.exports = router;