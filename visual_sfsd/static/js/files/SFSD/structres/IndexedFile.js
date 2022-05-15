import TableFile from "./TableFile.js";
import {
    BLOCKS_DEFAULT, ENREG_HIGHLIGHT_GREEN, ENREG_HIGHLIGHT_RED,
    MAX_NB_BLOCKS,
    MAX_NB_ENREGS_DEFAULT,
    NB_BLOCKS_DEFAULT,
    NB_INSERTIONS_DEFAULT
} from "../../constants.js";
import {delay, sleep} from "../../view_file/shared/animationSpeed.js";

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
        indexTableHtml,
        indexTableContainer
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
        this.indexTableContainer = indexTableContainer;
    }

    reset() {
        this.nbBlocks = 0;
        this.nbInsertions = 0;
        this.blocks = [];
        this.indexTable = [];
        this.createBoardsDOM();
    }

    createIndexTableDOM() {
        this.indexTableHtml.selectAll('*').remove();
        for (let couple of this.indexTable) {
            let html = `
            <div class="cell no-select bg-gray-100 text-center text-sm border-gray-700">
                <div class="key flex flex-col justify-center items-center overflow-hidden w-12 h-8 min-w-fit text-gray-800 border-r-2 px-1  border-gray-500 border-b-2">
                    <div>${couple.key}</div>
                </div>
                <div class="pos-i  flex flex-col justify-center items-center overflow-hidden px-2 py-2 w-12 h-8 min-w-fit border-r-2 border-gray-600 border-gray-500 border-b-2">
                    <div>${couple.i}</div>
                </div>
                <div class="pos-j flex flex-col justify-center items-center  overflow-hidden px-2 py-2 w-12 h-8 min-w-fit border-r-2 border-gray-600 border-gray-500 border-b-2">
                    <div>${couple.j}</div>
                </div>
            </div>`
            this.indexTableHtml.node().insertAdjacentHTML('beforeend', html);
        }
    }

    scrollToCell(cell) {
        let indexTableLeft = this.indexTableContainer.node().offsetLeft;
        let cellLeft = cell.node().offsetLeft;

        this.indexTableContainer.node().scroll({
            left: cellLeft - indexTableLeft - 48,
            behavior: "smooth",
        });
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