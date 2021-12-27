import React, { Component } from 'react';
import './Home.css';
import CategoryOptions from "./inputOptions/CategoryOptions";
import DifficultyOptions from "./inputOptions/DifficultyOptions";
import TypeOptions from "./inputOptions/TypeOptions";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';

import MobileStepper from '@mui/material/MobileStepper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';


export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            numberOfQuestions: 10,
            category: 0,
            difficulty: "easy",
            type: "multiple",
            data: [],
            activeStep: 0,
            score: 0,
            showResult: false
        }
    }

    resetQuiz = () => {
        this.setState({
            data: [],
            activeStep: 0,
            score: 0,
            showResult: false
        })
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

    handleNext = () => {
        this.setState((prevState) => ({
            activeStep: prevState.activeStep + 1
        }))
    }

    handleBack = () => {
        this.setState((prevState) => ({
            activeStep: prevState.activeStep - 1
        }))
    }

    generateNewQuiz = () => {
        this.resetQuiz();
        if (this.state.numberOfQuestions !== '') {
            let url = `https://opentdb.com/api.php?amount=${this.state.numberOfQuestions}&category=${this.state.category}&difficulty=${this.state.difficulty}&type=${this.state.type}`;
            fetch(url, {
                "method": "GET",
            })
                .then(response => response.json())
                .then(resData => {
                    this.setState({
                        data: resData.results
                    }, () => {
                        this.createChoices();
                        this.massageQuestion();
                    })
                })
        }
    }

    createChoices = () => {
        let newData = [];
        this.state.data.forEach((item) => {
            let choices = [...item.incorrect_answers];
            choices.push(item.correct_answer);
            choices.sort((a, b) => 0.5 - Math.random());
            item.choices = choices;
            newData.push(item);
        })
        this.setState({
            data: newData
        })
    }

    massageQuestion = () => {
        let newData = [];
        this.state.data.forEach((item) => {
            let newQuestion = item.question.replaceAll("&quot;", "\"");
            newQuestion = newQuestion.replaceAll("&#039;", "'");
            item.question = newQuestion;
            newData.push(item);
        })
        this.setState({
            data: newData
        })
    }

    chosenAnswer = (e) => {
        let newData = this.state.data;
        newData[this.state.activeStep].chosenAnswer = e.target.value;
        this.setState({
            data: newData
        })
    }

    submitQuiz = () => {
        let newScore = 0;
        this.state.data.forEach((item) => {
            if (item.chosenAnswer === item.correct_answer) {
                newScore += 1;
            }
        })
        this.setState({
            score: newScore,
            showResult: true
        })
    }

    render() {
        const { numberOfQuestions, category, difficulty, type, data, activeStep, showResult, score } = this.state;
        const maxSteps = data.length;

        return (
            <div className="main-container">
                <div className="title-container">
                    <div className="title">Trivia Quiz</div>
                </div>
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
                                    CategoryOptions.map((item) => {
                                        return (
                                            <MenuItem value={item.value}>{item.name}</MenuItem>
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
                                    DifficultyOptions.map((item) => {
                                        return (
                                            <MenuItem value={item.value}>{item.name}</MenuItem>
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
                                    TypeOptions.map((item) => {
                                        return (
                                            <MenuItem value={item.value}>{item.name}</MenuItem>
                                        )
                                    })
                                }
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <Button variant="contained" onClick={this.generateNewQuiz}>Generate Quiz</Button>
                            {numberOfQuestions === '' ? <p className="error-msg">Missing Required Field</p> : null}
                        </FormControl>
                    </Box>
                </div>
                {data.length > 0 ?
                    <div className="quiz-container">
                        <div className="quiz-card">
                            <Box sx={{ width: "100%", height: 400, flexGrow: 1 }}>
                                <div className="quiz-header">
                                    <div><div className="same-line bold">Category: </div><div className="same-line italicized">{data[activeStep].category}</div></div>
                                    <div><div className="same-line bold"> Difficulty Level: </div><div className="same-line italicized">{data[activeStep].difficulty}</div></div>
                                    <div><div className="same-line bold">Type: </div><div className="same-line italicized">{data[activeStep].type}</div></div>
                                </div>

                                <div className="quiz-content">

                                    <FormLabel color="info" focused>
                                        <div className="quiz-question">
                                            {data[activeStep].question}
                                        </div>
                                    </FormLabel>
                                    <RadioGroup
                                        name="radio-buttons-group"
                                        onChange={this.chosenAnswer}
                                    >
                                        {data[activeStep].choices ?
                                            data[activeStep].choices.map((choice) =>
                                                <FormControlLabel value={choice} control={<Radio />} label={choice} />
                                            ) : null
                                        }


                                    </RadioGroup>

                                </div>
                            </Box>
                            <MobileStepper
                                variant="text"
                                steps={maxSteps}
                                position="static"
                                activeStep={activeStep}
                                nextButton={
                                    <Button size="small" onClick={this.handleNext} disabled={activeStep === maxSteps - 1}>
                                        Next
                                        <KeyboardArrowRight />
                                    </Button>
                                }
                                backButton={
                                    <Button size="small" onClick={this.handleBack} disabled={activeStep === 0}>
                                        <KeyboardArrowLeft />
                                        Back
                                    </Button>
                                }
                            />
                            <Button variant="contained" onClick={this.submitQuiz}> Submit </Button>
                        </div>

                        {
                            showResult ? <div className="quiz-card">
                                <Box sx={{ width: 200, height: 200, flexGrow: 1 }}>
                                    <div className="quiz-header">
                                        <div><div className="same-line bold">Your Results: </div><div className="same-line italicized">{`${score} / ${maxSteps}`}</div></div>
                                    </div>
                                </Box>
                            </div> : null
                        }

                    </div > : null
                }
            </div >
        )
    }

}
