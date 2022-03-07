import { SFSD, Block, Enreg } from '../../SFSD/SFSD.js';
import TOF from "../../SFSD/types/simple/TOF.js";



let Sfsd = new SFSD();

// let newFile = Sfsd.simple.tof('file.txt');
//
// function randInt(min, max) {
//     min = Math.ceil(min);
//     max = Math.floor(max);
//     return Math.floor(Math.random() * (max - min) + min);
// }
//
// for (let i = 1; i <= 10; i++) {
//     let rn = randInt(0, 100);
//     newFile.insert(
//         rn,
//         "field1",
//         "field2"
//     )
// }


// newFile.print();
// let res = newFile.removeLogically(33);
// console.log(res);
// newFile.print();


// ----------------------------------------------
const keyToSearchField = document.querySelector("#key-to-search");
const searchBtn = document.querySelector("#search-btn");

searchBtn.addEventListener("click", function() {
    let key = parseInt(keyToSearchField.value);
    console.log(key);
    console.log(newFile.search(key));
});


// ----------------------------------------------





let MC_BOARD_WIDTH = 300;
let MC_BOARD_HEIGHT = 500;

let MS_BOARD_WIDTH = 200 * 3 + 20 * 4;
let MS_BOARD_HEIGHT = 500;

let BOARD_WIDTH = MC_BOARD_WIDTH + MS_BOARD_WIDTH + 20;

let svgContainer = d3.select("#board-container")
    .style("max-width", BOARD_WIDTH)
    // .style("border", "1px red dashed")
    .style("overflow-x", "scroll");

let MCBoardContainer = svgContainer.append("div")
    .style("border", "2px blue dotted")
    .style("float", "right")


let MCBoard = MCBoardContainer.append("svg")
    .attr("width", MC_BOARD_WIDTH).attr("height", MC_BOARD_HEIGHT)
    .style("background-color", "gray");


let MSBoardContainer = svgContainer.append("div")
    .style("float", "right")
    .style("max-width", `800px`)
    .style("border", "1px red dashed")
    .style("overflow-x", "scroll");



let MSBoard = MSBoardContainer.append("svg")
    .attr("width", MS_BOARD_WIDTH).attr("height", MS_BOARD_HEIGHT)
    .style("margin-left", "10px")
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
    MCBoard,
    MSBoard,
);

function randInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

for (let i = 1; i <= 14; i++) {
    setTimeout(function () {
        newFile.insert(
            randInt(0, 500),
            "field1",
            "field2"
        )
        newFile.display();
    }, 0 * i)
}

// newFile.print();
