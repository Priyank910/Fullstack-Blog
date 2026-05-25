const bcrypt = require("bcryptjs");
const User = require("../models/User");
const passport = require("passport");
const asyncHandler = require("express-async-handler");

// Login page
exports.getLogin = asyncHandler((req, res) => {
  res.render("login", {
    title: "Login",
    user: req.user,
    error: "",
  });
});

// Main logic for user login
exports.login = asyncHandler(async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.render("login", {
        title: "Login",
        user: req.user,
        error: info.message,
      });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/user/profile");
    });
  })(req, res, next);
});

// Register page
exports.getRegister = asyncHandler((req, res) => {
  res.render("register", {
    title: "Register",
    user: req.user,
    error: "",
  });
});

// Main logic for user registration
exports.register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render("register", {
        title: "Register",
        user: req.user,
        error: "Email already exists",
      });
    }
    // Hash the user passord
    const hashedPassword = await bcrypt.hash(password, 10);
    // Save the user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    res.redirect("/auth/login");
  } catch (error) {
    res.render("register", {
      title: "Redister",
      user: req.user,
      error: error.message,
    });
  }
});

// Logout
exports.logout = asyncHandler((req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/auth/login");
  });
});
