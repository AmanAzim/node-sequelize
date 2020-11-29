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

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constrains: true, onDelete: 'CASCADE' }); // As creator of the product
User.hasMany(Product);

sequelize.sync().then((db) => { // sync({ force: true }) to over write the manual database table we created with development db
  console.log(db);
  app.listen(3000);
}).catch(e => console.log(e));

