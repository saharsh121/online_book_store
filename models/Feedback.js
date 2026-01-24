const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  name: String,
  email: String,
  feedback: String
});

module.exports = mongoose.model("feedback", feedbackSchema);
