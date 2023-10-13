function cloudinaryPublicId(product) {
  const filenameAndExt = product.imageUrl.split('/products/')[1];
  const filename = filenameAndExt.split('.')[0];
  const publicId = `products/${filename}`;
  return publicId;
}

module.exports = cloudinaryPublicId;
