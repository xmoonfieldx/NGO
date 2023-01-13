const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

//import routes
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server running on port ${port}...`);
});

app.get("/api", (req, res) => {
    res.send("Welcome to the server!");
});

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URI, (err, client) => {
    if (err) {
        return console.error(err);
    }
    console.log("DB connected");
});

//random secret generator: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
