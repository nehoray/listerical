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
import "react-awesome-button/dist/styles.css";
import AddDishDialog from './AddDish';
import './AddMenu.css';

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);



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
        };

        this.removeDish = this.removeDish.bind(this)

        this.addDishToState = this.addDishToState.bind(this)

    }
    mealsNames = ['morning', 'noon', 'evening']

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
        console.log(this.state)


    }
    mySubmitHandler = (event) => {
        event.preventDefault();
        console.log('adding menu')
        console.log(this.state)
        console.log(this.props.menuDate)
        let path = `${process.env.REACT_APP_BE_URL}/menu/add`;

        console.log(this.state)
        axios
            .get(path, {
                params: {
                    dishes: this.state.dishRow,
                    meals_times: this.state.mealsTimes,
                    menu_date: this.props.menuDate
                },
            })
            .then((res) => {
                if (String(res.data) === "true") {
                    this.toggleModal();
                    this.initState()
                    this.setState({
                        open: true,
                    });
                    console.log('menu add')
                } else {
                    // TODO:
                    console.log("Error");
                }
            });
    };

    // editing meals times inside state
    changeHandler = (event) => {
        event.preventDefault();
        let stateName = `${event.target.id}`;
        let value = event.target.value;
        let arr = this.state.mealsTimes
        arr[stateName] = value
        this.setState({
            mealsTimes: arr
        });
    };

    handleChildAddDish(childState, mealName) {
        // console.log('i am parent printinig child data:')
        // console.log(childState)
        let newDish = {
            name: childState.name,
            calories: childState.calories,
            food_type: childState.food_type,
            mealName: mealName
        }
        let updatedArr = this.state.dishRow
        updatedArr.push(newDish)
        // this.setState(prevState => ({
        //     dishRow: [...prevState.dishRow, newDish]
        // }))

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

    addDishToState(dishRow, mealName) {
        return (
            dishRow.map((dish) => {
                if (dish.mealName == mealName) {
                    return (
                        <React.Fragment>
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
    removeDish(name, dishRow) {
        let removeIndex = dishRow.map(function (item) { return item.name }).indexOf(name)
        let updatedDishRow
        if (removeIndex > -1) {
            updatedDishRow = dishRow.splice(removeIndex)
        }
        this.setState({ dishRow: updatedDishRow })
    }

    render() {
        const { formErrors } = this.state;
        return (
            <div>
                <AwesomeButton type="primary" onPress={this.toggleModal}>
                    Add menu
                </AwesomeButton>
                <Dialog
                    onClose={this.toggleModal}
                    aria-labelledby="customized-dialog-title"
                    open={this.state.isOpen}
                >
                    <form onSubmit={(e) => this.changeHandler(e)} target="#" >
                        <DialogContent dividers className="dialog"
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
                                            <div className="morning">
                                                <div className="time-and-button">
                                                    <text className="meal-text">{mealName}:</text>
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
                                                    <text className="to-text"> To </text>
                                                    <TextField
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
                                                {/* {this.state.dishRow.map(function (dish) {
                                                    if (dish.mealName == mealName) {
                                                        return (
                                                            <React.Fragment>
                                                                <div className="added-dish">
                                                                    <div id="dish.name" type="text">{dish.name} ({dish.food_type}) with {dish.calories} calories (100 g)</div>
                                                                    <IconButton className="delete" onClick={this.removeDish(dish.name)}>
                                                                        <DeleteForeverIcon />
                                                                    </IconButton>
                                                                </div>
                                                            </React.Fragment>

                                                        )
                                                    }
                                                })} */}
                                            </div>
                                        )
                                    }
                                    )}
                                </Grid>
                            </div>
                            {/*  */}
                            <button
                                type="button"
                                className="button"
                                onClick={(e) => this.mySubmitHandler(e)}
                            >
                                Submit meun
                            </button>
                        </DialogContent>
                    </form>
                </Dialog>
                {/* <Snackbar
                    autoHideDuration={3000}
                    open={this.state.open}
                    message={this.state.name + " added successfully"}
                    onClose={() => {
                        this.setState({ open: false });
                    }}
                ></Snackbar> */}
            </div>
        );
    }
}
