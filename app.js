require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const {check, validationResult} = require('express-validator');
var mysql = require("mysql");

const app = express();

app.use(express.static("Front-End"));  //To use local assets
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'twig');
app.set('views','./Front-End/views');



app.get("/",function(req,res){
    //res.sendFile(__dirname + "/Front-End/index.html");
    res.render('index');
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
    check('name','Invalid Name').not().isEmpty().escape().isLength({min: 6}),
    check('username', 'Invalid Username').not().isEmpty().escape().isLength({min: 4}),
    check('email', 'Invalid Email').not().isEmpty().isEmail().escape().normalizeEmail(),
    check('phone', 'Invalid Phone Number').not().isEmpty().escape().isNumeric().isLength({min: 11}),

],function(req,res){

    function insertToDatabase(){
        var sql = "insert into registration values('','"+aiubname+"', '"+username+"', '"+mail+"','"+phoneno+"', '"+gender+"')";
        connection.query(sql, function (err) {
            if (err){
                console.log("Reason for showing fail page: "+err);
                res.sendFile(__dirname+"/Front-End/fail.html");
                return;
            }
            else{
                console.log('Data inserted Successfully');
                res.sendFile(__dirname+"/Front-End/subscribed.html");
                //TODO: Confirmation mail send setup
            }
        });
    }

    const errors = validationResult(req);
    console.log(errors.mapped());

    if(!errors.isEmpty()){
        res.render('index',{error: errors.mapped()});
    }
    else{
        //Initialize inputs
        var aiubname = req.body.name.trim().toUpperCase()
        var username = req.body.username.trim();
        var mail = req.body.email.trim();
        var phoneno = req.body.phone.trim();
        var gender = req.body.gender;

        //Printing inputs
        console.log(aiubname,username,mail,phoneno,gender);

        //Checking duplicated username
        connection.query('SELECT username FROM registration WHERE username ="' +username+'"', function (err, result) {
            if (err) throw err;

            //Result length = 0 means no duplicate username
            console.log(result.length);

            //Conditions for inserting into database if no duplicate username found.
            if(result.length == 0){
                insertToDatabase();

            }else{
                console.log('Username exist!!');
                res.render('index',{duplicateUsernameMsg: "Username already exists"});
            }
          });
    }
    
    //connection.end();

});

app.post("/failure", function(req,res){
    res.redirect("/");
});