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
        this.maxNbEnregs = maxNbEnregs;
        this.nbBlocks = nbBlocks;
        this.nbInsertions = nbInsertions;
        this.blocks = blocks;
    }

    print(blockHighlightIndex=-2) {
        // console.log(this.nbBlocks);
        // console.log(this.blocks.length);
        // console.log(this.nbInsertions);

        // remove previous display
        this.MCBoard.selectAll("*").remove();
        this.MSBoard.selectAll("*").remove();

        let blockColor;
        let x = 20, y = 30;

        // Display MC
        let MCGroup = this.MCBoard.append("g")
            .attr("transform", `translate(${x}, ${y})`);

        MCGroup.append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", BLOCK_WIDTH)
                .attr("height", BLOCK_HEIGHT)
                .attr("fill", "#71a2ff");

        MCGroup.append("text")
            .attr("x", 10)
            .attr("y", 20)
            .text("Buffer");


        let counter = 0;

        let newWidth = BLOCK_WIDTH * this.blocks.length + SPACE_BETWEEN_BLOCKS * (this.blocks.length + 1);

        if (this.blocks.length <= 4) {
            newWidth = 200 * 4 + 20 * 5;
        }

        this.MSBoard.attr("width", newWidth);
        for (let block of this.blocks) {
            let group = this.MSBoard.append("g")
                .attr("transform", `translate(${x}, ${y})`);

            if (blockHighlightIndex === counter) {
                blockColor = "#71A2FF";
            } else {
                blockColor = "#DBE2EF";
            }

            group.append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", BLOCK_WIDTH)
                .attr("height", BLOCK_HEIGHT)
                .attr("fill", blockColor);

            group.append("text")
                .attr("x", BLOCK_WIDTH - 60)
                .attr("y", 20)
                .text(`NB = ${block.nb}`);

            group.append("text")
                .attr("x", 10)
                .attr("y", 20)
                .text(counter);

            let j = 0;

            let dataContainer = group.append("g")
                .attr("transform", `translate(10, 60)`);

            for (let k = 0; k < block.enregs.length; k++) {
                dataContainer.append("text")
                    .attr("x", 0)
                    .attr("y", j)
                    .text(`${block.enregs[k].key}`);

                    j += 20;
            }

            x += BLOCK_WIDTH + SPACE_BETWEEN_BLOCKS;

            counter++;
        }
    }
}
