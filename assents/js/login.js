// Función principal para procesar e iniciar sesión
function validarLogin(event) {
    // 1. Evitar que el formulario se recargue/envíe automáticamente
    event.preventDefault();

    // 2. Capturar y limpiar valores de los inputs
    const correo = document.getElementById("correo").value.trim().toLowerCase();
    const password = document.getElementById("password").value;

    // 3. Validar RF-02: Dominios de correo permitidos
    const dominiosPermitidos = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com", "@techgaming.cl"];
    const esDominioValido = dominiosPermitidos.some(dominio => correo.endsWith(dominio));

    if (!esDominioValido) {
        alert("El dominio del correo ingresado no está permitido. Solo se aceptan correos @duoc.cl, @profesor.duoc.cl, @gmail.com o @techgaming.cl.");
        return; // Detiene la ejecución
    }

    // 4. Caso Especial: Validar usuario Administrador
    if (correo === "admin@duoc.cl" && password === "admin") {
        const usuarioAdmin = {
            nombre: "Administrador",
            correo: "admin@duoc.cl",
            rol: "admin"
        };
        
        // Guardar sesión activa en localStorage
        localStorage.setItem("usuarioLogueado", JSON.stringify(usuarioAdmin));
        
        alert("¡Bienvenido Administrador!");
        window.location.href = "userAdmin.html";
        return;
    }

    // 5. Obtener lista de usuarios registrados previamente desde localStorage
    const usuariosRegistrados = JSON.parse(localStorage.getItem("usuarios")) || [];

    // 6. Buscar si el correo y la contraseña coinciden
    const usuarioValido = usuariosRegistrados.find(
        user => user.correo.toLowerCase() === correo && user.password === password
    );

    // 7. Resultado del inicio de sesión
    if (usuarioValido) {
        // Guardar la sesión activa del usuario regular
        localStorage.setItem("usuarioLogueado", JSON.stringify(usuarioValido));

        alert(`¡Bienvenido de nuevo, ${usuarioValido.nombre}!`);
        
        // Redirigir a la página principal
        window.location.href = "user.html";
    } else {
        alert("Correo electrónico o contraseña incorrectos.");
    }
}