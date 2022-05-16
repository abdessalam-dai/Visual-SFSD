import {
    MAX_NB_ENREGS_DEFAULT,
    NB_BLOCKS_DEFAULT,
    NB_INSERTIONS_DEFAULT,
    BLOCKS_DEFAULT,
    ENREG_SIZE,
    MAX_NB_BLOCKS,
    ENREG_HIGHLIGHT_GREEN, ENREG_HIGHLIGHT_GREY,
} from '../../constants.js';
import SequentialFile from "./SequentialFile.js";
import {delay} from "../../view_file/shared/animationSpeed.js";


export default class TableFile extends SequentialFile {
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
    }

    reset() {
        this.nbBlocks = 0;
        this.nbInsertions = 0;
        this.blocks = [];
        this.createBoardsDOM();
    }

    createBoardsDOM() {
        // set number of blocks and number of elements in header
        d3.select("#nb-blocks")
            .text(this.nbBlocks);
        d3.select("#nb-elements")
            .text(this.nbInsertions);

        this.MSBoard.selectAll("*").remove();

        const blocDiv = `
        <div class="bloc overflow-hidden no-select w-40 shadow-lg shadow-black/50 rounded-lg flex-shrink-0">
            <div
                class="bloc-header text-white px-3 items-center font-medium h-8 rounded-t-lg w-full flex flex-row justify-between bg-slate-900">
                <span class="bloc-index no-select" style="position: relative"></span>
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
            .classed("text-sm", true)
            .append("span")
            .style("cursor", "pointer")
            .text(function (block, index) {
                return index;
            });

        this.MSBoard.selectAll('.bloc')
            .data(this.blocks)
            .select(".bloc-nb")
            .classed("text-sm", true)
            .style("z-index", "103")
            .text(function (block) {
                return `NB=${block.nb}`;
            });

        // CREATING THE TOOL TIP FOR INDEX
        this.MSBoard.selectAll(".bloc-index")
            .append("div")
            .attr("class", "tool-tip-index")
            .classed("rounded-lg", true)
            .classed("px-4 py-2", true)
            .classed("text-sm", true)
            .style("position", "absolute")
            .style("top", "35px")
            .style("left", "-7px")
            .style("width", "150px")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .style("background", "black")
            .style("color", "white")
            .style("z-index", "99")
            .text("Logical address");

        const maxNbBlocks = this.maxNbBlocks;
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

                d3.select(this)
                    .select("span")
                    .transition()
                    .ease(d3.easeLinear)
                    .duration(0)
                    .style("transform", "translate(0, +400px)")
                    .transition()
                    .duration(0)
                    .style("transform", "translate(0, -400px)")
                    .text(function (block, blockIndex) {
                        if (parseInt(index) <= maxNbBlocks && parseInt(index) >= 0) {
                            return `0x${block.blockAddress}`;
                        } else {
                            return blockIndex;
                        }
                    })
                    .transition()
                    .duration(0)
                    .style("transform", "translate(0, 0)");


                d3.select(this)
                    .select("div")
                    .text(function (block, blockIndex) {
                        if (index <= maxNbBlocks && index >= 0) {
                            return "Physical address";
                        } else {
                            return "Logical address";
                        }
                    });
            });

        // CREATING THE TOOL TIP FOR NB
        this.MSBoard.selectAll(".bloc-nb")
            .append("div")
            .attr("class", "tool-tip-nb")
            .classed("text-sm", true)
            .classed("rounded-lg", true)
            .classed("px-4 py-2", true)
            .style("position", "absolute")
            .style("top", "35px")
            .style("right", "-10px")
            .style("width", "150px")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .style("background", "black")
            .style("color", "white")
            .style("z-index", "99")
            .text("Num. of elements");

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

        let dropDown = (enreg, top) => {
            return `
                <button id="enreg-dropdown-${enreg.key}-btn" class="outline-none" data-dropdown-toggle="enreg-dropdown-${enreg.key}">                
                </button>
                <div class="enreg-dropdown absolute overflow-hidden ${top ? 'top-8 rounded-b-md' : 'bottom-8 rounded-t-md'} hidden z-10 w-40 fade bg-white divide-y divide-gray-100 shadow dark:bg-gray-700"
                style="position: absolute;  z-index: 115">
                    <ul class="font-normal text-sm bg-gray-800 text-white dark:text-gray-200">
                          <li class="border-b-2">
                            <span
                            class="flex flex-row justify-between block px-4 py-1">
                                    <span class="text-sm text-blue-300 font-medium">key</span>
                                    <span>${enreg.key}</span>
                            </span>
                          </li>
                          <li class="border-b-2">
                            <span
                            class="flex flex-row justify-between block px-4 py-1">
                                    <span class="text-sm text-blue-300 font-medium">field1</span>
                                    <span style="word-wrap: anywhere">${enreg.field1}</span>
                            </span>
                          </li>
                          <li class="border-b-2">
                           <span
                           class="flex flex-row justify-between block px-4 py-1">
                                   <span class="text-sm text-blue-300 font-medium">field2</span>
                                   <span style="word-wrap: anywhere">${enreg.field2}</span>
                           </span>
                         </li>
                         <li class="border-b-2">
                           <span
                           class="flex flex-row justify-between block px-4 py-1">
                                   <span class="text-sm text-blue-300 font-medium">removed</span>
                                   <span>${enreg.removed}</span>
                           </span> 
                         </li>
                    </ul>
                </div>`
        }

        this.MSBoard.selectAll('.bloc')
            .data(this.blocks)
            .append("div")
            .classed(`bloc-body w-full h-64 bg-[${ENREG_HIGHLIGHT_GREY}] rounded-b-lg`, true)
            .append("ul")
            .attr("class", "text-sm font-medium text-center")
            .each(function (block) {
                d3.select(this)
                    .selectAll("li")
                    .data(block.enregs)
                    .enter()
                    .append("li")
                    .attr("class", `border-b-2 bg-[${ENREG_HIGHLIGHT_GREY}] border-gray-700 h-8 flex justify-center flex-col`)
                    .style("opacity", "0")
                    .style("color", function (enreg) {
                        return enreg.removed ? "#a70000" : "black"
                    })
                    .style("cursor", "pointer")
                    .style("position", "relative")
                    .each(function (enreg, index) {
                        d3.select(this).node().insertAdjacentHTML('beforeend', dropDown(enreg, index < 4));
                    })
                    .on("mouseover", function () {
                        d3.select(this)
                            .style("background", "#9CA3AF")
                    })
                    .on("mouseout", function () {
                        d3.select(this)
                            .style("background", ENREG_HIGHLIGHT_GREY)
                    })
                    .each(function () {
                        cpt++
                        d3.select(this)
                            .transition()
                            .ease(d3.easeBack)
                            .duration(cpt * 10)
                            .style("opacity", "1")
                    })
                    .select("button")
                    .on("mouseover", function () {
                        d3.select(this.parentNode)
                            .select(".enreg-dropdown")
                            .classed("hidden", false);
                    })
                    .on("mouseout", function () {
                        d3.select(this.parentNode)
                            .select(".enreg-dropdown")
                            .classed("hidden", true);
                    })
                    .classed("overflow-hidden flex text-sm flex-col justify-center items-center w-full h-full", true)
                    .append("span")
                    .text(function (enreg) {
                        return enreg.key;
                    });
            });
    }

    isInsertionAllowed() {
        // allow insertion only if the maximum capacity of blocks isn't reached
        if (this.blocks.length === 0) {
            return true;
        } else if (this.blocks[this.blocks.length - 1].enregs.length < this.maxNbEnregs) {
            return true;
        } else if (this.blocks.length < this.maxNbBlocks) {
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
                .attr("class", "bloc w-40 shadow-lg shadow-black/50 rounded-lg flex-shrink-0")
                .html(blockElement.html());

            buff.select(".bloc-header .bloc-index")
                .text("Buffer 1");

            buff.select(".bloc-header .bloc-address").remove();

            buff.selectAll(".bloc-header span")
                .select("div")
                .remove();

            buff.selectAll(".bloc-body ul li")
                .style("overflow", "hidden");

            buff.selectAll(".enreg-dropdown").remove();
            return buff;
        } else {
            this.buff2.selectAll("*").remove()
            let buff = this.buff2.append("div")
                .attr("class", "bloc w-40 shadow-lg shadow-black/50 rounded-lg flex-shrink-0 h-64")
                .html(blockElement.html());

            buff.select(".bloc-header .bloc-index")
                .text("Buffer 2");

            buff.select(".bloc-header .bloc-address").remove();

            buff.selectAll(".bloc-header span")
                .select("div")
                .remove();

            buff.selectAll(".bloc-body ul li")
                .style("overflow", "hidden");

            buff.selectAll(".enreg-dropdown").remove();
            return buff;
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

    createNewBlockInBuff(newEnreg) {
        this.buff.selectAll("*").remove()
        let bufferElement = this.buff.append("div")
            .attr("class", "bloc w-40 shadow-lg shadow-black/50 rounded-lg flex-shrink-0 h-64");

        bufferElement.append("div")
            .attr("class", "bloc-header text-sm text-white px-3 items-center font-medium h-8 rounded-t-lg w-full flex flex-row justify-between bg-slate-900");

        bufferElement.select(".bloc .bloc-header")
            .append("span")
            .attr("class", "bloc-index")
            .text("Buffer 1");

        bufferElement.select(".bloc .bloc-header")
            .append("span")
            .attr("class", "bloc-nb")
            .text("NB=1");

        bufferElement.append("div")
            .attr("class", `bloc-body w-full h-64 bg-[${ENREG_HIGHLIGHT_GREY}] rounded-b-lg`)
            .append("ul")
            .attr("class", "text-sm font-medium text-center")
            .append("li")
            .attr("class", `border-b-2 bg-[${ENREG_HIGHLIGHT_GREEN}] border-gray-700 h-8 flex justify-center flex-col`)
            .append("span")
            .text(`${newEnreg.key}`);
    }

    getJsonFormat() {
        let data = {
            characteristics: {
                maxNbEnregs: this.maxNbEnregs,
                maxNbBlocks: this.maxNbBlocks,
                nbBlocks: this.nbBlocks,
                nbInsertions: this.nbInsertions,
            },
            blocks: []
        };

        for (let block of this.blocks) {
            let blockData = {
                enregs: [],
                nb: block.nb,
                blockAddress: block.blockAddress,
                nextBlockIndex: block.nextBlockIndex
            };

            let enregsData = [];
            for (let enreg of block.enregs) {
                enregsData.push({
                    key: enreg.key,
                    field1: enreg.field1,
                    field2: enreg.field2,
                    removed: enreg.removed
                });
            }

            blockData.enregs = enregsData;

            data.blocks.push(blockData);
        }

        return data;
    }
}
