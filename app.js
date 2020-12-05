const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');

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

sequelize.sync().then((db) => { // sync({ force: true }) to over write the manual database table we created with development db
  return User.findByPk(1);
}).then(user => {
  if (!user) {
    return User.create({ name: 'Aman', email: 't@t.com' });
  }
  return user; // Promise.resolve(user);
}).then((user) => {
  console.log('user = ', user)
  app.listen(3000);
}).catch(e => console.log(e));

