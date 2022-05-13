import {addToast} from "../../toasts.js";


export const editFileName = (name) => {
    $.ajax({
        type: 'POST',
        url: EDIT_FILE_NAME_URL,
        data: {
            name: name
        },
        dataType: 'json',
        success: function (response) {
            addToast("File name has been changed", "success");
        },
        error: function (response) {
            addToast("Couldn't change file name", "danger");
        }
    });
}

export const saveFileData = (fileData) => {
    $.ajax({
        type: 'POST',
        url: SAVE_FILE_URL,
        data: {
            fileData: fileData
        },
        datatype: 'json',
        success: function (response) {
            addToast("Changes have been saved", "success");
        },
        error: function (response) {
            addToast("Couldn't save changes", "danger");
        }
    });
}


export const toggleFileVisibility = () => {
    const toggleFileVisibilityBtn = document.querySelector("#toggle-file-visibility-btn");

    $.ajax({
        type: 'POST',
        url: TOGGLE_FILE_VISIBILITY_URL,
        data: {},
        datatype: 'json',
        success: function (response) {
            const msg = toggleFileVisibilityBtn.checked ? 'File is now public' : 'File is now private';
            addToast(msg, "success");
        },
        error: function (response) {
            toggleFileVisibilityBtn.checked = !toggleFileVisibilityBtn.checked;
            addToast("Something went wrong", "danger");
        }
    });
}