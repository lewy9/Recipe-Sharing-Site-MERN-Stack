import React, {Component} from 'react';
import {Link} from "react-router-dom";
import axios from 'axios';
// Create conditional classname(if error exists, className 1; else, className 2)
import classnames from 'classnames';

class AddMeal extends Component {
    constructor(props) {
        super(props);
        // initial state
        this.state = {
            title: "",
            category: "",
            region: "",
            instructions: "",
            err: {}
        };
    }

    // Redirect users to login page when they try to go to add meal page without authority
    componentDidMount() {
        if(!localStorage.token)
            this.props.history.push("/login");
    }

    // Use onChange to keep tracking state value
    onChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    };

    onSubmit = event => {
        // Prevent default event action(Prevent the page from reloading when clicking the submit button)
        event.preventDefault();

        const newMeal = {
            title: this.state.title,
            category: this.state.category,
            region: this.state.region,
            instructions: this.state.instructions
        };

        // send request to the server side
        axios
            .post("/meals/add", newMeal)
            .then(res => {
                console.log("Input data: " + res.data);

                // Initialize input box
                this.setState({
                    title: "",
                    category: "Other",
                    region: "Other",
                    instructions: "",
                    err: {}
                });

                // Redirect to home page after meal being successfully added
                this.props.history.push("/");
            })
            .catch(error => this.setState({
                err: error.response.data
            }));
    };

    render() {
        return (
            // bootstrap form grid
            // custom <select> referenced from https://getbootstrap.com/docs/4.3/components/input-group/#custom-select
            // "Display the error message in the form"(invalid feedback) referenced from https://getbootstrap.com/docs/4.0/components/forms/#validation
            <div className="container">
                <div className="form-row">
                    <div className="m-auto col-md-7">
                        <Link to="/" className="btn btn-secondary waves-light">
                            Back to home
                        </Link>
                        <div className="col s14">
                            <h3 className="display-4 h3 mb-3 font-weight-normal">Add New Meal</h3>
                        </div>
                        <form onSubmit={this.onSubmit}>
                            <div className="input-group">
                                <input
                                    className={classnames("form-control", {"is-invalid": this.state.err.title})}
                                    type="text"
                                    name="title"
                                    value={this.state.title}
                                    onChange={this.onChange}
                                    placeholder="Meal Title"
                                    required autoFocus
                                />
                                <div className="invalid-feedback">
                                    {this.state.err.title}
                                </div>
                            </div>
                            <br/>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <label className="input-group-text">Meal Category</label>
                                </div>
                                <select
                                    className={classnames("custom-select", {"is-invalid": this.state.err.category})}
                                    id="inputGroupSelect01"
                                    name="category"
                                    value={this.state.category}
                                    onChange={this.onChange}>
                                    <option key={"Choose a category..."} value={0}>Choose a category...</option>
                                    <option key={"Beef"} value={"Beef"}>Beef</option>
                                    <option key={"Chicken"} value={"Chicken"}>Chicken</option>
                                    <option key={"Desert"} value={"Desert"}>Desert</option>
                                    <option key={"Lamb"} value={"Lamb"}>Lamb</option>
                                    <option key={"Miscellaneous"} value={"Miscellaneous"}>Miscellaneous</option>
                                    <option key={"Pasta"} value={"Pasta"}>Pasta</option>
                                    <option key={"Pork"} value={"Pork"}>Pork</option>
                                    <option key={"Side"} value={"Side"}>Side</option>
                                    <option key={"Vegetarian"} value={"Vegetarian"}>Vegetarian</option>
                                    <option key={"Other"} value={"Other"}>Other</option>
                                </select>
                                <div className="invalid-feedback">
                                    {this.state.err.category}
                                </div>
                            </div>
                            <br/>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <label className="input-group-text" htmlFor="inputGroupSelect01">Meal Region</label>
                                </div>
                                <select
                                    className={classnames("custom-select", {"is-invalid": this.state.err.region})}
                                    id="inputGroupSelect01"
                                    name="region"
                                    value={this.state.region}
                                    onChange={this.onChange}>
                                    <option key={"Choose a region..."} value={0}>Choose a region...
                                    </option>
                                    <option key={"China"} value={"China"}>China</option>
                                    <option key={"France"} value={"France"}>France</option>
                                    <option key={"Greek"} value={"Greek"}>Greek</option>
                                    <option key={"India"} value={"India"}>India</option>
                                    <option key={"Italy"} value={"Italy"}>Italy</option>
                                    <option key={"Mexico"} value={"Mexico"}>Mexico</option>
                                    <option key={"Spain"} value={"Spain"}>Spain</option>
                                    <option key={"Thailand"} value={"Thailand"}>Thailand</option>
                                    <option key={"United States"} value={"United States"}>United States</option>
                                    <option key={"Other"} value={"Other"}>Other</option>
                                </select>
                                <div className="invalid-feedback">
                                    {this.state.err.region}
                                </div>
                            </div>
                            <br/>
                            <div className="input-group">
                                <textarea
                                    className={classnames("form-control z-depth-1", {"is-invalid": this.state.err.instructions})}
                                    name="instructions"
                                    style={{"height": "150px"}}
                                    value={this.state.instructions}
                                    onChange={this.onChange}
                                    placeholder="Meal Instructions"
                                />
                                <div className="invalid-feedback">
                                    {this.state.err.instructions}
                                </div>
                            </div>
                            <br/>
                            <input type="submit" className="btn btn-large btn-secondary waves-light" value="Submit"/>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default AddMeal;