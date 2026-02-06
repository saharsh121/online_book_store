const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    // Unique book ID (can be auto or manual)
    bookId: {
      type: String,
      required: true,
      unique: true,
    },

    // Book name
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Author name
    author: {
      type: String,
      required: true,
      trim: true,
    },

    // Publication / Publisher name
    publication: {
      type: String,
      required: true,
      trim: true,
    },

    // Book description
    description: {
      type: String,
      required: true,
    },

    // Category (useful for filtering)
    category: {
      type: String,
      required: true,
    },

    // Price of the book
    price: {
      type: Number,
      required: true,
    },

    // Number of books available in stock
    stock: {
      type: Number,
      required: true,
      min: 0,
    },

    // ISBN number (optional but professional)
    isbn: {
      type: String,
    },

    // Book cover image (URL or file path)
    image: {
      type: String,

    },

    // Whether book is available for order
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isPacked: {
      type: Boolean,
      default: false
    }

  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

module.exports = mongoose.model("Book", bookSchema);
