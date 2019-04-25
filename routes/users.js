// Backend users authentication including login, register and logout
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const bcrypt = require("bcrypt");

// Meal Schema
const Meal = require("../models/Meal");
// User Schema
const User = require("../models/User");
const privateKey = require("../config/database").privateKey;

// Sign Up API
router.post("/account/signup", (req, res) => {
    const { body } = req;
    const {
        username,
        password,
        password2
    } = body;

    // Check Empty
    let err = {};
    if(!username) {
        err.username = "Your username is empty!";
    }

    if(!password) {
        err.password = "Your password is empty!";
    }

    if(!password2) {
        err.password2 = "Your confirmed password is empty!";
    }

    // check confirmed password equal to password
    let flag = false;

    if(password === password2) {
        flag = true;
    }
    else {
        flag = false;
        err.password2 = "Two passwords don't match!";
    }

    if(!username || !password || !password2 || !flag) {
        return res.status(400).json(err);
    }

    // First check if the username already exists
    User.findOne({ username: req.body.username })
        .then(user => {
            if(user) {
                // already exists, return 400.
                return res.status(400).json({username: "Username already exists!"});
            }
            else {
                // Create a new user
                const newUser = new User({
                    username: req.body.username,
                    password: req.body.password
                });

                // Generate salted password(using bcrypt)
                bcrypt.genSalt(10, (error, pwd_salt) => {
                    bcrypt.hash(newUser.password, pwd_salt, (error, pwd_hash) => {
                        if(error)
                            throw error;
                        newUser.password = pwd_hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(error => console.log(error))
                    })
                })
            }
        })
});

// login API & passing Json Web Token
router.post("/account/login", (req, res) => {
    const { body } = req;
    const {
        username,
        password
    } = body;

    // Check Empty
    let err = {};
    if(!username) {
        err.username = "Your username is empty!";
    }

    if(!password) {
        err.password = "Your password is empty!";
    }

    if(!username || !password) {
        return res.status(400).json(err);
    }

    // Validate the password, first find the user by username
    User.findOne({ username: req.body.username })
        .then(user => {
            if(!user) {
                // User Not Found, return 400
                return res.status(400).json({username: "This account doesn't exist!"});
            }

            // Validate the password(Using bcrypt to compare)
            bcrypt.compare(password, user.password)
                .then(isValid => {
                    if(!isValid) {
                        // Wrong Password, return 400
                        return res.status(400).json({password: "Wrong Password!"});
                    }
                    else {
                        // Create JWT Payload
                        const payload = {
                            id: user.id,
                            username: user.username,
                            password: user.password
                        };

                        // Create JWT signing options
                        const signOptions = {
                            expiresIn: 5400
                        };

                        // Correct Password, then generate and pass Json Web Token for login session
                        jwt.sign(payload, privateKey, signOptions, (error, token) => {
                            res.json({
                                success: true,
                                message: "Here is your token",
                                token: "Bearer " + token
                            });
                        });
                    }
                })
        })
});

// Delete Account
router.delete("/account/delete", passport.authenticate('jwt', { session: false }), (req, res) => {
    Meal.remove({ user: req.user.id }).then(() => {
        Meal.find({ "comments.user": req.user.id }).then(meals => {
            meals.forEach(meal => {
                const comments = meal.comments;
                for(let i = 0; i < comments.length; i++) {
                    if(comments[i].user.toString() === req.user.id.toString()) {
                        comments.splice(i, 1);
                        i--;
                    }
                }
                meal.save().then(() => console.log("Comment delete success"))
            });
        }).then(() => {
            User.findOneAndRemove({ _id: req.user.id }).then(() => {
                res.json({
                    success: true,
                    message: "Account Delete Success!"
                })
            })
        })
    })
});

// Get favorite meals
router.get("/fav", passport.authenticate('jwt', { session: false }), (req, res) => {
    User.findById(req.user.id)
        .then(user => res.json(user.favorites))
        .catch(error => console.log(error))
});

// check if this meal is already in the favorites list
router.post("/fav/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
    User.findById(req.user.id)
        .then(user => {
            const fav = user.favorites;
            let flag = true;
            for(let i = 0; i < fav.length; i++) {
                if(fav[i].meal.toString() !== req.params.id) {
                    flag = true;
                }
                else {
                    // duplicate found
                    flag = false;
                    break;
                }
            }
            if(flag) {
                return res.json({success: false});
            }
            else {
                return res.json({success: true});
            }
        })
});

// Add a meal to favorites
router.post("/fav/add/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
    User.findById(req.user.id)
        .then(user => {
            const fav = user.favorites;
            let flag = true;
            for(let i = 0; i < fav.length; i++) {
                if(fav[i].meal.toString() !== req.params.id) {
                    flag = true;
                }
                else {
                    // duplicate found
                    flag = false;
                    break;
                }
            }
            if(flag) {
                const newMeal = {
                    meal: req.params.id
                };
                user.favorites.unshift(newMeal);
                user.save()
                    .then(user => res.json({user, success: true}))
                    .catch(error => console.log(error));
            }
            else {
                return res.json({success: false});
            }
        })
});

// delete a meal in the favorite list
router.delete("/fav/delete/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
    User.findById(req.user.id)
        .then(user => {
            const fav = user.favorites;
            let flag = false;
            let index = 0;
            // Check if meal exists
            for(let i = 0; i < fav.length; i++) {
                if(fav[i].meal.toString() === req.params.id) {
                    index = i;
                    flag = true;
                    break;
                }
                else {
                    flag = false;
                }
            }

            if(!flag) {
                // Meal not exist
                return res.status(404).json({
                    success: false,
                    message: "Meal Not Found"
                })
            }

            user.favorites.splice(index, 1);
            user.save()
                .then(user => res.json(user))
                .catch(error => res.json(error))
        })
        .catch(error => res.status(404).json({
            success: false,
            message: "User Not Found!"
        }))
});

module.exports = router;