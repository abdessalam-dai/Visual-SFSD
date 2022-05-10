import {
    MAX_NB_ENREGS_DEFAULT,
    NB_BLOCKS_DEFAULT,
    NB_INSERTIONS_DEFAULT,
    BLOCKS_DEFAULT,
    MAX_NB_BLOCKS,
    ENREG_HIGHLIGHT_GREEN,
} from '../../constants.js';
import SequentialFile from "./SequentialFile.js";


export default class ListFile extends SequentialFile {
    /*

    This is class is used for LOF and LnOF files
    methods in common between LOF and LnOF :
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
        headIndex = -1,
        tailIndex = -1,
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
        this.headIndex = headIndex;
        this.tailIndex = tailIndex;
        this.init();
    }

    reset() {
        this.nbBlocks = 0;
        this.nbInsertions = 0;
        this.blocks = [];
        this.headIndex = -1;
        this.tailIndex = -1;
        this.createBoardsDOM();
        this.init();
    }

    init() {
        while (this.blocks.length < this.maxNbBlocks) {
            this.blocks.push(null);
        }
    }

    randomBlockIndex() {
        let randomBlockIndex = Math.floor(Math.random() * this.maxNbBlocks);

        if (this.blocks.every((block) => block !== null)) return -1;

        while (this.blocks[randomBlockIndex] !== null) {
            randomBlockIndex = Math.floor(Math.random() * this.maxNbBlocks);
        }

        return randomBlockIndex;
    }

    createBoardsDOM() {
        // set number of blocks and number of elements in header
        d3.select("#nb-blocks")
            .text(this.nbBlocks);
        d3.select("#nb-elements")
            .text(this.nbInsertions);

        this.MSBoard.selectAll("*").remove();

        const blocDiv = `
        <div class="bloc no-select w-48 shadow-lg shadow-black/50 rounded-lg flex-shrink-0" style="height: 352px;">
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
            .data(this.blocks);

        this.MSBoard.selectAll('.bloc')
            .data(this.blocks)
            .select(".bloc-index")
            .append("span")
            .style("cursor", function (block) {
                if (block !== null) return "pointer";
                return "";
            })
            .text(function (block, index) {
                if (block !== null) return index;
                return "#";
            });

        this.MSBoard.selectAll('.bloc')
            .data(this.blocks)
            .select(".bloc-nb")
            .text(function (block) {
                if (block !== null) return `NB=${block.nb}`;
                return "#";
            });

        // CREATING THE TOOL TIP FOR INDEX
        this.MSBoard.selectAll(".bloc-index")
            .data(this.blocks)
            .each(function (block) {
                if (block !== null) {
                    d3.select(this)
                        .append("div")
                        .attr("class", "tool-tip-index")
                        .classed("rounded-lg", true)
                        .classed("px-4 py-2", true)
                        .style("position", "absolute")
                        .style("bottom", "35px")
                        .style("left", "-7px")
                        .style("width", "180px")
                        .style("z-index", "10")
                        .style("visibility", "hidden")
                        .style("background", "black")
                        .style("color", "white")
                        .style("z-index", "99")
                        .text("Logical address");
                }
            });

        let maxNbBlocks = this.maxNbBlocks;

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
            .on("click", function (e, block) {
                if (block !== null) {
                    let index = d3.select(this)
                        .select("span")
                        .text();

                    index = parseInt(index);

                    d3.select(this)
                        .select("span")
                        .text(function (block, blockIndex) {
                            if (index <= maxNbBlocks && index >= 0) {
                                return `0x${block.blockAddress}`;
                            } else {
                                return blockIndex;
                            }
                        });

                    d3.select(this)
                        .select("div")
                        .text(function (block, blockIndex) {
                            if (index <= maxNbBlocks && index >= 0) {
                                return "Physical address";
                            } else {
                                return "Logical address";
                            }
                        });
                }
            });

        // CREATING THE TOOL TIP FOR NB
        this.MSBoard.selectAll(".bloc-nb")
            .data(this.blocks)
            .each(function (block) {
                if (block !== null) {
                    d3.select(this)
                        .append("div")
                        .attr("class", "tool-tip-nb")
                        .classed("rounded-lg", true)
                        .classed("px-4 py-2", true)
                        .style("position", "absolute")
                        .style("bottom", "35px")
                        .style("right", "-15px")
                        .style("width", "180px")
                        .style("z-index", "10")
                        .style("visibility", "hidden")
                        .style("background", "black")
                        .style("color", "white")
                        .style("z-index", "99")
                        .text("Number of elements");
                }
            });


        this.MSBoard.selectAll(".bloc-nb")
            .on("mouseover", function (e) {
                d3.select(this)
                    .select(".tool-tip-nb")
                    .style("transition", "visibility 0s linear 50ms")
                    .style("visibility", "visible");
            })
            .on("mouseout", function (e) {
                d3.select(this)
                    .select(".tool-tip-nb")
                    .style("transition", "visibility 0s linear 100ms")
                    .style("visibility", "hidden");
            });


        // scroll to the head index (if it exists)
        let headIndex = this.headIndex;
        let tailIndex = this.tailIndex;

        if (headIndex !== -1) {
            this.scrollToBlockElement(this.headIndex, this.MSBoard);
        }

        // make the bg color of the head index and the tail index different
        this.changeHeadAndTailBgs();

        // Add blocks bodies and fill them with data
        let cpt = 1;

        let dropDown = (enreg) => {
            return `
                <button id="dropdownDefault" class="outline-none" data-dropdown-toggle="enreg-dropdown-${enreg.key}">                
                </button>
                <div id="enreg-dropdown-${enreg.key}" class="z-10 fade rounded-b-md hidden bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700"
                style="position: absolute; top: 40px; width: 192px; z-index: 900">
                    <ul class="border-b-md text-sm bg-gray-800 rounded-b-md text-white dark:text-gray-200" aria-labelledby="dropdownDefault">
                          <li class="border-b-2">
                            <span
                            class="flex flex-row justify-between block px-4 py-2">
                                    <span class="text-sm text-blue-300">key</span>
                                    <span>${enreg.key}</span>
                            </span>
                          </li>
                          <li class="border-b-2">
                            <span
                            class="flex flex-row justify-between block px-4 py-2">
                                    <span class="text-sm text-blue-300">field1</span>
                                    <span style="word-wrap: anywhere">${enreg.field1}</span>
                            </span>
                          </li>
                          <li class="border-b-2">
                           <span
                           class="flex flex-row justify-between block px-4 py-2">
                                   <span class="text-sm text-blue-300">field2</span>
                                   <span style="word-wrap: anywhere">${enreg.field2}</span>
                           </span>
                         </li>
                         <li class="border-b-2 rounded-b-md">
                           <span
                           class="flex flex-row justify-between block px-4 py-2">
                                   <span class="text-sm text-blue-300">removed</span>
                                   <span>${enreg.removed}</span>
                           </span>
                         </li>
                    </ul>
                </div>`
        }

        this.MSBoard.selectAll('.bloc')
            .data(this.blocks)
            .append("div")
            .attr("class", "bloc-body w-full h-80 bg-gray-400 rounded-b-lg")
            .append("ul")
            .attr("class", "text-lg font-medium text-center")
            .each(function (block) {
                if (block !== null) {
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
                        .style("position", "relative")
                        .each(function (enreg) {
                            d3.select(this).node().insertAdjacentHTML('beforeend', dropDown(enreg));
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
                        .select("button")
                        .append("span")
                        .text(function (enreg) {
                            return enreg.key;
                        });
                }
            });

        // Add blocks footers (to display next block index)
        this.MSBoard.selectAll(".bloc")
            .data(this.blocks)
            .append("div")
            .attr("class", "bloc-footer text-white px-3 items-center font-medium h-8 rounded-b-lg w-full flex flex-row justify-between")
            .classed("bg-slate-900", function (block) {
                return block !== null;
            })
            .classed("bg-slate-600", function (block) {
                return block === null;
            })
            .style("cursor", function (block) {
                if (block === null || block.nextBlockIndex === -1) return "not-allowed";
                return "pointer";
            })
            .append("span")
            .attr("class", "bloc-next")
            .text(function (block) {
                if (block !== null) return "next=";
                return "#";
            })
            .append("span")
            .each(function (block) {
                d3.select(this).text(function () {
                    if (block !== null) return `${block.nextBlockIndex}`;
                    return "";
                });
            });

        let msBoard = this.MSBoard; // this is needed for the event listener, because the keyword "this" is used for d3
        let scrollToBlockElement = this.scrollToBlockElement;
        this.MSBoard.selectAll(".bloc-next")
            .data(this.blocks)
            .on("click", function (e, block) {
                if (block !== null) {
                    if (block.nextBlockIndex !== -1) {
                        scrollToBlockElement(block.nextBlockIndex, msBoard);
                    }
                }
            });


        // Set different bg colors for blocks that are null
        this.MSBoard.selectAll(".bloc")
            .data(this.blocks)
            .select(".bloc-header")
            .classed("bg-slate-900", function (block) {
                return block !== null;
            })
            .classed("bg-slate-600", function (block) {
                return block === null;
            });

        this.MSBoard.selectAll(".bloc")
            .data(this.blocks)
            .select(".bloc-body")
            .classed("bg-gray-400", function (block) {
                return block !== null;
            })
            .classed("bg-gray-300", function (block) {
                return block === null;
            });
    }

    changeHeadAndTailBgs() {
        let headIndex = this.headIndex;
        let tailIndex = this.tailIndex;
        this.MSBoard.selectAll(".bloc")
            .data(this.blocks)
            .select(".bloc-header")
            .transition()
            .delay(1000)
            .duration(600)
            .style("background", function (block, index) {
                if (index === headIndex) return "#329466";
                if (index === tailIndex) return "#cf6f18";
            });
    }

    scrollToBlockElement(index, msBoard) {
        let blockElement = msBoard.select(`.bloc:nth-child(${index + 1})`);
        // scroll to blockElement
        let msLeft = msBoard.node().offsetLeft;
        let blockLeft = blockElement.node().offsetLeft;

        msBoard.node().scroll({
            left: blockLeft - msLeft - 240,
            behavior: "smooth",
        });

        // highlight the blockElement
        blockElement.transition()
            .duration(600)
            .style("transform", "translate(0, -10px)")
            .select('.bloc-header')
            .style('background', "#1765ba");

        blockElement.transition()
            .delay(1000)
            .duration(600)
            .style("transform", "translate(0, 0)")
            .select('.bloc-header')
            .style('background', "#0F172A");
    }

    isInsertionAllowed() {
        // allow insertion only if the maximum capacity of blocks isn't reached
        let usedBlocks = this.blocks.filter((block) => block !== null);

        if (usedBlocks.length === 0) {
            return true;
        } else if (this.blocks[this.tailIndex].enregs.length < this.maxNbEnregs) {
            return true;
        } else if (usedBlocks.length < this.maxNbBlocks) {
            return true;
        }

        return false;
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

            buff.selectAll(".bloc-body ul li")
                .style("overflow-y", "hidden")
                .style("overflow-x", "hidden");
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

    setBlockAddress(index) {
        return Math.floor(Math.random() * 10000000000).toString(16);
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


        bufferElement.append("div")
            .attr("class", "bloc-footer bg-slate-900 text-white px-3 items-center font-medium h-8 rounded-b-lg w-full flex flex-row justify-between")
            .append("span")
            .attr("class", "bloc-next")
            .text("next=")
            .append("span")
            .text("-1");
    }

    getJsonFormat() {
        let data = {
            characteristics: {
                maxNbEnregs: this.maxNbEnregs,
                maxNbBlocks: this.maxNbBlocks,
                nbBlocks: this.nbBlocks,
                nbInsertions: this.nbInsertions,
                headIndex: this.headIndex,
                tailIndex: this.tailIndex
            },
            blocks: []
        };

        for (let block of this.blocks) {
            let blockData;
            if (block !== null) {
                blockData = {
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
            } else {
                blockData = null;
            }

            data.blocks.push(blockData);
        }

        return data;
    }
}
