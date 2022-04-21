// import {
//     MAX_NB_ENREGS_DEFAULT,
//     NB_BLOCKS_DEFAULT,
//     NB_INSERTIONS_DEFAULT,
//     BLOCKS_DEFAULT,
//     ENREG_SIZE,
//     MAX_NB_BLOCKS,
//     ENREG_HIGHLIGHT_GREEN,
// } from '../../constants.js';
import TableFile from "../../structres/TableFile.js";
import {
    BLOCKS_DEFAULT,
    MAX_NB_BLOCKS,
    MAX_NB_ENREGS_DEFAULT,
    NB_BLOCKS_DEFAULT,
    NB_INSERTIONS_DEFAULT
} from "../../../constants.js";


export default class NotClustered extends TableFile {
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
        indexTable = [],
        maxIndex = NB_BLOCKS_DEFAULT * MAX_NB_ENREGS_DEFAULT,
        indexTableHtml
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
        this.indexTable = indexTable;
        this.maxIndex = maxIndex;
        this.indexTableHtml = indexTableHtml;
    }

    search(key, animate=false) {
        return {
            found: found,
            pos: {
                i: i,
                j: j,
                k: k, // position in index table
            },
            readTimes: readTimes
        }
    }

    insert(key, field1, field2, removed = false, animate=false) {

    }

    removeLogically(key, animate = false) {
    }

    editEnreg(key, field1, field2, removed = false, animate = false) {
    }
}