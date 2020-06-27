const router = require('express').Router();
const jwt = require('jsonwebtoken');

const UserController = require('../app/controllers/user.controller.js');
const ProductController = require('../app/controllers/product.controller.js');
var plivo = require('plivo');
var client = new plivo.Client('MAMTI1NZZMMTFJMDEXMD', 'M2FjYmY0OGRhZThkYjM5NDIwMWYzODk2ODgzZTk1');
const stripe = require('stripe')('sk_test_9FGahSMfnOHMOJW6g6QfpXKw');

//
var multer = require('multer');
var storage = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, './uploads');
	},
	filename: function (req, file, callback) {
		callback(null, file.fieldname + '-' + Date.now());
	}
});
var upload = multer({ storage: storage }).array('userPhoto', 2);
router.post('/api/photo', function (req, res) {
	upload(req, res, function (err) {
		// debugger;
		//console.log(req.body);
		console.log('eeee', req.files);
		if (err) {
			return res.end("Error uploading file.");
		}
		// res.end("File is uploaded");
	});
});


// Front End
router.get('/', (req, res) => {
	res.render('index');
});

router.get('/test', (req, res) => {

	console.log('test fn');


	client.messages.create(
		'919710811801',
		'919940289215',
		'hi'
	).then(function (response) {
		console.log(response);
	}, function (err) {
		console.error(err);
	});
});

router.get('/testStripe', (req, res) => {
	// console.log(res);

	// const paymentIntent = await stripe.paymentIntents.create({
	// 	amount: 100,
	// 	currency: 'usd',
	//   });
	res.render('stripe', {});
});

router.post("/create-payment-intent", async (req, res) => {
	// Create a PaymentIntent with the order amount and currency
	const paymentIntent = await stripe.paymentIntents.create({
		amount: 100,
		currency: 'usd'
	});

	// Send publishable key and PaymentIntent details to client
	res.send({
		publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
		clientSecret: paymentIntent.client_secret
	});
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
	res.send({ message: 'Invalid route!' });
});

function verifyAuthToken(req, res, next) {

	jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function (err, decoded) {
		if (err) {
			res.json({ status: "error", message: err.message, data: null });
		} else {
			req.body.userId = decoded.id;
			next();
		}
	});
}

module.exports = router;