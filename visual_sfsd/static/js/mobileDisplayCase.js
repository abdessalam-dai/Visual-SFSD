const overlay = document.querySelector('.display-mobile-case');
console.log(overlay)
window.addEventListener('resize' , (e) => {
    console.log(innerWidth)
    if (innerWidth < 1200) {
        overlay.classList.remove('hidden')
    } else {
        overlay.classList.add('hidden');
    }
})