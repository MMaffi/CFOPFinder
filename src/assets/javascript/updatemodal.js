window.onload = function() {
    document.getElementById("updatealert").style.display = "flex";

    document.getElementById("closealert").onclick = function() {
      document.getElementById("updatealert").style.display = "none";
    }
}