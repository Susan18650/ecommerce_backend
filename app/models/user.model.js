const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment-timezone");

const userModel = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    firstName: {
        type: String,
        require: false
    },
    lastName: {
        type: String,
        require: false
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resetPassword: {
        count: {
            type: Number,
            default: 0
        },
        lastTime: {
            type: Date,
            default: moment.tz(Date.now(), "Asia/Ho_Chi_Minh")
        }
    },
    // isEmailVerified: {
    //     type: Boolean,
    //     default: false
    // },
    roles: [{
        type: mongoose.Types.ObjectId,
        ref: "Role",
        default: "Guest"
    }],
    customers: [{
        type: mongoose.Types.ObjectId,
        ref: "Customer"
    }],
    avatarUrl: [{
        type: String,
        required: false,
    }],
    phoneNumber: {
        type: String,
        require: true
    },
    address: {
        type: String,
        require: false
    },
    city: {
        type: String,
        require: false
    },
    district: {
        type: String,
        require: false
    },
    ward: {
        type: String,
        require: false
    },
    zipCode: {
        type: String,
        require: false
    },
    works: [{
        type: Schema.Types.ObjectId,
        ref: 'Column'
    }],
    isDeleted: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});

module.exports = mongoose.model("User", userModel);