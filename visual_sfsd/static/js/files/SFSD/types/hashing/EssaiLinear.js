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

    }

    search(key, animate = false) {
        let i = this.hashFunction(key); // returns the index of the block where to search
        let found = false;
        let stop = false;

        while (!found && !stop) {
            let currBlock = this.blocks[i];
            let j = 0;
            // inner seach in the block
            while (j <= currBlock.nb && !found) {
                if (key === currBlock.enregs[j].key) {
                    found = true;
                } else {
                    j = j + 1;

                }
            }
            // if there is still space in the current block we stop seach
            // this the criteria of the essay linear method
            if (this.blocks.nb < MAX_NB_ENREGS_DEFAULT) {
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
                j: j
            }
        }

    }

    insert(key, field1, field2, removed = false, animate) {

        if (this.nbInsertions === (this.nbBlocks * MAX_NB_ENREGS_DEFAULT) - 1) {
            return false;
        } else {
            let newEnreg = new Enreg(key, field1, field2, removed);
            let {found, pos} = this.search(key);
            let i = pos.i;
            if (!found) {
                this.blocks[i].enregs.push(newEnreg)
                this.nbInsertions++;
                return true;
            }
        }
    }

    hashFunction(key) {

    }
}