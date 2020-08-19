import Dialog from "@material-ui/core/Dialog";
import MuiDialogActions from "@material-ui/core/DialogActions";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import axios from "axios";
import React, { Component } from "react";
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";
const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

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

export default class CustomizedDialogs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      formErrors: {
        name: "",
        calories: "",
        food_type: "",
      },
    };
  }

  snackbarRef = React.createRef();
  _showSnackbarHandler = (msg) => {
    console.log("_showSnackbarHandler");
    this.snackbarRef.current.openSnackBar(msg);
  };

  mySubmitHandler = (event) => {
    event.preventDefault();
    let path = `${process.env.REACT_APP_BE_URL}/dish/add`;
    console.log(this.props.idmenu);
    console.log(this.props.day_part);

    axios
      .get(path, {
        params: {
          name: this.state.name,
          calories: this.state.calories,
          food_type: this.state.food_type,
          idmenu: this.props.idmenu,
        },
      })
      .then((res) => {
        if (String(res.data) === "true") {
          this.toggleModal();
          this.setState({
            open: true,
          });
        } else {
          console.log("no snack");
        }
        console.log(this.state);
      });
    console.log("valid");
  };
  myChangeHandler = (event) => {
    event.preventDefault(); // maybe delete
    let stateName = `${event.target.id}`;
    let value = event.target.value;
    this.setState({
      [stateName]: event.target.value,
    });

    const name = stateName;
    let formErrors = { name: "", calories: "", food_type: "" };
    switch (name) {
      case "name":
        formErrors.name = value.length < 1 ? "must be more than 1" : "";

        if (value.length < 2) {
          formErrors.name = "must be more than 1";
        }
        if (value.match(/^[A-Za-zא-ת]+$/) == null) {
          formErrors.name = "can not conatin numbers";
        }
        break;

      case "food_type":
        if (value.length < 3) {
          formErrors.food_type = "must be more than 2";
        }
        if (value.match(/^[A-Za-zא-ת]+$/) == null) {
          formErrors.food_type = "can not conatin numbers";
        }
        break;

      case "calories":
        if (value.length < 0) {
          formErrors.food_type = "can not be empty";
        }
        if (value.match(/^[1-9]\d*$/) == null) {
          formErrors.calories = "can not start with 0";
        }
        break;

      default:
        break;
    }

    this.setState({ formErrors, [name]: value }, console.log(this.state));
  };

  toggleModal = (event) => {
    const { isOpen } = this.state;
    this.setState({
      isOpen: !isOpen,
    });
  };

  render() {
    const { formErrors } = this.state;
    return (
      <div>
        <AwesomeButton type="primary" onPress={this.toggleModal}>
          Add new dish
        </AwesomeButton>
        <Dialog
          onClose={this.toggleModal}
          aria-labelledby="customized-dialog-title"
          open={this.state.isOpen}
        >
          <form onSubmit={(e) => this.myChangeHandler(e)} target="#">
            <DialogContent dividers>
              <div>
                <h1 id="heading"> New Dish </h1>{" "}
                <Grid
                  container
                  direction="column"
                  justify="flex-start"
                  alignItems="baseline"
                >
                  <TextField
                    autoFocus
                    onChange={this.myChangeHandler}
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
                    onChange={this.myChangeHandler}
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
                    onChange={this.myChangeHandler}
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
              {/* <AwesomeButton
                type="primary"
                onPress={(e) => this.mySubmitHandler(e)}
              >
                Add dish
              </AwesomeButton> */}
              <button
                type="button"
                className="button"
                onClick={(e) => this.mySubmitHandler(e)}
              >
                Add dish
              </button>
            </DialogActions>
          </form>
        </Dialog>
        {/* <Snackbar ref={this.snackbarRef} /> */}
        <Snackbar
          autoHideDuration={3000}
          open={this.state.open}
          message={this.state.name + " added successfully"}
          onClose={() => {
            this.setState({ open: false });
          }}
        ></Snackbar>
      </div>
    );
  }
}
