import React, {Component} from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import RowViewMeal from './RowViewMeal';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            meals: []
        };
    }

    componentDidMount() {
        axios
            .get("/meals")
            .then(res => {
                this.setState({
                    meals: res.data
                })
            })
            .catch(error => console.log(error));
    }

    // Display all the meals as a list of rows
    rowView = (meals = []) => {
        return meals.map((obj, idx) => {
            return <RowViewMeal obj={obj} key={idx} />;
        })
    };

    render() {
        return (
            <div className="container">
                {localStorage.token? <h4 className="float-left">Welcome, {jwt_decode(localStorage.token).username}</h4>: ""}

                <h3>Newest Meals</h3>
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
                        {this.rowView(this.state.meals)}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Home;