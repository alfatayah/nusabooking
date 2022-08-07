const mongoose = require('mongoose');
const  { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema({
  product_name: {
    type: String,
    required: true
  },
  tipe: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  barcode: {
    type: String,
    required: true
  },
  status_produk: {
    type: String,
    required: true
  },
  
})

module.exports = mongoose.model("product", productSchema);
