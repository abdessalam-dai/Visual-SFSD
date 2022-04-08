let delay = 0.5;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms * delay));
}

// START - Change animation speed.
const animationSpeedBar = document.querySelector("#animation-speed-bar");

function handleChangeAnimationSpeed() {
    animationSpeedBar.addEventListener("change", function () {
        delay = (200 - animationSpeedBar.value) / 100;
        console.log(delay);
    });
}

handleChangeAnimationSpeed();
// END - Change animation speed.

export {
    delay,
    sleep,
}