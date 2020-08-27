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



const top100Films = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
  { title: 'The Lord of the Rings: The Return of the King', year: 2003 },
  { title: 'The Good, the Bad and the Ugly', year: 1966 },
  { title: 'Fight Club', year: 1999 },
  { title: 'The Lord of the Rings: The Fellowship of the Ring', year: 2001 },
  { title: 'Star Wars: Episode V - The Empire Strikes Back', year: 1980 },
  { title: 'Forrest Gump', year: 1994 },
  { title: 'Inception', year: 2010 },
  { title: 'The Lord of the Rings: The Two Towers', year: 2002 },
  { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { title: 'Goodfellas', year: 1990 },
  { title: 'The Matrix', year: 1999 },
  { title: 'Seven Samurai', year: 1954 },
  { title: 'Star Wars: Episode IV - A New Hope', year: 1977 },
  { title: 'City of God', year: 2002 },
  { title: 'Se7en', year: 1995 },
  { title: 'The Silence of the Lambs', year: 1991 },
  { title: "It's a Wonderful Life", year: 1946 },
  { title: 'Life Is Beautiful', year: 1997 },
  { title: 'The Usual Suspects', year: 1995 },
  { title: 'Léon: The Professional', year: 1994 },
  { title: 'Spirited Away', year: 2001 },
  { title: 'Saving Private Ryan', year: 1998 },
  { title: 'Once Upon a Time in the West', year: 1968 },
  { title: 'American History X', year: 1998 },
  { title: 'Interstellar', year: 2014 },
  { title: 'Casablanca', year: 1942 },
  { title: 'City Lights', year: 1931 },
  { title: 'Psycho', year: 1960 },
  { title: 'The Green Mile', year: 1999 },
  { title: 'The Intouchables', year: 2011 },
  { title: 'Modern Times', year: 1936 },
  { title: 'Raiders of the Lost Ark', year: 1981 },
  { title: 'Rear Window', year: 1954 },
  { title: 'The Pianist', year: 2002 },
  { title: 'The Departed', year: 2006 },
  { title: 'Terminator 2: Judgment Day', year: 1991 },
  { title: 'Back to the Future', year: 1985 },
  { title: 'Whiplash', year: 2014 },
  { title: 'Gladiator', year: 2000 },
  { title: 'Memento', year: 2000 },
  { title: 'The Prestige', year: 2006 },
  { title: 'The Lion King', year: 1994 },
  { title: 'Apocalypse Now', year: 1979 },
  { title: 'Alien', year: 1979 },
  { title: 'Sunset Boulevard', year: 1950 },
  { title: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb', year: 1964 },
  { title: 'The Great Dictator', year: 1940 },
  { title: 'Cinema Paradiso', year: 1988 },
  { title: 'The Lives of Others', year: 2006 },
  { title: 'Grave of the Fireflies', year: 1988 },
  { title: 'Paths of Glory', year: 1957 },
  { title: 'Django Unchained', year: 2012 },
  { title: 'The Shining', year: 1980 },
  { title: 'WALL·E', year: 2008 },
  { title: 'American Beauty', year: 1999 },
  { title: 'The Dark Knight Rises', year: 2012 },
  { title: 'Princess Mononoke', year: 1997 },
  { title: 'Aliens', year: 1986 },
  { title: 'Oldboy', year: 2003 },
  { title: 'Once Upon a Time in America', year: 1984 },
  { title: 'Witness for the Prosecution', year: 1957 },
  { title: 'Das Boot', year: 1981 },
  { title: 'Citizen Kane', year: 1941 },
  { title: 'North by Northwest', year: 1959 },
  { title: 'Vertigo', year: 1958 },
  { title: 'Star Wars: Episode VI - Return of the Jedi', year: 1983 },
  { title: 'Reservoir Dogs', year: 1992 },
  { title: 'Braveheart', year: 1995 },
  { title: 'M', year: 1931 },
  { title: 'Requiem for a Dream', year: 2000 },
  { title: 'Amélie', year: 2001 },
  { title: 'A Clockwork Orange', year: 1971 },
  { title: 'Like Stars on Earth', year: 2007 },
  { title: 'Taxi Driver', year: 1976 },
  { title: 'Lawrence of Arabia', year: 1962 },
  { title: 'Double Indemnity', year: 1944 },
  { title: 'Eternal Sunshine of the Spotless Mind', year: 2004 },
  { title: 'Amadeus', year: 1984 },
  { title: 'To Kill a Mockingbird', year: 1962 },
  { title: 'Toy Story 3', year: 2010 },
  { title: 'Logan', year: 2017 },
  { title: 'Full Metal Jacket', year: 1987 },
  { title: 'Dangal', year: 2016 },
  { title: 'The Sting', year: 1973 },
  { title: '2001: A Space Odyssey', year: 1968 },
  { title: "Singin' in the Rain", year: 1952 },
  { title: 'Toy Story', year: 1995 },
  { title: 'Bicycle Thieves', year: 1948 },
  { title: 'The Kid', year: 1921 },
  { title: 'Inglourious Basterds', year: 2009 },
  { title: 'Snatch', year: 2000 },
  { title: '3 Idiots', year: 2009 },
  { title: 'Monty Python and the Holy Grail', year: 1975 },
];
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
              {/* <Typography
                fxlayout="row"
                fxlayoutalign="space-between center"
                align="center"
                variant="h6"
                gutterBottom
              // component="div"
              > */}


              <div className="auto-complete">
                <AddDishDialog
                  idmenu={menu.idmenu}
                  day_part={menu.day_part}
                  logout={props.logout}
                  updateDishTable={props.updateDishTable}
                />
                <div className="auto-complete">
                  <Autocomplete
                    size="small"
                    id="combo-box-demo"
                    options={top100Films}
                    getOptionLabel={(option) => option.title}
                    style={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Combo box" variant="outlined" />}
                  />
                  <AwesomeButton>
                    add
               </AwesomeButton>
                </div>
              </div>
              {/* </Typography> */}
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
  readMenuData(chosen_date = null) {
    const path = `${process.env.REACT_APP_BE_URL}`;
    axios
      .get(path, {
        params: { chosen_date: chosen_date },
      })
      .then((res) => {
        if (this._isMounted) {
          this.setState({ menus: res.data });
          if (res.data.length === 0) {
            this.setState({ noMenuData: true })
          }
          else {
            this.setState({ noMenuData: false })
          }
        }
      }).catch(err => {
        if (err.response.status === 401 || err.response.status === 422) {
          this.props.logout()
        }
      });
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
  noMenuData() {
    return (
      <>
        <span className="no-menu-card">
          <div className="no-menu-msg">
            There is no menu for this date yet. <br />
                You can create one right now.
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
          <React.Fragment>
            <Datepicker readMenusFunc={this.readMenuData.bind(this)} />
          </React.Fragment>
          {this.state.noMenuData ? this.noMenuData() : this.tableContent()}
        </>
      );
    } else {
      return <></>
    }
  }
}
export default MenuTable;
