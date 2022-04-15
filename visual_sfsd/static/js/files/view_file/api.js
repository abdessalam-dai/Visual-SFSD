export const editFileName = (name) => {
    $.ajax({
        type: 'POST',
        url: EDIT_FILE_NAME_URL,
        data: {
            name: name
        },
        dataType: 'json',
        success: function (response) {
            console.log("File name changed");
        },
        error: function (response) {
            console.log("Unable to change file name");
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
            console.log(response["status"]);
        },
        error: function (response) {
            console.log("Something went wrong");
        }
    });
}