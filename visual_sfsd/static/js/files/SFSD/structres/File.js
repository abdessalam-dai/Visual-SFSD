import {
    MAX_NB_ENREGS_DEFAULT,
    NB_BLOCKS_DEFAULT,
    NB_INSERTIONS_DEFAULT,
    BLOCKS_DEFAULT,
    BLOCK_WIDTH,
    BLOCK_HEIGHT,
    SPACE_BETWEEN_BLOCKS,
} from '../../constants.js';


export default class File {
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
        complexity,
        maxNbEnregs = MAX_NB_ENREGS_DEFAULT,
        nbBlocks = NB_BLOCKS_DEFAULT,
        nbInsertions = NB_INSERTIONS_DEFAULT,
        blocks = BLOCKS_DEFAULT,
    ) {
        this.name = name;
        this.buff = buff;
        this.buff2 = buff2;
        this.MSBoard = MSBoard;
        this.complexity = complexity;
        this.maxNbEnregs = maxNbEnregs;
        this.nbBlocks = nbBlocks;
        this.nbInsertions = nbInsertions;
        this.blocks = blocks;
    }

    createBoardsDOM() {
        this.MSBoard.selectAll("*").remove()

        const blocDiv = `
        <div class="bloc w-48 shadow-lg shadow-black/50 rounded-lg flex-shrink-0" style="height: 352px;">
            <div
                class="bloc-header text-white px-3 items-center font-medium h-8 rounded-t-lg w-full flex flex-row justify-between bg-slate-900">
                <span class="bloc-index">0</span>
                <span class="bloc-nb">NB=0</span>
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
            this.MSBoard.node().insertAdjacentHTML('beforeend', blocDiv)
        }

        this.MSBoard.selectAll('.bloc')
            .data(this.blocks)
            .select(".bloc-index")
            .text(function (block, index) {
                return index
            })

        this.MSBoard.selectAll('.bloc')
            .data(this.blocks)
            .select(".bloc-nb")
            .text(function (block) {
                return `NB=${block.nb}`
            })

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
