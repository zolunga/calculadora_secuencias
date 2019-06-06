class Secuencia {
    positive = [];
    center = undefined; // pos center
    negative = [];
    sequence = [];
    input = '';
    name = '';
    periodic = false;
    audio = false;

    constructor(in_array_text, name, audio) {
        this.input = in_array_text;
        this.name = name;
        if(audio)
            this.audio = true;
    }

    analize_data() {
        this.clearObject();
        let array_tem = this.input.split(',');
        for (let i = 0; i < array_tem.length; i++) {
            let clean = array_tem[i].replace(' ', '');
            array_tem[i] = clean;
            if (clean.search('#') !== -1) {
                let x = clean.replace('#', '');
                this.center = i;
                this.sequence.push(parseFloat(x));
                continue;
            }
            clean = parseFloat(clean);
            if (isNaN(clean))
                continue;
            if(this.center === undefined){
                this.negative.unshift(clean);
            } else {
                this.positive.push(clean);
            }
            this.sequence.push(clean);
        }
        if (array_tem[0].localeCompare('...') === 0 && array_tem[array_tem.length - 1].localeCompare('...') === 0) {
            this.periodic = true;
            this.center -= 1;
            array_tem.shift();
            array_tem.pop();
            this.input = array_tem.join(',');
        }
        //this.write()
    }

    reflex() {
        this.clearObject();
        let array_tem = this.input.split(',').reverse();
        this.input = array_tem.join(',');
        for (let i = 0; i < array_tem.length; i++) {
            let clean = array_tem[i].replace(' ', '');
            if (clean.search('#') !== -1) {
                let x = clean.replace('#', '');
                this.center = i;
                this.sequence.push(parseFloat(x));
                continue;
            }
            if(this.center === undefined){
                this.negative.unshift(parseFloat(clean));
            } else {
                this.positive.push(parseFloat(clean));
            }
            this.sequence.push(parseFloat(clean));
        }
    }

    shiftSequence(n) {
        this.center = this.center + n;
        if (this.center >= this.sequence.length) {
            let difference = this.center - this.sequence.length;
            for (let i = 0; i <= difference; i++){
                //this.positive.push(0);
                this.sequence.push(0);
            }
            //this.center = this.center;
        } else if (this.center < 0) {
            let difference = - (this.center);
            for (let i = 0; i < difference; i++){
                //this.negative.unshift(0);
                this.sequence.unshift(0);
            }
            this.center = 0;
        }
        this.refreshInput();
        this.analize_data();
    }

    refreshInput() {
        let temArray = [];
        for (let i = 0; i < this.sequence.length; i++) {
            if (i === this.center) {
                temArray.push(this.sequence[i].toString() + '#')
            } else {
                temArray.push(this.sequence[i].toString())
            }
        }
        this.input = temArray.join(',');
    }

    multByConst(con) {
        this.clearObject();
        let array_tem = this.input.split(',');
        for (let i = 0; i < array_tem.length; i++) {
            let clean = array_tem[i].replace(' ', '');
            if (clean.search('#') !== -1) {
                let x = clean.replace('#', '');
                this.center = i;
                this.sequence.push(parseFloat(x) * con);
                continue;
            }
            if(this.center === undefined){
                this.negative.unshift(parseFloat(clean) * con);
            } else {
                this.positive.push(parseFloat(clean) * con);
            }
            this.sequence.push(parseFloat(clean) * con);
        }
        this.refreshInput();
    }

    clearObject() {
        this.positive = [];
        this.center = undefined; // pos center
        this.negative = [];
        this.sequence = [];
    }

    write(){
        console.log(this);
    }

    verify() {
        if (this.sequence === undefined || this.sequence.length === 0)
            return false;
        if (this.center === undefined || isNaN(this.center))
            return false;
        return true;
    }

    toChartData() {
        let Data = {
            arrayX: [],
            arrayY: []
        };
        for (let i = this.negative.length -1; i >= 0; i--){
            Data.arrayX.push(-(i + 1));
            Data.arrayY.push(this.negative[i])
        }
        Data.arrayX.push(0); // center
        Data.arrayY.push(this.sequence[this.center]); // center
        for(let i = 0; i < this.positive.length; i++){
            Data.arrayX.push(i + 1);
            Data.arrayY.push(this.positive[i]);
        }

        if(!this.periodic)
            return Data;
        let count_pos = this.positive.length;
        let count_neg = -(this.negative.length);
        for (let j = 0; j < 2; j++) {
            for (let i = 0; i < this.sequence.length; i++) {
                count_pos++;
                Data.arrayX.push(count_pos);
                Data.arrayY.push(this.sequence[i]);
            }
            for (let i = this.sequence.length - 1; i >= 0; i--) {
                count_neg--;
                Data.arrayX.unshift(count_neg);
                Data.arrayY.unshift(this.sequence[i]);
            }
        }
        console.log(Data);
        return Data;
    }


    decimate(n) {
        let new_sequence = [];
        for (let i = 0; i < this.negative.length; i++) {
            if ((i+1)%n === 0 && i !== 0)
                new_sequence.push(this.negative[i].toString());
        }
        new_sequence.reverse();
        new_sequence.push('#' + this.sequence[this.center].toString());
        for (let i = 0; i < this.positive.length; i++) {
            if ((i+1)%n === 0 && i !== 0)
                new_sequence.push(this.positive[i].toString());
        }
        this.input = new_sequence.join(',');
        this.analize_data();
    }

    interpolate(n) {
        let num_center = this.sequence[this.center];
        let new_sequence = [];
        this.negative.push(0);
        for (let i = 0; i < this.negative.length; i++) {
            if (this.negative[i + 1] === undefined)
                continue;
            let tem = this.getSubparts(this.negative[i], this.negative[i + 1], n);
            new_sequence = this.unite(new_sequence, tem);
        }
        new_sequence.reverse();
        let neg_to_cen = this.getSubparts(num_center, this.negative[0], n);
        neg_to_cen.shift();
        let cen_to_pos = this.getSubparts(num_center, this.positive[0], n);
        cen_to_pos.shift();
        new_sequence = this.unite(new_sequence, neg_to_cen);
        new_sequence.push(this.sequence[this.center].toString() + '#');
        new_sequence = this.unite(new_sequence, cen_to_pos);
        for (let i = 0; i < this.positive.length; i++) {
            let tem = this.getSubparts(this.positive[i], 0, n);
            if (this.positive[i + 1] !== undefined)
                tem = this.getSubparts(this.positive[i], this.positive[i + 1], n);
            new_sequence = this.unite(new_sequence, tem);
        }
        this.input = new_sequence.join(',');
        this.analize_data();
    }

    unite(arrA, arrB) {
        let arrRet = [];
        for (let i = 0; i < arrA.length; i++) {
            arrRet.push(arrA[i]);
        }
        for (let i = 0; i < arrB.length; i++) {
            arrRet.push(arrB[i]);
        }
        return arrRet;
    }

    /**
     * Obtiene arreglo con los n numeros intermedios de un inicio a fin
     * @param start
     * @param end
     * @param n_parts
     * @returns {Array}
     */
    getSubparts(start, end, n_parts) {
        if (start === undefined)
            start = 0;
        if (end === undefined)
            end = 0;
        let diff = end - start;
        let size_part = diff / n_parts;
        let array_result = [];
        for (let i = 0; i < n_parts; i++) {
            let tem = start + (i * size_part);
            array_result.push(tem);
        }
        return array_result;
    }
}