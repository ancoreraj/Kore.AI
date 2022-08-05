const mongoose = require('mongoose')

const ordersSchema = new mongoose.Schema({
    orderPlacedBy: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        enum : ['placed','packed','dispatched','delivered'],
        default: 'placed',
        require: true
    },
    orderDate: {
        type: String,
        require: true
    },
    orderAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    }
},
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Orders', ordersSchema)
