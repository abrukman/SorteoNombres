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

let nombres = [];

function escucharNombres() {
    onSnapshot(collection(db, "nombres"), (querySnapshot) => {
        listaNombres.textContent = "";
        nombres = [];

        querySnapshot.forEach((doc) => {
            const nombre = doc.data().nombre;

            nombres.push(nombre);

            const nuevoNombre = document.createElement("li");
            nuevoNombre.textContent = nombre;
            listaNombres.appendChild(nuevoNombre);
            
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

    alert(`${ganador[0].toUpperCase()}${ganador.slice(1)} es el ganador!`);
}

btnSortear.addEventListener("click", () => {
    realizarSorteo();
})

window.addEventListener("DOMContentLoaded", () => {
    escucharNombres();
});