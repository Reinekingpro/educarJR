let avatarSeleccionado = "";
let vozLista = null;

// 🔊 cargar voces (MEJORADO)
function cargarVoces() {
    const voces = speechSynthesis.getVoices();
    if (!voces.length) return;

    console.log("Voces disponibles:", voces);

    // 🔥 PRIORIDAD: voces femeninas conocidas en español
    vozLista = voces.find(v =>
        v.name.includes("Google español") || 
        v.name.includes("Microsoft Sabina") ||
        v.name.includes("Paulina") ||
        v.name.toLowerCase().includes("female")
    );

    // 🟡 alternativa: cualquier voz en español
    if (!vozLista) {
        vozLista = voces.find(v => v.lang.toLowerCase().includes("es"));
    }

    // 🔴 última opción
    if (!vozLista) {
        vozLista = voces[0];
    }
}

// cargar voces correctamente
speechSynthesis.onvoiceschanged = cargarVoces;
cargarVoces();


// 🔊 sonido
function sonido(id) {
    const audio = document.getElementById(id);
    if (!audio) return;
    audio.currentTime = 0;
    audio.play();
}


// 🧑 personaje habla (voz más femenina)
function hablarConPersonaje(texto) {

    const burbuja = document.getElementById("burbuja");
    const personaje = document.getElementById("imgPersonaje");

    burbuja.style.display = "block";
    burbuja.textContent = texto;

    personaje.classList.add("hablando");

    speechSynthesis.cancel();

    const mensaje = new SpeechSynthesisUtterance(texto);

    mensaje.lang = "es-ES";
    mensaje.voice = vozLista;

    // 🔥 AJUSTES IMPORTANTES
    mensaje.rate = 0.85;   // más lento (mejor para niños)
    mensaje.pitch = 1.5;   // 👈 más agudo = más femenino/infantil
    mensaje.volume = 1;

    mensaje.onend = () => {
        personaje.classList.remove("hablando");
        setTimeout(() => {
            burbuja.style.display = "none";
        }, 1200);
    };

    speechSynthesis.speak(mensaje);
}


// 👤 seleccionar avatar
function seleccionarAvatar(img) {
    sonido("clickSound");

    document.querySelectorAll(".avatar").forEach(a => a.classList.remove("seleccionado"));
    img.classList.add("seleccionado");

    avatarSeleccionado = img.src;

    document.getElementById("mensaje").textContent = "";

    hablarConPersonaje("Muy bien, avatar seleccionado");
}


// ✏ escribir nombre
document.getElementById("nombre").addEventListener("input", () => {
    sonido("clickSound");
    document.getElementById("mensaje").textContent = "";
});


// 🚀 entrar
function entrar() {
    const nombre = document.getElementById("nombre").value.trim();
    const mensaje = document.getElementById("mensaje");

    if (nombre === "" && avatarSeleccionado === "") {
        mensaje.textContent = "👀 Escribe tu nombre y elige un avatar";
        hablarConPersonaje("Hola, escribe tu nombre y elige un avatar");
        return;
    }

    if (nombre === "") {
        mensaje.textContent = "✏️ Escribe tu nombre";
        hablarConPersonaje("Por favor, escribe tu nombre");
        return;
    }

    if (avatarSeleccionado === "") {
        mensaje.textContent = "🧑 Elige un avatar";
        hablarConPersonaje("Ups, debes elegir un avatar");
        return;
    }

    mensaje.textContent = "🎉 ¡Muy bien!";
    sonido("okSound");

    localStorage.setItem("nombre", nombre);
    localStorage.setItem("avatar", avatarSeleccionado);
    localStorage.setItem("puntos", 0);

    confetti({
        particleCount: 350,
        spread: 100
    });

    hablarConPersonaje("Muy bien " + nombre + ", vamos a jugar");

    setTimeout(() => {
        window.location.href = "menu.html";
    }, 2000);
}