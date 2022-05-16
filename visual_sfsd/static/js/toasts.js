const toastsElement = d3.select("#toasts");

let messages = {
    danger: [],
    success: [],
    warning: []
};

const successIcon = `
 <div class="inline-flex items-center justify-center flex-shrink-0 w-7 h-7 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
    </div>
`;
const dangerIcon = `
<div class="inline-flex items-center justify-center flex-shrink-0 w-7 h-7 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"></path>
            </svg>
 </div>`;

export const addToast = (message = "", type = "danger") => {
    messages[type].push(message);
    const messageDiv = `<div id="message-${messages[type].length}"
         class="toast toast-animate flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-2xl shadow dark:text-gray-400 dark:bg-gray-800"
         role="alert">
            ${type === 'danger' ? dangerIcon : successIcon}
        <div class="ml-3 text-sm font-normal">${message}</div>
        <button type="button"
                class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                data-dismiss-target="#message-${messages[type].length}" aria-label="Close">
            <span class="sr-only">Close</span>
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"></path>
            </svg>
        </button>
    </div>`;
    toastsElement.node().insertAdjacentHTML('beforeend', messageDiv);
    const lastMessage = d3.select('#toasts .toast:last-child');
    // hide toast by clicking on button
    lastMessage.select("button")
        .on("click", function () {
            console.log(lastMessage)
            lastMessage.remove()
        })

    // hide toast after 10 seconds
    lastMessage.transition()
        .ease(d3.easeLinear)
        .delay(5000)
        .duration(0)
        .style("display", "none");
}
