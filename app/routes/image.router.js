// router for avatar and product

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
// const sizeOf = require('image-size'); // thêm module này để lấy kích thước của hình ảnh

// avatar
const avatarMulter = require('../middlewares/avatarMulter.middleware');
const avatarImage = require('../models/avatarImage.model');

// product
const productMulter = require('../middlewares/productMulter.middleware');
const productImage = require('../models/productImage.model')

// upload avatar
router.post('/upload-avatar', avatarMulter.single('image'), async (req, res, next) => {
  if (req.fileValidationError) {
    return res.status(400).json({ error: req.fileValidationError });
  }

  // const dimensions = sizeOf(req.file.path); // lấy kích thước của hình ảnh
  // const existingImage = await Image.findOne({ name: req.file.originalname, width: dimensions.width, height: dimensions.height });

  // if (existingImage) {
  //     return res.status(400).json({ error: 'An image with the same name and dimensions already exists!' });
  // }

  const newAvt = new avatarImage();
  newAvt.img.data = fs.readFileSync(req.file.path);
  newAvt.img.contentType = 'image/' + path.extname(req.file.originalname).slice(1);
  newAvt.name = req.file.originalname;
  // newImg.width = dimensions.width;
  // newImg.height = dimensions.height;
  newAvt.save()
    .then((img) => {
      res.status(200).json({
        message: 'Image uploaded successfully',
        data: img._id
      });
    })
    .catch(next);
});

// get by id
router.get('/avatar-image/:id', (req, res, next) => {
  avatarImage.findById(req.params.id)
    .then((img) => {
      if (!img) {
        return res.status(404).json({ error: 'Image not found' });
      }
      res.set('Content-Type', img.img.contentType);
      return res.send(img.img.data);
    })
    .catch(next);
});

// delete
router.delete('/avatar-image/:id', async (req, res, next) => {
  try {
    const image = await avatarImage.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    await avatarImage.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: 'Image deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// product part
router.post('/upload-product-img', productMulter.single('image'), async (req, res, next) => {
  if (req.fileValidationError) {
    return res.status(400).json({ error: req.fileValidationError});
  }

  const newImg = new productImage();
  newImg.img.data = fs.readFileSync(req.file.path);
  newImg.img.contentType = 'image/' + path.extname(req.file.originalname).slice(1);
  newImg.name = req.file.originalname;
  newImg.save()
  .then((img) => {
    res.status(200).json({
      message: "Product Image Uploaded Successfully",
      data: img._id
    });
  })
  .catch(next);
});

router.get('/product-img/:id', (req, res, next) => {
  productImage.findById(req.params.id)
  .then((img) => {
    if (!img) {
      return res.status(404).json({ error: 'Product Image not found'});
    }
    res.set('Content-Type', img.img.contentType);
    return res.send(img.img.data);
  })
  .catch(next);
})

router.delete('/product-img/:id', async (req, res, next) =>{
  try {
    const image = await productImage.findById(req.params.id)

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    await productImage.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Product image deleted successfully'});
  } catch (error) {
    res.status(500).json({ error: error.message})
  }
})
module.exports = router;
