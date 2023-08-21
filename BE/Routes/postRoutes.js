const express = require("express");
const { authMiddleware } = require("../Middleware/AuthMiddleware");
const { postModel } = require("../Models/postModel");

const postRouter = express.Router();

postRouter.use(authMiddleware);

postRouter.post("/add", async (req, res) => {
  try {
    const { user_id } = req.body;
    if (user_id) {
      const post = new postModel(req.body);
      await post.save();
      res.status(200).send({ msg: "Post Sucessfully Added" });
    } else {
      res.status(400).send({ error: "Please Login......!" });
    }
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

postRouter.get("/", async (req, res) => {
  const { pageNo, limit, minComments, maxComments, device1, device2 } =
    req.query;
  const skip = (pageNo - 1) * limit;
  const { user_id } = req.body;
  const query = {};
  if (user_id) {
    query.user_id = user_id;
  }
  if (minComments && maxComments) {
    query.no_of_comments = {
      $and: [
        { no_of_comments: { $gt: minComments } },
        { no_of_comments: { $lt: maxComments } },
      ],
    };
  }
  if (device1 && device2) {
    query.device = { $and: [{ device: device1 }, { device: device2 }] };
  } else if (device1) {
    query.device = device1;
  } else if (device2) {
    query.device = device2;
  }

  try {
    const post = await postModel
      .find(query)
      .sort({ no_of_comments: 1 })
      .skip(skip)
      .limit(limit);
    res.status(200).send({ msg: "All Post of Users", Post: post });
  } catch (err) {
    res.status(400).send(err);
  }
});

postRouter.get("/top", async (req, res) => {
  const { pageNo } = req.query;
  const limit = 3;
  const skip = (pageNo - 1) * limit;
  try {
    const top = await postModel
      .find()
      .sort({ no_of_comments: -1 })
      .skip(skip)
      .limit(limit);
    res.status(200).send({ msg: "User Top Post", Post: top });
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

postRouter.patch("/update/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const { user_id } = req.body;
    const post = await postModel.findByIdAndUpdate(
      { user_id, _id: postId },
      req.body
    );
    if (!post) {
      res.status(400).send({ error: "Post Not Found" });
    } else {
      res.status(200).send({ msg: "Post updated Successfull" });
    }
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

postRouter.delete("/delete/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const { user_id } = req.body;
    const post = await postModel.findByIdAndDelete({ user_id, _id: postId });
    if (!post) {
      res.status(400).send({ error: "Post Not Found" });
    } else {
      res.status(200).send({ msg: "Post Deleted Successfull" });
    }
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

module.exports = {
  postRouter,
};
