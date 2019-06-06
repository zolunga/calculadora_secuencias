const express = require("express");
const cors = require('cors');
const app = express();
app.use(cors());
let base_url = '/sound/';
const WaveFile = require('wavefile');
const play = require('audio-play');
const load = require('audio-loader');
let wav = require('node-wav');
let Secuencia = require('./secuencia.js');

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

app.get(base_url + 'wav', function(req, res) {
    if ('name' in req.query) {
        let s = getSamples(req.query.name);
        res.send({res: s[0]});
    } else {
        res.send({res: 'Fallido'});
    }
});

app.post(base_url + 'genwav', function (req, res) {
    if ('name' in req.body) {
        let s = createWav(req.body);
        res.send({res: s});
    } else {
        res.send({res: 'Fallido'});
    }
});

app.post(base_url + 'interpolate', function (req, res) {
    if ('input' in req.body) {
        console.log("Analizando");
        let sec = new Secuencia(req.body.input, req.body.name);
        sec.analize_data();
        console.log(sec.verify());
        sec.interpolate(req.body.inter);
        res.send({res: sec.input});
    } else {
        res.send({res: 'Fallido'});
    }
});


app.listen(4000, () => {
    console.log("El servidor está inicializado en el puerto 4000");
});


function getSamples(name) {
    let fs  = require('fs');
    let path = '/home/alan/Descargas/' + name + '.wav';
    let buffer = fs.readFileSync(path);
    let result = wav.decode(buffer);
    console.log(result.sampleRate);
    return result.channelData
}

function createWav(values) {
    let data = JSON.parse(values.seq);
    let wav = new WaveFile();
    let fs  = require('fs');
    wav.fromScratch(1, 44100, '64', data);
    fs.writeFileSync('../sounds/' + values.name + '.wav', wav.toBuffer());
    load('../sounds/' + values.name + '.wav').then(play);
    return true;
}