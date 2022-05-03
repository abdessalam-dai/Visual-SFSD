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

    reset() {
        this.nbBlocks = 0;
        this.nbInsertions = 0;
        this.blocks = [];
        this.indexTable = [];
        this.createBoardsDOM();
    }

    isInsertionAllowed() {
        return this.nbInsertions < this.maxIndex;
    }

    createIndexTableDOM() {
        this.indexTableHtml.selectAll('*').remove();
        for (let couple of this.indexTable) {
            let html = `
            <div class="cell bg-gray-100 text-center border-gray-700">
                <div class="key overflow-hidden w-12 h-20 min-w-fit text-gray-800 border-r-2 px-1 py-6 border-gray-500 border-b-2">
                    <div>${couple.key}</div>
                </div>
                <div class="pos-i  overflow-hidden px-2 py-2 w-12 h-10 min-w-fit border-r-2 border-gray-600 border-gray-500 border-b-2">
                    <div>${couple.i}</div>
                </div>
                <div class="pos-j  overflow-hidden px-2 py-2 w-12 h-10 min-w-fit border-r-2 border-gray-600 border-gray-500 border-b-2">
                    <div>${couple.j}</div>
                </div>
            </div>`
            this.indexTableHtml.node().insertAdjacentHTML('beforeend', html);
        }
    }

    async search(key, animate = false) {
        let start = 0, end = this.indexTable.length - 1;

        // Iterate while start not meets end
        while (start <= end) {

            // Find the mid. index
            let mid = Math.floor((start + end) / 2);

            let currCell = this.indexTableHtml
                .select(`.cell:nth-child(${mid + 1})`)

            // If element is present at mid, return True
            if (this.indexTable[mid].key === key) {
                if (animate) {
                    currCell
                        .transition()
                        .duration(600 * delay)
                        .style("background", ENREG_HIGHLIGHT_GREEN)
                        .transition()
                        .delay(600 * delay)
                        .duration(300 * delay)
                        .style("background", "");
                    await sleep(1000);
            }
                return {
                    readTimes: 0,
                    found: true,
                    pos: {
                        i: this.indexTable[mid].i,
                        j: this.indexTable[mid].j,
                        k: mid, // position in index table
                    }
                }
            }

            // Else look in left or right half accordingly
            else if (this.indexTable[mid].key < key)
                start = mid + 1;
            else
                end = mid - 1;

            if (animate) {
                currCell
                    .transition()
                    .duration(600 * delay)
                    .style("background", ENREG_HIGHLIGHT_RED)
                    .transition()
                    .delay(600 * delay)
                    .duration(300 * delay)
                    .style("background", "");
                await sleep(1000);
            }
        }
        return { //if start > end we set the insert position to start
            readTimes: 0,
            found: false,
            pos: {
                i: -1,
                j: -1,
                k: start, // position in index table
            }
        }

    }

    async removeLogically(key, animate = false) {
        let {found, pos, readTimes} = await this.search(key, animate);
        let {i, j} = pos
        let writeTimes;

        if (found) {
            this.blocks[i].enregs[j].removed = true;
            writeTimes = 1;
            readTimes++;

            if (animate) {
                let currBlockElement = this.MSBoard.select(`.bloc:nth-child(${i + 1})`);

                await this.traverseBlockAnimation(i, delay);
                this.updateBufferElement(currBlockElement);

                this.buff
                    .select(`.bloc .bloc-body ul li:nth-child(${j + 1})`)
                    .transition()
                    .duration(500 * delay)
                    .style("color", "#a70000");

                await sleep(1000);

                this.MSBoard
                    .select(`.bloc:nth-child(${i + 1})`)
                    .select(`.bloc-body ul li:nth-child(${j + 1})`)
                    .transition()
                    .duration(500 * delay)
                    .style("color", "#a70000");

                this.updateIOTimes(readTimes, writeTimes);
                this.updateMCDescription("Removing was successful", "success");

                this.createBoardsDOM();
            }

            return true;
        } else {
            return false;
        }
    }

    async editEnreg(key, field1, field2, removed = false, animate = false) {
        let {found, pos, readTimes} = await this.search(key, animate);
        let {i, j} = pos
        let writeTimes;

        let block;

        if (found) {
            block = this.blocks[i];
            block.enregs[j].field1 = field1;
            block.enregs[j].field2 = field2;

            this.blocks[i] = block;
            writeTimes = 1;
            readTimes++;

            if (animate) {
                let currBlockElement = this.MSBoard.select(`.bloc:nth-child(${i + 1})`);

                await this.traverseBlockAnimation(i, delay);
                this.updateBufferElement(currBlockElement);

                this.buff
                    .select(`.bloc .bloc-body ul li:nth-child(${j + 1})`)
                    .transition()
                    .duration(500 * delay)
                    .style("background", ENREG_HIGHLIGHT_GREEN);

                await sleep(1000);

                this.updateBlockInMS(i, block);

                this.updateIOTimes(readTimes, writeTimes);
                this.updateMCDescription("Editing was successful", "success");
            }

            return true;
        } else {
            return false;
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