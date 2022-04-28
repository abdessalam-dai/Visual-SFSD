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
import Enreg from '../../structres/Enreg.js';
import Block from '../../structres/Block.js';
import {
    BLOCKS_DEFAULT, ENREG_HIGHLIGHT_GREEN, ENREG_HIGHLIGHT_GREY, ENREG_HIGHLIGHT_PURPLE,
    MAX_NB_BLOCKS,
    MAX_NB_ENREGS_DEFAULT,
    NB_BLOCKS_DEFAULT,
    NB_INSERTIONS_DEFAULT
} from "../../../constants.js";
import IndexCouple from "../../structres/IndexCouple.js";
import {delay, sleep} from "../../../view_file/shared/animationSpeed.js";


export default class Clustered extends TableFile {
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

    search(key, animate = false) {
        console.log('starting the search process')
        let start = 0, end = this.indexTable.length - 1;
        // Iterate while start not meets end
        while (start <= end) {
            // Find the mid index
            let mid = Math.floor((start + end) / 2);
            // If element is present at mid, return True
            if (this.indexTable[mid].key === key) {
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
        }
        if (start > end) { //this can be removed but i left so you understand algorithm
            if (start > this.indexTable.length - 1) { // when the searched key is bigger than the keys in the index table
                return { //insertion at the very end
                    found: false,
                    pos: {
                        k: this.indexTable.length - 1 // position in index table, we return the last bloc
                    }
                }
            } else { //insertion normally, we take the block refered to by element k in the index (call indexTable[k].i)

                return {
                    found: false,
                    pos: {
                        k: start
                    }
                }
            }
        }

    }

    searchMS(key, animate = false) {
        let searchResult = this.search(key);
        let indexInIndexTable = searchResult.pos.k;
        if (indexInIndexTable === -1) {
            // the case where the there is no block yet
            return {
                found: false,
                pos: {
                    i: 0,
                    j: 0
                }

            }
        }
        console.log({indexInIndexTable}, this.indexTable)
        let found = this.search(key).found;
        let block = this.blocks[this.indexTable[indexInIndexTable].i]


        if (found) {
            // found is true no insertion is possible
            return {
                found: true,
                pos: {
                    i: indexInIndexTable,
                    j: searchResult.pos.j
                }
            }
        } else {
            // binary search
            // Define Start and End Index
            let startIndex = 0;
            let endIndex = block.enregs.length - 1;

            // While Start Index is less than or equal to End Index
            while (startIndex <= endIndex) {
                let middleIndex = Math.floor((startIndex + endIndex) / 2);
                if (key === block.enregs[middleIndex].key) {
                    return {
                        found: true,
                        pos: {
                            i: indexInIndexTable,
                            j: middleIndex,
                        }
                    }
                }

                // Search Right Side Of Array
                else if (key > block.enregs[middleIndex].key) {
                    // Assign Start Index and increase the Index by 1 to narrow search
                    startIndex = middleIndex + 1;
                }
                // Search Left Side Of Array
                if (key < block.enregs[middleIndex].key) {
                    // Assign End Index and increase the Index by 1 to narrow search
                    endIndex = middleIndex - 1;
                }
            }
            // If Target Is Not Found

            if (endIndex + 1 >= MAX_NB_ENREGS_DEFAULT) {
                return {
                    found: false,
                    pos: {
                        i: this.indexTable[indexInIndexTable].i + 1,
                        j: 0,
                    }
                }
            }

            return {
                found: false,
                pos: {
                    i: this.indexTable[indexInIndexTable].i,
                    j: endIndex + 1,
                }
            }
        }

    }

    async insert(key, field1, field2, removed = false, animate) {
        if (!this.isInsertionAllowed()) {
            if (animate) {
                this.updateMCDescription("Insertion is impossible! Maximum number of blocks has been reached", "error");
            }

            return false;
        }

        let searchResults = await this.searchMS(key, animate);
        console.log(searchResults);
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
                        console.log(this.indexTable[i])
                        console.log(lastEnreg)
                        this.indexTable[i].key = newEnreg.key;
                        this.indexTable[i].i = i;
                        this.indexTable[i].j = currBlock.nb;
                        currBlock.nb += 1;
                        writeTimes++;

                        if (animate) {
                            bufferElement.select(".bloc .bloc-body ul")
                                .append("li")
                                .style("background", ENREG_HIGHLIGHT_GREEN)
                                .attr("class", "border-b-2 h-10 flex justify-center flex-col")
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
                                    .attr("class", "border-b-2 h-10 flex justify-center flex-col")
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

                            // before going to the next iteraion we make sure that we update the index table
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


    removeLogically(key, animate = false) {
        let {
            found: found,
            pos: pos
        } = this.search(key);

        if (found) {
            this.blocks[pos.i].enregs[pos.j].removed = true;
            return true;
        }
        return false;
    }

    editEnreg(key, field1, field2, removed = false, animate = false) {
        let {
            found: found,
            pos: pos
        } = this.search(key);

        if (found) {
            this.blocks[pos.i].enregs[pos.j].field1 = field1;
            this.blocks[pos.i].enregs[pos.j].field2 = field2;
            // this.blocks[pos.i].enregs[pos.j].removed = removed;
            return true;
        }
        return false;
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
}
