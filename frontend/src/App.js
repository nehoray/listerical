import { Container, Typography } from "@material-ui/core";
import React, { Component } from "react";
import "./App.css";
import CollapsibleTablele from "./components/Table";
class App extends Component {
  render() {
    return (
      <Container maxWidth="sm">
        <Typography variant="h3" gutterBottom align="center">
          Dininig Room
        </Typography>
        <CollapsibleTablele />
      </Container>
    );
  }
}
export default App;
