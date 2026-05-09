const express = require('express');
const path = require('path');
const session = require('express-session');

const Product = require('../database/models/Product');
const Stock = require('../database/models/Stock');
const Invoice = require('../database/models/Invoice');
const Order = require('../database/models/Order');

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

/*
========================
HOME
========================
*/
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

    const topProducts = [...data]
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5);

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

/*
========================
CHECKOUT
========================
*/
app.get('/checkout/:code', async (req, res) => {
  try {
    const product = await Product.findOne({
      code: req.params.code
    });

    if (!product) {
      return res.send('Produk tidak ditemukan');
    }

    res.render('checkout', {
      product,
      payment: process.env.PAYMENT,
      invite: process.env.DISCORD_INVITE
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Checkout error');
  }
});

app.post('/checkout', async (req, res) => {
  try {
    const {
      buyerName,
      buyerDiscord,
      productCode,
      productName,
      total
    } = req.body;

    const invoiceId =
      'INV-' +
      Math.floor(Math.random() * 999999);

    await Order.create({
      invoiceId,
      buyerName,
      buyerDiscord,
      productCode,
      productName,
      total: Number(total),
      paymentMethod: process.env.PAYMENT,
      status: 'pending'
    });

    res.send(`
      <html>
      <body style="
        background:#050510;
        color:white;
        font-family:Arial;
        text-align:center;
        padding:80px;
      ">
        <h1>Order Berhasil Dibuat</h1>
        <p>Invoice: <b>${invoiceId}</b></p>
        <p>Masuk Discord untuk proses payment.</p>
        <br>
        <a
          href="${process.env.DISCORD_INVITE}"
          style="color:#8b5cf6;font-size:20px;"
        >
          Join Discord →
        </a>
      </body>
      </html>
    `);

  } catch (err) {
    console.error(err);
    res.status(500).send('Checkout gagal');
  }
});

/*
========================
ADMIN LOGIN
========================
*/
app.get('/admin/login', (req, res) => {
  res.render('admin-login', { error: null });
});

app.post('/admin/login', (req, res) => {
  const { password } = req.body;

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.render('admin-login', {
      error: 'Password salah.'
    });
  }

  req.session.admin = true;
  return res.redirect('/admin');
});

app.get('/admin/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/admin/login');
  });
});

/*
========================
ADMIN PANEL
========================
*/
app.get('/admin', requireAdmin, async (req, res) => {
  const products = await Product.find().sort({
    createdAt: -1
  });

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

  res.render('admin', {
    products: data
  });
});

app.post('/admin/product/add', requireAdmin, async (req, res) => {
  const {
    name,
    code,
    category,
    price,
    description
  } = req.body;

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
  const {
    productCode,
    content
  } = req.body;

  await Stock.create({
    guildId: process.env.GUILD_ID || 'web',
    productCode,
    content,
    sold: false
  });

  res.redirect('/admin');
});

/*
========================
START WEB
========================
*/
function startWeb() {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`[WEB] Store running on port ${PORT}`);
  });
}

module.exports = startWeb;