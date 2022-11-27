const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const bookingSchema = new mongoose.Schema({
    product_id: [{
        type: ObjectId,
        ref: "product"
    }],
    customer_id: {
        type: ObjectId,
        ref: 'customer'
      },
    user_id: {
        type: ObjectId,
        ref: 'user'
    },
    start_date: {
        type: String,
        required: true
    },
    end_date: {
        type: String,
        required: true
    },
    booking_date:{
     type: String,
     required: true
    },
    lokasi_pengambilan: {
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model("booking", bookingSchema);
