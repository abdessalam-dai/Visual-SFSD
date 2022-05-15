const guideModalOverlay = document.querySelector("#guide-modal-overlay");
const guideModal = document.querySelector("#guide-modal");
const closeGuideBtn = document.querySelector("#close-guide-btn");
const step = document.querySelector("#step");
const nextBtn = document.querySelector("#next-btn");
const prevBtn = document.querySelector("#prev-btn");


// components to highlight
// step 1
const viewFileNavbar = document.querySelector("#view-file-navbar");
// step 2
const toolbar = document.querySelector("#toolbar");
// step 3
const ms = document.querySelector("#ms");
// step 4
const mc = document.querySelector("#mc");
const mcBody = document.querySelector("#mc-body");
const mcFooter = document.querySelector("#mc-footer");
// step 5
const navbarFileName = document.querySelector("#navbar-file-name");
// step 6
const entete = document.querySelector("#entete");
const fileHeadDropdown = document.querySelector("#file-head-dropdown");
// step 7
const fileSettings = document.querySelector("#menu-btn");
const fileMenu = document.querySelector("#file-menu");
// step 8
const profileMenuBtn = document.querySelector("#profile-menu-btn");
const profileMenu = document.querySelector("#profile-menu");
// step 9
const generateDataArea = document.querySelector("#generate-data-area");
const generateDataForm = document.querySelector("#fill-with-dummy-data-form");
// step 10
const searchArea = document.querySelector("#search-area");
const searchForm = document.querySelector("#search-element-form");
// step 11
const removeLogicallyArea = document.querySelector("#remove-logically-area");
const removeLogicallyForm = document.querySelector("#remove-logically-form");
// step 12
const removePhysicallyArea = document.querySelector("#remove-physically-area");
const removePhysicallyForm = document.querySelector("#remove-physically-form");
// step 13
const addElementArea = document.querySelector("#add-element-area");
const addElementForm = document.querySelector("#add-element-form");
// step 14
const editElementArea = document.querySelector("#edit-element-area");
const editElementForm = document.querySelector("#edit-element-form");
// step 15
const mcComplexity = document.querySelector("#mc-complexity");
// step 16
const buffers = document.querySelector("#buffers");
// step 17
// const mcFooter = document.querySelector("#buffers");
// step 18
const saveFileBtn = document.querySelector("#save-file-btn");
const cloneFileBtn = document.querySelector("#clone-file-btn");
// step 19
const animationSpeed = document.querySelector("#animation-speed");

let steps = document.querySelectorAll('.step');
let activeStep = 0; // actually 1
let nbSteps = steps.length - 1;

let isGuideOpen = false;


const resetGuide = () => {
    isGuideOpen = false;
    Array.from(document.querySelectorAll('.bright')).forEach((el) => el.classList.remove('bright'));
    activeStep = 0;
    guideModalOverlay.classList.add('hidden');
    guideModal.classList.add('hidden');
    step.textContent = (activeStep + 1).toString();
}

const hideAllDropDowns = () => {
    guideModal.classList.remove("top-left");
    guideModal.classList.add("left-[50%]");

    animationSpeed.classList.add("translate-y-11");
    animationSpeed.classList.remove("translate-y-0");

    fileHeadDropdown.classList.add("hidden");
    entete.querySelector("span img").transform = 'rotate(-180deg)'
    generateDataForm.classList.add("hidden");
    searchForm.classList.add("hidden");
    removeLogicallyForm.classList.add("hidden");
    removePhysicallyForm.classList.add("hidden");
    addElementForm.classList.add("hidden");
    editElementForm.classList.add("hidden");
}

