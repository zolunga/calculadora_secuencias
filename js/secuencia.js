class Secuencia {
    positive = [];
    center = undefined; // pos center
    negative = [];
    sequence = [];
    input = '';
    name = '';

    constructor(in_array_text, name) {
        this.input = in_array_text;
        this.name = name;
    }

    analize_data() {
        this.clearObject();
        let array_tem = this.input.split(',');
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
        this.toChartData();
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
                this.sequence.push(parseInt(x));
                continue;
            }
            if(this.center === undefined){
                this.negative.unshift(parseInt(clean));
            } else {
                this.positive.push(parseInt(clean));
            }
            this.sequence.push(parseInt(clean));
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
                this.sequence.push(parseInt(x) * con);
                continue;
            }
            if(this.center === undefined){
                this.negative.unshift(parseInt(clean) * con);
            } else {
                this.positive.push(parseInt(clean) * con);
            }
            this.sequence.push(parseInt(clean) * con);
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
        return true
    }

    toChartData() {
        let arrayX = [];
        for (let i = this.negative.length; i > 0; i--)
            arrayX.push(-(i));
        arrayX.push(0); // center
        for(let i = 1; i <= this.positive.length; i++)
            arrayX.push(i);
        return arrayX
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

    interpolar(n) {
        let num_center = this.sequence[this.center];
        let new_sequence = [];
        this.negative.reverse();
        for (let i = 0; i < this.negative.length; i++) {
            if (this.negative[i + 1] === undefined)
                continue;
            let tem = this.getSubparts(this.negative[i + 1], this.negative[i], n);
            new_sequence = this.unite(new_sequence, tem.reverse());
        }
        let neg_to_cen = this.getSubparts(num_center, this.negative[0], n);
        let cen_to_pos = this.getSubparts(num_center, this.positive[0], n);
        new_sequence = this.unite(new_sequence, neg_to_cen.reverse());
        new_sequence.push(this.sequence[this.center].toString() + '#');
        new_sequence = this.unite(new_sequence, cen_to_pos);
        console.log(this.positive);
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
        if (arrA !== undefined && arrA.length > 0) {
            for (let i = 0; i < arrA.length; i++) {
                arrRet.push(arrA[i]);
            }
        }
        if (arrB !== undefined && arrB.length > 0) {
            for (let i = 0; i < arrB.length; i++) {
                arrRet.push(arrB[i]);
            }
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
            array_result.push(tem.toFixed(2));
        }
        console.log("start: " + start + " end: " + end + " n_parts" + n_parts + " -- " + array_result);
        return array_result;
    }
}