const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    favorites: [
        {
            meal: {
                type: Schema.Types.ObjectId,
                ref: "meals"
            }
        }
    ]
});

module.exports = User = mongoose.model("users", UserSchema);