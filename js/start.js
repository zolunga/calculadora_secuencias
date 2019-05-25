let dict_secquences = {};
let count = 0;

function init() {
    $('.ui.dropdown').dropdown();
}

function addSequence(event) {
    event.preventDefault();
    if ($('#sequenceInput').val() === undefined)
        return;
    let tem_sec = new Secuencia($('#sequenceInput').val(), 'sequence' + count);
    tem_sec.analize_data();
    tem_sec.write();
    dict_secquences['sequence' + count] = tem_sec;
    count++;
    createSpace(tem_sec);
    //1,2,4,#3,2,3
}

function createSpace(sequence) {
    let cont = $('<div/>');
    let buttonReflex = createButtonReflex(sequence);
    let buttonShift = createButton(sequence, 'shift', 'opShift', 'Desplazar');
    let buttonDiez = createButton(sequence, 'diezmar', 'opDiezmar', 'Diezmar');
    let buttonMultC = createButton(sequence, 'multC', 'opMulConst', 'Multiplicar');
    cont.attr('id', 'div' + sequence.name);
    cont.addClass('two wide column');
    cont.append('<h4>' + sequence.name + '</h4>');
    cont.append('<p id="val' + sequence.name + '">' + sequence.input + '</p>');
    cont.append(buttonReflex);
    cont.append(buttonMultC);
    cont.append(buttonShift);
    cont.append(buttonDiez);
    $('#workspace').append(cont);
}

function createButtonReflex(sequence) {
    let buttonReflex = $('<button/>');
    buttonReflex.text('Reflejar');
    buttonReflex.attr('onclick', 'opReflex(\'' + sequence.name + '\')');
    buttonReflex.addClass('buttonOP');
    buttonReflex.addClass('mini ui green button');
    return buttonReflex
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


function opReflex(name) {
    dict_secquences[name].reflex();
    dict_secquences[name].write();
    $('#val' + name).text(dict_secquences[name].input);
}

function paintSequence(sequence){
    let array_tem = sequence.input.split(',');
    let cadena = $('<p/>');
    for (let i = 0; i < array_tem.length; i++) {
        let clean = array_tem[i].replace(' ', '');
        if (clean.search('#') !== -1) {
            cadena.append('<div style="color: #8c0615">' + array_tem[i] + '</div>')
        } else {
            cadena.append(array_tem[i])
        }
    }
    return cadena;
}

function opShift(name) {
    let shift_val = parseInt($('#shift' + name).val());
    dict_secquences[name].shiftSequence(shift_val);
    dict_secquences[name].write();
    $('#val' + name).text(dict_secquences[name].input);
}

function opDiezmar(name) {
    let inDiez = parseInt($('#inDiez' + name).val());
    //dict_secquences[name].shiftSequence(shift_val);
    //dict_secquences[name].write();
    $('#val' + name).text(dict_secquences[name].input);
}

function opMulConst(name) {
    let mult = parseInt($('#multC' + name).val());
    dict_secquences[name].multByConst(mult);
    dict_secquences[name].write();
    $('#val' + name).text(dict_secquences[name].input);
}