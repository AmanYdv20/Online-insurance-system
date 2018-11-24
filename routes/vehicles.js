var express=require("express");
var router=express.Router();

var Policy=require("../models/policy");

//vehicle route
router.get("/", function(req,res){
    Policy.find({type: "vehicle"},function(err, vehicles){
        if(err){
            console.log("ERROR");
        } else {
            res.render("vehilces", {vehicles: vehicles});
        }
    })
});

router.get("/:id", function(req, res){
    Policy.findById(req.params.id, function(err,foundVehicle){
        if(err){
            res.redirect("/vehicles");
        } else {
            res.render("showvehicle", {foundVehicle: foundVehicle});
        }
    })
});

router.get("/:id/register", function(req,res){
    Policy.findById(req.params.id, function(err, foundEntry){
        if(err){
            res.redirect("vehicles");
        } else {
            res.render("registerPolicy", {foundEntry: foundEntry});
        }
    })
});

module.exports=router;