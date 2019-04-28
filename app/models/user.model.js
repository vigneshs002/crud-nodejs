const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: 'user' }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
