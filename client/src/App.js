import React, { Component } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/home/Home';
import Signup from './components/auth/Signup';
import Login from './components/auth/Login';
import AddMeal from './components/meals/AddMeal';
import EditMeal from './components/meals/EditMeal';
import MealView from './components/meals/MealView';
import Favorites from './components/favorite/Favorites';
import EditComment from './components/comments/EditComment';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import jwt_decode from 'jwt-decode';
import axios from "axios";

class App extends Component {
    render() {
        return (
            <Router>
                <div className="App">
                    <Navbar />
                    <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/favorites" component={Favorites} />
                    <Route exact path="/signup" component={Signup} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/add" component={AddMeal}/>
                    <Route exact path="/:id" component={MealView}/>
                    <Route exact path="/edit/:id" component={EditMeal}/>
                    <Route exact path="/edit/:id/:commentId" component={EditComment}/>
                    </Switch>
                </div>
            </Router>
        );
    }
}

// A function to check whether user token is expired
const isTokenExpired = token => {
    try {
        // decoded data(user)
        const decoded = jwt_decode(token);
        return decoded.exp < Date.now() / 1000;
    }
    catch (e) {
        return false;
    }
};

// keep checking user token status
if(localStorage.token) {
    // Set Authorization Header
    axios.defaults.headers.common['Authorization'] = localStorage.token;
    if(isTokenExpired(localStorage.token)) {
        // if expired, redirect to login page
        localStorage.removeItem("token");
        delete axios.defaults.headers.common['Authorization'];
        window.location.href = "/login";
    }
}

export default App;
