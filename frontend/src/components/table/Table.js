import { TextField } from '@material-ui/core';
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Autocomplete from '@material-ui/lab/Autocomplete';
import axios from "axios";
import { Component, default as React } from "react";
import { AwesomeButton } from "react-awesome-button";
import AddDishDialog from "../addDish/AddDish";
import AddMenuDialog from '../addMenu/AddMenu';
import Datepicker from '../datepicker/Datepicker';
import './Table.css';


let allDbDishes;
const path = `${process.env.REACT_APP_BE_URL}/dishes`;
axios
  .get(path)
  .then((res) => {
    allDbDishes = res['data']
  })
  .catch((e) => {
    console.error("e");
  });

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

  // let menu = props.row;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();
  const [isValueSelected, setIsValueSelected] = React.useState(false);
  const [menu, setMenu] = React.useState(props.row)
  const [selected, setSelected] = React.useState(0);
  let presentedDishes = []
  // make sure user wont choose an existion dish
  const menuDishedIds = menu.dishes.map(dish => dish.iddish)

  console.log(allDbDishes)
  presentedDishes = allDbDishes ? allDbDishes.filter(dish => !menuDishedIds.includes(dish.iddish)) : presentedDishes

  function onChange(value) {
    setSelected(value)
    setIsValueSelected(true)
  }

  function onAdd(idmenu, mealName) {

    // if not alreay in menu
    const dish = menu.dishes.find(dish => dish.name === selected.name)
    const dishIndex = menu.dishes.indexOf(dish)
    if (dishIndex < 0) {
      // adding to state
      let newDishes = menu.dishes
      newDishes.push(selected)
      menu.dishes = newDishes
      setMenu(menu)
      // add to db
      const path = `${process.env.REACT_APP_BE_URL}/menu/dish`;
      const data = {
        name: selected.name,
        calories: selected.calories_per_100_grams,
        food_type: selected.food_type_base,
        idmenu: idmenu,
        iddish: selected.iddish
      }
      const token = localStorage.getItem('jwt')
      const headers = {
        "Authorization": `Bearer ${token}`
      }
      axios
        .post(path, data, { headers: headers })
        .then((res) => {
          if (String(res.data) !== "false") {
            props.updateDishTable() // use the state to show user the change - works
          }
        }, (err) => {
          this.props.logout()
        })
    }
  }

  function addDishBar() {
    const userType = localStorage.getItem('user_type')
    if (userType === 'admin') {
      return (
        <div className="auto-complete">
          <Autocomplete
            size="small"
            id="combo-box-demo"
            disableClearable
            onChange={(e, value) => onChange(value)}
            options={presentedDishes}
            getOptionLabel={(option) => `${option.name}`}
            style={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Choose dish" variant="outlined" />}
          />
          <AwesomeButton disabled={!isValueSelected} onPress={(e) => { onAdd(menu.idmenu, menu.day_part) }}>
            Add Chosen Dish
               </AwesomeButton>
        </div>
      )
    }
  }

  // rendering the Row component
  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <StyledTableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => { if (allDbDishes !== undefined || open) { setOpen(!open) } }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </StyledTableCell>
        <StyledTableCell align="center">{menu.day_part}</StyledTableCell>
        <StyledTableCell align="center">
          {menu.start_time
            ? `${menu.start_time} to ${menu.end_time}`
            : "To be determined"}
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
              {addDishBar()}
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

// main table component
export class MenuTable extends Component {
  state = {
    menus: [],
  };
  _isMounted = false;

  componentDidMount() {
    this._isMounted = true
    this.readMenuData();
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  // 2 uses: 1.for default render. 2. for datepicker choices
  readMenuData(chosen_date = null, resetState = false) {
    const path = `${process.env.REACT_APP_BE_URL}`;
    axios
      .get(path, {
        params: { chosen_date: chosen_date },
      })
      .then((res) => {
        if (this._isMounted) {
          if (resetState) {
            this.setState({ menus: [] });
          }
          this.setState({ menus: res['data'] });
          if (res.data.length === 0) {
            this.setState({ noDataView: true })
          }
          else {
            this.setState({ noDataView: false })
          }
        }
      }, (err) => {
        this.props.logout()
      })
    chosen_date = chosen_date ? chosen_date : new Date()

    // for adding menu dialog
    if (this._isMounted) {
      this.setState({ menuDate: chosen_date })
    }
  }

  // main menu table
  tableContent() {
    return (
      <TableContainer className="menu-table" component={Paper}>
        <Table aria-label="collapsible table" >
          <TableHead>
            <TableRow>
              <StyledTableCell />
              <StyledTableCell align="center">Meal</StyledTableCell>
              <StyledTableCell align="center">Service Time</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.menus.map((menu) => (
              <Row logout={this.props.logout} key={menu.day_part} row={menu} updateDishTable={this.readMenuData.bind(this)} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }

  // if no menu data for present day show this.
  noDataView() {
    return (
      <>
        <span className="no-menu-card">
          <div className="no-menu-msg">
            There is no menu for this date yet.
            </div>
          <AddMenuDialog logout={this.props.logout} menuDate={this.state.menuDate} readMenusFunc={this.readMenuData.bind(this)} />
        </span>
      </>
    )
  }

  render() {
    if (this._isMounted) {
      return (
        <>
          <div className="top-bar">
            <React.Fragment>
              <Datepicker readMenusFunc={this.readMenuData.bind(this)} />
            </React.Fragment>
            <AddDishDialog reRenderTable={this.readMenuData.bind(this)} logout={this.props.logout}

            />
          </div>
          {this.state.noDataView ? this.noDataView() : this.tableContent()}
        </>
      );
    } else {
      return <></>
    }
  }
}
export default MenuTable;
