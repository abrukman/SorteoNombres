import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

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
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

//----AUTENTICACIÓN-----//

const loginContainer = document.getElementById("login-container");
const panelAdmin = document.getElementById("panel-admin");
/*const formularioLogin = document.getElementById("formulario-login");
const inputEmail = document.getElementById("admin-email");
const inputPassword = document.getElementById("admin-password");*/
const btnLoginGoogle = document.getElementById("btn-login-google");
const mensajeError = document.getElementById("login-error");
const btnCerrarSesion = document.getElementById("btn-cerrar-sesion");

const MI_MAIL_ADMIN = "Kkb2Fc3L8PWaR9p7uo7pu6vaay63";

btnLoginGoogle.addEventListener("click", async () => {
    try {
        // Esto abre la ventanita emergente típica de Google
        await signInWithPopup(auth, googleProvider);
    } catch (error) {
        console.error("Error al iniciar sesión con Google:", error);
    }
});

onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log(user.uid);
        if (user.uid === MI_MAIL_ADMIN) {
            // ¡Sos vos! Te dejamos pasar
            loginContainer.style.display = "none";
            panelAdmin.style.display = "block";
            mensajeError.classList.add("oculto");
        } else {
            // Es otra persona con su propio Gmail. Lo echamos.
            await signOut(auth);
            mensajeError.classList.remove("oculto");
        }
    } else {
        // No hay sesión: Mostramos el login, ocultamos el admin
        loginContainer.style.display = "block";
        panelAdmin.style.display = "none";
    }
});

/*formularioLogin.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evita que la página se recargue

    const email = inputEmail.value;
    const password = inputPassword.value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        mensajeError.classList.add("oculto"); // Borramos mensaje de error si había
    } catch (error) {
        console.error("Error de autenticación:", error.code);
        mensajeError.classList.remove("oculto"); // Mostramos mensaje de error
    }
});*/

btnCerrarSesion.addEventListener("click", async () => {
    try {
        await signOut(auth);
        inputEmail.value = ""; // Limpiamos los inputs
        inputPassword.value = "";
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
    }
});

//--------PANEL SORTEO---------//

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