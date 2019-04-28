const Product = require('../models/product.model.js');

module.exports = {
    addProduct,
    getAllProducts,
    getProductDetail,
    editProduct,
    deleteProduct
}
function addProduct(req, res) {

	if(!req.body.name) {
        return res.status(400).send({
            message: "Invalid product name"
        });
    }

    const product = new Product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        stock: req.body.stock
    });

    product.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Unable to add product"
        });
    });
    
};

function getAllProducts(req, res) {

    Product.find()
    .then(productData => {
        res.send(productData);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Unable to get Product datas"
        });
    });
    
};

function getProductDetail(req, res) {

    if(!req.params.productId) {
        return res.status(400).send({
            message: "Invalid product Id"
        });
    }

    Product.findById(req.params.productId)
    .then(productDetail => {
        res.send(productDetail);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while fetching product data."
        });
    });
    
};

async function editProduct(req, res) {

    if(!req.params.productId) {
        return res.status(400).send({
            message: "Invalid productId"
        });
    }

    let productDetails = await Product.findById(req.params.productId);

    if (productDetails) {
        Product.findByIdAndUpdate(req.params.productId, {
            name: req.body.name || productDetails.name,
            description: req.body.description || productDetails.description,
            price: req.body.price || productDetails.price,
            stock: req.body.stock || productDetails.stock,
        })
        .then(productData => {
            res.send(productData);
        }).catch(err => {
            return res.status(500).send({
                message: 'Unable to update prouct details'
            });
        });
    } else {
        return res.status(404).send({
            message: 'No Product found for the given Id'
        });
    }
    
};

function deleteProduct(req, res) {

    if(!req.params.productId) {
        return res.status(400).send({
            message: "Invalid productId"
        });
    }

    Product.findByIdAndRemove(req.params.productId)
    .then(productData => {
        if(!productData) {
            return res.status(404).send({
                message: 'No Product found for the given Id'
            });
        }
        res.send({message: 'Product removed successfully!'});
    }).catch(err => {
        return res.status(500).send({
            message: 'Unable to remove product'
        });
    });
    
};

