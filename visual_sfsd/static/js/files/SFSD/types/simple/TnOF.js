import TableFile from '../../structres/TableFile.js';
import Enreg from '../../structres/Enreg.js';
import Block from '../../structres/Block.js';
import {
    ENREG_HIGHLIGHT_GREEN, ENREG_HIGHLIGHT_GREY,
    ENREG_HIGHLIGHT_PURPLE,
    ENREG_HIGHLIGHT_RED
} from "../../../constants.js";
import {delay, sleep} from "../../../view_file/shared/animationSpeed.js";


export default class TnOF extends TableFile {
    async search(key, animate = false) {
        let currBlockElement;
        let bufferElement;
        let midElement;
        let elementBGColor;

        let nbBlocks = this.blocks.length;

        let i = 0,
            j = 0,
            readTimes = 0;
        let found = false;

        while (i < nbBlocks && !found) {
            let currBlock = this.blocks[i];
            readTimes++;

            if (animate) {
                currBlockElement = this.MSBoard.select(`.bloc:nth-child(${i + 1})`);

                await this.traverseBlockAnimation(i, delay);

                bufferElement = this.updateBufferElement(currBlockElement);

                this.updateIOTimes(readTimes, 0);
            }

            j = 0;
            while (j < currBlock.nb && !found) {
                if (animate) {
                    midElement = bufferElement.select(".bloc-body ul")
                        .select(`li:nth-child(${j + 1})`);
                }
                if (key === currBlock.enregs[j].key) {
                    found = true;
                    elementBGColor = ENREG_HIGHLIGHT_GREEN;
                } else {
                    j++;
                    elementBGColor = ENREG_HIGHLIGHT_RED;
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
                    await sleep(1500);
                }
            }

            if (!found) {
                if (i !== nbBlocks - 1) {
                    i++;
                } else {
                    break;
                }
            }
        }

        if (animate) {
            if (found) {
                this.updateMCDescription(`Element with key=${key} was found in the block ${i}, position ${j}`, "success");
            } else {
                this.updateMCDescription(`Element with key=${key} was not found, it should be positioned in the block ${i}, position ${j}`, "error");
            }

            await this.resetBlocksHeaders(delay);
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
        let lastBlockElement;
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

            //handle the case when it's the first time we create a block
            if (this.blocks.length === 0) {
                let address = this.setBlockAddress(0);
                let newBlock = new Block([newEnreg], 1, address);
                this.blocks.push(newBlock);
                this.nbBlocks += 1;
                writeTimes++;
            } else {
                let lastBlock = this.blocks[this.blocks.length - 1];
                readTimes++;

                if (animate) {
                    this.updateIOTimes(readTimes, writeTimes);

                    lastBlockElement = this.MSBoard.select(`.bloc:nth-child(${i + 1})`)

                    await this.traverseBlockAnimation(i, delay);

                    bufferElement = this.updateBufferElement(lastBlockElement);

                    await sleep(1000);
                }

                if (lastBlock.enregs.length < this.maxNbEnregs) {
                    // if the last block is not full, then insert the new enreg. at the end
                    lastBlock.enregs.push(newEnreg);
                    lastBlock.nb++;
                    this.blocks[this.blocks.length - 1] = lastBlock;
                    writeTimes++;

                    if (animate) {
                        bufferElement.select(".bloc .bloc-body ul")
                            .append("li")
                            .style("background", ENREG_HIGHLIGHT_GREEN)
                            .attr("class", "border-b-2 border-gray-700 h-8 text-sm flex justify-center flex-col")
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

            if (animate) {
                this.updateIOTimes(readTimes, writeTimes);
                this.updateMCDescription("Insertion was successful", "success");
            }

            this.nbInsertions += 1; // increment the number of insertion in the file

            return true;
        }
    }

    async removePhysically(key, animate = false) {
        let {found, pos, readTimes} = await this.search(key, animate);
        let {i, j} = pos;
        let writeTimes = 0;

        let currBlockElement;
        let lastBlockElement;
        let bufferElement;
        let buffer2Element;
        let jthElement;
        let currElement;
        let lastElement;

        if (found) {
            let currBlock = this.blocks[i];
            readTimes++;

            if (animate) {
                this.updateIOTimes(readTimes, writeTimes);

                currBlockElement = this.MSBoard.select(`.bloc:nth-child(${i + 1})`)

                await this.traverseBlockAnimation(i, delay);

                bufferElement = this.updateBufferElement(currBlockElement, 1);

                jthElement = bufferElement
                    .select(`.bloc-body ul li:nth-child(${j + 1})`)
                    .style("background", ENREG_HIGHLIGHT_PURPLE);

                await sleep(1000);
            }

            let lastBlock = this.blocks[this.nbBlocks - 1];
            readTimes++;

            let indexOfLastEnreg = lastBlock.nb - 1;

            // we replace the enreg to delete physically with the last enreg
            currBlock.enregs[j] = lastBlock.enregs[indexOfLastEnreg];
            this.blocks[i] = currBlock;
            writeTimes++;

            if (animate) {
                this.updateIOTimes(readTimes, writeTimes);

                lastBlockElement = this.MSBoard.select(`.bloc:nth-child(${this.blocks.length})`);

                await this.traverseBlockAnimation(this.nbBlocks - 1, delay);

                buffer2Element = this.updateBufferElement(lastBlockElement, 2);

                lastElement = buffer2Element
                    .select(`.bloc-body ul li:nth-child(${indexOfLastEnreg + 1})`);

                lastElement.transition()
                    .ease(d3.easeLinear)
                    .duration(300 * delay)
                    .style("background", ENREG_HIGHLIGHT_PURPLE);

                await sleep(2000);

                currElement = bufferElement
                    .select(`.bloc-body ul li:nth-child(${j + 1})`)
                    .style("background", ENREG_HIGHLIGHT_GREEN);

                currElement.select("span")
                    .transition()
                    .duration(500 * delay)
                    .style("transform", "translate(150px, 0)")
                    .transition()
                    .duration(0)
                    .style("transform", "translate(-150px, 0)")
                    .text(`${lastBlock.enregs[indexOfLastEnreg].key}`)
                    .transition()
                    .duration(500 * delay)
                    .style("transform", "translate(0, 0)");

                // write buffer in MS
                this.updateBlockInMS(i, currBlock);

                await sleep(2000);
            }

            lastBlock.enregs.pop(); // in reality just an extra instruction
            lastBlock.nb--;
            this.blocks[this.nbBlocks - 1] = lastBlock;
            writeTimes++;

            // if the last enreg is the only enreg in the block
            if (indexOfLastEnreg === 0) {
                this.blocks.pop();
                this.nbBlocks--;
            }

            if (animate) {
                lastElement.remove();
                buffer2Element.select(".bloc .bloc-header .bloc-nb")
                    .text(`NB=${lastBlock.nb}`);

                if (lastBlock.nb > 0) {
                    this.updateBlockInMS(this.nbBlocks - 1, lastBlock);
                }
            }

            this.nbInsertions--;

            if (animate) {
                this.updateIOTimes(readTimes, writeTimes);
                this.updateMCDescription("Removing physically was successful", "success");
            }

            return true;
        } else {
            return false;
        }
    }
}
