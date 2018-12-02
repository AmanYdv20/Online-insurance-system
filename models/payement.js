var mongoose = require("mongoose");

var payementSchema=new mongoose.Schema({
    cardNo: String,
    amount: Number,
    holderName: String,
    customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
    },
    policyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Policy"
    },
    created: {type: Date, default: Date.now}
});

module.exports=mongoose.model("Payement", payementSchema);