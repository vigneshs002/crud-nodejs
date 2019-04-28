const router = require('express').Router();
const jwt = require('jsonwebtoken');

const UserController = require('../app/controllers/user.controller.js');
const ProductController = require('../app/controllers/product.controller.js');

// Front End
router.get('/', (req, res) => {
    res.render('index');
});

// API
router.post('/api/v1/createUser', UserController.createUser);
router.post('/api/v1/loginUser', UserController.loginUser);

router.post('/api/v1/addProduct', verifyAuthToken, ProductController.addProduct);
router.get('/api/v1/getAllProducts', verifyAuthToken, ProductController.getAllProducts);
router.get('/api/v1/getProductDetail/:productId', verifyAuthToken, ProductController.getProductDetail);
router.post('/api/v1/editProduct/:productId', verifyAuthToken, ProductController.editProduct);
router.post('/api/v1/deleteProduct/:productId', verifyAuthToken, ProductController.deleteProduct);

// Invalid routes
router.use('*', (req, res) => {
    res.send({message: 'Invalid route!'});
});

function verifyAuthToken(req, res, next) {

	jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function(err, decoded) {
		if (err) {
		 	res.json({status:"error", message: err.message, data:null});
		}else{
			req.body.userId = decoded.id;
			next();
		}
	});
}

module.exports = router;