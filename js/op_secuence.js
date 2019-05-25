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
    console.log(secA);
    console.log(secB);
    console.log(op);
    switch (op) {
        case 'suma': suma_res(secA, secB, false); break;
        case 'mult': console.log("a"); break;
        case 'resta': suma_res(secA, secB, true); break;
        default: return;
    }
}

function suma_res(sequence1, sequence2, resta) {
    let array_res = [];
    let positive = suma_res_secs(sequence1.positive, sequence2.positive, resta);
    let negative = suma_res_secs(sequence1.negative, sequence2.negative, resta);
    let centers = suma_res_centers(sequence1, sequence2, resta);
    console.log(centers)
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

function suma_res_secs(sequence1, sequence2, resta) {
    let secL = sequence1;
    let secM = sequence2;
    let positiveResult = [];
    if (sequence2.length > sequence1.length) {
        secL = sequence2;
        secM = sequence1;
    }
    for(let i = 0; i < secL.length; i++) {
        positiveResult.push(0);
    }
    for(let i = 0; i < secL.length; i++) {
        if (secL[i] === undefined && secM[i] === undefined) {
            continue;
        } else if (secL[i] !== undefined && secM[i] === undefined) {
            if(resta)
                positiveResult[i] = - (secL[i]);
            else
                positiveResult[i] = secL[i];
        } else {
            if(resta)
                positiveResult[i] = secL[i] - secM[i];
            else
                positiveResult[i] = secL[i] + secM[i];
        }
    }
    return positiveResult;
}

function suma_res_centers(sequence1, sequence2, resta) {
    if(resta)
        return sequence1.sequence[sequence1.center] - sequence2.sequence[sequence2.center];
    else
        return sequence1.sequence[sequence1.center] + sequence2.sequence[sequence2.center];
}