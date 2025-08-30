const express = require('express');
const authController = require('../controller/auth.controller')


const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/send-reset-otp',  authController.sendOtp);
router.post('/verify-reset-otp', authController.verifyOtp);
router.post('/reset-password', authController.resetPassword);




module.exports = router;


