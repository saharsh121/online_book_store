const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();
const Order = require("../models/Order");

/* Admin Schema */
const adminSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String
});

/* Use existing admins collection */
const Admin = mongoose.model("admins", adminSchema);

/* GET: Admin login page */
router.get("/login", (req, res) => {
  res.render("admin_login");
});

/* POST: Admin login validation */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email, password });

    if (!admin) {
      return res.render("admin_login", {
        error: "Invalid email or password"
      });
    }

    res.render("admin_main", { admin });

  } catch (error) {
    console.log(error);
    res.send("Admin login error");
  }
});
/* =========================
   MARK ORDER AS PACKED
========================= */
router.post("/mark-packed/:id", async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.params.id, {
      isPacked: true
    });

    res.redirect("/admin/orders");
  } catch (error) {
    console.log(error);
    res.send("Error updating order status");
  }
});

/* =========================
   ADMIN - VIEW ORDER DETAILS
========================= */
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.render("order_book_details", { orders });
  } catch (error) {
    console.log(error);
    res.send("Error loading orders");
  }
});

module.exports = router;
