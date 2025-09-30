
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { User } = require('../models');

// Basic JSON REST API for users (no auth here for simplicity - in prod protect it)
router.get('/users', async (req, res) => {
  const users = await User.findAll({ include: ['addresses'] });
  res.json(users);
});

router.get('/users/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id, { include: ['addresses'] });
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(user);
});

router.post('/users', [
  body('name').isLength({ min:2 }),
  body('email').isEmail(),
  body('password').isLength({ min:6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
