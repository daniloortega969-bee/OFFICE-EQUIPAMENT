let categoriaEditando = null;
let marcaEditando = null;
let eliminarTipo = "";
let eliminarId = null;

// ==================== CATEGORÍAS ====================

async function guardarCategoria() {

    const nom = document.getElementById("nuevaCategoria").value.trim();

    if (!nom) return;

        const res = await fetch("/api/categorias/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ nombre: nom })
    });

    const respuesta = await res.json();

    if (!respuesta.ok) {
        mostrarToast(respuesta.mensaje, "warning");
        return;
    }   

    mostrarToast("Categoría creada correctamente");

    document.getElementById("nuevaCategoria").value = "";

    await listarCategorias();
    await cargarOpciones("/api/categorias/", "filtrarcategoria");
    await cargarOpciones("/api/categorias/", "categoria");
}

async function listarCategorias() {

    const res = await fetch("/api/categorias/");
    const datos = await res.json();

    document.getElementById("listaCategorias").innerHTML =
        datos.map(c => `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                ${c.nombre}
                <div>
                    <div>
                        <button class="btn btn-outline-warning btn-sm me-1"
                                title="Editar"
                                onclick="editarCategoria(${c.id}, '${c.nombre}')">
                            <i class="bi bi-pencil-square"></i>
                        </button>

                        <button class="btn btn-outline-danger btn-sm"
                                title="Eliminar"
                                onclick="abrirModalEliminar('categorias', ${c.id}, '${c.nombre}')">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </li>
        `).join("");
}

async function guardarMarca() {

    const nom = document.getElementById("nuevaMarca").value.trim();

    if (!nom) return;

    const res = await fetch("/api/marcas/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ nombre: nom })
    });

    const respuesta = await res.json();

    if (!respuesta.ok) {
        mostrarToast(respuesta.mensaje, "warning");
        return;
    }

    mostrarToast("Marca creada correctamente");

    document.getElementById("nuevaMarca").value = "";

    listarMarcas();
    cargarOpciones("/api/marcas/", "marca");
}

async function guardarUbicacion() {

    const nom = document.getElementById("nuevaUbicacion").value.trim();

    if (!nom) return;

    const res = await fetch("/api/ubicaciones/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ nombre: nom })
    });

    const respuesta = await res.json();

    if (!respuesta.ok) {
        mostrarToast(respuesta.mensaje, "warning");
        return;
    }

    mostrarToast("Ubicación creada correctamente");

    document.getElementById("nuevaUbicacion").value = "";

    listarUbicaciones();
    cargarOpciones("/api/ubicaciones/", "ubicacion");
}

async function guardarResponsable() {

    const nom = document.getElementById("nuevoResponsable").value.trim();

    if (!nom) return;

    const res = await fetch("/api/responsables/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ nombre: nom })
    });

    const respuesta = await res.json();

    if (!respuesta.ok) {
        mostrarToast(respuesta.mensaje, "warning");
        return;
    }

    mostrarToast("Responsable creado correctamente");

    document.getElementById("nuevoResponsable").value = "";

    listarResponsables();
    cargarOpciones("/api/responsables/", "responsable");
}
// ==================== MARCAS ====================

async function listarMarcas() {

    const res = await fetch("/api/marcas/");
    const datos = await res.json();

    document.getElementById("listaMarcas").innerHTML =
        datos.map(m => `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                ${m.nombre}
                <div>
                    <button class="btn btn-outline-warning btn-sm me-1"
                        title="Editar"
                        onclick="editarMarca(${m.id}, '${m.nombre}')">
                        <i class="bi bi-pencil-square"></i>
                    </button>

                    <button class="btn btn-outline-danger btn-sm"
                        title="Eliminar"
                        onclick="abrirModalEliminar('marcas', ${m.id}, '${m.nombre}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </li>
        `).join("");
}
// ==================== UBICACIONES ====================

async function listarUbicaciones() {

    const res = await fetch("/api/ubicaciones/");
    const datos = await res.json();

    document.getElementById("listaUbicaciones").innerHTML =
        datos.map(u => `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                ${u.nombre}
                <div>
                    <button class="btn btn-outline-warning btn-sm me-1"
                        title="Editar"
                        onclick="editarUbicacion(${u.id}, '${u.nombre}')">
                        <i class="bi bi-pencil-square"></i>
                    </button>

                    <button class="btn btn-outline-danger btn-sm"
                        title="Eliminar"
                        onclick="abrirModalEliminar('ubicaciones', ${u.id}, '${u.nombre}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </li>
        `).join("");
}

// ==================== RESPONSABLES ====================

async function listarResponsables() {

    const res = await fetch("/api/responsables/");
    const datos = await res.json();

    document.getElementById("listaResponsables").innerHTML =
        datos.map(r => `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                ${r.nombre}
                <div>
                    <button class="btn btn-outline-warning btn-sm me-1"
                        title="Editar"
                        onclick="editarResponsable(${r.id}, '${r.nombre}')">
                        <i class="bi bi-pencil-square"></i>
                    </button>

                    <button class="btn btn-outline-danger btn-sm"
                        title="Eliminar"
                        onclick="abrirModalEliminar('responsables', ${r.id}, '${r.nombre}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </li>
        `).join("");
}

