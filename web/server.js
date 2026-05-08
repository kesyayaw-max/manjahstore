const express = require('express');
const path = require('path');
const session = require('express-session');

const Product = require('../database/models/Product');
const Stock = require('../database/models/Stock');
const Invoice = require('../database/models/Invoice');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'manjah-secret',
  resave: false,
  saveUninitialized: false
}));

function requireAdmin(req, res, next) {
  if (req.session && req.session.admin) return next();
  return res.redirect('/admin/login');
}

app.get('/', async (req, res) => {
  try {
    const products = await Product.find({ active: true }).sort({ createdAt: -1 });

    const data = [];

    for (const product of products) {
      const stock = await Stock.countDocuments({
        productCode: product.code,
        sold: false
      });

      const sold = await Stock.countDocuments({
        productCode: product.code,
        sold: true
      });

      data.push({
        code: product.code,
        name: product.name || 'Unknown Product',
        price: Number(product.price || 0),
        category: product.category || 'General',
        description: product.description || 'Premium digital product.',
        stock,
        sold
      });
    }

    const success = await Invoice.countDocuments({ status: 'paid' });
    const revenueData = await Invoice.find({ status: 'paid' });

    const revenue = revenueData.reduce((total, item) => {
      return total + Number(item.totalPrice || 0);
    }, 0);

    const topProducts = [...data].sort((a, b) => b.sold - a.sold).slice(0, 5);

    res.render('index', {
      products: data,
      topProducts,
      stats: {
        totalProducts: data.length,
        totalStock: data.reduce((a, b) => a + b.stock, 0),
        success,
        revenue
      }
    });

  } catch (error) {
    console.error('[WEB ERROR]', error);
    res.status(500).send(`<pre>${error.stack}</pre>`);
  }
});

app.get('/admin/login', (req, res) => {
  res.render('admin-login', { error: null });
});

app.post('/admin/login', (req, res) => {
  const { password } = req.body;

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.render('admin-login', { error: 'Password salah.' });
  }

  req.session.admin = true;
  return res.redirect('/admin');
});

app.get('/admin/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/admin/login');
  });
});

app.get('/admin', requireAdmin, async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });

  const data = [];

  for (const product of products) {
    const stock = await Stock.countDocuments({
      productCode: product.code,
      sold: false
    });

    data.push({
      ...product.toObject(),
      stock
    });
  }

  res.render('admin', { products: data });
});

app.post('/admin/product/add', requireAdmin, async (req, res) => {
  const { name, code, category, price, description } = req.body;

  await Product.create({
    guildId: process.env.GUILD_ID || 'web',
    name,
    code,
    category,
    price: Number(price || 0),
    description,
    active: true
  });

  res.redirect('/admin');
});

app.post('/admin/stock/add', requireAdmin, async (req, res) => {
  const { productCode, content } = req.body;

  await Stock.create({
    guildId: process.env.GUILD_ID || 'web',
    productCode,
    content,
    sold: false
  });

  res.redirect('/admin');
});

function startWeb() {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`[WEB] Store running on port ${PORT}`);
  });
}

module.exports = startWeb;