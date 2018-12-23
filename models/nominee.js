var mongoose = require("mongoose");

var NomineeSchema=new mongoose.Schema({
    firstname: String,
    lastname: String,
    gender: String,
    address: String,
    city: String,
    district: String,
    relation: String,
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        unique: true
    },
    pinCode: Number,
    mobileNo: Number,

});

module.exports=mongoose.model("Nominee", NomineeSchema);