require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { MongoClient } = require("mongodb");
const CryptoJS = require("crypto-js");

const app = express();

const uri = "mongodb+srv://kashishraj7277:sonu123@cluster0.q02uknc.mongodb.net/userDB";
const client = new MongoClient(uri);

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/register", function (req, res) {
    res.render("register");
});

app.post("/register", async function (req, res) {
    const database = client.db('userDB');
    const item = database.collection('users');

    let data = req.body.password;
    
    var ciphertext = CryptoJS.AES.encrypt(data,process.env.SECRET).toString();  // level 2 security:Encryption
    await item.insertOne({
        email: req.body.username,
        password: ciphertext
    })
    res.render("secrets");
})

app.post("/login", async function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    const database = client.db('userDB');
    const item = database.collection('users');

    const foundUser = await item.findOne({ email: username });
    let bytes  = CryptoJS.AES.decrypt(foundUser.password,process.env.SECRET); // Decryption of password
    let decryptedData = bytes.toString(CryptoJS.enc.Utf8);

    if (decryptedData === password) {
        res.render("secrets");
    }
    else {
        res.render("home");
    }
})









app.listen(3000, function () {
    console.log("Server started on port 3000");
});