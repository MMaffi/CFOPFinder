const btnmenu = document.getElementById('btnmenu')
const modal = document.getElementById('menumodal')

function openmenu() {
    // modal.style.display = 'block'
    modal.style.right = '20px'
}

function closemenu() {
    // modal.style.display = 'none'
    modal.style.right = '-9999px'
}

btnmenu.addEventListener('click', () => {

    if (btnmenu.textContent === 'Menu') {
        btnmenu.innerHTML = 'X'
        btnmenu.style.width = '30px'
        openmenu()
    }else {
        btnmenu.innerHTML = 'Menu'
        btnmenu.style.width = '70px'
        closemenu()
    }

})