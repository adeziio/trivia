import React, { Component } from 'react';
import './../css/style.css';
import InputBar from './InputBar';
import QuizContent from './QuizContent';
import SpecialCharList from '../data/SpecialCharList';

export default class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],

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

    generateNewQuiz = (numberOfQuestions, category, difficulty, type) => {
        this.resetData();
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

    cleanUpChar = (str) => {
        let newStr = str;
        SpecialCharList.forEach((item) => {
            newStr = newStr.replaceAll(item.entity, item.char);
        })
        return newStr;
    }

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

    render() {
        const { data } = this.state;

        return (
            <div className="main-container">
                <div className="title-container">
                    <div className="title">Trivia Quiz</div>
                </div>
                <InputBar generateNewQuiz={this.generateNewQuiz} />
                <QuizContent data={data} resetData={this.resetData} setData={this.setData} />
            </div >
        )
    }
}