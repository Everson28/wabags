// ===============================
// LISTA DE PRODUCTOS CENTRALIZADA
// ===============================
const productos = [
  { id: 1, nombre: "Bolso Wayuu Tradicional", precio: 80000, img: "image/B1.jpg", destacado: true, descripcion: "Mochila tradicional con diseños geométricos únicos." },
  { id: 2, nombre: "Bolso Premium", precio: 120000, img: "image/B2.jpg", destacado: true, descripcion: "Edición especial con acabados de lujo." },
  { id: 3, nombre: "Accesorio Artesanal", precio: 30000, img: "image/B3.jpg", destacado: true, descripcion: "Pequeño accesorio tejido a mano." },
  { id: 4, nombre: "Bolso Wayuu Multicolor", precio: 80000, img: "image/B4.jpg", destacado: false, descripcion: "Explosión de colores para tu outfit." },
  { id: 5, nombre: "Bolso Premium Elegante", precio: 120000, img: "image/B5.jpg", destacado: false, descripcion: "Elegancia y tradición en una sola pieza." },
  { id: 6, nombre: "Accesorio Tejido", precio: 30000, img: "image/B6.jpg", destacado: false, descripcion: "Detalle perfecto para regalar." },
  { id: 7, nombre: "Mochila Wayuu Clásica", precio: 80000, img: "image/B7.jpg", destacado: false, descripcion: "El diseño clásico que nunca pasa de moda." },
  { id: 8, nombre: "Bolso Premium Noche", precio: 120000, img: "image/B8.jpg", destacado: false, descripcion: "Ideal para eventos nocturnos." },
  { id: 9, nombre: "Pulsera Artesanal", precio: 30000, img: "image/B9.jpg", destacado: false, descripcion: "Lleva la cultura Wayuu en tu muñeca." },
  { id: 10, nombre: "Mochila Grande", precio: 80000, img: "image/B10.jpg", destacado: false, descripcion: "Gran capacidad y resistencia." }
];

// ==========================================
// FUNCIONES DE RENDERIZADO DE PRODUCTOS
// ==========================================

function renderizarProductos(contenedorId, filtrarDestacados = false) {
  const contenedor = document.getElementById(contenedorId);
  if (!contenedor) return;

  contenedor.innerHTML = "";

  const productosAMostrar = filtrarDestacados
    ? productos.filter(p => p.destacado)
    : productos;

  productosAMostrar.forEach(p => {
    const div = document.createElement("div");
    div.classList.add("product");
    div.innerHTML = `
      <img src="${p.img}" alt="${p.nombre}" onclick="abrirModal(${p.id})">
      <h3>${p.nombre}</h3>
      <p>$${p.precio.toLocaleString()}</p>
      <button class="btn" onclick="agregarAlCarrito(${p.id})">Agregar al carrito</button>
    `;
    contenedor.appendChild(div);
  });
}

// ==========================================
// FUNCIONES DE GESTIÓN DEL CARRITO DE COMPRAS
// ==========================================

// Obtener carrito desde localStorage
const getCarrito = () => JSON.parse(localStorage.getItem("carrito")) || [];

// Guardar carrito actualizado
const setCarrito = carrito => localStorage.setItem("carrito", JSON.stringify(carrito));

// Agregar producto al carrito por ID
function agregarAlCarrito(id) {
  const carrito = getCarrito();
  const producto = productos.find(p => p.id === id);

  if (!producto) return console.error("Producto no encontrado");

  const existente = carrito.find(p => p.id === id);

  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  setCarrito(carrito);
  actualizarContador();
  actualizarCarrito();

  // Feedback visual simple
  alert(`¡${producto.nombre} agregado al carrito!`);
}

// Eliminar producto del carrito por ID
function eliminarDelCarrito(id) {
  let carrito = getCarrito();
  carrito = carrito.filter(p => p.id !== id);
  setCarrito(carrito);
  actualizarContador();
  actualizarCarrito();
}

// Cambiar cantidad (+1 o -1)
function cambiarCantidad(id, cambio) {
  const carrito = getCarrito();
  const producto = carrito.find(p => p.id === id);
  if (producto) {
    producto.cantidad += cambio;
    if (producto.cantidad <= 0) return eliminarDelCarrito(id);
    setCarrito(carrito);
    actualizarCarrito();
    actualizarContador();
  }
}

