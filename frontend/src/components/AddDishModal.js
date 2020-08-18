import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import React, { Component } from "react";
import Modal from "react-modal";
import { Snackbar } from "./Snackbar";

export class AddDishModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      name: "",
      calories: "",
      food_type: "",
    };
  }

  snackbarRef = React.createRef();

  _showSnackbarHandler = (msg) => {
    this.snackbarRef.current.openSnackBar(msg);
  };

  mySubmitHandler = (event) => {
    event.preventDefault();
    let path = `${process.env.REACT_APP_BE_URL}/dish/add`;
    axios
      .get(path, {
        params: {
          name: this.state.name,
          calories: this.state.calories,
          food_type: this.state.food_type,
        },
      })
      .then((res) => {
        if (String(res.data) === "true") {
          this._showSnackbarHandler(this.state.name + " added successfully");
          this.toggleModal();
        }
      });
  };
  myChangeHandler = (event) => {
    //console.log(event.target.value);
    console.log(event.target.id);
    let stateName = `${event.target.id}`;
    this.setState({ [stateName]: event.target.value });
  };

  toggleModal = (event) => {
    const { isOpen } = this.state;
    this.setState({ isOpen: !isOpen });
  };

  render() {
    const { isOpen } = this.state;

    return (
      <div>
        <Button
          className="add-dish-button"
          variant="contained"
          color="primary"
          onClick={this.toggleModal}
        >
          Add new dish
        </Button>

        <Modal
          dialogClassName="custom-dialog"
          id="modal_with_forms"
          isOpen={isOpen}
          shouldCloseOnOverlayClick={true}
          onRequestClose={this.toggleModal}
          aria={{
            labelledby: "heading",
            describedby: "fulldescription",
          }}
        >
          <h1 id="heading">New Dish</h1>
          <div id="fulldescription" tabIndex="0" role="document">
            <form onSubmit={this.mySubmitHandler}>
              <TextField
                onChange={this.myChangeHandler}
                autoFocus
                margin="dense"
                id="name"
                label="Dish name"
                type="text"
                inputProps={{ maxLength: 20 }}
              />
              <TextField
                onChange={this.myChangeHandler}
                autoFocus
                margin="dense"
                id="food_type"
                label="Food Type"
                type="text"
                inputProps={{ maxLength: 5 }}
              />
              <TextField
                autoFocus
                onChange={this.myChangeHandler}
                margin="dense"
                id="calories"
                label="calories per 100 grams"
                type="number"
                inputProps={{ min: "0" }}
                onInput={(e) => {
                  e.target.value = e.target.value.slice(0, 5);
                }}
              />
              <Button variant="contained" color="primary" type="submit">
                Primary
              </Button>
            </form>
          </div>
        </Modal>
        <Snackbar ref={this.snackbarRef} />
      </div>
    );
  }
}

export default AddDishModal;
