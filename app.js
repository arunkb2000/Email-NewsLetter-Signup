//jshint esversion:6
const express = require("express");
const request = require("request");
const https = require("https");
const { options } = require("request");

const app = express();
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static("public"));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});
app.post("/", function(req, res){
    const fName = req.body.fName;
    const lName = req.body.lName;
    const email = req.body.email;
    const data = {
        members: [
         {
            email_address: email,
            status: "subscribed",
            merge_fields: {
                    FNAME:fName,
                    LNAME:lName,
            }
        }
      ]
    };
    const jsonData =JSON.stringify(data);
    const url = "https://us6.api.mailchimp.com/3.0/lists/bb246d6823";
    const options = {
        method: "POST",
        auth: "arun:950abbc6f17ea80de0b6782b6835cf82-us6"
    }
    const request=https.request(url, options, function(response){
       if( response.statusCode===200 ){
           console.log(response.statusCode);
           res.sendFile(__dirname + "/success.html");
       }else{
        res.sendFile(__dirname + "/failure.html");
       }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
    
})
app.post("/failure", function(req, res){
    res.redirect("/");
})

app.listen(3000, function(){
    console.log("server started");
});