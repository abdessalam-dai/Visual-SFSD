import Enreg from './Enreg.js';


export default class Block {
    constructor(enregs = [], nb = 0, nextBlockIndex=-1) {
        this.enregs = enregs;
        this.nb = nb;
        this.nextBlockIndex = nextBlockIndex;
    }
}
