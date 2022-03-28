import File from '../../structres/File.js';
import Enreg from '../../structres/Enreg.js';
import Block from '../../structres/Block.js';
import {
    ENREG_SIZE, MAX_NB_ENREGS_DEFAULT,
    MAX_NB_BLOCKS,
    ERROR_BG,
    WARNING_BG,
    SUCCESS_BG
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
// END - Inert Enreg.

export default class TOF extends File {
    async highlightInstruction(i) {
        d3.selectAll(`.algorithm div`)
            .attr("class", "no-highlight-instruction");

        d3.select(".algorithm")
            .select(`div:nth-child(${i + 1})`)
            .attr("class", "highlight-instruction");
        await sleep(1000);
    }

    async search(key, animate = false) {
        /*
            input :
                    key : key to search [Int]
            output :
                    {
                        found : [Boolean]
                        pos : {
                            i: [Int],
                            j: [Int]
                        }
                    }
        */

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
                d3.select(".mc-key")
                    .text(`Key = ${key}`);

                console.log(this.blocks[i]);
                console.log(i);

                midBlockElement = this.MSBoard.select(`.bloc:nth-child(${i + 1})`);

                await this.traverseBlockAnimation(i);
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
                            elementBGColor = "#34ffbd"
                        }
                    } else {
                        if (animate) await this.highlightInstruction(14);
                        if (key < currKey) {
                            eHigh = j - 1;
                            if (animate) await this.highlightInstruction(15);

                            if (animate) {
                                elementBGColor = "#fd5564"
                            }
                        } else {
                            if (animate) await this.highlightInstruction(16);
                            eLow = j + 1;
                            if (animate) await this.highlightInstruction(17);

                            if (animate) {
                                elementBGColor = "#fd5564"
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
                            .style("background", "#9CA3AF");
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
                elementBGColor = "#FF9D58"
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

            this.MSBoard.selectAll(".bloc").select(".bloc-header")
                .transition()
                .duration(600 * delay)
                .style('background', "#0F172A");

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

    isInsertionAllowed() {
        // allow insertion only if the maximum capacity of blocks isn't reached
        if (this.blocks.length === 0) {
            return true;
        } else if (this.blocks[this.blocks.length - 1].enregs.length < MAX_NB_ENREGS_DEFAULT) {
            return true;
        } else if (this.blocks.length < MAX_NB_BLOCKS) {
            return true;
        }

        return false;
    }

    updateMCDescription(message, status) { // here, status can be error, warning or success
        let bg;
        switch (status) {
            case "error":
                bg = ERROR_BG;
                break;
            case "warning":
                bg = WARNING_BG;
                break;
            default:
                bg = SUCCESS_BG;
        }

        let MCDescription = d3.select(".mc-description")
            .text(message)
            .style("background", bg);
    }

    async insert(key, field1, field2, removed = false, animate) {
        /*
            input :
                    key :       [Int]
                    field1 :    [String]
                    field2 :    [String]
                    removed     [Boolean]
            output :
                    [Boolean] ==> if enreg. is inserted return true, else false
        */

        // search if key already exists in the file
        let searchResults = await this.search(key, animate);

        let found = searchResults.found,
            i = searchResults.pos.i,
            j = searchResults.pos.j;
        let readTimes = searchResults.readTimes;
        let writeTimes = 0;
        let midBlockElement;
        let bufferElement;
        // let tempVariableElement;
        let currElement;
        let jthElement;

        if (!this.isInsertionAllowed()) {
            if (animate) {
                this.updateMCDescription("Insertion is impossible! Maximum number of blocks has been reached", "error");
            }

            return false;
        }

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
                let enregs = [newEnreg];
                // it is the first block
                const address = this.setBlockAddress(0);
                let newBlock = new Block(enregs, 1, address);
                this.blocks.push(newBlock);
                writeTimes++;
                this.nbBlocks += 1;
            } else {
                let continueShifting = true;
                let currBlock, lastIndex, lastEnreg, k;

                while (continueShifting && i < this.blocks.length) {
                    currBlock = this.blocks[i];  // read current block
                    readTimes++;

                    if (animate) {
                        this.updateIOTimes(readTimes, writeTimes);

                        midBlockElement = this.MSBoard.select(`.bloc:nth-child(${i + 1})`)

                        await this.traverseBlockAnimation(i);

                        bufferElement = this.updateBufferElement(midBlockElement);

                        jthElement = bufferElement
                            .select(`.bloc-body ul li:nth-child(${j + 1})`)
                            .style("background", "#9043ef");

                        await sleep(1000);
                    }

                    lastIndex = currBlock.nb - 1;
                    lastEnreg = currBlock.enregs[lastIndex]; // save last enreg.

                    // if (animate) {
                    //     tempVariableElement = d3.select(".temp-variable")
                    //         .text(`${lastEnreg.key}`);
                    // }

                    k = lastIndex;

                    while (k > j) {
                        currBlock.enregs[k] = currBlock.enregs[k - 1];

                        if (animate) {
                            currElement = bufferElement
                                .select(`.bloc-body ul li:nth-child(${k + 1})`)
                                .style("background", "#34ffbd");

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
                                .style("background", "#9CA3AF");
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
                            .style("background", "#9CA3AF");

                        await sleep(1300);
                    }

                    if (j === currBlock.nb) {
                        continueShifting = false;
                        currBlock.nb += 1;
                        writeTimes++;

                        if (animate) {
                            bufferElement.select(".bloc .bloc-body ul")
                                .append("li")
                                .style("background", "#34ffbd")
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
                                    .style("background", "#34ffbd")
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
                    let enregs = [newEnreg];
                    const address = this.setBlockAddress(this.blocks.length - 1);
                    let newBlock = new Block(enregs, 1, address);
                    this.blocks.push(newBlock);
                    writeTimes++;
                    this.nbBlocks += 1;

                    if (animate) {
                        this.buff.selectAll("*").remove()
                        bufferElement = this.buff.append("div")
                            .attr("class", "bloc w-48 shadow-lg shadow-black/50 rounded-lg flex-shrink-0")
                            .style("height", "352px");

                        bufferElement.append("div")
                            .attr("class", "bloc-header text-white px-3 items-center font-medium h-8 rounded-t-lg w-full flex flex-row justify-between bg-slate-900")

                        bufferElement.select(".bloc .bloc-header")
                            .append("span")
                            .attr("class", "bloc-index")
                            .text("Buffer 1");

                        bufferElement.select(".bloc .bloc-header")
                            .append("span")
                            .attr("class", "bloc-nb")
                            .text("NB=1");

                        bufferElement.append("div")
                            .attr("class", "bloc-body w-full h-80 bg-gray-400 rounded-b-lg")
                            .append("ul")
                            .attr("class", "text-lg font-medium text-center")
                            .append("li")
                            .style("background", "#34ffbd")
                            .attr("class", "border-b-2 h-10 flex justify-center flex-col")
                            .append("span")
                            .text(`${newEnreg.key}`);

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

    setBlockAddress(index) {
        if (index === 0) {
            if (this.blocks.length === 0) {
                return Math.floor(Math.random() * 10000000000).toString(16);
            } else {
                return Number((ENREG_SIZE + 1) + parseInt(this.blocks[0].blockAddress, 16)).toString(16)
            }
        } else {
            return Number(index * ENREG_SIZE + parseInt(this.blocks[0].blockAddress, 16)).toString(16)
        }
    }

    updateBlockInMS(i, block) {
        let blockElement = this.MSBoard.select(`.bloc:nth-child(${i + 1})`);

        console.log(blockElement.node())

        blockElement.select(".bloc-body ul")
            .selectAll("li")
            .remove();

        blockElement
            .select(".bloc-body ul")
            .selectAll("li")
            .data(block.enregs)
            .enter()
            .append("li")
            .attr("class", "border-b-2 h-10 flex justify-center flex-col")
            .style("color", function (enreg) {
                return enreg.removed ? "#a70000" : "black"
            })
            .style("cursor", "pointer")
            .style("overflow-y", "hidden")
            .style("overflow-x", "hidden")
            .on("click", function (e, enreg) {
                console.log(enreg.key)
            })
            .on("mouseover", function () {
                d3.select(this)
                    .style("background", "gray")
            })
            .on("mouseout", function () {
                d3.select(this)
                    .style("background", "#9CA3AF")
            })
            .append("span")
            .text(function (enreg) {
                return enreg.key
            });
    }

    async removeLogically(key, animate = false) {
        /*
           input :
                    key :    key to remove [Int]
           output :
                    true :   if the process of deletion went correctly 
                    false :  if the key does not exist
       */
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
            }

            return true;
        } else {
            return false;
        }
    }

    async traverseBlockAnimation(i) {
        let midBlockElement = this.MSBoard.select(`.bloc:nth-child(${i + 1})`);

        midBlockElement.transition()
            .duration(600 * delay)
            .style("transform", "translate(0, -10px)")
            .select('.bloc-header')
            .style('background', "#1765ba");

        midBlockElement.transition()
            .delay(600 * delay)
            .duration(600 * delay)
            .style("transform", "translate(0, 0)");
    }

    updateBufferElement(blockElement, bufferIndex = 1) {
        // scroll to blockElement
        let msLeft = this.MSBoard.node().offsetLeft;
        let blockLeft = blockElement.node().offsetLeft;

        this.MSBoard.node().scroll({
            left: blockLeft - msLeft - 240,
            behavior: "smooth",
        });

        if (bufferIndex === 1) {
            this.buff.selectAll("*").remove()
            let buff = this.buff.append("div")
                .attr("class", "bloc w-48 shadow-lg shadow-black/50 rounded-lg flex-shrink-0")
                .style("height", "352px")
                .html(blockElement.html());

            buff.select(".bloc-header .bloc-index")
                .text("Buffer 1");

            buff.select(".bloc-header .bloc-address").remove();

            buff.selectAll(".bloc-header span")
                .select("div")
                .remove();
            return buff;
        } else {
            this.buff2.selectAll("*").remove()
            let buff = this.buff2.append("div")
                .attr("class", "bloc w-48 shadow-lg shadow-black/50 rounded-lg flex-shrink-0")
                .style("height", "352px")
                .html(blockElement.html());

            buff.select(".bloc-header .bloc-index")
                .text("Buffer 2");

            buff.select(".bloc-header .bloc-address").remove();

            buff.selectAll(".bloc-header span")
                .select("div")
                .remove();
            return buff;
        }
    }

    updateIOTimes(readTimes, writeTimes) {
        d3.select(".complexity-in-reading")
            .text(`Number of reads : ${readTimes}`);

        d3.select(".complexity-in-writing")
            .text(`Number of writes : ${writeTimes}`);
    }

    async removePhysically(key, animate = false) {
        /*
           input :
                    key :    key to remove [Int]
           output :
                    true :   if the process of deletion went correctly
                    false :  if the key does not exist
       */
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

                    await this.traverseBlockAnimation(i);

                    bufferElement = this.updateBufferElement(midBlockElement, 1);

                    jthElement = bufferElement
                        .select(`.bloc-body ul li:nth-child(${j + 1})`)
                        .style("background", "#9043ef");

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
                                .style("background", "#34ffbd");

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
                                .style("background", "#9CA3AF");
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
                                .style("background", "#9043ef");

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

                            nextBlockElement = this.MSBoard.select(`.bloc:nth-child(${i + 2})`)

                            await this.traverseBlockAnimation(i + 1);

                            buffer2Element = this.updateBufferElement(nextBlockElement, 2);

                            nextFirstElement = buffer2Element
                                .select(`.bloc-body ul li:nth-child(1)`)
                                .transition()
                                .ease(d3.easeLinear)
                                .duration(300 * delay)
                                .style("background", "#9043ef");

                            await sleep(2000);

                            currElement = bufferElement
                                .select(`.bloc-body ul li:nth-child(${currBlock.nb})`)
                                .style("background", "#34ffbd");

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

        let currElement;
        let bufferElement;
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
                    .style("background", "#34ffbd");

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
