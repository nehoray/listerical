import DateFnsUtils from "@date-io/date-fns";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import React, { Fragment, useState } from "react";

function Datepicker(props) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Fragment>
        <DatePicker
          openTo="date"
          format="dd/MM/yyyy"
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
        />
      </Fragment>{" "}
    </MuiPickersUtilsProvider>
  );
}
export default Datepicker;
