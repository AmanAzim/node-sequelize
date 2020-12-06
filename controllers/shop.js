const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.findAll().then((products) => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  }).catch((e) => console.log(e));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  // Product.findAll({ where: { id: prodId } }).then((products) => {

  // });
  Product.findByPk(prodId).then((product) => {
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products'
    });
  }).catch(e => console.log(e));
};

exports.getIndex = (req, res, next) => {
  Product.findAll().then((products) => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  }).catch((e) => console.log(e));
};

exports.getCart = (req, res, next) => {
  req.user.getCart().then(cart => {
    return cart.getProducts().then(products => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      });
    })
  }).catch(e => console.log(e))
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  req.user.getCart().then(cart => {
    fetchedCart = cart;
    return cart.getProducts({ where: { id: prodId } }).then(products => {
      if (products.length > 0) {
        const product = products[0];
        const newQuantity = product.cartItem.quantity + 1;
        return fetchedCart.addProduct(product, { through: { quantity: newQuantity } });
      }
      
      const newQuantity = products.length + 1;
      return Product.findByPk(prodId).then(product => {
        return fetchedCart.addProduct(product, { through: { quantity: newQuantity } });
      })
    });
  }).then(() => res.redirect('/cart')).catch(e => console.log(e))
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  req.user.getCart().then(cart => {
    return cart.getProducts({ where: { id: prodId } }).then(products => {
      const product = products[0];
      return product.cartItem.destroy();
    });
  })
  .then(() => res.redirect('/cart')).catch(e => console.log(e))
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
