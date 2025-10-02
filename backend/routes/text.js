const express = require('express');
const router = express.Router();
const TextContent = require('../models/TextContent');
const authMiddleware = require('../middleware/auth'); // ensures user is logged in

// routes/text.js - Save text
router.post('/save', authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.user.id;
    const newText = new TextContent({ userId: req.user._id, title, content }); // <== use _id if JWT has _id
    await newText.save();
    res.status(201).json({ message: 'Text saved!' });
  } catch (err) {
    console.error('Error saving text:', err); // log the actual error
    res.status(500).json({ error: err.message });
  }
});

// Get all texts for logged in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const texts = await TextContent.find({ userId: req.user.user.id }).sort({ createdAt: -1 });
    res.json(texts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
