const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");

dotenv.config({ path: "./.env" });

app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("Database Connected");
});
mongoose.connection.on("error", (err) => {
  console.log("Error in database connection", err);
});

require("./models/AdminModel")
require("./models/OrdersModel");
require("./models/CapacityModel");

app.use("/", require("./routes/authRoute"))
app.use("/", require("./routes/ordersRoute"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("server is running on", PORT);
});
