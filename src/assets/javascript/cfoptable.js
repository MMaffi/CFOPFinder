let originalData = []

document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.querySelector("tbody")

    // Load JSON data and render full table
    fetch("../json/data.json")
        .then(response => response.json())
        .then(data => {
            originalData = data
            renderTable(originalData)
        })
        .catch(error => console.error("Error loading data:", error))

    // Add event listeners for filter selects to auto-update table
    document.getElementById("filtertabletype").addEventListener("change", applyFilters)
    document.getElementById("filtertablestate").addEventListener("change", applyFilters)
})

// Render the table rows based on passed data
function renderTable(data) {
    const tableBody = document.querySelector("tbody")
    tableBody.innerHTML = ""

    data.forEach(item => {
        const row = document.createElement("tr")

        row.innerHTML = `
            <td>${item.CFOP}</td>
            <td>${item.Descricao}</td>
        `

        tableBody.appendChild(row)
    })

    addRowSelection()
}

// Filter data according to selected filters and render table
function applyFilters() {
    const operationType = document.getElementById("filtertabletype").value
    const operationDestination = document.getElementById("filtertablestate").value

    const filteredData = originalData.filter(item => {
        const cfop = item.CFOP.toString()

        let typeMatch = false
        if (operationType === "alloperation") {
            typeMatch = true
        } else if (operationType === "inbound") {
            typeMatch = ["1", "2", "3"].includes(cfop.charAt(0))
        } else if (operationType === "outbound") {
            typeMatch = ["5", "6", "7"].includes(cfop.charAt(0))
        }

        let destinationMatch = false
        if (operationDestination === "allstate") {
            destinationMatch = true
        } else if (operationDestination === "intra") {
            destinationMatch = ["1", "5"].includes(cfop.charAt(0))
        } else if (operationDestination === "inter") {
            destinationMatch = ["2", "6"].includes(cfop.charAt(0))
        } else if (operationDestination === "foreing") {  // You may want to fix this spelling to 'foreign'
            destinationMatch = ["3", "7"].includes(cfop.charAt(0))
        }

        return typeMatch && destinationMatch
    })

    renderTable(filteredData)
}

// Enable row selection with zoom effect and overlay
function addRowSelection() {
    const rows = document.querySelectorAll("tbody tr")

    rows.forEach(row => {
        row.addEventListener("click", function (event) {
            event.stopPropagation()

            if (this.classList.contains("selected")) {
                this.classList.remove("selected")
                removeOverlay()
                resetZoomedRow()
            } else {
                rows.forEach(r => r.classList.remove("selected"))
                this.classList.add("selected")
                zoomRow(this)
                addOverlay()
            }
        })
    })

    document.addEventListener("click", function () {
        const selectedRow = document.querySelector("tbody tr.selected")
        if (selectedRow) {
            selectedRow.classList.remove("selected")
            removeOverlay()
            resetZoomedRow()
        }
    })
}

// Clone and enlarge clicked row
function zoomRow(row) {
    const zoomedRow = row.cloneNode(true)
    zoomedRow.id = "zoomed-row"
    zoomedRow.style.position = "fixed"
    zoomedRow.style.top = "50%"
    zoomedRow.style.left = "50%"
    zoomedRow.style.transform = "translate(-50%, -50%) scale(1.5)"
    zoomedRow.style.transition = "transform 0.3s ease"
    zoomedRow.style.zIndex = "1000"
    zoomedRow.style.backgroundColor = "#ffffff"
    zoomedRow.style.boxShadow = "0px 0px 15px rgba(0, 0, 0, 0.3)"

    document.body.appendChild(zoomedRow)

    zoomedRow.addEventListener("click", function(event) {
        event.stopPropagation()
    })

    document.addEventListener("click", function (event) {
        if (!zoomedRow.contains(event.target)) {
            resetZoomedRow()
        }
    }, { once: true })
}

// Remove the enlarged zoomed row
function resetZoomedRow() {
    const zoomedRow = document.getElementById("zoomed-row")
    if (zoomedRow) {
        zoomedRow.remove()
    }
}

// Add dark overlay behind zoomed row
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
    overlay.style.cursor = "url('../image/cursors/cursor.cur'), pointer"
    document.body.appendChild(overlay)
}

// Remove the overlay
function removeOverlay() {
    const overlay = document.getElementById("overlay")
    if (overlay) {
        overlay.remove()
    }
}

// Scroll to top button logic
const scrollToTopButton = document.getElementById("scrollToTopBtn")

window.onscroll = function () {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        scrollToTopButton.style.display = "block"
    } else {
        scrollToTopButton.style.display = "none"
    }
}

scrollToTopButton.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" })
})
