// import {resetGuide} from "./files/view_file/guide.js";


const overlay = document.querySelector('.display-mobile-case');


window.addEventListener('load', (e) => {
    if (innerWidth < 1200) {
        overlay.classList.remove('hidden');
    } else {
        overlay.classList.add('hidden');
        // resetGuide();
    }
})

window.addEventListener('resize', (e) => {
    if (innerWidth < 1200) {
        overlay.classList.remove('hidden')
    } else {
        overlay.classList.add('hidden');
        // resetGuide();
    }
})