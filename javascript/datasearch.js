const dataUrl = 'json/data.json'
let jsonData = []

// Load JSON data
async function loadJson() {
    try {
        const response = await fetch(dataUrl)
        if (!response.ok) throw new Error('Erro ao carregar o JSON')
        jsonData = await response.json()
    } catch (error) {
        console.error(error)
    }
}

// Search Function
function searchJson() {
    const searchInput = document.getElementById('inputsearch')
    const resultsContainer = document.getElementById('results')
    const inputContainer = document.querySelector('.input-container')
    const h2title = document.querySelector('.maincontent h2')

    if (!searchInput || !resultsContainer) return

    const searchValue = searchInput.value.trim().toLowerCase()

    if (searchValue !== '') {
        inputContainer.classList.add('active')
        h2title.classList.add('active')
        resultsContainer.style.display = 'block'
    } else {
        resultsContainer.innerHTML = ''
        resultsContainer.style.display = 'none'
        inputContainer.classList.remove('active')
        h2title.classList.remove('active')
        return
    }

    resultsContainer.innerHTML = ''

    // Filter JSON
    const filteredData = jsonData.filter(item =>
        item.CFOP.includes(searchValue) || 
        item["Descricao"].toLowerCase().includes(searchValue)
    );

    if (filteredData.length === 0) {
        
        const noResultsItem = document.createElement('li')
        noResultsItem.textContent = 'Não foi possível localizar informações relevantes com os critérios fornecidos.'
        noResultsItem.classList.add('no-results')
        resultsContainer.appendChild(noResultsItem)
    } else {
        
        filteredData.forEach(item => {
            const li = document.createElement('li')
            li.textContent = `${item.CFOP} - ${item["Descricao"]}`
            li.classList.add('result-item')

            resultsContainer.appendChild(li)
        });
    }
}

// Load JSON and add search event
window.onload = async function () {
    await loadJson()
    document.getElementById('inputsearch').addEventListener('input', searchJson)
};