// Vaciar todo el carrito
function vaciarCarrito() {
  localStorage.removeItem("carrito");
  actualizarContador();
  actualizarCarrito();
}

// Actualizar contador
function actualizarContador() {
  const total = getCarrito().reduce((sum, p) => sum + p.cantidad, 0);
  const contador = document.getElementById("contador-carrito");
  if (contador) contador.textContent = total || "0";
}

// Actualizar visualización del carrito flotante
function actualizarCarrito() {
  const carrito = getCarrito();
  const lista = document.getElementById("lista-carrito");
  const subtotal = document.getElementById("subtotal-valor");
  const total = document.getElementById("total-valor");

  if (!lista) return;

  let totalCompra = 0;
  lista.innerHTML = "";

  carrito.forEach(p => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <img src="${p.img}" width="40" style="border-radius: 5px;">
        <div>
          <strong>${p.nombre}</strong><br>
          <small>$${p.precio.toLocaleString()} x ${p.cantidad}</small>
        </div>
      </div>
      <div>
        <button onclick="cambiarCantidad(${p.id}, -1)">➖</button>
        <button onclick="cambiarCantidad(${p.id}, 1)">➕</button>
        <button onclick="eliminarDelCarrito(${p.id})" style="background:#ff4444;">❌</button>
      </div>
    `;
    lista.appendChild(li);
    totalCompra += p.precio * p.cantidad;
  });

  if (subtotal) subtotal.textContent = `$${totalCompra.toLocaleString()}`;
  if (total) total.textContent = `$${totalCompra.toLocaleString()}`;
}

// Mostrar u ocultar carrito flotante
function toggleCarritoFlotante() {
  const carrito = document.getElementById("carrito");
  carrito.style.display = carrito.style.display === "block" ? "none" : "block";
}

// Redirigir a checkout
function finalizarCompra() {
  const carrito = getCarrito();
  if (!carrito.length) return alert("Tu carrito está vacío");
  window.location.href = "checkout.html";
}

// Redirigir a productos
function continuarComprando() {
  window.location.href = "productos.html";
}

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  actualizarContador();
  actualizarCarrito();

  const icono = document.getElementById("carrito-icono");
  if (icono) icono.addEventListener("click", toggleCarritoFlotante);

  // Renderizado condicional según la página
  if (document.getElementById("featured-products-container")) {
    renderizarProductos("featured-products-container", true);
  }

  if (document.getElementById("all-products-container")) {
    renderizarProductos("all-products-container", false);
  }

  // Buscador
  const inputBusqueda = document.getElementById("input-busqueda");
  if (inputBusqueda) {
    inputBusqueda.addEventListener("input", function () {
      const filtro = this.value.toLowerCase();
      const productosDOM = document.querySelectorAll(".product");
      productosDOM.forEach(prod => {
        const nombre = prod.querySelector("h3").textContent.toLowerCase();
        prod.style.display = nombre.includes(filtro) ? "block" : "none";
      });
    });
  }

  // Checkout
  if (window.location.pathname.includes("checkout.html")) {
    const form = document.getElementById("formulario-checkout");
    if (form) {
      form.addEventListener("submit", enviarCheckout);
    }
    mostrarResumenCheckout();
  }
});


// ==================================
// FUNCIONES ESPECÍFICAS PARA CHECKOUT
// ==================================

// Mostrar resumen de productos y total en la página de checkout
function mostrarResumenCheckout() {
  const carrito = getCarrito();
  const resumen = document.getElementById("resumen-productos");
  const totalElement = document.getElementById("total");

  if (!resumen || !totalElement) return;

  if (!carrito.length) {
    resumen.innerHTML = "<p class='checkout-vacio'>Tu carrito está vacío.</p>";
    totalElement.textContent = "0";
    return;
  }

  resumen.innerHTML = "";
  let total = 0;

  carrito.forEach(p => {
    const item = document.createElement("p");
    item.textContent = `${p.nombre} x${p.cantidad} - $${(p.precio * p.cantidad).toLocaleString()} COP`;
    resumen.appendChild(item);
    total += p.precio * p.cantidad;
  });

  totalElement.textContent = total.toLocaleString();
}

// Enviar datos del checkout a WhatsApp
function enviarCheckout(e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const email = document.getElementById("email").value.trim();
  const direccion = document.getElementById("direccion").value.trim();
  const metodoEnvio = document.getElementById("metodo-envio").value;
  const metodoPago = document.querySelector("input[name='pago']:checked")?.value;

  if (!nombre || !email || !direccion || !metodoPago) {
    alert("Por favor completa todos los campos obligatorios.");
    return;
  }

  const carrito = getCarrito();
  let total = 0;

  let mensaje = `¡Hola! Quiero hacer un pedido en WABAGS:%0A`;
  mensaje += `👤 *Nombre:* ${nombre}%0A`;
  mensaje += `📧 *Correo:* ${email}%0A`;
  mensaje += `📍 *Dirección:* ${direccion}%0A`;
  mensaje += `🚚 *Envío:* ${metodoEnvio}%0A`;
  mensaje += `💳 *Pago:* ${metodoPago}%0A%0A`;
  mensaje += `🛍 *Productos:*%0A`;

  carrito.forEach(p => {
    const subtotal = p.precio * p.cantidad;
    mensaje += `- ${p.nombre} x${p.cantidad}: $${subtotal.toLocaleString()} COP%0A`;
    total += subtotal;
  });

  mensaje += `%0A� *Total:* $${total.toLocaleString()} COP`;
  mensaje += `%0A%0A✅ Por favor confirma mi pedido.`;

  const numero = "573042509530";
  const url = `https://wa.me/${numero}?text=${mensaje}`; // No need to encode again if we use %0A manually, but safer to use encodeURIComponent on the whole string if we didn't use %0A. 
  // Actually, mixing %0A and encodeURIComponent is tricky. Let's use standard newlines and encode everything.

  let mensajeFinal = `¡Hola! Quiero hacer un pedido en WABAGS:\n`;
  mensajeFinal += `👤 *Nombre:* ${nombre}\n`;
  mensajeFinal += `📧 *Correo:* ${email}\n`;
  mensajeFinal += `📍 *Dirección:* ${direccion}\n`;
  mensajeFinal += `� *Envío:* ${metodoEnvio}\n`;
  mensajeFinal += `💳 *Pago:* ${metodoPago}\n\n`;
  mensajeFinal += `🛍 *Productos:*\n`;

  carrito.forEach(p => {
    const subtotal = p.precio * p.cantidad;
    mensajeFinal += `- ${p.nombre} x${p.cantidad}: $${subtotal.toLocaleString()} COP\n`;
  });

  mensajeFinal += `\n💰 *Total:* $${total.toLocaleString()} COP`;

  window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensajeFinal)}`, "_blank");

  vaciarCarrito();
  window.location.href = "index.html";
}
// ===========================
// MODAL DE DETALLE DE PRODUCTO
// ===========================
// ===========================
// MODAL DE DETALLE DE PRODUCTO
// ===========================

function abrirModal(id) {
  const producto = productos.find(p => p.id === id);
  if (!producto) return;

  document.getElementById("modal-nombre").textContent = producto.nombre;
  document.getElementById("modal-precio").textContent = `$${producto.precio.toLocaleString()}`;
  document.getElementById("modal-img").src = producto.img;
  document.getElementById("modal-descripcion").textContent = producto.descripcion || "Producto artesanal Wayuu.";

  const botonAgregar = document.getElementById("modal-agregar");
  botonAgregar.onclick = () => {
    agregarAlCarrito(producto.id);
    cerrarModal();
  };

  document.getElementById("modal-producto").style.display = "flex";
}

// La inicialización de eventos de click ya no es necesaria aquí porque se agrega inline en el HTML generado


function cerrarModal() {
  document.getElementById("modal-producto").style.display = "none";
}


// ===========================
// FUNCIONES DEL CHAT WHATSAPP
// ===========================

// Mostrar/ocultar caja de chat flotante
function toggleChatBox() {
  const chatBox = document.getElementById('chat-box');
  chatBox.style.display = chatBox.style.display === 'flex' ? 'none' : 'flex';
}

// Enviar mensaje rápido desde el chat flotante
function enviarMensajeWhatsApp() {
  const mensaje = document.getElementById('mensajeChat').value;
  const numero = '573042509530';
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
}
