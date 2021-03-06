'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.ReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });

const map = new Map(); // key: 都道府県 value: 集計データのオブジェクト
rl.on('line', (line) => {
    const columns = line.split(',');
    const year = columns[0];
    const prefecture = columns[2];
    const popu = columns[7];
    if (year === '2010' || year === '2015') {
        let value = map.get(prefecture);
        if (!value) {
            value = {
                popu10: 0,
                popu15: 0,
                change: null
            };
        }
        if (year === '2010') {
            value.popu10 += parseInt(popu);
        }
        if (year === '2015') {
            value.popu15 += parseInt(popu);
        }
        map.set(prefecture, value);
    }
});
rl.resume();
rl.on('close', () => {
    for (let keyAndValue of map) { // keyAndValue の添え字 0 にキー、1 に値が入っている
        const value = keyAndValue[1];
        value.change = value.popu15 / value.popu10;
    }
    const rankingArray = Array.from(map).sort((pair1, pair2) => {
        return pair1[1].change - pair2[1].change;
    });
    const rankingStrings = rankingArray.map(([key, value], i) => {
        return  'ランク' + (i + 1) + '位 ' + key + ': ' + value.popu10 + '=>' + value.popu15 + ' 変化率:' + value.change;
    });
    console.log(rankingStrings);
});
