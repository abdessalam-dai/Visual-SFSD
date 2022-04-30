import TableFile from "../../structres/TableFile.js";
import Enreg from '../../structres/Enreg.js';
import Block from '../../structres/Block.js';
import {
    BLOCKS_DEFAULT, ENREG_HIGHLIGHT_GREEN, ENREG_HIGHLIGHT_GREY, ENREG_HIGHLIGHT_PURPLE,
    MAX_NB_BLOCKS,
    MAX_NB_ENREGS_DEFAULT,
    NB_BLOCKS_DEFAULT,
    NB_INSERTIONS_DEFAULT
} from "../../../constants.js";

// import {delay, sleep} from "../../../view_file/shared/animationSpeed.js";


export default class EssaiLinear extends TableFile {
    constructor(
        name,
        buff,
        buff2,
        MSBoard,
        maxNbEnregs = MAX_NB_ENREGS_DEFAULT,
        maxNbBlocks = MAX_NB_BLOCKS,
        nbBlocks = NB_BLOCKS_DEFAULT,
        nbInsertions = NB_INSERTIONS_DEFAULT,
        blocks = BLOCKS_DEFAULT,
    ) {
        super(
            name,
            buff,
            buff2,
            MSBoard,
            maxNbEnregs,
            maxNbBlocks,
            nbBlocks,
            nbInsertions,
            blocks
        );
        this.init();
    }

    init() {
        while (this.blocks.length < this.maxNbBlocks) {
            let newBlock = new Block([]);
            this.blocks.push(newBlock);
            this.nbBlocks++;
        }
    }

    search(key, animate = false) {
        let i = this.hashFunction(key); // returns the index of the block where to search
        console.log({i , key})
        let found = false;
        let stop = false;
        let j;
        while (!found && !stop) {
            let currBlock = this.blocks[i];
            j = 0;
            console.log(currBlock.nb)
            // inner search in the block
            if (currBlock.nb !== 0) {
                while (j < currBlock.nb && !found) {
                    console.log(currBlock.enregs[j])
                    if (key === currBlock.enregs[j].key) {
                        found = true;
                        return {
                            found: found,
                            pos: {
                                i: i,
                                j: j,
                            }
                        }
                    } else {
                        j = j + 1;
                    }
                }
            }
            // if there is still space in the current block we stop seach
            // this the criteria of the essay linear method
            if (currBlock.nb < MAX_NB_ENREGS_DEFAULT) {
                stop = true;
            } else {
                i = i - 1;
                if (i < 0) {
                    i = this.blocks.length - 1;
                }
            }

        }
        return {
            found: found,
            pos: {
                i: i,
                j: j,
            }
        }

    }

    insert(key, field1, field2, removed = false, animate) {

        if (this.nbInsertions === (this.nbBlocks * MAX_NB_ENREGS_DEFAULT) - 1) {
            console.log('can not insert anymore');
            return false;
        } else {
            let newEnreg = new Enreg(key, field1, field2, removed);
            let {found, pos} = this.search(key);
            let i = pos.i;
            if (!found) {
                this.blocks[i].enregs.push(newEnreg)
                this.blocks[i].nb++;
                this.nbInsertions++;
                return true;
            }
        }
    }

    removeLogically(key, animate = false) {
        let {found, pos} = this.search(key);
        let i = pos.i;
        let j = pos.j;
        if (found) {
            this.blocks[i].enregs[j].removed = true;
        }
    }

    removePhysically(key , animate=false) {
        let {found, pos} = this.search(key);
        let i = pos.i;
        let j = pos.j;
        console.log(found  , i , j)
        if (found) {
            // the i block is full ?
            if (this.blocks[i].nb === MAX_NB_ENREGS_DEFAULT) {
                let k = i - 1;
                if (k < 0) {
                    k = MAX_NB_BLOCKS - 1;
                }

                let firstStop = false;
                // start of the outer loop
                while (!firstStop) {
                    let block = this.blocks[k];
                    let m = 0;
                    let secondStop = false;
                    // start of the outer loop
                     while (m < block.nb && !secondStop) {
                         let y = this.blocks[k].enregs[m];
                         if((this.hashFunction(y.key) < k < i) ||
                             (k < i <= this.hashFunction(y.key)) ||
                             ( i <= this.hashFunction(y.key) < k)
                         ){
                             this.blocks[i].enregs[j] = y;
                             i = k;
                             j = m;
                             this.blocks[i] = this.blocks[k];
                             secondStop = true;
                         }
                         else {
                             m++;
                         }

                     }
                     // end of the inner loop

                    if (this.blocks[k].nb < MAX_NB_ENREGS_DEFAULT) {
                        firstStop = true;
                    } else {
                        k = k - 1;
                        if ( k < 0) {
                            k = this.nbBlocks - 1;
                        }
                    }
                }
                // end of the outer loop
                this.blocks[i].enregs[j] = this.blocks[i].enregs[this.blocks[i].enregs.length - 1]
                this.blocks[i].enregs.pop()
                this.blocks[i].nb--;
            }
            // if the block i not
            else {
                this.blocks[i].enregs[j] = this.blocks[i].enregs[this.blocks[i].enregs.length - 1]
                this.blocks[i].enregs.pop()
                this.blocks[i].nb--;
            }

        }

    }

    hashFunction(key) {
        return key % this.maxNbBlocks;
    }
}