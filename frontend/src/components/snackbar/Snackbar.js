import React, { PureComponent } from "react";
import Styles from "./Snackbar.css";


// whem new dish is added to menu, show snackbar
export class Snackbar extends PureComponent {
  snackbarRef = React.createRef();
  message = "";
  state = {
    isActive: false,
  };
  openSnackBar = (message = "Something went wrong...") => {
    this.message = message;
    this.setState({ isActive: true }, () => {
      setTimeout(() => {
        this.setState({ isActive: false });
      }, 3000);
    });
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
