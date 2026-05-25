require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");
const passportConfig = require("./config/passport");
const methodOverride = require("method-override");
const passport = require("passport");
const session = require("express-session");
const errorHandler = require("./middlewares/errorHandler");
const commentRoutes = require("./routes/commentRoutes");
const MongoStore = require("connect-mongo").default;

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware : passing form data
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  }),
);

// method override middleware
app.use(methodOverride("_method"));

// Passport
passportConfig(passport);
app.use(passport.initialize());
app.use(passport.session());

// EJS
app.set("view engine", "ejs");

// Routes
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/user", userRoutes);
app.use("/", commentRoutes);

// Home route
app.get("/", (req, res) => {
  res.render("home", {
    user: req.user,
    error: "",
    title: "Home",
  });
});

// error handler
app.use(errorHandler);

// Start the server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(
      PORT,
      console.log(`Server is running at http://localhost:${PORT}`),
    );
  })
  .catch((err) => console.log("Database connection failed"));
