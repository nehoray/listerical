import DateFnsUtils from "@date-io/date-fns";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import "axios";
import axios from "axios";
import moment from 'moment';
import React, { Component, Fragment } from "react";

class Datepicker extends Component {
  constructor (props) {
    super(props);
    // this.disableDates = this.disableDates.bind(this);

    this.state = {
      selectedDate: new Date(),
      goodDates: [],
    };
  }

  componentDidMount() {
    let path = `${process.env.REACT_APP_BE_URL}/menus/dates`;
    axios
      .get(path)
      .then((res) => {
        this.setState({ goodDates: res.data });
      })
      .catch((e) => {
        console.error("e");

      });
  }

  disableDates(date) {
    return !this.state.goodDates.includes(this.convert(date));
  }

  convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }
  render() {
    return (
      <Fragment>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker
            shouldDisableDate={(date) => {
              return this.disableDates(date);
            }}
            openTo="date"
            format="dd/MM/yyyy"
            minDate={moment().toDate()}
            label="Choose Date"
            views={["year", "month", "date"]}
            selected={this.state.selectedDate}
            value={this.state.selectedDate}
            onChange={(dateSelected) => {
              this.setState({
                selectedDate: dateSelected,
              });
              var dateObject = new Date(dateSelected);
              var dateRes = new Intl.DateTimeFormat("en-GB")
                .format(dateObject)
                .split("/")
                .reverse()
                .join("-");
              this.props.readMenusFunc(dateRes);
            }}
            dateformat="dd/MM/yyyy"
          />
        </MuiPickersUtilsProvider>
      </Fragment>
    );
  }
}
export default Datepicker;
