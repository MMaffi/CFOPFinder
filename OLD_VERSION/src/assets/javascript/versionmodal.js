const btnversionmodal = document.getElementById('btnversionmodal')
const backvmodal = document.getElementById('backmodals')
const vmodal = document.getElementById('versionmodal')
const btncloseversionmodal = document.getElementById('btnclosevmodal')

let clickedOutside = false;

function openversionmodal() {
    vmodal.style.display = 'flex' 
    backvmodal.style.display = 'flex'  
}

function closeversionmodal() {
    vmodal.style.display = 'none'
    backvmodal.style.display = 'none'
}

btnversionmodal.addEventListener('dblclick', openversionmodal)

btncloseversionmodal.addEventListener('click', closeversionmodal)


// Used to close the modal when clicking outside of it
backvmodal.addEventListener('mousedown', (event) => {
    if (event.target === backvmodal) {
        clickedOutside = true;
    } else {
        clickedOutside = false;
    }
});

backvmodal.addEventListener('mouseup', (event) => {
    if (clickedOutside && event.target === backvmodal) {
        closeversionmodal()
    }
});