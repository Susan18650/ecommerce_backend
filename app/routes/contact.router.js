var router = require('express').Router()

const contactController = require('../controllers/contact.controller');
const userMiddleWare = require("../middlewares/user.middleware")

router.post('/contact', contactController.createContact);
router.get('/contact', [userMiddleWare.verifyToken, userMiddleWare.checkUser], contactController.getAll);
router.delete('/contact/:id', [userMiddleWare.verifyToken, userMiddleWare.checkUser], contactController.delete);

module.exports = router;
