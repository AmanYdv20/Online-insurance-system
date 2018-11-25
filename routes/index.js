var express=require("express");
var router=express.Router();
var passport=require("passport");
var User=require("../models/user");
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
    User.findById(req.params.id).populate('policies').exec(function(err, foundUser){
        //console.log(foundUser.policies[0].name);
        if(err){
            req.flash("error", "Something went wrong");
            res.redirect("/users/"+req.params.id);
        }


        res.render("users/userPolicy", {userPolicy: foundUser.policies});

    })
});

module.exports=router;

