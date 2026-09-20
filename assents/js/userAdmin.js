document.addEventListener("DOMContentLoaded", function () {
    // 1. Validar sesión activa y que el usuario sea Administrador
    const usuarioLogueado = JSON.parse(sessionStorage.getItem("usuarioLogueado"));

    if (!usuarioLogueado || usuarioLogueado.correo !== "admin@duoc.cl") {
        alert("Acceso denegado. Se requieren permisos de administrador.");
        window.location.href = "login.html";
        return;
    }

    // Actualizar datos del perfil en la interfaz
    const elemNombre = document.getElementById("admin-nombre");
    const elemCorreo = document.getElementById("admin-correo");
    const elemNavUser = document.getElementById("nav-user-name");

    if (elemNombre) elemNombre.textContent = usuarioLogueado.nombre || "Panel Administrador";
    if (elemCorreo) elemCorreo.textContent = usuarioLogueado.correo;
    if (elemNavUser) elemNavUser.textContent = usuarioLogueado.nombre || "Administrador";

    // 2. Cargar y renderizar ambas tablas al iniciar
    renderizarTablaProductos();
    renderizarTablaUsuarios();
});

// ==========================================
// SECCIÓN 1: CRUD DE HARDWARE / PRODUCTOS
// ==========================================

// Obtener productos desde localStorage
function obtenerProductos() {
    return JSON.parse(localStorage.getItem("productos")) || [];
}

// Guardar productos en localStorage
function guardarProductosEnStorage(productos) {
    localStorage.setItem("productos", JSON.stringify(productos));
}

// Renderizar la tabla de productos en el DOM
function renderizarTablaProductos() {
    const productos = obtenerProductos();
    const tabla = document.getElementById("tabla-productos");
    const totalBadge = document.getElementById("total-productos");

    if (!tabla || !totalBadge) return;

    totalBadge.textContent = `${productos.length} Productos`;

    if (productos.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4 text-muted">
                    No hay productos en el catálogo aún.
                </td>
            </tr>
        `;
        return;
    }

    tabla.innerHTML = "";
    productos.forEach((prod, index) => {
        const fila = document.createElement("tr");
        const codigoMostrar = prod.codigo || `PROD-${prod.id}`;
        const tieneStock = (prod.stock || 0) > 0;

        fila.innerHTML = `
            <td class="fw-bold">${codigoMostrar}</td>
            <td>
                <div class="d-flex align-items-center gap-2">
                    <img src="${prod.imagen || 'https://via.placeholder.com/40'}" alt="${prod.nombre}" style="width: 40px; height: 40px; object-fit: cover;" class="rounded border">
                    <span class="fw-semibold">${prod.nombre}</span>
                </div>
            </td>
            <td><span class="badge bg-secondary">${prod.categoria}</span></td>
            <td>$${Number(prod.precio).toLocaleString("es-CL")}</td>
            <td>
                <span class="badge ${tieneStock ? 'bg-success' : 'bg-danger'}">
                    ${prod.stock || 0} un.
                </span>
            </td>
            <td class="text-center">
                <button onclick="prepararFormularioEditar(${index})" class="btn btn-outline-warning btn-sm me-1" data-bs-toggle="modal" data-bs-target="#modalProducto" title="Editar Producto">
                    ✏️
                </button>
                <button onclick="eliminarProducto(${index})" class="btn btn-outline-danger btn-sm" title="Eliminar Producto">
                    🗑️
                </button>
            </td>
        `;
        tabla.appendChild(fila);
    });
}

// Limpiar formulario para agregar un nuevo producto
function prepararFormularioAgregar() {
    const modalTitle = document.getElementById("modalProductoLabel");
    const form = document.getElementById("form-producto");
    const indexInput = document.getElementById("producto-index");

    if (modalTitle) modalTitle.textContent = "Agregar Nuevo Producto";
    if (form) form.reset();
    if (indexInput) indexInput.value = "";
}

// Cargar los datos del producto seleccionado en el modal para editar
function prepararFormularioEditar(index) {
    const productos = obtenerProductos();
    const prod = productos[index];

    if (!prod) return;

    const modalTitle = document.getElementById("modalProductoLabel");
    if (modalTitle) modalTitle.textContent = "Editar Producto";

    document.getElementById("producto-index").value = index;
    document.getElementById("prod-codigo").value = prod.codigo || `PROD-${prod.id}`;
    document.getElementById("prod-nombre").value = prod.nombre;
    document.getElementById("prod-categoria").value = prod.categoria;
    document.getElementById("prod-precio").value = prod.precio;
    document.getElementById("prod-stock").value = prod.stock || 0;
    document.getElementById("prod-imagen").value = prod.imagen || "";
    document.getElementById("prod-descripcion").value = prod.descripcion || "";
}

// Guardar o actualizar un producto (Submit del Formulario)
function guardarProducto(e) {
    e.preventDefault();

    const index = document.getElementById("producto-index").value;
    const codigo = document.getElementById("prod-codigo").value.trim();
    const nombre = document.getElementById("prod-nombre").value.trim();
    const categoria = document.getElementById("prod-categoria").value;
    const precio = parseFloat(document.getElementById("prod-precio").value);
    const stock = parseInt(document.getElementById("prod-stock").value, 10);
    const imagen = document.getElementById("prod-imagen").value.trim();
    const descripcion = document.getElementById("prod-descripcion").value.trim();

    const productos = obtenerProductos();

    const productoData = {
        id: index !== "" ? productos[index].id : Date.now(),
        codigo: codigo,
        nombre: nombre,
        categoria: categoria,
        precio: precio,
        stock: stock,
        imagen: imagen,
        descripcion: descripcion
    };

    if (index === "") {
        productos.push(productoData);
        alert("Producto agregado correctamente al catálogo.");
    } else {
        productos[index] = productoData;
        alert("Producto actualizado correctamente.");
    }

    guardarProductosEnStorage(productos);
    renderizarTablaProductos();

    // Cerrar el Modal de Bootstrap
    const modalElement = document.getElementById("modalProducto");
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
        modalInstance.hide();
    }
}

// Eliminar un producto del catálogo
function eliminarProducto(index) {
    const productos = obtenerProductos();
    const prod = productos[index];

    if (!prod) return;

    if (confirm(`¿Estás seguro de que deseas eliminar "${prod.nombre}" del catálogo?`)) {
        productos.splice(index, 1);
        guardarProductosEnStorage(productos);
        renderizarTablaProductos();
        alert("Producto eliminado correctamente.");
    }
}

// ==========================================
// SECCIÓN 2: GESTIÓN DE USUARIOS REGISTRADOS Y ROLES (RF-09)
// ==========================================

// Obtener usuarios guardados en localStorage
function obtenerUsuarios() {
    return JSON.parse(localStorage.getItem("usuarios")) || [];
}

// Renderizar la tabla de usuarios registrados con selector de rol
function renderizarTablaUsuarios() {
    const usuarios = obtenerUsuarios();
    const tabla = document.getElementById("tabla-usuarios");
    const totalBadge = document.getElementById("total-usuarios");

    if (!tabla || !totalBadge) return;

    totalBadge.textContent = `${usuarios.length} Registros`;

    if (usuarios.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-4 text-muted">
                    No hay usuarios registrados en el sistema.
                </td>
            </tr>
        `;
        return;
    }

    tabla.innerHTML = "";
    usuarios.forEach((user, index) => {
        const fila = document.createElement("tr");
        const ubicacion = [user.comuna, user.region].filter(Boolean).join(", ") || "N/A";
        
        // Asignar rol por defecto si no existe
        const rolActual = user.rol || "Cliente";

        fila.innerHTML = `
            <td class="fw-bold">${user.nombre}</td>
            <td>${user.run || 'N/A'}</td>
            <td>${user.correo}</td>
            <td>${user.telefono || 'N/A'}</td>
            <td><small class="text-muted">${ubicacion}</small></td>
            <td>
                <select class="form-select form-select-sm" onchange="cambiarRolUsuario(${index}, this.value)">
                    <option value="Cliente" ${rolActual === 'Cliente' ? 'selected' : ''}>Cliente</option>
                    <option value="Asesor Técnico" ${rolActual === 'Asesor Técnico' ? 'selected' : ''}>Asesor Técnico</option>
                    <option value="Administrador" ${rolActual === 'Administrador' ? 'selected' : ''}>Administrador</option>
                </select>
            </td>
            <td class="text-center">
                <button onclick="eliminarUsuario(${index})" class="btn btn-outline-danger btn-sm" title="Eliminar Usuario">
                    🗑️ Eliminar
                </button>
            </td>
        `;
        tabla.appendChild(fila);
    });
}

