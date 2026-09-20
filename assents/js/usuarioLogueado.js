document.addEventListener("DOMContentLoaded", function () {
    actualizarBarraNavegacion();
});

function actualizarBarraNavegacion() {
    const authContainer = document.getElementById("auth-container");
    if (!authContainer) return;

    // Lee los datos del usuario guardados en localStorage
    const usuarioGuardado = JSON.parse(localStorage.getItem("usuarioLogueado"));

    if (usuarioGuardado && usuarioGuardado.nombre) {
        // 1. Validar si el usuario es Administrador
        const esAdmin = (
            usuarioGuardado.correo === "admin@duoc.cl" || 
            usuarioGuardado.rol === "admin" || 
            usuarioGuardado.rol === "Administrador"
        );

        // 2. Asignar la página correspondiente según el rol
        const destinoUrl = esAdmin ? "userAdmin.html" : "user.html";

        // 3. Muestra el nombre como enlace clickeable hacia su perfil
        authContainer.innerHTML = `
            <div class="d-flex align-items-center gap-2">
                <span class="text-white small">
                    Hola, 
                    <a href="${destinoUrl}" class="text-white text-decoration-underline fw-bold">
                        ${usuarioGuardado.nombre}
                    </a>
                </span>
                <button onclick="cerrarSesion()" class="btn btn-outline-danger btn-sm py-0 px-2">Cerrar sesión</button>
            </div>
        `;
    } else {
        // MUESTRA LOS ENLACES DE LOGIN/REGISTRO SI NO HAY SESIÓN
        authContainer.innerHTML = `
            <div class="text-secondary small">
                <a href="login.html" class="text-white text-decoration-none">Iniciar sesión</a> | 
                <a href="registro.html" class="text-white text-decoration-none">Registrar usuario</a>
            </div>
        `;
    }
}

// Función auxiliar para cerrar sesión si se requiere en este script
function cerrarSesion() {
    localStorage.removeItem("usuarioLogueado");
    alert("Sesión cerrada correctamente.");
    window.location.href = "login.html";
}