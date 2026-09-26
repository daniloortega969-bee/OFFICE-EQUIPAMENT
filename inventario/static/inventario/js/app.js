    // ==================== CONFIGURACIÓN ====================
const MOVIMIENTOS_URL = "/api/movimientos/";


// ==================== INICIALIZACIÓN ====================
document.addEventListener("DOMContentLoaded", async () => {

    // Cargar módulos
    cargarMovimientos();
    cargarMantenimientos();
    cargarEquiposMantenimiento();

    // Formularios
    const formEquipo = document.getElementById("formEquipo");

    if (formEquipo) {
        formEquipo.addEventListener("submit", guardarEquipo);
    }

   // Cargar opciones de los select
    await cargarOpciones("/api/categorias/", "filtrarcategoria");
    await cargarOpciones("/api/categorias/", "categoria");
    await cargarOpciones("/api/marcas/", "marca");
    await cargarOpciones("/api/ubicaciones/", "ubicacion");
    await cargarOpciones("/api/responsables/", "responsable");

    // Cargar listas de administración
    await listarCategorias();
    await listarMarcas();
    await listarUbicaciones();
    await listarResponsables();

    // Botón de búsqueda
    const btn = document.getElementById("btnBuscar");

    if (btn) {
        btn.addEventListener("click", aplicarFiltros);
    }

    // Buscar con Enter
    document
        .querySelectorAll("#buscarnombre, #buscarcodigo, #buscarserial")
        .forEach(campo => {
            campo.addEventListener("keydown", e => {
                if (e.key === "Enter") {
                    aplicarFiltros();
                }
            });
        });

});


// ==================== UTILIDADES ====================

async function cargarOpciones(url, idSelect) {

    try {

        const res = await fetch(url);
        const datos = await res.json();

        console.log(datos);

        const select = document.getElementById(idSelect);

        if (!select) return;

        select.innerHTML = `<option value="">Seleccione</option>`;

        datos.forEach(item => {
            select.innerHTML += `
                <option value="${item.nombre}">
                    ${item.nombre}
                </option>
            `;
        });

    } catch (err) {

        console.error(err);

    }
}