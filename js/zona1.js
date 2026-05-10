let nombre = localStorage.getItem("nombre").toUpperCase();
let avatar = localStorage.getItem("avatar");

document.getElementById("saludo").innerText = "Bienvenido " + nombre;
document.getElementById("avatar").src = avatar;

let vozFemenina = null;

// ===== CARGAR VOCES =====
function cargarVoces() {
  const voces = speechSynthesis.getVoices();

  vozFemenina = voces.find(v => 
    v.lang.includes("es") &&
    (
      v.name.includes("Helena") ||
      v.name.includes("Laura") ||
      v.name.includes("Sofia") ||
      v.name.includes("Sabina") ||
      v.name.toLowerCase().includes("female")
    )
  );

  // respaldo si no encuentra femenina
  if (!vozFemenina) {
    vozFemenina = voces.find(v => v.lang.includes("es"));
  }
}

// esperar que carguen voces
speechSynthesis.onvoiceschanged = cargarVoces;
cargarVoces();

// ===== HABLAR =====
function hablarBienvenida() {
  speechSynthesis.cancel();

  let mensaje = new SpeechSynthesisUtterance(
    "Bienvenido " + nombre + ", estás listo para aprender a contar del 1 al 5"
  );

  mensaje.lang = "es-ES";

  if (vozFemenina) {
    mensaje.voice = vozFemenina;
  }

  mensaje.pitch = 1.2; // tono más femenino
  mensaje.rate = 0.9;  // más lento (niños)

  speechSynthesis.speak(mensaje);
}

// pequeño retraso para asegurar carga
setTimeout(hablarBienvenida, 600);