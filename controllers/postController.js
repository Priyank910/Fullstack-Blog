const asyncHandler = require("express-async-handler");
const Post = require("../models/Post");
const File = require("../models/File");
const cloudinary = require("../config/cloudinary");
const { model } = require("mongoose");

// Rendering post form
exports.getPostForm = asyncHandler((req, res) => {
  res.render("newPost", {
    title: "Create a New Post",
    user: req.user,
    error: "",
    success: "",
  });
});

// Creating a new post
exports.createPost = asyncHandler(async (req, res) => {
  const { title, contents } = req.body;
  // Validation
  // if (!req.files || req.files.length === 0) {
  //   return res.render("newPost", {
  //     title: "Create Post",
  //     user: req.user,
  //     error: "At least one image is required.",
  //     success: "",
  //   });
  // }

  const images = await Promise.all(
    req.files.map(async (file) => {
      // Save the images to our database
      const newFile = new File({
        url: file.path,
        public_id: file.filename,
        uploaded_by: req.user._id,
      });
      await newFile.save();
      return {
        url: newFile.url,
        public_id: newFile.public_id,
      };
    }),
  );

  // Create the post
  const newPost = new Post({
    title,
    contents,
    author: req.user._id,
    images,
  });
  await newPost.save();

  res.render("newPost", {
    title: "Create Post",
    user: req.user,
    success: "Post created successfully",
    error: "",
  });
});

// Get all posts
exports.getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find().populate("author", "username");
  res.render("posts", {
    title: "All Posts",
    user: req.user,
    posts,
    success: "",
    error: "",
  });
});

// get post by ID
exports.getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate("author", "username")
    .populate({
      path: "comments",
      populate: {
        path: "author",
        model: "User",
        select: "username",
      },
    });
  res.render("postDetails", {
    title: "Post",
    user: req.user,
    post,
    success: "",
    error: "",
  });
});

// get edit post form
exports.getEditPostForm = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.render("postDetails", {
      title: "Post",
      user: req.user,
      post,
      success: "",
      error: "Post not found",
    });
  }
  res.render("editPost", {
    title: "Edit Post",
    user: req.user,
    post,
    success: "",
    error: "",
  });
});

// update post
exports.updatePost = asyncHandler(async (req, res) => {
  const { title, contents } = req.body;
  // find post
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.render("postDetails", {
      title: "Post",
      user: req.user,
      post,
      success: "",
      error: "Post not found",
    });
  }

  // update post
  if (post.author.toString() !== req.user._id.toString()) {
    return res.render("postDetails", {
      title: "Post",
      user: req.user,
      post,
      success: "",
      error: "You are not authorized to edit this post",
    });
  }

  post.title = title || post.title;
  post.contents = contents || post.contents;

  if (req.files) {
    await Promise.all(
      post.images.map(async (image) => {
        await cloudinary.uploader.destroy(image.public_id);
      }),
    );
  }
  post.images = await Promise.all(
    req.files.map(async (file) => {
      const newFile = new File({
        url: file.path,
        public_id: file.filename,
        uploaded_by: req.user._id,
      });
      await newFile.save();
      return {
        url: newFile.url,
        public_id: newFile.public_id,
      };
    }),
  );
  await post.save();
  res.redirect(`/posts/${post._id}`);
});

// delete post
exports.deletePost = asyncHandler(async (req, res) => {
  // find post
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.render("postDetails", {
      title: "Post",
      user: req.user,
      post,
      success: "",
      error: "Post not found",
    });
  }
  if (post.author.toString() !== req.user._id.toString()) {
    return res.render("postDetails", {
      title: "Post",
      user: req.user,
      post,
      success: "",
      error: "You are not authorized to delete this post",
    });
  }
  await Promise.all(
    post.images.map(async (image) => {
      await cloudinary.uploader.destroy(image.public_id);
    }),
  );
  await Post.findByIdAndDelete(req.params.id);
  res.redirect("/posts");
});
