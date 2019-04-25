import React, {Component} from 'react';
import {Link, withRouter} from "react-router-dom";
import axios from "axios";
import classnames from "classnames";

class Navbar extends Component {
    render() {
        return (
            // The css(classname) layout of navbar referenced from bootstrap: https://getbootstrap.com/docs/4.3/components/navbar/
            <nav className="navbar navbar-expand-lg navbar-light mb-5 " style={{"backgroundColor": "burlywood"}}>
                <div className="container">
                    <Link className="navbar-brand font-weight-bold" to="/">Home</Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse"
                            data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"/>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <Link className="nav-link badge badge-pill badge-primary" to="/add" hidden={!localStorage.token}>Add Meal</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link badge badge-pill badge-secondary" to="/favorites" hidden={!localStorage.token}>Favorites</Link>
                            </li>
                        </ul>
                        <ul className={classnames("navbar-nav ml-auto", {"d-none": localStorage.token})}>
                            <li className="nav-item">
                                <Link className="nav-link" to="/signup" >Sign Up</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/login" >Login</Link>
                            </li>
                        </ul>
                        <ul className={classnames("navbar-nav ml-auto", {"d-none": !localStorage.token})}>
                            <li className="nav-item">
                                <a className="nav-link badge badge-pill badge-danger" href="" onClick={this.deleteAccount.bind(this)} >Delete Account</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link badge badge-pill badge-warning" href="" onClick={this.logout.bind(this)} >Logout</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }

    // logout function when click the log out button
    logout = event => {
        event.preventDefault();
        localStorage.removeItem("token");
        delete axios.defaults.headers.common['Authorization'];
        this.props.history.push("/");
    };

    // delete Account function
    deleteAccount = event => {
        event.preventDefault();

        axios
            .delete("/users/account/delete")
            .then(res => {
                console.log(res.data.message);
                localStorage.removeItem("token");
                delete axios.defaults.headers.common['Authorization'];
                window.location.href = "/";
            })
    };

}

export default withRouter(Navbar);