import TOF from "../SFSD/types/simple/TOF.js";
import TnOF from "../SFSD/types/simple/TnOF.js";
import LOF from "../SFSD/types/simple/LOF.js";
import LnOF from "../SFSD/types/simple/LnOF.js";
import * as DomElements from "./DomElements.js";
import {MAX_NB_BLOCKS, MAX_NB_ENREGS_DEFAULT} from "../constants.js";
import {fileHeadDropDown, fileNameSpan} from "./DomElements.js";
import {Block, Enreg} from "../SFSD/SFSD.js";


// handling the function to change the file name
let formIsHidden = true;
const logoInfoFileName = document.querySelector(".logo-info");
const changeFileNameSection = document.querySelector(".change-file-name-section");
const EditFileNameBtn = document.querySelector(".edit-file-name-button");
const formForFileName = document.querySelector(".from-for-file-name");
const editFileNameInput = document.querySelector(".edit-file-name-input");
const editFileNameSubmitBtn = document.querySelector(".submit-file-name-input");
const spanValidation = document.querySelector(".error-validation");

console.log(logoInfoFileName);

logoInfoFileName.addEventListener('mouseover', (e) => {
    e.preventDefault();
    changeFileNameSection.classList.remove('hidden');
})

logoInfoFileName.addEventListener('mouseout', (e) => {
    e.preventDefault();
    if (formIsHidden) {
        changeFileNameSection.classList.add('hidden');
        formForFileName.classList.add("hidden")
    }

})

EditFileNameBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (formIsHidden) {
        formForFileName.classList.remove("hidden")
        editFileNameInput.value = DomElements.fileNameSpan.textContent;
        formIsHidden = false;
    } else {
        formForFileName.classList.add("hidden")
        spanValidation.textContent = "";
        formIsHidden = true;
    }
    editFileNameInput.focus()
})

editFileNameSubmitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (editFileNameInput.value.length > 100) {
        spanValidation.textContent = "NO more than 100 char";
        editFileNameInput.value = "";
        editFileNameInput.focus();
    } else {
        DomElements.fileNameSpan.textContent = editFileNameInput.value;
        formForFileName.classList.add("hidden");
        formIsHidden = true;
    }
})


// START - useful functions
function isNumeric(value) {
    return /^-?\d+$/.test(value);
}


const getValue = (element) => {
    return parseInt(element.value);
}

// END - useful functions


// START - Create file
const buff = d3.select(".buf");
const buff2 = d3.select(".buf2");
const MSBoard = d3.select(".ms-container");
let toolTipIsVisible = false;
let ToolTipToHide;
let goDown = false;


let newFile;

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
    blocks.push(b)
}

console.log(blocks)

if (FILE_TYPE === "TOF") {
    newFile = new TOF(
        fileData["name"],
        buff,
        buff2,
        MSBoard,
        fileData["characteristics"]["maxNbEnregs"],
        fileData["characteristics"]["maxNbBlocks"],
        fileData["characteristics"]["nbBlocks"],
        fileData["characteristics"]["nbInsertions"],
        blocks
    );
} else if (FILE_TYPE === "TnOF") {
    newFile = new TOF(
        fileData["name"],
        buff,
        buff2,
        MSBoard,
        fileData["characteristics"]["maxNbEnregs"],
        fileData["characteristics"]["maxNbBlocks"],
        fileData["characteristics"]["nbBlocks"],
        fileData["characteristics"]["nbInsertions"],
        blocks
    );
} else if (FILE_TYPE === "LOF") {
    newFile = new LOF(
        fileData["name"],
        buff,
        buff2,
        MSBoard,
        fileData["characteristics"]["maxNbEnregs"],
        fileData["characteristics"]["maxNbBlocks"],
        fileData["characteristics"]["nbBlocks"],
        fileData["characteristics"]["nbInsertions"],
        blocks,
        fileData["characteristics"]["headIndex"],
        fileData["characteristics"]["tailIndex"]
    );
} else {
    newFile = new LnOF(
        fileData["name"],
        buff,
        buff2,
        MSBoard,
        fileData["characteristics"]["maxNbEnregs"],
        fileData["characteristics"]["maxNbBlocks"],
        fileData["characteristics"]["nbBlocks"],
        fileData["characteristics"]["nbInsertions"],
        blocks,
        fileData["characteristics"]["headIndex"],
        fileData["characteristics"]["tailIndex"]
    );
}

