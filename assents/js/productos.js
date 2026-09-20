// js/productos.js

const gridContainer = document.getElementById("catalogo-completo");
const searchInput = document.getElementById("search-input");
const categorySelect = document.getElementById("category-select");
const sortSelect = document.getElementById("sort-select");

// SVG local como respaldo seguro ante fallos de red o URLs rotas
const PLACEHOLDER_IMG = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='180'><rect width='100%' height='100%' fill='%23e0e0e0'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%23666666'>Sin Imagen</text></svg>";

// Obtener la fuente de datos real desde localStorage (o fallback a PRODUCTOS_INICIALES)
function obtenerProductosDesdeStorage() {
    const productosGuardados = JSON.parse(localStorage.getItem("productos"));
    if (productosGuardados && productosGuardados.length > 0) {
        return productosGuardados;
    }
    return typeof PRODUCTOS_INICIALES !== 'undefined' ? PRODUCTOS_INICIALES : [];
}

function normalizarTexto(str) {
    if (!str) return "";
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

function renderizarProductos(productos) {
    if (!gridContainer) return;

    if (productos.length === 0) {
        gridContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <p class="text-muted fs-5 mb-0">No se encontraron productos con los criterios seleccionados.</p>
            </div>`;
        return;
    }

    // Renderizado optimizado
    gridContainer.innerHTML = productos.map(prod => {
        const tieneStock = (prod.stock ?? 1) > 0; // Si no existe propiedad stock, asume disponible

        return `
            <div class="col">
                <div class="card h-100 shadow-sm border-0 p-2 position-relative">
                    <img 
                        src="${prod.imagen || PLACEHOLDER_IMG}" 
                        class="card-img-top object-fit-cover rounded" 
                        alt="${prod.nombre}" 
                        style="height: 180px;" 
                        onerror="this.onerror=null; this.src='${PLACEHOLDER_IMG}';"
                    >
                    <div class="card-body d-flex flex-column p-2">
                        <a href="detalle-producto.html?id=${prod.id}" class="card-title text-decoration-none text-dark fw-bold h6 mb-1 text-truncate" title="${prod.nombre}">${prod.nombre}</a>
                        <small class="text-muted mb-2">${prod.categoria}</small>
                        
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <span class="fs-5 fw-bold text-primary">$${Number(prod.precio).toLocaleString('es-CL')}</span>
                            <span class="badge ${tieneStock ? 'bg-success' : 'bg-danger'}">
                                ${tieneStock ? `Stock: ${prod.stock}` : 'Agotado'}
                            </span>
                        </div>

                        <button 
                            onclick="agregarAlCarrito(${prod.id})" 
                            class="btn btn-primary mt-auto w-100 btn-sm fw-bold"
                            ${!tieneStock ? 'disabled' : ''}>
                            🛒 ${tieneStock ? 'Agregar al Carrito' : 'Sin Stock'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join("");
}

function aplicarFiltros() {
    // CORRECCIÓN: Se leen los productos dinámicos guardados en el navegador
    let resultado = obtenerProductosDesdeStorage();

    if (searchInput && searchInput.value) {
        const textoBusqueda = normalizarTexto(searchInput.value);
        if (textoBusqueda !== "") {
            resultado = resultado.filter(p => 
                normalizarTexto(p.nombre).includes(textoBusqueda) || 
                normalizarTexto(p.descripcion || "").includes(textoBusqueda) ||
                normalizarTexto(p.codigo || "").includes(textoBusqueda)
            );
        }
    }

    if (categorySelect && categorySelect.value) {
        const categoriaSeleccionada = normalizarTexto(categorySelect.value);
        if (categoriaSeleccionada !== "todas") {
            resultado = resultado.filter(p => normalizarTexto(p.categoria) === categoriaSeleccionada);
        }
    }

    if (sortSelect && sortSelect.value) {
        const orden = sortSelect.value;
        if (orden === "precio-bajo") {
            resultado.sort((a, b) => a.precio - b.precio);
        } else if (orden === "precio-alto") {
            resultado.sort((a, b) => b.precio - a.precio);
        }
    }

    renderizarProductos(resultado);
}

// Escuchadores de eventos
if (searchInput) searchInput.addEventListener("input", aplicarFiltros);
if (categorySelect) categorySelect.addEventListener("change", aplicarFiltros);
if (sortSelect) sortSelect.addEventListener("change", aplicarFiltros);

// Sincronización en tiempo real si el admin hace cambios en otra pestaña
window.addEventListener("storage", function (e) {
    if (e.key === "productos") {
        aplicarFiltros();
    }
});

document.addEventListener("DOMContentLoaded", aplicarFiltros);