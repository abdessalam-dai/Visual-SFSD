import ListFile from '../../structres/ListFile.js';
import Enreg from '../../structres/Enreg.js';
import Block from '../../structres/Block.js';
import {MAX_NB_BLOCKS, MAX_NB_ENREGS_DEFAULT} from "../../../constants.js";


export default class LOF extends ListFile {
    search(key, animate = false) {
        let i = this.headIndex;
        let iPrev;
        let j = 0;
        let readTimes = 0;
        let found = false;
        let stop = false;
        let currBlock;

        if (i === -1) { // when the first element is inserted
            return {
                found: false,
                pos: {
                    i: this.randomBlockIndex(),
                    j: 0
                },
                readTimes: 0
            }
        }

        while (i !== -1 && !found && !stop) {
            currBlock = this.blocks[i];
            readTimes++;
            j = 0;

            while (j < currBlock.nb && !found && !stop) {
                if (currBlock.enregs[j].key === key) {
                    found = true;
                    return {
                        found: true,
                        pos: {
                            i: i,
                            j: j
                        },
                        readTimes: readTimes
                    }
                } else if (currBlock.enregs[j].key < key) {
                    j++;
                } else { // currBlock.enregs[j].key > key
                    stop = true;
                    return {
                        found: false,
                        pos: {
                            i: i,
                            j: j
                        },
                        readTimes: readTimes
                    }
                }
            }

            if (!found) {
                iPrev = i;
                i = currBlock.nextBlockIndex;
            }
        }

        if (!found) {
            if (currBlock.nb < MAX_NB_ENREGS_DEFAULT) {
                i = iPrev;
            } else {
                i = this.randomBlockIndex();
                j = 0;
            }
        }

        // if (i === -1) {
        //     i = iPrev;
        // }

        return {
            found: found,
            pos: {
                i: i,
                j: j
            },
            readTimes: readTimes
        }
    }

    insert(key, field1, field2, removed = false, animate) {
        let searchResults = this.search(key, animate);

        let found = searchResults.found,
            i = searchResults.pos.i,
            j = searchResults.pos.j;

        let readTimes = searchResults.readTimes;
        let writeTimes = 0;

        let currBlock;

        if (found) {
            return false;
        } else {
            let newEnreg = new Enreg(key, field1, field2, removed); // create a new enreg.

            if (this.blocks.filter((block) => block === null).length === MAX_NB_BLOCKS) {
                // create new block
                let address = this.setBlockAddress(i);
                this.blocks[i] = new Block([newEnreg], 1, address, -1);
                writeTimes++;
                this.nbBlocks++;

                this.headIndex = i;
                this.tailIndex = i;

                return true;
            }

            let continueShifting = true;
            let currBlock, lastIndex, lastEnreg, k;

            while (continueShifting && this.blocks[i] !== null) {
                currBlock = this.blocks[i];
                readTimes++;

                // if (animate) {
                //         this.updateIOTimes(readTimes, writeTimes);
                //
                //         midBlockElement = this.MSBoard.select(`.bloc:nth-child(${i + 1})`)
                //
                //         await this.traverseBlockAnimation(i, delay);
                //
                //         bufferElement = this.updateBufferElement(midBlockElement);
                //
                //         jthElement = bufferElement
                //             .select(`.bloc-body ul li:nth-child(${j + 1})`)
                //             .style("background", ENREG_HIGHLIGHT_PURPLE);
                //
                //         await sleep(1000);
                //     }

                lastIndex = currBlock.nb - 1;
                lastEnreg = currBlock.enregs[lastIndex]; // save the last enreg.

                k = lastIndex;

                while (k > j) {
                    currBlock.enregs[k] = currBlock.enregs[k - 1];

                    // if (animate) {
                    //         currElement = bufferElement
                    //             .select(`.bloc-body ul li:nth-child(${k + 1})`)
                    //             .style("background", ENREG_HIGHLIGHT_GREEN);
                    //
                    //         currElement.select("span")
                    //             .transition()
                    //             .ease(d3.easeLinear)
                    //             .duration(500 * delay)
                    //             .style("transform", "translate(0, +40px)")
                    //             .transition()
                    //             .duration(0)
                    //             .style("transform", "translate(0, -40px)")
                    //             .text(`${currBlock.enregs[k - 1].key}`)
                    //             .transition()
                    //             .duration(500 * delay)
                    //             .style("transform", "translate(0, 0)");
                    //
                    //         await sleep(1000);
                    //
                    //         currElement
                    //             .style("background", ENREG_HIGHLIGHT_GREY);
                    //     }

                    k -= 1;
                }

                // insert the enreg. at position j
                currBlock.enregs[j] = newEnreg;

                if (j === currBlock.nb) {
                    continueShifting = false;
                    currBlock.nb += 1;
                    this.blocks[i] = currBlock;  // save current block in the blocks array
                    writeTimes++;

                    // if (animate) {
                    //     bufferElement.select(".bloc .bloc-body ul")
                    //         .append("li")
                    //         .style("background", ENREG_HIGHLIGHT_GREEN)
                    //         .attr("class", "border-b-2 h-10 flex justify-center flex-col")
                    //         .append("span")
                    //         .text(`${newEnreg.key}`);
                    //
                    //     bufferElement.select(".bloc .bloc-header .bloc-nb")
                    //         .text(`NB=${currBlock.nb}`);
                    //
                    //     await sleep(1000);
                    //
                    //     // write buffer in MS
                    //     this.updateBlockInMS(i, currBlock);
                    // }
                } else {
                    if (currBlock.nb < this.maxNbEnregs) {
                        // if the current block is not full, then insert the last enreg. at the end
                        currBlock.nb += 1;
                        currBlock.enregs[currBlock.nb - 1] = lastEnreg;
                        this.blocks[i] = currBlock;  // save current block in the blocks array
                        writeTimes++;
                        continueShifting = false;

                        // if (animate) {
                        //     bufferElement.select(".bloc .bloc-body ul")
                        //         .append("li")
                        //         .style("background", ENREG_HIGHLIGHT_GREEN)
                        //         .attr("class", "border-b-2 h-10 flex justify-center flex-col")
                        //         .append("span")
                        //         .text(`${lastEnreg.key}`);
                        //
                        //     bufferElement.select(".bloc .bloc-header .bloc-nb")
                        //         .text(`NB=${currBlock.nb}`);
                        //
                        //     await sleep(1000);
                        //
                        //     // write buffer in MS
                        //     this.updateBlockInMS(i, currBlock);
                        // }

                    } else { // else, insert it in the next block (new random index), in the next iteration
                        // if (animate) {
                        //     // write buffer in MS
                        //     this.updateBlockInMS(i, currBlock);
                        // }
                        if (currBlock.nextBlockIndex === -1) { // in case there is no next block, create one
                            currBlock.nextBlockIndex = this.randomBlockIndex()
                            this.tailIndex = currBlock.nextBlockIndex; // update the tail index
                            console.log("test")
                        }
                        this.blocks[i] = currBlock;  // save current block in the blocks array
                        writeTimes++;

                        i = currBlock.nextBlockIndex;
                        j = 0;
                        newEnreg = lastEnreg;
                    }
                }
            }

            if (this.blocks[i] === null) {
                let tailBlock = this.blocks[this.tailIndex];
                if (tailBlock) {
                    tailBlock.nextBlockIndex = i;
                    this.blocks[this.tailIndex] = tailBlock;
                    writeTimes++
                }

                let address = this.setBlockAddress(i);
                this.blocks[i] = new Block([newEnreg], 1, address, -1);
                writeTimes++;
                this.nbBlocks += 1;

                // if (animate) {
                //     this.createNewBlockInBuff(newEnreg);
                //
                //     await sleep(1000);
                //
                //     // write buffer in MS
                //     this.updateBlockInMS(i, newBlock);
                // }
            }

            this.nbInsertions++;
            console.log(this.blocks)
            return true;
        }
    }


