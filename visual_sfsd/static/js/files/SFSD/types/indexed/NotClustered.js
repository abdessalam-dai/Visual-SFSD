import Enreg from '../../structres/Enreg.js';
import Block from '../../structres/Block.js';
import {
    BLOCKS_DEFAULT, ENREG_HIGHLIGHT_GREEN, ENREG_HIGHLIGHT_GREY, ENREG_HIGHLIGHT_RED,
    MAX_NB_BLOCKS,
    MAX_NB_ENREGS_DEFAULT,
    NB_BLOCKS_DEFAULT,
    NB_INSERTIONS_DEFAULT
} from "../../../constants.js";
import IndexCouple from "../../structres/IndexCouple.js";
import IndexedFile from "../../structres/IndexedFile.js";
import {sleep, delay} from "../../../view_file/shared/animationSpeed.js";


export default class NotClustered extends IndexedFile {
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

    async search(key, animate = false) {
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

                if (animate) {
                    this.updateMCDescription("Element was found", "success");
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
                await sleep(2000);
            }
        }

        if (animate) {
            this.updateMCDescription("Element was not found", "error");
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

    isInsertionAllowed() {
        return this.nbInsertions < this.maxIndex;
    }

    async insert(key, field1, field2, removed = false, animate = false) {
        let readTimes = 0,
            writeTimes = 0;

        if (!this.isInsertionAllowed()) {
            if (animate) {
                this.updateMCDescription("Insertion is impossible! Maximum size of the index table has been reached", "error");
            }
            return false;
        }

        let {
            found: found,
            pos: pos
        } = await this.search(key, animate);

        let lastBlockElement;
        let bufferElement;

        if (found) {
            if (animate) {
                this.updateMCDescription(`Insertion is impossible! An element with key=${key} already exists`, "error");
            }

            return false;
        } else {
            let newEnreg = new Enreg(key, field1, field2, removed); // create a new enreg.

            // handle the case when it's the first time we create a block
            if (this.blocks.length === 0) {
                let address = this.setBlockAddress(0);
                let newBlock = new Block([newEnreg], 1, address);
                this.blocks.push(newBlock);
                this.nbBlocks += 1;
                writeTimes++;
            } else {
                let i = this.blocks.length - 1
                let lastBlock = this.blocks[i];
                readTimes++;

                if (animate) {
                    this.updateIOTimes(readTimes, writeTimes);

                    lastBlockElement = this.MSBoard.select(`.bloc:nth-child(${i + 1})`)

                    await this.traverseBlockAnimation(i, delay);

                    bufferElement = this.updateBufferElement(lastBlockElement);

                    await sleep(1000);
                }

                // if the last block is not full, then insert the new enreg. at the end
                if (lastBlock.enregs.length < this.maxNbEnregs) {
                    lastBlock.enregs.push(newEnreg);
                    lastBlock.nb++;
                    this.blocks[i] = lastBlock;
                    writeTimes++;

                    if (animate) {
                        bufferElement.select(".bloc .bloc-body ul")
                            .append("li")
                            .style("background", ENREG_HIGHLIGHT_GREEN)
                            .attr("class", "border-b-2 h-10 flex justify-center flex-col")
                            .append("span")
                            .text(`${newEnreg.key}`);

                        bufferElement.select(".bloc .bloc-header .bloc-nb")
                            .text(`NB=${lastBlock.nb}`);

                        await sleep(1000);

                        // write buffer in MS
                        this.updateBlockInMS(i, lastBlock);
                    }
                } else {
                    // else, create a new block and append to it the new enreg.
                    let address = this.setBlockAddress(this.blocks.length - 1);
                    let newBlock = new Block([newEnreg], 1, address);
                    this.blocks.push(newBlock);
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

            this.nbInsertions += 1; // increment the number of insertion in the file
            if (animate) {
                this.updateIOTimes(readTimes, writeTimes);
                this.updateMCDescription("Insertion was successful", "success");
            }

            let m = this.indexTable.length;
            this.indexTable.push(-1);

            this.indexTableHtml
                .select(`.cell:nth-child(${pos.k + 1})`)
                .classed("bg-orange-400", true);
            while (m > pos.k) {
                this.indexTable[m] = this.indexTable[m - 1];

                if (animate) {
                    let currCell = this.indexTableHtml
                        .select(`.cell:nth-child(${m + 1})`)
                        .classed("bg-green-400", true)
                        .classed("bg-gray-100", false);

                    // shift key
                    currCell.select(".key div")
                        .transition()
                        .ease(d3.easeLinear)
                        .duration(500 * delay)
                        .style("transform", "translate(+50px, 0)")
                        .transition()
                        .duration(0)
                        .style("transform", "translate(-50px, 0)")
                        .text(`${this.indexTable[m - 1].key}`)
                        .transition()
                        .duration(500 * delay)
                        .style("transform", "translate(0, 0)");

                    // shift pos-i
                    currCell.select(".pos-i div")
                        .transition()
                        .ease(d3.easeLinear)
                        .duration(700 * delay)
                        .style("transform", "translate(+50px, 0)")
                        .transition()
                        .duration(0)
                        .style("transform", "translate(-50px, 0)")
                        .text(`${this.indexTable[m - 1].i}`)
                        .transition()
                        .duration(700 * delay)
                        .style("transform", "translate(0, 0)");

                    // shift pos-j
                    currCell.select(".pos-j div")
                        .transition()
                        .ease(d3.easeLinear)
                        .duration(700 * delay)
                        .style("transform", "translate(+50px, 0)")
                        .transition()
                        .duration(0)
                        .style("transform", "translate(-50px, 0)")
                        .text(`${this.indexTable[m - 1].j}`)
                        .transition()
                        .duration(700 * delay)
                        .style("transform", "translate(0, 0)");

                    await sleep(1400);

                    currCell.classed("bg-gray-100", true);
                    currCell.classed("bg-green-400", false);
                }

                m--;
            }
            this.indexTable[pos.k] = new IndexCouple(key, this.blocks.indexOf(this.blocks[this.blocks.length - 1]), this.blocks[this.blocks.length - 1].nb - 1);

            return true;
        }
    }
}