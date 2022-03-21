import File from '../../structres/File.js';
import Enreg from '../../structres/Enreg.js';
import Block from '../../structres/Block.js';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default class TOF extends File {
    async search(key, animate = false, isRemoveCalling = false, isInsertCalling = false) {
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

        let low = 0,
            high = nbBlocks - 1;

        let i = 0,
            j = 0;

        let found = false,
            stop = false;

        let midBlockElement;
        let bufferElement;
        let MCDescription;
        let midElement;
        let elementBGColor;
        let isBlocksLengthExceeded = false;

        // global search for block
        while (low <= high && !found && !stop) {
            i = Math.floor((low + high) / 2);
            let midBlock = blocks[i];
            let midBlockNb = midBlock.enregs.length;

            let firstKey = midBlock.enregs[0].key,
                lastKey = midBlock.enregs[midBlockNb - 1].key;

            if (animate) {
                console.log(this.blocks[i])
                console.log(i)
                midBlockElement = this.MSBoard.select(`.bloc:nth-child(${i + 1})`)

                midBlockElement.transition()
                    .duration(600)
                    .style("transform", "translate(0, -10px)")
                    .select('.bloc-header')
                    .style('background', "#1765ba")

                midBlockElement.transition()
                    .delay(600)
                    .duration(600)
                    .style("transform", "translate(0, 0)")

                this.buff.selectAll("*").remove()
                bufferElement = this.buff.append("div")
                    .attr("class", "bloc w-48 shadow-lg shadow-black/50 rounded-lg flex-shrink-0")
                    .style("height", "352px")
                    .html(midBlockElement.html())

                MCDescription = d3.select(".mc-description")
                MCDescription.text(`${firstKey} ≤ ${key} ≤ ${lastKey}`)
            }

            // local search for enreg. inside block
            if (key >= firstKey && key <= lastKey) {
                if (animate) {
                    MCDescription.style("color", "green")
                    await sleep(1000)
                }

                let eLow = 0,
                    eHigh = midBlock.enregs.length - 1;

                while (eLow <= eHigh && !found) {
                    j = Math.floor((eLow + eHigh) / 2);
                    let currKey = midBlock.enregs[j].key;

                    if (animate) {
                        midElement = bufferElement.select(".bloc-body ul")
                            .select(`li:nth-child(${j + 1})`)
                    }

                    if (key === currKey) {
                        found = true;

                        if (animate) {
                            elementBGColor = "#34ffbd"
                        }
                    } else if (key < currKey) {
                        eHigh = j - 1;

                        if (animate) {
                            elementBGColor = "#fd5564"
                        }
                    } else {
                        eLow = j + 1;

                        if (animate) {
                            elementBGColor = "#fd5564"
                        }
                    }

                    if (animate) {
                        midElement
                            .transition()
                            .ease(d3.easeLinear)
                            .duration(600)
                            .style("background", elementBGColor)

                        midElement
                            .transition()
                            .delay(1000)
                            .duration(300)
                            .style("background", "#9CA3AF")
                        await sleep(1000)
                    }
                }

                if (eLow > eHigh) {
                    j = eLow;
                }
                stop = true;
            } else if (key < firstKey) {
                if (animate) {
                    MCDescription.style("color", "red")
                }
                high = i - 1;
            } else {  // key > lastKey
                if (animate) {
                    MCDescription.style("color", "red")
                }
                low = i + 1;
            }

            if (animate) {
                await sleep(1000)
            }
        }

        if (low > high) {
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
                            midBlockElement = this.MSBoard.select(`.bloc:nth-child(${i + 1})`)
                            this.buff.selectAll("*").remove()
                            bufferElement = this.buff.append("div")
                                .attr("class", "bloc w-48 shadow-lg shadow-black/50 rounded-lg flex-shrink-0")
                                .style("height", "352px")
                                .html(midBlockElement.html())
                        }
                    }
                }
            }
        }

        if (animate) {
            if (found) {
                let msg = `Element with key ${key} was found in the block ${i}, position ${j}`

                if (isInsertCalling) {
                    msg += ", insertion is impossible"
                }

                MCDescription
                    .text(msg)
            } else {
                elementBGColor = "#FF9D58"
                let msg = `Element with key ${key} was not found`
                if (!isRemoveCalling) {
                    msg += `, it should be positioned in the block ${i}, position ${j}`
                }
                MCDescription
                    .text(msg)
            }

            if (!midElement) {
                console.log(j)
                midElement = bufferElement.select(".bloc-body ul")
                    .select(`li:nth-child(${j + 1})`)
                console.log(midElement.node())
            }

            if (!isBlocksLengthExceeded) {
                midElement
                    .transition()
                    .duration(300)
                    .style("background", elementBGColor)
            }

            this.MSBoard.selectAll(".bloc").select(".bloc-header")
                .transition()
                .duration(600)
                .style('background', "#0F172A")
        }

        return {
            found: found,
            pos: {
                i: i,
                j: j
            },
        }
    }

    async insert(key, field1, field2, removed = false, animate) {
        /*
            input :
                    key :       [Int]
                    field1 :    [String]
                    field2 :    [String]
                    removed     [Boolean]
            output :
                    [Boolean] ==> if enreg. is inserted return true, else false (if key already exits !)
        */

        // search if key already exists in the file
        let searchResults = await this.search(key, animate, false, true);

        let found = searchResults.found,
            i = searchResults.pos.i,
            j = searchResults.pos.j;

        let midBlockElement;
        let bufferElement;
        let tempVariableElement;
        let currElement;
        let jthElement;

        if (!found) {
            let newEnreg = new Enreg(key, field1, field2, removed);

            if (this.blocks.length === 0) {
                let enregs = [newEnreg];
                let newBlock = new Block(enregs, 1);
                this.blocks.push(newBlock);
                this.nbBlocks += 1;
            } else {
                let continueShifting = true;
                let currBlock, lastIndex, lastEnreg, k;

                while (continueShifting && i < this.blocks.length) {
                    currBlock = this.blocks[i];  // read current block

                    if (animate) {
                        midBlockElement = this.MSBoard.select(`.bloc:nth-child(${i + 1})`)

                        midBlockElement.transition()
                            .duration(600)
                            .style("transform", "translate(0, -10px)")
                            .select('.bloc-header')
                            .style('background', "#1765ba")

                        midBlockElement.transition()
                            .delay(600)
                            .duration(600)
                            .style("transform", "translate(0, 0)")

                        this.buff.selectAll("*").remove()
                        bufferElement = this.buff.append("div")
                            .attr("class", "bloc w-48 shadow-lg shadow-black/50 rounded-lg flex-shrink-0")
                            .style("height", "352px")
                            .html(midBlockElement.html())

                        jthElement = bufferElement
                            .select(`.bloc-body ul li:nth-child(${j + 1})`)
                            .style("background", "#9043ef")

                        await sleep(1000)
                    }

                    lastIndex = currBlock.nb - 1;
                    lastEnreg = currBlock.enregs[lastIndex]; // save last enreg.

                    if (animate) {
                        tempVariableElement = d3.select(".temp-variable")
                            .text(`${lastEnreg.key}`)
                    }

                    k = lastIndex;

                    while (k > j) {
                        currBlock.enregs[k] = currBlock.enregs[k - 1];

                        if (animate) {
                            currElement = bufferElement
                                .select(`.bloc-body ul li:nth-child(${k + 1})`)
                                .style("background", "#34ffbd")

                            currElement.select("span")
                                .transition()
                                .ease(d3.easeLinear)
                                .duration(300)
                                .style("transform", "translate(0, +40px)")
                                .transition()
                                .duration(0)
                                .style("transform", "translate(0, -40px)")
                                .text(`${currBlock.enregs[k - 1].key}`)
                                .transition()
                                .duration(300)
                                .style("transform", "translate(0, 0)")

                            await sleep(600)

                            currElement
                                .style("background", "#9CA3AF")
                            await sleep(1000)
                        }

                        k -= 1;
                    }

                    // insert the enreg. at position j
                    currBlock.enregs[j] = newEnreg;

                    if (animate) {
                        jthElement
                            .transition()
                            .duration(300)
                            .text(`${newEnreg.key}`)
                            .style("background", "#9CA3AF")

                        await sleep(1000);
                    }

                    if (j === currBlock.nb) {
                        continueShifting = false;
                        currBlock.nb += 1;

                        if (animate) {
                            bufferElement.select(".bloc-body ul")
                                .append("li")
                                .style("background", "#34ffbd")
                                .attr("class", "border-b-2 h-10 flex justify-center flex-col")
                                .append("span")
                                .text(`${newEnreg.key}`)

                            await sleep(1000);
                        }

                    } else {

                        if (currBlock.nb < this.maxNbEnregs) {
                            // if the current block is not full, then insert the last enreg. at the end
                            currBlock.nb += 1;
                            currBlock.enregs[currBlock.nb - 1] = lastEnreg;
                            this.blocks[i] = currBlock;  // save current block in the blocks array
                            continueShifting = false;


                            if (animate) {
                                bufferElement.select(".bloc-body ul")
                                    .append("li")
                                    .style("background", "#34ffbd")
                                    .attr("class", "border-b-2 h-10 flex justify-center flex-col")
                                    .append("span")
                                    .text(`${lastEnreg.key}`)

                                await sleep(1000);
                            }

                        } else { // else, insert it in the next block (i + 1)
                            this.blocks[i] = currBlock;  // save current block in the blocks array
                            i += 1;
                            j = 0;
                            newEnreg = lastEnreg;
                        }
                    }

                }

                if (i > this.nbBlocks - 1) {
                    let enregs = [newEnreg];
                    let newBlock = new Block(enregs, 1);
                    this.blocks.push(newBlock);
                    this.nbBlocks += 1;
                }
            }

            this.nbInsertions += 1;

            return true;
        } else {
            return false;
        }
    }

    async removeLogically(key, animate = false) {
        /*
           input :
                    key :    key to remove [Int]
           output :
                    true :   if the process of deletion went correctly 
                    false :  if the key does not exist
       */
        let {found, pos} = await this.search(key, true, true)
        let {i, j} = pos

        console.log(i, j)

        if (found) {
            this.blocks[i].enregs[j].removed = true;

            this.buff
                .select(`.bloc .bloc-body ul li:nth-child(${j + 1})`)
                .transition()
                .duration(500)
                .style("color", "#a70000")

            await sleep(1000)

            this.MSBoard
                .select(`.bloc:nth-child(${i + 1})`)
                .select(`.bloc-body ul li:nth-child(${j + 1})`)
                .transition()
                .duration(500)
                .style("color", "#a70000")

            let MCDescription = d3.select(".mc-description")
                .text(`Element with key ${key} has been removed successfully`)
                .style("color", "green")

            return true;
        } else {
            return false;
        }
    }
}
