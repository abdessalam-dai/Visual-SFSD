import {addToast} from "../../toasts.js";


export const deleteFile = (pk) => {
    $.ajax({
        type: 'POST',
        url: DELETE_FILE_DASHBOARD_URL,
        data: {
            pk: pk
        },
        datatype: 'json',
        success: function (response) {
            // console.log(response["status"]);
            addToast("File has been deleted", "success");
        },
        error: function (response) {
            addToast("Couldn't delete file", "danger");
        }
    });
}
