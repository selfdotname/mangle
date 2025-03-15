const mongoose = require("mongoose")

const optionSchema = new mongoose.Schema({
  text: String,
  poll: {
    type: Number,
    default: 0
  }
})

const questionSchema = new mongoose.Schema({
  question: String,
  options: [optionSchema]
})

module.exports = mongoose.model("Question", questionSchema)