// Función para asignar o modificar el rol de un usuario
function cambiarRolUsuario(index, nuevoRol) {
    const usuarios = obtenerUsuarios();

    if (!usuarios[index]) return;

    // 1. Prevenir quitarse el rol de Administrador a sí mismo
    const usuarioLogueado = JSON.parse(sessionStorage.getItem("usuarioLogueado"));
    if (usuarioLogueado && usuarios[index].correo === usuarioLogueado.correo && nuevoRol !== "Administrador") {
        alert("No puedes quitarte el rol de Administrador a ti mismo.");
        renderizarTablaUsuarios(); // Revertir visualmente el select
        return;
    }

    // 2. Actualizar el rol en la lista global (localStorage)
    usuarios[index].rol = nuevoRol;
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    // 3. NUEVO: Si el usuario editado es el que tiene la sesión activa, actualizar sessionStorage
    if (usuarioLogueado && usuarioLogueado.correo === usuarios[index].correo) {
        usuarioLogueado.rol = nuevoRol;
        sessionStorage.setItem("usuarioLogueado", JSON.stringify(usuarioLogueado));
    }

    alert(`El rol de ${usuarios[index].nombre} se actualizó a: "${nuevoRol}".`);
}

// Eliminar un usuario registrado
function eliminarUsuario(index) {
    const usuarios = obtenerUsuarios();
    const usuarioAEliminar = usuarios[index];

    if (!usuarioAEliminar) return;

    if (confirm(`¿Estás seguro de eliminar al usuario "${usuarioAEliminar.nombre}" (${usuarioAEliminar.correo})?`)) {
        usuarios.splice(index, 1);
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        renderizarTablaUsuarios();
        alert("Usuario eliminado correctamente.");
    }
}
// ==========================================
// SECCIÓN 3: CONTROL DE SESIÓN
// ==========================================

function cerrarSesion() {
    sessionStorage.removeItem("usuarioLogueado");
    alert("Sesión cerrada correctamente.");
    window.location.href = "login.html";
}