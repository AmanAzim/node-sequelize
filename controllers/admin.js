const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const userId = req.user.id;

  // Product.create({
  //   title,
  //   price,
  //   imageUrl,
  //   description,
  //   userId
  // })
  req.user.createProduct({
    title,
    price,
    imageUrl,
    description,
    //userId will be added automatically
  }).then(() => res.redirect('/admin/products')).catch((e) => console.log(e));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }

  const prodId = req.params.productId;
  //Product.findByPk(prodId)
  req.user.getProducts({ where: { id: prodId } })
  .then(products => {
    const product = products[0];
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    });
  }).catch((e) => console.log(e));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  Product.findByPk(prodId).then((product) => {
    product.title = updatedTitle;
    product.price = updatedPrice;
    product.description = updatedDesc;
    product.imageUrl = updatedImageUrl;
    return product.save();
  }).then((result) => {
    console.log('updated product ', result);
    res.redirect('/admin/products');
  }).catch((e) => console.log(e));
};

exports.getProducts = (req, res, next) => {
  //Product.findAll()
  req.user.getProducts()
  .then(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  }).catch(e => console.log(e));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.destroy({ where: { id: prodId } }).then(() => {
    res.redirect('/admin/products');
  }).catch(e => console.log(e));

  // Product.findByPk(prodId).then((product) => {
  //   return product.destroy();
  // }).then(() => {
  //   res.redirect('/admin/products');
  // }).catch(e => console.log(e));
};
