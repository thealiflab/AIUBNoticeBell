require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const {check, validationResult} = require('express-validator');
var mysql = require("mysql");



const app = express();

app.use(express.static("Front-End"));  //To use local assets
app.use(bodyParser.urlencoded({extended: true}));

app.get("/",function(req,res){
    res.sendFile(__dirname + "/Front-End/index.html");
});

app.listen(3000, function(){
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



app.post("/", [
    check('name').not().isEmpty().escape().withMessage('Name must have more than 6 characters'),
    check('username', 'Username is empty').not().isEmpty(),
    check('email', 'Your email is not valid').not().isEmpty().isEmail().normalizeEmail(),
    check('phone', 'Your phone number is invalid').not().isNumeric(),

],function(req,res){

    var aiubname = req.body.name.trim().toUpperCase()
    var username = req.body.username.trim();
    var mail = req.body.email.trim();
    var phoneno = req.body.phone.trim();
    var gender = req.body.gender;

    console.log(aiubname,username,mail,phoneno,gender);

    connection.query('SELECT username FROM registration WHERE username ="' +username+'"', function (err, result) {
        if (err) throw err;

        console.log(result.length);
        //checking duplicate username
        if(result.length == 0){
            var sql = "insert into registration values('','"+aiubname+"', '"+username+"', '"+mail+"','"+phoneno+"', '"+gender+"')";
            
            connection.query(sql, function (err) {
                if (err){
                    res.sendFile(__dirname+"/Front-End/fail.html");
                    console.log(err);
                    return;
                }
                else{
                    res.sendFile(__dirname+"/Front-End/subscribed.html");
                }
            });
            console.log("Username not exist, easy to enter data into database");
        }else{
            console.log('Username exist!!');
            res.sendFile(__dirname+"/Front-End/fail.html");
        }
    

      });

    

    //connection.end();

});

app.post("/failure", function(req,res){
    res.redirect("/");
});