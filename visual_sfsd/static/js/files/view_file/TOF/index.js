import {SFSD, Block, Enreg} from '../../SFSD/SFSD.js';
import TOF from "../../SFSD/types/simple/TOF.js";


let Sfsd = new SFSD();

// ----------------------------------------------
const keyToSearchField = document.querySelector("#key-to-search");
const searchBtn = document.querySelector("#search-btn");

searchBtn.addEventListener("click", function () {
    let key = parseInt(keyToSearchField.value);

    let {
        found: found,
        pos: pos,
        traversedBlocks: traversedBlocks,
        traversedEnregs: traversedEnregs
    } = newFile.search(key);

    let i = 0;

    function myLoop() {
        setTimeout(function () {
            let blockIndex = traversedBlocks[i];
            newFile.display(blockIndex);
            i++;
            if (i < traversedBlocks.length) {
                myLoop();
            }
        }, 400)
    }

    myLoop()

    // console.table(data.blocks)
    console.log(traversedEnregs)
});


// ----------------------------------------------


let MC_BOARD_WIDTH = 300;
let MC_BOARD_HEIGHT = 500;

let MS_BOARD_WIDTH = 200 * 3 + 20 * 4;
let MS_BOARD_HEIGHT = 500;

let BOARD_WIDTH = MC_BOARD_WIDTH + MS_BOARD_WIDTH + 20;

let boardContainer = d3.select("#board-container")
    .style("max-width", BOARD_WIDTH)
    .style("border", "1px green dashed")
    .style("overflow-x", "scroll");

let MCBoardContainer = boardContainer.append("div")
    .style("border", "2px blue dotted")
    .style("float", "right")


let MCBoard = MCBoardContainer.append("svg")
    .attr("width", MC_BOARD_WIDTH).attr("height", MC_BOARD_HEIGHT)
    .style("background-color", "gray");


let MSBoardContainer = boardContainer.append("div")
    .style("float", "right")
    .style("max-width", `800px`)
    .style("border", "1px red dashed")
    .style("overflow-x", "scroll")
    .style("scroll-behavior", "smooth");


let MSBoard = MSBoardContainer.append("svg")
    .attr("width", MS_BOARD_WIDTH).attr("height", MS_BOARD_HEIGHT)
    .style("margin-left", "10px")
    // .attr("viewBox", "0 0 1122 793")
    .style("background-color", "#eee");

let MCBoardTitle = MCBoard.append("text")
    .attr("x", 10)
    .attr("y", 20)
    .text("MC");

let MSBoardTitle = MSBoard.append("text")
    .attr("x", 10)
    .attr("y", 20)
    .text("MS");


let newFile = new TOF(
    'file.txt',
    MCBoardContainer,
    MSBoardContainer,
    MCBoard,
    MSBoard,
);

function randInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

for (let i = 1; i <= 70; i++) {
    // setTimeout(function () {
        newFile.insert(
            randInt(0, 500),
            "field1",
            "field2"
        )
    // }, 30 * i)
}

newFile.display();

//
// $.post('{% url "images:like" %}',
//     {
//         id: $(this).data('id'),
//         action: $(this).data('action')
//     },
//     function (data) {
//         if (data['status'] === 'ok') {
//             var previous_action = $('a.like').data('action');
//             // toggle data-action
//             $('a.like').data('action', previous_action === 'like' ?
//                 'unlike' : 'like');
//             // toggle link text
//             $('a.like').text(previous_action == 'like' ? 'Unlike' :
//                 'Like');
//             // update total likes
//             var previous_likes = parseInt($('span.count .total').text());
//             $('span.count .total').text(previous_action == 'like' ?
//                 previous_likes + 1 : previous_likes - 1);
//         }
//     }
// );
