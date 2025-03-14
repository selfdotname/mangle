const mongoose = require("mongoose")

const accountSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true
  },
  password: String
})

module.exports = mongoose.model("account", accountSchema)