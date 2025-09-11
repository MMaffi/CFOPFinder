// Elementos para o dark mode
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');

// Verificar preferência salva ou do sistema
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fas fa-sun';
        themeToggle.setAttribute('title', 'Alternar para modo claro');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        themeIcon.className = 'fas fa-moon';
        themeToggle.setAttribute('title', 'Alternar para modo escuro');
    }
}

// Alternar entre temas
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        themeIcon.className = 'fas fa-moon';
        themeToggle.setAttribute('title', 'Alternar para modo escuro');
        showToast('Modo claro ativado');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeIcon.className = 'fas fa-sun';
        themeToggle.setAttribute('title', 'Alternar para modo claro');
        showToast('Modo escuro ativado');
    }
}

// Adicionar event listener para o botão de tema
themeToggle.addEventListener('click', toggleTheme);

// Verificar mudanças na preferência do sistema
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
        if (e.matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeIcon.className = 'fas fa-sun';
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            themeIcon.className = 'fas fa-moon';
        }
    }
});