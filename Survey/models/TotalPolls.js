const mongoose = require("mongoose")

const totalPollsSchema = new mongoose.Schema({
  totalPoll: {
    type: Number,
    default: 0
  }
})

module.exports = mongoose.model("TotalPoll", totalPollsSchema)