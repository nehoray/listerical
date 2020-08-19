import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import axios from "axios";
import React, { Component } from "react";
import CustomizedDialogs from "./AddDish";
import Datepicker from "./Datepicker";
const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

function Row(props) {
  const menu = props.row;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <StyledTableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </StyledTableCell>
        <StyledTableCell align="center">
          {menu.day_part} {menu.idmenu}
        </StyledTableCell>
        <StyledTableCell align="center">
          {menu.start_time} to {menu.end_time}
        </StyledTableCell>
      </TableRow>
      <TableRow>
        <StyledTableCell
          style={{
            paddingBottom: 0,
            paddingTop: 0,
          }}
          colSpan={6}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography
                fxlayout="row"
                fxlayoutalign="space-between center"
                align="center"
                variant="h6"
                gutterBottom
                // component="div"
              >
                <Grid
                  container
                  direction="row"
                  justify="space-between"
                  alignItems="center"
                >
                  Dishes:{" "}
                  <CustomizedDialogs
                    idmenu={menu.idmenu}
                    day_part={menu.day_part}
                  />
                </Grid>
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">Dish Name</StyledTableCell>
                    <StyledTableCell align="center">
                      Food Type Base
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      calories per 100 gram
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {menu.dishes.map((dish) => (
                    <StyledTableRow key={dish.iddish}>
                      <StyledTableCell
                        align="center"
                        component="th"
                        scope="row"
                      >
                        {dish.name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {dish.food_type_base}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {dish.calories_per_100_grams}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </StyledTableCell>
      </TableRow>
    </React.Fragment>
  );
}

export class CollapsibleTable extends Component {
  state = {
    menus: [],
  };
  componentDidMount() {
    this.readMenuData();
  }

  // 2 uses: 1.for default render. 2. for datepicker
  readMenuData(chosen_date = null) {
    let path = `${process.env.REACT_APP_BE_URL}/opennighours`;
    axios
      .get(path, {
        params: { chosen_date: chosen_date },
      })
      .then((res) => {
        let defaultData = [
          {
            day_part: "morning",
            dishes: [],
            end_time: "Not set",
            idmenu: 0,
            start_time: "Not set",
          },
          {
            day_part: "noon",
            dishes: [],
            end_time: "not set",
            idmenu: 0,
            start_time: "not set",
          },
          {
            day_part: "evening",
            dishes: [],
            idmenu: 0,
            end_time: "not set",
            start_time: "not set",
          },
        ];
        // empty response
        if (res.data.length === 0) {
          this.setState({
            menus: defaultData,
          });
          console.log("res.data.length === 0 |  state is :");
          console.log(this.state);
          // response with data
        } else {
          this.setState({ menus: res.data });
          console.log("res.data.length > 0 |  state is :");
          console.log(this.state);
        } // else
      });
  }

  render() {
    return (
      <TableContainer component={Paper}>
        <React.Fragment>
          <Datepicker readMenusFunc={this.readMenuData.bind(this)} />
        </React.Fragment>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <StyledTableCell />
              <StyledTableCell align="center">Meal</StyledTableCell>
              <StyledTableCell align="center">Service Time</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.menus.map((menu) => (
              <Row key={menu.day_part} row={menu} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}
export default CollapsibleTable;
