let dict_secquences = {};
let count = 0;

function init() {
    $('.ui.dropdown').dropdown();
    $('#modalGraf.ui.modal').modal();
    let wavFile = new wav('sample.wav');
    wavFile.onloadend = function () {
        // 'this' refers to the wav instance
        console.log(this);
    };
}

function addSequence(event) {
    event.preventDefault();
    if ($('#sequenceInput').val() === undefined)
        return;
    let tem_sec = new Secuencia($('#sequenceInput').val(), 'sequence' + count);
    tem_sec.analize_data();
    if (!tem_sec.verify())
        return;
    tem_sec.write();
    dict_secquences['sequence' + count] = tem_sec;
    count++;
    createSpace(tem_sec);
    //1,2,4,#3,2,3
}

function createSpace(sequence) {
    let cont = $('<div/>');
    let buttonReflex = createButtonReflex(sequence);
    let buttonChart = createButtonChart(sequence);
    let buttonShift = createButton(sequence, 'shift', 'opShift', 'Desplazar');
    let buttonDiez = createButton(sequence, 'diezmar', 'opDiezmar', 'Diezmar');
    let buttonMultC = createButton(sequence, 'multC', 'opMulConst', 'Multiplicar');
    let buttonInter = createButton(sequence, 'inter', 'opInterpolacion', 'Interpolar');
    let div = $('<div/>');
    let seq_text = paintSequence(sequence);
    div.addClass('scrollSec');
    cont.attr('id', 'div' + sequence.name);
    cont.addClass('three wide centered column');
    cont.append('<h4>' + sequence.name + '</h4>');
    div.append(seq_text);
    //div.append('<p id="val' + sequence.name + '">' + sequence.input + '</p>');
    cont.append(div);
    cont.append(buttonReflex);
    cont.append(buttonMultC);
    cont.append(buttonShift);
    cont.append(buttonDiez);
    cont.append(buttonInter);
    cont.append(buttonChart);
    cont.addClass('spaceSec');
    $('#workspace').append(cont);
    $('#secuenciasOP1').append('<option>' + sequence.name + '</option>');
    $('#secuenciasOP2').append('<option>' + sequence.name + '</option>');
}

function createButtonReflex(sequence) {
    let space = $('<div/>');
    let buttonReflex = $('<button/>');
    buttonReflex.text('Reflejar');
    buttonReflex.attr('onclick', 'opReflex(\'' + sequence.name + '\')');
    buttonReflex.addClass('buttonOP');
    buttonReflex.addClass('mini ui green button');
    space.addClass('spaceD');
    space.append(buttonReflex);
    return space
}

function createButtonChart(sequence) {
    let space = $('<div/>');
    let buttonReflex = $('<button/>');
    buttonReflex.text('Grafica');
    buttonReflex.attr('onclick', 'showChart(\'' + sequence.name + '\')');
    buttonReflex.addClass('buttonOP');
    buttonReflex.addClass('mini ui green button');
    space.addClass('spaceD');
    space.append(buttonReflex);
    return space
}

/**
 * Crea el html de botones genericos relacionados a una operacion
 * @param sequence objeto
 * @param type tipo de boton
 * @param op operacion que realiza
 * @returns {*|jQuery.fn.init|jQuery|HTMLElement}
 */
function createButton(sequence, type, op, text) {
    let space = $('<div/>');
    let input = $('<input/>');
    input.attr('type', 'text');
    input.attr('id', type + sequence.name);
    input.addClass('inputVal');
    input.addClass('inputVal');
    let button = $('<button/>');
    button.text(text);
    button.attr('onclick', op + '("' + sequence.name + '")');
    button.addClass('mini ui green button');
    button.addClass('buttonOP');
    space.addClass('spaceD');
    space.append(button);
    space.append(input);
    return space
}

function paintSequence(sequence){
    let array_tem = sequence.input.split(',');
    let cadena = $('<p/>');
    cadena.attr('id', 'val' + sequence.name);
    cadena.append('<span style="color: black"> { </span>');
    if(sequence.periodic)
        cadena.append('<span style="color: black"> ..., </span>');
    for (let i = 0; i < array_tem.length; i++) {
        let clean = array_tem[i].replace(' ', '');
        if (clean.search('#') !== -1) {
            cadena.append('<span style="color: #8c0615">' + array_tem[i] + ', </span>')
        } else {
            if (!(array_tem.length - 1 === i))
                cadena.append('<span style="color: black">' + array_tem[i] + ', </span>');
            else
                cadena.append('<span style="color: black">' + array_tem[i] + ' </span>');
        }
    }
    if(sequence.periodic)
        cadena.append('<span style="color: black"> ,... </span>');
    cadena.append('<span style="color: black"> } </span>');
    return cadena;
}

function opReflex(name) {
    dict_secquences[name].reflex();
    let seq_text = paintSequence(dict_secquences[name]);
    $('#val' + name).replaceWith(seq_text);
}

function opShift(name) {
    let shift_val = parseInt($('#shift' + name).val());
    if (shift_val === undefined || isNaN(shift_val))
        return;
    dict_secquences[name].shiftSequence(shift_val);
    let seq_text = paintSequence(dict_secquences[name]);
    $('#val' + name).replaceWith(seq_text);
}

function opDiezmar(name) {
    let inDiez = parseInt($('#diezmar' + name).val());
    if (inDiez === undefined || isNaN(inDiez))
        return;
    dict_secquences[name].decimate(inDiez);
    let seq_text = paintSequence(dict_secquences[name]);
    $('#val' + name).replaceWith(seq_text);
}

function opInterpolacion(name) {
    let inInter = parseInt($('#inter' + name).val());
    if (inInter === undefined || isNaN(inInter))
        return;
    dict_secquences[name].interpolate(inInter);
    let seq_text = paintSequence(dict_secquences[name]);
    $('#val' + name).replaceWith(seq_text);
}

function opMulConst(name) {
    let mult = parseFloat($('#multC' + name).val());
    if (mult === undefined || isNaN(mult))
        return;
    console.log(mult)
    dict_secquences[name].multByConst(mult);
    let seq_text = paintSequence(dict_secquences[name]);
    $('#val' + name).replaceWith(seq_text);
}

function showChart(name) {
    let arX = dict_secquences[name].toChartData();
    let arY = dict_secquences[name].sequence;
    let trace1 = {
        x: arX,
        y: arY,
        mode: 'lines+markers',
        marker: {
            color: 'rgb(128, 0, 128)',
            size: 8
        },
        line: {
            color: 'rgb(128, 0, 128)',
            width: 1
        }
    };
    let layout = {
        xaxis: {
            tick0: 1,
            dtick: 1,
            showgrid: true,
            showline: true,
            mirror: 'ticks',
            gridcolor: '#bdbdbd',
            gridwidth: 1,
            zerolinecolor: '#969696',
            zerolinewidth: 4,
            linecolor: '#636363',
            linewidth: 6
        },
    };
    Plotly.newPlot('chart', [trace1], layout);
    $('#modalGraf').modal('show');
}