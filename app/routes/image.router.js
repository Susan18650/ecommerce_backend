const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size'); // thêm module này để lấy kích thước của hình ảnh

const multer = require('../middlewares/multer.middleware');
const Image = require('../models/image.model');

// upload
router.post('/upload', multer.single('image'), async (req, res, next) => {
    if (req.fileValidationError) {
        return res.status(400).json({ error: req.fileValidationError });
    }
    
    // const dimensions = sizeOf(req.file.path); // lấy kích thước của hình ảnh
    // const existingImage = await Image.findOne({ name: req.file.originalname, width: dimensions.width, height: dimensions.height });

    // if (existingImage) {
    //     return res.status(400).json({ error: 'An image with the same name and dimensions already exists!' });
    // }

    const newImg = new Image();
    newImg.img.data = fs.readFileSync(req.file.path);
    newImg.img.contentType = 'image/' + path.extname(req.file.originalname).slice(1);
    newImg.name = req.file.originalname;
    // newImg.width = dimensions.width;
    // newImg.height = dimensions.height;
    newImg.save()
        .then((img) => {
            res.status(200).json({
                message: 'Image uploaded successfully',
                data: img._id
            });
        })
        .catch(next);
});

// get by id
router.get('/image/:id', (req, res, next) => {
    Image.findById(req.params.id)
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
router.delete('/image/:id', async (req, res, next) => {
    try {
      const image = await Image.findById(req.params.id);
  
      if (!image) {
        return res.status(404).json({ error: 'Image not found' });
      }
  
      await Image.findByIdAndDelete(req.params.id);
  
      res.status(200).json({
        message: 'Image deleted successfully'
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
module.exports = router;
