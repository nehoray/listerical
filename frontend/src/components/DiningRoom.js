
import { Container, Typography } from "@material-ui/core";
import React from "react";
import "./DiningRoom.css";
import CollapsibleTablele from "./Table";

export default class DiningRoom extends React.Component {

    _isMounted = false
    username = ''
    jwt = ''

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
        this.props.history.push('/login')
    }
    render() {
        return (
            <Container maxWidth="sm">
                <div className="hello">Hello {this.username}
                    <a href="/login" className="logout" onClick={(e) => this.logout()}>Logout</a>
                </div>
                <Typography variant="h3" gutterBottom align="center">
                    Dininig Room
                </Typography>
                <CollapsibleTablele />
            </Container>
        )
    }
}

