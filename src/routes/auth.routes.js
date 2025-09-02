const express = require('express');
const authController = require('../controller/auth.controller');


const router = express.Router();



// @route   POST /register
// @desc    Register a new user
router.post('/register', authController.register);


// @route   POST /login
// @desc    Login user with email & password
router.post('/login', authController.login);


// @route   POST /send-reset-otp
// @desc    Send OTP to user's email for password reset
router.post('/send-reset-otp', authController.sendOtp);


// @route   POST /verify-reset-otp
// @desc    Verify OTP for password reset
router.post('/verify-reset-otp', authController.verifyOtp);


// @route   POST /reset-password
// @desc    Reset password after OTP verification
router.post('/reset-password', authController.resetPassword);


// @route   POST /google-auth
// @desc    Login or register user via Google authentication
router.post('/google-auth', authController.googleAuth);

// @route   POST /logout
// @desc    Logout user
router.post('/logout', authController.logout);




module.exports = router;


