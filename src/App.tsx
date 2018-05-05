import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import Button from 'material-ui/Button';
import Card, { CardContent } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import * as React from 'react';

import './App.css';
import { convertNumberToKanji } from './KanjiService';
import { getSpeechSynthesis, speakJapanese } from './TextToSpeechService';

interface IWorksheetProblem {
  question: string;
  answer: string;
  answerVisible: boolean;
}

interface IAppComponentState {
  problems: IWorksheetProblem[];
  listeningMode: boolean;
}

class App extends React.Component<{}, IAppComponentState> {

  constructor(props: {}, ctx?: {}) {
    super(props, ctx);

    this.state = {
      listeningMode: false,
      problems: []
    };

    // Binding the event handlers to make sure 'this' always
    // refers to this component.
    this.onClickProblem = this.onClickProblem.bind(this);
    this.onClickShowAnswers = this.onClickShowAnswers.bind(this);
    this.onClickHideAnswers = this.onClickHideAnswers.bind(this);
    this.onClickListeningModeToggle = this.onClickListeningModeToggle.bind(this);
    this.onClickProblemPlayButton = this.onClickProblemPlayButton.bind(this);
  }

  // ====================================================
  // COMPONENT LIFECYCLE HANDLERS
  // ====================================================

  public componentDidMount() {
    // Generate random numbers
    const randNums = this.generateRandomNumbers(1000, 30);
    // Map random numbers to WorksheetProblem
    const problems = randNums.map((inputNum) => ({
      answer: inputNum.toString(),
      answerVisible: false,
      question: convertNumberToKanji(inputNum)
    }));

    // Show worksheet problems
    this.setState({ problems });

    // Call this function to make sure voices are loaded before
    // user plays them.
    getSpeechSynthesis().getVoices();
  }

  // ====================================================
  // EVENT HANDLERS
  // ====================================================

  public onClickProblem(problemIndex: number) {
    this.setState((prevState) => ({
      ...prevState,
      problems: prevState.problems.map(
        (prob, idx) => idx === problemIndex ? { ...prob, answerVisible: !prob.answerVisible } : prob
      )
    }));
  }

  public onClickShowAnswers() {
    this.setState((prevState) => ({
      ...prevState,
      problems: prevState.problems.map((problem) => ({ ...problem, answerVisible: true }))
    }));
  }

  public onClickHideAnswers() {
    this.setState((prevState) => ({
      ...prevState,
      problems: prevState.problems.map((problem) => ({ ...problem, answerVisible: false }))
    }));
  }

  public onClickListeningModeToggle() {
    this.setState((prevState) => ({
      ...prevState,
      listeningMode: !prevState.listeningMode
    }));
  }

  public onClickProblemPlayButton(problemIndex: number) {
    const problem = this.state.problems[problemIndex];
    speakJapanese(problem.question);
  }

  // ====================================================
  // HELPER FUNCTIONS
  // ====================================================

  public generateRandomNumbers(max: number, size: number): number[] {
    // initialize array
    let randArray = new Array(size).fill(0);
    // populate array with random numbers
    randArray = randArray.map(() => Math.floor(max * Math.random()))
    return randArray;
  }

  // ====================================================
  // RENDER FUNCTIONS
  // ====================================================

  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Kanji Numbers Practice</h1>
          <p>Click on each number to show/hide the answer</p>
          <Button onClick={this.onClickShowAnswers} variant="raised" color="primary">
            Show all Answers
          </Button>
          <Button onClick={this.onClickHideAnswers} variant="raised" color="primary">
              Hide all Answers
            </Button>
          <Button onClick={this.onClickListeningModeToggle} variant="raised" color="primary">
            Toggle Listening Mode
          </Button>
        </header>
        <ol className="reading-mode">
          {this.state.problems.map((problem, index) => {
            return this.renderWorksheetProblem(this.state.listeningMode, problem, index)
          })}
        </ol>
      </div>
    );
  }

  private renderWorksheetProblem(listeningMode: boolean, problem: IWorksheetProblem, index: number) {
    return (
      <Card key={index}>
        <CardContent>
          <span onClick={() => this.onClickProblem(index)}>{ problem.question }</span>
          { this.renderProblemAnswer(problem) }
        </CardContent>
        <div>
          { this.renderPlaySoundButton(listeningMode, index) }
        </div>
      </Card>
    );
  }
  
  private renderPlaySoundButton(listeningMode: boolean, problemIndex: number) {
    return (
      listeningMode ? 
        <IconButton onClick={() => this.onClickProblemPlayButton(problemIndex)}>
          <PlayArrowIcon />
        </IconButton>
        : 
        null
    );
  }

  private renderProblemAnswer(problem: IWorksheetProblem) {
    return (
      problem.answerVisible ? <span>{ problem.answer }</span> : null
    );
  }
}

export default App;
