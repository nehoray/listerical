import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import React, { Component } from "react";
import "react-awesome-button/dist/styles.css";
import './AddDishForm.css';

export default class AddDishForm extends Component {
    constructor (props) {
        super(props);

        this.state = {
            formErrors: {
                name: "",
                calories: "",
                food_type: "",
            },
        };
    }

    myChangeHandler = (event) => {
        event.preventDefault(); // maybe delete
        let stateName = `${event.target.id}`;
        let value = event.target.value;
        this.setState({
            [stateName]: event.target.value,
        });

        const name = stateName;
        let formErrors = { name: "", calories: "", food_type: "" };
        switch (name) {
            case "name":
                formErrors.name = value.length < 1 ? "must be more than 1" : "";

                if (value.length < 2) {
                    formErrors.name = "must be more than 1";
                }
                if (value.match(/^[A-Za-zא-ת]+$/) == null) {
                    formErrors.name = "can not conatin numbers";
                }
                break;

            case "food_type":
                if (value.length < 3) {
                    formErrors.food_type = "must be more than 2";
                }
                if (value.match(/^[A-Za-zא-ת]+$/) == null) {
                    formErrors.food_type = "can not conatin numbers";
                }
                break;

            case "calories":
                if (value.length < 0) {
                    formErrors.food_type = "can not be empty";
                }
                if (value.match(/^[1-9]\d*$/) == null) {
                    formErrors.calories = "can not start with 0";
                }
                break;

            default:
                break;
        }

        this.setState({ formErrors, [name]: value });
    };

    render() {
        const { formErrors } = this.state;
        return (
            <div>
                <form onSubmit={(e) => this.myChangeHandler(e)} target="#" >
                    <div>
                        <h1 id="heading"> New Dish </h1>{" "}
                        <Grid
                            container
                            direction="column"
                            justify="flex-start"
                            alignItems="baseline"
                        >
                            <TextField
                                autoFocus
                                onChange={this.myChangeHandler}
                                margin="dense"
                                id="name"
                                label="Dish name"
                                type="text"
                                inputProps={{
                                    maxLength: 12,
                                }}
                            />
                            {formErrors.name.length > 0 && (
                                <span className="errorMessage">{formErrors.name}</span>
                            )}{" "}
                            <TextField
                                required
                                helponfocus="true"
                                onChange={this.myChangeHandler}
                                margin="dense"
                                id="food_type"
                                label="Food Type"
                                type="text"
                                inputProps={{
                                    maxLength: 5,
                                }}
                            />{" "}
                            {formErrors.food_type.length > 0 && (
                                <span className="errorMessage">{formErrors.food_type}</span>
                            )}
                            <TextField
                                required
                                helponfocus="true"
                                onChange={this.myChangeHandler}
                                margin="dense"
                                id="calories"
                                label="Calories per 100 grams"
                                type="number"
                                inputProps={{
                                    min: "0",
                                }}
                                onInput={(e) => {
                                    e.target.value = e.target.value.slice(0, 5);
                                }}
                            />
                            {formErrors.calories.length > 0 && (
                                <span className="errorMessage">{formErrors.calories}</span>
                            )}
                        </Grid>
                    </div>
                    {/*  */}

                    <DialogActions>
                        <button
                            type="button"
                            className="button"
                            onClick={(e) => this.mySubmitHandler(e)}
                        >
                            Add dish
                        </button>
                    </DialogActions>
                </form>
            </div>
        );
    }
}
