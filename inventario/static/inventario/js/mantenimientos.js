const MANTENIMIENTOS_URL = "/api/mantenimientos/";

async function cargarMantenimientos() {
    
    const res = await fetch(MANTENIMIENTOS_URL);
    const datos = await res.json();

    const tbody = document.getElementById("tablaMantenimientos");

    tbody.innerHTML = "";

    if (datos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">
                    No hay mantenimientos registrados
                </td>
            </tr>
        `;
        return;
    }

    datos
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .forEach(m => {

            tbody.innerHTML += `
                <tr>
                    <td>${m.fecha}</td>

                    <td>${m.equipo_nombre}</td>

                    <td>${m.tipo}</td>

                    <td>${m.estado}</td>

                    <td>${m.tecnico}</td>

                    <td>
                        <button class="btn btn-outline-primary btn-sm me-1"
                                title="Ver detalles"
                                onclick="verDetallesMantenimiento(${m.id})">
                            <i class="bi bi-eye"></i>
                        </button>

                        <button class="btn btn-outline-warning btn-sm me-1"
                                title="Editar"
                                onclick="editarMantenimiento(${m.id})">
                            <i class="bi bi-pencil-square"></i>
                        </button>

                        <button class="btn btn-outline-danger btn-sm"
                                title="Eliminar"
                                onclick="abrirModalEliminar('mantenimientos', ${m.id}, '${m.equipo_nombre}')">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

}

async function cargarEquiposMantenimiento() {

   
    const res = await fetch("/api/equipos/");
    const equipos = await res.json();

    const select = document.getElementById("mantEquipo");

    select.innerHTML = "";

    equipos.forEach(eq => {
        select.innerHTML += `
            <option value="${eq.id}">
                ${eq.codigo} - ${eq.nombre}
            </option>
        `;
    });

}

async function verDetallesMantenimiento(id) {
    const res = await fetch(`${MANTENIMIENTOS_URL}${id}/`);
    const m = await res.json();

    document.getElementById("detalleEquipo").textContent = m.equipo_nombre;
    document.getElementById("detalleTipo").textContent = m.tipo;
    document.getElementById("detalleEstado").textContent = m.estado;
    document.getElementById("detalleFecha").textContent = m.fecha;
    document.getElementById("detalleTecnico").textContent = m.tecnico;
    document.getElementById("detalleCosto").textContent = `$${m.costo}`;
    document.getElementById("detalleDescripcion").textContent =
        m.descripcion || "Sin descripción";
    document.getElementById("detalleObservaciones").textContent =
        m.observaciones || "Sin observaciones";

    bootstrap.Modal
        .getOrCreateInstance(
            document.getElementById("modalDetallesMantenimiento")
        )
        .show();
}

async function guardarMantenimiento(e) {
    e.preventDefault();

    const form = document.getElementById("formMantenimiento");

    const datos = {
        equipo: document.getElementById("mantEquipo").value,
        tipo: document.getElementById("mantTipo").value,
        estado: document.getElementById("mantEstado").value,
        fecha: document.getElementById("mantFecha").value,
        tecnico: document.getElementById("mantTecnico").value,
        descripcion: document.getElementById("mantDescripcion").value,
        observaciones: document.getElementById("mantObservaciones").value,
        costo: document.getElementById("mantCosto").value
    };

    try {
        const id = document.getElementById("mantenimientoId").value;

        const res = await fetch(
            id ? `${MANTENIMIENTOS_URL}${id}/` : MANTENIMIENTOS_URL,
            {
                method: id ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datos)
            }
        );

        if (!res.ok) {
            const error = await res.text();
            alert(error);
            return;
        }

        // Si el mantenimiento quedó FINALIZADO,
        // guardamos las horas actuales como último mantenimiento.
        console.log("ESTADO DEL MANTENIMIENTO:", datos.estado);
        if (datos.estado === "Finalizado") {

            const equipoRes = await fetch(
                `/api/equipos/${datos.equipo}/`
            );

            const equipo = await equipoRes.json();

            const actualizarEquipoRes = await fetch(
                `/api/equipos/${datos.equipo}/`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        horas_uso: 0,
                        horas_ultimo_mantenimiento: 0,
                        cantidad_mantenimientos:
                            (equipo.cantidad_mantenimientos || 0) + 1
                    })
                }
            );

            if (!actualizarEquipoRes.ok) {
                const error = await actualizarEquipoRes.text();
                console.error("ERROR ACTUALIZANDO EQUIPO:", error);
                alert("El mantenimiento se creó, pero no se pudo actualizar el equipo.");
                return;
            }
        }

        bootstrap.Modal
            .getOrCreateInstance(
                document.getElementById("modalMantenimiento")
            )
            .hide();

        form.reset();

        await cargarMantenimientos();

        // Actualiza equipos, horas y notificaciones
        await cargarEquipos();

        mostrarToast(
            id
                ? "Mantenimiento actualizado correctamente"
                : "Mantenimiento creado correctamente",
            "success"
        );

    } catch (err) {

        console.error(err);
        alert("Error de conexión con el servidor.");
    }
}

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("formMantenimiento");

    if (form) {
        form.addEventListener("submit", guardarMantenimiento);
    }

});

async function editarMantenimiento(id) {

    const res = await fetch(`${MANTENIMIENTOS_URL}${id}/`);
    const m = await res.json();

    document.getElementById("mantenimientoId").value = m.id;
    document.getElementById("mantEquipo").value = m.equipo;
    document.getElementById("mantTipo").value = m.tipo;
    document.getElementById("mantEstado").value = m.estado;
    document.getElementById("mantFecha").value = m.fecha;
    document.getElementById("mantTecnico").value = m.tecnico;
    document.getElementById("mantCosto").value = m.costo;
    document.getElementById("mantDescripcion").value = m.descripcion;
    document.getElementById("mantObservaciones").value = m.observaciones;

    new bootstrap.Modal(
        document.getElementById("modalMantenimiento")
    ).show();
}

async function eliminarMantenimiento(id) {

    if (!confirm("¿Desea eliminar este mantenimiento?")) return;

    const res = await fetch(`${MANTENIMIENTOS_URL}${id}/`, {
        method: "DELETE"
    });

    if (res.ok) {
        cargarMantenimientos();
    } else {
        alert("No se pudo eliminar el mantenimiento.");
    }

}

function limpiarFormularioMantenimiento() {
    const form = document.getElementById("formMantenimiento");

    form.reset();

    document.getElementById("mantenimientoId").value = "";
    document.getElementById("mantCosto").value = "0";
}
document.addEventListener("DOMContentLoaded", () => {

    const modal = document.getElementById("modalMantenimiento");

    if (modal) {
        modal.addEventListener("hidden.bs.modal", () => {
            limpiarFormularioMantenimiento();
        });
    }

});