// Objeto con la lista de comunas por región
const comunasPorRegion = {
    "RM": ["Santiago", "Providencia", "Maipú", "Las Condes"],
    "AR": ["Temuco", "Padre Las Casas", "Villarrica"],
    "NB": ["Chillán", "Linares", "Longaví", "Concepción"]
};

// Función para cambiar las comunas según la región seleccionada
function cargarComunas() {
    const regionSelect = document.getElementById("region").value;
    const comunaSelect = document.getElementById("comuna");
    
    comunaSelect.innerHTML = '<option value="">-- Seleccione la comuna --</option>';

    if (regionSelect && comunasPorRegion[regionSelect]) {
        const lista = comunasPorRegion[regionSelect];
        for (let i = 0; i < lista.length; i++) {
            comunaSelect.innerHTML += `<option value="${lista[i]}">${lista[i]}</option>`;
        }
        comunaSelect.disabled = false;
    } else {
        comunaSelect.disabled = true;
    }
}

// Función para validar y guardar el registro
function validarRegistro(e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const run = document.getElementById("run").value.trim();
    const correo = document.getElementById("correo").value.trim().toLowerCase();
    const pass = document.getElementById("password").value;
    const confirm = document.getElementById("confirm-password").value;
    const telefono = document.getElementById("telefono").value.trim();
    const region = document.getElementById("region").value;
    const comuna = document.getElementById("comuna").value;

    // Validar contraseñas
    if (pass !== confirm) {
        alert("Las contraseñas no coinciden.");
        return;
    }

    // Validar dominios permitidos
    if (!correo.endsWith("@duoc.cl") && !correo.endsWith("@profesor.duoc.cl") && !correo.endsWith("@gmail.com")) {
        alert("Dominio de correo no permitido. Debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com");
        return;
    }

    // Obtener usuarios guardados o inicializar un arreglo vacío
    const usuariosGuardados = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Verificar si el correo ya existe
    const existeUsuario = usuariosGuardados.some(user => user.correo === correo);
    if (existeUsuario) {
        alert("El correo electrónico ya se encuentra registrado.");
        return;
    }

    // Crear objeto del nuevo usuario
    const nuevoUsuario = {
        nombre,
        run,
        correo,
        password: pass,
        telefono,
        region,
        comuna
    };

    // Guardar usuario en el arreglo y actualizar localStorage
    usuariosGuardados.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuariosGuardados));

    alert("¡Usuario registrado con éxito!");
    window.location.href = "login.html";
}