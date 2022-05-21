import ListFile from '../../structres/ListFile.js';
import Enreg from '../../structres/Enreg.js';
import Block from '../../structres/Block.js';
import {
    ENREG_HIGHLIGHT_GREEN, ENREG_HIGHLIGHT_GREY, ENREG_HIGHLIGHT_RED,
} from "../../../constants.js";
import {delay, sleep} from "../../../view_file/shared/animationSpeed.js";


export default class LnOF extends ListFile {
    async search(key, animate = false) {
        let i = this.headIndex;
        let iPrev;
        let j = 0;
        let readTimes = 0;
        let found = false;
        let currBlock;
        let isBlocksLengthExceeded = false;

        let currBlockElement;
        let bufferElement;
        let currElement;
        let elementBGColor;

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

        while (i !== -1 && !found) {
            currBlock = this.blocks[i];
            readTimes++;
            j = 0;

            if (animate) {
                currBlockElement = this.MSBoard.select(`.bloc:nth-child(${i + 1})`);

                await this.traverseBlockAnimation(i, delay);

                bufferElement = this.updateBufferElement(currBlockElement);

                this.updateIOTimes(readTimes, 0);
            }

            while (j < currBlock.nb && !found) {
                if (animate) {
                    currElement = bufferElement.select(".bloc-body ul")
                        .select(`li:nth-child(${j + 1})`);
                }

                if (currBlock.enregs[j].key === key) {
                    found = true;
                    elementBGColor = ENREG_HIGHLIGHT_GREEN;
                } else {
                    j++;
                    elementBGColor = ENREG_HIGHLIGHT_RED;
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

            if (!found) {
                iPrev = i;
                i = currBlock.nextBlockIndex;
            }

            if (animate) {
                await sleep(1000);
            }
        }

        if (i === -1) {
            i = iPrev;
        }

        let newRandomBlock = -1;
        let newJ = j;
        if (j >= this.maxNbEnregs) {
            isBlocksLengthExceeded = true;
            newJ = 0;
            newRandomBlock = this.randomBlockIndex();
        }

        if (animate) {
            if (found) {
                this.updateMCDescription(`Element with key=${key} was found in the block ${i}, position ${j}`, "success");
            } else if (isBlocksLengthExceeded) {
                this.updateMCDescription(`Element with key=${key} was not found, it should be positioned in the block ${newRandomBlock}, position 0`, "error");
            } else {
                this.updateMCDescription(`Element with key=${key} was not found, it should be positioned in the block ${i}, position ${j}`, "error");
            }

            currElement = bufferElement.select(".bloc-body ul")
                .select(`li:nth-child(${j + 1})`);

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
                j: j,
                newRandomBlock: newRandomBlock,
                newJ: newJ
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
            j = searchResults.pos.j,
            newRandomBlock = searchResults.pos.newRandomBlock,
            newJ = searchResults.pos.newJ;

        let readTimes = searchResults.readTimes;
        let writeTimes = 0;
        let lastBlockElement;
        let bufferElement;
        let currElement;
        let jthElement;

        let currBlock;

        if (found) {
            if (animate) {
                this.updateMCDescription(`Insertion is impossible! An element with key=${key} already exists`, "error");
            }

            return false;
        } else {
            if (animate) {
                this.updateMCDescription(`Element with key=${key} should be positioned in the block ${newRandomBlock}, position ${newJ}`, "success");
            }

            let newEnreg = new Enreg(key, field1, field2, removed); // create a new enreg.

            if (this.blocks[i] === null) {
                // create new block
                let address = this.setBlockAddress(i);
                this.blocks[i] = new Block([newEnreg], 1, address, -1);
                writeTimes++;
                this.nbBlocks++;

                this.headIndex = i;
                this.tailIndex = i;
                return true;
            }
            currBlock = this.blocks[i];
            readTimes++;

            if (animate) {
                this.updateIOTimes(readTimes, writeTimes);

                lastBlockElement = this.MSBoard.select(`.bloc:nth-child(${i + 1})`)

                await this.traverseBlockAnimation(i, delay);

                bufferElement = this.updateBufferElement(lastBlockElement);

                await sleep(1000);
            }

            if (currBlock.nb < this.maxNbEnregs) { // if there is space in the block
                currBlock.nb++;
                currBlock.enregs[j] = newEnreg;
                this.blocks[i] = currBlock;
                writeTimes++;

                if (animate) {
                    bufferElement.select(".bloc .bloc-body ul")
                        .append("li")
                        .style("background", ENREG_HIGHLIGHT_GREEN)
                        .attr("class", "border-b-2  border-gray-700 h-8 text-sm flex justify-center flex-col")
                        .append("span")
                        .text(`${newEnreg.key}`);

                    bufferElement.select(".bloc .bloc-header .bloc-nb")
                        .text(`NB=${currBlock.nb}`);

                    await sleep(1000);

                    // write buffer in MS
                    this.updateBlockInMS(i, currBlock);
                }
            } else {
                let newIndex = newRandomBlock;
                if (newIndex === -1) newIndex = this.randomBlockIndex();

                currBlock.nextBlockIndex = newIndex;
                this.blocks[i] = currBlock;
                writeTimes++;

                // create new block
                let address = this.setBlockAddress(newIndex);
                this.blocks[newIndex] = new Block([newEnreg], 1, address, -1);
                this.tailIndex = newIndex;
                writeTimes++;
                this.nbBlocks++;

                if (animate) {
                    this.createNewBlockInBuff(newEnreg);

                    await sleep(1000);

                    // write buffer in MS
                    this.updateBlockInMS(i, this.blocks[newIndex]);
                }
            }

            this.nbInsertions++;
            return true;
        }
    }

    // to be set later (this is not the ideal function)
    // async removePhysically(key, animate) {
    //     let {found, pos, readTimes} = await this.search(key, animate);
    //     let {i, j} = pos;
    //     let writeTimes;
    //
    //     let tailBlock = this.blocks[this.tailIndex];
    //     readTimes++;
    //
    //     let indexOfLastEnreg = tailBlock.nb - 1;
    //     let lastEnreg = tailBlock.enregs[indexOfLastEnreg];
    //
    //     let blockBeforeTailBlock = this.blocks
    //         .filter((block) => block !== null)
    //         .filter((block) => block.nextBlockIndex === this.tailIndex)[0];
    //     readTimes++;
    //
    //     if (found) {
    //         // we replace the enreg to delete physically with the last enreg;
    //         this.blocks[i].enregs[j] = lastEnreg;
    //
    //         // if we have the only one enreg in the headBlock, so we delete it directly and set it to null
    //         if (indexOfLastEnreg === 0 && this.headIndex === this.tailIndex) {
    //             this.blocks[this.headIndex] = null;
    //             this.headIndex = -1;
    //             this.tailIndex = -1;
    //             return true;
    //         }
    //
    //         // if the last enreg is the only enreg in the block
    //         if (indexOfLastEnreg === 0) {
    //             tailBlock = null;
    //             this.blocks[this.tailIndex] = tailBlock;
    //             writeTimes++;
    //
    //             blockBeforeTailBlock.nextBlockIndex = -1;
    //             this.tailIndex = this.blocks.indexOf(blockBeforeTailBlock);
    //             this.blocks[this.tailIndex] = blockBeforeTailBlock;
    //             writeTimes++;
    //
    //             this.nbBlocks--;
    //         } else {
    //             tailBlock.enregs.pop();
    //             tailBlock.nb--;
    //             this.blocks[this.tailIndex] = tailBlock;
    //             writeTimes++;
    //         }
    //
    //         this.createBoardsDOM();
    //         this.nbInsertions--;
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }
}