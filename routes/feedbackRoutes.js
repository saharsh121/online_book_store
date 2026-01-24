const express = require("express");
const Feedback = require("../models/Feedback");

const router = express.Router();

/* GET: Feedback form page */
router.get("/", (req, res) => {
  res.render("feedback");
});

/* POST: Save feedback to database */
router.post("/", async (req, res) => {
  const { name, email, feedback } = req.body;

  try {
    const newFeedback = new Feedback({
      name,
      email,
      feedback
    });

    await newFeedback.save();

    res.send("Feedback submitted successfully");
  } catch (error) {
    console.log(error);
    res.send("Error submitting feedback");
  }
});

module.exports = router;
