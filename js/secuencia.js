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
        let array_tem = this.input.split(',');
        for (let i = 0; i < array_tem.length; i++) {
            let clean = array_tem[i].replace(' ', '');
            if (clean.search('#') !== -1) {
                let x = clean.replace('#', '');
                this.center = i;
                this.sequence.push(parseInt(x));
                continue;
            }
            if(this.center === undefined){
                this.negative.push(parseInt(clean));
            } else {
                this.positive.push(parseInt(clean));
            }
            this.sequence.push(parseInt(clean));
        }
    }

    reflex() {
        this.positive = [];
        this.center = undefined; // pos center
        this.negative = [];
        this.sequence = [];
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
                this.negative.push(parseInt(clean));
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
                this.positive.push(0);
                this.sequence.push(0);
            }
            //this.center = this.center;
        } else if (this.center < 0) {
            let difference = - (this.center);
            for (let i = 0; i < difference; i++){
                this.negative.unshift(0);
                this.sequence.unshift(0);
            }
            this.center = 0;
        }
        this.refreshInput();
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

    write(){
        console.log(this);
    }
}