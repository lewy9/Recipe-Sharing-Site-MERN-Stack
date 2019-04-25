import React, {Component} from 'react';
import axios from "axios";
import classnames from "classnames";
import {Link} from "react-router-dom";

class EditComment extends Component {
    constructor(props) {
        super(props);
        // initial state
        this.state = {
            text: "",
            err: {}
        };
    }

    // Pre fill the input box
    componentDidMount() {
        // Redirect users to login page when they try to go to add meal page without authority
        if(!localStorage.token)
            this.props.history.push("/login");
        else {
            axios
                .get("/meals/comment/" + this.props.match.params.id + "/" + this.props.match.params.commentId)
                .then(res => {
                    this.setState({
                        text: res.data.text,
                        err: res.data.err
                    })
                })
                .catch(error => console.log(error))
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
            .post("/meals/comment/edit/" + this.props.match.params.id + "/" + this.props.match.params.commentId, newComment)
            .then(res => {
                console.log(res.data.comments);

                // Back after comment being successfully edited
                window.location.href = "/" + this.props.match.params.id;
            })
            .catch(error => console.log(error));
    };

    render() {
        return (
            <div className="container">
                <Link to={"/" + this.props.match.params.id} className="btn btn-secondary waves-light">
                    Back
                </Link>
                <div className={classnames("m-auto col-md-10", {"d-none": !localStorage.token})}>
                    <div className="card">
                        <h5 className="card-header">Update Your Comment Here...</h5>
                        <div className="card-body">
                            <form onSubmit={this.onSubmit}>
                                <div className="form-group">
                                <textarea
                                    className="form-control z-depth-1"
                                    name="text"
                                    style={{"height": "150px"}}
                                    value={this.state.text}
                                    onChange={this.onChange}
                                    placeholder="Comment here..."
                                />
                                    <input type="submit" className="btn btn-large btn-secondary waves-light" value="Submit"/>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default EditComment;