var mongoose = require("mongoose");

var data = [
    {
        name: "Mirzapur",
        type: "individual",
        description: "mirzapur k niwasi",
        duration: 5
    },
    {
        name: "Gangs of Wasseypur",
        type: "Gang",
        description: "sabka badla lega tera faizal",
        duration: 2
    },{
        name: "Sacred Games",
        type: "individual",
        description: "yahich maangta hai apun ko",
        duration: 5
    }
];


function seedDB(){
    //remove all vehicle policy
    Vehicle.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("policy has been removed");
        data.forEach(function(seed){
            Vehicle.create(seed, function(err, data){
                if(err){
                    console.log(err);
                } else {
                    console.log("data has been created");
                }
            })
        });
    });



}

module.exports = seedDB;