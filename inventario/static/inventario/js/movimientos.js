console.log("MOVIMIENTOS.JS CARGADO");
async function cargarMovimientos() {

    const res = await fetch(MOVIMIENTOS_URL);
    const movimientos = await res.json();

    window.movimientosActuales = movimientos;

    dibujarMovimientos(movimientos);
    }

function verDetalleMovimiento(id) {

    const movimiento = window.movimientosActuales.find(
        m => m.id === id
    );

    if (!movimiento) return;

    let detalle = "";

    if (
        movimiento.marca_anterior !== null &&
        movimiento.marca_anterior !== movimiento.marca_nueva
    ) {
        detalle += `
            <p>
                <strong>Marca:</strong>
                ${movimiento.marca_anterior || "-"}
                → 
                ${movimiento.marca_nueva || "-"}
            </p>
        `;
    }

    if (
        movimiento.modelo_anterior !== null &&
        movimiento.modelo_anterior !== movimiento.modelo_nuevo
    ) {
        detalle += `
            <p>
                <strong>Modelo:</strong>
                ${movimiento.modelo_anterior || "-"}
                →
                ${movimiento.modelo_nuevo || "-"}
            </p>
        `;
    }

    if (
        movimiento.serial_anterior !== null &&
        movimiento.serial_anterior !== movimiento.serial_nuevo
    ) {
        detalle += `
            <p>
                <strong>Serial:</strong>
                ${movimiento.serial_anterior || "-"}
                →
                ${movimiento.serial_nuevo || "-"}
            </p>
        `;
    }

    if (
        movimiento.categoria_anterior !== null &&
        movimiento.categoria_anterior !== movimiento.categoria_nueva
    ) {
        detalle += `
            <p>
                <strong>Categoría:</strong>
                ${movimiento.categoria_anterior || "-"}
                →
                ${movimiento.categoria_nueva || "-"}
            </p>
        `;
    }

    if (
        movimiento.estado_anterior !== null &&
        movimiento.estado_anterior !== movimiento.estado_nuevo
    ) {
        detalle += `
            <p>
                <strong>Estado:</strong>
                ${movimiento.estado_anterior || "-"}
                →
                ${movimiento.estado_nuevo || "-"}
            </p>
        `;
    }

    if (
        movimiento.responsable_anterior !== null &&
        movimiento.responsable_anterior !== movimiento.responsable_nuevo
    ) {
        detalle += `
            <p>
                <strong>Responsable:</strong>
                ${movimiento.responsable_anterior || "-"}
                →
                ${movimiento.responsable_nuevo || "-"}
            </p>
        `;
    }

    if (
        movimiento.ubicacion_anterior !== null &&
        movimiento.ubicacion_anterior !== movimiento.ubicacion_nueva
    ) {
        detalle += `
            <p>
                <strong>Ubicación:</strong>
                ${movimiento.ubicacion_anterior || "-"}
                →
                ${movimiento.ubicacion_nueva || "-"}
            </p>
        `;
    }

    if (!detalle) {
        detalle = "<p>Sin detalles adicionales.</p>";
    }

    document.getElementById("detalleMovimiento").innerHTML = detalle;

    new bootstrap.Modal(
        document.getElementById("modalDetalleMovimiento")
    ).show();
}

function dibujarMovimientos(movimientos) {
    console.log("ESTOY EJECUTANDO EL MOVIMIENTOS.JS NUEVO");

    const tbody = document.getElementById("tablaMovimientos");

    tbody.innerHTML = "";

    if (movimientos.length === 0) {
        tbody.innerHTML =
            `<tr><td colspan="4" class="text-center text-muted">
                No hay movimientos registrados
            </td></tr>`;
        return;
    }

    movimientos.forEach(m => {

        console.log(m);

        const fecha = new Date(m.fecha).toLocaleString("es-CO");

        tbody.innerHTML += `
            <tr>
                <td>${fecha}</td>
                <td><strong>${m.equipo_nombre || m.equipo}</strong></td>
                <td><span class="badge bg-info">${m.tipo}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary"
                            onclick="verDetalleMovimiento(${m.id})">
                        <i class="bi bi-eye"></i> Ver detalle
                    </button>
                </td>
            </tr>
        `;
    });
}

async function guardarMantenimiento(e) {

    e.preventDefault();

    const id = document.getElementById("mantenimientoId").value;

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

    if (res.ok) {

        bootstrap.Modal
            .getInstance(document.getElementById("modalMantenimiento"))
            .hide();

        document.getElementById("formMantenimiento").reset();

        cargarMantenimientos();

    } else {

        console.log(await res.json());

        alert("No fue posible guardar el mantenimiento.");

    }

}