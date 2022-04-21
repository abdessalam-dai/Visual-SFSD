// handling the function to change the file name
import * as DomElements from "../DomElements.js";
import * as API from "../api.js";

let formIsHidden = true;
const fileNameAndFileTypeSpan = document.querySelector('.file-name-all');
const formForFileName = document.querySelector(".form-for-file-name");
const editFileNameInput = document.querySelector(".edit-file-name-input");
let currentFileName = DomElements.fileNameSpan.textContent;

fileNameAndFileTypeSpan.addEventListener('dblclick', (e) => {
    DomElements.entete.classList.add("hidden");
    DomElements.fileNameSpan.classList.add("hidden");
    DomElements.fileTypeSpan.classList.add("hidden");
    DomElements.formForFileName.classList.remove("hidden");
    editFileNameInput.value = currentFileName;
    editFileNameInput.focus();
    editFileNameInput.select();
    formIsHidden = false;
});

formForFileName.addEventListener('submit', (e) => {
    e.preventDefault();
    DomElements.entete.classList.remove("hidden");
    console.log(editFileNameInput.value.length)
    if (editFileNameInput.value.length > 100 || editFileNameInput.value.length === 0) {
        editFileNameInput.value = "";
        editFileNameInput.focus();
        formIsHidden = false
    } else {
        DomElements.fileNameSpan.classList.remove("hidden");
        DomElements.fileTypeSpan.classList.remove("hidden");
        let fileNameStr = Array.from(editFileNameInput.value.trim()).map((char) => char === " " ? "_" : char).join("")
        DomElements.fileNameSpan.textContent = fileNameStr;
        currentFileName = fileNameStr;

        formForFileName.classList.add("hidden");
        formIsHidden = true;

        // edit the file name
        API.editFileName(fileNameStr);
        // change window title
        document.title = `${fileNameStr} - VisualSFSD`;
    }
});


// handle the case if the user wants to undo rename file

const hideFileNameForm = () => {
    DomElements.formForFileName.classList.add("hidden");
    DomElements.entete.classList.remove("hidden");
    DomElements.fileNameSpan.classList.remove("hidden");
    DomElements.fileTypeSpan.classList.remove("hidden");
    formIsHidden = true;
}
// handle clicking outside the form
document.addEventListener('click', function (e) {
    if (!formIsHidden && e.target.tagName !== "BUTTON" && e.target.tagName !== "INPUT") {
        hideFileNameForm();
    }
});

// handle pressing Escape button
document.addEventListener('keyup', function (e) {
    if (e.key === "Escape") {
        hideFileNameForm();
    }
});