// js/datos.js

const PRODUCTOS_INICIALES = [
    {
        id: 1,
        codigo: "TECL-001",
        nombre: "Teclado Mecánico RGB Redragon Kumara",
        precio: 34990,
        categoria: "Periféricos",
        stock: 12,
        imagen: "assents/img/teclado.jpg",
        descripcion: "Teclado mecánico compacto con switches red y retroiluminación RGB configurable."
    },
    {
        id: 2,
        codigo: "MOU-002",
        nombre: "Mouse Gamer Logitech G203 Lightsync",
        precio: 21990,
        categoria: "Periféricos",
        stock: 20,
        imagen: "assents/img/mouse.jpg",
        descripcion: "Sensor óptico de alta precisión hasta 8,000 DPI e iluminación RGB personalizable."
    },
    {
        id: 3,
        codigo: "AUD-003",
        nombre: "Audífonos Gamer HyperX Cloud II",
        precio: 68990,
        categoria: "Periféricos",
        stock: 8,
        imagen: "assents/img/audifonos.jpg",
        descripcion: "Sonido envolvente 7.1, almohadillas de espuma viscoelástica y micrófono con cancelación de ruido."
    },
    {
        id: 4,
        codigo: "MON-004",
        nombre: "Monitor Gaming ASUS TUF 24\" 165Hz",
        precio: 149900,
        categoria: "Monitores",
        stock: 5,
        imagen: "assents/img/monitor.jpg",
        descripcion: "Pantalla Full HD IPS con 1ms de tiempo de respuesta y soporte FreeSync Premium."
    },
    {
        id: 5,
        codigo: "GPU-005",
        nombre: "Tarjeta de Video NVIDIA RTX 4060 8GB",
        precio: 349900,
        categoria: "Componentes",
        stock: 4,
        imagen: "assents/img/gpu.jpg",
        descripcion: "Arquitectura Ada Lovelace con trazado de rayos y tecnología DLSS 3."
    },
    {
        id: 6,
        codigo: "CPU-006",
        nombre: "Procesador AMD Ryzen 5 5600X",
        precio: 139900,
        categoria: "Componentes",
        stock: 10,
        imagen: "assents/img/procesador.jpg",
        descripcion: "6 núcleos y 12 hilos hasta 4.6 GHz, ideal para gaming de alto rendimiento."
    },
    {
        id: 7,
        codigo: "SIL-007",
        nombre: "Silla Gamer Ergonomica Cougar Armour",
        precio: 129900,
        categoria: "Accesorios",
        stock: 3,
        imagen: "assents/img/silla.jpg",
        descripcion: "Diseño ergonómico con reclinación de 180 grados y soporte lumbar regulable."
    },
    {
        id: 8,
        codigo: "PAD-008",
        nombre: "Mousepad XL RGB Razer Goliathus",
        precio: 18990,
        categoria: "Accesorios",
        stock: 15,
        imagen: "assents/img/mousepad.jpg",
        descripcion: "Superficie de microtextura optimizada para todo tipo de sensores e iluminación bordada."
    }
];

// Cargar en localStorage si está vacío
function inicializarProductos() {
    if (!localStorage.getItem("productos")) {
        localStorage.setItem("productos", JSON.stringify(PRODUCTOS_INICIALES));
    }
}

inicializarProductos();