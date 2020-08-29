import { TextField } from '@material-ui/core';
import axios from "axios";
import React from "react";
import "./loginForm.css";

export class LoginForm extends React.Component {
    constructor () {
        super()
        this.state = {
            username: "",
            password: "",
            error: '',
            isLoading: false
        }
        this.onSubmit = this.onSubmit.bind(this)
        this.onChange = this.onChange.bind(this)
    }


    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 0;
    }

    onSubmit(event) {
        event.preventDefault();
        const path = `${process.env.REACT_APP_BE_URL}/login`;
        const data = {
            username: this.state.username,
            password: this.state.password
        }
        axios
            .post(path, data)
            .then((res) => {
                if (res['status'] === 200) {
                    // TODO: better with redux
                    localStorage.setItem('user_type', res['data']['user_type'])
                    localStorage.setItem('jwt', res['data']['access_token'])
                    localStorage.setItem('username', this.state.username)
                    this.props.history.push('/');
                }
                else {
                    this.setState({ error: "User name or password do not match" })
                }
            });
    }

    onChange = (event) => {
        event.preventDefault();
        const stateName = `${event.target.id}`;
        this.setState({
            [stateName]: event.target.value,
        });
    };

    render() {
        return (
            <div className="Login" >

                <form onSubmit={this.onSubmit} className="form">
                    <h3 className="sign-in">Sign In</h3>
                    <div className="hello">Hello guest</div>

                    <TextField
                        type="text"
                        required
                        helponfocus="true"
                        margin="dense"
                        id="username"
                        label="User Name"
                        onChange={(e) => { this.onChange(e) }}
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
                        onChange={(e) => { this.onChange(e) }}
                        inputProps={{
                            maxLength: 10,
                        }}
                    />
                    <button className="button" type="submit" disabled={this.isLoading}>Sign In</button>
                    <div className="error">{this.state.error}</div>
                </form>
            </div >
        )
    }
}

export default LoginForm