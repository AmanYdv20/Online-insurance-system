var express=require("express");
var router=express.Router();
var passport=require("passport");
var middleware=require("../middleware")
var User=require("../models/user");
var Policy=require("../models/policy");
//index routes
router.get('/', function(req,res){
    res.render("index");
});

//Authentication Routes will go here
// ***********************************
router.get("/register", function(req,res){
    res.render("register");
});

// //yaha pe kuch galti thi register and authentication k time pe
router.post("/register", function(req,res){
    const user = User.findOne({'email': req.body.emailAddress});
    //eval(require('locus'));
    if(user){
        req.flash("error", "Email Address is already in use. Please provide another Email address");
        res.redirect("/register");
        return;
    }
        var newUser=new User({firstname: req.body.firstname,
             lastname: req.body.lastname,
             username: req.body.username,
             emailAddress: req.body.emailAddress,
             gender: req.body.gender,
             address: req.body.address,
             city: req.body.city,
             district: req.body.district,
             pinCode: req.body.pinCode,
             mobileNo: req.body.mobileNo,
             alternateMobileNo: req.body.alternateMobileNo
            });

            if(req.body.adminCode==='123secretCode'){
                newUser.isAdmin=true;
            }
        //eval(require("locus"));
        User.register(newUser, req.body.password, (err,user) => {
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate('local')(req,res,() => {
            req.flash("success", "Welcome "+req.body.username+" to Insurance Management System");
            res.redirect('/policy');
        });
    });
    
 });

//login form
router.get('/login', (req, res)=> {
    res.render('login');
  });
  
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
  }), function(req, res){
  
});

router.get('/logout', (req, res)=> {
    req.logout();
    req.flash("success", "Logged You out!!");
    res.redirect('/');
});

//profile routes
router.get('/users/:id', function(req,res){
    User.findById(req.params.id, function(err, foundUser){
        //console.log(foundUser.policies[0].name);
        res.render("users/profile", {foundUser: foundUser});
    });
    
});

router.get('/users/:id/policies', function(req, res){
    if(req.user.isAdmin){
        Policy.find({}, function(err, policies){
            if(err){
                console.log(err);
                res.redirect("/");
                //return;
            }

            User.find({}, function(err, totalUsers){
                if(err){
                    console.log(err);
                    res.redirect("/");
                    //return;
                }
                res.render("admin/home", {foundPolicies: policies, totalUsers: totalUsers});
            });

        });
    } else{
        User.findById(req.params.id).populate('policies').exec(function(err, foundUser){
            if(req.user.isAdmin){
                
            }
            //console.log(foundUser.policies[0].name);
            if(err){
                req.flash("error", "Something went wrong");
                res.redirect("/users/"+req.params.id);
            }
    
            //eval(require('locus'));
            if(!req.user.isAdmin){
                res.render("users/userPolicy", {userPolicy: foundUser.policies});
            } else {
                
            }
            
    
        });
    }
    
});

router.get('/users/:id/delete', middleware.isLoggedIn, function(req, res){
   Policy.findById(req.params.id, function(err, foundPolicy){
       if(err){
           console.log(err);
           res.redirect("/users"+foundPolicy._id);
       }
       res.render("users/deletePolicy", {foundPolicy: foundPolicy});
   });
});

router.get("/users/delete/:id", function(req,res){
    // User.update(req.user._id, {$pullAll: {policies: req.params.id}});
    // res.redirect("/users/"+req.user._id);
    User.findById(req.user._id, function(err, foundUser){
        if(err){
            res.redirect("/");
        }
        var arr=foundUser.policies;
        var id=req.params.id;
        var flag=arr.indexOf(id);
        foundUser.policies.splice(flag,1);
        foundUser.save();
        Policy.findById(req.params.id, function(err, foundPolicy){
            var customer=foundPolicy.customers;
            var id2=req.user._id;
            var idx=customer.indexOf(id2);
            foundPolicy.customers.splice(idx,1);
            foundPolicy.save();
        });
        //eval(require('locus'));
        res.redirect("/users/"+req.user._id);
    });
});

module.exports=router;

