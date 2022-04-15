import * as DE from "./DomElements.js";
import {dummyDataForm, fillWithDummyData} from "./DomElements.js";


// form state
let fName = "";
let fAccess = "";
let fType = "";


const resetForm = () => {
    // reset state
    fName = "";
    fAccess = "";
    fType = "";

    // change the visibility of the steps
    DE.step1.classList.remove('hidden');
    DE.step2.classList.add('hidden');
    DE.step3Sequential.classList.add('hidden');
    DE.step3Indexed.classList.add('hidden');
    DE.step3Hashing.classList.add('hidden');
    // hide overlay
    DE.createFileModalOverlay.classList.add("hidden");
    DE.createFileModal.classList.add('hidden');
    DE.fileName.value = "";
    DE.fileName.blur();
}


// handle click on the create file button
DE.createFileBtn.addEventListener('click', function (e) {
    DE.createFileModalOverlay.classList.remove('hidden');
    DE.createFileModal.classList.remove('hidden');
    DE.fileName.focus();
});

// handle click on the overlay (to close the modal)
DE.createFileModalOverlay.addEventListener('click', function (e) {
    resetForm();
});

// handle submitting the file name
const handleFileNameSubmit = () => {
    fName = DE.fileName.value.trim();

    if (fName.length > 100 || fName.length === 0) { // make sure the length doesn't exceed 100, and has at least 1
        DE.fileName.value = "";
        DE.fileName.focus();
    } else {
        DE.step1.classList.add('hidden');
        DE.step2.classList.remove('hidden');
    }
}
DE.submitFileNameBtn.addEventListener('click', function (e) {
    handleFileNameSubmit();
});

DE.fileName.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        handleFileNameSubmit();
    }
});

// handle choosing file access
Array.from(DE.fileAccessBtns).forEach((fileAccessBtn) => {
    fileAccessBtn.addEventListener('click', function (e) {
        fAccess = this.dataset.access;
        switch (fAccess) {
            case "sequential":
                DE.step2.classList.add('hidden');
                DE.step3Sequential.classList.remove('hidden');
                break;
            case "indexed":
                DE.step2.classList.add('hidden');
                DE.step3Indexed.classList.remove('hidden');
                break;
            case "hashing":
                DE.step2.classList.add('hidden');
                DE.step3Hashing.classList.remove('hidden');
                break;
            default:
                DE.step2.classList.remove('hidden');
        }
    });
});

// handle choosing file type
Array.from(DE.fileTypeBtns).forEach((fileTypeBtn) => {
    fileTypeBtn.addEventListener('click', function (e) {
        fType = this.dataset.type;
        switch (fType) {
            case "TOF":
            case "TnOF":
            case "LOF":
            case "LnOF":
                DE.step3Sequential.classList.add('hidden');
                DE.step4Sequential.classList.remove('hidden');
                break;
            default:

        }
        console.log({fName, fAccess, fType});
    });
});



// handle file configuration
// handle clicking fill with dummy data
DE.fillWithDummyData.addEventListener('change', function () {
    if (this.checked) {
        DE.dummyDataForm.classList.remove('hidden');
    } else {
        DE.dummyDataForm.classList.add('hidden');
    }
});

