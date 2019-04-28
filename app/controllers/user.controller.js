const async = require('async');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model.js');

module.exports = {
    createUser,
    loginUser
}

function createUser(req, res) {

	if (!req.body.name || !req.body.email || !req.body.password ) {
        return res.status(400).send({
            message: "Please enter required fields"
        });
    }

    bcrypt.hash(req.body.password, 10, function(err, hash) {

        const user = new User({
            name: req.body.name, 
            email: req.body.email,
            password: hash
        });

        user.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Unable to create user"
            });
        });
    });    
};

async function loginUser(req, res) {

    if (!req.body.email || !req.body.password) {
        return res.status(400).send({
            message: "Please enter email and password"
        });
    }

    let userDetails = await User.findOne({ email: req.body.email });
    console.log('userDetails', userDetails);

    if (userDetails) {

        bcrypt.compare(req.body.password, userDetails.password, function(err, resp) {

            if (resp) {

                const token = jwt.sign({id: userDetails._id}, req.app.get('secretKey'), { expiresIn: 1800 });
                res.send({code: 200, Status:"Success", message: "Login Success!!!", data:{user: userDetails, token:token}});
            } else {
                return res.status(400).send({
                    message: "Invalid Password"
                });
            } 
        });
    } else {
        return res.status(400).send({
            message: "Invalid Email"
        });
    }
};
