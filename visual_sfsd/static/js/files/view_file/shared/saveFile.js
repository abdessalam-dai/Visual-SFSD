import * as API from "../api.js";
import {newFile} from "../index.js";

const saveFileBtn = $("#save-file-btn");

const saveFile = () => {
    let newFileData = newFile.getJsonFormat()
    API.saveFileData(JSON.stringify(newFileData));
}

saveFileBtn.click(function (e) {
    e.preventDefault();
    saveFile();
});

// add the shortcut to allow the user to save the file with Ctrl + s
document.addEventListener('keydown', e => {
    if (e.key.toLowerCase() === 's' && e.ctrlKey) {
        e.preventDefault();
        saveFile();
    }
})
// END - Handle file saving