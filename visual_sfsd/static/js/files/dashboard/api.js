export const deleteFile = (pk) => {
    $.ajax({
        type: 'POST',
        url: DELETE_FILE_DASHBOARD_URL,
        data: {
            pk: pk
        },
        datatype: 'json',
        success: function (response) {
            console.log(response["status"]);
        },
        error: function (response) {
            console.log("Something went wrong");
        }
    });
}