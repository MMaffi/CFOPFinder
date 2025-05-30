const btnmenu = document.getElementById('filterbutton')
const modal = document.getElementById('filtermodal')

function openfilter() {
    // modal.style.display = 'block'
    modal.style.left = '20px'
}

function closefilter() {
    // modal.style.display = 'none'
    modal.style.left = '-9999px'
}

btnmenu.addEventListener('click', () => {

    if (btnmenu.textContent === 'Filtros') {
        btnmenu.innerHTML = 'X'
        btnmenu.style.width = '30px'
        openfilter()
    }else {
        btnmenu.innerHTML = 'Filtros'
        btnmenu.style.width = '60px'
        closefilter()
    }

})