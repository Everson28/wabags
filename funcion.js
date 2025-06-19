// ===============================
// LISTA DE PRODUCTOS DISPONIBLES
// ===============================
const productos = [
  { nombre: "Bolso Wayuu Tradicional", precio: 80000, img: "image/B1.jpg" },
  { nombre: "Bolso Premium", precio: 120000, img: "image/B2.jpg" },
  { nombre: "Accesorio Artesanal", precio: 30000, img: "image/B3.jpg" }
];

// ==========================================
// FUNCIONES DE GESTIÓN DEL CARRITO DE COMPRAS
// ==========================================

// Obtener carrito desde localStorage (si no hay, retorna array vacío)
const getCarrito = () => JSON.parse(localStorage.getItem("carrito")) || [];

// Guardar carrito actualizado en localStorage
const setCarrito = carrito => localStorage.setItem("carrito", JSON.stringify(carrito));

// Agregar producto al carrito (si ya existe, incrementa la cantidad)
function agregarAlCarrito(nombre) {
  const carrito = getCarrito();
  const producto = productos.find(p => p.nombre === nombre);
  const existente = carrito.find(p => p.nombre === nombre);

  if (existente) existente.cantidad++;
  else carrito.push({ ...producto, cantidad: 1 });

  setCarrito(carrito);
  actualizarContador();
  actualizarCarrito();
}

// Eliminar producto completamente del carrito
function eliminarDelCarrito(nombre) {
  let carrito = getCarrito();
  carrito = carrito.filter(p => p.nombre !== nombre);
  setCarrito(carrito);
  actualizarContador();
  actualizarCarrito();
}

// Cambiar cantidad de un producto (+1 o -1)
function cambiarCantidad(nombre, cambio) {
  const carrito = getCarrito();
  const producto = carrito.find(p => p.nombre === nombre);
  if (producto) {
    producto.cantidad += cambio;
    if (producto.cantidad <= 0) return eliminarDelCarrito(nombre);
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

// Actualizar contador de cantidad en el ícono flotante
function actualizarContador() {
  const total = getCarrito().reduce((sum, p) => sum + p.cantidad, 0);
  const contador = document.getElementById("contador-carrito");
  if (contador) contador.textContent = total || "";
}

// Actualizar visualización del carrito flotante con productos
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
      <img src="${p.img}" width="30">
      <strong>${p.nombre}</strong><br>
      <span>$${p.precio} x ${p.cantidad} = $${p.precio * p.cantidad}</span><br>
      <button onclick="cambiarCantidad('${p.nombre}', -1)">➖</button>
      <button onclick="cambiarCantidad('${p.nombre}', 1)">➕</button>
      <button onclick="eliminarDelCarrito('${p.nombre}')">❌</button>
    `;
    lista.appendChild(li);
    totalCompra += p.precio * p.cantidad;
  });

  if (subtotal) subtotal.textContent = `$${totalCompra}`;
  if (total) total.textContent = totalCompra;
}

// Mostrar u ocultar carrito flotante
function toggleCarritoFlotante() {
  const carrito = document.getElementById("carrito");
  carrito.style.display = carrito.style.display === "block" ? "none" : "block";
}

// Redirigir a la página de checkout
function finalizarCompra() {
  const carrito = getCarrito();
  if (!carrito.length) return alert("Tu carrito está vacío");
  window.location.href = "checkout.html";
}

// Redirigir a la tienda de productos
function continuarComprando() {
  window.location.href = "productos.html";
}

// Inicialización al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  actualizarContador();
  actualizarCarrito();

  const icono = document.getElementById("carrito-icono");
  if (icono) icono.addEventListener("click", toggleCarritoFlotante);

  // 🔍 Buscador de productos
  const inputBusqueda = document.getElementById("input-busqueda");
  if (inputBusqueda) {
    inputBusqueda.addEventListener("input", function () {
      const filtro = this.value.toLowerCase();
      const productos = document.querySelectorAll(".product");
      productos.forEach(prod => {
        const nombre = prod.querySelector("h3").textContent.toLowerCase();
        prod.style.display = nombre.includes(filtro) ? "block" : "none";
      });
    });
  }

  // ✅ Solo para la página de checkout
  if (window.location.pathname.includes("checkout.html")) {
    const form = document.getElementById("form-checkout");
    if (form) {
      form.addEventListener("submit", enviarCheckout);
      mostrarResumenCheckout();
    }
  }
});


// ==================================
// FUNCIONES ESPECÍFICAS PARA CHECKOUT
// ==================================

// Mostrar resumen de productos y total en la página de checkout
function mostrarResumenCheckout() {
  const carrito = getCarrito();
  const resumen = document.getElementById("resumen-pedido");

  if (!carrito.length) {
    document.getElementById("checkout-contenido").style.display = "none";
    document.getElementById("checkout-vacio").style.display = "block";
    return;
  }

  if (!resumen) return;

  resumen.innerHTML = "";
  let total = 0;

  carrito.forEach(p => {
    const item = document.createElement("p");
    item.textContent = `${p.nombre} x${p.cantidad} = $${p.precio * p.cantidad}`;
    resumen.appendChild(item);
    total += p.precio * p.cantidad;
  });

  const totalP = document.createElement("p");
  totalP.innerHTML = `<strong>Total: $${total}</strong>`;
  resumen.appendChild(totalP);
}

// Enviar datos del checkout a WhatsApp
function enviarCheckout(e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const direccion = document.getElementById("direccion").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const metodoPago = document.querySelector("input[name='metodo-pago']:checked")?.value;
  const envio = document.getElementById("envio").value;

  if (!nombre || !direccion || !telefono || !metodoPago || !envio) {
    alert("Por favor completa todos los campos.");
    return;
  }

  const carrito = getCarrito();
  let mensaje = `🧵 *Pedido WABAGS*:\n\n`;

  carrito.forEach(p => {
    mensaje += `👜 ${p.nombre} x${p.cantidad} = $${p.precio * p.cantidad}\n`;
  });

  mensaje += `\n🚚 Envío: ${envio}`;
  mensaje += `\n💳 Pago: ${metodoPago}`;
  mensaje += `\n\n👤 Cliente: ${nombre}`;
  mensaje += `\n📍 Dirección: ${direccion}`;
  mensaje += `\n📞 Teléfono: ${telefono}`;
  mensaje += `\n\n✅ Por favor confirma tu pedido.`;

  const numero = "573042509530";
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");

  vaciarCarrito();
  window.location.href = "index.html";
}
// ===========================
// MODAL DE DETALLE DE PRODUCTO
// ===========================
document.addEventListener("DOMContentLoaded", () => {
  const productosDOM = document.querySelectorAll(".product img");
  productosDOM.forEach(img => {
    img.style.cursor = "pointer";
    img.addEventListener("click", () => {
      const card = img.parentElement;
      const nombre = card.querySelector("h3").textContent;
      const precio = card.querySelector("p").textContent;
      const imgSrc = img.src;

      document.getElementById("modal-nombre").textContent = nombre;
      document.getElementById("modal-precio").textContent = precio;
      document.getElementById("modal-img").src = imgSrc;

      const botonAgregar = document.getElementById("modal-agregar");
      botonAgregar.onclick = () => agregarAlCarrito(nombre);

      document.getElementById("modal-producto").style.display = "flex";
    });
  });
});

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
