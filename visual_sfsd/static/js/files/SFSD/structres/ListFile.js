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


export default class ListFile {
    /*
        name :          file name [String]
        maxNbEnregs :   max. number of enregs. in a block [Int]
        nbBlocks :      number of blocks [Int]
        nbInsertions :  number of inserted enregs. [Int]
        blocks :        array of blocks [class Block]
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
        headIndex = -1,
        tailIndex = -1,
    ) {
        this.name = name;
        this.buff = buff;
        this.buff2 = buff2;
        this.MSBoard = MSBoard;
        this.maxNbEnregs = maxNbEnregs;
        this.nbBlocks = nbBlocks;
        this.nbInsertions = nbInsertions;
        this.blocks = blocks;
        this.headIndex = headIndex;
        this.tailIndex = tailIndex;
        this.init();
    }

    init() {
        while (this.blocks.length < MAX_NB_BLOCKS) {
            this.blocks.push(null);
        }
    }

    createBoardsDOM() {
        this.MSBoard.selectAll("*").remove();

        const blocDiv = `
        <div class="bloc w-48 shadow-lg shadow-black/50 rounded-lg flex-shrink-0" style="height: 352px;">
            <div
                class="bloc-header text-white px-3 items-center font-medium h-8 rounded-t-lg w-full flex flex-row justify-between bg-slate-900">
                <span class="bloc-index" style="position: relative">0</span>
                <span class="bloc-address" style="position: relative"></span>
                <span class="bloc-nb" style="position: relative">NB=0</span>
            </div>
<!--            <div class="bloc-body w-full h-80 bg-gray-400 rounded-b-lg">-->
<!--                <ul class="text-lg font-medium text-center">-->
<!--&lt;!&ndash;                    <li class="border-b-2 h-10 flex justify-center flex-col">5464</li>&ndash;&gt;-->
<!--&lt;!&ndash;                    <li class="border-b-2 h-10 flex justify-center flex-col">5464</li>&ndash;&gt;-->
<!--&lt;!&ndash;                    <li class="border-b-2 h-10 flex justify-center flex-col">5464</li>&ndash;&gt;-->
<!--&lt;!&ndash;                    <li class="border-b-2 h-10 flex justify-center flex-col">5464</li>&ndash;&gt;-->
<!--&lt;!&ndash;                    <li class="border-b-2 h-10 flex justify-center flex-col">5464</li>&ndash;&gt;-->
<!--&lt;!&ndash;                    <li class="border-b-2 h-10 flex justify-center flex-col">5464</li>&ndash;&gt;-->
<!--&lt;!&ndash;                    <li class="border-b-2 h-10 flex justify-center flex-col">5464</li>&ndash;&gt;-->
<!--&lt;!&ndash;                    <li class=" h-10 flex justify-center flex-col">5464</li>&ndash;&gt;-->
<!--                </ul>-->
<!--            </div>-->
        </div>`

        for (let block of this.blocks) {
            this.MSBoard.node().insertAdjacentHTML('beforeend', blocDiv);
        }

        this.MSBoard.selectAll('.bloc')
            .data(this.blocks)
            .select(".bloc-index")
            .text(function (block, index) {
                if (block !== null) return `next=${block.nextBlockIndex}`
                return '#'
            });

        let headIndex = this.headIndex;

        this.MSBoard.selectAll(".bloc")
            .data(this.blocks)
            .select(".bloc-header")
            .style("background", function (block, index) {
                if (index === headIndex) {
                    return "#9361ff"
                }
            });

        this.MSBoard.selectAll('.bloc')
            .data(this.blocks)
            .select(".bloc-address")
            .style("color", "#38BDF8")
            .text(function (block, index) {

                if (block !== null) return `0x${block.blockAddress}`;

                return '...'
            });

        this.MSBoard.selectAll('.bloc')
            .data(this.blocks)
            .select(".bloc-nb")
            .text(function (block) {
                if (block !== null) return `NB=${block.nb}`

                return '0'
            });

        // CREATING THE TOOL TIP FOR INDEX
        this.MSBoard.selectAll(".bloc-index")
            .append("div")
            .attr("class", "tool-tip-index")
            .style("position", "absolute")
            .style("width", "160px")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .style("background", "#38BDF8")
            .style("color", "#9333EA")
            .style("padding", "5px")
            .text("Index")

        this.MSBoard.selectAll(".bloc-index")
            .on("mouseover", function (e) {
                d3.select(this)
                    .select(".tool-tip-index")
                    .style("transition", "visibility 0s linear 50ms")
                    .style("visibility", "visible")
            })
            .on("mouseout", function (e) {
                d3.select(this)
                    .select(".tool-tip-index")
                    .style("transition", "visibility 0s linear 100ms")
                    .style("visibility", "hidden")
            })

        this.MSBoard.selectAll(".bloc-address")
            .append("div")
            .attr("class", "tool-tip-address")
            .style("position", "absolute")
            .style("width", "160px")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .style("background", "#38BDF8")
            .style("color", "#9333EA")
            .style("padding", "5px")
            .text("Physical address")
        // CREATING THE TOOL TIP FOR INDEX
        this.MSBoard.selectAll(".bloc-address")
            .on("mouseover", function (e) {
                d3.select(this)
                    .select(".tool-tip-address")
                    .style("transition", "visibility 0s linear 50ms")
                    .style("visibility", "visible")
            })
            .on("mouseout", function (e) {
                d3.select(this)
                    .select(".tool-tip-address")
                    .style("transition", "visibility 0s linear 100ms")
                    .style("visibility", "hidden")
            })

        // CREATING THE TOOL TIP FOR NB

        this.MSBoard.selectAll(".bloc-nb")
            .append("div")
            .attr("class", "tool-tip-nb")
            .style("position", "absolute")
            .style("width", "160px")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .style("background", "#38BDF8")
            .style("color", "#9333EA")
            .style("padding", "5px")
            .text("Number of Enregs.");

        // CREATING THE TOOL TIP FOR INDEX
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
            })


        let cpt = 1;

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
                }
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
        return Math.floor(Math.random() * 10000000000).toString(16);
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
