const fs = require('fs');
const cloudinary = require('../config/cloudinaryConfig');
const Product = require('../models/Product');

class ProductsController {
  static async getAllProducts(req, res) {
    await Product.find()
      .populate('userId')
      .then((product) => res.status(200).json({ product }))
      .catch((error) => res.status(400).json({ error }));
  }

  static async getOneProduct(req, res) {
    await Product.findOne({ _id: req.params.id })
      .populate('userId')
      .then((product) => res.status(200).json({ product }))
      .catch((error) => res.status(400).json({ error }));
  }

  static async createOneProduct(req, res) {
    try {
      const { path } = req.file;
      const result = await cloudinary.uploader.upload(path, {
        folder: 'products',
        width: 600,
        crop: 'scale',
      });
      console.log(path);
      const product = new Product({
        ...req.body,
        imageUrl: result.secure_url,
      });
      await product.save();

      // Delete the image
      fs.unlink(path, (error) => {
        if (error) console.log(error);
        else {
          console.log('Deleted file');
        }
      });
      res.status(201).json({ product });
    } catch (error) {
      res.status(400).json({ error });
    }
  }

  static async modifyProduct(req, res) {
    // Verify if an image is uploaded in order to delete the old image.
    if (req.file) {
      try {
        const existingProduct = await Product.findOne({ _id: req.params.id });
        const oldImagePath = existingProduct.imageUrl;
        if (oldImagePath) {
          const filenameAndExt = oldImagePath.split('/products/')[1];
          const filename = filenameAndExt.split('.')[0];
          const publicId = `products/${filename}`;
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
    Product.findOne({ _id: req.params.id })
      .then((product) => {
        const filenameAndExt = product.imageUrl.split('/products/')[1];
        const filename = filenameAndExt.split('.')[0];
        const publicId = `products/${filename}`;
        console.log(publicId);
        cloudinary.uploader.destroy(publicId).then((result) => {
          console.log(result);
          Product.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Deleted!' }))
            .catch((error) => res.status(400).json({ error }));
        });
      })
      .catch((error) => {
        res.status(500).json({ error });
      });
  }
}

module.exports = ProductsController;
