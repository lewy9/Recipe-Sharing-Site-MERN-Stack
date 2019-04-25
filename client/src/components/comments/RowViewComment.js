import React, {Component} from 'react';
import jwt_decode from 'jwt-decode';
import {Link} from 'react-router-dom';
import axios from 'axios';
import classnames from "classnames";

class RowViewComment extends Component {
    constructor(props) {
        super(props);
    }

    // Delete A comment
    delete = event => {
        event.preventDefault();
        axios
            .delete("/meals/comment/delete/" + this.props.obj.meal + "/" + this.props.obj._id)
            .then(res => {
                console.log(res.data.message);
                window.location.href = "/"+this.props.obj.meal;
            })
            .catch(error => console.log(error))
    };

    // Verify whether the user is the author of the comment
    isAuthor = () => {
        if(localStorage.token) {
            const decoded = jwt_decode(localStorage.token);
            return decoded.id === this.props.obj.user;
        }
        // It is a guest, grant nothing
        return false;
    };

    render() {
        return (
            <div className="card">
                <h5 className="card-header text-left">{this.props.obj.name}</h5>
                <div className="card-body">
                    <div className="alert alert-info text-left" role="alert">
                        {this.props.obj.text}
                    </div>
                    <Link to={"/edit/" + this.props.obj.meal +  "/" + this.props.obj._id} className={classnames("btn btn-primary", {"d-none": !this.isAuthor()})}>
                        Edit
                    </Link>
                    <a className={classnames("btn btn-danger", {"d-none": !this.isAuthor()})} href="" onClick={this.delete.bind(this)} >
                        Delete
                    </a>
                </div>
            </div>
        );
    }
}

export default RowViewComment;