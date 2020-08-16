import { Container, Typography } from "@material-ui/core";
import axios from "axios";
import React, { Component } from "react";
import "./App.css";
import Table from "./components/Table";

const api = axios.create({
  baseURL: "http://127.0.0.1:5000",
});
class App extends Component {
  constructor() {
    super();
    api.get("/").then((res) => {
      console.log(res.data);
    });
  }
  render() {
    return (
      <Container maxWidth="sm">
        <Typography variant="h3" gutterBottom>
          Dininig Room
        </Typography>
        <Table />;
      </Container>
    );
  }
}
export default App;
