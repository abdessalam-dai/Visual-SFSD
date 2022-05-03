import TOF from "../SFSD/types/simple/TOF.js";
import TnOF from "../SFSD/types/simple/TnOF.js";
import LOF from "../SFSD/types/simple/LOF.js";
import LnOF from "../SFSD/types/simple/LnOF.js";
import NotClustered from "../SFSD/types/indexed/NotClustered.js";
import Clustered from "../SFSD/types/indexed/Clustered.js";
import EssaiLinear from "../SFSD/types/hashing/EssaiLinear.js";
import {Block, Enreg} from "../SFSD/SFSD.js";
import IndexCouple from "../SFSD/structres/IndexCouple.js";
import {animate} from "./shared/animationSpeed.js";
import * as DomElements from "./DomElements.js";
import "./shared/fileHead.js";
import "./shared/MC.js";


// START - useful functions
function isNumeric(value) {
    return /^-?\d+$/.test(value);
}

const getValue = (element) => {
    return parseInt(element.value);
}
// END - useful functions


// START - Create file from Json data (passed by Django in view_file/index.html)
const buff = d3.select(".buf");
const buff2 = d3.select(".buf2");
const MSBoard = d3.select(".ms-container");
const indexTableHtml = d3.select("#index-table");
let toolTipIsVisible = false;
let ToolTipToHide;

let newFile;

// START - put the blocks in an array
let blocks = [];
for (let block of fileData["blocks"]) {
    let b;
    if (block !== null) {
        let enregs = [];

        for (let enreg of block["enregs"]) {
            let e = new Enreg(enreg["key"], enreg["field1"], enreg["field2"], enreg["removed"]);
            enregs.push(e);
        }

        b = new Block(enregs, block["nb"], block["blockAddress"], block["nextBlockIndex"]);
    } else {
        b = null;
    }
    blocks.push(b);
}
console.log(blocks)
// END - put the blocks in an array

// START - put the index table in an array
let indexTable = [];
if (FILE_ACCESS === "indexed") {
    for (let couple of fileData["indexTable"]) {
        let c = new IndexCouple(couple["key"], couple["i"], couple["j"]);
        indexTable.push(c);
    }
}
// END - put the index table in an array

if (FILE_TYPE === "not_clustered") {
    newFile = new NotClustered(
        FILE_NAME,
        buff,
        buff2,
        MSBoard,
        parseInt(fileData["characteristics"]["maxNbEnregs"]),
        parseInt(fileData["characteristics"]["maxNbBlocks"]),
        parseInt(fileData["characteristics"]["nbBlocks"]),
        parseInt(fileData["characteristics"]["nbInsertions"]),
        blocks,
        indexTable,
        parseInt(fileData["characteristics"]["maxIndex"]),
        indexTableHtml
    );
} else if (FILE_TYPE === "clustered") {
    newFile = new Clustered(
        FILE_NAME,
        buff,
        buff2,
        MSBoard,
        parseInt(fileData["characteristics"]["maxNbEnregs"]),
        parseInt(fileData["characteristics"]["maxNbBlocks"]),
        parseInt(fileData["characteristics"]["nbBlocks"]),
        parseInt(fileData["characteristics"]["nbInsertions"]),
        blocks,
        indexTable,
        parseInt(fileData["characteristics"]["maxIndex"]),
        indexTableHtml
    );
} else if (FILE_TYPE === "TOF") {
    newFile = new TOF(
        FILE_NAME,
        buff,
        buff2,
        MSBoard,
        parseInt(fileData["characteristics"]["maxNbEnregs"]),
        parseInt(fileData["characteristics"]["maxNbBlocks"]),
        parseInt(fileData["characteristics"]["nbBlocks"]),
        parseInt(fileData["characteristics"]["nbInsertions"]),
        blocks
    );
} else if (FILE_TYPE === "TnOF") {
    newFile = new TnOF(
        FILE_NAME,
        buff,
        buff2,
        MSBoard,
        parseInt(fileData["characteristics"]["maxNbEnregs"]),
        parseInt(fileData["characteristics"]["maxNbBlocks"]),
        parseInt(fileData["characteristics"]["nbBlocks"]),
        parseInt(fileData["characteristics"]["nbInsertions"]),
        blocks
    );
} else if (FILE_TYPE === "LOF") {
    newFile = new LOF(
        FILE_NAME,
        buff,
        buff2,
        MSBoard,
        parseInt(fileData["characteristics"]["maxNbEnregs"]),
        parseInt(fileData["characteristics"]["maxNbBlocks"]),
        parseInt(fileData["characteristics"]["nbBlocks"]),
        parseInt(fileData["characteristics"]["nbInsertions"]),
        blocks,
        parseInt(fileData["characteristics"]["headIndex"]),
        parseInt(fileData["characteristics"]["tailIndex"])
    );
} else if (FILE_TYPE === "LnOF") {
    newFile = new LnOF(
        FILE_NAME,
        buff,
        buff2,
        MSBoard,
        parseInt(fileData["characteristics"]["maxNbEnregs"]),
        parseInt(fileData["characteristics"]["maxNbBlocks"]),
        parseInt(fileData["characteristics"]["nbBlocks"]),
        parseInt(fileData["characteristics"]["nbInsertions"]),
        blocks,
        parseInt(fileData["characteristics"]["headIndex"]),
        parseInt(fileData["characteristics"]["tailIndex"])
    );
} else if (FILE_TYPE === "static") {
    newFile = new EssaiLinear(
        FILE_NAME,
        buff,
        buff2,
        MSBoard,
        parseInt(fileData["characteristics"]["maxNbEnregs"]),
        parseInt(fileData["characteristics"]["maxNbBlocks"]),
        parseInt(fileData["characteristics"]["nbBlocks"]),
        parseInt(fileData["characteristics"]["nbInsertions"]),
        blocks,
        [],
    );
}

