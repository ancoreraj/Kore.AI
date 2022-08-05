const OrdersModel = require("../models/OrdersModel");
const CapacityModel = require("../models/CapacityModel");

const JWT_SECRET = process.env.JWT_SECRET;
const MAX_CAPACITY = 500 //Litre

const getDate = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDay()
    const today = `${day}-${month + 1}-${year}`;

    return today;
}

const createOrderController = async (req, res) => {
    try {
        const { orderPlacedBy, quantity } = req.body

        if(quantity <= 0){
            return res.status(400).json({message: "Must place an order grater than zero"})
        }

        const today = getDate();

        const searchTodayCapacity = await CapacityModel.findOne({ orderDate: today })

        let todayCapacity;

        if (searchTodayCapacity === null) {
            todayCapacity = new CapacityModel({
                orderDate: today,
                quantity: MAX_CAPACITY //By default maximum 500 litres of Milk Capacity
            })
        }else{
            todayCapacity = searchTodayCapacity
        }

        if (quantity > todayCapacity.quantity) {
            return res.status(400).json({ message: `Not enough quantity in stock` })
        }

        todayCapacity.quantity -= quantity;

        const newOrder = new OrdersModel({
            orderPlacedBy,
            quantity,
            orderDate: today,
            orderAdmin: req.Admin,
        })

        todayCapacity.save((err) => {
            if (err) {
                return res.status(500).json({ error: "Mongo Error" })
            }
        })

        newOrder.save((err) => {
            if (err) {
                return res.status(500).json({ error: "Mongo Error" })
            }
        })

        res.status(201).json({ message: "Order Placed Successfully!" });
        
    } catch (err) {
        res.status(500).json(err);
    }
}

const updateOrderController = async (req, res) => {
    try {
        const { orderPlacedBy, quantity, orderStatus } = req.body
        const { id } = req.params

        const order = await OrdersModel.findById(id)

        const capacity = await CapacityModel.findOne({orderDate: order.orderDate})

        if (!order) {
            return res.status(400).json({ message: 'No order exist for this id' })
        }

        if (quantity) {
            const changeInQuantity = quantity - order.quantity;
            const quantityLeft = capacity.quantity - changeInQuantity;

            if(quantityLeft < 0){
                return res.status(400).json({ message: `Place an order less than ${capacity.quantity}`})
            }

            order.quantity = quantity
            capacity.quantity -= changeInQuantity

            capacity.save((err) => {
                if(err)
                    return res.status(500).json({ error: "Mongo Error" })
            })
        }

        if(orderPlacedBy){
            order.orderPlacedBy = orderPlacedBy
        }

        if(orderStatus){
            order.orderStatus = orderStatus
        }

        order.save((err)=>{
            if(err)
                return res.status(500).json({ error: "Mongo Error" })
        })

        res.status(201).json({ message: "Order Updated successfully!!" });

    } catch (err) {
        res.status(500).json(err);
    }
}

const updateOrderStatusController = async (req, res) => {
    try {
        const { id } = req.params
        const { orderStatus } = req.body

        let statusValue = ["placed","packed","dispatched","delivered"] 
        
        if(statusValue.indexOf(orderStatus) === -1 ){
            return res.status(400).json({message: "Order Status invalid"})
        }

        const order = await OrdersModel.findById(id);
        order.orderStatus = orderStatus

        order.save((err) => {
            if (err) {
                return res.status(500).json({ error: "Mongo Error" })
            }
        })

        res.status(201).json({ message: `Order Status update to ${orderStatus}` });

    } catch (err) {
        res.status(500).json(err);
    }
}

const deleteOrderController = async (req, res) => {
    try {
        const { id } = req.params

        const order = await OrdersModel.findById(id)

        order.remove((err) => {
            return res.status(500).json({ error: "Mongo Error" })
        })

        res.status(201).json({ message: `Order Deleted!` });

    } catch (err) {
        res.status(500).json(err);
    }
}

const getCapacityController = async (req, res) => {
    try {
        const { date } = req.params

        const capacity = await CapacityModel.findOne({ orderDate: date })

        if(!capacity){
            return res.status(400).json({message: "Invalid Date"})
        }

        res.status(201).json({ capacity: capacity.quantity })

    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports = {
    createOrderController,
    updateOrderController,
    updateOrderStatusController,
    deleteOrderController,
    getCapacityController
}