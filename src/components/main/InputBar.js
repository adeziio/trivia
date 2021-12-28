import React, { Component } from 'react';
import './InputBar.css';
import CategoryOptions from "../inputOptions/CategoryOptions";
import DifficultyOptions from "../inputOptions/DifficultyOptions";
import TypeOptions from "../inputOptions/TypeOptions";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';

export default class InputBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            numberOfQuestions: 10,
            category: 0,
            difficulty: "easy",
            type: "multiple"
        }
    }

    handleNumberOfQuestionsChange = (event) => {
        this.setState({
            numberOfQuestions: event.target.value
        })
    }

    handleCategoryChange = (event) => {
        this.setState({
            category: event.target.value
        })
    };

    handleDifficultyChange = (event) => {
        this.setState({
            difficulty: event.target.value
        })
    };

    handleTypeChange = (event) => {
        this.setState({
            type: event.target.value
        })
    };

    generateNewQuiz = () => {
        const { numberOfQuestions, category, difficulty, type } = this.state;
        this.props.generateNewQuiz(numberOfQuestions, category, difficulty, type);
    }

    render() {
        const { numberOfQuestions, category, difficulty, type } = this.state;
        return (
            <div className="input-container">
                <Box
                    component="form"
                    sx={{
                        '& > :not(style)': { m: 1, width: '25ch' },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <TextField id="outlined-basic" label="Number of Questions" variant="outlined" onChange={this.handleNumberOfQuestionsChange} value={numberOfQuestions} />
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Category</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={category}
                            label="Category"
                            onChange={this.handleCategoryChange}
                        >
                            {
                                CategoryOptions.map((item, index) => {
                                    return (
                                        <MenuItem key={index} value={item.value}>{item.name}</MenuItem>
                                    )
                                })
                            }
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Difficulty Level</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={difficulty}
                            label="Difficulty Level"
                            onChange={this.handleDifficultyChange}
                        >
                            {
                                DifficultyOptions.map((item, index) => {
                                    return (
                                        <MenuItem key={index} value={item.value}>{item.name}</MenuItem>
                                    )
                                })
                            }
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Type</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={type}
                            label="Type"
                            onChange={this.handleTypeChange}
                        >
                            {
                                TypeOptions.map((item, index) => {
                                    return (
                                        <MenuItem key={index} value={item.value}>{item.name}</MenuItem>
                                    )
                                })
                            }
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <Button variant="contained" onClick={this.generateNewQuiz}>Generate Quiz</Button>
                        {numberOfQuestions === '' ? <p className="error-msg">Missing Required Field</p> :
                            isNaN(this.state.numberOfQuestions) ? <p className="error-msg">Invalid Input</p> : null}
                    </FormControl>
                </Box>
            </div>
        )
    }
}