async function editarCategoria(id, nombreActual) {

    document.getElementById("categoriaId").value = id;
    document.getElementById("categoriaNombre").value = nombreActual;

    const modal = new bootstrap.Modal(
        document.getElementById("modalCategoria")
    );

    modal.show();
}

async function guardarEdicionCategoria() {

    const id = document.getElementById("categoriaId").value;
    const nombre = document.getElementById("categoriaNombre").value.trim();

    if (!nombre) return;

    await fetch("/api/categorias/", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: id,
            nombre: nombre
        })
    });

    mostrarToast("Categoría actualizada correctamente", "primary");

    bootstrap.Modal.getInstance(
        document.getElementById("modalCategoria")
    ).hide();

    listarCategorias();
}
async function eliminarCategoria(id) {

    if (!confirm("¿Desea eliminar esta categoría?")) return;

    await fetch("/api/categorias/", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: id
        })
    });

    listarCategorias();
}

// ==================== MARCAS ====================

async function editarMarca(id, nombreActual) {

    document.getElementById("marcaId").value = id;
    document.getElementById("marcaNombre").value = nombreActual;

    new bootstrap.Modal(
        document.getElementById("modalMarca")
    ).show();
}

async function guardarEdicionMarca() {

    const id = document.getElementById("marcaId").value;
    const nombre = document.getElementById("marcaNombre").value.trim();

    if (!nombre) return;

    await fetch("/api/marcas/", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id, nombre })
    });

    mostrarToast("Marca actualizada correctamente", "primary");

    bootstrap.Modal.getInstance(
        document.getElementById("modalMarca")
    ).hide();

    listarMarcas();
}

// ==================== UBICACIONES ====================

async function editarUbicacion(id, nombreActual) {

    document.getElementById("ubicacionId").value = id;
    document.getElementById("ubicacionNombre").value = nombreActual;

    new bootstrap.Modal(
        document.getElementById("modalUbicacion")
    ).show();
}

async function guardarEdicionUbicacion() {

    const id = document.getElementById("ubicacionId").value;
    const nombre = document.getElementById("ubicacionNombre").value.trim();

    if (!nombre) return;

    await fetch("/api/ubicaciones/", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id, nombre })
    });

    mostrarToast("Ubicación actualizada correctamente", "primary");

    bootstrap.Modal.getInstance(
        document.getElementById("modalUbicacion")
    ).hide();

    listarUbicaciones();
}

// ==================== RESPONSABLES ====================

async function editarResponsable(id, nombreActual) {

    document.getElementById("responsableId").value = id;
    document.getElementById("responsableNombre").value = nombreActual;

    new bootstrap.Modal(
        document.getElementById("modalResponsable")
    ).show();
}
async function guardarEdicionResponsable() {

    const id = document.getElementById("responsableId").value;
    const nombre = document.getElementById("responsableNombre").value.trim();

    if (!nombre) return;

    await fetch("/api/responsables/", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id, nombre })
    });

    mostrarToast("Responsable actualizado correctamente", "primary");

    bootstrap.Modal.getInstance(
        document.getElementById("modalResponsable")
    ).hide();

    listarResponsables();
}

function abrirModalEliminar(tipo, id, nombre) {

    eliminarTipo = tipo;
    eliminarId = id;

    document.getElementById("mensajeEliminar").innerHTML =
        `¿Está seguro de eliminar <strong>${nombre}</strong>?`;

    new bootstrap.Modal(
        document.getElementById("modalEliminar")
    ).show();
}

async function confirmarEliminar() {

    let url = `/api/${eliminarTipo}/`;

    if (eliminarTipo === "equipos") {
        url = `/api/equipos/${eliminarId}/`;
    }

    if (eliminarTipo === "mantenimientos") {
        url = `/api/mantenimientos/${eliminarId}/`;
    }

    const res = await fetch(url, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: eliminarTipo === "equipos"
            ? null
            : JSON.stringify({
                id: eliminarId
            })
    });

    if (!res.ok) {
        mostrarToast("No fue posible eliminar el registro", "danger");
        return;
    }

    mostrarToast("Registro eliminado correctamente", "danger");

    bootstrap.Modal.getInstance(
        document.getElementById("modalEliminar")
    ).hide();

    switch (eliminarTipo) {

        case "categorias":
            listarCategorias();
            break;

        case "marcas":
            listarMarcas();
            break;

        case "ubicaciones":
            listarUbicaciones();
            break;

        case "responsables":
            listarResponsables();
            break;

        case "equipos":
            cargarEquipos();
            break;
        case "mantenimientos":
            cargarMantenimientos();
            break;
                    
    }
}
function mostrarToast(mensaje, tipo = "success") {

    const contenedor = document.getElementById("contenedorToast");

    const toast = document.createElement("div");

    toast.className = `toast align-items-center text-bg-${tipo} border-0`;

    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${mensaje}
            </div>
            <button type="button"
                    class="btn-close btn-close-white me-2 m-auto"
                    data-bs-dismiss="toast">
            </button>
        </div>
    `;

    contenedor.appendChild(toast);

    const bsToast = new bootstrap.Toast(toast,{
        delay:2500
    });

    bsToast.show();

    toast.addEventListener("hidden.bs.toast",()=>{
        toast.remove();
    });
}