import React, {Component} from 'react';
import axios from 'axios';
import Comments from '../comments/Comments';
import classnames from "classnames";

class MealView extends Component {
    constructor(props) {
        super(props);
        // initial state
        this.state = {
            title: "",
            name: "",
            category: "",
            region: "",
            instructions: "",
            comments: [],
            object: {}
        }
    }

    componentDidMount() {
        axios
            .get('/meals/' + this.props.match.params.id)
            .then(res => {
                this.setState({
                    title: res.data.title,
                    name: res.data.name,
                    category: res.data.category,
                    region: res.data.region,
                    instructions: res.data.instructions,
                    comments: res.data.comments,
                    object: res.data
                })
            })
            .catch(error => console.log(error));
    }

    render() {
        return (
            <div className="container">
                <div className="m-auto col-md-8">
                    <h3>{this.state.title}</h3>
                    <p className="text-monospace">By {this.state.name}</p><br/>
                    <div className="badge badge-primary text-wrap float-left" >
                        {this.state.category}
                    </div>
                    <div className="badge badge-primary text-wrap float-right">
                        {this.state.region}
                    </div><br/>
                    <h4 className="float-left">Instructions: </h4><br/><br/>
                    <textarea
                        readOnly
                        className="text-monospace"
                        style={{"height": "300px", "width": "600px"}}
                        value={this.state.instructions}
                    />
                </div>
                <br/>
                <div>
                    <h3 className="float-left">Comment: </h3><br/><br/>
                    <Comments obj={this.state.object} />
                </div>
            </div>
        );
    }
}

export default MealView;