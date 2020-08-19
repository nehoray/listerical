import Dialog from "@material-ui/core/Dialog";
import MuiDialogActions from "@material-ui/core/DialogActions";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import axios from "axios";
import React, { Component } from "react";
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";
import { Snackbar } from "./Snackbar";

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
    // this.mySubmitHandler = this.mySubmitHandler.bind(this);

    this.state = {
      isOpen: false,
      name: "",
      calories: "",
      food_type: "",
      idmenu: 0,
    };
  }

  // TODO: fix snack
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
          day_part: this.props.day_part,
        },
      })
      .then((res) => {
        if (String(res.data) === "true") {
          //// TODO: fix snack
          this._showSnackbarHandler(this.state.name + " added successfully");
          console.log("snack");
          this.toggleModal();
        } else {
          console.log("no snack");
        }
        console.log(this.state);
      });
  };
  myChangeHandler = (event) => {
    let stateName = `${event.target.id}`;
    this.setState({
      [stateName]: event.target.value,
    });
  };

  toggleModal = (event) => {
    const { isOpen } = this.state;
    this.setState({
      isOpen: !isOpen,
    });
  };

  render() {
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
          <form onSubmit={this.mySubmitHandler}>
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
                    onChange={this.myChangeHandler}
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Dish name"
                    type="text"
                    inputProps={{
                      maxLength: 20,
                    }}
                  />{" "}
                  <TextField
                    onChange={this.myChangeHandler}
                    autoFocus
                    margin="dense"
                    id="food_type"
                    label="Food Type"
                    type="text"
                    inputProps={{
                      maxLength: 5,
                    }}
                  />{" "}
                  <TextField
                    autoFocus
                    onChange={this.myChangeHandler}
                    margin="dense"
                    id="calories"
                    label="calories per 100 grams"
                    type="number"
                    inputProps={{
                      min: "0",
                    }}
                    onInput={(e) => {
                      e.target.value = e.target.value.slice(0, 5);
                    }}
                  />
                </Grid>
              </div>
              {/*  */}
            </DialogContent>
            <DialogActions>
              <AwesomeButton
                type="primary"
                onPress={(e) => this.mySubmitHandler(e)}
              >
                Add dish
              </AwesomeButton>
            </DialogActions>
          </form>
        </Dialog>
        <Snackbar ref={this.snackbarRef} />
      </div>
    );
  }
}
