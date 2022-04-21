// handle MC visibility
let goDown = false;

const upImage = document.querySelector(".mc-footer img");
const mcFooter = document.querySelector(".mc-footer");
const mcSection = document.querySelector(".mc");
const mcDescription = document.querySelector(".mc-description")
const complexitySection = document.querySelector(".complexity-section");
const buffers = document.querySelector(".buffers");

upImage.addEventListener('click', (e) => {
    if (!goDown) {
        complexitySection.style.visibility = 'hidden';
        mcDescription.style.visibility = 'hidden';
        buffers.style.visibility = 'hidden';
        mcSection.style.backgroundColor = 'inherit';
        mcFooter.style.backgroundColor = '#9EACF3'
        upImage.style.transform = 'rotate(0deg)'
        goDown = true;
    } else {
        mcSection.style.backgroundColor = '#9EACF3';
        complexitySection.style.visibility = 'initial'
        mcDescription.style.visibility = 'initial'
        buffers.style.visibility = 'initial'
        upImage.style.transform = 'rotate(-180deg)'
        goDown = false;
    }
});
