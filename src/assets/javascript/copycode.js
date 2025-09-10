// Função para copiar código CFOP
async function copyCfopCode(code, button = null) {
    try {
        await navigator.clipboard.writeText(code);
        
        if (button) {
            button.classList.add('copied');
            button.innerHTML = '<i class="fas fa-check"></i>';
            
            setTimeout(() => {
                button.classList.remove('copied');
                button.innerHTML = '<i class="fas fa-copy"></i>';
            }, 2000);
        }
        
        showToast('Código CFOP copiado para a área de transferência');
    } catch (err) {
        console.error('Erro ao copiar:', err);
        showToast('Erro ao copiar o código', 'error');
    }
}