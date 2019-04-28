const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    name: { type: String, default: 'Untitled Product' },
    description: String,
    price: String,
    stock: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', ProductSchema);
