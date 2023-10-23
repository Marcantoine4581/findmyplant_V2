const fs = require('fs');

function deleteImages(reqFiles) {
  reqFiles.forEach((image) => {
    fs.unlink(image.path, (error) => {
      if (error) console.log(error);
      else {
        console.log(`${image.path} deleted`);
      }
    });
  });
}

module.exports = deleteImages;
