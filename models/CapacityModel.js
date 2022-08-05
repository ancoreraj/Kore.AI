const mongoose = require('mongoose')

const capacitySchema = new mongoose.Schema({
    orderDate: {
        type: String,
        unique: true,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
},
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Capacity', capacitySchema)
