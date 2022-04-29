// START - Handle file head drop down
import * as DomElements from "../DomElements.js";

let dropDownCharacteristicsIsVisible = false;
DomElements.entete.addEventListener("click", function () {
    const fileHeadDropDown = DomElements.fileHeadDropDown;
    if (fileHeadDropDown.classList.contains("hidden")) {
        fileHeadDropDown.classList.remove("hidden");
        DomElements.imageDropDown.style.transform = 'rotate(0deg)'
        dropDownCharacteristicsIsVisible = true;
    } else {
        fileHeadDropDown.classList.add("hidden");
        dropDownCharacteristicsIsVisible = false;
        DomElements.imageDropDown.style.transform = 'rotate(-180deg)'
    }
});


document.addEventListener('click', (e) => {
    if (!e.target.classList.contains("characteristics-image")) {
        DomElements.fileHeadDropDown.classList.add("hidden");
        DomElements.imageDropDown.style.transform = 'rotate(-180deg)'
    }
});
// END - Handle file head drop down