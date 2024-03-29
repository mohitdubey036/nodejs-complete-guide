const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product', 
        path: '/admin/add-product',
        editing : false
    });
}

exports.postAddProduct = (req, res, next)=> {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(null, title, imageUrl, price, description);
    product.save();
    res.redirect('/');
}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode){
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId, product => {
        if (!product){
            return res.redirect('/');
        }
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product', 
            path: '/admin/edit-product',
            editing: editMode,
            product: product
        });
    });
}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title
    const updatedImageUrl = req.body.imageUrl
    const updatedPrice = req.body.price
    const updatedDescription = req.body.description
    const updatedProduct = new Product(
        prodId,
        updatedTitle,
        updatedImageUrl, 
        updatedPrice, 
        updatedDescription
    );
    updatedProduct.save();
    res.redirect('/admin/adminProduct');
}

exports.getAdminProduct = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('admin/adminProduct', {
            prods: products,
            pageTitle : 'Admin Product',
            path : '/admin/adminProduct'
        });
    });
}

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product.deleteProduct(productId);
    res.redirect('/admin/adminProduct')
}