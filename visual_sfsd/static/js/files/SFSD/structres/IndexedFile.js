import TableFile from "./TableFile.js";
import {
    BLOCKS_DEFAULT,
    MAX_NB_BLOCKS,
    MAX_NB_ENREGS_DEFAULT,
    NB_BLOCKS_DEFAULT,
    NB_INSERTIONS_DEFAULT
} from "../../constants.js";

export default class IndexedFile extends TableFile {
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
        maxIndex,
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

    createIndexTableDOM() {
        this.indexTableHtml.selectAll('*').remove();
        console.log(this.indexTable)
        console.log(this.blocks)
        for (let couple of this.indexTable) {
            let html = `
            <div class="cell bg-slate-200 text-center border-gray-700">
                <div class="key bg-gray-100 w-12 h-20 min-w-fit text-gray-800 border-r-2 px-1 py-6 border-gray-500 border-b-2">
                    ${couple.key}
                </div>
                <div class="pos-i px-2 py-2 w-12 h-10 min-w-fit border-r-2 border-gray-600 border-gray-500 border-b-2">
                    ${couple.i}
                </div>
                <div class="pos-j px-2 py-2 w-12 h-10 min-w-fit border-r-2 border-gray-600 border-gray-500 border-b-2">
                    ${couple.j}
                </div>
            </div>`
            this.indexTableHtml.node().insertAdjacentHTML('beforeend', html);
        }
    }

    getJsonFormat() {
        let data = {
            characteristics: {
                maxNbEnregs: this.maxNbEnregs,
                maxNbBlocks: this.maxNbBlocks,
                maxIndex: this.maxIndex,
                nbBlocks: this.nbBlocks,
                nbInsertions: this.nbInsertions,
            },
            indexTable: [],
            blocks: []
        };

        for (let couple of this.indexTable) {
            let coupleData = {
                key: couple.key,
                i: couple.i,
                j: couple.j
            };
            data.indexTable.push(coupleData);
        }

        for (let block of this.blocks) {
            let blockData = {
                enregs: [],
                nb: block.nb,
                blockAddress: block.blockAddress,
                nextBlockIndex: block.nextBlockIndex
            };

            let enregsData = [];
            for (let enreg of block.enregs) {
                enregsData.push({
                    key: enreg.key,
                    field1: enreg.field1,
                    field2: enreg.field2,
                    removed: enreg.removed
                });
            }

            blockData.enregs = enregsData;

            data.blocks.push(blockData);
        }

        return data;
    }
}