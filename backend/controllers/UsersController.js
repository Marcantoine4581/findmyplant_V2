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
            .then(() => res.status(200).json({ message: 'Modified!' }))
            .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
    } else {
      User.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Profil mis à jour avec succès' }))
        .catch((error) => res.status(400).json({ error }));
    }
  }

  static async deleteUser(req, res) {
    // Find the user by ID
    User.findOne({ _id: req.params.id })
      .then((user) => {
        // Check if user exist
        if (!user) {
          return res.status(404).json({ message: 'Utilisateur introuvable' });
        }
        // Find all product from user
        Product.find({ userId: user._id })
          // Then for each product:
          .then((result) => result.forEach((product) => {
            const publicId = cloudinaryPublicId(product);
            console.log(publicId);

            // Delete file from Cloudinary
            cloudinary.uploader.destroy(publicId)
              .then((result) => {
                console.log(result);

                // Then Delete file in the DB.
                Product.deleteOne({ _id: req.params.id })
                  .then((product) => console.log(`Product ${product._id} deleted in DB`))
                  .catch((error) => res.status(400).json({ message: error.message }));
              })
              .catch((error) => res.status(500).json({ message: error.message }));
          }))
          .catch((error) => res.status(400).json({ message: error.message }));

        User.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'User deleted!' }))
          .catch((error) => res.status(400).json({ message: error.message }));
      })
      .catch((error) => res.status(400).json({ message: error.message }));
  }

}

module.exports = UsersController;
