document.addEventListener("DOMContentLoaded", function () {
    // Validar sesión activa y que sea Administrador
    const usuarioLogueado = JSON.parse(sessionStorage.getItem("usuarioLogueado"));

    if (!usuarioLogueado || usuarioLogueado.correo !== "admin@duoc.cl") {
        alert("Acceso denegado. Se requieren permisos de administrador.");
        window.location.href = "login.html";
        return;
    }

    // Cargar usuarios al iniciar la vista
    renderizarTablaUsuarios();
});

// Función para renderizar y actualizar la tabla de usuarios
function renderizarTablaUsuarios() {
    const usuariosGuardados = JSON.parse(localStorage.getItem("usuarios")) || [];
    const tabla = document.getElementById("tabla-usuarios");
    const totalBadge = document.getElementById("total-usuarios");

    if (!tabla || !totalBadge) return;

    totalBadge.textContent = `${usuariosGuardados.length} Registros`;

    if (usuariosGuardados.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4 text-muted">No hay usuarios registrados aún.</td>
            </tr>
        `;
        return;
    }

    tabla.innerHTML = "";
    usuariosGuardados.forEach((user, index) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td class="fw-bold">${user.nombre}</td>
            <td>${user.run}</td>
            <td>${user.correo}</td>
            <td>${user.telefono || 'N/A'}</td>
            <td><small>${user.comuna || 'N/A'}, ${user.region || 'N/A'}</small></td>
            <td class="text-center">
                <button onclick="eliminarUsuario(${index})" class="btn btn-outline-danger btn-sm">
                    🗑️ Eliminar
                </button>
            </td>
        `;
        tabla.appendChild(fila);
    });
}

// Función para eliminar un usuario por su índice en el arreglo
function eliminarUsuario(index) {
    const usuariosGuardados = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuarioAEliminar = usuariosGuardados[index];

    if (!usuarioAEliminar) return;

    if (confirm(`¿Estás seguro de que deseas eliminar al usuario "${usuarioAEliminar.nombre}" (${usuarioAEliminar.correo})?`)) {
        // Eliminar elemento del arreglo
        usuariosGuardados.splice(index, 1);

        // Guardar los cambios actualizados en localStorage
        localStorage.setItem("usuarios", JSON.stringify(usuariosGuardados));

        // Volver a renderizar la tabla de usuarios
        renderizarTablaUsuarios();

        alert("Usuario eliminado correctamente.");
    }
}

// Función para cerrar la sesión activa
function cerrarSesion() {
    sessionStorage.removeItem("usuarioLogueado");
    alert("Sesión cerrada correctamente.");
    window.location.href = "login.html";
}