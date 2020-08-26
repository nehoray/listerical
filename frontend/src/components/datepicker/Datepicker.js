import DateFnsUtils from "@date-io/date-fns";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import "axios";
import axios from "axios";
import React, { Component, Fragment } from "react";
import '../datepicker/datepicker.css';

// allow user to choose menus by dates
class Datepicker extends Component {
  constructor (props) {
    super(props);
    this.disableDates = this.disableDates.bind(this);
    this.state = {
      selectedDate: new Date(),
      goodDates: [],
    };
  }


  componentDidMount() {
    const path = `${process.env.REACT_APP_BE_URL}/menus/dates`;
    axios
      .get(path)
      .then((res) => {
        // goodDates - dates with menu data 
        this.setState({ goodDates: res.data });
      })
      .catch((e) => {
        console.error("e");
      });
  }

  // disabling dates according to user type
  disableDates(date) {
    const user_type = localStorage.getItem('user_type')
    const isEmpty = !this.state.goodDates.includes(this.convert(date));
    const now = new Date(Date.now()).setHours(0, 0, 0, 0)
    const curDate = (new Date(date)).getTime()
    const isPast = curDate < now

    if (user_type === 'admin') {
      return isPast === true // disabled past
    } else {
      return isPast || isEmpty // disabled past and empty
    }
  }

  convert(str) {
    const date = new Date(str),
      month = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), month, day].join("-");
  }

  render() {
    return (
      <Fragment >
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker className="datepicker"
            shouldDisableDate={(date) => {
              return this.disableDates(date);
            }}
            openTo="date"
            format="dd/MM/yyyy"
            label="Choose Date"
            views={["year", "month", "date"]}
            selected={this.state.selectedDate}
            value={this.state.selectedDate}
            onChange={(dateSelected) => {
              this.setState({
                selectedDate: dateSelected,
              });
              const dateObject = new Date(dateSelected);
              const dateRes = new Intl.DateTimeFormat("en-GB")
                .format(dateObject)
                .split("/")
                .reverse()
                .join("-");
              // show the data of the newly created menu
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
