import React, {Component} from 'react';
import axios from "axios";
import classnames from "classnames";
import RowViewComment from "./RowViewComment";

class Comments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: "",
            err: {}
        }
    }

    // Use onChange to keep tracking state value
    onChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    };

    onSubmit = event => {
        // Prevent default event action(Prevent the page from reloading when clicking the submit button)
        event.preventDefault();

        const newComment = {
            text: this.state.text
        };

        // send request to the server side
        axios
            .post("/meals/comment/add/" + this.props.obj._id, newComment)
            .then(res => {
                console.log("Input data: " + res.data);

                // Initialize input box
                this.setState({
                    text: ""
                });

                // Redirect to home page after meal being successfully added
                window.location.href = "/" + this.props.obj._id;
            })
            .catch(error => console.log(error))
    };

    // Display all the comments as a list of rows (set default value)
    rowView = (comments = []) => {
        return comments.map((obj, idx) => {
            obj.meal = this.props.obj._id;
            return <RowViewComment obj={obj} key={idx} />;
        })
    };

    render() {
        return (
            <div className="container">
                <div className={classnames("m-auto col-md-10", {"d-none": !localStorage.token})}>
                    <div className="card">
                        <h5 className="card-header">Comment Here...</h5>
                        <div className="card-body">
                            <form onSubmit={this.onSubmit}>
                                <div className="form-group">
                                <textarea
                                    className={classnames("form-control z-depth-1", {"is-invalid": this.state.err.text})}
                                    name="text"
                                    style={{"height": "150px"}}
                                    value={this.state.text}
                                    onChange={this.onChange}
                                    placeholder="Comment here..."
                                />
                                    <div className="invalid-feedback">
                                        {this.state.err.text}
                                    </div>
                                    <input type="submit" className="btn btn-large btn-secondary waves-light" value="Submit"/>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                {this.rowView(this.props.obj.comments)}
            </div>
        );
    }
}

export default Comments;