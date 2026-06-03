// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBCmtf50PzBbFjUJdSbWV_XolyuZ4ugK98",
  authDomain: "sorteonombres.firebaseapp.com",
  projectId: "sorteonombres",
  storageBucket: "sorteonombres.firebasestorage.app",
  messagingSenderId: "1056897583978",
  appId: "1:1056897583978:web:6bcbe93ccd4cd9c3107313"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);




function configurarPapelito(papelito) {
    const contenedorPapelito = document.createElement("div");
    contenedorPapelito.classList.add("contenedor-papelito");

    //Logica aspecto realista
    const texturas = ["pattern-liso", "pattern-rayado", "pattern-cuadriculado"];
    const formas = ["shape-rasgado-1", "shape-rasgado-2", "shape-rasgado-3"];

    const texturaAlAzar = texturas[Math.floor(Math.random() * texturas.length)];
    const formaAlAzar = formas[Math.floor(Math.random() * formas.length)];

    papelito.classList.add(texturaAlAzar);
    papelito.classList.add(formaAlAzar);

    const giroAlAzar = (Math.random() * 6 - 3).toFixed(2);
    papelito.style.transform = `rotate(${giroAlAzar}deg)`;

    contenedorPapelito.appendChild(papelito);
    if (typeof container !== 'undefined') {
        container.appendChild(contenedorPapelito);
    } else {
        document.getElementById("container").appendChild(contenedorPapelito);
    }
    

    const mensajeError = document.createElement("div");
    mensajeError.classList.add("toast-error");
    mensajeError.classList.add("oculto");
    mensajeError.textContent = "El nombre solo puede contener letras y/o espacios";
    papelito.after(mensajeError);

    papelito.id = "papelito";
    papelito.classList.add("estilo-papelito");
    papelito.draggable = true;

    papelito.addEventListener("dblclick", () => {
        papelito.contentEditable = true;
        papelito.focus();
        papelito.draggable = false;
    });

    papelito.addEventListener("input", () => {
        let nombreIngresado = papelito.textContent;
        if (nombreIngresado === "") {
            mensajeError.classList.add("oculto");
            papelito.draggable = false;
            papelito.style.cursor = "not-allowed";
        } else if (!reglaNombre.test(nombreIngresado)) {
            mensajeError.classList.remove("oculto");
            papelito.draggable = false;
            papelito.style.cursor = "not-allowed";
        } else {
            mensajeError.classList.add("oculto");
            papelito.draggable =  true;
            papelito.style.cursor = "grab";
        };
    });

    papelito.addEventListener('keydown', (evento) => {
        if (evento.key === "Enter") {
            evento.preventDefault();
            papelito.blur();
        }
    })

    papelito.addEventListener("blur", () => {
        papelito.draggable = true;
        papelito.contentEditable = false;
    });

    papelito.addEventListener("dragstart", (evento) => {
        if (!reglaNombre.test(papelito.textContent)) {
            evento.preventDefault();
            return;
        }

        evento.dataTransfer.effectAllowed = "move";
        evento.dataTransfer.dropEffect = "move";
        evento.dataTransfer.setData("text/plain", evento.target.id);
    });

    //logica touch dedos
    papelito.addEventListener('touchstart', iniciarArrastre, { passive: false });
    papelito.addEventListener('touchmove', moverPapelito, { passive: false });
    papelito.addEventListener('touchend', soltarPapelito);

}

function limpiarAcentos(texto) {
    return texto
    .replace(/ñ/g, "##enye_min##")
    .replace(/Ñ/g, "##enye_may##")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/##enye_min##/, "ñ")
    .replace(/##enye_may##/, "Ñ");
}

async function procesarPapelito(papelito) {
    const nombreNormalizado = limpiarAcentos(papelito.textContent.toLowerCase().trim());

    if(!reglaNombre.test(nombreNormalizado)) {
        alert(`El nombre ${nombreNormalizado} no es un nombre válido para participar del sorteo. Los nombres solo pueden tener letras y/o espacios`);
        return false;
    };

    const q = query(collection(db, "nombres"), where("nombre", "==", nombreNormalizado));
    const consulta = await getDocs(q);

    if (consulta.empty) {
        await addDoc(collection(db, "nombres"), { nombre: nombreNormalizado });
        alert(`Ingresaste ${nombreNormalizado} a la bolsa!`);
        papelito.remove();
        btnNuevoPapelito.style.display = "block";
        return true;
    } else {
        alert(`${nombreNormalizado[0].toUpperCase()}${nombreNormalizado.slice(1)} ya está participando del sorteo, probá ingresar otro nombre.`);
        return false;
    };
}

let inicioX = 0;
let inicioY = 0;
let offsetX = 0;
let offsetY = 0;
let papelitoActual = null;

function iniciarArrastre(e) {
    papelitoActual = e.target.closest('#papelito');
    if (!papelitoActual) return;

    const toque = e.touches[0];

    inicioX = toque.clientX - offsetX;
    inicioY = toque.clientY - offsetY;
    
    papelitoActual.style.transition = 'none';
    papelitoActual.style.zIndex = '1000';
}

function moverPapelito(e) {
    if (!papelitoActual) return;
    
    e.preventDefault();
    
    const toque = e.touches[0];

    offsetX = toque.clientX - inicioX;
    offsetY = toque.clientY - inicioY;

    papelitoActual.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(-5deg)`;
}

async function soltarPapelito(e) {
    if (!papelitoActual) return;

    const toque = e.changedTouches[0];

    papelitoActual.style.display = 'none';
    const elementoDebajo = document.elementFromPoint(toque.clientX, toque.clientY);
    papelitoActual.style.display = 'block';

    if (elementoDebajo && elementoDebajo.closest('#bolsa')) {
        const ingresoExitoso = await procesarPapelito(papelitoActual);

        if (!ingresoExitoso) {
            papelitoActual.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            papelitoActual.style.transform = 'translate(0px, 0px) rotate(0deg)';
        }
    } else {
        papelitoActual.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        papelitoActual.style.transform = 'translate(0px, 0px) rotate(0deg)';
    };

    papelitoActual.style.zIndex = '1';
    papelitoActual = null;
    offsetX = 0;
    offsetY = 0;
}

const container = document.getElementById("container");
const papelito = document.getElementById("papelito");
const reglaNombre = /^[a-zA-Z áéíóúñÑÁÉÍÓÚüÜ]+$/;

configurarPapelito(papelito);

const bolsa = document.getElementById("bolsa");
const btnNuevoPapelito = document.getElementById("nuevo-papelito");

btnNuevoPapelito.addEventListener("click", () => {
    if (document.querySelector('#papelito')) {
        alert("Buena hacker!. Ya hay un papelito en la mesa así que podes usar ese");
        return;
    }

    const nuevoPapelito = document.createElement("div");
    configurarPapelito(nuevoPapelito);
    btnNuevoPapelito.style.display = "none";
});

const nombres = [];

bolsa.addEventListener("dragover", (event) => {
    event.preventDefault();
});

bolsa.addEventListener("dragenter", (event) => {
    event.preventDefault();
    bolsa.classList.add("bolsa-activa");
});

bolsa.addEventListener("dragleave", (event) => {
    bolsa.classList.remove("bolsa-activa");
})

bolsa.addEventListener("drop", async (event) => {
    event.preventDefault();
    bolsa.classList.remove("bolsa-activa");
    const idPapelito = event.dataTransfer.getData("text/plain");
    const papelito = document.getElementById(idPapelito);

    await procesarPapelito(papelito);
});