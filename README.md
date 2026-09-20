# 🎮 TechGaming - Plataforma E-Commerce & Módulo Postventa

![Versión](https://img.shields.io/badge/Versi%C3%B3n-1.0.0-blue.svg)
![Licencia](https://img.shields.io/badge/Licencia-Duoc%20UC-orange.svg)
![Tecnologías](https://img.shields.io/badge/Tech-HTML5%20%7C%20CSS3%20%7C%20Bootstrap%205.3.3%20%7C%20JS%20Vanilla-brightgreen.svg)

Plataforma web de e-commerce y gestión postventa enfocada en la cotización, compra de hardware gaming de alto rendimiento y soporte técnico personalizado. Este proyecto fue desarrollado para la Escuela de Informática y Telecomunicaciones de **Duoc UC** bajo la especificación de requisitos del estándar **IEEE 830**.

---

## 👥 Integrantes del Equipo

* **Moisés Andrés Fonseca Viveros**
* **Joaquín Alejandro Pérez Martínez**
* **Emilio Francisco Núñez Trigo**

* ##  Usuario administrador:  admin@duoc.cl
* ##  Pass administrador:     admin

**Asignatura:** Desarrollo Fullstack II (DSY1104)  
**Institución:** Duoc UC — Escuela de Informática y Telecomunicaciones  
**Fecha de Entrega:** 19 de Septiembre de 2026  

---

## 🚀 Características Principales

### 🛒 Tienda Pública y Cliente
- **Catálogo Dinámico (RF-03):** Visualización y filtrado de componentes y periféricos de PC con precios y especificaciones.
- **Carrito de Compras Interactivo (RF-04):** Adición/eliminación de productos, modificación de cantidades y recálculo automático de subtotales.
- **Módulo Postventa y Asesoría (RF-07):** Formulario interactivo para generación de tickets de soporte técnico, asesoría de compatibilidad y garantías.
- **Registro y Autenticación (RF-01, RF-02):** Registro de clientes con validación de RUT y control de acceso por dominios permitidos (`@duoc.cl`, `@profesor.duoc.cl`, `@gmail.com` y `@techgaming.cl`).
- **Sección de Blogs y Noticias:** Artículos educativos para la comunidad gaming sobre armado y optimización de computadores.

### ⚙️ Panel de Administración (Dashboard Admin)
- **CRUD de Catálogo e Inventario (RF-06):** Módulo completo para crear, editar, actualizar stock y eliminar piezas informáticas.
- **Gestión de Usuarios y Roles (RF-08, RF-09):** Control centralizado de usuarios con asignación de roles (`Cliente`, `Asesor Técnico`, `Administrador`).
- **Gestión de Tickets de Soporte (RF-07):** Panel de seguimiento, cambio de estado y respuesta técnica a las consultas postventa.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:** HTML5 Semántico, CSS3, JavaScript Vanilla (ES6+).
- **Framework UI:** Bootstrap 5.3.3.
- **Persistencia de Datos:** `localStorage` & `sessionStorage` (HTML5 Web Storage API).
- **Control de Versiones & IDE:** Git, GitHub y Visual Studio Code.

---

## 📁 Estructura del Proyecto

```text
TechGaming/
│
├── assents/
│   ├── css/
│   ├── img/
│   └── js/
│       ├── adminTickets.js     # Gestión y respuesta de tickets de soporte admin
│       ├── carrito.js          # Lógica del carrito de compras
│       ├── datos.js            # Precarga inicial de datos en localStorage
│       ├── login.js            # Autenticación y validación de usuarios
│       ├── productos.js        # Carga dinámica y filtrado del catálogo
│       ├── registro.js         # Registro de nuevos usuarios y validaciones
│       ├── soporte.js          # Módulo de soporte y postventa
│       ├── userAdmin.js        # CRUD de productos y gestión de usuarios/roles
│       └── usuarioLogueado.js  # Control de estado de sesión
│
├── blogs.html                  # Sección de blogs y noticias gaming
├── carrito.html                # Carrito de compras y checkout
├── contacto.html               # Formulario de contacto directo
├── detalle-blog1.html          # Artículo de blog 1
├── detalle-blog2.html          # Artículo de blog 2
├── detalle-producto.html       # Vista detallada de un producto
├── index.html                  # Página principal de bienvenida
├── login.html                  # Inicio de sesión
├── nosotros.html               # Información sobre la empresa
├── productos.html              # Catálogo interactivo de componentes
├── registro.html               # Formulario de registro
├── user.html                   # Perfil del usuario / cliente
├── userAdmin.html              # Panel de control del Administrador
└── README.md                   # Documentación del proyecto
