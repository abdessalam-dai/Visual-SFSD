import TableFile from "../../structres/TableFile.js";
import Enreg from '../../structres/Enreg.js';
import Block from '../../structres/Block.js';
import {
    BLOCKS_DEFAULT,
    ENREG_HIGHLIGHT_GREEN,
    ENREG_HIGHLIGHT_GREY,
    ENREG_HIGHLIGHT_ORANGE,
    ENREG_HIGHLIGHT_PURPLE,
    ENREG_HIGHLIGHT_RED,
    MAX_NB_BLOCKS,
    MAX_NB_ENREGS_DEFAULT,
    NB_BLOCKS_DEFAULT,
    NB_INSERTIONS_DEFAULT
} from "../../../constants.js";
import {delay, sleep} from "../../../view_file/shared/animationSpeed.js";


export default class EssaiLinear extends TableFile {
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
        // this.reset();
    }

    reset() {
        super.reset();
        while (this.blocks.length < this.maxNbBlocks) {
            let newBlock = new Block([], 0, this.setBlockAddress(this.blocks.length), -1);
            this.blocks.push(newBlock);
            this.nbBlocks++;
        }
    }

    async search(key, animate = false) {
        let i = this.hashFunction(key); // returns the index of the block where to search
        let readTimes = 0;
        let currBlockElement;
        let bufferElement;
        let currElementHTML;

        if (animate) {
            this.updateMCDescription(`h(${key}) = ${i}`, "success");
            await sleep(1000);
        }

        let found = false;
        let stop = false;
        let j;
        while (!found && !stop) {
            let currBlock = this.blocks[i];
            readTimes++;

            if (animate) {
                currBlockElement = this.MSBoard.select(`.bloc:nth-child(${i + 1})`);
                await this.traverseBlockAnimation(i, delay);
                bufferElement = this.updateBufferElement(currBlockElement);
                this.updateIOTimes(readTimes, 0);
            }

            j = 0;
            // inner search in the block
            if (currBlock.nb !== 0) {
                while (j < currBlock.nb && !found) {
                    let currElement = currBlock.enregs[j];

                    if (animate) {
                        currElementHTML = bufferElement.select(".bloc-body ul")
                            .select(`li:nth-child(${j + 1})`);
                    }

                    if (key === currElement.key) {
                        found = true;

                        if (animate) {
                            currElementHTML
                                .transition()
                                .duration(600 * delay)
                                .style("background", ENREG_HIGHLIGHT_GREEN)
                                .transition()
                                .delay(600 * delay)
                                .duration(300 * delay)
                                .style("background", ENREG_HIGHLIGHT_GREY);
                            await sleep(1000);
                        }

                        break;
                    } else {
                        if (animate) {
                            currElementHTML
                                .transition()
                                .duration(600 * delay)
                                .style("background", ENREG_HIGHLIGHT_RED)
                                .transition()
                                .delay(600 * delay)
                                .duration(300 * delay)
                                .style("background", ENREG_HIGHLIGHT_GREY);
                            await sleep(1000);
                        }

                        j = j + 1;
                    }
                }
            }
            // if there is still space in the current block we stop search
            // this the criteria of the essay linear method
            if (!found) {
                if (currBlock.nb < this.maxNbEnregs) {
                    stop = true;
                } else {
                    i = i - 1;
                    if (i < 0) {
                        i = this.blocks.length - 1;
                    }
                }
            }

            if (animate) {
                await sleep(1000);
            }
        }

        if (animate) {
            if (found) {
                this.updateMCDescription(`Element with key=${key} was found in the block ${i}, position ${j}`, "success");
            } else {
                this.updateMCDescription(`Element with key=${key} was not found, it should be positioned in the block ${i}, position ${j}`, "error");
            }
            await this.resetBlocksHeaders(delay);
        }

        return {
            found: found,
            pos: {
                i: i,
                j: j,
            },
            readTimes: readTimes
        }
    }

    isInsertionAllowed() {
        return this.nbInsertions !== this.nbBlocks * this.maxNbEnregs - 1;
    }

    async insert(key, field1, field2, removed = false, animate = false) {
        if (!this.isInsertionAllowed()) {
            if (animate) {
                this.updateMCDescription(`Nb insertions (${this.nbInsertions}) = Nb blocks × Max Nb of elements per block - 1 (${this.nbBlocks * this.maxNbEnregs - 1}) ⇒ Insertion is impossible!`, "error");
            }
            return false;
        }

        let {found, pos, readTimes} = await this.search(key, animate);
        let writeTimes = 0;

        if (found) {
            if (animate) {
                this.updateMCDescription(`Insertion is impossible! An element with key=${key} already exists`, "error");
            }
            return false;
        }

        let newEnreg = new Enreg(key, field1, field2, removed);
        let i = pos.i;

        let currBlock = this.blocks[i];  // read current block
        readTimes++;
        let currBlockElement;
        let bufferElement;

        if (animate) {
            this.updateIOTimes(readTimes, writeTimes);

            currBlockElement = this.MSBoard.select(`.bloc:nth-child(${i + 1})`)

            await this.traverseBlockAnimation(i, delay);

            bufferElement = this.updateBufferElement(currBlockElement);

            await sleep(1000);
        }

        currBlock.enregs.push(newEnreg);
        currBlock.nb++;
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
            this.updateIOTimes(readTimes, writeTimes);
            this.updateMCDescription("Insertion was successful", "success");
        }

        this.nbInsertions++;
        return true;
    }

    async removePhysically(key, animate = false) {
        let {found, pos, readTimes} = await this.search(key, animate);
        let writeTimes = 0;
        let {i, j} = pos;

        if (!found) {
            if (animate) {
                this.updateMCDescription(`No element with key=${key} exists`, "error");
            }
            return false;
        }

        let ithBlock = this.blocks[i];
        let ithBlockElement;
        let bufferElement;
        let buffer2Element;

        if (animate) {
            this.updateIOTimes(readTimes, writeTimes);

            ithBlockElement = this.MSBoard.select(`.bloc:nth-child(${i + 1})`)

            await this.traverseBlockAnimation(i, delay);

            bufferElement = this.updateBufferElement(ithBlockElement);

            await sleep(1000);
        }

        // the ith block is full ?
        if (ithBlock.nb === this.maxNbEnregs) {
            let k = i - 1;
            if (k < 0) {
                k = this.maxNbBlocks - 1;
            }

            let firstStop = false;
            // start of the outer loop
            while (!firstStop) {
                let kthBlock = this.blocks[k];
                readTimes++;
                let kthBlockElement;

                if (animate) {
                    this.updateIOTimes(readTimes, writeTimes);

                    kthBlockElement = this.MSBoard.select(`.bloc:nth-child(${k + 1})`)

                    await this.traverseBlockAnimation(k, delay);

                    buffer2Element = this.updateBufferElement(kthBlockElement, 2);

                    await sleep(1000);
                }

                let m = 0;
                let secondStop = false;
                // start of the outer loop
                while (m < kthBlock.nb && !secondStop) {
                    let y = kthBlock.enregs[m];
                    if ((this.hashFunction(y.key) < k < i) ||
                        (k < i <= this.hashFunction(y.key)) ||
                        (i <= this.hashFunction(y.key) < k)
                    ) {
                        this.blocks[i].enregs[j] = y;
                        writeTimes++;
                        if (animate) {
                            bufferElement.select(`.bloc .bloc-body ul li:nth-child(${j + 1})`)
                                .style("background", ENREG_HIGHLIGHT_GREEN)
                                .attr("class", "border-b-2 h-10 flex justify-center flex-col")
                                .append("span")
                                .text(`${y.key}`);
                            this.updateIOTimes(readTimes, writeTimes);
                        }

                        i = k;
                        j = m;
                        this.blocks[i] = this.blocks[k]; // buf = buf2
                        ithBlock = kthBlock;

                        if (animate) {
                            this.updateIOTimes(readTimes, writeTimes);

                            kthBlockElement = this.MSBoard.select(`.bloc:nth-child(${k + 1})`)

                            bufferElement = this.updateBufferElement(kthBlockElement);

                            await sleep(1000);
                        }

                        secondStop = true;
                    } else {
                        m++;
                    }

                }
                // end of the inner loop

                if (kthBlock.nb < this.maxNbEnregs) {
                    firstStop = true;
                } else {
                    k = k - 1;
                    if (k < 0) {
                        k = this.nbBlocks - 1;
                    }
                }
            }
            // end of the outer loop
        }
        // if the ith block not full
        writeTimes++;
        if (animate) {
            bufferElement.select(`.bloc .bloc-body ul li:nth-child(${j + 1}) span`)
                .text(`${ithBlock.enregs[ithBlock.nb - 1].key}`);
            bufferElement.select(`.bloc .bloc-body ul li:nth-child(${ithBlock.nb})`)
                .remove();
            bufferElement.select(".bloc .bloc-header .bloc-nb").text(`NB=${ithBlock.nb - 1}`);
            this.updateIOTimes(readTimes, writeTimes);
        }
        this.blocks[i].enregs[j] = this.blocks[i].enregs[this.blocks[i].enregs.length - 1];
        this.blocks[i].enregs.pop();
        this.blocks[i].nb--;

        this.nbInsertions--;

        if (animate) {
            this.updateIOTimes(readTimes, writeTimes);
            this.updateMCDescription("Removing physically was successful", "success");
        }

        return true;
    }

    hashFunction(key) {
        return key % this.maxNbBlocks;
    }
}
