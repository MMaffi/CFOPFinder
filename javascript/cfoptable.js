document.addEventListener("DOMContentLoaded", function () {
    const tabela = document.querySelector("tbody")

    // Busca os dados do arquivo JSON
    fetch("../json/data.json")
        .then(response => response.json()) // Converte a resposta para JSON
        .then(data => {
            // Itera sobre os itens do JSON e adiciona à tabela
            data.forEach(item => {
                const row = document.createElement("tr")

                row.innerHTML = `
                    <td>${item.CFOP}</td>
                    <td>${item.Descricao}</td>
                `

                tabela.appendChild(row)
            });

            addRowSelection();
        })
        .catch(error => console.error("Erro ao carregar os dados:", error))
});

// Function to enable row selection
function addRowSelection() {
    const rows = document.querySelectorAll("tbody tr")

    rows.forEach(row => {
        row.addEventListener("click", function (event) {
            event.stopPropagation()

            // Check if the row is already selected
            if (this.classList.contains("selected")) {
                this.classList.remove("selected")
                removeOverlay()
                resetZoomedRow()
            } else {
                rows.forEach(r => r.classList.remove("selected"))
                this.classList.add("selected")
                zoomRow(this)
                addOverlay(this)
            }
        });
    });

    document.addEventListener("click", function () {
        const selectedRow = document.querySelector("tbody tr.selected")
        if (selectedRow) {
            selectedRow.classList.remove("selected")
            removeOverlay()
            resetZoomedRow()
        }
    });
}

// Function to enlarge the clicked row
function zoomRow(row) {
    const rowClone = row.cloneNode(true)
    rowClone.id = "zoomed-row"
    rowClone.style.position = "fixed"
    rowClone.style.top = "50%"
    rowClone.style.left = "50%"
    rowClone.style.transform = "translate(-50%, -50%) scale(1.5)"
    rowClone.style.transition = "transform 0.3s ease"
    rowClone.style.zIndex = "1000"
    rowClone.style.backgroundColor = "#ffffff"
    rowClone.style.boxShadow = "0px 0px 15px rgba(0, 0, 0, 0.3)"

    document.body.appendChild(rowClone)

    rowClone.addEventListener("click", function(event) {
        event.stopPropagation();
    });

    document.addEventListener("click", function (event) {
        if (!rowClone.contains(event.target)) {
            resetZoomedRow();
        }
    }, { once: true });
}

// Function to remove the expanded row
function resetZoomedRow() {
    const zoomedRow = document.getElementById("zoomed-row")
    if (zoomedRow) {
        zoomedRow.remove()
    }
}

function addOverlay() {
    const overlay = document.createElement("div")
    overlay.id = "overlay"
    overlay.style.position = "fixed"
    overlay.style.top = "0"
    overlay.style.left = "0"
    overlay.style.width = "100%"
    overlay.style.height = "100%"
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)"
    overlay.style.zIndex = "999"
    document.body.appendChild(overlay)
}

function removeOverlay() {
    const overlay = document.getElementById("overlay")
    if (overlay) {
        overlay.remove()
    }
}

// Script to Top Scroll Button
const scrollToTopBtn = document.getElementById("scrollToTopBtn")

window.onscroll = function () {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        scrollToTopBtn.style.display = "block"
    } else {
        scrollToTopBtn.style.display = "none"
    }
}

scrollToTopBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" })
})