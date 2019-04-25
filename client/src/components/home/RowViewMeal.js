import React, {Component} from 'react';
import jwt_decode from 'jwt-decode';
import {Link} from 'react-router-dom';
import axios from 'axios';
import classnames from "classnames";

class RowViewMeal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            liked: false
        }
    }

    componentDidMount() {
        if(localStorage.token) {
            axios
                .post("/users/fav/" + this.props.obj._id)
                .then(res => {
                    this.setState({
                        liked: res.data.success
                    });
                })
        }
    }

    // add a meal to favorites
    likeIt = event => {
        event.preventDefault();
        axios
            .post("/users/fav/add/" + this.props.obj._id)
            .then(res => {
                window.location.href = "/";
            })
            .catch(error => console.log(error))
    };

    // remove a meal from favorties
    unlikeIt = event => {
        event.preventDefault();
        axios
            .delete("/users/fav/delete/" + this.props.obj._id)
            .then(res => {
                window.location.href = "/";
            })
            .catch(error => console.log(error))
    };

    // Delete A meal
    delete = event => {
        event.preventDefault();
        axios
            .delete("/meals/delete/" + this.props.obj._id)
            .then(res => {
                console.log(res.data.message);
                window.location.href = "/";
            })
            .catch(error => console.log(error))
    };

    // Verify whether the user is the author of the meal
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
            <tr>
                <td>
                    {this.props.obj.title}
                </td>
                <td>
                    {this.props.obj.name}
                </td>
                <td>
                    {this.props.obj.date}
                </td>
                <td>
                    <Link to={"/" + this.props.obj._id} className="btn btn-primary">
                        View
                    </Link>
                    <Link to={"/edit/" + this.props.obj._id} className={classnames("btn btn-primary", {"d-none": !this.isAuthor()})}>
                        Edit
                    </Link>
                    <a className={classnames("btn btn-danger", {"d-none": !this.isAuthor()})} href="" onClick={this.delete.bind(this)} >
                        Delete
                    </a>
                    <a className={classnames("btn btn-secondary", {"d-none": !localStorage.token || this.state.liked})} href="" onClick={this.likeIt.bind(this)} >
                        Like
                    </a>
                    <a className={classnames("btn btn-secondary", {"d-none": !localStorage.token || !this.state.liked})} href="" onClick={this.unlikeIt.bind(this)} >
                        Un-like
                    </a>
                </td>
            </tr>
        );
    }
}

export default RowViewMeal;