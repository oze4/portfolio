const express = require('express');
const { ObjectID } = require('mongodb');
const Post = require('../models/postModel');

const router = new express.Router();

router.get('/', async (req, res) => {
  const posts = await Post.find().sort({ timestamp: -1 });
  res.status(200).json(posts);
});

router.post('/', async (req, res) => {
  const newPost = new Post({
    authorId: req.body.authorId,
    avatarColor: req.body.avatarColor || 0,
    comments: [],
    likers: [],
    likesCount: 0,
    title: req.body.title,
    body: req.body.body,
    timestamp: new Date().getTime()
  });
  try {
    const post = await newPost.save();
    return res.status(201).json(post);
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.patch('/:id', (req, res) => {
  const { id } = req.params;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  try {
    return Post.findByIdAndUpdate(
      id,
      { $set: {
        title: req.body.title,
        body: req.body.body
      }},
      { new: true },
      (err, post) => {
        if (err) return res.status(400).send(err);
        return res.send(post);
      }
    );
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    await post.remove();
    return res.json({ success: true });
  } catch (err) {
    return res.status(404).send(err);
  }
});

module.exports = router;
