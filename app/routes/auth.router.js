const express = require('express');

const router = express.Router();

const authController = require("../controllers/auth.controller");


router.post("/signup", authController.signUp);

router.post("/signin", authController.signIn);

router.post("/refresh-token", authController.refreshToken);

router.post("/forgot-password", authController.forgotPassword);

router.get("/reset-password/:id/:token", authController.resetPasswordForm);

router.post("/reset-password/:id/:token", authController.handleResetPassword);

router.post("/change-password", authController.changePassword);


// router.post("/verify-email", authController.verifyEmail);

module.exports = router;