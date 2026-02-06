const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

/* Middleware */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* Static files (CSS) */
app.use(express.static("public"));

/* View engine */
app.set("view engine", "ejs");

/* MongoDB connection */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

  const session = require("express-session");

app.use(
  session({
    secret: "bookstore_secret",
    resave: false,
    saveUninitialized: true
  })
);


/* Home page */
app.get("/", (req, res) => {
  res.render("home");
});

/* Customer routes */
const customerRoutes = require("./routes/customerRoutes");
app.use("/customer", customerRoutes);

/* Admin routes */
const adminRoutes = require("./routes/adminRoutes");
app.use("/admin", adminRoutes);

/* feedback routes */
const feedbackRoutes = require("./routes/feedbackRoutes");
app.use("/feedback", feedbackRoutes);


const uploadBookRoutes = require("./routes/upload_book");
app.use("/", uploadBookRoutes);

const customerBookRoutes = require("./routes/customerBookRoutes");
app.use("/", customerBookRoutes);



/* Server */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
