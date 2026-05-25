const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const File = require("../models/File");
const Post = require("../models/Post");
const cloudinary = require("../config/cloudinary");
const Comment = require("../models/Comment");

// get user profile
exports.getUserProfile = asyncHandler(async (req, res) => {
  // find users
  const user = await User.findById(req.user.id).select("-password");
  if (!user) {
    return res.render("login", {
      title: "Login",
      user: req.user,
      error: "User not found. Please log in.",
    });
  }

  // fetch user's posts
  const posts = await Post.find({ author: user._id }).sort({ createdAt: -1 });

  res.render("profile", {
    title: "Profile",
    user,
    posts,
    error: "",
    postCount: posts.length,
  });
});

// get edit profile form
exports.getEditProfileForm = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) {
    return res.render("login", {
      title: "Login",
      user: req.user,
      error: "User not found. Please log in.",
    });
  }
  res.render("editProfile", {
    title: "Edit Profile",
    user,
    error: "",
  });
});

// update profile
exports.updateUserProfile = asyncHandler(async (req, res) => {
  const { username, email, bio } = req.body;

  const user = await User.findById(req.user.id).select("-password");
  if (!user) {
    return res.render("login", {
      title: "Login",
      user: req.user,
      error: "User not found. Please log in.",
    });
  }

  user.username = username || user.username;
  user.email = email || user.email;
  user.bio = bio || user.bio;

  if (req.file) {
    if (user.profilePicture && user.profilePicture.public_id) {
      await cloudinary.uploader.destroy(user.profilePicture.public_id);
    }
    const file = await File({
      url: req.file.path,
      public_id: req.file.filename,
      uploaded_by: user._id,
    });
    await file.save();
    user.profilePicture = {
      url: file.url,
      public_id: file.public_id,
    };
  }

  await user.save();

  res.render("editProfile", {
    title: "Edit Profile",
    user,
    error: "",
    success: "Profile updated successfully!",
  });
});

// delete user account
exports.deleteUserAccount = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    res.render("login", {
      title: "Login",
      user: req.user,
      error: "User not found. Please log in.",
    });
  }

  // delete profile picture from cloudinary
  if (user.profilePicture && user.profilePicture.public_id) {
    await cloudinary.uploader.destroy(user.profilePicture.public_id);
  }

  // delete user's posts
  const posts = await Post.find({ author: req.user._id });
  for (const post of posts) {
    for (const image of post.images) {
      await cloudinary.uploader.destroy(image.public_id);
    }
    await Comment.deleteMany({ post: post._id });
    await Post.findByIdAndDelete(post._id);
  }
  // delete the all comments made by the user
  await Comment.deleteMany({ author: req.user._id });

  // delete all files uploaded by the user
  const files = await File.find({ uploaded_by: req.user._id });
  for (const file of files) {
    await cloudinary.uploader.destroy(file.public_id);
  }

  // delete user
  await User.findByIdAndDelete(req.user.id);
  res.redirect("/auth/register");
});
