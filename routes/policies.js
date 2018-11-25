var express=require("express");
var router=express.Router();
var User=require("../models/user");
var middleware = require("../middleware");

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

router.get("/new", middleware.adminPermission, function(req,res){
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

router.get("/:id/register", middleware.isLoggedIn, function(req,res){
    Policy.findById(req.params.id, function(err, foundEntry){
        if(err){
            res.redirect("vehicles");
        } else {
            console.log(req.user);
            res.render("registerPolicy", {foundEntry: foundEntry});
        }
    })
});

router.post("/:id",middleware.isLoggedIn, function(req,res){
    Policy.findById(req.params.id, function(err, foundPolicy){
        if(err){
            console.log(err);
            res.redirect("/login");
        } else {
            // var flag=flase;
            //     for(var i=0;i<foundPolicy.customers.length;i++){
            //         if(foundPolicy.customers[i]._id===req.user._id){
            //             console.log("same");
            //             flag=true;
            //             req.flash("error", "You have already registered to this Policy");
            //             res.redirect('/policy');
            //         }
            //     } 
            var arr=foundPolicy.customers;
            var id=req.user._id;            
            var flag=arr.indexOf(id);
            //eval(require('locus'));
            //console.log(foundPolicy);
            if(flag===-1){
                console.log("execute");
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
            req.flash("success", "Thank You for opting a policy for a better future of your family!! Have a nice day.");
            res.redirect("/policy/"+foundPolicy._id);
            } else {
                req.flash("error", "Sorry!! You already have subscribed this policy");
                res.redirect("/policy/"+foundPolicy._id);
            }
        }
    })
});

router.get("/:id/edit", middleware.adminPermission, function(req, res){
    Policy.findById(req.params.id, function(err, foundPolicy){
        if(err){
            console.log(err);
        } else {
            res.render("editPolicy", {foundPolicy: foundPolicy});
        }
    })
});

router.put("/:id", middleware.adminPermission, function(req, res){
    Policy.findByIdAndUpdate(req.params.id, req.body.policy, function(err, updatedPolicy){
        if(err){
            res.redirect("policy");
        } else {
            res.redirect("/policy/"+ req.params.id);
        }
    });

});

router.delete("/:id", middleware.adminPermission, function(req,res){
    Policy.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/policy");
        } else{
            res.redirect("/policy");
        }
    })
});

module.exports=router;