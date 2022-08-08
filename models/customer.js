const mongoose = require('mongoose');
const  { ObjectId } = mongoose.Schema;
const customerSchema = new mongoose.Schema({
  nik: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  username_ig: {
    type: String,
    required: true
  },
})

module.exports = mongoose.model("customer", customerSchema);
