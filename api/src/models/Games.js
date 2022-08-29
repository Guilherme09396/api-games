const mongoose = require("mongoose");

const gameSchema = mongoose.Schema({
  name: {type: String, required: true},
  year: {type: Number, required: true},
  price: {type: Number, required: true}
})

module.exports = mongoose.model("Games", gameSchema);