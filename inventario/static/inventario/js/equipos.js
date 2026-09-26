const API_URL = "/api/equipos/";
// ==================== EQUIPOS ====================

async function cargarEquipos() {
    const res = await fetch(API_URL, {
        cache: "no-store"
    });
    const equipos = await res.json();

    dibujarTabla(equipos);
    dibujarResumen(equipos);
    actualizarNotificaciones(equipos);
}

function dibujarResumen(equipos) {
    const resumen = {
        Disponible: equipos.filter(e => e.estado === "Disponible").length,
        Prestado: equipos.filter(e => e.estado === "Prestado").length,
        "En mantenimiento": equipos.filter(e => e.estado === "En mantenimiento").length,
        "Dado de baja": equipos.filter(e => e.estado === "Dado de baja").length,
        "En uso": equipos.filter(e => e.estado === "En uso").length
    };

    const colores = {
        Disponible: "success",
        Prestado: "warning",
        "En mantenimiento": "primary",
        "Dado de baja": "danger",
        "En uso": "secondary"
    };

    const iconos = {
        Disponible: "bi-check-circle",
        Prestado: "bi-person-check",
        "En mantenimiento": "bi-tools",
        "Dado de baja": "bi-x-circle",
        "En uso": "bi-laptop"
    };

    const contenedor = document.getElementById("resumenEstados");
    contenedor.innerHTML = "";

    Object.entries(resumen).forEach(([estado, cantidad]) => {
        contenedor.innerHTML += `
            <div class="col-md-2">
                <div class="card bg-${colores[estado]} text-white text-center">
                    <div class="card-body py-3">
                        <i class="bi ${iconos[estado]} fs-2"></i>
                        <h3 class="mb-0">${cantidad}</h3>
                        <small>${estado}</small>
                    </div>
                </div>
            </div>
        `;
    });
}

function getClaseEstado(estado) {
    const clases = {
        "Disponible": "estado-disponible",
        "Prestado": "estado-prestado",
        "En mantenimiento": "estado-mantenimiento",
        "Dado de baja": "estado-baja",
        "En uso": "estado-enuso"
    };

    return clases[estado] || "";
}

