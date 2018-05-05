
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

  // Assumes number is less than 10,000,000 because I don't
  // know the kanji for 10 million yet.
export function convertNumberToKanji(inputNum: number): string {
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
            result += convertNumberToKanji(manValue) + '万';
        } else if (manValue === 1) {
            result += '一万';
        }
        currNum = currNum % 10000
    }

    // Checking for sen
    if (currNum >= 1000) {
        // divide number by 1000, if non zero convert to kanji
        const senValue = Math.floor(currNum / 1000)
        if (senValue > 1) {
            result += convertNumberToKanji(senValue) + '千';
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
        result += convertNumberToKanji(hyakuValue) + '百';
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
        result += convertNumberToKanji(jyuuValue) + '十';
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
        result += 'ぜろ';
    }

    return result;
}
