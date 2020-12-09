const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart_item');
const Order = require('./models/order');
const OrderItem = require('./models/order_item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findByPk(1).then(user => {
    req.user = user;
    next();
  }).catch(e => console.log(e));
});
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// This is called adding association. Which will also allow Sequelizer to add several helper method to req.user object
Product.belongsTo(User, { constrains: true, onDelete: 'CASCADE' }); // As creator of the product
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User); // Optional it is oposite direction of "User.hasOne(Cart)" which is actually enough
Cart.belongsToMany(Product, { through: CartItem }); // To store the relation of Cart and Product id combinations in a new table "Cart item"
Product.belongsToMany(Cart, { through: CartItem });

Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });


sequelize
//.sync({ force: true }) // To over write the manual database table we created with development db
.sync()
.then((db) => { 
  return User.findByPk(1);
}).then(user => {
  if (!user) {
    return User.create({ name: 'Aman', email: 't@t.com' });
  }
  return user; // Promise.resolve(user);
}).then((user) => {
  return user.createCart();
}).then(cart => {
  app.listen(3000);
})
.catch(e => console.log(e));

