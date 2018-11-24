var express=require('express');
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var passport=require("passport");
var LocalStrategy=require("passport-local");
var seedDB = require("./seed");
var User=require("./models/user");
var methodOverride=require("method-override");
var Policy=require("./models/policy");

var vehicleRoute=require("./routes/vehicles"),
    authRoute=require("./routes/index"),
    lifeRoute=require("./routes/life"),
    policyRoute=require("./routes/policies");

mongoose.connect('mongodb://localhost:27017/insurance_system');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(methodOverride("_method"));

//Configuring passport
app.use(require('express-session')({
    secret: 'Insurance Management',
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//seedDB();
app.use("/vehicles", vehicleRoute);
app.use("/life", lifeRoute);
app.use("/policy", policyRoute);
app.use(authRoute);

//post  route to handle the new policy



app.listen(3000, (res, error) =>{
    console.log("Application has been started on port 3000")
});