console.log(newFile.getJsonFormat());
// newFile.createBoardsDOM();

// END - Create file


// START - Handle file head drop down
DomElements.fileName.addEventListener("click", function () {
    const fileHeadDropDown = DomElements.fileHeadDropDown;
    if (fileHeadDropDown.classList.contains("hidden")) {
        fileHeadDropDown.classList.remove("hidden");
    } else {
        fileHeadDropDown.classList.add("hidden");
    }
});

document.addEventListener('click', (e) => {
    if (!e.target.classList.contains("file-head-dropdown") && !e.target.classList.contains("file-name-all") && !e.target.classList.contains("file-name")) {
        DomElements.fileHeadDropDown.classList.add("hidden");
    }
})
// END - Handle file head drop down


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


// handle buffer
const upImage = document.querySelector(".mc-footer img");
const mcFooter = document.querySelector(".mc-footer");
const mcSection = document.querySelector(".mc");
const mcDescription = document.querySelector(".mc-description")
const complexitySection = document.querySelector(".complexity-section");
const buffers = document.querySelector(".buffers");
console.log(mcFooter.offsetHeight);

upImage.addEventListener('click', (e) => {
    if (!goDown) {
        complexitySection.style.visibility = 'hidden';
        mcDescription.style.visibility = 'hidden';
        buffers.style.visibility = 'hidden';
        mcSection.style.backgroundColor = 'white';
        mcFooter.style.backgroundColor = '#9EACF3'
        upImage.style.transform = 'rotate(0deg)'
        goDown = true;
    } else {
        mcSection.style.backgroundColor = '#9EACF3';
        complexitySection.style.visibility = 'initial'
        mcDescription.style.visibility = 'initial'
        buffers.style.visibility = 'initial'
        upImage.style.transform = 'rotate(-180deg)'
        goDown = false;
    }
});


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

// for (let i = 0; i < toolbarOptions.length; i++) {
//     let option = toolbarOptions[i];
//     let tooltip = option.querySelector(".toolbar-tooltip");
//     option.querySelector(".toolbar-icon").addEventListener('click', function () {
//         hideAllToolbarTooltips();
//         tooltip.classList.remove("hidden");
//     });
// }
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
const n = 6;
const min = 0;
const max = 100;

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

        let dataIsValid = (n <= max - min + 1) && n <= MAX_NB_BLOCKS * MAX_NB_ENREGS_DEFAULT;

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

            changeButtonsState(false);
        }
    });
}

handleGenerateData();


// let data = generateData(n, min, max);
//
// for (const enreg of data) {
//     await newFile.insert(
//         enreg.key,
//         enreg.field1,
//         enreg.field2,
//         false,
//         false
//     )
// }
//
// newFile.createBoardsDOM();
// END - Fill with dummy data


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
            } = await newFile.search(key, true);
            console.log(found, pos, readTimes)
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

            let removeSuccess = await newFile.removeLogically(key, true);

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

            let removeSuccess = await newFile.removePhysically(key, true);

            newFile.createBoardsDOM();

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

            let insertingResult = await newFile.insert(key, field1, field2, false, true);

            console.log(insertingResult)

            changeButtonsState(false);

            newFile.createBoardsDOM();
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

            let editingResults = await newFile.editEnreg(key, field1, field2, false, true);

            console.log(editingResults);

            changeButtonsState(false);

            newFile.createBoardsDOM();
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


// START - Handle file saving
const saveFileBtn = $("#save-file-btn");

saveFileBtn.click(function (e) {
    e.preventDefault();

    let newFileData = newFile.getJsonFormat();

    $.ajax({
        type: 'POST',
        url: SAVE_FILE_URL,
        data: {
            fileData: JSON.stringify(newFileData)
        },
        datatype: 'json',
        success: function (response) {
            console.log("OK !!");
        },
        error: function (response) {
            console.log("Error");
        }
    })
});
// END - Handle file saving
