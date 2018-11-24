var express=require("express");
var router=express.Router();
var User=require("../models/user");

var Policy=require("../models/policy");

//policy route
router.get("/", function(req,res){
    Policy.find({},function(err, policies){
        if(err){
            console.log("ERROR");
        } else {
            res.render("policies", {policies: policies});
        }
    })
});

router.get("/new", function(req,res){
    console.log(req.user);
    res.render("new");
});

router.post("/", function(req, res){
    Policy.create(req.body.policy, function(err,newEntry){
        if(err){
            res.render("/policy/new");
        } else {
            res.redirect("/policy");
        }
    })
});

router.get("/:id", function(req, res){
    Policy.findById(req.params.id, function(err, foundPolicy){
        if(err){
            res.redirect("/policies");
        } else {
            res.render("showpolicy", {foundPolicy: foundPolicy});
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

router.post("/:id", function(req,res){
    Policy.findById(req.params.id, function(err, foundPolicy){
        if(err){
            console.log(err);
            res.redirect("/login");
        } else {
            console.log(foundPolicy);
            foundPolicy.customers.push(req.user._id);
            foundPolicy.save();
            User.findById(req.user._id, function(err, foundUser){
                if(err){
                    console.log(err);
                } else{
                    foundUser.policies.push(foundPolicy._id);
                    foundUser.save();
                }
            });
            res.redirect("/policy/"+foundPolicy._id);
        }
    })
});

router.get("/:id/edit", function(req, res){
    Policy.findById(req.params.id, function(err, foundPolicy){
        if(err){
            console.log(err);
        } else {
            res.render("editPolicy", {foundPolicy: foundPolicy});
        }
    })
});

router.put("/:id", function(req, res){
    Policy.findByIdAndUpdate(req.params.id, req.body.policy, function(err, updatedPolicy){
        if(err){
            res.redirect("policy");
        } else {
            res.redirect("/policy/"+ req.params.id);
        }
    });

});

router.delete("/:id", function(req,res){
    Policy.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/policy");
        } else{
            res.redirect("/policy");
        }
    })
});

module.exports=router;