/**
 * FIREBASE MOTOR - GRAND LINE HEARTS
 * Estación central de sincronización en tiempo real.
 */

// Importamos Firebase directamente desde los servidores de Google para la web
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, doc, onSnapshot, setDoc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Tus credenciales oficiales
const firebaseConfig = {
  apiKey: "AIzaSyCYNE5qulm9_onb-YPkW8Ttj7-gjy7VLgY",
  authDomain: "granlineapp.firebaseapp.com",
  projectId: "granlineapp",
  storageBucket: "granlineapp.firebasestorage.app",
  messagingSenderId: "692047589666",
  appId: "1:692047589666:web:6b7d3edfd4be5160adb57b"
};

// 1. Inicializamos la conexión topográfica
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// 2. Establecemos el Punto de Control (Un solo documento para ambos)
export const docPartida = doc(db, "viaje", "nuestra_ruta");

// 3. Función para inicializar el terreno si está vacío
export async function asegurarDocumentoNube() {
    const snap = await getDoc(docPartida);
    
    if (!snap.exists()) {
        // Estado base de la partida
        await setDoc(docPartida, {
            jugador1_berries: 500,
            jugador2_berries: 500,
            millas_totales: 0,
            reto_actual: null,
            estado_reto: "inactivo", // Puede ser: "inactivo", "en_progreso", "pendiente_validacion"
            turno_de: null // Quién tiene que cumplir el reto
        });
        console.log("Terreno de juego inicializado en la nube.");
    }
}
