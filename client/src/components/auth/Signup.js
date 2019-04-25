import React, {Component} from 'react';
import {Link} from "react-router-dom";
import axios from 'axios';
// Create conditional classname(if error exists, className 1; else, className 2)
import classnames from 'classnames';

class Signup extends Component {
    constructor(props) {
        super(props);
        // initial state
        this.state = {
            username: "",
            password: "",
            password2: "",
            err: {}
        };
    }

    // Redirect logged in user to home page when they try to go to login or signup page
    componentDidMount() {
        if(localStorage.token)
            this.props.history.push("/");
    }

    // Use onChange to keep tracking state value
    onChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    };

    onSubmit = event => {
        // Prevent default event action(Prevent the page from reloading when clicking the submit button)
        event.preventDefault();

        const newUser = {
            username: this.state.username,
            password: this.state.password,
            password2: this.state.password2
        };

        // send request to the server side
        axios
            .post("/users/account/signup", newUser)
            .then(res => {
                console.log("Input data: " + res.data);

                // Initialize input box
                this.setState({
                    username: "",
                    password: "",
                    password2: "",
                    err: {}
                });

                this.props.history.push("/login");
            })
            .catch(error => this.setState({
                err: error.response.data,
                password: "",
                password2: ""
            }));
    };

    render() {
        return (
            // bootstrap form grid

            // "Display the error message in the form"(invalid feedback) referenced from https://getbootstrap.com/docs/4.0/components/forms/#validation
            <div className="container">
                <div className="form-row">
                    <div className="m-auto">
                        <Link to="/" className="btn btn-secondary waves-light">
                            Back to home
                        </Link>
                        <div className="col s14">
                            <h3 className="display-4 h3 mb-3 font-weight-normal">Sign Up here!</h3>
                            <p>
                                Already have an account? <Link to="/login" className="font-weight-bold" style={{"color": "burlywood"}}>
                                    Login Here
                                </Link>
                            </p>
                        </div>
                        <form noValidate onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <input
                                    className={classnames("form-control", {"is-invalid": this.state.err.username})}
                                    type="text"
                                    name="username"
                                    value={this.state.username}
                                    onChange={this.onChange}
                                    placeholder="Your Username"
                                    required autoFocus
                                />
                                <div className="invalid-feedback">
                                    {this.state.err.username}
                                </div>
                            </div>
                            <div className="form-group">
                                <input
                                    className={classnames("form-control", {"is-invalid": this.state.err.password})}
                                    type="password"
                                    name="password"
                                    value={this.state.password}
                                    onChange={this.onChange}
                                    placeholder="Your Password"
                                    required
                                />
                                <div className="invalid-feedback">
                                    {this.state.err.password}
                                </div>
                            </div>
                            <div className="form-group">
                                <input
                                    className={classnames("form-control", {"is-invalid": this.state.err.password2})}
                                    type="password"
                                    name="password2"
                                    value={this.state.password2}
                                    onChange={this.onChange}
                                    placeholder="Confirm Your Password"
                                    required
                                />
                                <div className="invalid-feedback">
                                    {this.state.err.password2}
                                </div>
                            </div>
                            <input type="submit" className="btn btn-large btn-secondary waves-light" value="Submit"/>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default Signup;