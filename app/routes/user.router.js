const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const userMiddleWare = require("../middlewares/user.middleware")

router.get('/user', [userMiddleWare.verifyToken, userMiddleWare.checkUser], (req, res, next) => {
    if (req.query.username) {
      userController.getUserByUsername(req, res, next);
    } else {
      userController.getAllUser(req, res, next);
    }
  });
router.post('/user', [userMiddleWare.verifyToken, userMiddleWare.checkUser], userController.createUser);
router.get('/user/:userid',[userMiddleWare.verifyToken, userMiddleWare.checkUser], userController.getUserById);
router.put('/user/:userid',[userMiddleWare.verifyToken, userMiddleWare.checkUser], userController.updateUserById);
router.delete('/user/:userid',[userMiddleWare.verifyToken, userMiddleWare.checkUser], userController.deleteUser);

module.exports = router;