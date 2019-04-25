const express = require("express");
const app = express();
const passport = require("passport");
const passportJwt = require("passport-jwt");
const mongoose = require("mongoose");
const User = require("./models/User");
const cors = require("cors");
app.use(cors());
const bodyParser = require("body-parser");
// body parsing middleware for accessing req.body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = process.env.PORT || 5000;

const privateKey = require("./config/database").privateKey;
const db = require("./config/database").mongoURI;
// Connect to MongoDb Database
mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => console.log("Connected to MongoDB!"))
    .catch(error => console.log(error));

// Create passport strategy
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const JwtOpts = {};
JwtOpts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
JwtOpts.secretOrKey = privateKey;
const strategy = new JwtStrategy(JwtOpts, (jwt_payload, done) => {
    //console.log(jwt_payload);
    User.findById(jwt_payload.id)
        .then(user => {
            if(user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        })
        .catch(error => console.log(error));
});

passport.use(strategy);
// initialize passport
app.use(passport.initialize());

const users = require("./routes/users");
app.use("/users", users);

const meals = require("./routes/meals");
app.use("/meals", meals);

app.listen(port, () => console.log(`Express running on port ${port}`));
