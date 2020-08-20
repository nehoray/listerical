import DateFnsUtils from "@date-io/date-fns";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import "axios";
import moment from "moment";
import React, { Fragment, useState } from "react";
// change to get all dates with data
// function disableWeekends(date) {
//   console.log(date);
//   // return goodDates.includes(date);
// }
function Datepicker(props) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // let path = `${process.env.REACT_APP_BE_URL}/menus/dates`;
  // let goodDates;
  // axios.get(path).then((res) => {
  //   goodDates = res.data;
  // });
  // console.log(goodDates);

  return (
    <Fragment>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DatePicker
          // shouldDisableDate={disableWeekends}
          openTo="date"
          format="dd/MM/yyyy"
          minDate={moment().toDate()}
          filterDate={(date) => {
            return moment().add(1, "days").calendar() > date;
          }}
          label="Choose Date"
          views={["year", "month", "date"]}
          selected={selectedDate}
          value={selectedDate}
          onChange={(dateSelected) => {
            setSelectedDate(dateSelected);
            var dateObject = new Date(dateSelected);
            var dateRes = new Intl.DateTimeFormat("en-GB")
              .format(dateObject)
              .split("/")
              .reverse()
              .join("-");
            props.readMenusFunc(dateRes);
          }}
          dateformat="dd/MM/yyyy"
        />{" "}
      </MuiPickersUtilsProvider>
    </Fragment>
  );
}
export default Datepicker;
