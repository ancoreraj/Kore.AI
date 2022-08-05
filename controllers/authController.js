const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const AdminModel = require("../models/AdminModel");

const JWT_SECRET = process.env.JWT_SECRET;

const registerController = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password) {
            return res.status(422).json({ error: "Please add all the fields" });
        }
        const savedAdmin = await AdminModel.findOne({ email });

        if (savedAdmin) {
            return res.status(422).json({ error: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(12);
        const hashedpassword = await bcrypt.hash(password, salt);

        const newAdmin = new AdminModel({
            email,
            password: hashedpassword,
            name
        });

        newAdmin.save((err) => {
            if (err) {
                return res.status(500).json({ error: "Mongo Error" })
            }
        });
        res.status(201).json({ message: "Registered!" });

    } catch (err) {
        res.status(500).json(err);
    }
}

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(422).json({ error: "Please add email or password" });
        }

        const savedAdmin = await AdminModel.findOne({ email })
        if (!savedAdmin) {
            return res.status(422).json({ error: "Invalid Email or password" });
        }

        const passwordDoMatch = await bcrypt.compare(password, savedAdmin.password)

        if (passwordDoMatch) {
            const token = jwt.sign({ _id: savedAdmin._id }, JWT_SECRET);
            return res.json({
                message: "Admin successfully signin",
                token,
            });
        } else {
            return res.status(422).json({ error: "Invalid Email or password" });
        }

    } catch (err) {
        res.status(500).json(err);
    }
}


module.exports = {
    registerController,
    loginController
}