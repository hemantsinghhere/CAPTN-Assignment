const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    token: { type: String, required: true },
    invalidated: { type: Boolean, default: false },
});

const Token = mongoose.model("Token", tokenSchema);

module.exports = Token;