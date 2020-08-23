
import { Container, Typography } from "@material-ui/core";
import React from "react";
import "./DiningRoom.css";
import CollapsibleTablele from "./Table";

export default class DiningRoom extends React.Component {
    render() {
        return (
            <Container maxWidth="sm">
                <Typography variant="h3" gutterBottom align="center">
                    Dininig Room
                </Typography>
                <CollapsibleTablele />
            </Container>
        )
    }
}

