import React, { Component } from 'react';
import './../css/style.css';
import InputBar from './InputBar';
import QuizContent from './QuizContent';
import SpecialCharList from '../data/SpecialCharList';
import CircularProgress from '@mui/material/CircularProgress';

export default class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isLoading: false
        }
    };

    resetData = () => {
        this.setState({
            data: []
        })
    }

    setData = (data) => {
        this.setState({
            data: data
        })
    }

    setIsloading = (bool) => {
        this.setState({
            isLoading: bool
        })
    }

    generateNewQuiz = (numberOfQuestions, category, difficulty, type) => {
        this.resetData();
        this.setIsloading(true);
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
                        this.massageChoices();
                        this.setIsloading(false);
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
        this.setData(newData);
    };

    massageQuestion = () => {
        let newData = [];
        this.state.data.forEach((item) => {
            let newQuestion = this.cleanUpChar(item.question);
            item.question = newQuestion;
            newData.push(item);
        })
        this.setData(newData);
    };

    massageChoices = () => {
        let newData = [];
        this.state.data.forEach((item) => {

            let newChoices = [];
            item.choices.forEach((choice) => {
                let newChoice = this.cleanUpChar(choice);
                newChoices.push(newChoice);
            })
            item.choices = newChoices;

            let newQuestion = this.cleanUpChar(item.question);
            item.question = newQuestion;

            newData.push(item);
        })
        this.setData(newData);
    }

    cleanUpChar = (str) => {
        let newStr = str;
        SpecialCharList.forEach((item) => {
            newStr = newStr.replaceAll(item.entity, item.char);
        })
        return newStr;
    }

    render() {
        const { data, isLoading } = this.state;

        return (
            <div className="main-container">
                <div className="title-container">
                    <div className="title" onClick={() => window.location.reload()}>Trivia Quiz</div>
                </div>
                <InputBar generateNewQuiz={this.generateNewQuiz} />
                {isLoading ? <CircularProgress className="loading" /> : <QuizContent data={data} setData={this.setData} />}
            </div >
        )
    }
}