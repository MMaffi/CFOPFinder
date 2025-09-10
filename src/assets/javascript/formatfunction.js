// Função para formatar o código CFOP com ponto após o primeiro dígito
function formatCfopCode(code) {
    if (!code) return '';
    if (code.length <= 1) return code;
    return code.substring(0, 1) + '.' + code.substring(1);
}