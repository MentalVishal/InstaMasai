const express = require("express");
const { userModel } = require("../Models/userModels");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  try {
    const { name, email, gender, password, age, city, is_married } = req.body;
    const user = await userModel.findOne({ email });
    if (user) {
      res.status(400).send({ msg: "User Already Present with this Email" });
    } else {
      bcrypt.hash(password, 5, async (err, hash) => {
        if (hash) {
          const data = new userModel({
            name,
            email,
            gender,
            password: hash,
            age,
            city,
            is_married,
          });
          await data.save();
          res.status(200).send({ msg: "user successfully registered" });
        } else {
          res.status(400).send({ error: err });
        }
      });
    }
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (user) {
      bcrypt.compare(password, user.password, async (err, decoded) => {
        if (decoded) {
          const token = jwt.sign({ id: user._id, name: user.name }, "masai", {
            expiresIn: "420s",
          });
          res.status(200).send({ msg: "Login Sucessful", token: token });
        } else {
          res.status(400).send({ error: "Check Your Password" });
        }
      });
    } else {
      res.status(400).send({ error: "Check Your Credentials" });
    }
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

module.exports = {
  userRouter,
};
