const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

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

module.exports = router;
