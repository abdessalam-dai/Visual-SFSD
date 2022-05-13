// handle MC visibility
let goDown = false;

const toggleMC = document.querySelector("#toggle-mc");
const mc = d3.select(".mc");
const mcBody = d3.select("#mc-body");
const mcFooter = document.querySelector(".mc-footer");
const mcSection = document.querySelector(".mc");
const mcDescription = document.querySelector(".mc-description")
const complexitySection = document.querySelector(".complexity-section");
const buffers = document.querySelector(".buffers");


toggleMC.addEventListener('click', function() {

    if (mcBody.classed("mc-open")) {
        let height = mcBody.node().getBoundingClientRect().height;
        mcBody.transition()
            .ease(d3.easeLinear)
            .delay(0)
            .duration(250)
            .style("transform", `translateY(${height + 40}px)`);
        mcBody.classed("mc-open", false);
        toggleMC.style.transform = 'rotate(0deg)';
        d3.select(".mc-footer").classed("rounded-tl-lg", true);
    } else {
        d3.select(".mc-footer").classed("rounded-tl-lg", false);
        mcBody.transition()
            .ease(d3.easeLinear)
            .delay(0)
            .duration(250)
            .style("transform", `translateY(0)`);
        mcBody.classed("mc-open", true);
        toggleMC.style.transform = 'rotate(-180deg)';
    }


    // $("#mc-body").css('height','0').slideUp();
});


// upImage.addEventListener('click', (e) => {
//     if (!goDown) {
//         complexitySection.style.visibility = 'hidden';
//         mcDescription.style.visibility = 'hidden';
//         buffers.style.visibility = 'hidden';
//         mcSection.style.backgroundColor = 'inherit';
//         mcFooter.style.backgroundColor = '#9EACF3'
//         upImage.style.transform = 'rotate(0deg)'
//         goDown = true;
//     } else {
//         mcSection.style.backgroundColor = '#9EACF3';
//         complexitySection.style.visibility = 'initial'
//         mcDescription.style.visibility = 'initial'
//         buffers.style.visibility = 'initial'
//         upImage.style.transform = 'rotate(-180deg)'
//         goDown = false;
//     }
// });


