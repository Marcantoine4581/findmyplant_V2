const bcrypt = require('bcrypt');
const User = require('../models/User');
const Product = require('../models/Product');
const cloudinary = require('../config/cloudinaryConfig');
const cloudinaryPublicId = require('../utils/cloudinary');

class UsersController {
  static async getAllUser(req, res) {
    User.find()
      .then((user) => res.status(200).json({ user }))
      .catch((error) => res.status(400).json({ error }));
  }

  static async getOneUser(req, res) {
    User.findOne({ _id: req.params.id })
      .then((user) => res.status(200).json({ user }))
      .catch((error) => res.status(400).json({ error }));
  }

  static async getAllProductByUser(req, res) {
    // Rechercher l'utilisateur par ID
    User.findOne({ _id: req.params.id })
      .then((user) => {
        // Vérifier si l'utilisateur existe
        if (!user) {
          res.status(404).json({ message: 'Utilisateur introuvable' });
        }
        // Récupérer tous les produits
        Product.find({ userId: user._id })
          .then((products) => res.status(200).json({ user, products }))
          .catch((error) => res.status(400).json({ error }));
      })
      .catch((error) => res.status(400).json({ error }));
  }

  static async modifyUser(req, res) {
    const existingUser = await User.findOne({ _id: req.params.id });
    if (req.body.password !== existingUser.password) {
      bcrypt.hash(req.body.password, 10)
        .then((hash) => {
          User.updateOne({ _id: req.params.id }, {
            userName: req.body.userName,
            email: req.body.email,
            password: hash,
            adress: {
              street: req.body.adress.street,
              city: req.body.adress.city,
              postalCode: req.body.adress.postalCode,
              country: req.body.adress.country,
            },
            _id: req.params.id,
          })
            .then(() => res.status(200).json({ message: 'Profil mis à jour avec succès' }))
            .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
    } else {
      User.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Profil mis à jour avec succès' }))
        .catch((error) => res.status(400).json({ error }));
    }
  }

  /* eslint-disable consistent-return */
  static async deleteUser(req, res) {
    try {
      // Find the user by ID
      const user = await User.findOne({ _id: req.params.id });
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur introuvable' });
      }

      const products = await Product.find({ userId: user._id });
      if (products.length > 0) {
        products.forEach(async (product) => {
          await product.imageUrl.forEach(async (image) => {
            const publicId = cloudinaryPublicId(image);
            console.log(publicId);

            const result = await cloudinary.uploader.destroy(publicId);
            console.log(result);
            if (!result) {
              return res.status(500).json({ message: 'Une erreur s\'est produite lors de la suppression de l\'image' });
            }
            console.log('Image supprimé de Cloudinary');
          });
        });
        const deletedProducts = await Product.deleteMany({ userId: user._id });
        console.log(deletedProducts);
      }
      User.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'User deleted!' }))
        .catch((error) => res.status(400).json({ message: error.message }));
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = UsersController;
