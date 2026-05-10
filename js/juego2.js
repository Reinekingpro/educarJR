let dragged = null;
let offsetX = 0;
let offsetY = 0;

const items = document.querySelectorAll(".item");
const zonas = document.querySelectorAll(".dropzone");

// Guardar respuestas
let respuestas = {};

// Guardar origen de cada pieza
let origen = new Map();
items.forEach(item => {
    origen.set(item, item.parentElement);
});

// Eventos de inicio
items.forEach(item => {
    item.addEventListener("mousedown", start);
    item.addEventListener("touchstart", start, { passive: false });
});

function start(e) {
    e.preventDefault();

    dragged = e.target;

    const rect = dragged.getBoundingClientRect();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    offsetX = clientX - rect.left;
    offsetY = clientY - rect.top;

    document.body.appendChild(dragged);

    dragged.style.position = "absolute";
    dragged.style.left = rect.left + "px";
    dragged.style.top = rect.top + "px";
    dragged.style.zIndex = 1000;
}

// Movimiento
document.addEventListener("mousemove", move);
document.addEventListener("touchmove", move, { passive: false });

function move(e) {
    if (!dragged) return;

    e.preventDefault();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    dragged.style.left = (clientX - offsetX) + "px";
    dragged.style.top = (clientY - offsetY) + "px";
}

// Soltar
document.addEventListener("mouseup", end);
document.addEventListener("touchend", end);

function end(e) {
    if (!dragged) return;

    const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;

    dragged.style.pointerEvents = "none";
    let zona = document.elementFromPoint(clientX, clientY);
    dragged.style.pointerEvents = "auto";

    if (zona && zona.classList.contains("dropzone")) {

        const zonaID = zona.getAttribute("data-num");

        // 🔥 Si ya hay una pieza, devolverla
        const existente = zona.querySelector(".item");
        if (existente && existente !== dragged) {
            const contenedorOriginal = origen.get(existente);
            contenedorOriginal.appendChild(existente);

            existente.style.position = "static";
            existente.style.left = "";
            existente.style.top = "";
        }

        // 🔥 Insertar pieza en la zona
        zona.appendChild(dragged);

        dragged.style.position = "static";
        dragged.style.left = "";
        dragged.style.top = "";

        // Guardar respuesta
        respuestas[zonaID] = dragged.textContent;
    }

    dragged = null;
}

// 🔥 Verificar al final
function verificar() {
    let correcto = true;

    zonas.forEach(zona => {
        const esperado = zona.getAttribute("data-num");
        const respuesta = respuestas[esperado];

        if (respuesta !== esperado) {
            correcto = false;
        }
    });

    if (correcto) {
        document.getElementById("okSound").play();
        alert("🎉 ¡Muy bien! Todo correcto");
    } else {
        alert("❌ Intenta de nuevo");

        respuestas = {};

        // 🔥 Volver todo a su origen correctamente
        items.forEach(item => {
            const contenedorOriginal = origen.get(item);
            contenedorOriginal.appendChild(item);

            item.style.position = "static";
            item.style.left = "";
            item.style.top = "";
        });
    }
}