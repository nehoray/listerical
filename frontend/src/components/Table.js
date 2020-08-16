import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
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

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

function Row(props) {
  const menu = props.row;
  console.log(menu.dishes);
  // console.log(this.state.menus);
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="center">{menu.day_part}</TableCell>
        <TableCell align="center">
          {menu.start_time} to {menu.end_time}{" "}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography
                align="left"
                variant="h6"
                gutterBottom
                component="div"
              >
                Dishes
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Dish Name</TableCell>
                    <TableCell align="center">Food Type Base</TableCell>
                    <TableCell align="center">calories per 100 gram</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {menu.dishes.map((dish) => (
                    <TableRow key={dish.iddish}>
                      <TableCell align="center" component="th" scope="row">
                        {dish.name}
                      </TableCell>
                      <TableCell align="center">
                        {dish.food_type_base}
                      </TableCell>
                      <TableCell align="center">
                        {dish.calories_per_100_grams}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export class CollapsibleTable extends Component {
  state = {
    menus: [],
  };

  componentDidMount() {
    axios.get(`${process.env.REACT_APP_BE_URL}/opennighours`).then((res) => {
      const menus = res.data;
      this.setState({ menus });
    });
  }
  render() {
    return (
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell align="center">Meal</TableCell>
              <TableCell align="center">Service Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.menus.map((menu) => (
              <Row key={menu.idmenu} row={menu} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}
export default CollapsibleTable;
