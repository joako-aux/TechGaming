// js/productos.js

const gridContainer = document.getElementById("catalogo-completo");
const searchInput = document.getElementById("search-input");
const categorySelect = document.getElementById("category-select");
const sortSelect = document.getElementById("sort-select");

// SVG local como respaldo seguro ante fallos de red o URLs rotas
const PLACEHOLDER_IMG = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='180'><rect width='100%' height='100%' fill='%23e0e0e0'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%23666666'>Sin Imagen</text></svg>";

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

    // Renderizado en un solo paso para mejorar el rendimiento del DOM
    gridContainer.innerHTML = productos.map(prod => `
        <div class="col">
            <div class="card h-100 shadow-sm border-0 p-2">
                <img 
                    src="${prod.imagen || PLACEHOLDER_IMG}" 
                    class="card-img-top object-fit-cover" 
                    alt="${prod.nombre}" 
                    style="height: 180px;" 
                    onerror="this.onerror=null; this.src='${PLACEHOLDER_IMG}';"
                >
                <div class="card-body d-flex flex-column p-2">
                    <a href="detalle-producto.html?id=${prod.id}" class="card-title text-decoration-none text-dark fw-bold h6 mb-2">${prod.nombre}</a>
                    <small class="text-muted mb-2">${prod.categoria}</small>
                    <span class="fs-5 fw-bold text-primary mb-3">$${prod.precio.toLocaleString('es-CL')}</span>
                    <button onclick="agregarAlCarrito(${prod.id})" class="btn btn-primary mt-auto w-100 btn-sm">
                        🛒 Agregar al Carrito
                    </button>
                </div>
            </div>
        </div>
    `).join("");
}

function aplicarFiltros() {
    if (typeof PRODUCTOS_INICIALES === 'undefined') return;

    let resultado = [...PRODUCTOS_INICIALES];

    if (searchInput && searchInput.value) {
        const textoBusqueda = normalizarTexto(searchInput.value);
        if (textoBusqueda !== "") {
            resultado = resultado.filter(p => 
                normalizarTexto(p.nombre).includes(textoBusqueda) || 
                normalizarTexto(p.descripcion || "").includes(textoBusqueda)
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

if (searchInput) searchInput.addEventListener("input", aplicarFiltros);
if (categorySelect) categorySelect.addEventListener("change", aplicarFiltros);
if (sortSelect) sortSelect.addEventListener("change", aplicarFiltros);

document.addEventListener("DOMContentLoaded", aplicarFiltros);