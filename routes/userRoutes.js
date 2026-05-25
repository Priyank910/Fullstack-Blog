const express = require("express");
const User = require("../models/User");
const {
  getUserProfile,
  getEditProfileForm,
  updateUserProfile,
  deleteUserAccount,
} = require("../controllers/userController");
const { ensureAuthenticated } = require("../middlewares/auth");
const upload = require("../config/multer");
const userRoutes = express.Router();

// profile page
userRoutes.get("/profile", ensureAuthenticated, getUserProfile);

// render edit profile form
userRoutes.get("/edit", ensureAuthenticated, getEditProfileForm);
userRoutes.post("/delete", ensureAuthenticated, deleteUserAccount);
userRoutes.post(
  "/edit",
  ensureAuthenticated,
  upload.single("profilePicture"),
  updateUserProfile,
);

module.exports = userRoutes;
