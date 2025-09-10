window.addEventListener("load", function () {
    const updateAlert = document.getElementById("updatealert");
    const closeAlert = document.getElementById("closealert");

    if (updateAlert && closeAlert) {
        updateAlert.style.display = "flex";
        closeAlert.onclick = () => updateAlert.style.display = "none";
    }
});