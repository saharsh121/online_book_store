const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    /* =========================
       CUSTOMER DETAILS
    ========================= */
    customerName: {
      type: String,
      required: true
    },

    customerEmail: {
      type: String,
      required: true
    },

    customerPhone: {
      type: String,
      required: true
    },

    deliveryAddress: {
      type: String,
      required: true
    },

    /* =========================
       ORDER ITEMS
    ========================= */
    items: [
      {
        bookId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Book",
          required: true
        },
        title: {
          type: String,
          required: true
        },
        price: {
          type: Number,
          required: true
        },
        quantity: {
          type: Number,
          required: true
        }
      }
    ],

    /* =========================
       PAYMENT DETAILS
    ========================= */
    paymentMethod: {
      type: String,
      enum: ["COD", "Online", "Dummy"],
      default: "Dummy"
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending"
    },

    /* =========================
       ORDER SUMMARY
    ========================= */
    totalAmount: {
      type: Number,
      required: true
    },

    orderStatus: {
      type: String,
      enum: ["Placed", "Shipped", "Delivered"],
      default: "Placed"
    },

    /* =========================
       PACKING STATUS (ADMIN)
    ========================= */
    isPacked: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Order", orderSchema);
