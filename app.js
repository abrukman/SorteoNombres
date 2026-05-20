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
    papelito.id = "papelito";
    papelito.classList.add("estilo-papelito");
    papelito.draggable = true;

    papelito.addEventListener("dblclick", () => {
        papelito.contentEditable = true;
        papelito.focus();
        papelito.draggable = false;
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

bolsa.addEventListener("drop", async (event) => {
    event.preventDefault();
    const idPapelito = event.dataTransfer.getData("text/plain");
    const papelito = document.getElementById(idPapelito);
    const nombreNormalizado = papelito.textContent.toLowerCase().trim();

    const q = query(collection(db, "nombres"), where("nombre", "==", nombreNormalizado));
    const consulta = await getDocs(q);
    if (consulta.empty) {
        await addDoc(collection(db, "nombres"), { nombre: nombreNormalizado });
        alert(`Ingresaste ${nombreNormalizado} a la bolsa!`);
        papelito.remove();
        btnNuevoPapelito.style.display = "block";
    } else {
        alert(`${nombreNormalizado[0].toUpperCase()}${nombreNormalizado.slice(1)} ya está participando del sorteo, probá ingresar otro nombre.`);
    };
});