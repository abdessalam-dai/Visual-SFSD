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
        MCBoardContainer,
        MSBoardContainer,
        MCBoard,
        MSBoard,
        maxNbEnregs = MAX_NB_ENREGS_DEFAULT,
        nbBlocks = NB_BLOCKS_DEFAULT,
        nbInsertions = NB_INSERTIONS_DEFAULT,
        blocks = BLOCKS_DEFAULT,
    ) {
        this.name = name;
        this.MCBoard = MCBoard;
        this.MSBoard = MSBoard;
        this.MCBoardContainer = MCBoard;
        this.MSBoardContainer = MSBoard;
        this.maxNbEnregs = maxNbEnregs;
        this.nbBlocks = nbBlocks;
        this.nbInsertions = nbInsertions;
        this.blocks = blocks;

        // temp
        this.d3Elements = {
            MSBoardContainer: null,
            MS : {
                MSBoard: null,
                titleText: null,
                blocks: [
                    // BlockGroup, BlockGroup, ...
                ]
            },
            MCBoardContainer: null,
            MC: {
                MCBoard: null,
                titleText: null,
                blockGroup: null,
            }
        }

        // MSBoardContainer (div) // for scrolling
        //         MSBoard (svg)
        //                 TitleText (text)
        //                 Blocks:
        //                         BlockGroup (g)
        //                         BlockGroup (g)
        //                         ...
        //
        //
        // MCBoardContainer (div)
        //         MCBoard (svg)
        //                 TitleText (text)
        //                 BlockGroup (g)
        //

    }

    display(blockHighlightIndex = -2, blockScrollIndex = -2) {
        // console.log(this.nbBlocks);
        // console.log(this.blocks.length);
        // console.log(this.nbInsertions);

        // remove previous display
        this.MCBoard.selectAll("*").remove();
        this.MSBoard.selectAll("*").remove();

        // add titles
        let MCBoardTitle = this.MCBoard.append("text")
            .attr("x", 10)
            .attr("y", 20)
            .text("MC");

        let MSBoardTitle = this.MSBoard.append("text")
            .attr("x", 10)
            .attr("y", 20)
            .text("MS");

        let blockColor;
        let x = 20, y = 30;

        // Display MC
        // let MCGroup = this.MCBoard.append("g")
        //     .attr("transform", `translate(${x}, ${y})`);
        //
        // MCGroup.append("rect")
        //         .attr("x", 0)
        //         .attr("y", 0)
        //         .attr("width", BLOCK_WIDTH)
        //         .attr("height", BLOCK_HEIGHT)
        //         .attr("fill", "#71a2ff");
        //
        // MCGroup.append("text")
        //     .attr("x", 10)
        //     .attr("y", 20)
        //     .text("Buffer");

        // display buffer
        // if (blockHighlightIndex !== -2) {
        //
        // }


        let counter = 0;

        let newWidth = BLOCK_WIDTH * this.blocks.length + SPACE_BETWEEN_BLOCKS * (this.blocks.length + 1);

        if (this.blocks.length <= 4) {
            newWidth = BLOCK_WIDTH * 4 + SPACE_BETWEEN_BLOCKS * 5;
        }

        this.MSBoard.attr("width", newWidth);
        for (let block of this.blocks) {
            let blockGroup = this.MSBoard.append("g")
                .attr("transform", `translate(${x}, ${y})`);

            if (blockHighlightIndex === counter) {
                blockColor = "#71A2FF";

                this.MSBoardContainer.node().parentNode.scrollTo(
                    {
                        top: 0,
                        left: x,
                        behavior: 'smooth'
                    }
                );
            } else {
                blockColor = "#DBE2EF";
            }

            let rect = blockGroup.append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", BLOCK_WIDTH)
                .attr("height", BLOCK_HEIGHT)
                .attr("fill", blockColor);

            let nbText = blockGroup.append("text")
                .attr("x", BLOCK_WIDTH - 60)
                .attr("y", 20)
                .text(`NB = ${block.nb}`);

            let indexText = blockGroup.append("text")
                .attr("x", 10)
                .attr("y", 20)
                .text(counter);

            let j = 0;

            let dataContainer = blockGroup.append("g")
                .attr("transform", `translate(10, 60)`);

            for (let k = 0; k < block.enregs.length; k++) {
                dataContainer.append("text")
                    .attr("x", 0)
                    .attr("y", j)
                    .text(`${block.enregs[k].key}`);

                j += 20;
            }

            if (blockHighlightIndex === counter) {
                // console.log(blockHighlightIndex)
                let blockGroup = this.MCBoard.append("g")
                    .attr("transform", `translate(20, 30)`);

                blockColor = "#71A2FF";

                let rect = blockGroup.append("rect")
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("width", BLOCK_WIDTH)
                    .attr("height", BLOCK_HEIGHT)
                    .attr("fill", blockColor);

                let nbText = blockGroup.append("text")
                    .attr("x", BLOCK_WIDTH - 60)
                    .attr("y", 20)
                    .text(`NB = ${block.nb}`);

                let indexText = blockGroup.append("text")
                    .attr("x", 10)
                    .attr("y", 20)
                    .text(counter);

                let j = 0;

                let dataContainer = blockGroup.append("g")
                    .attr("transform", `translate(10, 60)`);

                for (let k = 0; k < block.enregs.length; k++) {
                    dataContainer.append("text")
                        .attr("x", 0)
                        .attr("y", j)
                        .text(`${block.enregs[k].key}`);

                    j += 20;
                }
            }

            x += BLOCK_WIDTH + SPACE_BETWEEN_BLOCKS;

            counter++;
        }
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