console.log(newFile.getJsonFormat());
newFile.createBoardsDOM();
if (FILE_ACCESS === "indexed") {
    newFile.createIndexTableDOM();
}

// END - Create file


const changeButtonsState = (state) => {
    if (state) { // if an option is clicked, hide all tooltips
        hideAllToolbarTooltips();
    }
    DomElements.generateDataBtn.disabled = state
    DomElements.searchBtn.disabled = state
    DomElements.removeBtn.disabled = state
    DomElements.insertBtn.disabled = state
    DomElements.editBtn.disabled = state
    DomElements.removePhysicallyBtn.disabled = state
}


// START - Handle toolbar
Array.from(DomElements.toolbarIcons).forEach(option => {
    option.addEventListener('click', (e) => {
        let tooltip = option.parentNode.parentNode.children[1];

        if (toolTipIsVisible) {
            document.querySelectorAll('.tooltip-visible').forEach(tooltip => {
                tooltip.classList.remove('tooltip-visible');
                toolTipIsVisible = false;
                tooltip.classList.add('hidden');
            });
        }

        if (tooltip.classList.contains("hidden")) {
            tooltip.classList.remove(("hidden"));
            tooltip.classList.add("tooltip-visible");
            ToolTipToHide = tooltip;
            toolTipIsVisible = true;
        } else {
            tooltip.classList.add(("hidden"));
            tooltip.classList.remove("tooltip-visible");
            toolTipIsVisible = false;
            ToolTipToHide = "";
        }
    })
})


document.addEventListener('click', (e) => {
    if (!e.target.classList.contains("toolbar-icon") && e.target.tagName !== 'INPUT' && toolTipIsVisible) {
        ToolTipToHide.classList.add("hidden");
        ToolTipToHide.classList.remove("tooltip-visible");
        toolTipIsVisible = false;
    }
})


// make sure that the z-index for toolbar tooltips is higher
document.querySelectorAll(".toolbar-tooltip").forEach((tooltip) => {
    tooltip.style.zIndex = "101";
});

const hideAllToolbarTooltips = () => {
    DomElements.toolbarOptions.forEach((option) => {
        let tooltip = option.querySelector(".toolbar-tooltip");
        tooltip.classList.add("hidden");
    });
}

// END - Handle toolbar


// START - validate data while changing (key, field1, field2)
let elementsNumberValid = false,
    minKeyValid = false,
    maxKeyValid = false;
let keyToSearchValid = false;
let keyToRemoveValid = false;
let keyToRemovePhysicallyValid = false;
let keyToInsertValid = false,
    field1ToInsertValid = true,
    field2ToInsertValid = true;
let keyToEditValid = false,
    field1ToEditValid = true,
    field2ToEditValid = true;

const validateGenerateData = () => {
    DomElements.elementsNumber.addEventListener("keyup", function () {
        let key = DomElements.elementsNumber.value.trim();
        elementsNumberValid = isNumeric(key);
    });

    DomElements.minKey.addEventListener("keyup", function () {
        let key = DomElements.minKey.value.trim();
        minKeyValid = isNumeric(key);
    });

    DomElements.maxKey.addEventListener("keyup", function () {
        let key = DomElements.maxKey.value.trim();
        maxKeyValid = isNumeric(key);
    });
}

