const express = require("express");
const { Connection } = require("./db");
const { userRouter } = require("./Routes/userRoutes");
const jwt = require("jsonwebtoken");
const { blacklistModel } = require("./Models/blacklistModel");
const { postRouter } = require("./Routes/postRoutes");

const app = express();

app.use(express.json());
app.use("/users", userRouter);
app.use("/posts", postRouter);

app.get("/logout", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      jwt.verify(token, "masai", async (err, decoded) => {
        if (decoded) {
          const data = new blacklistModel({ token: token });
          await data.save();
          res.status(200).send({ msg: "You are sucessfully Logout" });
        } else {
          res.status(400).send({ error: err });
        }
      });
    } else {
      res.status(400).send({ error: "token is not provided" });
    }
  } catch (error) {
    res.status(400).send({ error: "error" });
  }
});

app.listen(8080, async () => {
  try {
    await Connection;
    console.log("Connected to Database");
    console.log("Running at port 8080");
  } catch (err) {
    console.log(err);
  }
});
