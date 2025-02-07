const express = require("express");
const { resolve } = require("path");
const mongoose = require("mongoose");
const userModel = require("./user.model.js");
const bcrypt = require("bcrypt");

const app = express();
const port = 3010;

app.use(express.static("static"));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(resolve(__dirname, "pages/index.html"));
});

const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://tejas:ZnR8mDSYTHA2azV1@cluster0.yg0kt.mongodb.net/test2"
    )
    .then(() => {
      console.log("Database connected.");
    })
    .catch((err) => {
      console.log(err.message);
    });
};

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid username or password" });
    }
    console.log("Entered Password:", password);
    console.log("Stored Hashed Password:", userModel.password);
    return res.status(200).json({ message: "Login successfull" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "couldn't login.",
    });
  }
});

const startServer = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
};

startServer();
