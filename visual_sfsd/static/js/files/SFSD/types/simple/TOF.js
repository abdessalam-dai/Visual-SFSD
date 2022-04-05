import File from '../../structres/File.js';
import Enreg from '../../structres/Enreg.js';
import Block from '../../structres/Block.js';
import {
    ENREG_SIZE, MAX_NB_ENREGS_DEFAULT,
    MAX_NB_BLOCKS,
    ERROR_BG,
    WARNING_BG,
    SUCCESS_BG,
    ENREG_HIGHLIGHT_GREY,
    ENREG_HIGHLIGHT_GREEN,
    ENREG_HIGHLIGHT_ORANGE,
    ENREG_HIGHLIGHT_RED,
    ENREG_HIGHLIGHT_PURPLE
} from "../../../constants.js";

let delay = 0.5;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms * delay));
}

// START - Change animation speed.
const animationSpeedBar = document.querySelector("#animation-speed-bar");

function handleChangeAnimationSpeed() {
    animationSpeedBar.addEventListener("change", function () {
        delay = (200 - animationSpeedBar.value) / 100;
        console.log(delay);
    });
}

handleChangeAnimationSpeed();
// END - Change animation speed.

export default class TOF extends File {
    async highlightInstruction(i) {
        // d3.selectAll(`.algorithm div`)
        //     .attr("class", "no-highlight-instruction");
        //
        // d3.select(".algorithm")
        //     .select(`div:nth-child(${i + 1})`)
        //     .attr("class", "highlight-instruction");
        // await sleep(1000);
    }

