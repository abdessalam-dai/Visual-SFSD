import {SFSD, Block, Enreg} from '../../SFSD/SFSD.js';
import TOF from "../../SFSD/types/simple/TOF.js";


// ----------------------------------------------
// const keyToSearchField = document.querySelector("#key-to-search");
// const searchBtn = document.querySelector("#search-btn");
//
// searchBtn.addEventListener("click", function () {
//     let key = parseInt(keyToSearchField.value);
//
//     let {
//         found: found,
//         pos: pos,
//         traversedBlocks: traversedBlocks,
//         traversedEnregs: traversedEnregs
//     } = newFile.search(key);
//
//     let i = 0;
//
//     function myLoop() {
//         setTimeout(function () {
//             let blockIndex = traversedBlocks[i];
//             newFile.display(blockIndex);
//             i++;
//             if (i < traversedBlocks.length) {
//                 myLoop();
//             }
//         }, 400)
//     }
//
//     myLoop()
//
//     // console.table(data.blocks)
//     console.log(traversedEnregs)
// });


// START - Create file
const buff = d3.select(".buf")
const MSBoard = d3.select(".ms-container")

let newFile = new TOF(
    'file.txt',
    buff,
    MSBoard,
);

// newFile.insert(
//     0,
//     "dai",
//     "abdou",
//     false,
// )
//
// newFile.display()

// END - Create file


// START - DOM Elements
const generateDataBtn = document.querySelector('#generate-data-btn');

const keyToSearch = document.querySelector("#key-to-search");
const searchBtn = document.querySelector("#search-btn");

const keyToRemove = document.querySelector("#key-to-remove");
const removeBtn = document.querySelector("#remove-btn");

const keyToInsert = document.querySelector("#key-to-insert");
const field1ToInsert = document.querySelector("#field1-to-insert");
const field2ToInsert = document.querySelector("#field2-to-insert");
const insertBtn = document.querySelector("#insert-btn");


const changeButtonsState = (state) => {
    generateDataBtn.disabled = state
    searchBtn.disabled = state
    removeBtn.disabled = state
    insertBtn.disabled = state
}

// END - DOM Elements


// START - Fill with dummy data
const n = 8
const min = 0
const max = 30

function randInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function generateData(n, min, max) {
    const randomData = ["DAWDI", "bousla", "kacimi", "yanis", "farouk", "rami", "ali", "MOHEMMED", "massinisa", "yuva", "aksil", "tari", "sebaa", "mouloud", "hamid", "ahmed", "bilal", "abdessalam", "zinneddin", "yahia", "houssam", "wassim"]

    let arrOfKeys = [];
    let arr = [];
    let key;
    let field1, field2;
    let i = 0;

    while (i < n) {
        key = randInt(min, max);

        field1 = randomData[randInt(0, randomData.length - 1)];
        field2 = randomData[randInt(0, randomData.length - 1)];

        if (!arrOfKeys.includes(key)) {
            let newObj = {
                key: key,
                field1: field1,
                field2: field2,
            }
            arr.push(newObj);
            arrOfKeys.push(key)
            i++;
        }
    }

    return arr.sort((a, b) => a.key - b.key) // return sorted array according to key
}

function handleGenerateData() {
    generateDataBtn.addEventListener('click', () => {
        changeButtonsState(true)

        let data = generateData(n, min, max)

        for (const enreg of data) {
            newFile.insert(
                enreg.key,
                enreg.field1,
                enreg.field2,
                false
            )
        }

        // console.log(newFile.getJsonFormat())
        // console.log(newFile.blocks)
        newFile.createBoardsDOM()

        changeButtonsState(false)
    })

}

handleGenerateData()


let data = generateData(35, 0, 100)

for (const enreg of data) {
    await newFile.insert(
        enreg.key,
        enreg.field1,
        enreg.field2,
        false,
        false
    )
}

newFile.createBoardsDOM()

// END - Fill with dummy data


// START - Search for element
function handleSearch() {
    searchBtn.addEventListener("click", async function () {
        changeButtonsState(true)

        let key = parseInt(keyToSearch.value);

        let {
            found: found,
            pos: pos,
        } = await newFile.search(key, true);

        console.log(found, pos)

        changeButtonsState(false)
    });
}

handleSearch()
// END - Search for element


// START - Remove element
function handleRemove() {
    removeBtn.addEventListener("click", async function () {
        changeButtonsState(true)

        let key = parseInt(keyToRemove.value);

        let removeSuccess = await newFile.removeLogically(key, true);

        console.log(removeSuccess)

        changeButtonsState(false)
    });
}

handleRemove()

// END - Remove element


// START - Inert Enreg.
function handleInsert() {
    insertBtn.addEventListener("click", async function () {
        changeButtonsState(true)

        let key = parseInt(keyToInsert.value);
        let field1 = field1ToInsert.value;
        let field2 = field2ToInsert.value;

        let insertingResult = await newFile.insert(key, field1, field2, false, true);

        console.log(insertingResult)

        changeButtonsState(false)

        newFile.createBoardsDOM()
    });
}

handleInsert()

// END - Inert Enreg.
