import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBCmtf50PzBbFjUJdSbWV_XolyuZ4ugK98",
  authDomain: "sorteonombres.firebaseapp.com",
  projectId: "sorteonombres",
  storageBucket: "sorteonombres.firebasestorage.app",
  messagingSenderId: "1056897583978",
  appId: "1:1056897583978:web:6bcbe93ccd4cd9c3107313"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const listaNombres = document.getElementById("lista-nombres");
const btnSortear = document.getElementById("sortear");
const modalGanador = document.getElementById("modal-ganador");
const textoGanador = document.getElementById("nombre-ganador-texto");
const btnCerrarModal = document.getElementById("cerrar-modal");


let nombres = [];

function escucharNombres() {
    onSnapshot(collection(db, "nombres"), (querySnapshot) => {
        listaNombres.textContent = "";
        nombres = [];

        querySnapshot.forEach((doc) => {
            const nombre = doc.data().nombre;

            nombres.push(nombre);

            const texturas = ["pattern-liso", "pattern-rayado", "pattern-cuadriculado"];
            const formas = ["shape-rasgado-1", "shape-rasgado-2", "shape-rasgado-3"];
            const texturaAlAzar = texturas[Math.floor(Math.random() * texturas.length)];
            const formaAlAzar = formas[Math.floor(Math.random() * formas.length)];

            const nuevoLiNombre = document.createElement("li");
            const nuevoNombre = document.createElement("span");
            nuevoNombre.classList.add(texturaAlAzar);
            nuevoNombre.classList.add(formaAlAzar);
            nuevoNombre.classList.add("estilo-papelito");
            nuevoNombre.classList.add("estilo-papelito-admin");
            nuevoNombre.textContent = nombre;
            nuevoLiNombre.appendChild(nuevoNombre);
            listaNombres.appendChild(nuevoLiNombre);
            
        });
    })
}

function realizarSorteo() {
    if (nombres.length === 0) {
        alert('No hay participantes para sortear!');
        return;
    }

    const indiceAleatorio = Math.floor(Math.random() * nombres.length);

    const ganador = nombres[indiceAleatorio];
    textoGanador.textContent = ganador;

    modalGanador.showModal();
    btnCerrarModal.addEventListener("click", () => {
        modalGanador.close();
    });

    //alert(`${ganador[0].toUpperCase()}${ganador.slice(1)} es el ganador!`);
}

btnSortear.addEventListener("click", () => {
    realizarSorteo();
})

window.addEventListener("DOMContentLoaded", () => {
    escucharNombres();
});