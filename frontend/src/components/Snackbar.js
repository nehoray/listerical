import React, { PureComponent } from "react";
import Styles from "./Snackbar.css";

export class Snackbar extends PureComponent {
  snackbarRef = React.createRef();

  message = "";

  state = {
    isActive: false,
  };

  openSnackBar = (message = "Something went wrong...") => {
    console.log("snack starts");

    this.message = message;
    this.setState({ isActive: true }, () => {
      setTimeout(() => {
        this.setState({ isActive: false });
      }, 3000);
    });
    console.log("snack is done");
  };

  render() {
    const { isActive } = this.state;
    return (
      <div
        className={
          isActive ? [Styles.snackbar, Styles.show].join(" ") : Styles.snackbar
        }
      >
        {this.message}
      </div>
    );
  }
}
