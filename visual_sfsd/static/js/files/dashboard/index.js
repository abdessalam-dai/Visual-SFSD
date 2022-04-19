import * as DE from "./DomElements.js";
import {dummyDataForm, fillWithDummyData} from "./DomElements.js";


// form state
let fName = "";
let fAccess = "";
let fType = "";


const resetForm = () => {
    // reset state to default values
    DE.fName.value = "";
    DE.fAccess.value = "sequential";
    DE.fType.value = "TOF";
    DE.maxNbEnregs.value = 8;
    DE.maxNbBlocks.value = 50;

    // change the visibility of the steps
    DE.step1.classList.remove('hidden');
    DE.step2.classList.add('hidden');
    DE.step3Sequential.classList.add('hidden');
    DE.step3Indexed.classList.add('hidden');
    DE.step3Hashing.classList.add('hidden');
    DE.step4Sequential.classList.add('hidden');
    // hide overlay
    DE.createFileModalOverlay.classList.add("hidden");
    DE.createFileModal.classList.add('hidden');
    DE.fName.value = "";
    DE.fName.blur();
}

// create a new file with shortcut Ctrl + n
const handleOverlayAndFileModal = () => {
    DE.createFileModalOverlay.classList.remove('hidden');
    DE.createFileModal.classList.remove('hidden');
    DE.fName.focus();
}

document.addEventListener('keydown', e => {
    if (e.key.toLowerCase() === 'o' && e.ctrlKey) {
        e.preventDefault();
        handleOverlayAndFileModal();
    }
});

// handle click on the create file button
DE.createFileBtn.addEventListener('click', function (e) {
    handleOverlayAndFileModal();
});


// handle click on the overlay (to close the modal)
DE.createFileModalOverlay.addEventListener('click', function (e) {
    resetForm();
});

// handle pressing Escape button to close the modal
document.addEventListener('keyup', function (e) {
    if (e.key === "Escape") {
        resetForm();
    }
})

// handle submitting the file name
const handleFileNameSubmit = () => {
    let name = DE.fName.value.trim();

    if (name.length > 100 || name.length === 0) { // make sure the length doesn't exceed 100, and has at least 1
        DE.fName.value = "";
        DE.fName.focus();
    } else {
        DE.step1.classList.add('hidden');
        DE.step2.classList.remove('hidden');
    }
}

// handle submitting file name
DE.submitFileNameBtn.addEventListener('click', function (e) {
    handleFileNameSubmit();
});
DE.fName.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault(); // prevent submitting the form
        handleFileNameSubmit();
    }
});

// handle choosing file access
Array.from(DE.fileAccessBtns).forEach((fileAccessBtn) => {
    fileAccessBtn.addEventListener('click', function (e) {
        let access = this.dataset.access;
        switch (access) {
            case "sequential":
                DE.fAccess.value = "sequential";
                DE.step2.classList.add('hidden');
                DE.step3Sequential.classList.remove('hidden');
                break;
            case "indexed":
                DE.fAccess.value = "indexed";
                DE.step2.classList.add('hidden');
                DE.step3Indexed.classList.remove('hidden');
                break;
            case "hashing":
                DE.fAccess.value = "hashing";
                DE.step2.classList.add('hidden');
                DE.step3Hashing.classList.remove('hidden');
                break;
            default:
                DE.fAccess.value = "sequential";
                DE.step2.classList.remove('hidden');
        }
    });
});

// handle choosing file type
Array.from(DE.fileTypeBtns).forEach((fileTypeBtn) => {
    fileTypeBtn.addEventListener('click', function (e) {
        let type_ = this.dataset.type;
        switch (type_) {
            case "TOF":
            case "TnOF":
            case "LOF":
            case "LnOF":
                DE.fType.value = type_;
                DE.step3Sequential.classList.add('hidden');
                DE.step4Sequential.classList.remove('hidden');
                break;
            default:
                DE.fType.value = "TOF";
        }

        handleStep4();
    });
});


// handle maxNbBlocks and maxNbEnregs
const handleStep4 = () => {
    let maxNbBlocks = parseInt(DE.maxNbBlocks.value.trim());
    let maxNbEnregs = parseInt(DE.maxNbEnregs.value.trim());
    DE.submitCreateFile.disabled = isNaN(maxNbBlocks) || maxNbBlocks < 5 || maxNbBlocks > 100
        || isNaN(maxNbEnregs) || maxNbEnregs < 4 || maxNbEnregs > 8;
}
DE.maxNbBlocks.addEventListener('keyup', function () {
    handleStep4();
});

DE.maxNbEnregs.addEventListener('keyup', function () {
    handleStep4();
})

// handle file configuration
// // handle clicking fill with dummy data
// DE.fillWithDummyData.addEventListener('change', function () {
//     if (this.checked) {
//         DE.dummyDataForm.classList.remove('hidden');
//     } else {
//         DE.dummyDataForm.classList.add('hidden');
//     }
// });
//

