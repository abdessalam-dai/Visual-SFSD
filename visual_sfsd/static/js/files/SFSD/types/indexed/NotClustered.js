import Enreg from '../../structres/Enreg.js';
import Block from '../../structres/Block.js';
import {
    BLOCKS_DEFAULT,
    MAX_NB_BLOCKS,
    MAX_NB_ENREGS_DEFAULT,
    NB_BLOCKS_DEFAULT,
    NB_INSERTIONS_DEFAULT
} from "../../../constants.js";
import IndexCouple from "../../structres/IndexCouple.js";
import IndexedFile from "../../structres/IndexedFile.js";


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
            blocks,
            indexTable,
            maxIndex,
            indexTableHtml
        );
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
        return { //if start > end we set the insert position to start
            found: false,
            pos: {
                i: -1,
                j: -1,
                k: start, // position in index table
            }
        }

    }

    async insert(key, field1, field2, removed = false, animate = false) {
        let readTimes, writeTimes = 0;
        // let i , j = 0;
        if (this.indexTable.length === this.maxIndex) {
            return false
        }

        console.log(this.search(key))
        console.log(this.blocks)
        let {
            found: found,
            pos: pos
        } = this.search(key);

        if (!found) {
            //insert f file at the end
            // if (animate) {
            //     this.updateMCDescription(`Element with key=${key} should be positioned in the block ${i}, position ${j}`, "success");
            // }

            let newEnreg = new Enreg(key, field1, field2, removed); // create a new enreg.

            //handle the case when it's the first time we create a block
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

                // if (animate) {
                //     this.updateIOTimes(readTimes, writeTimes);

                //     lastBlockElement = this.MSBoard.select(`.bloc:nth-child(${i + 1})`)

                //     await this.traverseBlockAnimation(i, delay);

                //     bufferElement = this.updateBufferElement(lastBlockElement);

                //     await sleep(1000);
                // }

                // if the last block is not full, then insert the new enreg. at the end
                if (lastBlock.enregs.length < this.maxNbEnregs) {
                    lastBlock.enregs.push(newEnreg);
                    lastBlock.nb++;
                    this.blocks[i] = lastBlock;
                    writeTimes++;

                    // if (animate) {
                    //     bufferElement.select(".bloc .bloc-body ul")
                    //         .append("li")
                    //         .style("background", ENREG_HIGHLIGHT_GREEN)
                    //         .attr("class", "border-b-2 h-10 flex justify-center flex-col")
                    //         .append("span")
                    //         .text(`${newEnreg.key}`);

                    //     bufferElement.select(".bloc .bloc-header .bloc-nb")
                    //         .text(`NB=${lastBlock.nb}`);

                    //     await sleep(1000);

                    //     // write buffer in MS
                    //     this.updateBlockInMS(i, lastBlock);
                    // }
                } else {
                    // else, create a new block and append to it the new enreg.
                    let address = this.setBlockAddress(this.blocks.length - 1);
                    let newBlock = new Block([newEnreg], 1, address);
                    this.blocks.push(newBlock);
                    writeTimes++;
                    this.nbBlocks += 1;
                    // if (animate) {
                    //     this.createNewBlockInBuff(newEnreg);

                    //     await sleep(1000);

                    //     // write buffer in MS
                    //     this.updateBlockInMS(i, newBlock);
                    // }
                }
            }

            // if (animate) {
            //     this.updateIOTimes(readTimes, writeTimes);
            //     this.updateMCDescription("Insertion was successful", "success");
            // }

            this.nbInsertions += 1; // increment the number of insertion in the file

            let m = this.indexTable.length;
            this.indexTable.push(-1)
            while (m > pos.k) {
                this.indexTable[m] = this.indexTable[m - 1]
                m--;
            }
            this.indexTable[pos.k] = new IndexCouple(key, this.blocks.indexOf(this.blocks[this.blocks.length - 1]), this.blocks[this.blocks.length - 1].nb - 1);
            console.table(this.indexTable)
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
}