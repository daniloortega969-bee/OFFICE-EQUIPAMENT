const API_URL = '/api/equipos/';

function getCookie(nombre) {
    let valor = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const c = cookies[i].trim();
            if (c.substring(0, nombre.length + 1) === (nombre + '=')) {
                valor = decodeURIComponent(c.substring(nombre.length + 1));
                break;
            }
        }
    }
    return valor;
}
const CSRF_TOKEN = getCookie('csrftoken');

const tabla = document.getElementById('tablaEquipos'); // ✅ Corregí ID
const form = document.getElementById('formEquipo'); // ✅ Corregí ID
const modalElement = document.getElementById('modalEquipo');
const modal = new bootstrap.Modal(modalElement);

document.addEventListener('DOMContentLoaded', async () => {
    cargarEquipos(); // ✅ Agregué cargar equipos al inicio
    conectarBusqueda(); // ✅ Agregué conectar botón búsqueda
    // Cargar listas desplegables
    // Dentro de DOMContentLoaded, agrega:
    await cargarOpciones('/api/categorias/', 'filtrarcategoria');
    await cargarOpciones('/api/categorias/', 'categoria');
    await cargarOpciones('/api/marcas/', 'marca');
    await cargarOpciones('/api/ubicaciones/', 'ubicacion');
    await cargarOpciones('/api/responsables/', 'responsable');
});

async function cargarOpciones(url, idSelect) {
    try {
        const res = await fetch(url);
        const datos = await res.json();
        const select = document.getElementById(idSelect);
        select.innerHTML = `<option value="">Seleccione</option>`;
        datos.forEach(item => {
            select.innerHTML += `<option value="${item.nombre}">${item.nombre}</option>`;
        });
    } catch (err) {
        console.error(`Error cargando ${idSelect}:`, err);
    }
}

async function cargarOpciones(url, idSelect) {
    try {
        const res = await fetch(url);
        const datos = await res.json();
        const select = document.getElementById(idSelect);
        select.innerHTML = `<option value="">Seleccione</option>`;
        // ✅ Ahora lee cada nombre directamente
        datos.forEach(nombre => {
            select.innerHTML += `<option value="${nombre}">${nombre}</option>`;
        });
    } catch (err) {
        console.error(`Error cargando ${idSelect}:`, err);
    }
}

function agregarFila(e) {
    const fila = document.createElement('tr');
    fila.innerHTML = `
        <td>${e.id}</td>
        <td>${e.nombre}</td>
        <td>${e.codigo}</td>
        <td>${e.serial || '-'}</td>
        <td>${e.categoria || '-'}</td>
        <td>${e.estado}</td>
        <td>${e.ubicacion || '-'}</td>
        <td>
            <button class="btn btn-sm btn-warning me-1 editar" data-id="${e.id}">Editar</button>
            <button class="btn btn-sm btn-danger eliminar" data-id="${e.id}">Eliminar</button>
        </td>
    `;
    tabla.appendChild(fila);
}

function aplicarFiltros() {
    const nom = (document.getElementById('buscarnombre')?.value || '').trim().toLowerCase();
    const cod = (document.getElementById('buscarcodigo')?.value || '').trim().toLowerCase();
    const ser = (document.getElementById('buscarserial')?.value || '').trim().toLowerCase();
    const cat = document.getElementById('filtrarcategoria')?.value || '';
    const est = document.getElementById('filtrarestado')?.value || '';

    fetch(API_URL)
        .then(r => r.json())
        .then(todos => {
            const res = todos.filter(eq => {
                return (!nom || (eq.nombre||'').toLowerCase().includes(nom))
                    && (!cod || (eq.codigo||'').toLowerCase().includes(cod))
                    && (!ser || (eq.serial||'').toLowerCase().includes(ser))
                    && (!cat || eq.categoria === cat)
                    && (!est || eq.estado === est);
            });
            cargarEquipos(res);
        });
}

function conectarBusqueda() {
    const btn = document.getElementById('btnBuscar');
    if (btn) btn.addEventListener('click', aplicarFiltros);
    document.querySelectorAll('#buscarnombre, #buscarcodigo, #buscarserial').forEach(c => {
        c.addEventListener('keydown', e => { if(e.key==='Enter') aplicarFiltros(); });
    });
}

form.addEventListener('submit', async e => {
    e.preventDefault();
    const id = document.getElementById('equipoId').value; // ✅ ID corregido
    const datos = {
        codigo: document.getElementById('codigo').value,
        nombre: document.getElementById('nombre').value,
        marca: document.getElementById('marca').value,
        modelo: document.getElementById('modelo').value,
        serial: document.getElementById('serial').value,
        categoria: document.getElementById('categoria').value,
        estado: document.getElementById('estado').value,
        ubicacion: document.getElementById('ubicacion').value,
        responsable: document.getElementById('responsable').value,
        observaciones: document.getElementById('observaciones').value
    };
    const metodo = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}${id}/` : API_URL;
    const res = await fetch(url, {
        method: metodo,
        headers: {'Content-Type':'application/json','X-CSRFToken':CSRF_TOKEN},
        body: JSON.stringify(datos)
    });
    if (res.ok) { modal.hide(); form.reset(); cargarEquipos(); }
});

tabla.addEventListener('click', async e => {
    const id = e.target.dataset.id;
    if (!id) return;
    if (e.target.classList.contains('editar')) {
        const eq = await (await fetch(`${API_URL}${id}/`)).json();
        document.getElementById('equipoId').value = eq.id;
        document.getElementById('codigo').value = eq.codigo;
        document.getElementById('nombre').value = eq.nombre;
        document.getElementById('marca').value = eq.marca || '';
        document.getElementById('modelo').value = eq.modelo;
        document.getElementById('serial').value = eq.serial || '';
        document.getElementById('categoria').value = eq.categoria || '';
        document.getElementById('estado').value = eq.estado;
        document.getElementById('ubicacion').value = eq.ubicacion || '';
        document.getElementById('responsable').value = eq.responsable || '';
        document.getElementById('observaciones').value = eq.observaciones || '';
        document.getElementById('tituloModal').textContent = 'Editar Equipo';
        modal.show();
    }
    if (e.target.classList.contains('eliminar') && confirm('¿Eliminar?')) {
        await fetch(`${API_URL}${id}/`, {method:'DELETE', headers:{'X-CSRFToken':CSRF_TOKEN}});
        cargarEquipos();
    }
});

modalElement.addEventListener('hidden.bs.modal', () => {
    form.reset();
    document.getElementById('equipoId').value = '';
    document.getElementById('tituloModal').textContent = 'Agregar Equipo';
});