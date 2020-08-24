
import { Container, Typography } from "@material-ui/core";
import React from "react";
import "./DiningRoom.css";
import CollapsibleTablele from "./Table";

export default class DiningRoom extends React.Component {


    username = localStorage.getItem('username');
    jwt = localStorage.getItem('jwt');
    componentWillUnmount() {
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
                    <a className="logout" onClick={(e) => this.logout()}>Logout</a>
                </div>
                <Typography variant="h3" gutterBottom align="center">
                    Dininig Room
                </Typography>
                <CollapsibleTablele />
            </Container>
        )
    }
}

