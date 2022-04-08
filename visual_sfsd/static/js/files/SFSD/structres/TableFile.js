import {
    MAX_NB_ENREGS_DEFAULT,
    NB_BLOCKS_DEFAULT,
    NB_INSERTIONS_DEFAULT,
    BLOCKS_DEFAULT,
    ERROR_BG,
    WARNING_BG,
    SUCCESS_BG,
    ENREG_SIZE,
    MAX_NB_BLOCKS,
    ENREG_HIGHLIGHT_GREEN,
    ENREG_HIGHLIGHT_GREY,
} from '../../constants.js';
import {delay, sleep} from "../../view_file/shared/animationSpeed.js";


export default class TableFile {
    /*

    This is class is used for TOF and TnOF files
    methods in common between TOF and TnOF :
        - removeLogically
        - editEnreg

     */
    constructor(
        name,
        buff,
        buff2,
        MSBoard,
        maxNbEnregs = MAX_NB_ENREGS_DEFAULT,
        nbBlocks = NB_BLOCKS_DEFAULT,
        nbInsertions = NB_INSERTIONS_DEFAULT,
        blocks = BLOCKS_DEFAULT,
    ) {
        this.name = name;
        this.buff = buff;
        this.buff2 = buff2;
        this.MSBoard = MSBoard;
        this.maxNbEnregs = maxNbEnregs;
        this.nbBlocks = nbBlocks;
        this.nbInsertions = nbInsertions;
        this.blocks = blocks;
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

    createBoardsDOM() {
        this.MSBoard.selectAll("*").remove();

        const blocDiv = `
        <div class="bloc w-48 shadow-lg shadow-black/50 rounded-lg flex-shrink-0" style="height: 352px;">
            <div
                class="bloc-header text-white px-3 items-center font-medium h-8 rounded-t-lg w-full flex flex-row justify-between bg-slate-900">
                <span class="bloc-index" style="position: relative"></span>
                <span class="bloc-address" style="position: relative"></span>
                <span class="bloc-nb" style="position: relative">NB=0</span>
            </div>
        </div>`

        for (let block of this.blocks) {
            this.MSBoard.node().insertAdjacentHTML('beforeend', blocDiv);
        }

        this.MSBoard.selectAll('.bloc')
            .data(this.blocks)
            .select(".bloc-index")
            .append("span")
            .style("cursor", "pointer")
            .text(function (block, index) {
                return index
            });

        this.MSBoard.selectAll('.bloc')
            .data(this.blocks)
            .select(".bloc-nb")
            .text(function (block) {
                return `NB=${block.nb}`
            });

        // CREATING THE TOOL TIP FOR INDEX
        this.MSBoard.selectAll(".bloc-index")
            .append("div")
            .attr("class", "tool-tip-index")
            .style("position", "absolute")
            .style("width", "180px")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .style("background", "#38BDF8")
            .style("color", "#9333EA")
            .style("padding", "5px")
            .style("z-index", "99")
            .text("Logical address");

        this.MSBoard.selectAll(".bloc-index")
            .data(this.blocks)
            .on("mouseover", function (e) {
                d3.select(this)
                    .select(".tool-tip-index")
                    .style("transition", "visibility 0s linear 50ms")
                    .style("visibility", "visible");
            })
            .on("mouseout", function (e) {
                d3.select(this)
                    .select(".tool-tip-index")
                    .style("transition", "visibility 0s linear 100ms")
                    .style("visibility", "hidden");
            })
            .on("click", function (e) {
                let index = d3.select(this)
                    .select("span")
                    .text();

                index = parseInt(index);

                console.log(index)
                d3.select(this)
                    .select("span")
                    .text(function (block, blockIndex) {
                        if (index <= MAX_NB_BLOCKS && index >= 0) {
                            return `0x${block.blockAddress}`;
                        } else {
                            return blockIndex;
                        }
                    });

                d3.select(this)
                    .select("div")
                    .text(function (block, blockIndex) {
                        if (index <= MAX_NB_BLOCKS && index >= 0) {
                            return "Physical address (real)";
                        } else {
                            return "Logical address";
                        }
                    });
            });

        // CREATING THE TOOL TIP FOR NB
        this.MSBoard.selectAll(".bloc-nb")
            .append("div")
            .attr("class", "tool-tip-nb")
            .style("position", "absolute")
            .style("left", "-115px")
            .style("width", "160px")
            .style("visibility", "hidden")
            .style("background", "#38BDF8")
            .style("color", "#9333EA")
            .style("padding", "5px")
            .text("Number of Enregs.");

        this.MSBoard.selectAll(".bloc-nb")
            .on("mouseover", function (e) {
                d3.select(this)
                    .select(".tool-tip-nb")
                    .style("transition", "visibility 0s linear 50ms")
                    .style("visibility", "visible")
            })
            .on("mouseout", function (e) {
                d3.select(this)
                    .select(".tool-tip-nb")
                    .style("transition", "visibility 0s linear 100ms")
                    .style("visibility", "hidden")
            });


        let cpt = 1;

        this.MSBoard.selectAll('.bloc')
            .data(this.blocks)
            .append("div")
            .attr("class", "bloc-body w-full h-80 bg-gray-400 rounded-b-lg")
            .append("ul")
            .attr("class", "text-lg font-medium text-center")
            .each(function (block) {
                d3.select(this)
                    .selectAll("li")
                    .data(block.enregs)
                    .enter()
                    .append("li")
                    .attr("class", "border-b-2 h-10 flex justify-center flex-col")
                    .style("opacity", "0")
                    .style("color", function (enreg) {
                        return enreg.removed ? "#a70000" : "black"
                    })
                    .style("cursor", "pointer")
                    .style("overflow-y", "hidden")
                    .style("overflow-x", "hidden")
                    .on("click", function (e, enreg) {
                        alert(`key: ${enreg.key}
                            field1: ${enreg.field1}
                            field2: ${enreg.field2}
                            removed: ${enreg.removed}`)
                    })
                    .on("mouseover", function () {
                        d3.select(this)
                            .style("background", "gray")
                    })
                    .on("mouseout", function () {
                        d3.select(this)
                            .style("background", "#9CA3AF")
                    })
                    .each(function () {
                        cpt++
                        d3.select(this)
                            .transition()
                            .ease(d3.easeBack)
                            .duration(cpt * 10)
                            .style("opacity", "1")
                    })
                    .append("span")
                    .text(function (enreg) {
                        return enreg.key
                    });
            })
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

    async highlightInstruction(i) {
        // d3.selectAll(`.algorithm div`)
        //     .attr("class", "no-highlight-instruction");
        //
        // d3.select(".algorithm")
        //     .select(`div:nth-child(${i + 1})`)
        //     .attr("class", "highlight-instruction");
        // await sleep(1000);
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
                    .style("background", ENREG_HIGHLIGHT_GREY)
            })
            .append("span")
            .text(function (enreg) {
                return enreg.key
            });
    }

