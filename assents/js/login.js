function validarLogin(event) {
    event.preventDefault();

    const correo = document.getElementById("correo").value.trim().toLowerCase();
    const password = document.getElementById("password").value;

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