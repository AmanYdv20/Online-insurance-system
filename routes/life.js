var express=require("express");
var router=express.Router();

var Policy=require("../models/policy");

//vehicle route
router.get("/", function(req,res){
    Policy.find({type: "life"},function(err, lifes){
        if(err){
            console.log("ERROR");
        } else {
            res.render("life", {lifes: lifes});
        }
    })
});

router.get("/:id", function(req, res){
    Policy.findById(req.params.id, function(err,foundlife){
        if(err){
            res.redirect("/life");
        } else {
            res.render("showlife", {foundlife: foundlife});
        }
    })
});

router.get("/:id/register", function(req,res){
    Policy.findById(req.params.id, function(err, foundEntry){
        if(err){
            res.redirect("vehicles");
        } else {
            console.log(req.user);
            res.render("registerPolicy", {foundEntry: foundEntry});
        }
    })
});

module.exports=router;