function dibujarTabla(equipos) {
    const tbody = document.getElementById("tablaEquipos");
    tbody.innerHTML = "";

    if (equipos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="11" class="text-center text-muted">
                    No hay equipos registrados
                </td>
            </tr>
        `;
        return;
    }

    equipos.forEach(eq => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td><strong>${eq.codigo}</strong></td>
            <td>${eq.nombre}</td>
            <td>${eq.marca || "-"} / ${eq.modelo || "-"}</td>
            <td>${eq.categoria || "-"}</td>
            <td>
                <span class="badge ${getClaseEstado(eq.estado)} px-2 py-1">
                    ${eq.estado}
                </span>
            </td>
            <td>${eq.ubicacion || "-"}</td>
            <td>${eq.responsable || "-"}</td>

            <td>
                <strong>${eq.horas_uso || 0} h</strong>
            </td>

            <td>
                ${eq.intervalo_mantenimiento || 500} h
            </td>

            <td>
                ${
                    (eq.horas_uso || 0) >= (eq.intervalo_mantenimiento || 500)
                        ? '<span class="badge bg-danger">🔴 Requiere mantenimiento</span>'
                        : (eq.horas_uso || 0) >= 470
                            ? '<span class="badge bg-warning text-dark">🟡 Próximo</span>'
                            : '<span class="badge bg-success">🟢 Normal</span>'
                }
            </td>

             <td>
                <button class="btn btn-outline-warning btn-sm me-1"
                        title="Editar"
                        onclick="editarEquipo(${eq.id})">
                    <i class="bi bi-pencil-square"></i>
                </button>

                <button class="btn btn-outline-danger btn-sm"
                        title="Eliminar"
                        onclick="abrirModalEliminar('equipos', ${eq.id}, '${eq.nombre}')">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;

        tbody.appendChild(fila);
    });
}

async function guardarEquipo(e) {
    e.preventDefault();

    const id = document.getElementById("equipoId").value;

    const datos = {
        codigo: document.getElementById("codigo").value.trim(),
        nombre: document.getElementById("nombre").value.trim(),
        marca: document.getElementById("marca").value,
        modelo: document.getElementById("modelo").value.trim(),
        serial: document.getElementById("serial").value.trim(),
        categoria: document.getElementById("categoria").value,
        estado: document.getElementById("estado").value,
        ubicacion: document.getElementById("ubicacion").value,
        responsable: document.getElementById("responsable").value,
        observaciones: document.getElementById("observaciones").value.trim(),
        horas_uso: parseInt(document.getElementById("horasUso").value) || 0,
        cantidad_mantenimientos: parseInt(document.getElementById("cantidadMantenimientos").value) || 0,
        intervalo_mantenimiento: parseInt(document.getElementById("intervaloMantenimiento").value) || 500
    };

    const res = await fetch(id ? `${API_URL}${id}/` : API_URL, {
        method: id ? "PUT" : "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    });

    const respuesta = await res.json();

    if (res.ok) {

        bootstrap.Modal
            .getOrCreateInstance(document.getElementById("modalEquipo"))
            .hide();

        limpiarFormulario();
        await cargarEquipos();

        const prueba = await fetch(API_URL, {
            cache: "no-store"
        });

        const equiposPrueba = await prueba.json();
        console.log("EQUIPOS DESPUÉS DE GUARDAR:", equiposPrueba);
        cargarMovimientos();

        mostrarToast(
            id
                ? "Equipo actualizado correctamente"
                : "Equipo creado correctamente",
            "success"
        );

    } else {

    if (respuesta.codigo) {
        mostrarToast("Ya existe un equipo con ese código.", "warning");
    }
    else if (respuesta.serial) {
        mostrarToast("Ya existe un equipo con ese serial.", "warning");
    }
    else if (respuesta.non_field_errors) {
        mostrarToast(respuesta.non_field_errors[0], "warning");
    }
    else if (respuesta.detail) {
        mostrarToast(respuesta.detail, "danger");
    }
    else {
        mostrarToast("Error al guardar el equipo.", "danger");
    }

}
}

function limpiarFormulario() {
    document.getElementById("formEquipo").reset();
    document.getElementById("equipoId").value = "";
    document.getElementById("horasUso").value = 0;
    document.getElementById("cantidadMantenimientos").value = 0;
    document.getElementById("intervaloMantenimiento").value = 500;
    document.getElementById("tituloModal").textContent = "Agregar Equipo";
}

async function editarEquipo(id) {
    const res = await fetch(`${API_URL}${id}/`);
    const eq = await res.json();

    document.getElementById("equipoId").value = eq.id;
    document.getElementById("codigo").value = eq.codigo;
    document.getElementById("nombre").value = eq.nombre;
    document.getElementById("marca").value = eq.marca || "";
    document.getElementById("modelo").value = eq.modelo || "";
    document.getElementById("serial").value = eq.serial || "";
    document.getElementById("categoria").value = eq.categoria || "";
    document.getElementById("estado").value = eq.estado;
    document.getElementById("horasUso").value = eq.horas_uso || 0;
    document.getElementById("cantidadMantenimientos").value =
    eq.cantidad_mantenimientos || 0;
    document.getElementById("intervaloMantenimiento").value = eq.intervalo_mantenimiento || 500;
    document.getElementById("ubicacion").value = eq.ubicacion || "";
    document.getElementById("responsable").value = eq.responsable || "";
    document.getElementById("observaciones").value = eq.observaciones || "";

    document.getElementById("tituloModal").textContent = "Editar Equipo";

    new bootstrap.Modal(document.getElementById("modalEquipo")).show();
}

async function eliminarEquipo(id) {
    if (!confirm("¿Seguro que quieres eliminar este equipo?")) return;

    await fetch(`${API_URL}${id}/`, {
        method: "DELETE"
    });

    cargarEquipos();
}

function aplicarFiltros() {
    const nom = document.getElementById("buscarnombre").value.trim().toLowerCase();
    const cod = document.getElementById("buscarcodigo").value.trim().toLowerCase();
    const ser = document.getElementById("buscarserial").value.trim().toLowerCase();
    const cat = document.getElementById("filtrarcategoria").value;
    const est = document.getElementById("filtrarestado").value;

    fetch(API_URL)
        .then(res => res.json())
        .then(todos => {
            const filtrados = todos.filter(eq =>
                (!nom || (eq.nombre || "").toLowerCase().includes(nom)) &&
                (!cod || (eq.codigo || "").toLowerCase().includes(cod)) &&
                (!ser || (eq.serial || "").toLowerCase().includes(ser)) &&
                (!cat || eq.categoria === cat) &&
                (!est || eq.estado === est)
            );

            dibujarTabla(filtrados);
            dibujarResumen(filtrados);
        });
}

function actualizarNotificaciones(equipos) {
    const lista = document.getElementById("listaNotificaciones");
    const contador = document.getElementById("contadorNotificaciones");

    const alertas = equipos.filter(eq => {
        const horas = eq.horas_uso || 0;
        const limite = eq.intervalo_mantenimiento || 500;

        return horas >= limite;
    });

    lista.innerHTML = "";

    if (alertas.length === 0) {
        lista.innerHTML = `
            <div class="text-center text-muted p-3">
                <i class="bi bi-check-circle text-success fs-3"></i>
                <p class="mb-0 mt-2">No hay notificaciones</p>
            </div>
        `;

        contador.style.display = "none";
        return;
    }

    contador.textContent = alertas.length;
    contador.style.display = "block";

    alertas.forEach(eq => {
        const horas = eq.horas_uso || 0;
        const limite = eq.intervalo_mantenimiento || 500;

        lista.innerHTML += `
            <div class="dropdown-item text-wrap py-3"
                style="cursor: pointer;"
                onclick="irAMantenimiento(${eq.id})">

                <div class="d-flex align-items-start">
                    <i class="bi bi-tools text-danger fs-4 me-2"></i>

                    <div>
                        <strong>Mantenimiento requerido</strong>

                        <div class="small text-muted">
                            El equipo <strong>${eq.nombre}</strong>
                            lleva ${horas} horas de uso y requiere mantenimiento.
                        </div>

                        <div class="small text-primary mt-1">
                            <i class="bi bi-arrow-right-circle"></i>
                            Registrar mantenimiento
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}

function irAMantenimiento(equipoId) {
    const tab = document.getElementById("menu-mantenimientos");

    if (tab) {
        bootstrap.Tab.getOrCreateInstance(tab).show();
    }

    setTimeout(() => {
        const modal = document.getElementById("modalMantenimiento");

        if (modal) {
            bootstrap.Modal
                .getOrCreateInstance(modal)
                .show();
        }

        const select = document.getElementById("mantEquipo");

        if (select) {
            select.value = equipoId;
        }

        document.getElementById("mantenimientoId").value = "";
        document.getElementById("mantTipo").value = "Preventivo";
        document.getElementById("mantEstado").value = "Pendiente";
        document.getElementById("mantFecha").value =
            new Date().toISOString().split("T")[0];

    }, 300);
}

function marcarNotificacionesLeidas() {
    document.getElementById("contadorNotificaciones").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {

    cargarEquipos();

    document
        .getElementById("formEquipo")
        .addEventListener("submit", guardarEquipo);

});