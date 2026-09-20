function validarLogin(event) {
    event.preventDefault();

    const correo = document.getElementById("correo").value.trim().toLowerCase();
    const password = document.getElementById("password").value;

    // --- NUEVO: Validar RF-02 (Dominios permitidos) ---
    const dominiosPermitidos = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com", "@techgaming.cl"];
    const esDominioValido = dominiosPermitidos.some(dominio => correo.endsWith(dominio));

    if (!esDominioValido) {
        alert("El dominio del correo ingresado no está permitido. Solo se aceptan correos @duoc.cl, @profesor.duoc.cl, @gmail.com o @techgaming.cl.");
        return; // Detiene la ejecución si el dominio no es válido
    }
    // -------------------------------------------------

    // 1. Validar si es el usuario Administrador
    if (correo === "admin@duoc.cl" && password === "admin") {
        const usuarioAdmin = {
            nombre: "Administrador",
            correo: "admin@duoc.cl",
            rol: "admin"
        };
        // Guardamos la sesión activa en sessionStorage
        sessionStorage.setItem("usuarioLogueado", JSON.stringify(usuarioAdmin));
        
        alert("¡Bienvenido Administrador!");
        window.location.href = "userAdmin.html";
        return;
    }

    // 2. Obtener la lista de usuarios registrados desde localStorage
    const usuariosRegistrados = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Buscar si existe un usuario que coincida con el correo y contraseña
    const usuarioValido = usuariosRegistrados.find(
        user => user.correo.toLowerCase() === correo && user.password === password
    );

    // 3. Redirección o mensaje de error
    if (usuarioValido) {
        // Guardamos la sesión activa en sessionStorage
        sessionStorage.setItem("usuarioLogueado", JSON.stringify(usuarioValido));

        alert(`¡Bienvenido de nuevo, ${usuarioValido.nombre}!`);
        window.location.href = "user.html";
    } else {
        alert("Correo electrónico o contraseña incorrectos.");
    }
}