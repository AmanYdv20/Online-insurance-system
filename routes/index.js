var express=require("express");
var router=express.Router();
var passport=require("passport");
var middleware=require("../middleware");
var User=require("../models/user");
var Policy=require("../models/policy");
var Payement=require("../models/payement");
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
    // const user = User.findOne({'email': req.body.emailAddress});
    // eval(require('locus'));
    // if(user){
    //     req.flash("error", "Email Address is already in use. Please provide another Email address");
    //     res.redirect("/register");
    //     return;
    // }
    //console.log(req.body);
    if(req.body.emailAddress===req.body.confirmEmail&&req.body.password===req.body.confirmPassword){
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
               newUser.isVerified=true;
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
    } else {
        req.flash("error", "You have give both password or email id same!!!");
        res.redirect("/register");
    }
        
    
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

router.get('/users/:id/payementdetails', function(req, res){
    Payement.find({customerId: req.params.id}, function(err, foundPayement){
        if(err){
            console.log(err);
            res.send("error while finding the page");
        } else{
            console.log(foundPayement);
            res.render("users/payment", {foundPayement: foundPayement});
        }
    });
});

router.get("/users/:id/edit", function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            res.render("users/editProfile", {foundUser: foundUser});
        }
    })
});

router.put("/users/:id/edit", function(req,res){
    var flag=false;
    if(req.body.isVerified=='Yes'){
        var flag=true;
    } 
    User.findByIdAndUpdate(req.params.id, {firstname: req.body.firstname,
        lastname: req.body.lastname,
        emailAddress:req.body.emailAddress,
        gender: req.body.gender,
        address: req.body.address,
        city: req.body.city,
        district: req.body.district,
        isVerified: true,
        pinCode: req.body.pinCode,
        mobileNo: req.body.mobileNo,
        alternateMobileNo: req.body.alternateMobileNo }, function(err, updatedUser){
        if(err){
            res.redirect("/");
        } else {
            res.redirect("/users/"+ req.user._id);
        }
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

            res.render("admin/home", {foundPolicies: policies});

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

router.get('/admin/unverified', function(req,res){
    User.find({isVerified: false}, function(err, foundUser){
        if(err){
            console.log(err);
            req.flash("error", "Something went wrong!!");
        }
        //console.log(foundUser);
        res.render("admin/unverified", {foundUser: foundUser});
    });
});

router.get('/admin/verified', function(req,res){
    User.find({isVerified: true}, function(err, foundUser){
        if(err){
            console.log(err);
            req.flash("error", "Something went wrong!!");
        }
        //console.log(foundUser);
        res.render("admin/verified", {foundUser: foundUser});
    });
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

router.put("/users/verify/:id", function(req,res){

    User.findByIdAndUpdate(req.params.id, {isVerified: true}, function(err, updatedUser){
        if(err){
            console.log(err);
            req.flash("error", "Something went wrong");
            res.redirect("/");
        } else{
            console.log("execute");
            res.redirect("/user/"+updatedUser._id);
        }
    });
});

module.exports=router;

