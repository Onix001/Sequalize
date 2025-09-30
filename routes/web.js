
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const { User, Address } = require('../models');

// Middleware para proteger rotas
function ensureAuth(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  res.redirect('/auth/login');
}

// Home - list com paginação, busca e filtro
router.get('/', async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = 6;
  const q = req.query.q || '';
  const offset = (page - 1) * limit;
  const where = q ? { name: { [require('sequelize').Op.like]: `%${q}%` } } : undefined;

  const { count, rows } = await User.findAndCountAll({
    where,
    order: [['createdAt', 'DESC']],
    limit, offset,
    include: [{ model: Address, as: 'addresses' }],
    distinct: true
  });

  res.render('home', { users: rows.map(u => u.get({ plain: true })), currentPage: page, totalPages: Math.ceil(count/limit), q });
});

// Create form
router.get('/users/create', ensureAuth, (req, res) => res.render('adduser'));

// Create
router.post('/users/create', ensureAuth, [
  body('name').isLength({ min:2 }).withMessage('Nome precisa ter pelo menos 2 caracteres'),
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min:6 }).withMessage('Senha precisa ter ao menos 6 caracteres')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.render('adduser', { error: errors.array()[0].msg, formData: req.body });

  try {
    const { name, email, password, occupation, newsletter } = req.body;
    await User.create({ name, email, password, occupation, newsletter: newsletter === 'on' });
    res.redirect('/');
  } catch (err) {
    res.render('adduser', { error: err.message, formData: req.body });
  }
});

// View user
router.get('/users/:id', ensureAuth, async (req, res) => {
  const user = await User.findByPk(req.params.id, { include: [{ model: Address, as: 'addresses' }] });
  if (!user) return res.redirect('/');
  res.render('userview', { user: user.get({ plain: true }) });
});

// Edit form
router.get('/users/edit/:id', ensureAuth, async (req, res) => {
  const user = await User.findByPk(req.params.id, { include: [{ model: Address, as: 'addresses' }] });
  if (!user) return res.redirect('/');
  res.render('useredit', { user: user.get({ plain: true }) });
});

// Update
router.post('/users/update', ensureAuth, [
  body('name').isLength({ min:2 }).withMessage('Nome precisa ter pelo menos 2 caracteres'),
  body('email').isEmail().withMessage('Email inválido')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.redirect('/users/edit/' + req.body.id);

  const { id, name, email, occupation, newsletter } = req.body;
  await User.update({ name, email, occupation, newsletter: newsletter === 'on' }, { where: { id } });
  res.redirect('/users/' + id);
});

// Delete user (and cascade addresses via association)
router.post('/users/delete/:id', ensureAuth, async (req, res) => {
  await User.destroy({ where: { id: req.params.id } });
  res.redirect('/');
});

// Addresses
router.post('/address/create', ensureAuth, [
  body('street').isLength({ min:5 }).withMessage('Rua precisa ter ao menos 5 caracteres'),
  body('city').isLength({ min:2 }).withMessage('Cidade inválida')
], async (req, res) => {
  const { userId, street, number, city } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.redirect('/users/edit/' + userId);
  await Address.create({ userId, street, number, city });
  res.redirect('/users/edit/' + userId);
});

router.post('/address/delete', ensureAuth, async (req, res) => {
  const { id, userId } = req.body;
  await Address.destroy({ where: { id } });
  res.redirect(userId ? '/users/edit/' + userId : '/');
});

module.exports = router;
