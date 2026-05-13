function configurarPapelito(papelito) {
    papelito.id = "papelito";
    papelito.classList.add("estilo-papelito");
    papelito.draggable = true;

    papelito.addEventListener("dblclick", () => {
        papelito.contentEditable = true;
        papelito.focus();
        papelito.draggable = false;
    });

    papelito.addEventListener("blur", () => {
        papelito.draggable = true;
        papelito.contentEditable = false;
    });

    papelito.addEventListener("dragstart", (evento) => {
        evento.dataTransfer.setData("text/plain", evento.target.id);
    });
}

const container = document.getElementById("container");
const papelito = document.getElementById("papelito");

configurarPapelito(papelito);

const bolsa = document.getElementById("bolsa");
const btnNuevoPapelito = document.getElementById("nuevo-papelito");

btnNuevoPapelito.addEventListener("click", () => {
    const nuevoPapelito = document.createElement("div");
    configurarPapelito(nuevoPapelito);
    container.appendChild(nuevoPapelito);
    btnNuevoPapelito.style.display = "none";
});

const nombres = [];

bolsa.addEventListener("dragover", (event) => {
    event.preventDefault();
});

bolsa.addEventListener("drop", (event) => {
    event.preventDefault();
    const idPapelito = event.dataTransfer.getData("text/plain");
    const papelito = document.getElementById(idPapelito);
    const nombreNormalizado = papelito.textContent.toLowerCase().trim();
    if (!nombres.includes(nombreNormalizado)) {
        nombres.push(nombreNormalizado);
        alert(`Ingresaste ${nombreNormalizado} a la bolsa, ya está participando!`);
        papelito.remove();
        btnNuevoPapelito.style.display = "block";
    } else {
        alert(`El nombre ${nombreNormalizado} ya está participando del sorteo, probá ingresar otro nombre.`)
    };
});