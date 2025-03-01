const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user)=>{
        return user.username === username
    });
    if(userswithsamename.length > 0){
        return false;
    } else {
        return true;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
    if (authenticatedUser(username,password)) {
        let accessToken = jwt.sign({
        data: password
        }, 'access', { expiresIn: 60 * 60 });
        req.session.authorization = {
            accessToken,username
        };
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn
    let book = books[isbn]
    if (book) {
        let review = req.query.review;
        let reviewer = req.session.authorization["username"];
        if(review) {
            book["reviews"][reviewer] = review;
            books[isbn] = book;
            res.send(`${reviewer}'s review for the book ${book["title"]} has been added or changed.`);
        } else {
            res.send("Error, Null review parameter.")
        }
    } else {
        res.send("Invalid book ISBN.")
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let book = books[isbn];
    if (book) {
        let reviewer = req.session.authorization["username"];
        delete book["reviews"][reviewer]
        books[isbn] = book;
        res.send(`${reviewer}'s review for the book ${book["title"]} has been deleted.`);
    } else {
        res.send("Invalid book ISBN.")
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
