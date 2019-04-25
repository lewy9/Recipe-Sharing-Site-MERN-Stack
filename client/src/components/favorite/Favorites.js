import React, {Component} from 'react';
import axios from 'axios';
import RowViewFav from './RowViewFav';
import jwt_decode from "jwt-decode";

class Favorites extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fav: []
        }
    }

    componentDidMount() {
        axios
            .get("/users/fav")
            .then(res => {
                this.setState({
                    fav: res.data
                })
            })
            .catch(error => console.log(error));
    }

    // Display all the meals as a list of rows
    rowView = (fav = []) => {
        return fav.map((obj, idx) => {
            return <RowViewFav obj={obj} key={idx} />;
        })
    };

    render() {
        return (
            <div className="container">
                {localStorage.token? <h4 className="float-left">Welcome, {jwt_decode(localStorage.token).username}</h4>: ""}

                <h3>Favorites</h3>
                <table className="table table-hover">
                    <thead>
                    <tr>
                        <th scope="col">Title</th>
                        <th scope="col">Author</th>
                        <th scope="col">Date</th>
                        <th scope="col">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.rowView(this.state.fav)}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Favorites;