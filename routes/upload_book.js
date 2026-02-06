const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Book = require("../models/Book");

/* =========================
   MULTER CONFIG (IMAGE UPLOAD)
========================= */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

/* =========================
   ADMIN MAIN DASHBOARD
========================= */
router.get("/admin/main", (req, res) => {
  res.render("admin_main");
});

/* =========================
   GET: Upload Book Page
========================= */
router.get("/admin/upload-book", (req, res) => {
  res.render("upload_book");
});

/* =========================
   POST: Save Book Details
========================= */
router.post(
  "/admin/upload-book",
  upload.single("image"),
  async (req, res) => {
    try {
      const {
        bookId,
        title,
        author,
        publication,
        description,
        category,
        price,
        stock
      } = req.body;

      const newBook = new Book({
        bookId,
        title,
        author,
        publication,
        description,
        category,
        price,
        stock,
        image: `/uploads/${req.file.filename}`,
        isAvailable: stock > 0
      });

      await newBook.save();

      // Redirect to admin dashboard
      res.redirect("/admin/main");

    } catch (error) {
      console.error(error);
      res.send("Error while uploading book");
    }
  }
);

module.exports = router;
