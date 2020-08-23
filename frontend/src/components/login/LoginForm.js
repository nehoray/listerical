import login from '';
import { TextField } from '@material-ui/core';
import React from "react";
import connect from 'react-redux';
import "./loginForm.css";
export class LoginForm extends React.Component {
    constructor () {
        super()
        this.state = {
            username: "",
            password: "",
            errors: {},
            isLoading: false
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.changeHandler = this.handleSubmit.bind(this)
    }


    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 0;
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log(this.state)
        this.setState({ errors: {}, isLoading: true })
        this.props.login(this.state).then(
            (res) => this.context.router.push('/'),
            (err) => this.setState({ errors: err.data.errors, isLoading: false })
        )

    }

    changeHandler = (event) => {
        event.preventDefault();
        let stateName = `${event.target.id}`;
        let value = event.target.value;
        this.setState({
            [stateName]: event.target.value,
        });
    };

    render() {
        const { errors, username, password, isLoading } = this.state
        return (
            <div className="Login" >

                <form onSubmit={this.handleSubmit} className="form">
                    <h3>Sign In</h3>
                    <TextField
                        type="text"
                        required
                        helponfocus="true"
                        margin="dense"
                        id="username"
                        label="User Name"
                        type="text"
                        onChange={(e) => { this.changeHandler(e) }}
                        inputProps={{
                            maxLength: 10,
                        }}
                    />
                    <TextField
                        type="password"
                        required
                        helponfocus="true"
                        margin="dense"
                        id="password"
                        label="Password"
                        onChange={(e) => { this.changeHandler(e) }}
                        inputProps={{
                            maxLength: 10,
                        }}
                    />

                    <button type="submit" disabled={isLoading}>sumnit</button>
                </form>
            </div >
        )
    }
}

LoginForm.propType = {
    login: React.PropTypes.func.isRequired
}

LoginForm.contextType = {
    router: React.propsTypes.object.isRequired
}
export default connect(null, { login })(LoginForm)