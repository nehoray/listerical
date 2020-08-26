import Dialog from "@material-ui/core/Dialog";
import MuiDialogActions from "@material-ui/core/DialogActions";
import MuiDialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import Snackbar from "@material-ui/core/Snackbar";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import React, { Component } from "react";
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";
import './AddDish.css';

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default class AddDish extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isError: false,
      formErrors: {
        name: "",
        calories: "",
        food_type: "",
      },
      isOpen: false
    };
  }

  snackbarRef = React.createRef();
  _showSnackbarHandler = (msg) => {
    this.snackbarRef.current.openSnackBar(msg);
  };

  onSubmit = (event) => {
    event.preventDefault();
    if (this.state.isError === false) {
      const path = `${process.env.REACT_APP_BE_URL}/dish`;
      const idmenu = this.props.idmenu

      // when creating to a new menu - this will be udefined. 
      if (idmenu) {
        const data = {
          name: this.state.name,
          calories: this.state.calories,
          food_type: this.state.food_type,
          idmenu: idmenu
        }
        const token = localStorage.getItem('jwt')
        const headers = {
          "Authorization": `Bearer ${token}`
        }
        axios
          .post(path, data, { headers: headers })
          .then((res) => {
            if (String(res.data) === "true") {
              this.toggleModal();
              this.setState({
                open: true,
              });
              this.props.updateDishTable()
            }
          }).catch(err => {
            if (err.response.status === 401 || err.response.status === 422) {
              this.props.logout()
            }
          });
      }
      // used in the addMenu dialog
      else {
        this.handleSubmitToParent()
        this.toggleModal();

      }
    };
  }

  // updates the state and validates form
  onChange = (event) => {
    event.preventDefault();
    const stateName = `${event.target.id}`;
    const value = event.target.value;
    this.setState({
      [stateName]: event.target.value,
    });
    const name = stateName;
    this.setState({ isError: this.validate(name, value,) })
  };

  validate(name, value) {
    let formErrors = { name: "", calories: "", food_type: "" };
    let error = false
    switch (name) {
      case "name":
        if (value.match(/^[A-Za-zא-ת]+$/) === null) {
          formErrors[name] = "can not conatin numbers";
          error = true
        } else if (value.length < 2) {
          formErrors[name] = "must be more than 1";
          error = true
        } else {
          error = false
        }
        break;

      case "food_type":
        if (value.match(/^[A-Za-zא-ת]+$/) === null) {
          formErrors[name] = "can not conatin numbers";
          error = true
        } else if (value.length < 3) {
          formErrors[name] = "must be more than 2";
          error = true
        } else {
          error = false
        }
        break;

      case "calories":
        if (value.length < 0) {
          formErrors[name] = "can not be empty";
          error = true
        } else if (value.match(/^[1-9]\d*$/) == null) {
          formErrors[name] = "can not start with 0";
          error = true
          break;
        } else {
          error = false
        }
    }
    this.setState({ formErrors, formErrors });
    return error
  }
  // if this component works as a child of addMenu component
  handleSubmitToParent() {
    if (this.props.onSubmit) {
      this.props.onSubmit(this.state)
    }

  }

  toggleModal = (event) => {
    const { isOpen } = this.state;
    this.setState({
      isOpen: !isOpen,
    });
  };
  // returns true if no errors
  checkForm() {
    const err = this.state.formErrors;
    return (err.name.length === 0 && err.food_type === 0 && err.calories === 0)
  }

  addNewDishButton() {
    const userType = localStorage.getItem('user_type')
    if (userType === 'admin') {
      return (
        <AwesomeButton type="primary" onPress={this.toggleModal}>
          Add dish
        </AwesomeButton>
      )
    }
  }


  render() {
    const { formErrors } = this.state;
    return (
      <div>
        {this.addNewDishButton()}
        <Dialog
          // maxWidth="maxWidth"
          onClose={this.toggleModal}
          aria-labelledby="customized-dialog-title"
          open={this.state.isOpen}
        >
          <form onSubmit={(e) => this.onChange(e)} target="#" className="dialog">
            <DialogContent dividers
            >
              <h1 id="heading"> New Dish </h1>{" "}
              <div>
                <Grid
                  container
                  direction="column"
                >
                  <TextField
                    autoFocus
                    onSubmit={this.handleSubmitToParent}
                    onChange={(e) => { this.onChange(e) }}
                    margin="dense"
                    id="name"
                    label="Dish name"
                    type="text"
                    inputProps={{
                      maxLength: 12,
                    }}
                  />
                  {formErrors.name.length > 0 && (
                    <span className="errorMessage">{formErrors.name}</span>
                  )}{" "}
                  <TextField
                    required
                    helponfocus="true"
                    onSubmit={this.handleSubmitToParent}
                    onChange={(e) => { this.onChange(e) }}
                    margin="dense"
                    id="food_type"
                    label="Food Type"
                    type="text"
                    inputProps={{
                      maxLength: 5,
                    }}
                  />{" "}
                  {formErrors.food_type.length > 0 && (
                    <span className="errorMessage">{formErrors.food_type}</span>
                  )}
                  <TextField
                    required
                    helponfocus="true"
                    onSubmit={this.handleSubmitToParent}
                    onChange={(e) => { this.onChange(e) }}
                    margin="dense"
                    id="calories"
                    label="Calories per 100 grams"
                    type="number"
                    inputProps={{
                      min: "0",
                    }}
                    onInput={(e) => {
                      e.target.value = e.target.value.slice(0, 5);
                    }}
                  />
                  {formErrors.calories.length > 0 && (
                    <span className="errorMessage">{formErrors.calories}</span>
                  )}
                </Grid>
              </div>
              {/*  */}
            </DialogContent>
            <DialogActions>
              <button
                type="button"
                className="button"
                onClick={(e) => { (this.checkForm() === false) ? this.onSubmit(e) : void (0) }}
              >
                Add dish
              </button>
            </DialogActions>
          </form>
        </Dialog>
        <Snackbar
          autoHideDuration={3000}
          open={this.state.open}
          message={this.state.name + " added successfully"}
          onClose={() => {
            this.setState({ open: false });
          }}
        ></Snackbar>
      </div >
    );
  }
}
