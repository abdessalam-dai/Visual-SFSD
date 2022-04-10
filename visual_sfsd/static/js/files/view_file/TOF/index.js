import TOF from "../../SFSD/types/simple/TOF.js";
import * as DomElements  from "./../DomElements.js"


// START - useful functions
function isNumeric(value) {
    return /^-?\d+$/.test(value);
}

// END - useful functions


// START - Create file
const buff = d3.select(".buf");
const buff2 = d3.select(".buf2");
const MSBoard = d3.select(".ms-container");

let newFile = new TOF(
    'file.txt',
    buff,
    buff2,
    MSBoard,
);

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
// make sure that the z-index for toolbar tooltips is higher
document.querySelectorAll(".toolbar-tooltip").forEach((tooltip) => {
    tooltip.style.zIndex = "101";
});

const hideAllToolbarTooltips = () => {
    toolbarOptions.forEach((option) => {
        let tooltip = option.querySelector(".toolbar-tooltip");
        tooltip.classList.add("hidden");
    });
}

for (let i = 0; i < toolbarOptions.length; i++) {
    let option = toolbarOptions[i];
    let tooltip = option.querySelector(".toolbar-tooltip");
    option.querySelector(".toolbar-icon").addEventListener('click', function () {
        hideAllToolbarTooltips();
        tooltip.classList.remove("hidden");
    });
}
// END - Handle toolbar


// START - Fill with dummy data
const n = 46;
const min = 0;
const max = 100;

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

    return arr.sort((a, b) => a.key - b.key); // return sorted array according to key
}

function handleGenerateData() {
    DomElements.generateDataBtn.addEventListener('click', () => {
        changeButtonsState(true);

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


let data = generateData(n, min, max);

for (const enreg of data) {
    await newFile.insert(
        enreg.key,
        enreg.field1,
        enreg.field2,
        false,
        false
    )
}

newFile.createBoardsDOM();

// END - Fill with dummy data


// START - Search for element

// handle key validity
keyToSearch.addEventListener("keyup", function () {
    let key = keyToSearch.value.trim();
    searchBtn.disabled = !isNumeric(key);
});


function handleSearch() {
    DomElements.searchBtn.addEventListener("click", async function () {
        changeButtonsState(true);

        let key = parseInt(DomElements.keyToSearch.value);

        let {
            found: found,
            pos: pos,
            readTimes: readTimes
        } = await newFile.search(key, true);
        console.log(found, pos, readTimes)
        changeButtonsState(false)
    });
}

handleSearch()
// END - Search for element


// START - Remove element
function handleRemove() {
    DomElements.removeBtn.addEventListener("click", async function () {
        changeButtonsState(true)

        let key = parseInt(DomElements.keyToRemove.value);

        let removeSuccess = await newFile.removeLogically(key, true);

        console.log(removeSuccess)

        changeButtonsState(false)
    });
}

handleRemove()

// END - Remove element


// START - Remove element physically
function handleRemovePhysically() {
    DomElements.removePhysicallyBtn.addEventListener("click", async function () {
        changeButtonsState(true)

        let key = parseInt(DomElements.keyToRemovePhysically.value);

        let removeSuccess = await newFile.removePhysically(key, true);

        newFile.createBoardsDOM()

        console.log(removeSuccess)

        changeButtonsState(false)
    });
}

handleRemovePhysically()

// END - Remove element physically


// START - Inert Enreg.
function handleInsert() {
    DomElements.insertBtn.addEventListener("click", async function () {
        changeButtonsState(true)

        let key = parseInt(DomElements.keyToInsert.value);
        let field1 = DomElements.field1ToInsert.value;
        let field2 = DomElements.field2ToInsert.value;

        let insertingResult = await newFile.insert(key, field1, field2, false, true);

        console.log(insertingResult)

        changeButtonsState(false)

        newFile.createBoardsDOM()
    });
}

handleInsert()

// END - Inert Enreg.


// START - Inert Enreg.
function handleEdit() {
    DomElements.editBtn.addEventListener("click", async function () {
        changeButtonsState(true)

        let key = parseInt(DomElements.keyToEdit.value);
        let field1 = DomElements.field1ToEdit.value;
        let field2 = DomElements.field2ToEdit.value;

        let editingResults = await newFile.editEnreg(key, field1, field2, false, true);

        console.log(editingResults)

        changeButtonsState(false)

        newFile.createBoardsDOM()
    });
}

handleEdit()

// END - Inert Enreg.


// START - Scroll buttons


function handleScrollButtons() {
    DomElements.scrollLeftBtn.addEventListener('click', function () {
        MSBoard.node().DomElements.scrollLeft -= 224
    });

    DomElements.scrollRightBtn.addEventListener('click', function () {
        MSBoard.node().DomElements.scrollLeft += 224
    });
}

handleScrollButtons();
// END - Scroll buttons
