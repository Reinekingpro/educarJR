let avatarSeleccionado = "";
let vozFemenina = null;

// ===== CARGAR VOCES CORRECTAMENTE =====
function cargarVoces() {
  const voces = speechSynthesis.getVoices();

  // 🔥 Buscar voces femeninas en español (nombres reales comunes)
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

  // respaldo: cualquier voz en español
  if (!vozFemenina) {
    vozFemenina = voces.find(v => v.lang.includes("es"));
  }

  console.log("Voz seleccionada:", vozFemenina?.name);
}

// 🔊 importante: esperar que carguen
speechSynthesis.onvoiceschanged = cargarVoces;
cargarVoces();


// ===== FUNCIÓN HABLAR =====
function hablar(texto) {
  speechSynthesis.cancel();

  const mensaje = new SpeechSynthesisUtterance(texto);
  mensaje.lang = "es-ES";

  if (vozFemenina) {
    mensaje.voice = vozFemenina;
  }

  // ajustes para que suene más infantil
  mensaje.pitch = 1.2;
  mensaje.rate = 0.9;

  speechSynthesis.speak(mensaje);
}


// ===== SELECCIONAR AVATAR =====
function seleccionarAvatar(img) {
  let click = document.getElementById("clickSound");
  click.currentTime = 0;
  click.play();

  document.querySelectorAll(".avatars img").forEach(i => {
    i.classList.remove("selected");
  });

  img.classList.add("selected");
  avatarSeleccionado = img.src;

  setTimeout(() => {
    hablar("Muy bien, ya seleccionaste tu avatar");
  }, 200);
}


// ===== VALIDAR =====
function validar(e) {
  e.preventDefault();

  let click = document.getElementById("clickSound");
  let ok = document.getElementById("okSound");

  click.currentTime = 0;
  click.play();

  let nombre = document.getElementById("nombre").value.trim();

  // ❌ SIN NOMBRE
  if (nombre === "") {
    setTimeout(() => {
      hablar("Debes escribir tu nombre");
    }, 300);
    return false;
  }

  // ❌ SIN AVATAR
  if (avatarSeleccionado === "") {
    setTimeout(() => {
      hablar("Debes seleccionar un avatar");
    }, 300);
    return false;
  }

  // ✅ TODO OK
  ok.currentTime = 0;
  ok.play();

  setTimeout(() => {
    hablar("Hola " + nombre);
  }, 300);

  confetti({
    particleCount: 300,
    spread: 120
  });

  localStorage.setItem("nombre", nombre);
  localStorage.setItem("avatar", avatarSeleccionado);

  setTimeout(() => {
    window.location.href = "bienvenida.html";
  }, 2000);

  return false;
}