const mongoose = require('mongoose');

const roleModel = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    }
});

module.exports = mongoose.model("Role", roleModel);