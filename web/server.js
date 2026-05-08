const express = require('express');
const path = require('path');

const Product = require('../database/models/Product');
const Stock = require('../database/models/Stock');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', async (req, res) => {
  const products = await Product.find({ active: true });

  const data = [];

  for (const product of products) {
    const stock = await Stock.countDocuments({
      productCode: product.code,
      sold: false
    });

    data.push({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
      stock
    });
  }

  res.render('index', { products: data });
});

function startWeb() {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`[WEB] Store running on port ${PORT}`);
  });
}

module.exports = startWeb;