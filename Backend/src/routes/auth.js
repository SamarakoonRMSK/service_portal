const express = require("express");
const { body } = require("express-validator");
const authenticate = require("../middleware/auth");
const {
  register,
  login,
  getMe,
} = require("../controllers/authController");

const router = express.Router();

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email")
      .trim()
      .isEmail()
      .withMessage("Please enter a valid email address")
      .normalizeEmail(),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  register
);

router.post(
  "/login",
  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Please enter a valid email address")
      .normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  login
);

router.get("/me", authenticate, getMe);

module.exports = router;
