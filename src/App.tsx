import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import Button from 'material-ui/Button';
import Card, { CardContent } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import * as React from 'react';
import './App.css';

interface IWorksheetProblem {
  question: string;
  answer: string;
  answerVisible: boolean;
}

interface IAppComponentState {
  problems: IWorksheetProblem[];
  listeningMode: boolean;
}

const kanjiNumberMap = {
  1: '一',
  2: '二',
  3: '三',
  4: '四',
  5: '五',
  6: '六',
  7: '七',
  8: '八',
  9: '九',
  10: '十',
  100: '百',
  1000: '千',
  10000: '万'
};

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
      question: this.convertNumberToKanji(inputNum)
    }));

    // Show worksheet problems
    this.setState({ problems });
    window.console.log(problems);

    // Call this function to make sure voices are loaded before
    // user plays them.
    this.getSpeechSynthesis().getVoices();
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
    this.playKanjiSpeech(problem.question);
  }

  // ====================================================
  // HELPER FUNCTIONS
  // ====================================================

  // Put this in its own service?
  public getSpeechSynthesis(): any {
    if (!window.speechSynthesis) {
      // If speechSynthesis API is unavailable, use an object with noop methods.
      return {
        getVoices: () => [],
        speak: () => undefined
      };
    }
    return window.speechSynthesis;
  }

  public generateRandomNumbers(max: number, size: number): number[] {
    // initialize array
    let randArray = new Array(size).fill(0);
    // populate array with random numbers
    randArray = randArray.map(() => Math.floor(max * Math.random()))
    return randArray;
  }

  // Put this in its own service?
  public playKanjiSpeech(kanjiString: string) {
    const msg = new SpeechSynthesisUtterance(kanjiString);
    // Get a japanese voice
    msg.voice = this.getSpeechSynthesis().getVoices().filter((v: any) => v.lang === 'ja-JP')[0];
    window.console.log(msg.voice);
    this.getSpeechSynthesis().speak(msg);
  }

  // Assumes number is less than 10,000,000 because I don't
  // know the kanji for 10 million yet.
  public convertNumberToKanji(inputNum: number): string {
    /*
      Keep reducing it by the biggest counter until not possible
      Then reduce it by the next biggest counter
      counters: 万千百十
      numbers: 一二三四五六七八九
      Algorithm

      Biggest number is 10,000 man
      divide the number by 10,000 then if non zero convert to kanji and add man to the end
      new number becomes num modulo 10,000
      repeat the process with sen
      repeat the process with hyaku
      repeat the process with jyuu
      then handle ones digit or zero case
    */

    // Initializing result
    let currNum = inputNum;
    let result = '';
    
    // Checking for man
    if (currNum >= 10000) {
      // divide number by 10000, if non zero convert to kanji
      const manValue = Math.floor(currNum / 10000)
      if (manValue > 1) {
        result += this.convertNumberToKanji(manValue) + '万';
      } else if (manValue === 1) {
        result += '万';
      }
      currNum = currNum % 10000
    }

    // Checking for sen
    if (currNum >= 1000) {
      // divide number by 1000, if non zero convert to kanji
      const senValue = Math.floor(currNum / 1000)
      if (senValue > 1) {
        result += this.convertNumberToKanji(senValue) + '千';
      } else if (senValue === 1) {
        result += '千';
      }
      currNum = currNum % 1000
    }

    // Checking for hyaku
    if (currNum >= 100) {
      // divide number by 100, if non zero convert to kanji
      const hyakuValue = Math.floor(currNum / 100)
      if (hyakuValue > 1) {
        result += this.convertNumberToKanji(hyakuValue) + '百';
      } else if (hyakuValue === 1) {
        result += '百';
      }
      currNum = currNum % 100
    }

    // Checking for jyuu
    if (currNum >= 10) {
      // divide number by 10, if non zero convert to kanji
      const jyuuValue = Math.floor(currNum / 10)
      if (jyuuValue > 1) {
        result += this.convertNumberToKanji(jyuuValue) + '十';
      } else if (jyuuValue === 1) {
        result += '十';
      }
      currNum = currNum % 10
    }

    // Checking for ones
    if (currNum > 0) {
      result += kanjiNumberMap[currNum];
      currNum = 0;
    } else if (result.length === 0) {
      // If the number is just zero, then print 0
      result += '0';
    }
    
    return result;
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
      <Card>
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
