const Product = require('../models/Product');
const fs = require('fs');
const cloudinary = require('../config/cloudinaryConfig')


exports.getAllProducts = async (req, res, next) => {
    await Product.find()
    .populate('userId')
    .then(product => res.status(200).json({ product }))
    .catch(error => res.status(400).json({ error: error }));
   };

exports.getOneProduct = async (req, res, next) => {
    await Product.findOne({ _id: req.params.id })
    .populate('userId')
    .then(product => res.status(200).json({ product }))
    .catch(error => res.status(400).json({ error: error }));
 };

exports.createOneProduct = async (req, res, next) => {
    try {
        const {path} = req.file
        const result = await cloudinary.uploader.upload(path, {
            folder: "products",
            width: 600,
            crop: "scale"
        })
        console.log(path)
        const product = new Product({
            ...req.body,
            imageUrl: result.secure_url
        });
        await product.save();

        // Delete the image
        fs.unlink(path, (error) => {
            if (error) console.log(error);
            else {
                console.log("Deleted file");
            } 
        })
        res.status(201).json({ product });
    } catch (error) {
        res.status(400).json({ error });
    }
};

exports.modifyProduct = async (req, res, next) => {
    // Verify if an image is uploaded in order to delete the old image.
    if (req.file) {
        try {
            const existingProduct = await Product.findOne({ _id: req.params.id });
            const oldImagePath = existingProduct.imageUrl;
            if (oldImagePath) {
                const filenameAndExt = oldImagePath.split('/products/')[1];
                const filename = filenameAndExt.split('.')[0];
                const public_id = "products/" + filename;
                console.log(public_id);
                cloudinary.uploader
                    .destroy(public_id)
                    .then(result => {
                        console.log(result);
                        console.log("ancienne image suprimé");
                    });

            }
            const { path } = req.file
            const result = await cloudinary.uploader.upload(path, {
                folder: "products",
                width: 600,
                crop: "scale"
            })
            console.log("image uploadé")
            const newProduct = {
                ...req.body,
                imageUrl: result.secure_url
            }
            console.log(result);
            
            fs.unlink(path, (error) => {
                if (error) console.log(error);
                else {
                    console.log("Deleted file");
                } 
            })
            Product.updateOne({ _id: req.params.id }, { ...newProduct, _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Modified!' }))
                .catch(error => res.status(400).json({ error: error }));
        } catch (error) {
            res.status(400).json({ error });
        }
    } else {
        Product.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Modified!' }))
            .catch(error => res.status(400).json({ error: error }));
    }
};

exports.deleteProduct = (req, res, next) => {
    Product.findOne({ _id: req.params.id})
       .then(product => {
            const filenameAndExt = product.imageUrl.split('/products/')[1];
            const filename = filenameAndExt.split('.')[0];
            const public_id = "products/" + filename;
            console.log(public_id);
            cloudinary.uploader
               .destroy(public_id)
               .then(result => {
                console.log(result);
                Product.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Deleted!'}))
                    .catch(error => res.status(400).json({ error: error }));
               });
       })
       .catch( error => {
            res.status(500).json({ error });
    });
};

// Routes to create / update / delete product hosted locally.

/* exports.createOneProduct = (req, res, next) => {
    const product = new Product({
        ...req.body,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    // .save enregistre les données dans la base.
    product.save()
      .then(product => res.status(201).json({ product }))
      .catch(error => res.status(400).json({ error: error }));
};

exports.modifyProduct = async (req, res, next) => {
    // Verify if an image is uploaded in order to delete the old image.
    if (req.file) {
        const existingProduct = await Product.findOne({ _id: req.params.id });
        const oldImagePath = existingProduct.imageUrl;
        if (oldImagePath) {
            const filename = oldImagePath.split('/images/')[1];
            // Delete the old image
            fs.unlink(`images/${filename}`, (error) => {
                if (error) console.log(error);
                else {
                    console.log("Deleted file");
                } 
            })
        }
    }
    const newProduct = req.file ? {
        ...req.body,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    console.log(newProduct);
    Product.updateOne({ _id: req.params.id }, { ...newProduct, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Modified!'}))
        .catch(error => res.status(400).json({ error: error }));
};

exports.deleteProduct = (req, res, next) => {
    Product.findOne({ _id: req.params.id})
       .then(product => {
            const filename = product.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Product.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Deleted!'}))
                    .catch(error => res.status(400).json({ error: error }));
            });
       })
       .catch( error => {
            res.status(500).json({ error });
    });
}; */