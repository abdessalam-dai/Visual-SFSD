import {
    MAX_NB_ENREGS_DEFAULT,
    NB_BLOCKS_DEFAULT,
    NB_INSERTIONS_DEFAULT,
    BLOCKS_DEFAULT,
} from '../../constants.js';


export default class File {
    /*
        name :          file name [String]
        maxNbEnregs :   max. number of enregs. in a block [Int]
        nbBlocks :      number of blocks [Int]
        nbInsertions :  number of inserted enregs. [Int]
        blocks :        array of blocks [class Block]
    */

    constructor(
        name,
        maxNbEnregs = MAX_NB_ENREGS_DEFAULT,
        nbBlocks = NB_BLOCKS_DEFAULT,
        nbInsertions = NB_INSERTIONS_DEFAULT,
        blocks = BLOCKS_DEFAULT
    ) {
        this.name = name;
        this.maxNbEnregs = maxNbEnregs;
        this.nbBlocks = nbBlocks;
        this.nbInsertions = nbInsertions;
        this.blocks = blocks;
    }

    print() {
        console.log(this.nbBlocks);
        console.log(this.blocks.length);
        console.log(this.nbInsertions);

        let i = 0;
        for (let block of this.blocks) {
            console.log(`Block ${i} - nb = ${block.nb}`);
            let j = 0;
            for (let enreg of block.enregs) {
                console.log(`\tEnreg. N${j} : key = ${enreg.key} ${enreg.removed}`);
                j++;
            }
            i++;
        }
    }

}
