const jsonServer = require('json-server');
const server = jsonServer.create();
const middlewares = jsonServer.defaults();
server.use(middlewares);
let base_url = '/sound/';
const WaveFile = require('wavefile');
let wav = require('node-wav');
server.use(middlewares);
server.listen(4000, () => {
    console.log('JSON Server is running')
});


server.get(base_url + 'wav', (req, res) => {
    if ('name' in req.query) {
        let s = getSamples(req.query.name);
        res.jsonp({res: s[0]});
    } else {
        res.jsonp({res: 'Fallido'});
    }
});

server.get(base_url + 'genwav', (req, res) => {
    //let status = createWav(req.query);
    console.log(req.body);
    console.log(req.query);
    if ('name' in req.query) {
        let s = createWav(req.query);
        res.jsonp({res: s});
    } else {
        res.jsonp({res: 'Fallido'});
    }
});

function getSamples(name) {
    let fs  = require('fs');
    let path = '/home/alan/Descargas/' + name + '.wav';
    let path1 = '../js/sample.wav';
    let buffer = fs.readFileSync(path1);
    let result = wav.decode(buffer);
    console.log(result.sampleRate);
    //console.log(result.channelData);
    //let wav = new WaveFile(fs.readFile(path1));
    //let samples = [];
    let count = 0;
    /*
    while (count < 20){
        console.log(wav.getSample(count));
        samples.push(wav.getSample(count));
    }

     */
    return result.channelData
}

function createWav(values) {
    let data = JSON.parse(values.seq);
    let wav = new WaveFile();
    let fs  = require('fs');
    wav.fromScratch(2, 44100, '32', [data, data]);
    fs.writeFileSync('../sounds/' + values.name + '.wav', wav.toBuffer());
    return true;
}