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

/* Server */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