    async traverseBlockAnimation(i, delay) {
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

    async resetBlocksHeaders(delay) {
        this.MSBoard.selectAll(".bloc").select(".bloc-header")
            .transition()
            .duration(600 * delay)
            .style('background', "#0F172A");
    }

    createNewBlockInBuff(newEnreg) {
        this.buff.selectAll("*").remove()
        let bufferElement = this.buff.append("div")
            .attr("class", "bloc w-48 shadow-lg shadow-black/50 rounded-lg flex-shrink-0")
            .style("height", "352px");

        bufferElement.append("div")
            .attr("class", "bloc-header text-white px-3 items-center font-medium h-8 rounded-t-lg w-full flex flex-row justify-between bg-slate-900");

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
            .style("background", ENREG_HIGHLIGHT_GREEN)
            .attr("class", "border-b-2 h-10 flex justify-center flex-col")
            .append("span")
            .text(`${newEnreg.key}`);
    }

    getJsonFormat() {
        let data = {
            name: this.name,
            maxNbEnregs: this.maxNbEnregs,
            nbBlocks: this.nbBlocks,
            nbInsertions: this.nbInsertions,
            blocks: []
        }

        for (let block of this.blocks) {
            let blockData = {
                enregs: [],
                nb: block.nb,
                nextBlockIndex: block.nextBlockIndex
            }

            let enregsData = []

            for (let enreg of block.enregs) {
                enregsData.push({
                    key: enreg.key,
                    field1: enreg.field1,
                    field2: enreg.field2,
                    removed: enreg.removed
                })
            }

            blockData.enregs = enregsData

            data.blocks.push(blockData)
        }

        return data
    }
}
