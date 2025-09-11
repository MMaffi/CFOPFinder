let cfopDatabase = [];
let currentIndex = 0;
const PAGE_SIZE = 30;
let filteredResults = [];
let showingSearch = false;
let isLoading = false;
let fuse;

// Elementos DOM
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const clearSearch = document.getElementById('clearSearch');
const resultsContainer = document.getElementById('results');
const loadingResults = document.getElementById('loadingResults');
const modal = document.getElementById('cfopModal');
const helpModal = document.getElementById('helpModal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const advancedSearchToggle = document.getElementById('advancedSearchToggle');
const advancedSearchContainer = document.getElementById('advancedSearchContainer');
const totalCfopsElement = document.getElementById('totalCfops');
const lastUpdateElement = document.getElementById('lastUpdate');
const resultCountElement = document.getElementById('resultCount');
const exportResultsButton = document.getElementById('exportResults');
const openHelpButton = document.getElementById('openHelp');
const openAboutButton = document.getElementById('openAbout');
const toast = document.getElementById('toast');
const backToTopBtn = document.getElementById("backToTop");

// Função para inicializar o Fuse.js
function initializeFuse() {
    const options = {
        keys: [
            {
                name: 'descricao',
                weight: 0.6
            },
            {
                name: 'codigo',
                weight: 0.3
            },
            {
                name: 'aplicacao',
                weight: 0.1
            }
        ],
        includeScore: true,
        threshold: 0.4,
        distance: 100,
        ignoreLocation: true,
        minMatchCharLength: 2
    };
    
    fuse = new Fuse(cfopDatabase, options);
}

// Função para carregar JSON
async function loadJson() {
    try {
        const response = await fetch('./src/assets/json/tabelaCFOP.json');
        const data = await response.json();
        cfopDatabase = data.CFOP;

        // Inicializar Fuse.js com os dados
        initializeFuse();

        totalCfopsElement.textContent = cfopDatabase.length.toLocaleString('pt-BR');
        lastUpdateElement.textContent = new Date().toLocaleDateString('pt-BR');
        resultCountElement.textContent = cfopDatabase.length.toLocaleString('pt-BR');

        loadMoreResults();

        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get('q');
        if (searchParam) {
            searchInput.value = searchParam;
            performSearch();
        }
    } catch (error) {
        console.error("Erro ao carregar JSON:", error);
        showToast("Erro ao carregar dados da tabela CFOP", "error");
    }
}

// Função para carregar mais resultados
function loadMoreResults() {
    if (isLoading) return;
    
    const dataToRender = showingSearch ? filteredResults : cfopDatabase;
    
    if (currentIndex >= dataToRender.length) {
        loadingResults.classList.remove('show');
        return;
    }
    
    isLoading = true;
    loadingResults.classList.add('show');
    
    setTimeout(() => {
        const nextItems = dataToRender.slice(currentIndex, currentIndex + PAGE_SIZE);
        currentIndex += PAGE_SIZE;
        
        displayResults(nextItems, true);
        isLoading = false;
        
        if (currentIndex >= dataToRender.length) {
            loadingResults.classList.remove('show');
        }
    }, 300);
}

// Função para realizar a busca
function performSearch() {
    const searchTerm = searchInput.value.trim();
    const searchType = document.querySelector('input[name="searchType"]:checked').value;
    
    resultsContainer.innerHTML = '';
    currentIndex = 0;
    showingSearch = true;
    
    if (searchTerm === '') {
        showingSearch = false;
        resultCountElement.textContent = cfopDatabase.length.toLocaleString('pt-BR');
        loadMoreResults();
        return;
    }
    
    let searchOptions = {};
    
    if (searchType === 'code') {
        searchOptions = {
            keys: ['codigo'],
            threshold: 0.2,
            shouldSort: true
        };
    } else if (searchType === 'start') {
        filteredResults = cfopDatabase.filter(item => 
            item.descricao.toLowerCase().startsWith(searchTerm.toLowerCase())
        );
        resultCountElement.textContent = filteredResults.length.toLocaleString('pt-BR');
        loadMoreResults();
        return;
    } else {
        searchOptions = {
            keys: ['descricao', 'codigo', 'aplicacao'],
            threshold: 0.4,
            shouldSort: true
        };
    }
    
    // Aplicar busca com Fuse.js
    const fuseInstance = new Fuse(cfopDatabase, searchOptions);
    const searchResults = fuseInstance.search(searchTerm);
    
    filteredResults = searchResults.map(result => result.item);
    
    resultCountElement.textContent = filteredResults.length.toLocaleString('pt-BR');
    
    if (filteredResults.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>Nenhum resultado encontrado</h3>
                <p>Tente alterar os termos de busca ou os filtros aplicados.</p>
            </div>
        `;
        loadingResults.classList.remove('show');
        return;
    }
    
    loadMoreResults();
}

// Função para exibir resultados
function displayResults(results, append = false) {
    if (!append) resultsContainer.innerHTML = '';
    
    results.forEach(item => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.dataset.item = JSON.stringify(item);
        
        // Usar o código formatado
        const formattedCode = formatCfopCode(item.codigo);
        
        resultItem.innerHTML = `
            <div class="col-code">${formattedCode}</div>
            <div class="col-desc">${item.descricao}</div>
            <div class="col-actions">
                <button class="action-btn view-btn" title="Ver detalhes">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn copy-btn" title="Copiar código">
                    <i class="fas fa-copy"></i>
                </button>
            </div>
        `;
        
        resultItem.querySelector('.view-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            openModal(item);
        });
        
        resultItem.querySelector('.copy-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            copyCfopCode(item.codigo, resultItem.querySelector('.copy-btn'));
        });
        
        resultItem.addEventListener('click', () => {
            openModal(item);
        });
        
        resultsContainer.appendChild(resultItem);
    });
}

// Função para abrir modal
function openModal(item) {
    const formattedCode = formatCfopCode(item.codigo);
    modalTitle.textContent = `CFOP ${formattedCode}`;
    
    modalBody.innerHTML = `
        <div class="info-item">
            <div class="info-label">Código CFOP</div>
            <div class="info-value">${item.codigo}</div>
        </div>
        
        <div class="info-item">
            <div class="info-label">Descrição</div>
            <div class="info-value">${item.descricao}</div>
        </div>

        <div class="info-item">
            <div class="info-label">Aplicação</div>
            <div class="info-value">${item.aplicacao ?? "Não informado"}</div>
        </div>
        
        <button id="modalCopyBtn" class="primary-btn">
            <i class="fas fa-copy"></i> Copiar Código CFOP
        </button>
    `;
    
    document.getElementById("modalCopyBtn").addEventListener('click', () => {
        copyCfopCode(item.codigo);
    });
    
    modal.style.display = 'block';
}

// Função para exportar resultados
function exportToCSV() {
    const dataToExport = showingSearch ? filteredResults : cfopDatabase;
    
    if (dataToExport.length === 0) {
        showToast('Nenhum dado para exportar', 'error');
        return;
    }
    
    let csvContent = "Código CFOP;Descrição;Aplicação\n";
    dataToExport.forEach(item => {
        csvContent += `"${item.codigo}";"${item.descricao}";"${item.aplicacao ?? ''}"\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `cfopfinder_export_${date}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('Exportação concluída com sucesso');
}

// Eventos principais
document.addEventListener('DOMContentLoaded', function() {
    loadJson();
    searchInput.focus();
    initTheme();
});

searchButton.addEventListener('click', performSearch);

searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') performSearch();
});

clearSearch.addEventListener('click', () => {
    searchInput.value = '';
    searchInput.focus();
    performSearch();
});

advancedSearchToggle.addEventListener('click', () => {
    advancedSearchContainer.classList.toggle('show');
    
    if (advancedSearchContainer.classList.contains('show')) {
        advancedSearchToggle.innerHTML = '<i class="fas fa-times"></i>';
        advancedSearchToggle.setAttribute('title', 'Fechar busca avançada');
    } else {
        advancedSearchToggle.innerHTML = '<i class="fas fa-sliders-h"></i>';
        advancedSearchToggle.setAttribute('title', 'Busca avançada');
    }
});

exportResultsButton.addEventListener('click', exportToCSV);

openHelpButton.addEventListener('click', (e) => {
    e.preventDefault();
    helpModal.style.display = 'block';
});

openAboutButton.addEventListener('click', (e) => {
    e.preventDefault();
    showToast('CFOP Finder - Sistema de consulta de códigos CFOP');
});

// Fechar modais
document.querySelectorAll('.close').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.closest('.modal').style.display = 'none';
    });
});

window.addEventListener('click', (event) => {
    if (event.target === modal) modal.style.display = 'none';
    if (event.target === helpModal) helpModal.style.display = 'none';
});

// Detectar scroll para carregar mais
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
        loadMoreResults();
    }
});

// Botão voltar ao topo
window.addEventListener("scroll", () => {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        backToTopBtn.style.display = "flex";
    } else {
        backToTopBtn.style.display = "none";
    }
});

backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});