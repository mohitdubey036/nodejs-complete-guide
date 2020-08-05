const path = require('path');
const express = require('express');
const bodyparser = require('body-parser');

const errorController = require ('./controllers/error')

const app = express();

const sequelize = require ('./util/database');

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const Product = require('./models/product')
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

Product.belongsTo(User, { constraints : true, onDelete: 'CASCADE'})
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User)
User.hasMany(Order)
Order.belongsToMany(Product, {through : OrderItem})

app.use(bodyparser.urlencoded({extended : false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findByPk(1)
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err => console.log(err));
})

app.use('/admin',adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404page);

sequelize
//.sync({ force: true })
.sync()
.then(result => {
    return User.findByPk(1);
    // console.log(result);
})
.then(user => {
    if(!user){
        return User.create({ name: 'Max', email:'test@test.com' })
    }
    else {
        return user
    }
})
.then(user => {
    // console.log(user);
    return user.createCart();
})
.then(cart => {
    app.listen(3000);
})
.catch(err => {
    console.log(err);
})


