import { Dialog, Grid, TextField } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Autocomplete from '@material-ui/lab/Autocomplete';
import axios from "axios";
import React, { Component } from "react";
import { AwesomeButton } from "react-awesome-button";
import '../addMenu/AddMenu.css';


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
            dishRow: [],
            isOpen: false,
            isSelectedmorning: false,
            isSelectednoon: false,
            isSelectevening: false,
            selectedmorning: {},
            selectednoon: {},
            selectedevening: {}
        };

        this.removeDish = this.removeDish.bind(this)
        this.addDishToState = this.addDishToState.bind(this)

        // get all dishes for combos
        this.allDbDishes = [];
        const path = `${process.env.REACT_APP_BE_URL}/dishes`;
        axios
            .get(path)
            .then((res) => {
                this.allDbDishes = res['data']
            })
            .catch((e) => {
                console.error("e");
            });
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

    // runs when add-menu button is clicked
    onSubmit = (event) => {
        event.preventDefault();
        const path = `${process.env.REACT_APP_BE_URL}/menu`;
        const token = localStorage.getItem('jwt')
        const headers = {
            "Authorization": `Bearer ${token}`
        }
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
                    this.props.readMenusFunc(this.props.menuDate)
                }
                // if token is not valid
            }, (err) => {
                this.props.logout()
            })
    };

    // updates times state every input change
    onChange = (event) => {
        event.preventDefault();
        const stateName = `${event.target.id}`;
        const value = event.target.value;
        let arr = this.state.mealsTimes
        arr[stateName] = value
        this.setState({
            mealsTimes: arr
        });
    };

    toggleModal = (event) => {
        const { isOpen } = this.state;
        this.setState({
            isOpen: !isOpen,
        });
        this.setState({ dishRow: [] })
    };

    // present the new dish every dish adding
    addDishToState(mealName, dishRow) {
        return (
            dishRow.map((dish) => {
                if (dish.mealName === mealName) {
                    return (
                        <React.Fragment key={mealName + dish.name}>
                            <div className="added-dish">
                                <div id="dish.name" type="text">{dish.name} ({dish.food_type}) with {dish.calories} calories (100 g)</div>
                                <IconButton className="delete" onClick={() => this.removeDish(dish.name, mealName)}>
                                    <DeleteForeverIcon />
                                </IconButton>
                            </div>
                        </React.Fragment>
                    )
                } else {
                    return <></>
                }
            })
        )
    }

    // remove dish from state and from dialog
    removeDish(name, mealName) {
        const dishToRemove = this.state.dishRow.find(dish => dish.name === name && dish.mealName === mealName)
        const removeIndex = this.state.dishRow.indexOf(dishToRemove)
        let newDishRow = this.state.dishRow
        if (removeIndex > -1) {
            newDishRow.splice(removeIndex, 1)
        }
        this.setState({ dishRow: newDishRow })
    }

    // add menu button (cant see if not admin)
    addMenuButton() {
        const userType = localStorage.getItem('user_type')
        if (userType === 'admin') {
            return (
                <AwesomeButton type="primary" onPress={this.toggleModal}>
                    Add menu
                </AwesomeButton>
            )
        }
    }

    // set the state of the meal
    async onComboChange(value, meal) {
        const selectedMeal = `selected${meal}`
        const isSelected = `isSelected${meal}`
        await this.setState({
            [selectedMeal]: value
        })
        await this.setState({
            [isSelected]: true
        })
    }

    // adding a new dish to the menu state - onPress (add)
    updateMenuState(meal) {
        const selectedMealState = this.state[`selected${meal}`]
        // check if not in state already
        const dish = this.state.dishRow.find(dish => dish.name === selectedMealState.name && dish.mealName === meal)
        if (dish === undefined) {
            const newDish = {
                name: selectedMealState.name,
                calories: selectedMealState.calories_per_100_grams,
                food_type: selectedMealState.food_type_base,
                iddish: selectedMealState.iddish,
                mealName: meal
            }
            let updatedArr = this.state.dishRow
            updatedArr.push(newDish)
            this.setState({
                dishRow: updatedArr
            });
        }
    }

    // rendering the button and the dialog of add-menu dialog
    render() {
        return (
            <div >
                {this.addMenuButton()}
                <Dialog
                    onClose={this.toggleModal}
                    aria-labelledby="customized-dialog-title"
                    open={this.state.isOpen}
                    className="dialog"
                >
                    <form onSubmit={(e) => this.onChange(e)} target="#" className="form">
                        <div className="add-menu-dialog"
                        >
                            <div>
                                <h1 id="heading"> New Menu </h1>{" "}
                                <Grid
                                    container
                                    direction="column"
                                    justify="flex-start"
                                    alignItems="baseline"
                                >
                                    {/* make 3 rows on the form (morning, noon, evening) */}
                                    {this.mealsNames.map(mealName => {
                                        return (
                                            <div className="meal-row" key={mealName}>

                                                <div className="text-and-time">
                                                    <span className="meal-text">{mealName}:</span>
                                                    <TextField
                                                        onChange={this.onChange}
                                                        id={mealName + "_start"}
                                                        label="start"
                                                        type="time"
                                                        defaultValue={this.state.mealsTimes[mealName + "_start"]}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        inputProps={{
                                                            step: 60,
                                                        }}
                                                    />
                                                    <span className="to-text"> To </span>
                                                    <TextField className="end-time"
                                                        onChange={this.onChange}
                                                        id={mealName + "_end"}
                                                        label="end"
                                                        type="time"
                                                        defaultValue={this.state.mealsTimes[mealName + "_end"]}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        inputProps={{
                                                            step: 60,
                                                        }}
                                                    />
                                                </div>
                                                <div className="combo-and-new-dishes">
                                                    <div className="combo-and-button">
                                                        <Autocomplete
                                                            size="small"
                                                            id={"combo-box-" + mealName}
                                                            disableClearable
                                                            onChange={(e, value) => { this.onComboChange(value, mealName); this.setState({ isSelected: true }) }}
                                                            options={this.allDbDishes}
                                                            getOptionLabel={(option) => `${option.name} `}
                                                            style={{ width: 300 }}
                                                            renderInput={(params) => <TextField {...params} label="Choose dish" variant="outlined" />}
                                                        />
                                                        <AwesomeButton id={mealName + "btn"} onPress={(e) => { this.updateMenuState(mealName) }} disabled={!this.state[`isSelected${mealName}`]}>
                                                            add
                                                        </AwesomeButton>
                                                    </div>
                                                    {this.addDishToState(mealName, this.state.dishRow)}
                                                </div>
                                            </div>
                                        )
                                    }
                                    )}
                                </Grid>
                            </div>
                            <button
                                type="button"
                                className="button"
                                onClick={(e) => this.onSubmit(e)}
                            >
                                Submit Menu
                            </button>
                        </div>
                    </form>
                </Dialog>
            </div >
        );
    }
}
