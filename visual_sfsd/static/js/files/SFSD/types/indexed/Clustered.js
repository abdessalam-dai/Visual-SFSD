import Enreg from '../../structres/Enreg.js';
import Block from '../../structres/Block.js';
import {
    BLOCKS_DEFAULT,
    ENREG_HIGHLIGHT_GREEN,
    ENREG_HIGHLIGHT_GREY,
    ENREG_HIGHLIGHT_PURPLE,
    ENREG_HIGHLIGHT_RED,
    MAX_NB_BLOCKS,
    MAX_NB_ENREGS_DEFAULT,
    NB_BLOCKS_DEFAULT,
    NB_INSERTIONS_DEFAULT
} from "../../../constants.js";
import IndexCouple from "../../structres/IndexCouple.js";
import {delay, sleep} from "../../../view_file/shared/animationSpeed.js";
import IndexedFile from "../../structres/IndexedFile.js";


export default class Clustered extends IndexedFile {
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
        maxIndex = MAX_NB_BLOCKS,
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
            blocks,
            indexTable,
            maxIndex,
            indexTableHtml,
            indexTableContainer
        );
    }

    async searchIndex(key, animate = false) {
        let start = 0, end = this.indexTable.length - 1;

        // Iterate while start not meets end
        while (start <= end) {
            // Find the mid. index
            let mid = Math.floor((start + end) / 2);

            let currCell = this.indexTableHtml
                .select(`.cell:nth-child(${mid + 1})`);

            if (animate) {
                this.scrollToCell(currCell);
            }

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
                await sleep(2000);
            }
        }

        if (start > end) { //this can be removed, but I left it, so you understand algorithm
            if (start > this.indexTable.length - 1) { // when the searched key is bigger than the keys in the index table
                return { //insertion at the very end
                    found: false,
                    pos: {
                        k: this.indexTable.length - 1 // position in index table, we return the last bloc
                    }
                }
            } else { //insertion normally, we take the block referred to by element k in the index (call indexTable[k].i)
                return {
                    found: false,
                    pos: {
                        k: start
                    }
                }
            }
        }

    }

    async search(key, animate = false) {
        let searchResult = await this.searchIndex(key, animate);
        let indexInIndexTable = searchResult.pos.k;

        let readTimes = 0;

        let blockElement;
        let bufferElement;
        let midElement;

        if (indexInIndexTable === -1) {
            if (animate) {
                this.updateMCDescription("Element was not found", "error");
            }
            // the case where the there is no block yet
            return {
                found: false,
                pos: {
                    i: 0,
                    j: 0
                }
            }
        }

        let found = searchResult.found;

        let i = this.indexTable[indexInIndexTable].i;
        let block = this.blocks[i];
        readTimes++;

        if (found) {
            // found is true no insertion is possible
            if (animate) {
                this.updateMCDescription("Element was found", "success");
            }
            return {
                found: true,
                pos: {
                    i: indexInIndexTable,
                    j: searchResult.pos.j
                }
            }
        }

        if (animate) {
            this.updateIOTimes(readTimes, 0);

            blockElement = this.MSBoard.select(`.bloc:nth-child(${i + 1})`)

            await this.traverseBlockAnimation(i, delay);

            bufferElement = this.updateBufferElement(blockElement);

            await sleep(1000);
        }

        // binary search
        // Define Start and End Index
        let startIndex = 0;
        let endIndex = block.enregs.length - 1;

        // While Start Index is less than or equal to End Index
        while (startIndex <= endIndex) {
            let middleIndex = Math.floor((startIndex + endIndex) / 2);

            let currKey = block.enregs[middleIndex].key;

            if (animate) {
                midElement = bufferElement.select(".bloc-body ul")
                    .select(`li:nth-child(${middleIndex + 1})`);
            }

            if (key === currKey) {
                if (animate) {
                    midElement
                        .transition()
                        .duration(600 * delay)
                        .style("background", ENREG_HIGHLIGHT_GREEN)
                        .transition()
                        .delay(600 * delay)
                        .duration(300 * delay)
                        .style("background", ENREG_HIGHLIGHT_GREY);
                    await sleep(1000);
                }

                if (animate) {
                    this.updateMCDescription("Element was found", "success");
                }

                return {
                    readTimes: readTimes,
                    found: true,
                    pos: {
                        i: indexInIndexTable,
                        j: middleIndex,
                    }
                }
            }

            // Search Right Side Of Array
            else if (key > currKey) {
                // Assign Start Index and increase the Index by 1 to narrow search
                startIndex = middleIndex + 1;
            }
            // Search Left Side Of Array
            if (key < currKey) {
                // Assign End Index and increase the Index by 1 to narrow search
                endIndex = middleIndex - 1;
            }

            if (animate) {
                midElement
                    .transition()
                    .duration(600 * delay)
                    .style("background", ENREG_HIGHLIGHT_RED)
                    .transition()
                    .delay(600 * delay)
                    .duration(300 * delay)
                    .style("background", ENREG_HIGHLIGHT_GREY);
                await sleep(1000);
            }
        }
        // If Target Is Not Found

        if (animate) {
            this.updateMCDescription("Element was not found", "error");
        }
        if (endIndex + 1 === this.maxNbEnregs) {
            return {
                readTimes: readTimes,
                found: false,
                pos: {
                    i: this.indexTable[indexInIndexTable].i + 1,
                    j: 0
                }
            }
        }

        if (endIndex + 1 > block.nb) {
            return {
                readTimes: readTimes,
                found: false,
                pos: {
                    i: this.indexTable[indexInIndexTable].i + 1,
                    j: 0,
                }
            }
        }

        return {
            readTimes: readTimes,
            found: false,
            pos: {
                i: this.indexTable[indexInIndexTable].i,
                j: endIndex + 1,
            }
        }
    }

    isInsertionAllowed() {
        return this.nbBlocks < this.maxNbBlocks;
    }

    async insert(key, field1, field2, removed = false, animate) {
        if (!this.isInsertionAllowed()) {
            if (animate) {
                this.updateMCDescription("Insertion is impossible! Maximum number of blocks has been reached", "error");
            }

            return false;
        }

        let searchResults = await this.search(key, animate);
        let found = searchResults.found,
            i = searchResults.pos.i,
            j = searchResults.pos.j;

        let readTimes = searchResults.readTimes;
        let writeTimes = 0;
        let midBlockElement;
        let bufferElement;
        let currElement;
        let jthElement;

        if (found) {
            if (animate) {
                this.updateMCDescription(`Insertion is impossible! An element with key=${key} already exists`, "error");
            }

            return false;
        } else {
            if (animate) {
                this.updateMCDescription(`Element with key=${key} should be positioned in the block ${i}, position ${j}`, "success");
            }

            let newEnreg = new Enreg(key, field1, field2, removed);

            if (this.blocks.length === 0) {
                let address = this.setBlockAddress(0);
                let newBlock = new Block([newEnreg], 1, address);
                this.indexTable.push(new IndexCouple(key, 0, 0))
                this.createIndexTableDOM()
                this.blocks.push(newBlock);
                this.nbBlocks += 1;
                writeTimes++;
            } else {
                let continueShifting = true;
                let currBlock, lastIndex, lastEnreg, k;

                while (continueShifting && i < this.blocks.length) {
                    currBlock = this.blocks[i];  // read current block
                    readTimes++;

                    if (animate) {
                        this.updateIOTimes(readTimes, writeTimes);

                        midBlockElement = this.MSBoard.select(`.bloc:nth-child(${i + 1})`)

                        await this.traverseBlockAnimation(i, delay);

                        bufferElement = this.updateBufferElement(midBlockElement);

                        jthElement = bufferElement
                            .select(`.bloc-body ul li:nth-child(${j + 1})`)
                            .style("background", ENREG_HIGHLIGHT_PURPLE);

                        await sleep(1000);
                    }

                    lastIndex = currBlock.nb - 1;
                    lastEnreg = currBlock.enregs[lastIndex]; // save last enreg.
                    k = lastIndex;

                    while (k > j) {
                        currBlock.enregs[k] = currBlock.enregs[k - 1];
                        if (animate) {
                            currElement = bufferElement
                                .select(`.bloc-body ul li:nth-child(${k + 1})`)
                                .style("background", ENREG_HIGHLIGHT_GREEN);

                            currElement.select("span")
                                .transition()
                                .ease(d3.easeLinear)
                                .duration(500 * delay)
                                .style("transform", "translate(0, +40px)")
                                .transition()
                                .duration(0)
                                .style("transform", "translate(0, -40px)")
                                .text(`${currBlock.enregs[k - 1].key}`)
                                .transition()
                                .duration(500 * delay)
                                .style("transform", "translate(0, 0)");

                            await sleep(1000);

                            currElement
                                .style("background", ENREG_HIGHLIGHT_GREY);
                        }

                        k -= 1;
                    }

                    // insert the enreg. at position j
                    currBlock.enregs[j] = newEnreg;


                    if (animate) {
                        jthElement.select("span")
                            .transition()
                            .duration(500 * delay)
                            .style("transform", "translate(150px, 0)")
                            .transition()
                            .duration(0)
                            .style("transform", "translate(-150px, 0)")
                            .text(`${newEnreg.key}`)
                            .transition()
                            .duration(500 * delay)
                            .style("transform", "translate(0, 0)");

                        jthElement.transition()
                            .duration(300 * delay)
                            .style("background", ENREG_HIGHLIGHT_GREY);

                        await sleep(1300);
                    }

                    if (j === currBlock.nb) { // if we are going to be inserting in the last enreg of the block
                        continueShifting = false;
                        this.indexTable[i].key = newEnreg.key;
                        this.indexTable[i].i = i;
                        this.indexTable[i].j = currBlock.nb;
                        currBlock.nb += 1;
                        writeTimes++;

                        if (animate) {
                            bufferElement.select(".bloc .bloc-body ul")
                                .append("li")
                                .style("background", ENREG_HIGHLIGHT_GREEN)
                                .attr("class", "border-b-2 border-gray-700 h-8 text-sm flex justify-center flex-col")
                                .append("span")
                                .text(`${newEnreg.key}`);

                            bufferElement.select(".bloc .bloc-header .bloc-nb")
                                .text(`NB=${currBlock.nb}`);

                            await sleep(1000);

                            // write buffer in MS
                            this.updateBlockInMS(i, currBlock);
                        }

                    } else {

                        if (currBlock.nb < this.maxNbEnregs) {
                            // if the current block is not full, then insert the last enreg. at the end
                            currBlock.nb += 1;
                            currBlock.enregs[currBlock.nb - 1] = lastEnreg;
                            this.blocks[i] = currBlock;  // save current block in the blocks array
                            this.indexTable[i].key = lastEnreg.key;
                            this.indexTable[i].i = i;
                            this.indexTable[i].j = currBlock.nb - 1;
                            this.createIndexTableDOM()
                            writeTimes++;
                            continueShifting = false;

                            if (animate) {
                                bufferElement.select(".bloc .bloc-body ul")
                                    .append("li")
                                    .style("background", ENREG_HIGHLIGHT_GREEN)
                                    .attr("class", "border-b-2 border-gray-700 h-8  text-sm flex justify-center flex-col")
                                    .append("span")
                                    .text(`${lastEnreg.key}`);

                                bufferElement.select(".bloc .bloc-header .bloc-nb")
                                    .text(`NB=${currBlock.nb}`);

                                await sleep(1000);

                                // write buffer in MS
                                this.updateBlockInMS(i, currBlock);
                            }

                        } else { // else, insert it in the next block (i + 1), in the next iteration
                            if (animate) {
                                // write buffer in MS
                                this.updateBlockInMS(i, currBlock);
                            }

                            this.blocks[i] = currBlock;  // save current block in the blocks array
                            writeTimes++;

                            // before going to the next iteration we make sure that we update the index table
                            this.indexTable[i].key = this.blocks[i].enregs[currBlock.nb - 1].key;
                            this.indexTable[i].i = i;
                            this.indexTable[i].j = currBlock.nb - 1;

                            i += 1;
                            j = 0;

                            newEnreg = lastEnreg;
                        }
                    }

                }

                if (i > this.nbBlocks - 1) {
                    let address = this.setBlockAddress(this.blocks.length - 1);
                    let newBlock = new Block([newEnreg], 1, address);
                    this.blocks.push(newBlock);
                    this.indexTable.push(new IndexCouple(key, this.nbBlocks, j))
                    writeTimes++;
                    this.nbBlocks += 1;

                    if (animate) {
                        this.createNewBlockInBuff(newEnreg);

                        await sleep(1000);

                        // write buffer in MS
                        this.updateBlockInMS(i, newBlock);
                    }
                }
            }

            this.nbInsertions += 1;

            if (animate) {
                this.updateIOTimes(readTimes, writeTimes);
                this.updateMCDescription("Insertion was successful", "success");
            }

            this.createIndexTableDOM()
            return true;
        }
    }
}