    // removeLogically(key) {
    //     let {found, pos, readTimes} =  this.search(key);
    //     let {i, j} = pos;
    //     let writeTimes;
    //
    //     if (found) {
    //         this.blocks[i].enregs[j].removed = true;
    //         writeTimes = 1;
    //         return true;
    //     }
    //     else {
    //         return false;
    //     }
    // }

    // removePhysically(key) {
    //     let {found , pos , readTimes} = this.search(key);
    //     let {i , j} = pos;
    //     let indexOfLastEnreg = this.blocks[this.blocks.length - 1].nb -1;
    //     let lastEnreg = this.blocks[this.blocks.length - 1].enregs[indexOfLastEnreg]
    //     if (found) {
    //         // we replace the enreg to delete physically with the last enreg;
    //         this.blocks[i].enregs[j] = lastEnreg;
    //
    //         // if the last enreg is the only enreg in the block
    //         if (indexOfLastEnreg === 0) {
    //             this.blocks[this.blocks.length - 1].enregs.pop(); // in reality just an extra instruction
    //             this.blocks.pop();
    //             this.nbBlocks--;
    //         } else {
    //             this.blocks[this.blocks.length - 1].enregs.pop();
    //             this.blocks[this.blocks.length - 1].nb--;
    //         }
    //
    //         this.nbInsertions--;
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }

    // editEnreg(key, field1, field2, removed) {
    //     let {found, pos, readTimes} =  this.search(key);
    //     let {i, j} = pos;
    //     let writeTimes;
    //
    //     if (found) {
    //         let block = this.blocks[i];
    //         block.enregs[j].field1 = field1;
    //         block.enregs[j].field2 = field2;
    //         block.enregs[j].removed = removed;
    //         writeTimes = 1;
    //
    //         return true;
    //     } else {
    //         return false;
    //     }
    //
    // }

    // setBlockAddress(index) {
    //
    //     if (index === 0) {
    //         if (this.blocks.length === 0) {
    //             return Math.floor(Math.random() * 10000000000).toString(16);
    //         } else {
    //             return Number((ENREG_SIZE + 1) + parseInt(this.blocks[0].blockAddress, 16)).toString(16)
    //         }
    //     } else {
    //         return Number(index * ENREG_SIZE + parseInt(this.blocks[0].blockAddress, 16)).toString(16)
    //     }
    // }
}