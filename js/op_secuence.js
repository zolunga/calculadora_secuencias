let secA = undefined;
let secB = undefined;
let op = undefined;
function select_op(val) {
    op = val;
}

function setA(val) {
    secA = dict_secquences[val];
}

function setB(val) {
    secB = dict_secquences[val];
}

function startOP() {
    if (secA === undefined || secB === undefined || op === undefined)
        return;
    if (op.localeCompare('conv') === 0)
        Convolution(secA, secB);
    else
        suma_res(secA, secB, op);
}

function suma_res(sequence1, sequence2, op) {
    let array_res = [];
    let positive = operation(sequence1.positive, sequence2.positive, op);
    let negative = operation(sequence1.negative, sequence2.negative, op);
    let centers = operation_centers(sequence1, sequence2, op);
    negative.reverse();
    for (let i = 0; i < negative.length; i ++)
        array_res.push(negative[i].toString());
    array_res.push(centers.toString() + '#');
    for (let i = 0; i < positive.length; i ++)
        array_res.push(positive[i].toString());
    AddNewResult(array_res.join(','));
}

/**
 * Realiza la operacion de los correspondientes fragmentos de la secuencia
 * @param sequence1
 * @param sequence2
 * @param op
 * @returns {Array}
 */
function operation(sequence1, sequence2, op) {
    let secL = sequence1;
    let secM = sequence2;
    let length = sequence1.length;
    let Result = [];
    if (sequence2.length > sequence1.length)
        length = sequence2.length;
    for(let i = 0; i < length; i++)
        Result.push(0);
    for(let i = 0; i < length; i++) {
        if (secL[i] === undefined)
            secL[i] = 0;
        if (secM[i] === undefined)
            secM[i] = 0;
        switch (op) {
            case "suma":
                Result[i] = secL[i] + secM[i];
                break;
            case "resta":
                Result[i] = secL[i] - secM[i];
                break;
            case "mult":
                Result[i] = secL[i] * secM[i];
                break;
        }
    }
    return Result;
}

function operation_centers(sequence1, sequence2, op) {
    switch (op) {
        case "suma":
            return sequence1.sequence[sequence1.center] + sequence2.sequence[sequence2.center];
        case "resta":
            return sequence1.sequence[sequence1.center] - sequence2.sequence[sequence2.center];
        case "mult":
            return sequence1.sequence[sequence1.center] * sequence2.sequence[sequence2.center];
    }
}

/**
 * Realiza el proceso de convolucionar dos secuencias, si estas son periodicas tambien hace el proceso
 * @param sequence1
 * @param sequence2
 * @constructor
 */
function Convolution(sequence1, sequence2) {
    let B_sec = sequence1; // big
    let S_sec = sequence2; // small
    let result = [];
    let new_center = sequence1.negative.length + sequence2.negative.length;
    let new_input = '';
    let perdiodicOne = sequence2.periodic || sequence1.periodic;
    let perdiodicBoth = sequence2.periodic && sequence1.periodic;

    if (S_sec.sequence.length > B_sec.sequence.length) {
        B_sec = sequence2;
        S_sec = sequence1;
    }
    for (let i = 0; i < S_sec.sequence.length; i++) {
        for (let j = 0; j < B_sec.sequence.length; j++) {
            if (result[j + i] === undefined)
                result[j + i] = 0;
            result[j + i] += B_sec.sequence[j] * S_sec.sequence[i];
        }
    }
    if (perdiodicOne || perdiodicBoth) {
        let temArray1 = [];
        let temArray2 = [];
        let len_periodic = 0;
        if (perdiodicOne && !perdiodicBoth) {
            if(B_sec.periodic) {
                len_periodic = B_sec.sequence.length;
            } else {
                len_periodic = S_sec.sequence.length;
            }
        } else if (perdiodicBoth){
            len_periodic = B_sec.sequence.length;
        }
        for (let i = 0;  i < result.length; i++) {
            if (i < len_periodic)
                temArray1.push(result[i]);
            else
                temArray2.push(result[i]);
        }
        for (let i = 0; i < len_periodic; i++)
            temArray2.push(0);
        result = [];
        for (let i = 0; i < temArray1.length; i++) {
                result.push(temArray1[i] + temArray2[i])
        }
    }
    if (perdiodicOne)
        new_input += '...,';
    for (let i = 0; i < result.length; i++) {
        if (i === new_center)
            new_input += result[i].toString() + '#,';
        else
            new_input += result[i].toString() + ',';
    }
    new_input = new_input.substring(0, new_input.length - 1);
    if (perdiodicOne)
        new_input += ',...';
    AddNewResult(new_input);
}

function AddNewResult(new_input) {
    let tem_sec = new Secuencia(new_input, 'sequence' + count);
    tem_sec.analize_data();
    if (!tem_sec.verify()){
        console.error('operacion fallida');
        return;
    }
    tem_sec.write();
    dict_secquences['sequence' + count] = tem_sec;
    count++;
    createSpace(tem_sec);
}