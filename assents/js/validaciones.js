// 1. Carga dinámica de comunas según la región
const comunas = {
    rm: ["Santiago", "Providencia", "Maipú", "Las Condes"],
    valpo: ["Valparaíso", "Viña del Mar", "Concón"]
};

const selectRegion = document.getElementById("region");
const selectComuna = document.getElementById("comuna");

if (selectRegion && selectComuna) {
    selectRegion.addEventListener("change", function () {
        const regionSel = selectRegion.value;
        selectComuna.innerHTML = '<option value="">-- Seleccione Comuna --</option>';

        if (regionSel && comunas[regionSel]) {
            const listaComunas = comunas[regionSel];

            for (let i = 0; i < listaComunas.length; i++) {
                const opt = document.createElement("option");
                opt.value = listaComunas[i];
                opt.textContent = listaComunas[i];
                selectComuna.appendChild(opt);
            }
            selectComuna.disabled = false;
        } else {
            selectComuna.disabled = true;
        }
    });
}

// 2. Validaciones del Formulario al presionar Registrar
const formRegistro = document.getElementById("form-registro");

if (formRegistro) {
    formRegistro.addEventListener("submit", function (e) {
        const runInput = document.getElementById("run");
        const correoInput = document.getElementById("correo");

        if (!runInput || !correoInput) return;

        const run = runInput.value.trim();
        const correo = correoInput.value.trim();

        // Validar RUN (entre 7 y 9 caracteres alfanuméricos, sin puntos ni guión)
        const regexRun = /^[0-9]{7,8}[0-9kK]{1}$/;
        if (!regexRun.test(run)) {
            alert("El RUN debe tener entre 7 y 9 caracteres, sin puntos ni guión (Ej: 19011022K).");
            e.preventDefault();
            return;
        }

        // Validar correo con dominios permitidos mediante validación estándar
        const dominios = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];
        let correoEsValido = false;

        for (let i = 0; i < dominios.length; i++) {
            if (correo.endsWith(dominios[i])) {
                correoEsValido = true;
                break;
            }
        }

        if (!correoEsValido) {
            alert("El correo debe terminar en @duoc.cl, @profesor.duoc.cl o @gmail.com");
            e.preventDefault();
            return;
        }

        alert("¡Registro completado exitosamente!");
    });
}