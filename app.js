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

    const errors = validationResult(req);
    console.log(errors.mapped());
    res.render('index',{
        error: errors.mapped()
    });

    // if (!errors.isEmpty()) {
    //     return res.status(422).json({ errors: errors.array() });
    // }

    // var errors = validationResult(req).array();
    // if (errors) {
    //     req.session.errors = errors;
    //     req.session.success = false;
    //     res.redirect("/");
    // } else {
    //     req.session.success = true;
    //     res.redirect("/");
    // }



    // var aiubname = req.body.name.trim().toUpperCase()
    // var username = req.body.username.trim();
    // var mail = req.body.email.trim();
    // var phoneno = req.body.phone.trim();
    // var gender = req.body.gender;

    // console.log(aiubname,username,mail,phoneno,gender);

    // connection.query('SELECT username FROM registration WHERE username ="' +username+'"', function (err, result) {
    //     if (err) throw err;

    //     console.log(result.length);
    //     //checking duplicate username
    //     if(result.length == 0){
    //         var sql = "insert into registration values('','"+aiubname+"', '"+username+"', '"+mail+"','"+phoneno+"', '"+gender+"')";
            
    //         connection.query(sql, function (err) {
    //             if (err){
    //                 res.sendFile(__dirname+"/Front-End/fail.html");
    //                 console.log(err);
    //                 return;
    //             }
    //             else{
    //                 res.sendFile(__dirname+"/Front-End/subscribed.html");
    //             }
    //         });
    //         console.log("Username not exist, easy to enter data into database");
    //     }else{
    //         console.log('Username exist!!');
    //         res.sendFile(__dirname+"/Front-End/fail.html");
    //     }
    

    //   });

    

    //connection.end();

});

app.post("/failure", function(req,res){
    res.redirect("/");
});