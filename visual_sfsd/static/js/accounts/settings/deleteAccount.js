export const openDeleteAccountModal = document.querySelector("#open-delete-account-modal");
export const deleteAccountModalOverlay = document.querySelector("#delete-account-modal-overlay");
export const deleteAccountModal = document.querySelector("#delete-account-modal");
export const cancelDeleteAccount = document.querySelector("#cancel-delete-account");

const closeModal = () => {
    deleteAccountModalOverlay.classList.add('hidden');
    deleteAccountModal.classList.add('hidden');
}

const openOverlayAndModal = () => {
    deleteAccountModalOverlay.classList.remove('hidden');
    deleteAccountModal.classList.remove('hidden');
}

// handle click on the delete file button
openDeleteAccountModal.addEventListener('click', function (e) {
    openOverlayAndModal();
});

// handle click on the overlay (to close the modal)
deleteAccountModalOverlay.addEventListener('click', function (e) {
    closeModal();
});

// handle click on cancel delete file
cancelDeleteAccount.addEventListener('click', function (e) {
    closeModal();
});