    async search(key, animate = false) {
        let blocks = this.blocks;
        let nbBlocks = this.blocks.length;

        let low = 0;
        if (animate) {
            await this.highlightInstruction(0);
            await this.highlightInstruction(1);
        }
        let high = nbBlocks - 1;

        let i = 0,
            j = 0;

        let found = false,
            stop = false;

        if (animate) {
            await this.highlightInstruction(2);
        }

        let midBlockElement;
        let bufferElement;
        let MCDescription;
        let midElement;
        let elementBGColor;
        let isBlocksLengthExceeded = false;
        let readTimes = 0;
        // global search for block
        while (low <= high && !found && !stop) {
            if (animate) {
                await this.highlightInstruction(3);
                await this.highlightInstruction(4);
            }
            i = Math.floor((low + high) / 2);
            let midBlock = blocks[i];
            readTimes++;
            let midBlockNb = midBlock.enregs.length;

            let firstKey = midBlock.enregs[0].key,
                lastKey = midBlock.enregs[midBlockNb - 1].key;

            if (animate) {
                console.log(this.blocks[i]);
                console.log(i);

                midBlockElement = this.MSBoard.select(`.bloc:nth-child(${i + 1})`);

                await this.traverseBlockAnimation(i, delay);
                await this.highlightInstruction(5);

                bufferElement = this.updateBufferElement(midBlockElement);

                this.updateIOTimes(readTimes, 0);
            }

            // local search for enreg. inside block
            if (animate) await this.highlightInstruction(6);
            if (key >= firstKey && key <= lastKey) {
                if (animate) {
                    this.updateMCDescription(`${key} ∈ [${lastKey}, ${firstKey}]`, "success");
                    await sleep(1000);

                    await this.highlightInstruction(7);
                }

                let eLow = 0,
                    eHigh = midBlock.enregs.length - 1;

                if (animate) await this.highlightInstruction(8);
                while (eLow <= eHigh && !found) {
                    j = Math.floor((eLow + eHigh) / 2);

                    if (animate) await this.highlightInstruction(10);

                    let currKey = midBlock.enregs[j].key;

                    if (animate) {
                        midElement = bufferElement.select(".bloc-body ul")
                            .select(`li:nth-child(${j + 1})`);
                    }

                    if (animate) await this.highlightInstruction(11);
                    if (key === currKey) {
                        found = true;
                        if (animate) await this.highlightInstruction(12);

                        if (animate) {
                            elementBGColor = ENREG_HIGHLIGHT_GREEN
                        }
                    } else {
                        if (animate) await this.highlightInstruction(14);
                        if (key < currKey) {
                            eHigh = j - 1;
                            if (animate) await this.highlightInstruction(15);

                            if (animate) {
                                elementBGColor = ENREG_HIGHLIGHT_RED
                            }
                        } else {
                            if (animate) await this.highlightInstruction(16);
                            eLow = j + 1;
                            if (animate) await this.highlightInstruction(17);

                            if (animate) {
                                elementBGColor = ENREG_HIGHLIGHT_RED
                            }
                        }
                    }

                    if (animate) {
                        midElement
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

                if (animate) await this.highlightInstruction(21);
                if (eLow > eHigh) {
                    j = eLow;
                    if (animate) await this.highlightInstruction(22);
                }
                stop = true;
                if (animate) await this.highlightInstruction(24);
            } else if (key < firstKey) {
                if (animate) await this.highlightInstruction(26);
                if (animate) {
                    this.updateMCDescription(`${key} ∉ [${lastKey}, ${firstKey}]`, "error");
                    await sleep(1000);
                }
                high = i - 1;
                if (animate) await this.highlightInstruction(27);
            } else {  // key > lastKey
                if (animate) await this.highlightInstruction(28);
                if (animate) {
                    this.updateMCDescription(`${key} ∉ [${lastKey}, ${firstKey}]`, "error");
                    await sleep(1000);
                }
                low = i + 1;
                if (animate) await this.highlightInstruction(29);
            }

            if (animate) {
                await sleep(1000);
            }
        }

        if (animate) await this.highlightInstruction(33);
        if (low > high) {
            if (animate) await this.highlightInstruction(34);
            if (high === -1) { // if no blocks have been added yet
                i = 0;
                j = 0;
            } else {
                i = low - 1;
                j = blocks[i].enregs.length;

                if (j >= this.maxNbEnregs) {
                    i += 1;
                    j = 0;

                    if (animate) {
                        if (i >= this.blocks.length) {
                            isBlocksLengthExceeded = true;
                        } else {
                            midBlockElement = this.MSBoard.select(`.bloc:nth-child(${i + 1})`);

                            bufferElement = bufferElement = this.updateBufferElement(midBlockElement, 1);
                        }
                    }
                }
            }
        }

        if (animate) {
            if (found) {
                this.updateMCDescription(`Element with key=${key} was found in the block ${i}, position ${j}`, "success");
            } else {
                elementBGColor = ENREG_HIGHLIGHT_ORANGE;
                this.updateMCDescription(`Element with key=${key} was not found, it should be positioned in the block ${i}, position ${j}`, "error");
            }

            midElement = bufferElement.select(".bloc-body ul")
                .select(`li:nth-child(${j + 1})`);

            if (!midElement) {
                midElement = bufferElement.select(".bloc-body ul")
                    .select(`li:nth-child(${j + 1})`);
            }

            if (!isBlocksLengthExceeded) {
                midElement
                    .transition()
                    .duration(300 * delay)
                    .style("background", elementBGColor);
            }

            await this.resetBlocksHeaders(delay);

            await sleep(1000);
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

            let newEnreg = new Enreg(key, field1, field2, removed);

            if (this.blocks.length === 0) {
                let address = this.setBlockAddress(0);
                let newBlock = new Block([newEnreg], 1, address);
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

                    if (j === currBlock.nb) {
                        continueShifting = false;
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

            return true;
        }
    }

    async removeLogically(key, animate = false) {
        let {found, pos, readTimes} = await this.search(key, animate);
        let {i, j} = pos
        let writeTimes;

        if (found) {
            this.blocks[i].enregs[j].removed = true;
            writeTimes = 1;

            if (animate) {
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

    async removePhysically(key, animate = false) {
        let {found, pos, readTimes} = await this.search(key, animate);
        let {i, j} = pos;
        let writeTimes = 0;

        let midBlockElement;
        let bufferElement;
        let buffer2Element;
        let jthElement;
        let currElement;
        let nextBlockElement;
        let nextFirstElement;

        if (found) {
            let continueShifting = true;

            while (continueShifting) {
                let currBlock = this.blocks[i];
                readTimes++;

                if (animate) {
                    this.updateIOTimes(readTimes, writeTimes);

                    midBlockElement = this.MSBoard.select(`.bloc:nth-child(${i + 1})`)

                    await this.traverseBlockAnimation(i, delay);

                    bufferElement = this.updateBufferElement(midBlockElement, 1);

                    jthElement = bufferElement
                        .select(`.bloc-body ul li:nth-child(${j + 1})`)
                        .style("background", ENREG_HIGHLIGHT_PURPLE);

                    await sleep(1000);
                }

                if (currBlock.nb === 1) { // if this is the only element in the last block
                    this.blocks.pop();
                    this.nbBlocks -= 1;
                    continueShifting = false;
                } else {
                    let k = j;
                    while (k <= currBlock.nb - 2) {
                        currBlock.enregs[k] = currBlock.enregs[k + 1];

                        if (animate) {
                            currElement = bufferElement
                                .select(`.bloc-body ul li:nth-child(${k + 1})`)
                                .style("background", ENREG_HIGHLIGHT_GREEN);

                            currElement.select("span")
                                .transition()
                                .ease(d3.easeLinear)
                                .duration(300 * delay)
                                .style("transform", "translate(0, -40px)")
                                .transition()
                                .duration(0)
                                .style("transform", "translate(0, +40px)")
                                .text(`${currBlock.enregs[k + 1].key}`)
                                .transition()
                                .duration(300 * delay)
                                .style("transform", "translate(0, 0)");

                            await sleep(600);

                            currElement
                                .style("background", ENREG_HIGHLIGHT_GREY);
                        }

                        k++;
                    }

                    // the block is not full (nb < B) OR (i) is the last block
                    if ((currBlock.nb !== MAX_NB_ENREGS_DEFAULT) || (i === this.nbBlocks - 1)) {
                        continueShifting = false;
                        currBlock.enregs.pop();
                        currBlock.nb -= 1;

                        if (animate) {
                            currElement = bufferElement
                                .select(`.bloc-body ul li:nth-child(${currBlock.nb + 1})`)
                                .style("background", ENREG_HIGHLIGHT_PURPLE);

                            currElement.select("span")
                                .transition()
                                .ease(d3.easeLinear)
                                .duration(300 * delay)
                                .style("transform", "translate(-150px, 0)");

                            await sleep(300);

                            currElement.remove();

                            bufferElement.select(".bloc .bloc-header .bloc-nb")
                                .text(`NB=${currBlock.nb}`);

                            // write buffer in MS
                            this.updateBlockInMS(i, currBlock);
                        }

                        this.blocks[i] = currBlock; // write dir
                        writeTimes++;
                    } else {
                        let nextBlock = this.blocks[i + 1];
                        readTimes++;

                        if (animate) {
                            this.updateIOTimes(readTimes, writeTimes);

                            nextBlockElement = this.MSBoard.select(`.bloc:nth-child(${i + 2})`);

                            await this.traverseBlockAnimation(i + 1, delay);

                            buffer2Element = this.updateBufferElement(nextBlockElement, 2);

                            nextFirstElement = buffer2Element
                                .select(`.bloc-body ul li:nth-child(1)`)
                                .transition()
                                .ease(d3.easeLinear)
                                .duration(300 * delay)
                                .style("background", ENREG_HIGHLIGHT_PURPLE);

                            await sleep(2000);

                            currElement = bufferElement
                                .select(`.bloc-body ul li:nth-child(${currBlock.nb})`)
                                .style("background", ENREG_HIGHLIGHT_GREEN);

                            currElement.select("span")
                                .transition()
                                .ease(d3.easeLinear)
                                .duration(300 * delay)
                                .style("transform", "translate(0, -40px)")
                                .transition()
                                .duration(0)
                                .style("transform", "translate(0, +40px)")
                                .text(`${nextBlock.enregs[0].key}`)
                                .transition()
                                .duration(300 * delay)
                                .style("transform", "translate(0, 0)");

                            // write buffer in MS
                            this.updateBlockInMS(i, currBlock);

                            await sleep(1500);
                        }

                        // replace the last enreg. of current block with the first enreg. of the next block
                        currBlock.enregs[currBlock.nb - 1] = nextBlock.enregs[0];
                        this.blocks[i] = currBlock; // write dir
                        writeTimes++;
                        j = 0;
                        i += 1;
                    }
                }
            }

            this.nbInsertions -= 1;

            if (animate) {
                this.updateIOTimes(readTimes, writeTimes);
                this.updateMCDescription("Removing physically was successful", "success");
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
            block.enregs[j].removed = removed;

            this.blocks[i] = block;
            writeTimes = 1;

            if (animate) {
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
}