const validateSearch = () => {
    DomElements.keyToSearch.addEventListener("keyup", function () {
        let key = DomElements.keyToSearch.value.trim();
        keyToSearchValid = isNumeric(key);
    });
}

const validateKeyToRemove = () => {
    DomElements.keyToRemove.addEventListener("keyup", function () {
        let key = DomElements.keyToRemove.value.trim();
        keyToRemoveValid = isNumeric(key);
    });
}

const validateKeyToRemovePhysically = () => {
    DomElements.keyToRemovePhysically.addEventListener("keyup", function () {
        let key = DomElements.keyToRemovePhysically.value.trim();
        keyToRemovePhysicallyValid = isNumeric(key);
    });
}

const validateInsert = () => {
    DomElements.keyToInsert.addEventListener("keyup", function () {
        let key = DomElements.keyToInsert.value.trim();
        keyToInsertValid = isNumeric(key);
    });

    DomElements.field1ToInsert.addEventListener("keyup", function () {
        let field1 = DomElements.field1ToInsert.value.trim();
        field1ToInsertValid = field1.length < 100;
    });

    DomElements.field2ToInsert.addEventListener("keyup", function () {
        let field2 = DomElements.field2ToInsert.value.trim();
        field2ToInsertValid = field2.length < 100;
    });
}

const validateEdit = () => {
    DomElements.keyToEdit.addEventListener("keyup", function () {
        let key = DomElements.keyToEdit.value.trim();
        keyToEditValid = isNumeric(key);
    });

    DomElements.field1ToEdit.addEventListener("keyup", function () {
        let field1 = DomElements.field1ToEdit.value.trim();
        field1ToEditValid = field1.length < 100;
    });

    DomElements.field2ToEdit.addEventListener("keyup", function () {
        let field2 = DomElements.field2ToEdit.value.trim();
        field2ToEditValid = field2.length < 100;
    });
}

validateGenerateData();
validateSearch();
validateKeyToRemove();
validateKeyToRemovePhysically();
validateInsert();
validateEdit();
// END - validate data while changing (key, field1, field2)


// START - Fill with dummy data
const randInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

const generateData = (n, min, max) => {
    const randomData = ["DAWDI", "bousla", "kacimi", "yanis", "farouk", "rami", "ali", "MOHEMMED", "massinisa", "yuva", "aksil", "tari", "sebaa", "mouloud", "hamid", "ahmed", "bilal", "abdessalam", "zinneddin", "yahia", "houssam", "wassim"]

    let arrOfKeys = [];
    let arr = [];
    let key;
    let field1, field2;
    let i = 0;

    while (arr.length < n) {
        key = randInt(min, max);

        field1 = randomData[randInt(0, randomData.length - 1)];
        field2 = randomData[randInt(0, randomData.length - 1)];

        if (arrOfKeys.indexOf(key) === -1) {
            let newObj = {
                key: key,
                field1: field1,
                field2: field2,
            }
            arr.push(newObj);
            arrOfKeys.push(key);
            i++;
        }
    }

    if (FILE_TYPE === "TOF" || FILE_TYPE === "LOF") {
        return arr.sort((a, b) => a.key - b.key); // return sorted array according to key
    } else {
        return arr;
    }
}

const handleGenerateData = () => {
    DomElements.generateDataBtn.addEventListener('click', async function () {
        let n = getValue(DomElements.elementsNumber),
            min = getValue(DomElements.minKey),
            max = getValue(DomElements.maxKey);

        let dataIsValid = (n <= max - min + 1) && n <= newFile.maxNbBlocks * newFile.maxNbEnregs;

        if (dataIsValid && elementsNumberValid && minKeyValid && maxKeyValid) {
            changeButtonsState(true);

            // remove all previous data from the file
            newFile.reset();

            let data = generateData(n, min, max);

            console.log(data)

            for (const enreg of data) {
                await newFile.insert(
                    enreg.key,
                    enreg.field1,
                    enreg.field2,
                    false,
                    false
                );
            }

            newFile.createBoardsDOM();
            if (FILE_ACCESS === 'indexed') newFile.createIndexTableDOM();

            changeButtonsState(false);
        }
    });
}

handleGenerateData();


