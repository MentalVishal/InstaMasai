const { blacklistModel } = require("../Models/blacklistModel");
const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    const blacklistToken = await blacklistModel.findOne({ token });
    if (blacklistToken) {
      res.status(200).send({ msg: "Please Login Again.......!" });
    } else {
      jwt.verify(token, "masai", async (err, decoded) => {
        if (decoded) {
          req.body.user_id = decoded.id;
          req.body.user_name = decoded.name;
          next();
        } else {
          res.status(400).send({ error: "You are not Authorized" });
        }
      });
    }
  } else {
    res.status(400).send({ error: "token not provided" });
  }
};

module.exports = {
  authMiddleware,
};
