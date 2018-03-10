import { Component, OnInit } from '@angular/core';

interface WorksheetProblem {
  question: string;
  answer: string;
  answerVisible: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  problems = [];

  numberMap = {
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

  ngOnInit() {
    // Generate random numbers
    const randNums = this.generateRandomNumbers(1000, 30);
    // Map random numbers to WorksheetProblem
    const problems = randNums.map((inputNum) => {
      return {
        question: this.convertNumberToKanji(inputNum),
        answer: inputNum,
        answerVisible: false
      };
    });
    // Show worksheet problems
    this.problems = problems;
    console.log(this.problems);
  }

  onClickProblem(problemIndex: number) {
    let visibility = this.problems[problemIndex].answerVisible;
    this.problems[problemIndex].answerVisible = !visibility;
  }

  onClickShowAnswers() {
    this.problems.forEach((problem) => {
      problem.answerVisible = true;
    });
  }

  onClickHideAnswers() {
    this.problems.forEach((problem) => {
      problem.answerVisible = false;
    });
  }

  generateRandomNumbers(max: number, size: number): number[] {
    // initialize array
    let randArray = new Array(size).fill(0);
    // populate array with random numbers
    randArray = randArray.map(() => Math.floor(max * Math.random()))
    return randArray;
  }

  // Assumes number is less than 10,000,000 because I don't
  // know the kanji for 10 million yet.
  convertNumberToKanji(inputNum: number): string {
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
      let manValue = Math.floor(currNum / 10000)
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
      let senValue = Math.floor(currNum / 1000)
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
      let hyakuValue = Math.floor(currNum / 100)
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
      let jyuuValue = Math.floor(currNum / 10)
      if (jyuuValue > 1) {
        result += this.convertNumberToKanji(jyuuValue) + '十';
      } else if (jyuuValue === 1) {
        result += '十';
      }
      currNum = currNum % 10
    }

    // Checking for ones
    if (currNum > 0) {
      result += this.numberMap[currNum];
      currNum = 0;
    } else if (result.length === 0) {
      // If the number is just zero, then print 0
      result += '0';
    }
    
    return result;
  }
}
