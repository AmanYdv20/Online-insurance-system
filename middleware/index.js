var middlewareObj={};

middlewareObj.isLoggedIn= function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to Log In first");
    res.redirect("/login");
}

middlewareObj.adminPermission=function(req, res, next) {

    if (req.isAuthenticated()&&req.user.isAdmin) {
      return next();
    }
    req.flash("error", "Sorry!! You do not have permission to visit that page.");
    res.redirect("/");
}


module.exports=middlewareObj;