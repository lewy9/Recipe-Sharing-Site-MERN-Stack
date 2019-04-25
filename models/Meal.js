const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MealSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    title: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    category: {
        type: String,
        default: "Other"
    },
    region: {
        type: String,
        default: "Other"
    },
    instructions: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    comments: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: "users"
            },
            name: {
                type: String
            },
            text:{
                type: String,
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ]
});

module.exports = Meal = mongoose.model("meals", MealSchema);