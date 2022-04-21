export const openDeleteFileModal = document.querySelector("#open-delete-file-modal");
export const deleteFileModalOverlay = document.querySelector("#delete-file-modal-overlay");
export const deleteFileModal = document.querySelector("#delete-file-modal");
export const cancelDeleteFile = document.querySelector("#cancel-delete-file");

const closeModal = () => {
    deleteFileModalOverlay.classList.add('hidden');
    deleteFileModal.classList.add('hidden');
}

const openOverlayAndModal = () => {
    deleteFileModalOverlay.classList.remove('hidden');
    deleteFileModal.classList.remove('hidden');
}

// delete the file with shortcut Ctrl + d
document.addEventListener('keydown', e => {
    if (e.key.toLowerCase() === 'd' && e.ctrlKey) {
        e.preventDefault();
        openOverlayAndModal();
    }
});

// handle click on the delete file button
openDeleteFileModal.addEventListener('click', function (e) {
    openOverlayAndModal();
});

// handle click on the overlay (to close the modal)
deleteFileModalOverlay.addEventListener('click', function (e) {
    closeModal();
});

// handle click on cancel delete file
cancelDeleteFile.addEventListener('click', function (e) {
    closeModal();
});