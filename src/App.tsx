import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import Button from 'material-ui/Button';
import Card, { CardContent } from 'material-ui/Card';
// import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
// import SwitchBase from 'material-ui/Switch';

import * as React from 'react';

import './App.css';
import { convertNumberToKanji } from './KanjiService';
import { getSpeechSynthesis, speakJapanese } from './TextToSpeechService';

interface IWorksheetProblem {
  answerVisible: boolean;
  kanji: string;
  arabic: string;
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
      answerVisible: false,
      arabic: inputNum.toString(),
      kanji: convertNumberToKanji(inputNum)
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

  public onClickProblemPlayButton(problemIndex: number) {
    const problem = this.state.problems[problemIndex];
    speakJapanese(problem.kanji);
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
          <h1 className="App-title">Japanese Numbers Listening Comprehension</h1>
          <p>For each card, press the play button to hear the Japanese number. <br /> Then reveal the answer to see if you got it right.</p>
          <div style={{
            display: 'flex',
            flexFlow: 'row wrap',
            justifyContent: 'space-around',
            margin: '0 auto',
            maxWidth: '300px'
            }}>
            <Button onClick={this.onClickShowAnswers} variant="raised" color="primary">
              Show all
            </Button>
            <Button onClick={this.onClickHideAnswers} variant="raised" color="primary">
              Hide all
            </Button>
          </div>
          
        </header>
        <div className="Number-Listening-Body">
          {this.state.problems.map((problem, index) => {
            return this.renderWorksheetProblem(this.state.listeningMode, problem, index)
          })}
        </div>
      </div>
    );
  }

  private renderWorksheetProblem(listeningMode: boolean, problem: IWorksheetProblem, index: number) {
    return (
      <Card className="Number-Listening-Card" key={index}>
        <CardContent style={{ position: 'relative' }}>
          <div className="answer" style={{
            opacity: problem.answerVisible ? 1 : 0,
            textAlign: 'center'
          }}>
            <h3>{ problem.kanji }</h3>
            <h4>{ problem.arabic }</h4>
          </div>
          <div className="answer" style={{
            color: 'gray',
            left: '50%',
            opacity: problem.answerVisible ? 0 : 1,
            position: 'absolute',
            textAlign: 'center',
            top: '50%',
            transform: 'translateX(-50%) translateY(-50%)'
          }}>
            <h3>???</h3>
            <h4>???</h4>
          </div>
        </CardContent>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <IconButton onClick={() => this.onClickProblemPlayButton(index)}>
            <PlayArrowIcon style={{height: 38, width: 38}}/>
          </IconButton>
          <IconButton onClick={() => this.onClickProblem(index)}>
            { problem.answerVisible ? <VisibilityIcon /> : <VisibilityOffIcon /> }
          </IconButton>
        </div>
      </Card>
    );
  }
}

export default App;
