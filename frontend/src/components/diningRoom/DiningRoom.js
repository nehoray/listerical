
import { Container, Typography } from "@material-ui/core";
import React from "react";
import MenuTablele from "../table/Table";
import "./DiningRoom.css";

// main component
export default class DiningRoom extends React.Component {

    _isMounted = false
    username = ''
    jwt = ''

    // check if user logged  in, if not - move to login
    componentDidMount() {
        this._isMounted = true;
        this.username = localStorage.getItem('username')
        this.jwt = localStorage.getItem('jwt');
        if (!this.username || !this.jwt) {
            this.logout()
        }
    }

    logout() {
        localStorage.removeItem('username')
        localStorage.removeItem('jwt')
        localStorage.removeItem('user_type')
        this.props.history.push('/login')
    }
    render() {
        return (
            <Container maxWidth="sm">
                <div className="hello">Hello {localStorage.getItem('username')}
                    <a href="/login" className="logout" onClick={(e) => this.logout()}>Logout</a>
                </div>
                <Typography variant="h3" gutterBottom align="center">
                    Dininig Room
                </Typography>
                <MenuTablele />
            </Container>
        )
    }
}

