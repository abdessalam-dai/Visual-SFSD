import ListFile from '../../structres/ListFile.js';
import Enreg from '../../structres/Enreg.js';
import Block from '../../structres/Block.js';
import {
    ENREG_HIGHLIGHT_GREEN,
    ENREG_HIGHLIGHT_GREY, ENREG_HIGHLIGHT_ORANGE,
    ENREG_HIGHLIGHT_PURPLE, ENREG_HIGHLIGHT_RED,
} from "../../../constants.js";
import {delay, sleep} from "../../../view_file/shared/animationSpeed.js";


export default class LOF extends ListFile {
    async search(key, animate = false) {
        let i = this.headIndex;
        let iPrev;
        let j = 0;
        let readTimes = 0;
        let found = false;
        let stop = false;
        let currBlock;

        let currBlockElement;
        let bufferElement;
        let currElement;
        let elementBGColor;

        let isBlocksLengthExceeded = false;

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

            let currBlockNb = currBlock.enregs.length;

            let firstKey = currBlock.enregs[0].key,
                lastKey = currBlock.enregs[currBlockNb - 1].key;

            if (animate) {
                console.log(this.blocks[i]);
                console.log(i);

                currBlockElement = this.MSBoard.select(`.bloc:nth-child(${i + 1})`);

                await this.traverseBlockAnimation(i, delay);
                // await this.highlightInstruction(5);

                bufferElement = this.updateBufferElement(currBlockElement);

                this.updateIOTimes(readTimes, 0);
            }

            // local search for enreg. inside block
            // if (animate) await this.highlightInstruction(6);
            if (key >= firstKey && key <= lastKey) {
                if (animate) {
                    this.updateMCDescription(`${key} ∈ [${firstKey}, ${lastKey}]`, "success");
                    await sleep(1000);

                    // await this.highlightInstruction(7);
                }

                let eLow = 0,
                    eHigh = currBlock.enregs.length - 1;

                // if (animate) await this.highlightInstruction(8);
                while (eLow <= eHigh && !found && !stop) {
                    j = Math.floor((eLow + eHigh) / 2);
                    console.log("j = ", j)

                    // if (animate) await this.highlightInstruction(10);

                    let currKey = currBlock.enregs[j].key;

                    if (animate) {
                        currElement = bufferElement.select(".bloc-body ul")
                            .select(`li:nth-child(${j + 1})`);
                    }

                    // if (animate) await this.highlightInstruction(11);
                    if (key === currKey) {
                        found = true;
                        // if (animate) await this.highlightInstruction(12);

                        if (animate) {
                            elementBGColor = ENREG_HIGHLIGHT_GREEN;
                        }
                    } else {
                        // if (animate) await this.highlightInstruction(14);
                        if (key < currKey) {
                            eHigh = j - 1;
                            // if (animate) await this.highlightInstruction(15);

                            if (animate) {
                                elementBGColor = ENREG_HIGHLIGHT_RED;
                            }
                        } else {
                            // if (animate) await this.highlightInstruction(16);
                            eLow = j + 1;
                            // if (animate) await this.highlightInstruction(17);

                            if (animate) {
                                elementBGColor = ENREG_HIGHLIGHT_RED;
                            }
                        }
                    }

                    if (animate) {
                        currElement
                            .transition()
                            .duration(600 * delay)
                            .style("background", elementBGColor)
                            .transition()
                            .delay(600 * delay)
                            .duration(300 * delay)
                            .style("background", ENREG_HIGHLIGHT_GREY);
                        await sleep(1000);
                    }
                }

                // if (animate) await this.highlightInstruction(21);
                if (eLow > eHigh) {
                    j = eLow;
                    // if (animate) await this.highlightInstruction(22);
                }
                stop = true;
                // if (animate) await this.highlightInstruction(24);
            } else if (key > lastKey) {
                if (animate) {
                    this.updateMCDescription(`${key} ∉ [${firstKey}, ${lastKey}]`, "error");
                    await sleep(1000);
                }
            } else {
                if (animate) {
                    this.updateMCDescription(`${key} ∉ [${firstKey}, ${lastKey}]`, "error");
                    await sleep(1000);
                }

                stop = true;
            }

            if (!found && !stop) {
                iPrev = i;
                i = currBlock.nextBlockIndex;
            }

            if (animate) {
                await sleep(1000);
            }
        }

        if (!found && !stop) {
            if (currBlock.nb < this.maxNbEnregs) {
                i = iPrev;
                j = currBlock.nb;
            } else {
                i = this.randomBlockIndex();
                isBlocksLengthExceeded = true;
                j = 0;
            }
        }

        if (animate) {
            if (found) {
                this.updateMCDescription(`Element with key=${key} was found in the block ${i}, position ${j}`, "success");
            } else {
                this.updateMCDescription(`Element with key=${key} was not found, it should be positioned in the block ${i}, position ${j}`, "error");
            }

            currElement = bufferElement.select(".bloc-body ul")
                .select(`li:nth-child(${j + 1})`);

            if (!currElement) {
                currElement = bufferElement.select(".bloc-body ul")
                    .select(`li:nth-child(${j + 1})`);
            }

            if (!isBlocksLengthExceeded) {
                currElement
                    .transition()
                    .duration(300 * delay)
                    .style("background", elementBGColor);
            }

            this.changeHeadAndTailBgs();
            await sleep(2000);
        }

