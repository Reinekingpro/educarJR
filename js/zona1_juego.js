let numeroActual = 1;
let aciertos = 0;

// ===== SONIDO =====
function sonidoNumero(num) {
    let audio = new Audio(`sonidos/${num}.mp3`);
    audio.play();
}

// ===== VOZ =====
function hablarNumero(num) {

    const palabras = {
        1: "uno",
        2: "dos",
        3: "tres",
        4: "cuatro",
        5: "cinco"
    };

    speechSynthesis.cancel();

    let mensaje = new SpeechSynthesisUtterance(palabras[num]);
    mensaje.lang = "es-ES";

    if (typeof vozFemenina !== "undefined" && vozFemenina) {
        mensaje.voice = vozFemenina;
    }

    mensaje.rate = 0.9;
    mensaje.pitch = 1.2;

    speechSynthesis.speak(mensaje);
}

// ===== CONFETI + SONIDO =====
function lanzarConfeti() {
    confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 }
    });

    let ok = document.getElementById("okSound");
    if (ok) {
        ok.currentTime = 0;
        ok.play();
    }
}

// ===== ESTRELLAS =====
function mostrarEstrellas() {
    let estrellas = "";

    if (aciertos === 5) estrellas = "⭐⭐⭐";
    else if (aciertos >= 3) estrellas = "⭐⭐";
    else estrellas = "⭐";

    document.getElementById("estrellas").innerText = estrellas;
}

// ===== REINICIAR JUEGO =====
function reiniciarJuego() {

    numeroActual = 1;
    aciertos = 0;

    document.querySelectorAll(".cuadro").forEach(cuadro => {
        cuadro.innerText = "";
        cuadro.classList.remove("activo");
    });

    document.getElementById("estrellas").innerText = "";

    document.getElementById("btnSiguiente").style.display = "none";
    document.getElementById("btnReiniciar").style.display = "none";

    let mensaje = new SpeechSynthesisUtterance("Intentemos de nuevo");
    mensaje.lang = "es-ES";
    speechSynthesis.speak(mensaje);
}

// ===== CLICK CUADROS =====
document.querySelectorAll(".cuadro").forEach(cuadro => {
    cuadro.addEventListener("click", function () {

        let num = parseInt(this.dataset.num);

        if (num !== numeroActual) return;

        this.innerText = num;
        this.classList.add("activo");

        hablarNumero(num);
        sonidoNumero(num);

        aciertos++;
        numeroActual++;

        if (numeroActual > 5) {
            lanzarConfeti();
            mostrarEstrellas();

            document.getElementById("btnSiguiente").style.display = "inline-block";
            document.getElementById("btnReiniciar").style.display = "inline-block";
        }
    });
});

// ===== BOTÓN SIGUIENTE =====
document.getElementById("btnSiguiente").addEventListener("click", function () {

    let nombre = localStorage.getItem("nombre") || "amigo";

    lanzarConfeti();

    let mensaje = new SpeechSynthesisUtterance(
        "Muy bien " + nombre + ", lo hiciste excelente, vamos al otro nivel"
    );

    mensaje.lang = "es-ES";

    if (typeof vozFemenina !== "undefined" && vozFemenina) {
        mensaje.voice = vozFemenina;
    }

    speechSynthesis.speak(mensaje);

    setTimeout(() => {
        window.location.href = "juego2.html";
    }, 2500);
});

// ===== BOTÓN REINICIAR =====
document.getElementById("btnReiniciar").addEventListener("click", function () {
    reiniciarJuego();
});