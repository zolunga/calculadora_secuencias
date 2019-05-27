let secA = undefined;
let secB = undefined;
let op = undefined
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
    let tem_sec = new Secuencia(array_res.join(','), 'sequence' + count);
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