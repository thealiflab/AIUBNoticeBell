require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
var mysql = require("mysql");


const app = express();

app.use(express.static("public"));  //To use local assets
app.use(bodyParser.urlencoded({extended: true}));

app.get("/",function(req,res){
    res.sendFile(__dirname + "/index.html");
});

app.listen(3306, function(){
    console.log("Server started....");
});

// MySQL setup Local device
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    pass: '',
    database: 'aiubnoticebell'
});

//ensure database is running
connection.connect(function(err){
    if(err) throw err;
    else{
        console.log('Database is connect successfully...');
    }
    
});



app.post("/",function(req,res){
    var aiubname = req.body.name;
    var username = req.body.username;
    var mail = req.body.email;
    var phoneno = req.body.phone;
    var gender = req.body.gender;

    console.log(firstName,lastName,username,email,phone,gender);


    var sql = "insert into usersinfo values('"+firstName+"', '"+lastName+"', '"+username+"','"+email+"', '"+phone+"', '"+gender+"')"
    connection.query(sql, function (err) {
        if (err){
            res.sendFile(__dirname+"/fail.html");
            console.log(err);
            return;
        }
        else{
            res.sendFile(__dirname+"/success.html");
        }
      });

    //connection.end();

});

app.post("/failure", function(req,res){
    res.redirect("/");
});