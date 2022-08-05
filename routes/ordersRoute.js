const express = require('express')
const router = express.Router()
const requireAuth = require('./../middleware/requireAuth')

const {
    createOrderController,
    updateOrderController,
    updateOrderStatusController,
    deleteOrderController,
    getCapacityController
} = require('../controllers/ordersControllers')

router.get("/test", async (req, res) => {
    res.send('Test')
})

router.post("/order/add", requireAuth, createOrderController)

router.post("/order/update/:id", requireAuth, updateOrderController)

router.post("/order/updateStatus/:id", requireAuth, updateOrderStatusController)

router.post("/order/delete/:id", requireAuth, deleteOrderController)

router.get("/checkCapacity/:date", getCapacityController)

module.exports = router