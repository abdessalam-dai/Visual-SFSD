const overlay = document.querySelector('.display-mobile-case');
const main = document.querySelector("#main");

function checkScreenSize() {
     if (innerWidth < 1200) {
        overlay.classList.remove('hidden');
        main.classList.add("hidden");
    } else {
        main.classList.remove("hidden");
        overlay.classList.add('hidden');
    }
}



window.addEventListener('load', (e) => {
   checkScreenSize();
})

window.addEventListener('resize', (e) => {
    checkScreenSize();
})