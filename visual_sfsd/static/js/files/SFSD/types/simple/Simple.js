import {BLOCKS_DEFAULT, MAX_NB_ENREGS_DEFAULT, NB_BLOCKS_DEFAULT, NB_INSERTIONS_DEFAULT} from "../../../constants.js";
import TOF from "./TOF.js";
import TnOF from "./TnOF.js";


export default class Simple {
    tof(
        name,
        maxNbEnregs = MAX_NB_ENREGS_DEFAULT,
        nbBlocks = NB_BLOCKS_DEFAULT,
        nbInsertions = NB_INSERTIONS_DEFAULT,
        blocks = BLOCKS_DEFAULT
    ) {

        return new TOF(name, maxNbEnregs, nbBlocks, nbInsertions, blocks);

    }

    tnof(
        name,
        maxNbEnregs = MAX_NB_ENREGS_DEFAULT,
        nbBlocks = NB_BLOCKS_DEFAULT,
        nbInsertions = NB_INSERTIONS_DEFAULT,
        blocks = BLOCKS_DEFAULT
    ) {

        return new TnOF(name, maxNbEnregs, nbBlocks, nbInsertions, blocks);

    }
}