if (FILE_TYPE === 'not_clustered') {// FOR TESTING NOT CLUSTERED INDEX TYPES OF FILES
    // let data = generateData(8, 0, 11);
    //
    // newFile.blocks.push(new Block([], 8));
    // let j = 0;
    // for (const enreg of data) {
    //     // await newFile.insert(
    //     //     enreg.key,
    //     //     enreg.field1,
    //     //     enreg.field2,
    //     //     false,
    //     //     false
    //     // )
    //     // console.log(enreg)
    //     console.log(newFile)
    //     newFile.indexTable.push(new IndexCouple(enreg.key, 0, j));
    //     j++;
    //     newFile.blocks[0].enregs.push(new Enreg(enreg.key, enreg.field1, enreg.field2, false))
    // }

    // newFile.indexTable = newFile.indexTable.sort((a, b) => a.key - b.key);
    // console.table(newFile.indexTable);
    // console.table(newFile.blocks[0].enregs)
    // newFile.createBoardsDOM();
    // console.log(newFile.search(9));
    // END - Fill with dummy data
}


// START - Search for element
const handleSearch = () => {
    DomElements.searchBtn.addEventListener("click", async function () {
        if (keyToSearchValid) {
            changeButtonsState(true);

            let key = parseInt(DomElements.keyToSearch.value);

            let {
                found: found,
                pos: pos,
                readTimes: readTimes
            } = await newFile.search(key, animate);
            console.log(found, pos)
            changeButtonsState(false)
        }
    });
}

handleSearch();
// END - Search for element


// START - Remove element
const handleRemove = () => {
    DomElements.removeBtn.addEventListener("click", async function () {
        if (keyToRemoveValid) {
            changeButtonsState(true);

            let key = parseInt(DomElements.keyToRemove.value);
            console.log(key)

            let removeSuccess = await newFile.removeLogically(key, animate);

            console.log(removeSuccess)

            changeButtonsState(false);
        }
    });
}

handleRemove()
// END - Remove element


// START - Remove element physically
const handleRemovePhysically = () => {
    DomElements.removePhysicallyBtn.addEventListener("click", async function () {
        if (keyToRemovePhysicallyValid) {
            changeButtonsState(true);

            let key = parseInt(DomElements.keyToRemovePhysically.value);

            let removeSuccess = await newFile.removePhysically(key, animate);

            newFile.createBoardsDOM();
            if (FILE_ACCESS === 'indexed') newFile.createIndexTableDOM();

            console.log(removeSuccess);

            changeButtonsState(false);
        }
    });
}

if (FILE_TYPE !== 'LOF' && FILE_TYPE !== 'LnOF') {
    handleRemovePhysically();
}
// END - Remove element physically


// START - Inert Enreg.
const handleInsert = () => {
    DomElements.insertBtn.addEventListener("click", async function () {
        if (keyToInsertValid && field1ToInsertValid && field2ToInsertValid) {
            changeButtonsState(true);

            let key = parseInt(DomElements.keyToInsert.value);
            let field1 = DomElements.field1ToInsert.value;
            let field2 = DomElements.field2ToInsert.value;

            let insertingResult = await newFile.insert(key, field1, field2, false, animate);

            console.log(insertingResult)

            changeButtonsState(false);

            newFile.createBoardsDOM();
            if (FILE_ACCESS === 'indexed') newFile.createIndexTableDOM();
        }
    });
}

handleInsert()
// END - Inert Enreg.


// START - Edit Enreg.
const handleEdit = () => {
    DomElements.editBtn.addEventListener("click", async function () {
        if (keyToEditValid && field1ToEditValid && field2ToEditValid) {
            changeButtonsState(true);

            let key = parseInt(DomElements.keyToEdit.value);
            let field1 = DomElements.field1ToEdit.value;
            let field2 = DomElements.field2ToEdit.value;

            let editingResults = await newFile.editEnreg(key, field1, field2, false, animate);

            console.log(editingResults);

            changeButtonsState(false);

            newFile.createBoardsDOM();
            if (FILE_ACCESS === 'indexed') newFile.createIndexTableDOM();
        }
    });
}

handleEdit();
// END - Edit Enreg.


// START - Scroll buttons
const handleScrollButtons = () => {
    DomElements.scrollLeftBtn.addEventListener('click', function () {
        MSBoard.node().scrollLeft -= 224
    });

    DomElements.scrollRightBtn.addEventListener('click', function () {
        MSBoard.node().scrollLeft += 224
    });
}

handleScrollButtons();
// END - Scroll buttons


export {newFile};
