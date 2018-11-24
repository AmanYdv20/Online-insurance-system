var mongoose = require("mongoose");
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema=new mongoose.Schema({
    firstname: String,
    lastname: String,
    username: String,
    isAdmin: {type: Boolean, default: false},
    emailAddress: String,
    password: String,
    gender: String,
    address: String,
    city: String,
    district: String,
    pinCode: Number,
    mobileNo: Number,
    alternateMobileNo: Number,
    policies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Policy"
    }]
});

UserSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("User", UserSchema);