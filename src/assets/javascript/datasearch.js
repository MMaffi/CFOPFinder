const dataUrl = './src/assets/json/data.json';
let jsonData = [];

// Load Json
async function loadJson() {
    try {
        const response = await fetch(dataUrl);
        if (!response.ok) throw new Error('Erro ao carregar o JSON');
        jsonData = await response.json();
    } catch (error) {
        console.error(error);
    }
}

// Search Function
function searchJson() {
    const searchInput = document.getElementById('inputsearch');
    const resultsContainer = document.getElementById('results');
    const inputContainer = document.querySelector('.input-container');
    const h2title = document.querySelector('.maincontent h2');

    if (!searchInput || !resultsContainer) return [];

    const searchValue = searchInput.value.trim().toLowerCase();

    if (searchValue !== '') {
        inputContainer.classList.add('active');
        h2title.classList.add('active');
        resultsContainer.style.display = 'block';
    } else {
        resultsContainer.innerHTML = '';
        resultsContainer.style.display = 'none';
        inputContainer.classList.remove('active');
        h2title.classList.remove('active');
        return [];
    }

    resultsContainer.innerHTML = '';

    const filteredData = jsonData.filter(item =>
        item.CFOP.includes(searchValue) || 
        item["Descricao"].toLowerCase().includes(searchValue)
    );

    if (filteredData.length === 0) {
        const noResultsItem = document.createElement('li');
        noResultsItem.textContent = 'Não foi possível localizar informações relevantes com os critérios fornecidos.';
        noResultsItem.classList.add('no-results');
        resultsContainer.appendChild(noResultsItem);
    } else {
        filteredData.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.CFOP} - ${item["Descricao"]}`;
            li.classList.add('result-item');
            li.addEventListener('click', () => openCfopModal(item));
            resultsContainer.appendChild(li);
        });
    }

    return filteredData;
}

// Open modal function
function openCfopModal(item) {
    const modal = document.getElementById('cfopModal');
    const modalCfop = document.getElementById('modalCfop');
    const modalDescricao = document.getElementById('modalDescricao');
    const copyBtn = document.getElementById('copyCfopBtn');

    if (item) {
        modalCfop.textContent = item.CFOP;
        modalDescricao.textContent = item["Descricao"];
        copyBtn.setAttribute('data-text', `${item.CFOP} - ${item["Descricao"]}`);
        copyBtn.style.display = "inline-flex";
    } else {
        modalCfop.textContent = "Nenhum resultado encontrado";
        modalDescricao.textContent = "Não foi possível localizar informações relevantes com os critérios fornecidos.";
        copyBtn.setAttribute('data-text', "");
        copyBtn.style.display = "none";
    }

    modal.style.display = 'flex';
}

// Exit modal with X
document.getElementById('closeCfopModal').addEventListener('click', () => {
    document.getElementById('cfopModal').style.display = 'none';
});

// Exit modal with out click
document.getElementById('cfopModal').addEventListener('click', (e) => {
    if (e.target.id === 'cfopModal') {
        document.getElementById('cfopModal').style.display = 'none';
    }
});

// Exit modal with 'esc'
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.getElementById('cfopModal').style.display = 'none';
    }
});

// Copy Button
document.getElementById('copyCfopBtn').addEventListener('click', () => {
    const textToCopy = document.getElementById('copyCfopBtn').getAttribute('data-text');
    if (!textToCopy) return;

    navigator.clipboard.writeText(textToCopy).then(() => {
        const icon = document.querySelector('#copyCfopBtn i');
        icon.classList.remove("bi-clipboard");
        icon.classList.add("bi-clipboard-check");

        setTimeout(() => {
            icon.classList.remove("bi-clipboard-check");
            icon.classList.add("bi-clipboard");
        }, 1500);
    }).catch(err => console.error("Erro ao copiar:", err));
});

document.getElementById('inputsearch').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const results = searchJson();
        if (results.length > 0) {
            openCfopModal(results[0]);
        } else {
            openCfopModal(null);
        }
    }
});

window.onload = async function () {
    await loadJson();
    document.getElementById('inputsearch').addEventListener('input', searchJson);
};