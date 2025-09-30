
require('dotenv').config();
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const passport = require('./auth/passport');
const sequelize = require('./db/conn');
const { sequelize: seqModels } = require('./models'); // ensure models loaded

const webRoutes = require('./routes/web');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Sessions
const store = new SequelizeStore({ db: sequelize });
app.use(session({
  secret: process.env.SESSION_SECRET || 'troque_este_valor',
  store,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 dia
}));
store.sync();

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Helpers para views
const hbs = require('express-handlebars');
app.engine('handlebars', exphbs.engine({
  defaultLayout: 'main',
  runtimeOptions: { allowProtoPropertiesByDefault: true, allowProtoMethodsByDefault: true },
  helpers: {
    formatDate: (d) => d ? new Date(d).toLocaleString('pt-BR') : ''
  }
}));

// Rotas
app.use('/', webRoutes);
app.use('/api', apiRoutes);

// Auth routes quick (register/login/logout)
const { User } = require('./models');
app.get('/auth/register', (req, res) => res.render('register'));
app.post('/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    await User.create({ name, email, password });
    res.redirect('/auth/login');
  } catch (err) {
    res.render('register', { error: err.message, formData: req.body });
  }
});
app.get('/auth/login', (req, res) => res.render('login'));
app.post('/auth/login', require('passport').authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login'
}));
app.get('/auth/logout', (req, res) => { req.logout(()=>{}); res.redirect('/auth/login'); });

// 404
app.use((req,res)=> res.status(404).render('home', { users: [], error: 'Página não encontrada' }));

// Start server and sync db
(async ()=>{
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('DB ok - modelos sincronizados');
    app.listen(PORT, ()=> console.log('Servidor em http://localhost:' + PORT));
  } catch (err) {
    console.error('Erro ao iniciar:', err);
    process.exit(1);
  }
})();
