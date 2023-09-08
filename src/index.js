const {
  Worker, MessageChannel, isMainThread, parentPort, workerData,
} = require('node:worker_threads');
const { Word } = require('slova');
const config = require('../config.json');

const requiredWord = config.wordSearched;

const generator = new Word({
    length: requiredWord.length,
    amount: 1,
    syllables: config.syllables
});

const threads = config.threads;

const triesPerThread = config.wordsPerThread;
let totalWordsFound = 0;

if(isMainThread) {
    let closed = 0;
    for(let i = 0; i < threads; i++) {
        const worker = new Worker(__filename);
        const subChannel = new MessageChannel(); 
        worker.postMessage({ port: subChannel.port1 }, [subChannel.port1]);
        subChannel.port2.on('message', (value) => {
            const object = JSON.parse(value);
            let nickname = i + 1;
            if(nickname.toString().length === 1) {
                nickname = "0" + nickname;
            }
            if(object.type === 'message')
                console.log(`[Worker ${nickname}] | ${object.content}`);
            if(object.type === 'close') {
                closed += 1;
                totalWordsFound += parseInt(object.content);
                if(closed >= threads) {
                    console.log('[Main] | The probability of the word ' + requiredWord + ` generating is ${totalWordsFound}/${triesPerThread * threads} which equals ${totalWordsFound / (triesPerThread * threads)}`)
                }
            }
        });
    }
} else {
    parentPort.once('message', (value) => {
        let wordsFound = 0;
        value.port.postMessage(JSON.stringify({ type: 'message', content: 'Starting' }));    
        for(let i = 0; i < triesPerThread; i++) {
            const word = generator.generate()[0];
            if(word === requiredWord) {
                value.port.postMessage(JSON.stringify({ type: 'message', content: 'The required word ' + word + ' was found in ' + i + ' tries!'}));
                wordsFound += 1;
            } else if(i.toString().endsWith('0000')) {
                value.port.postMessage(JSON.stringify({ type: 'message', content: `Generated word ${word} at try ${i}, ${triesPerThread - i} tries left` }));
            }
        }
        value.port.postMessage(JSON.stringify({ type: 'close', content: wordsFound.toString() }));
    });
}


