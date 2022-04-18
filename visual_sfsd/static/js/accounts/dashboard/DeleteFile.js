const files = document.querySelectorAll('.file-info');
const deleteFile = document.getElementById('delete-file-section');
let dragged;
console.log(deleteFile)
let index = 0;
function dragStart(e) {
    dragged = e.target;
    setTimeout(() => {
        deleteFile.classList.remove('invisible');
    }, 0 )
}

function dragEnd(e) {
    deleteFile.classList.add('invisible')

}

function dragOver(e) {
    e.preventDefault();
}

function deleteTheFile(e) {
    e.preventDefault()
    dragged.parentNode.remove()
    dragged.remove();
}

files.forEach((file)  => {
    file.addEventListener('dragstart' , dragStart);
    deleteFile.addEventListener('dragover' , dragOver)
    deleteFile.addEventListener('drop' , deleteTheFile)
    file.addEventListener('dragend' , dragEnd);
})