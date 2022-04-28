const openChangePasswordModal = document.querySelector("#open-change-password-modal");
const changePasswordModalOverlay = document.querySelector("#change-password-modal-overlay");
const changePasswordModal = document.querySelector("#change-password-modal");

const closeModal = () => {
    changePasswordModalOverlay.classList.add('hidden');
    changePasswordModal.classList.add('hidden');
}

const openOverlayAndModal = () => {
    changePasswordModalOverlay.classList.remove('hidden');
    changePasswordModal.classList.remove('hidden');
}

// handle click on the change password button
openChangePasswordModal.addEventListener('click', function (e) {
    openOverlayAndModal();
});

// handle click on the overlay (to close the modal)
changePasswordModalOverlay.addEventListener('click', function (e) {
    closeModal();
});
