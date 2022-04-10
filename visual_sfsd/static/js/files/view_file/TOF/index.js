import TOF from "../../SFSD/types/simple/TOF.js";


// START - Create file
const buff = d3.select(".buf");
const buff2 = d3.select(".buf2");
const MSBoard = d3.select(".ms-container");
let toolTipIsVisible = false;
let ToolTipToHide;

let newFile = new TOF(
    'file.txt',
    buff,
    buff2,
    MSBoard,
);

// END - Create file


// START - Handle toolbar
const toolbarIcons = document.querySelectorAll(".toolbar-icon");
const toolbarTips = document.querySelectorAll(".toolbar-tooltip");
const toolBarOptions = document.querySelector('.toolbar-options');
console.log(toolbarIcons);

Array.from(toolbarIcons).forEach(option => {
    option.addEventListener('click', (e) => {
        let tooltip = option.parentNode.children[1];

        if (toolTipIsVisible) {
                console.log("test3")
                document.querySelectorAll('.tooltip-visible').forEach(tooltip => {
                    tooltip.classList.remove('tooltip-visible');
                    toolTipIsVisible = false;
                    tooltip.classList.add('hidden');
                })
        }

        if (tooltip.classList.contains("hidden")) {
            console.log("test")
            tooltip.classList.remove(("hidden"));
            tooltip.classList.add("tooltip-visible");
            ToolTipToHide = tooltip;
            toolTipIsVisible = true;
        }
        else{
            tooltip.classList.add(("hidden"));
            console.log("test2")
            tooltip.classList.remove("tooltip-visible");
            toolTipIsVisible = false;
            ToolTipToHide = "";
        }
    })
})


document.addEventListener('click'  , (e) => {
    if (!e.target.classList.contains("toolbar-icon") && e.target.tagName !== 'INPUT' && toolTipIsVisible) {
        ToolTipToHide.classList.add("hidden");
        ToolTipToHide.classList.remove("tooltip-visible");
        toolTipIsVisible = false;
    }
})

//
//
// const hideAllToolbarTooltips = () => {
//     toolbarOptions.forEach((otherOption) => {
//         let tooltip = otherOption.querySelector(".toolbar-tooltip");
//         tooltip.classList.add("hidden");
//         tooltip.classList.remove("active-tooltip");
//     });
// }

//
// for (let i = 0; i < toolbarOptions.length; i++) {
//     let option = toolbarOptions[i];
//     let tooltip = option.querySelector(".toolbar-tooltip");
//     option.addEventListener('click', function () {
//         hideAllToolbarTooltips();
//         tooltip.classList.remove("hidden");
//         tooltip.classList.add("active-tooltip");
//     });
// }
//
// // hide all toolbar tooltips when user clicks outside
// document.addEventListener('click', function (e) {
//     // let activeTooltip = document.querySelector(".active-tooltip");
//     // if (activeTooltip) {
//     //     if (!e.target.classList.contains("toolbar-tool")) {
//     //         activeTooltip.classList.add("hidden");
//     //     }
//     // }
//
//     toolbarOptions.forEach((option) => {
//         if (!e.target.classList.contains("toolbar-tooltip") && !e.target.classList.contains("toolbar-icon")) {
//             hideAllToolbarTooltips();
//         }
//     });
// });

// const toolbarOptions = d3.selectAll(".toolbar-options .toolbar-tool");
//
// toolbarOptions.on("click", function () {
//     // hide other tooltips
//     d3.selectAll(".toolbar-options .toolbar-tool .toolbar-tooltip")
//         .classed("hidden", true);
//
//     // show clicked tooltip
//     d3.select(this).select(".toolbar-tooltip")
//         .classed("hidden", false);
// })

// END - Handle toolbar


// START - DOM Elements
const generateDataBtn = document.querySelector('#generate-data-btn');

const keyToSearch = document.querySelector("#key-to-search");
const searchBtn = document.querySelector("#search-btn");

const keyToRemove = document.querySelector("#key-to-remove");
const removeBtn = document.querySelector("#remove-btn");

const keyToRemovePhysically = document.querySelector("#key-to-remove-physically");
const removePhysicallyBtn = document.querySelector("#remove-physically-btn");

const keyToInsert = document.querySelector("#key-to-insert");
const field1ToInsert = document.querySelector("#field1-to-insert");
const field2ToInsert = document.querySelector("#field2-to-insert");
const insertBtn = document.querySelector("#insert-btn");


const keyToEdit = document.querySelector("#key-to-edit");
const field1ToEdit = document.querySelector("#field1-to-edit");
const field2ToEdit = document.querySelector("#field2-to-edit");
const editBtn = document.querySelector("#edit-btn");


const changeButtonsState = (state) => {
    generateDataBtn.disabled = state
    searchBtn.disabled = state
    removeBtn.disabled = state
    insertBtn.disabled = state
    editBtn.disabled = state
    removePhysicallyBtn.disabled = state
}

// END - DOM Elements


// START - Fill with dummy data
const n = 16;
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


// START - Remove element physically
function handleRemovePhysically() {
    removePhysicallyBtn.addEventListener("click", async function () {
        changeButtonsState(true)

        let key = parseInt(keyToRemovePhysically.value);

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


// START - Inert Enreg.
function handleEdit() {
    editBtn.addEventListener("click", async function () {
        changeButtonsState(true)

        let key = parseInt(keyToEdit.value);
        let field1 = field1ToEdit.value;
        let field2 = field2ToEdit.value;

        let editingResults = await newFile.editEnreg(key, field1, field2, false, true);

        console.log(editingResults)

        changeButtonsState(false)

        newFile.createBoardsDOM()
    });
}

handleEdit()

// END - Inert Enreg.


// START - Scroll buttons
const scrollLeftBtn = document.querySelector("#scroll-left-btn");
const scrollRightBtn = document.querySelector("#scroll-right-btn");

function handleScrollButtons() {
    scrollLeftBtn.addEventListener('click', function () {
        MSBoard.node().scrollLeft -= 224
    });

    scrollRightBtn.addEventListener('click', function () {
        MSBoard.node().scrollLeft += 224
    });
}

handleScrollButtons();
// END - Scroll buttons
