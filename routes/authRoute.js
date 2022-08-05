const express = require("express");

const {
    registerController,
    loginController,
} = require('../controllers/authController')

const router = express.Router();

router.post("/auth/signup", registerController);

router.post("/auth/login", loginController);

module.exports = router;
