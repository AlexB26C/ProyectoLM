// Variables globales
let items = [];

// Función para calcular días restantes
function diasRestantes(fecha) {
    return Math.ceil((new Date(fecha) - new Date()) / (1000 * 60 * 60 * 24));
}

// Obtener y guardar items desde localStorage
function obtenerItems() {
    const datos = localStorage.getItem("items");
    if (datos == null){
        return [];
    } else {
        return JSON.parse(datos)
    }
}

function guardarItems() {
    localStorage.setItem("items", JSON.stringify(items));
}

// Cargar items globalmente
function cargarItems() {
    items = obtenerItems();
}

// Renderizar lista principal según tipoFijo y usuarioActual
function render() {
    const lista = document.getElementById("lista");
    if (!lista) return;

    lista.innerHTML = "";
    const usuarioActual = localStorage.getItem("usuarioActual");

    items.forEach(item => {
        if (item.usuario !== usuarioActual || item.tipo !== tipoFijo) return;

        const li = document.createElement("li");

        // Nombre y fecha
        const fechaEntrega = new Date(item.fecha);
        const diferencia = diasRestantes(item.fecha);
        const fechaFormateada = fechaEntrega.toLocaleDateString('es-ES');


        // Crear una nueva tarea, examen, proyecto en cada pagina
        const nombreDiv = document.createElement("div");
        nombreDiv.textContent = item.nombre;
        nombreDiv.style.cursor = "pointer";
        nombreDiv.addEventListener("click", () => abrirModal(item));

        const fechaDiv = document.createElement("div");
        fechaDiv.textContent = `${fechaFormateada} (${diferencia >= 0 ? "Faltan " + diferencia + " días" : "Vencido"})`;

        const resumen = document.createElement("div");
        resumen.appendChild(nombreDiv);
        resumen.appendChild(fechaDiv);

        if (item.completado) nombreDiv.style.textDecoration = "line-through";

        // Botones
        const botonCompletar = document.createElement("button");
        botonCompletar.textContent = "✔";
        botonCompletar.onclick = e => {
            e.stopPropagation();
            item.completado ? descompletar(item.id) : completar(item.id);
        };

        const botonBorrar = document.createElement("button");
        botonBorrar.textContent = "🗑";
        botonBorrar.onclick = e => {
            e.stopPropagation();
            borrarItem(item.id);
        };

        li.appendChild(resumen);
        li.appendChild(botonCompletar);
        li.appendChild(botonBorrar);

        lista.appendChild(li);
    });
}

// Completar, descompletar, borrar
function completar(id) {
    const item = items.find(i => i.id == id);
    if (item) item.completado = true;
    guardarItems();
    render();
}

function descompletar(id) {
    const item = items.find(i => i.id == id);
    if (item) item.completado = false;
    guardarItems();
    render();
}

function borrarItem(id) {
    items = items.filter(i => i.id != id);
    guardarItems();
    render();
}

// Abrir y cerrar pestana de añadir item
function abrirPestana() {
    tipoActual = tipoFijo;
    const titulo = document.getElementById("tituloAñadirItem");
    const pestana = document.getElementById("añadirItem");
    if (titulo) titulo.textContent = "Agregar " + tipoFijo;
    if (pestana) pestana.style.display = "block";
}

function cerrarPestana() {
    const pestana = document.getElementById("añadirItem");
    if (pestana) pestana.style.display = "none";
}

// Agregar nuevo item
function agregarItem() {
    const nombreInput = document.getElementById("nombre");
    const fechaInput = document.getElementById("fecha");
    if (!nombreInput || !fechaInput) return;

    const nombre = nombreInput.value.trim();
    const fecha = fechaInput.value;

    if (!nombre || !fecha) {
        alert("Completa todos los campos para añadir una tarea");
        return;
    }

    const usuarioActual = localStorage.getItem("usuarioActual");

    const nuevoItem = {
        id: Date.now(),
        nombre,
        fecha,
        tipo: tipoFijo,
        completado: false,
        usuario: usuarioActual
    };

    items.push(nuevoItem);
    guardarItems();
    render();
    cerrarPestana();
}

// Abrir modal
function abrirModal(item) {
    const fechaEntrega = new Date(item.fecha);
    const diferencia = diasRestantes(item.fecha);
    const fechaFormateada = fechaEntrega.toLocaleDateString('es-ES');

    const modal = document.getElementById("pestanaLista");
    if (!modal) return;

    const titulo = document.getElementById("pestanaListaTitulo");
    const fechaDiv = document.getElementById("pestanaListaFecha");
    const diasDiv = document.getElementById("pestanaListaDias");

    if (titulo) titulo.textContent = item.nombre;
    if (fechaDiv) fechaDiv.textContent = "Fecha: " + fechaFormateada;
    if (diasDiv) diasDiv.textContent = diferencia >= 0 ? "Faltan " + diferencia + " días" : "Vencido";

    modal.style.display = "flex";
}

// Cerrar modal
const cerrarModalBtn = document.getElementById("cerrarPestanaLista");
if (cerrarModalBtn) {
    cerrarModalBtn.onclick = () => {
        const modal = document.getElementById("pestanaLista");
        if (modal) modal.style.display = "none";
    };
}

window.onclick = function(e) {
    const modal = document.getElementById("pestanaLista");
    if (modal && e.target === modal) {
        modal.style.display = "none";
    }
};

// Mostrar resumen
function mostrarProximos(itemsList, tipo, id, limite) {
    const lista = document.getElementById(id);
    if (!lista) return;

    lista.innerHTML = "";

    const usuarioActual = localStorage.getItem("usuarioActual");
    let filtrados = itemsList.filter(i => i.usuario === usuarioActual && i.tipo === tipo);

    filtrados.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    filtrados.slice(0, limite).forEach(item => {
        const diferencia = diasRestantes(item.fecha);
        if (diferencia < 0 || item.completado) return;

        const li = document.createElement("li");
        const fechaFormateada = new Date(item.fecha).toLocaleDateString('es-ES');
        li.innerHTML = `<strong>${item.nombre}</strong><br>${fechaFormateada} (Faltan ${diferencia} días)`;

        if (diferencia <= 3) li.style.backgroundColor = "#ff5148";
        else if (diferencia <= 5) li.style.backgroundColor = "#f8a735";
        else li.style.backgroundColor = "#8aff8a";

        lista.appendChild(li);
    });
}

// Inicialización
window.addEventListener("load", () => {
    const usuarioActual = localStorage.getItem("usuarioActual");
    if (!usuarioActual) {
        window.location.href = "login.html";
        return;
    }

    cargarItems();
    render();

    mostrarProximos(items, "Examen", "resumenExamenes", 6);
    mostrarProximos(items, "Proyecto", "resumenProyectos", 6);
    mostrarProximos(items, "Tarea", "resumenTareas", 6);
});