// Image file-name selected

document.getElementById("file").addEventListener("change", function() {
    let fileName = this.files.length > 0 ? this.files[0].name : "Nenhum arquivo selecionado";
    document.getElementById("file-name").textContent = fileName;
});