const highlightComponent = (index) => {
    Array.from(document.querySelectorAll('.bright')).forEach((el) => el.classList.remove('bright'));
    hideAllDropDowns();

    console.log(index)
    // global view
    if (index === 0) {
        viewFileNavbar.classList.add("bright");
    }

    if (index === 1) {
        toolbar.classList.add('bright');
    }

    if (index === 2) {
        guideModal.classList.remove("left-[50%]");
        guideModal.classList.add("top-left");
        ms.classList.add("bright");
    }

    if (index === 3) {
        // mc.classList.add("bright");
        mcBody.classList.add("bright");
        mcFooter.classList.add("bright");
    }

    // local view
    if (index === 4) {
        navbarFileName.classList.add("bright");
    }

    if (index === 5) {
        if (fileHeadDropdown.classList.contains("hidden")) {
            entete.querySelector("span img").click();
        }
        entete.classList.add("bright");
        fileHeadDropdown.classList.add("bright");
    }

    if (index === 6) {
        if (fileMenu.classList.contains("hidden")) {
            fileSettings.click();
        }
        fileSettings.classList.add("bright");
        fileMenu.classList.add("bright");
    }

    if (index === 7) {
        profileMenuBtn.classList.add("bright");

        if (profileMenu.classList.contains("hidden")) {
            profileMenuBtn.click();
        }
        profileMenuBtn.classList.add("bright");
        profileMenu.classList.add("bright");
    }

    if (index === 8) {
        if (generateDataForm.classList.contains("hidden")) {
            generateDataArea.querySelector("button").click();
        }
        generateDataArea.classList.add("bright");
        generateDataForm.classList.add("bright");
    }

    if (index === 9) {
        if (searchForm.classList.contains("hidden")) {
            searchArea.querySelector("button").click();
        }
        searchArea.classList.add("bright");
        searchForm.classList.add("bright");
    }

    if (index === 10) {
        if (removeLogicallyForm.classList.contains("hidden")) {
            removeLogicallyArea.querySelector("button").click();
        }
        removeLogicallyArea.classList.add("bright");
        removeLogicallyForm.classList.add("bright");
    }

    if (index === 11) {
        if (removePhysicallyForm.classList.contains("hidden")) {
            removePhysicallyArea.querySelector("button").click();
        }
        removePhysicallyArea.classList.add("bright");
        removePhysicallyForm.classList.add("bright");
    }

    if (index === 12) {
        if (addElementForm.classList.contains("hidden")) {
            addElementArea.querySelector("button").click();
        }
        addElementArea.classList.add("bright");
        addElementForm.classList.add("bright");
    }

    if (index === 13) {
        if (editElementForm.classList.contains("hidden")) {
            editElementArea.querySelector("button").click();
        }
        editElementArea.classList.add("bright");
        editElementForm.classList.add("bright");
    }

    if (index === 14) {
        mcComplexity.classList.add("bright");
    }

    if (index === 15) {
        buffers.classList.add("bright");
    }

    if (index === 16) {
        mcFooter.classList.add("bright");
    }

    if (index === 17) {
        if (saveFileBtn) {
            saveFileBtn.classList.add("bright");
        } else {
            cloneFileBtn.classList.add("bright");
        }
    }

    if (index === 18) {
        animationSpeed.classList.remove("translate-y-11");
        animationSpeed.classList.add("translate-y-0");
        animationSpeed.classList.add("bright");
    }
}

highlightComponent(activeStep)

// next button
function nextStep() {
    if (activeStep < nbSteps) {
        steps[activeStep].classList.add('hidden');
        activeStep++;
        steps[activeStep].classList.remove('hidden');
        highlightComponent(activeStep);
    }

    step.textContent = (activeStep + 1).toString();
}

nextBtn.addEventListener('click', function (e) {
    nextStep();
});

// previous button
function prevStep() {
    if (activeStep > 0) {
        steps[activeStep].classList.add('hidden');
        activeStep--;
        steps[activeStep].classList.remove('hidden');
        highlightComponent(activeStep);
    }

    step.textContent = (activeStep + 1).toString();
}

prevBtn.addEventListener('click', function (e) {
    prevStep();
});

// next / prev with arrow keys
document.addEventListener('keydown', function (e) {
    if (isGuideOpen) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            nextStep();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            prevStep();
        }
    }
});

const openOverlayAndGuideModal = () => {
    isGuideOpen = true;
    highlightComponent(activeStep);
    guideModalOverlay.classList.remove('hidden');
    guideModal.classList.remove('hidden');
}

// create a new file with shortcut Ctrl + y
document.addEventListener('keydown', e => {
    isGuideOpen = true;
    if (e.key.toLowerCase() === 'y' && e.ctrlKey) {
        e.preventDefault();
        openOverlayAndGuideModal();
    }
});

// close with button
closeGuideBtn.addEventListener('click', function (e) {
    resetGuide();
})

// this is to fix later
// handle click on the show guide button
// DE.createFileBtn.addEventListener('click', function (e) {
//     openOverlayAndGuideModal();
// });


// handle click on the overlay (to close the modal)
guideModalOverlay.addEventListener('click', function (e) {
    resetGuide();
});

// handle pressing Escape button to close the modal
document.addEventListener('keyup', function (e) {
    if (e.key === "Escape") {
        resetGuide();
    }
})