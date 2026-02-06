const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const Order = require("../models/Order");

/* =========================
   CUSTOMER HOME (SHOW ALL BOOKS)
========================= */
router.get("/customer/main", async (req, res) => {
  try {
    const books = await Book.find({ isAvailable: true });
    res.render("customer_main", { books });
  } catch (error) {
    console.log(error);
    res.send("Error loading books");
  }
});

/* =========================
   SEARCH BOOKS
========================= */
router.get("/customer/search", async (req, res) => {
  try {
    const query = req.query.query;

    const books = await Book.find({
      isAvailable: true,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { author: { $regex: query, $options: "i" } },
        { publication: { $regex: query, $options: "i" } }
      ]
    });

    res.render("customer_main", { books });
  } catch (error) {
    console.log(error);
    res.send("Error searching books");
  }
});

/* =========================
   ADD TO CART ✅ WORKING
========================= */
router.post("/customer/add-to-cart/:id", async (req, res) => {
  try {
    const bookId = req.params.id;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.send("Book not found");
    }

    // Initialize cart if not exists
    if (!req.session.cart) {
      req.session.cart = [];
    }

    // Check if book already in cart
    const existingItem = req.session.cart.find(
      item => item.bookId === bookId
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      req.session.cart.push({
        bookId: book._id.toString(),
        title: book.title,
        price: book.price,
        image: book.image,
        quantity: 1
      });
    }

    res.redirect("/customer/main");

  } catch (error) {
    console.log(error);
    res.send("Error adding to cart");
  }
});

/* =========================
   VIEW CART PAGE ✅ FIXED
========================= */
router.get("/customer/cart", (req, res) => {
  const cart = req.session.cart || [];

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  res.render("customer_cart", {
    cart,
    totalAmount
  });
});
/* =========================
   UPDATE QUANTITY
========================= */
router.post("/customer/update-quantity/:id", (req, res) => {
  const bookId = req.params.id;
  const newQty = parseInt(req.body.quantity);

  if (!req.session.cart) {
    return res.redirect("/customer/cart");
  }

  const item = req.session.cart.find(
    item => item.bookId === bookId
  );

  if (item) {
    item.quantity = newQty;
  }

  res.redirect("/customer/cart");
});

/* =========================
   REMOVE FROM CART
========================= */
router.post("/customer/remove-from-cart/:id", (req, res) => {
  const bookId = req.params.id;

  if (!req.session.cart) {
    return res.redirect("/customer/cart");
  }

  // Remove item from cart
  req.session.cart = req.session.cart.filter(
    item => item.bookId !== bookId
  );

  res.redirect("/customer/cart");
});

/* =========================
   CONTINUE BUYING PAGE
========================= */
router.get("/customer/continue-buying", (req, res) => {
  const cart = req.session.cart || [];

  if (cart.length === 0) {
    return res.redirect("/customer/main");
  }

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  res.render("continue_buying", {
    cart,
    totalAmount
  });
});

/* =========================
   PLACE ORDER
========================= */

router.post("/customer/place-order", async (req, res) => {
  try {
    const { customerName, customerPhone, deliveryAddress, paymentMethod } = req.body;
    const cart = req.session.cart || [];

    if (cart.length === 0) {
      return res.redirect("/customer/main");
    }

    const totalAmount = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Create new order
    const newOrder = new Order({
      customerName,
      customerEmail: "customer@email.com", // can be dynamic later
      customerPhone,
      deliveryAddress,
      items: cart.map(item => ({
        bookId: item.bookId,
        title: item.title,
        price: item.price,
        quantity: item.quantity
      })),
      totalAmount,
      paymentMethod
    });

    await newOrder.save();

    // Reduce stock
    for (let item of cart) {
      await Book.findByIdAndUpdate(item.bookId, {
        $inc: { stock: -item.quantity }
      });
    }

    // Clear cart after order
    req.session.cart = [];

    res.send("Order placed successfully");

  } catch (error) {
    console.log(error);
    res.send("Error placing order");
  }
});


module.exports = router;
