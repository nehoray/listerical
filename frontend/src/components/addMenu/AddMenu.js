import Dialog from "@material-ui/core/Dialog";
import MuiDialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import axios from "axios";
import React, { Component } from "react";
import { AwesomeButton } from "react-awesome-button";
import AddDishDialog from '../addDish/AddDish';
import '../addMenu/AddMenu.css';

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

// Dialog of createing new menu
export default class AddMenuDialog extends Component {
    constructor (props) {
        super(props);
        this.state = {
            mealsTimes: {
                morning_start: '07:00',
                morning_end: '09:00',
                noon_start: '12:00',
                noon_end: '14:00',
                evening_start: '17:00',
                evening_end: '19:00'
            },
            formErrors: {
                timeError: ""
            },
            dishRow: []
            ,
            isOpen: false
        };

        this.removeDish = this.removeDish.bind(this)
        this.addDishToState = this.addDishToState.bind(this)

    }
    mealsNames = ['morning', 'noon', 'evening']

    // init state rigth after menu adding
    initState() {
        this.setState({
            mealsTimes: {
                morning_start: '07:00',
                morning_end: '09:00',
                noon_start: '12:00',
                noon_end: '14:00',
                evening_start: '17:00',
                evening_end: '19:00'
            },
        })
        this.setState({
            formErrors: {
                timeError: ""
            }
        })
        this.setState({ dishRow: [] })
    }

    // runs when add menu button is clicked
    SubmitHandler = (event) => {
        event.preventDefault();
        const path = `${process.env.REACT_APP_BE_URL}/menu`;
        const token = localStorage.getItem('jwt')
        const headers = {
            "Authorization": `Bearer ${token}`
        }
        // 'Content-Type': 'application/json',
        const data = {
            dishes: this.state.dishRow,
            meals_times: this.state.mealsTimes,
            menu_date: this.props.menuDate

        }
        axios
            .post(path, data, { headers: headers })
            .then((res) => {
                if (String(res.data) === "true") {
                    this.toggleModal();
                    this.initState()
                    this.setState({
                        open: true,
                    });
                    window.location.reload(false);
                }
            }).catch(err => {
                console.log(err)
                if (err.response.status === 401 || err.response.status === 422) {
                    this.props.logout()
                }
            });
    };

    // updates state every input change
    changeHandler = (event) => {
        event.preventDefault();
        const stateName = `${event.target.id}`;
        const value = event.target.value;
        let arr = this.state.mealsTimes
        arr[stateName] = value
        this.setState({
            mealsTimes: arr
        });
    };

    // adding a new dish to the menu state
    handleChildAddDish(childState, mealName) {
        const newDish = {
            name: childState.name,
            calories: childState.calories,
            food_type: childState.food_type,
            mealName: mealName
        }
        let updatedArr = this.state.dishRow
        updatedArr.push(newDish)

        this.setState({
            dishRow: updatedArr
        });
    }

    toggleModal = (event) => {
        const { isOpen } = this.state;
        this.setState({
            isOpen: !isOpen,
        });
    };

    // present the new dish every dish adding
    addDishToState(dishRow, mealName) {
        return (
            dishRow.map((dish) => {
                if (dish.mealName == mealName) {
                    return (
                        <React.Fragment key={mealName + dish.name}>
                            <div className="added-dish">
                                <div id="dish.name" type="text">{dish.name} ({dish.food_type}) with {dish.calories} calories (100 g)</div>
                                <IconButton className="delete" onClick={() => this.removeDish(dish.name, dishRow)}>
                                    <DeleteForeverIcon />
                                </IconButton>
                            </div>
                        </React.Fragment>
                    )
                }
            })
        )
    }

    // remove dish from state and from dialog
    removeDish(name, dishRow) {
        const removeIndex = dishRow.map(function (item) { return item.name }).indexOf(name)
        if (removeIndex > -1) {
            dishRow.splice(removeIndex, 1)
        }
        this.setState({ dishRow: dishRow })
    }

    // add menu button (cant see if not admin)
    addMenuButton() {
        const userType = localStorage.getItem('user_type')
        if (userType == 'admin') {
            return (
                <AwesomeButton type="primary" onPress={this.toggleModal}>
                    Add menu
                </AwesomeButton>
            )
        }
    }
    render() {
        const { formErrors } = this.state;
        return (
            <div >
                {this.addMenuButton()}
                <Dialog
                    onClose={this.toggleModal}
                    aria-labelledby="customized-dialog-title"
                    open={this.state.isOpen}
                >
                    <form onSubmit={(e) => this.changeHandler(e)} target="#">
                        <DialogContent dividers className="dialog" className="add-menu-dialog"
                        >
                            <div>
                                <h1 id="heading"> New Menu </h1>{" "}
                                <Grid
                                    container
                                    direction="column"
                                    justify="flex-start"
                                    alignItems="baseline"
                                >
                                    {this.mealsNames.map(mealName => {
                                        return (
                                            <div className="morning" key={mealName}>
                                                <div className="time-and-button">
                                                    <span className="meal-text">{mealName}:</span>
                                                    <TextField
                                                        onChange={this.changeHandler}
                                                        id={mealName + "_start"}
                                                        label="start"
                                                        type="time"
                                                        defaultValue={this.state.mealsTimes[mealName + "_start"]}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        inputProps={{
                                                            step: 300, // 5 min
                                                        }}
                                                    />
                                                    <span className="to-text"> To </span>
                                                    <TextField className="end-time"
                                                        onChange={this.changeHandler}
                                                        id={mealName + "_end"}
                                                        label="end"
                                                        type="time"
                                                        defaultValue={this.state.mealsTimes[mealName + "_end"]}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        inputProps={{
                                                            step: 300, // 5 min
                                                        }}
                                                    />
                                                    <AddDishDialog
                                                        onSubmit={(data) => this.handleChildAddDish(data, mealName)}
                                                    />
                                                </div>
                                                {/* adding new dish row onto the dialog each time user add new dish */}
                                                {this.addDishToState(this.state.dishRow, mealName)}
                                            </div>
                                        )
                                    }
                                    )}
                                </Grid>
                            </div>
                            <button
                                type="button"
                                className="button"
                                onClick={(e) => this.SubmitHandler(e)}
                            >
                                Submit meun
                            </button>
                        </DialogContent>
                    </form>
                </Dialog>
            </div>
        );
    }
}
