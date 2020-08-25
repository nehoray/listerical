import DateFnsUtils from "@date-io/date-fns";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import "axios";
import axios from "axios";
import React, { Component, Fragment } from "react";
import '../datepicker/datepicker.css';
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

    let user_type = localStorage.getItem('user_type')
    let isEmpty = !this.state.goodDates.includes(this.convert(date));
    let now = new Date(Date.now()).setHours(0, 0, 0, 0)
    let curDate = (new Date(date)).getTime()
    let isPast = curDate < now

    if (user_type == 'admin') { // see all future so he can add menus
      return isPast == true // disabled past
    } else {
      return isPast || isEmpty // disabled past and empty
    }
  }

  convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
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
