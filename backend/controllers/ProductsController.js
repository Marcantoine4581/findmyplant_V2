const fs = require('fs');
const cloudinary = require('../config/cloudinaryConfig');
const Product = require('../models/Product');
const cloudinaryPublicId = require('../utils/cloudinary');
const User = require('../models/User');

class ProductsController {
  static getAllProducts(req, res) {
    res.status(200).json(res.resultsPaginatedAndFiltered);
  }

  static async getOneProduct(req, res) {
    await Product.findOne({ _id: req.params.id })
      .populate('userId')
      .then((product) => res.status(200).json({ product }))
      .catch((error) => res.status(400).json({ message: error.message }));
  }

  static async createOneProduct(req, res) {
    const { userId, plantName, condition } = req.body;

    // Check the userId
    const foundUser = await User.findOne({ _id: userId });
    if (!foundUser) {
      return res.status(400).json({ message: 'L\'utilisateur n\'existe pas' });
    }

    // Check the plantName
    if (!plantName) {
      return res.status(400).json({ message: 'Merci d\'indiquer un nom à votre plante.' });
    }

    // Check the condition
    if (!condition) {
      return res.status(400).json({ message: 'Merci d\'indiquer une condition à votre annonce.' });
    }

    // Check the image.
    const listImage = req.files;
    if (listImage.length === 0) {
      return res.status(400).json({ message: 'Merci d\'intégrer une image à votre annonce.' });
    }
    
    
    try {
      const uploadPromises = listImage.map(async (image) => {
        // Save the image in Cloudinary
        const result = await cloudinary.uploader.upload(image.path, {
          folder: 'products',
          width: 600,
          crop: 'scale',
        });

        // Once saved, delete the image from the server.
        fs.unlink(image.path, (error) => {
          if (error) console.log(error);
          else {
            console.log(`${image.path} deleted`);
          }
        });

        return result.secure_url;
      });

      const imagesUrl = await Promise.all(uploadPromises);

      // Create and save new product in the DB.
      const product = new Product({
        ...req.body,
        imageUrl: imagesUrl,
      });
      await product.save();

      res.status(201).json({ product });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async modifyProduct(req, res) {
    // Verify if an image is uploaded in order to delete the old image.
    if (req.file) {
      try {
        const existingProduct = await Product.findOne({ _id: req.params.id });
        const oldImagePath = existingProduct.imageUrl;
        if (oldImagePath) {
          const publicId = cloudinaryPublicId(oldImagePath);
          console.log(publicId);
          cloudinary.uploader.destroy(publicId).then((result) => {
            console.log(result);
            console.log('ancienne image suprimé');
          });
        }

        const { path } = req.file;
        const result = await cloudinary.uploader.upload(path, {
          folder: 'products',
          width: 600,
          crop: 'scale',
        });
        console.log('image uploadé');
        const newProduct = {
          ...req.body,
          imageUrl: result.secure_url,
        };
        console.log(result);

        fs.unlink(path, (error) => {
          if (error) console.log(error);
          else {
            console.log('Deleted file');
          }
        });
        Product.updateOne(
          { _id: req.params.id },
          { ...newProduct, _id: req.params.id },
        )
          .then(() => res.status(200).json({ message: 'Modified!' }))
          .catch((error) => res.status(400).json({ error }));
      } catch (error) {
        res.status(400).json({ error });
      }
    } else {
      Product.updateOne(
        { _id: req.params.id },
        { ...req.body, _id: req.params.id },
      )
        .then(() => res.status(200).json({ message: 'Modified!' }))
        .catch((error) => res.status(400).json({ error }));
    }
  }

  static async deleteProduct(req, res) {
    try {
      const existingProduct = await Product.findOne({ _id: req.params.id });
      if (!existingProduct) {
        return res.status(400).json({ message: 'Oups! Le produit est introuvable.' });
      }
      const deletePromises = existingProduct.imageUrl.map(async (imgUrl) => {
        const publicId = cloudinaryPublicId(imgUrl);
        const result = await cloudinary.uploader.destroy(publicId);
        if (!result) {
          return res.status(500).json({ message: 'Une erreur s\'est produite lors de la suppression de l\'image' });
        }
        console.log('Image supprimé de Cloudinary');
        return result;
      });

      await Promise.all(deletePromises);

      const deletedProduct = await Product.deleteOne({ _id: req.params.id });
      if (!deletedProduct) {
        return res.status(500).json({ message: 'Une erreur s\'est produite lors de la suppression de l\'image' });
      }
      return res.status(200).json({ message: 'Votre plante a bien été supprimée.' });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }

    // Product.findOne({ _id: req.params.id })
    //   .then((product) => {
    //     for (let i = 0; i < product.imageUrl.length; i++) {
    //       const publicId = cloudinaryPublicId(product.imageUrl[i]);
    //       console.log(publicId);

    //       // Delete file from Cloudinary
    //       cloudinary.uploader.destroy(publicId)
    //         .then((result) => {
    //           console.log(result);
    //           // Then Delete file in the DB.
    //           Product.deleteOne({ _id: req.params.id })
    //             .then(() => {
    //               return res.status(200).json({ message: 'Deleted!' })
    //             })
    //             .catch((error) => res.status(400).json({ message: error.message }));
    //         })
    //         .catch((error) => res.status(500).json({ error }));
    //     }
    //   })
    //   .catch((error) => {
    //     res.status(500).json({ error });
    //   });
  }
}

module.exports = ProductsController;
