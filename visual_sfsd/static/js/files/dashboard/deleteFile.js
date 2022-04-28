import * as API from "./api.js";


const files = document.querySelectorAll('.file-info');
const deleteFileArea = document.getElementById('delete-file-section');
let dragged;

function dragStart(e) {
    dragged = e.target;
    setTimeout(() => {
        deleteFileArea.classList.remove('hidden');
    }, 0);
}

function dragEnd(e) {
    deleteFileArea.classList.add('hidden');
}

function dragOver(e) {
    e.preventDefault();
}

function deleteTheFile(e) {
    e.preventDefault();
    API.deleteFile(dragged.dataset.id);
    dragged.parentNode.remove();
    dragged.remove();
}

files.forEach((file) => {
    file.addEventListener('dragstart', dragStart);
    deleteFileArea.addEventListener('dragover', dragOver);
    deleteFileArea.addEventListener('drop', deleteTheFile);
    file.addEventListener('dragend', dragEnd);
});
