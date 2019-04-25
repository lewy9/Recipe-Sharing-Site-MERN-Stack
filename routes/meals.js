// Backend: meals including add, edit and delete
const express = require("express");
const router = express.Router();
const passport = require('passport');

// Meal Schema
const Meal = require("../models/Meal");

// Get All Meals
router.get("/", (req, res) => {
   Meal.find()
       .sort({ date: 'desc'})
       .then(meals => res.json(meals))
       .catch(error => res.json(404).json(error))
});

// Add A Meal
router.post("/add", passport.authenticate('jwt', { session: false }), (req, res) => {
    const { body } = req;
    const {
        title,
        instructions,
        region,
        category
    } = body;

    // Check Empty
    let err = {};

    let flag_region = false;
    if(region === 0) {
        flag_region = false;
        err.region = "Please select a region";
    }
    else
        flag_region = true;

    let flag_category = false;
    if(category === 0) {
        flag_category = false;
        err.category = "Please select a category";
    }
    else
        flag_category = true;

    if(!title) {
        err.title = "Your title-field is empty!";
    }

    if(!instructions) {
        err.instructions = "Your instructions-field is empty!";
    }

    if(!title || !instructions || !flag_category || !flag_region) {
        return res.status(400).json(err);
    }

    // Create a new meal
    const newMeal = new Meal({
        user: req.user.id,
        title: req.body.title,
        name: req.user.username,
        category: req.body.category,
        region: req.body.region,
        instructions: req.body.instructions
    });

    newMeal.save()
        .then(meal => res.json(meal))
        .catch(error => res.json(error))
});

// Get a single Meal by id
router.get("/:id", (req, res) => {
    Meal.findById(req.params.id)
        .then(meal => res.json(meal))
        .catch(error => res.json(404).json(error))
});

// Delete a Meal by id
router.delete("/delete/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
    Meal.findById(req.params.id)
        .then(meal => {
            // Validate the author of the meal is current login user
            if(meal.user.toString() === req.user.id) {
                // Delete this meal
                meal.remove()
                    .then(() => res.json({
                        success: true,
                        message: "Delete success!"
                    }))
                    .catch(error => res.json(404).json(error))
            }
            else {
                return res.status(401).json({
                    success: false,
                    message: "You don't have authority"
                })
            }
        })
});

// Edit a Meal by id (pre fill)
router.get("/edit/:id", (req, res) => {
    Meal.findById(req.params.id)
        .then(meal => res.json(meal))
        .catch(error => res.json(404).json(error))
});

// Edit a Meal by id
router.post("/edit/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
    const { body } = req;
    const {
        title,
        instructions,
        region,
        category
    } = body;

    // Check Empty
    let err = {};

    let flag_region = false;
    if(region === 0) {
        flag_region = false;
        err.region = "Please select a region";
    }
    else
        flag_region = true;

    let flag_category = false;
    if(category === 0) {
        flag_category = false;
        err.category = "Please select a category";
    }
    else
        flag_category = true;

    if(!title) {
        err.title = "Your title-field is empty!";
    }

    if(!instructions) {
        err.instructions = "Your instructions-field is empty!";
    }

    if(!title || !instructions || !flag_category || !flag_region) {
        return res.status(400).json(err);
    }

    // Create meal field
    const mealFields = {};
    mealFields.user = req.user.id;
    mealFields.name = req.user.username;
    if(req.body.title)
        mealFields.title = req.body.title;
    if(req.body.category)
        mealFields.category = req.body.category;
    if(req.body.region)
        mealFields.region = req.body.region;
    if(req.body.instructions)
        mealFields.instructions = req.body.instructions;

    Meal.findById(req.params.id)
        .then(meal => {
            if(meal) {
                Meal.findOneAndUpdate(
                    {_id: req.params.id},
                    {$set: mealFields},
                    {new: true}
                )
                    .then(meal => res.json(meal))
            }
        })
});

// Add a comment
router.post("/comment/add/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
    const { body } = req;
    const {
        text
    } = body;

    // Check Empty
    let err = {};

    if(!text) {
        err.text = "Your text-field is empty!";
    }

    if(!text) {
        return res.status(400).json(err);
    }

    Meal.findById(req.params.id)
        .then(meal => {
            const newComment = {
                user: req.user.id,
                name: req.user.username,
                text: req.body.text
            };

            // Push to the comments array
            meal.comments.unshift(newComment);
            meal.save()
                .then(meal => res.json(meal))
                .catch(error => res.json(error))
        })
        .catch(error => res.status(404).json({
            success: false,
            message: "Can't find this meal!",
            error: error
        }))
});

// get a comment by id
router.get("/comment/:id/:commentId", (req, res) => {
    Meal.findById(req.params.id)
        .then(meal => {
            const comments = meal.comments;
            let flag = false;
            let index = 0;
            // Check if comment exists
            for(let i = 0; i < comments.length; i++) {
                if(comments[i]._id.toString() === req.params.commentId) {
                    index = i;
                    flag = true;
                    break;
                }
                else {
                    flag = false;
                }
            }

            if(!flag) {
                // Comment not exist
                return res.status(404).json({
                    success: false,
                    message: "Comment Not Found"
                })
            }
            return res.json(comments[index]);
        })
});

// Delete a comment
router.delete("/comment/delete/:id/:commentId", passport.authenticate('jwt', { session: false }), (req, res) => {
    Meal.findById(req.params.id)
        .then(meal => {
            const comments = meal.comments;
            let flag = false;
            let index = 0;
            // Check if comment exists
            for(let i = 0; i < comments.length; i++) {
                if(comments[i]._id.toString() === req.params.commentId) {
                    index = i;
                    flag = true;
                    break;
                }
                else {
                    flag = false;
                }
            }

            if(!flag) {
                // Comment not exist
                return res.status(404).json({
                    success: false,
                    message: "Comment Not Found"
                })
            }

            meal.comments.splice(index, 1);
            meal.save()
                .then(meal => res.json(meal))
                .catch(error => res.json(error))
        })
        .catch(error => res.status(404).json({
            success: false,
            message: "Meal Not Found!"
        }))
});

// Edit a comment
router.post("/comment/edit/:id/:commentId", passport.authenticate('jwt', { session: false }), (req, res) => {
    Meal.findOneAndUpdate(
        {   _id: req.params.id,
            'comments._id': req.params.commentId
        },
        {
            $set: {
                'comments.$.text': req.body.text
            }
        })
        .then(meal => res.json(meal))
        .catch(error => console.log(error))
});


module.exports = router;