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
        this.handleSubmit = this.handleSubmit.bind(this)
        this.changeHandler = this.changeHandler.bind(this)
    }


    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 0;
    }

    handleSubmit(event) {
        event.preventDefault();
        // send req to be get jwt
        let path = `${process.env.REACT_APP_BE_URL}/login`;
        const data = {
            username: this.state.username,
            password: this.state.password
        }
        axios
            .post(path, data)
            .then((res) => {
                console.log(res)
                if (res['status'] == 200) {
                    console.log('code 200')
                    // setting the jwt in localStorage
                    localStorage.setItem('jwt', res['data']['access_token'])
                    localStorage.setItem('username', this.state.username)
                    this.props.history.push('/');

                }
                else {
                    this.setState({ error: "User name or password do not match" })
                    console.log(this.state.error)
                }
                console.log('111111')
                console.log(res['data'])
            });
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
        return (
            <div className="Login" >

                <form onSubmit={this.handleSubmit} className="form">
                    <h3 className="sign-in">Sign In</h3>
                    <div className="hello">Hello guest</div>

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

                    <button className="button" type="submit" disabled={this.isLoading}>Sign In</button>
                    <div className="error">{this.state.error}</div>
                </form>
            </div >
        )
    }
}

export default LoginForm