import {delay, sleep} from "../../view_file/shared/animationSpeed.js";
import {
    BLOCKS_DEFAULT,
    ENREG_HIGHLIGHT_GREEN, ENREG_HIGHLIGHT_GREY, ERROR_BG,
    MAX_NB_BLOCKS,
    MAX_NB_ENREGS_DEFAULT,
    NB_BLOCKS_DEFAULT,
    NB_INSERTIONS_DEFAULT, SUCCESS_BG, WARNING_BG
} from "../../constants.js";

export default class SequentialFile {
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
        this.name = name;
        this.buff = buff;
        this.buff2 = buff2;
        this.MSBoard = MSBoard;
        this.maxNbEnregs = maxNbEnregs;
        this.maxNbBlocks = maxNbBlocks;
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
            this.updateMCDescription(`No element with key=${key} was found`, "error");
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
            // block.enregs[j].removed = removed; // no need to edit removed

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
            this.updateMCDescription(`No element with key=${key} was found`, "error");
            return false;
        }
    }

    // here, status can be error, warning or success
    updateMCDescription(message, status) {
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

    updateIOTimes(readTimes, writeTimes) {
        d3.select(".complexity-in-reading")
            .text(`Number of reads : ${readTimes}`);

        d3.select(".complexity-in-writing")
            .text(`Number of writes : ${writeTimes}`);
    }

    updateBlockInMS(i, block) {
        let blockElement = this.MSBoard.select(`.bloc:nth-child(${i + 1})`);
        console.log(blockElement)

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

}


