// grabbing Dom Elements
const fileTypes = document.querySelector('#file-types');
const SimpleFileOptionBtn = document.querySelector('#option-simple-file');
const IndexedFileOptionBtn = document.querySelector('#option-indexed-file');
const HashingFileOptionBtn = document.querySelector('#option-hashing-file');

const simpleFileTypes = document.querySelector('#simple-file-types')
const tofBtn = document.querySelector('#tof');
const tnofBtn = document.querySelector('#tnof');
const lofBtn = document.querySelector('#lof');
const lnofBtn = document.querySelector('#lnof');

const indexFileTypes = document.querySelector('#index-file-types')
const cluseteredBtn = document.querySelector("#clustered");
const notCluseteredBtn = document.querySelector("#not-clustered");

const hashingFileTypes = document.querySelector('#hashing-file-types')
const staticBtn = document.querySelector('#static');
const dynamicBtn = document.querySelector('#dynamic');

const form = document.querySelector('#form');
const namefile = document.querySelector('#name-file');
const nbMaxEnregs = document.querySelector('#max-enreg');
const fillWithDammyDataInput = document.querySelector("#fill-with-dummy-data");

const createFileBtn = document.querySelector('#create-file');
// a function that will hide automatically options

const initUI = function() {
    simpleFileTypes.classList.add('hide');
    indexFileTypes.classList.add('hide');
    hashingFileTypes.classList.add('hide');
    SimpleFileOptionBtn.classList.remove('selected');
    IndexedFileOptionBtn.classList.remove('selected');
    HashingFileOptionBtn.classList.remove('selected');
}

const userChoiceOfFile = function(element) {
    initUI()
    if (element.id == 'option-simple-file') {
        simpleFileTypes.classList.remove('hide');
        SimpleFileOptionBtn.classList.add('selected');
        exactType(simpleFileTypes)
    }
    if (element.id == 'option-indexed-file') {
        indexFileTypes.classList.remove('hide');
        IndexedFileOptionBtn.classList.add('selected');
        exactType(indexFileTypes)
    }
    if (element.id == 'option-hashing-file') {
        hashingFileTypes.classList.remove('hide');
        HashingFileOptionBtn.classList.add('selected');
        exactType(hashingFileTypes)
    }
}

const exactType = function(element) {

    Array.from(element.children).forEach(ele => {
        ele.addEventListener('click' , (e) => {
            handleChoice(e.target);
        })
    })
}

const handleChoice  = function(btn) {
    Array.from(btn.parentNode.children).forEach(elem => {
        if (elem.id != btn.id) {
            elem.classList.remove('selected');
        }
    })
    btn.classList.add('selected');
    hideForm(false);
}

const hideForm = function(bool) {
    if(bool) {
        form.classList.add('hide');
    }else {
        form.classList.remove('hide');
        // be default the create file button is going to be disabled
        createFileBtn.disabled = true;
    };

}

const finalData = function() {
    const info = Array.from(document.getElementsByClassName('selected'));
    const fileType = info[0].id.replace('option' , "").replaceAll('-' , '');
    const exactFileType = info[1].id;
    const fileNameValue = namefile.value;
    const numberOfEnreg = nbMaxEnregs.value;
    const fillWithDammyData = fillWithDammyDataInput.checked;
    console.log(fileType , exactFileType ,fileNameValue , numberOfEnreg , fillWithDammyData)

}

initUI()
hideForm(true);


Array.from(fileTypes.children).forEach(element => {
    element.addEventListener('click' , (e) => {
        userChoiceOfFile(e.target)
    })
});


namefile.addEventListener('input' , (e) => {
    e.preventDefault();
    createFileBtn.disabled = false;
    createFileBtn.style.cursor = "pointer";
})
// how to pass data to D
createFileBtn.addEventListener('click' , (e) => {
    e.preventDefault()
    finalData()
})