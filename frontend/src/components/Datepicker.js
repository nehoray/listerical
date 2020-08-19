import DateFnsUtils from "@date-io/date-fns";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import moment from "moment";
import React, { Fragment, useState } from "react";
function Datepicker(props) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  return (
    <Fragment>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DatePicker
          openTo="date"
          format="dd/MM/yyyy"
          minDate={moment().toDate()}
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