        return {
            found: found,
            pos: {
                i: i,
                j: j
            },
            readTimes: readTimes
        }
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

            let newEnreg = new Enreg(key, field1, field2, removed); // create a new enreg.

            if (this.blocks.filter((block) => block === null).length === this.maxNbBlocks) {
                // create new block if there is no block at all
                let address = this.setBlockAddress(i);
                this.blocks[i] = new Block([newEnreg], 1, address, -1);
                writeTimes++;
                this.nbBlocks++;

                this.headIndex = i;
                this.tailIndex = i;

                return true;
            }

            if (this.blocks[i] === null) {
                // create new block if there is none at position i
                let address = this.setBlockAddress(i);
                this.blocks[i] = new Block([newEnreg], 1, address, -1);
                writeTimes++;
                this.nbBlocks++;

                let tailBlock = this.blocks[this.tailIndex];
                readTimes++;
                tailBlock.nextBlockIndex = i;
                writeTimes++;

                this.tailIndex = i;

                return true;
            }

            let continueShifting = true;
            let currBlock, lastIndex, lastEnreg, k;

            while (continueShifting && this.blocks[i] !== null) {
                currBlock = this.blocks[i];
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
                lastEnreg = currBlock.enregs[lastIndex]; // save the last enreg.

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

                if (j === currBlock.nb) {
                    continueShifting = false;
                    currBlock.nb += 1;
                    this.blocks[i] = currBlock;  // save current block in the blocks array
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

                    } else { // else, insert it in the next block (new random index), in the next iteration
                        if (animate) {
                            // write buffer in MS
                            this.updateBlockInMS(i, currBlock);
                        }
                        if (currBlock.nextBlockIndex === -1) { // in case there is no next block, create one
                            currBlock.nextBlockIndex = this.randomBlockIndex();
                            this.tailIndex = currBlock.nextBlockIndex; // update the tail index

                            this.blocks[i] = currBlock;  // save current block in the blocks array
                            writeTimes++;

                            if (animate) { // update the next in the buffer first
                                bufferElement.select(".bloc .bloc-next span")
                                    .text(currBlock.nextBlockIndex);
                                await sleep(1000);
                            }
                        }

                        i = currBlock.nextBlockIndex;
                        j = 0;
                        newEnreg = lastEnreg;
                        // }
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

                    if (animate) {
                        this.createNewBlockInBuff(newEnreg);

                        await sleep(1000);

                        // write buffer in MS
                        this.updateBlockInMS(i, this.blocks[i]);
                    }
                }

                this.nbInsertions++;
                return true;
            }
        }
    }

    // didn't make the remove physically function, because we don't have it in the course

    // removePhysically(key, animate = false) {
    //         let {found, pos, readTimes} = this.search(key, animate);
    //         let {i, j} = pos;
    //         let writeTimes = 0;
    //
    //         let midBlockElement;
    //         let bufferElement;
    //         let buffer2Element;
    //         let jthElement;
    //         let currElement;
    //         let nextBlockElement;
    //         let nextFirstElement;
    //
    //         if (found) {
    //             let continueShifting = true;
    //
    //             while (continueShifting) {
    //                 let currBlock = this.blocks[i];
    //                 readTimes++;
    //
    //                 // if (animate) {
    //                 //     this.updateIOTimes(readTimes, writeTimes);
    //                 //
    //                 //     midBlockElement = this.MSBoard.select(`.bloc:nth-child(${i + 1})`)
    //                 //
    //                 //     await this.traverseBlockAnimation(i, delay);
    //                 //
    //                 //     bufferElement = this.updateBufferElement(midBlockElement, 1);
    //                 //
    //                 //     jthElement = bufferElement
    //                 //         .select(`.bloc-body ul li:nth-child(${j + 1})`)
    //                 //         .style("background", ENREG_HIGHLIGHT_PURPLE);
    //                 //
    //                 //     await sleep(1000);
    //                 // }
    //
    //                 if (currBlock.nb === 1) { // if this is the only element in the last block
    //                     // update the tail block index
    //                     let x = this.headIndex;
    //                     let xPrev = x;
    //                     let block = this.blocks[x];
    //                     readTimes++;
    //
    //                     while (block.nextBlockIndex !== i) {
    //                         xPrev = x;
    //                         x = block.nextBlockIndex;
    //                         block = this.blocks[x];
    //                         readTimes++;
    //                         if (!block) {
    //                             break;
    //                         }
    //                     }
    //
    //                     this.tailIndex = x;
    //
    //                     if (block) {
    //                         block.nextBlockIndex = -1;
    //                         this.blocks[xPrev] = block;
    //                         writeTimes++;
    //                     } else { // when the enreg. is the only in the file
    //                         this.headIndex = -1;
    //                         this.tailIndex = -1;
    //                     }
    //
    //                     this.blocks[i] = null;
    //                     this.nbBlocks -= 1;
    //                     continueShifting = false;
    //                 } else {
    //                     let k = j;
    //                     while (k <= currBlock.nb - 2) {
    //                         currBlock.enregs[k] = currBlock.enregs[k + 1];
    //
    //                         // if (animate) {
    //                         //     currElement = bufferElement
    //                         //         .select(`.bloc-body ul li:nth-child(${k + 1})`)
    //                         //         .style("background", ENREG_HIGHLIGHT_GREEN);
    //                         //
    //                         //     currElement.select("span")
    //                         //         .transition()
    //                         //         .ease(d3.easeLinear)
    //                         //         .duration(300 * delay)
    //                         //         .style("transform", "translate(0, -40px)")
    //                         //         .transition()
    //                         //         .duration(0)
    //                         //         .style("transform", "translate(0, +40px)")
    //                         //         .text(`${currBlock.enregs[k + 1].key}`)
    //                         //         .transition()
    //                         //         .duration(300 * delay)
    //                         //         .style("transform", "translate(0, 0)");
    //                         //
    //                         //     await sleep(600);
    //                         //
    //                         //     currElement
    //                         //         .style("background", ENREG_HIGHLIGHT_GREY);
    //                         // }
    //
    //                         k++;
    //                     }
    //
    //                     // the block is not full (nb < B) OR (i) is the last block
    //                     if ((currBlock.nb !== MAX_NB_ENREGS_DEFAULT) || (i === this.tailIndex)) {
    //                         continueShifting = false;
    //                         currBlock.enregs.pop();
    //                         currBlock.nb -= 1;
    //
    //                         // if (animate) {
    //                         //     currElement = bufferElement
    //                         //         .select(`.bloc-body ul li:nth-child(${currBlock.nb + 1})`)
    //                         //         .style("background", ENREG_HIGHLIGHT_PURPLE);
    //                         //
    //                         //     currElement.select("span")
    //                         //         .transition()
    //                         //         .ease(d3.easeLinear)
    //                         //         .duration(300 * delay)
    //                         //         .style("transform", "translate(-150px, 0)");
    //                         //
    //                         //     await sleep(300);
    //                         //
    //                         //     currElement.remove();
    //                         //
    //                         //     bufferElement.select(".bloc .bloc-header .bloc-nb")
    //                         //         .text(`NB=${currBlock.nb}`);
    //                         //
    //                         //     // write buffer in MS
    //                         //     this.updateBlockInMS(i, currBlock);
    //                         // }
    //
    //                         this.blocks[i] = currBlock; // write dir
    //                         writeTimes++;
    //                     } else {
    //                         let nextBlock = this.blocks[currBlock.nextBlockIndex];
    //                         readTimes++;
    //
    //                         // if (animate) {
    //                         //     this.updateIOTimes(readTimes, writeTimes);
    //                         //
    //                         //     nextBlockElement = this.MSBoard.select(`.bloc:nth-child(${i + 2})`);
    //                         //
    //                         //     await this.traverseBlockAnimation(i + 1, delay);
    //                         //
    //                         //     buffer2Element = this.updateBufferElement(nextBlockElement, 2);
    //                         //
    //                         //     nextFirstElement = buffer2Element
    //                         //         .select(`.bloc-body ul li:nth-child(1)`)
    //                         //         .transition()
    //                         //         .ease(d3.easeLinear)
    //                         //         .duration(300 * delay)
    //                         //         .style("background", ENREG_HIGHLIGHT_PURPLE);
    //                         //
    //                         //     await sleep(2000);
    //                         //
    //                         //     currElement = bufferElement
    //                         //         .select(`.bloc-body ul li:nth-child(${currBlock.nb})`)
    //                         //         .style("background", ENREG_HIGHLIGHT_GREEN);
    //                         //
    //                         //     currElement.select("span")
    //                         //         .transition()
    //                         //         .ease(d3.easeLinear)
    //                         //         .duration(300 * delay)
    //                         //         .style("transform", "translate(0, -40px)")
    //                         //         .transition()
    //                         //         .duration(0)
    //                         //         .style("transform", "translate(0, +40px)")
    //                         //         .text(`${nextBlock.enregs[0].key}`)
    //                         //         .transition()
    //                         //         .duration(300 * delay)
    //                         //         .style("transform", "translate(0, 0)");
    //                         //
    //                         //     // write buffer in MS
    //                         //     this.updateBlockInMS(i, currBlock);
    //                         //
    //                         //     await sleep(1500);
    //                         // }
    //
    //                         // replace the last enreg. of current block with the first enreg. of the next block
    //                         currBlock.enregs[currBlock.nb - 1] = nextBlock.enregs[0];
    //                         this.blocks[i] = currBlock; // write dir
    //                         writeTimes++;
    //                         j = 0;
    //                         i = currBlock.nextBlockIndex;
    //                     }
    //                 }
    //             }
    //
    //             this.nbInsertions -= 1;
    //
    //             // if (animate) {
    //             //     this.updateIOTimes(readTimes, writeTimes);
    //             //     this.updateMCDescription("Removing physically was successful", "success");
    //             // }
    //
    //             return true;
    //         } else {
    //             return false;
    //         }
    //     }
}