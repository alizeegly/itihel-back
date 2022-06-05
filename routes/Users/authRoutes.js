const express = require("express");
const router = express.Router();

const { registerUser, loginUser, logoutUser, auth2 } = require("../../controllers/Users/AuthController");
const { registerLimiter, loginLimiter } = require("../../utils/rateLimiter");

const auth = require("../../middlewares/auth");
const bcrypt = require("bcryptjs");
const User = require("../../models/Users/User");

/**
 * @method - POST
 * @param - /signup
 * @description - User register
 */
router.post("/register", registerLimiter, registerUser );

/**
 * @method - POST
 * @param - /login
 * @description - User login
 */
router.post("/login", loginLimiter, loginUser );
 
/**
 * @method - DELETE
 * @param - /logout
 * @description - User Logout
 */
router.delete("/logout", logoutUser );
 
/**
 * @method - GET
 * @param - /
 * @description - Get user by token/ Loading user
 */
router.get("/auth", auth, auth2)


module.exports = router;