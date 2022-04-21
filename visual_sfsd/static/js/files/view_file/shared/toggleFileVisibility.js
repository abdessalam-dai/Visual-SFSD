import * as API from "../api.js";

const toggleFileVisibilityBtn = document.querySelector("#toggle-file-visibility-btn");

toggleFileVisibilityBtn.addEventListener('click', function() {
    API.toggleFileVisibility();
})