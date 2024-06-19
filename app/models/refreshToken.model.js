const mongoose = require("mongoose");


const refreshTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        require: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    expiredDate:{
        type: Date,
        require: true
    },
})
module.exports = mongoose.model("RefreshToken", refreshTokenSchema);
