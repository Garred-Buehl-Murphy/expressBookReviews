const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        if (isValid(username)) {
            users.push({"username":username,"password":password});
            return res.status(200).json({message: "User successfully registred. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {  
    const promise = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify(books,null,4)));
    });
    promise.then(() => console.log("book promise resolved"));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const promise = new Promise((resolve, reject) => {
        const isbn = req.params.isbn;
        resolve(res.send(books[isbn]));
    });
    promise.then(() => console.log("isbn promise resolved"));
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const promise = new Promise((resolve, reject) => {
        let authorbooks = [];
        let isbns = Object.keys(books);
        isbns.forEach((isbn) => {
            if(books[isbn]["author"] === req.params.author) {
                authorbooks.push({"isbn":isbn, "title":books[isbn]["title"], "reviews":books[isbn]["reviews"]});
            }
        });

        resolve(res.send(JSON.stringify({authorbooks}, null, 4)));
    });
    promise.then(() => console.log("author promise resolved"));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const promise = new Promise((resolve, reject) => {
        let titlebooks = [];
        let isbns = Object.keys(books);
        isbns.forEach((isbn) => {
            if(books[isbn]["title"] === req.params.title) {
                titlebooks.push({"isbn":isbn, "title":books[isbn]["title"], "reviews":books[isbn]["reviews"]});
            }
        });
        resolve(res.send(JSON.stringify({titlebooks}, null, 4)));
    });
    promise.then(() => console.log("title promise resolved"));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]["reviews"])
});

module.exports.general = public_users;
