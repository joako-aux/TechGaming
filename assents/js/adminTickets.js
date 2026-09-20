// assents/js/adminTickets.js

document.addEventListener("DOMContentLoaded", function () {
    // 1. Renderizar la lista de tickets en la tabla de administración
    renderizarTicketsAdmin();

    // 2. Manejar el evento de guardar respuesta
    const formRespuesta = document.getElementById("form-respuesta-ticket");
    if (formRespuesta) {
        formRespuesta.addEventListener("submit", guardarRespuestaAdmin);
    }
});

// Renderiza los tickets en la tabla según el filtro de estado seleccionado
function renderizarTicketsAdmin() {
    const tabla = document.getElementById("tabla-tickets-admin");
    const badgePendientes = document.getElementById("cant-tickets-pendientes");
    const pillPendientes = document.getElementById("badge-tickets-pendientes-pill");

    if (!tabla) return;

    const tickets = JSON.parse(localStorage.getItem("tickets")) || [];
    const filtro = document.getElementById("admin-ticket-filter")?.value || "todos";

    // Actualizar contadores de tickets pendientes
    const pendientesCount = tickets.filter(t => t.estado === "Pendiente").length;
    if (badgePendientes) badgePendientes.textContent = `${pendientesCount} Pendientes`;

    if (pillPendientes) {
        if (pendientesCount > 0) {
            pillPendientes.textContent = pendientesCount;
            pillPendientes.classList.remove("d-none");
        } else {
            pillPendientes.classList.add("d-none");
        }
    }

    // Filtrar solicitudes según el select
    const ticketsFiltrados = tickets.filter(t => {
        if (filtro === "todos") return true;
        return t.estado === filtro;
    });

    if (ticketsFiltrados.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-4 text-muted">
                    No hay solicitudes registradas con este criterio.
                </td>
            </tr>
        `;
        return;
    }

    tabla.innerHTML = ticketsFiltrados.slice().reverse().map(t => `
        <tr>
            <td class="fw-bold">${t.id}</td>
            <td class="small text-muted">${t.fecha}</td>
            <td>
                <div class="fw-bold small">${t.usuarioNombre || 'Cliente'}</div>
                <div class="text-muted small" style="font-size: 0.8rem;">${t.usuarioCorreo}</div>
            </td>
            <td><span class="badge bg-secondary">${t.tipo}</span></td>
            <td class="small">${t.producto}</td>
            <td>
                <span class="badge ${t.estado === 'Pendiente' ? 'bg-warning text-dark' : 'bg-success'}">
                    ${t.estado}
                </span>
            </td>
            <td class="text-center">
                <button 
                    class="btn btn-sm ${t.estado === 'Pendiente' ? 'btn-primary' : 'btn-outline-secondary'}" 
                    onclick="abrirModalResponder('${t.id}')">
                    ${t.estado === 'Pendiente' ? '💬 Responder' : '👁️ Ver / Editar'}
                </button>
            </td>
        </tr>
    `).join("");
}

// Carga los detalles del ticket en el Modal de respuesta
function abrirModalResponder(ticketId) {
    const tickets = JSON.parse(localStorage.getItem("tickets")) || [];
    const ticket = tickets.find(t => t.id === ticketId);

    if (!ticket) {
        alert("Ticket no encontrado.");
        return;
    }

    document.getElementById("modalTicketId").value = ticket.id;
    document.getElementById("modalTicketTitulo").textContent = `Gestionar Ticket: ${ticket.id}`;
    document.getElementById("modalTicketCliente").textContent = ticket.usuarioNombre || "Cliente";
    document.getElementById("modalTicketCorreo").textContent = ticket.usuarioCorreo;
    document.getElementById("modalTicketTipo").textContent = ticket.tipo;
    document.getElementById("modalTicketProducto").textContent = ticket.producto;
    document.getElementById("modalTicketMensaje").textContent = ticket.mensaje;
    
    // Rellenar respuesta si ya existe
    document.getElementById("modalTicketRespuesta").value = ticket.respuestaAdmin || "";
    document.getElementById("modalTicketEstado").value = ticket.estado || "Pendiente";

    // Abrir el modal usando la API de Bootstrap 5
    const modalElem = document.getElementById("modalResponderTicket");
    const modal = new bootstrap.Modal(modalElem);
    modal.show();
}

// Guarda la respuesta enviada por el Admin en localStorage
function guardarRespuestaAdmin(e) {
    e.preventDefault();

    const ticketId = document.getElementById("modalTicketId").value;
    const respuestaText = document.getElementById("modalTicketRespuesta").value.trim();
    const nuevoEstado = document.getElementById("modalTicketEstado").value;

    let tickets = JSON.parse(localStorage.getItem("tickets")) || [];
    const index = tickets.findIndex(t => t.id === ticketId);

    if (index !== -1) {
        tickets[index].respuestaAdmin = respuestaText;
        tickets[index].estado = nuevoEstado;
        tickets[index].fechaRespuesta = new Date().toLocaleString("es-CL");

        localStorage.setItem("tickets", JSON.stringify(tickets));

        alert(`Ticket ${ticketId} actualizado con éxito.`);

        // Ocultar modal
        const modalElem = document.getElementById("modalResponderTicket");
        const modal = bootstrap.Modal.getInstance(modalElem);
        if (modal) modal.hide();

        // Refrescar la tabla
        renderizarTicketsAdmin();
    }
}