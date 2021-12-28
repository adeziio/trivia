import React, { Component } from 'react';
import './Main.css';
import InputBar from './InputBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MobileStepper from '@mui/material/MobileStepper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';

export default class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            activeStep: 0,
            score: 0,
            showResult: false,
            disabledChoices: false
        }
    };

    resetQuiz = () => {
        this.setState({
            data: [],
            activeStep: 0,
            score: 0,
            showResult: false,
            disabledChoices: false
        })
    };

    handleNext = () => {
        this.setState((prevState) => ({
            activeStep: prevState.activeStep + 1
        }))
    };

    handleBack = () => {
        this.setState((prevState) => ({
            activeStep: prevState.activeStep - 1
        }))
    };

    generateNewQuiz = (numberOfQuestions, category, difficulty, type) => {
        this.resetQuiz();
        if (numberOfQuestions !== '' && !isNaN(numberOfQuestions)) {
            let url = `https://opentdb.com/api.php?amount=${numberOfQuestions}&category=${category}&difficulty=${difficulty}&type=${type}`;
            fetch(url, {
                "method": "GET",
            })
                .then(response => response.json())
                .then(resData => {
                    this.setState({
                        data: resData.results,
                    }, () => {
                        this.createChoices();
                        this.massageQuestion();
                    })
                })
        }
    };

    createChoices = () => {
        let newData = [];
        this.state.data.forEach((item) => {
            let choices = [...item.incorrect_answers];
            choices.push(item.correct_answer);
            choices.sort((a, b) => 0.5 - Math.random());
            item.choices = item.type === "boolean" ? ["True", "False"] : choices;
            newData.push(item);
        })
        this.setState({
            data: newData
        })
    };

    massageQuestion = () => {
        let newData = [];
        this.state.data.forEach((item) => {
            let newQuestion = item.question.replaceAll("&quot;", "\"");
            newQuestion = newQuestion.replaceAll("&#039;", "'");
            newQuestion = newQuestion.replaceAll("&eacute;", "é");
            newQuestion = newQuestion.replaceAll("&rsquo;", "'");
            newQuestion = newQuestion.replaceAll("&amp;", "&");
            item.question = newQuestion;
            newData.push(item);
        })
        this.setState({
            data: newData
        })
    };

    chosenAnswer = (e) => {
        let newData = this.state.data;
        newData[this.state.activeStep].chosenAnswer = e.target.value;
        newData[this.state.activeStep].isCorrect = e.target.value === newData[this.state.activeStep].correct_answer ? true : false;
        this.setState({
            data: newData
        })
    };

    submitQuiz = () => {
        let newScore = 0;
        this.state.data.forEach((item) => {
            if (item.chosenAnswer === item.correct_answer) {
                newScore += 1;
            }
        })
        this.setState({
            score: newScore,
            showResult: true,
            disabledChoices: true
        })
    };

    render() {
        const { data, activeStep, showResult, score, disabledChoices } = this.state;
        const maxSteps = data.length;

        return (
            <div className="main-container">
                <div className="title-container">
                    <div className="title">Trivia Quiz</div>
                </div>
                <InputBar generateNewQuiz={this.generateNewQuiz} />
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
                                        value={data[activeStep].chosenAnswer ? data[activeStep].chosenAnswer : ""}
                                    >
                                        {data[activeStep].choices ?
                                            data[activeStep].choices.map((choice) =>
                                                <FormControlLabel
                                                    value={choice}
                                                    control={<Radio />}
                                                    label={choice}
                                                    checked={data[activeStep].chosenAnswer === choice ? true : false}
                                                    disabled={disabledChoices}
                                                />
                                            ) : null
                                        }
                                    </RadioGroup>
                                    {disabledChoices && !data[activeStep].isCorrect ? <div className="italicized error">{`Correct Answer: ${data[activeStep].correct_answer}`}</div> : null}
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
                                <Box sx={{ width: 200, height: 50, flexGrow: 1 }}>
                                    <div className="quiz-header">
                                        <div><div className="same-line bold">Your Score: </div><div className="same-line italicized">{`${(score / maxSteps) * 100}%`}</div></div>
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