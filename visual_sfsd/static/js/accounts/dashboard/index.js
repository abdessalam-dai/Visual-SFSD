import * as DomElements from "./DomElements.js";

DomElements.createFileBtn.addEventListener('click', function (e) {
    DomElements.createFileModalOverlay.classList.remove('hidden');
    DomElements.createFileModal.classList.remove('hidden');
});

DomElements.createFileModalOverlay.addEventListener('click', function(e) {
    console.log(this)
    this.classList.add("hidden");
    DomElements.createFileModal.classList.add('hidden');
});