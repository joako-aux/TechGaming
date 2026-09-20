document.addEventListener("DOMContentLoaded", function () {
    // 1. Verificar autenticación del cliente en sessionStorage
    let usuarioLogueado = JSON.parse(sessionStorage.getItem("usuarioLogueado"));

    if (!usuarioLogueado) {
        alert("Debes iniciar sesión para acceder a tu panel de usuario.");
        window.location.href = "login.html";
        return;
    }

    // 2. Sincronizar datos actualizados desde localStorage (por si el admin cambió el rol)
    const usuariosRegistrados = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuarioActualizado = usuariosRegistrados.find(u => u.correo === usuarioLogueado.correo);

    if (usuarioActualizado) {
        usuarioLogueado = usuarioActualizado;
        sessionStorage.setItem("usuarioLogueado", JSON.stringify(usuarioLogueado));
    }

    // 3. Desplegar los datos personales del usuario y su ROL
    inyectarDatosPerfil(usuarioLogueado);

    // 4. Cargar el historial de tickets guardados para este usuario
    renderizarTickets(usuarioLogueado.correo);

    // 5. Listener por EventListener como respaldo
    const form = document.getElementById("support-form");
    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            guardarNuevoTicket(usuarioLogueado);
        });
    }
});

// Función para poblar los campos del usuario y su ROL
function inyectarDatosPerfil(usuario) {
    const setTexto = (id, valor, fallback) => {
        const elem = document.getElementById(id);
        if (elem) elem.textContent = valor || fallback;
    };

    setTexto("nav-user-name", usuario.nombre, "Usuario");
    setTexto("user-nombre", usuario.nombre, "No registrado");
    setTexto("user-correo", usuario.correo, "No registrado");
    setTexto("user-run", usuario.run, "No especificado");
    setTexto("user-telefono", usuario.telefono, "No especificado");
    setTexto("user-region", usuario.region, "No especificada");
    setTexto("user-comuna", usuario.comuna, "No especificada");

    // Mostrar el ROL dinámico y asignar el color correspondiente
    const elemRol = document.getElementById("user-rol");
    if (elemRol) {
        const rol = usuario.rol || "Cliente";
        elemRol.textContent = rol;

        if (rol === "Administrador") {
            elemRol.className = "badge bg-danger";
        } else if (rol === "Asesor Técnico") {
            elemRol.className = "badge bg-warning text-dark";
        } else {
            elemRol.className = "badge bg-success"; // Cliente
        }
    }
}

// Función expuesta globalmente para el onsubmit="crearTicket(event)" del HTML
function crearTicket(e) {
    if (e) e.preventDefault();
    const usuarioLogueado = JSON.parse(sessionStorage.getItem("usuarioLogueado"));
    if (usuarioLogueado) {
        guardarNuevoTicket(usuarioLogueado);
    }
}

// Función para registrar el ticket en localStorage
function guardarNuevoTicket(usuario) {
    const tipo = document.getElementById("ticket-tipo").value;
    const producto = document.getElementById("ticket-producto").value.trim();
    const mensaje = document.getElementById("ticket-mensaje").value.trim();

    if (!tipo || !producto || !mensaje) return;

    const nuevoTicket = {
        id: "TCK-" + Date.now().toString().slice(-6),
        usuarioCorreo: usuario.correo,
        usuarioNombre: usuario.nombre,
        tipo: tipo,
        producto: producto,
        mensaje: mensaje,
        fecha: new Date().toLocaleString("es-CL"),
        estado: "Pendiente"
    };

    const tickets = JSON.parse(localStorage.getItem("tickets")) || [];
    tickets.push(nuevoTicket);
    localStorage.setItem("tickets", JSON.stringify(tickets));

    alert(`¡Solicitud enviada exitosamente! Tu número de ticket es: ${nuevoTicket.id}`);
    
    document.getElementById("support-form").reset();
    renderizarTickets(usuario.correo);
}

// Renderiza los tickets asociados al correo actual (con respuesta visible)
function renderizarTickets(correoUsuario) {
    const contenedor = document.getElementById("lista-tickets");
    if (!contenedor) return;

    const todosLosTickets = JSON.parse(localStorage.getItem("tickets")) || [];
    const misTickets = todosLosTickets.filter(t => t.usuarioCorreo === correoUsuario);

    if (misTickets.length === 0) {
        contenedor.innerHTML = `<p class="text-muted small text-center my-2">No tienes solicitudes registradas.</p>`;
        return;
    }

    contenedor.innerHTML = misTickets.slice().reverse().map(t => `
        <div class="p-3 border rounded bg-light mb-2">
            <div class="d-flex justify-content-between align-items-center mb-1">
                <span class="fw-bold text-dark small">${t.id} - ${t.tipo}</span>
                <span class="badge ${t.estado === 'Pendiente' ? 'bg-warning text-dark' : 'bg-success'}">${t.estado}</span>
            </div>
            <p class="mb-1 text-muted small"><strong>Producto:</strong> ${t.producto}</p>
            <p class="mb-2 text-secondary small">${t.mensaje}</p>
            
            ${t.respuestaAdmin ? `
                <div class="p-2 mt-2 bg-white border-start border-3 border-success rounded">
                    <small class="fw-bold text-success d-block">💬 Respuesta del Soporte (${t.fechaRespuesta || 'Reciente'}):</small>
                    <small class="text-dark">${t.respuestaAdmin}</small>
                </div>
            ` : ''}

            <div class="mt-2 text-end">
                <small class="text-muted" style="font-size: 0.75rem;">📅 ${t.fecha}</small>
            </div>
        </div>
    `).join("");
}

// Función global para cerrar sesión
function cerrarSesion() {
    sessionStorage.removeItem("usuarioLogueado");
    alert("Sesión cerrada correctamente.");
    window.location.href = "login.html";
}