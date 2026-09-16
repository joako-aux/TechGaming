// js/carrito.js

// 1. Obtener el carrito desde localStorage
function obtenerCarrito() {
    return JSON.parse(localStorage.getItem('carrito_techgaming')) || [];
}

// 2. Guardar el carrito en localStorage y actualizar la vista
function guardarCarrito(carrito) {
    localStorage.setItem('carrito_techgaming', JSON.stringify(carrito));
    actualizarContadorCarrito();
}

// 3. Agregar un producto al carrito
function agregarAlCarrito(idProducto, cantidad = 1) {
    if (typeof PRODUCTOS_INICIALES === 'undefined') {
        console.error("El archivo datos.js no se ha cargado correctamente.");
        return;
    }

    const productoEncontrado = PRODUCTOS_INICIALES.find(p => p.id === idProducto);
    
    if (!productoEncontrado) {
        alert("Producto no encontrado.");
        return;
    }

    let carrito = obtenerCarrito();
    const index = carrito.findIndex(p => p.id === idProducto);

    if (index !== -1) {
        // Si el producto ya existe en el carrito, sumamos la cantidad
        carrito[index].cantidad += cantidad;
    } else {
        // Si no existe, lo agregamos como nuevo ítem
        carrito.push({
            id: productoEncontrado.id,
            nombre: productoEncontrado.nombre,
            precio: productoEncontrado.precio,
            imagen: productoEncontrado.imagen,
            cantidad: cantidad
        });
    }

    guardarCarrito(carrito);
    alert(`¡"${productoEncontrado.nombre}" se agregó al carrito!`);
}

// 4. Eliminar producto del carrito
function eliminarDelCarrito(idProducto) {
    let carrito = obtenerCarrito();
    carrito = carrito.filter(prod => prod.id !== idProducto);
    guardarCarrito(carrito);
    renderizarPaginaCarrito(); // Re-renderizar si estamos en la página del carrito
}

// 5. Cambiar la cantidad de un producto
function cambiarCantidad(idProducto, nuevaCantidad) {
    let carrito = obtenerCarrito();
    const index = carrito.findIndex(p => p.id === idProducto);

    if (index !== -1) {
        if (nuevaCantidad <= 0) {
            eliminarDelCarrito(idProducto);
            return;
        }
        carrito[index].cantidad = parseInt(nuevaCantidad);
        guardarCarrito(carrito);
        renderizarPaginaCarrito();
    }
}

// 6. Vaciar todo el carrito
function vaciarCarrito() {
    if (confirm("¿Estás seguro de que deseas vaciar el carrito?")) {
        localStorage.removeItem('carrito_techgaming');
        actualizarContadorCarrito();
        renderizarPaginaCarrito();
    }
}

// 7. Actualizar la insignia o badge del carrito (#cart-count) en el header
function actualizarContadorCarrito() {
    const cartCountElement = document.getElementById("cart-count");
    if (cartCountElement) {
        const carrito = obtenerCarrito();
        const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        cartCountElement.textContent = totalItems;
    }
}

// 8. Renderizar la tabla del carrito (Solo se ejecuta en carrito.html)
function renderizarPaginaCarrito() {
    const contenedorTabla = document.getElementById("cart-table-body");
    const contenedorTotal = document.getElementById("cart-total");

    // Si no existen estos elementos en la página actual, salimos de la función
    if (!contenedorTabla || !contenedorTotal) return;

    const carrito = obtenerCarrito();

    if (carrito.length === 0) {
        contenedorTabla.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 20px;">
                    Tu carrito está vacío. <a href="productos.html">Ver productos</a>
                </td>
            </tr>`;
        contenedorTotal.textContent = "$0";
        return;
    }

    let html = '';
    let totalGeneral = 0;

    carrito.forEach(prod => {
        const subtotal = prod.precio * prod.cantidad;
        totalGeneral += subtotal;

        html += `
            <tr>
                <td>
                    <img src="${prod.imagen}" alt="${prod.nombre}" style="width: 50px; height: 50px; object-fit: cover; vertical-align: middle;" onerror="this.src='https://via.placeholder.com/50'">
                    <strong>${prod.nombre}</strong>
                </td>
                <td>$${prod.precio.toLocaleString('es-CL')}</td>
                <td>
                    <input type="number" min="1" value="${prod.cantidad}" onchange="cambiarCantidad(${prod.id}, this.value)" style="width: 50px; text-align: center;">
                </td>
                <td>$${subtotal.toLocaleString('es-CL')}</td>
                <td>
                    <button onclick="eliminarDelCarrito(${prod.id})" style="background-color: #ff4d4d; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 4px;">❌ Eliminar</button>
                </td>
            </tr>
        `;
    });

    contenedorTabla.innerHTML = html;
    contenedorTotal.textContent = `$${totalGeneral.toLocaleString('es-CL')}`;
}

// Ejecutar al cargar cualquier página para actualizar el contador
document.addEventListener("DOMContentLoaded", () => {
    actualizarContadorCarrito();
    renderizarPaginaCarrito();
});