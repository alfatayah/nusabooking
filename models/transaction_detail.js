const mongoose = require('mongoose');
const  { ObjectId } = mongoose.Schema;
const transaction_detailSchema = new mongoose.Schema({
  transaction_Id: {
    type: ObjectId,
    ref: 'transaction'
  },
  dp_id:{
    type : ObjectId,
    ref: 'dp_payment'
  },
  split_id:{
    type : ObjectId,
    ref: 'split_payment'
  },
  kasbon_id:{
    type : ObjectId,
    ref: 'kasbon_payment'
  },
  transfer_id:{
    type : ObjectId,
    ref: 'transfer_payment'
  }
})

module.exports = mongoose.model("transaction_detail", transaction_detailSchema);