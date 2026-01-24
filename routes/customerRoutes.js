const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

/* Customer Schema */
const customerSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String
});

/* Use existing customers collection */
const Customer = mongoose.model("customers", customerSchema);

/* GET customer login page */
router.get("/login", (req, res) => {
  res.render("customer_login");
});

/* POST customer login validation */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const customer = await Customer.findOne({ email, password });

    if (!customer) {
      return res.render("customer_login", {
        error: "Invalid email or password"
      });
    }

    res.render("customer_main", { customer });

  } catch (error) {
    console.log(error);
    res.send("Login error");
  }
});

module.exports = router;
