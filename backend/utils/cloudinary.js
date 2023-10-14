function cloudinaryPublicId(imageUrl) {
  const filenameAndExt = imageUrl.split('/products/')[1];
  const filename = filenameAndExt.split('.')[0];
  const publicId = `products/${filename}`;
  return publicId;
}

module.exports = cloudinaryPublicId;
