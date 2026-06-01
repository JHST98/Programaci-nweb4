const API_BASE = "/api/products";
const API_CATEGORIES = "/api/categories";

async function cargarCategorias() {
  const select = document.getElementById("categoryId");
  if (!select) return;

  try {
    const res = await fetch(API_CATEGORIES);
    const categorias = await res.json();
    select.innerHTML = '<option value="">Selecciona una categoría...</option>';
    categorias.forEach(c => {
      select.innerHTML += `<option value="${c._id}">${escapeHtml(c.name)}</option>`;
    });
  } catch (err) {
    console.error("Error al cargar categorías:", err);
  }
}

async function cargarProductos() {
  const lista = document.getElementById("lista");
  if (!lista) return;

  try {
    const res = await fetch(API_BASE);
    if (res.redirected) return;
    
    const productos = await res.json();
    renderizar(productos);
  } catch (err) {
    console.error("Error al cargar productos:", err);
  }
}

function renderizar(productos) {
  const lista = document.getElementById("lista");
  if (!lista) return;
  lista.innerHTML = "";
  productos.forEach(p => {
    const card = document.createElement("div");
    card.className = "producto-card";
    const img = p.imageUrl || p.imagen;
    const precio = p.price !== undefined ? p.price : p.precio;
    const nombre = p.name || p.nombre || "Sin nombre";
    const desc = p.description || p.descripcion || "";
    const cat = p.categoryId ? p.categoryId.name : "Sin categoría";
    const stock = p.stock !== undefined ? p.stock : 0;
    const catId = p.categoryId ? p.categoryId._id : "";

    card.innerHTML = `
      ${img ? `<img src="${img}">` : '<div style="height:200px; background:#f1f5f9; display:flex; align-items:center; justify-content:center; color:#94a3b8; border-radius:12px; margin-bottom:1rem;">Sin imagen</div>'}
      <div class="precio">$${precio}</div>
      <h3>${escapeHtml(nombre)}</h3>
      <div style="font-size:0.85rem; color:#64748b; margin-bottom:0.5rem;">
        <span style="background:#e2e8f0; padding:0.2rem 0.6rem; border-radius:20px; font-weight:600;">📁 ${escapeHtml(cat)}</span>
        <span style="margin-left:0.5rem; background:#dcfce7; color:#15803d; padding:0.2rem 0.6rem; border-radius:20px; font-weight:600;">📦 Stock: ${stock}</span>
      </div>
      <p style="color:var(--text-muted); margin-bottom:1.5rem;">${escapeHtml(desc)}</p>
      <div class="card-actions">
        <button onclick="prepararEdicion('${p._id}', '${escapeHtml(nombre)}', ${precio}, '${escapeHtml(desc)}', ${stock}, '${catId}')" style="background:#f1f5f9; color:var(--text-main);">Editar</button>
        <button onclick="eliminar('${p._id}')" class="btn-danger">Eliminar</button>
      </div>
    `;
    lista.appendChild(card);
  });
}

window.prepararEdicion = (id, nombre, precio, descripcion, stock, categoryId) => {
  document.getElementById("productoId").value = id;
  document.getElementById("nombre").value = nombre;
  document.getElementById("precio").value = precio;
  document.getElementById("descripcion").value = descripcion;
  document.getElementById("stock").value = stock;
  document.getElementById("categoryId").value = categoryId;
  
  document.getElementById("formTitle").innerText = "Editar producto";
  document.getElementById("btnSubmit").innerText = "Guardar cambios";
  document.getElementById("btnCancelar").style.display = "block";
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

document.getElementById("btnCancelar")?.addEventListener("click", () => {
  resetForm();
});

function resetForm() {
  document.getElementById("formProducto").reset();
  document.getElementById("productoId").value = "";
  document.getElementById("formTitle").innerText = "Agregar nuevo producto";
  document.getElementById("btnSubmit").innerText = "Crear producto";
  document.getElementById("btnCancelar").style.display = "none";
}

window.eliminar = async (id) => {
  if (confirm("¿Eliminar este producto?")) {
    await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    cargarProductos();
  }
};

const form = document.getElementById("formProducto");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("productoId").value;
    const fd = new FormData();
    fd.append("name", document.getElementById("nombre").value);
    fd.append("price", document.getElementById("precio").value);
    fd.append("stock", document.getElementById("stock").value);
    fd.append("categoryId", document.getElementById("categoryId").value);
    fd.append("description", document.getElementById("descripcion").value);
    const file = document.getElementById("imagen").files[0];
    if (file) fd.append("imageUrl", file);

    const url = id ? `${API_BASE}/${id}` : API_BASE;
    const method = id ? "PUT" : "POST";

    await fetch(url, { method, body: fd });
    resetForm();
    cargarProductos();
  });
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str).replace(/[&<>]/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[m] || m));
}

cargarCategorias();
cargarProductos();

// Sockets para actualización en tiempo real y Chat
const socket = io();

socket.on("producto_creado", cargarProductos);
socket.on("producto_actualizado", cargarProductos);
socket.on("producto_eliminado", cargarProductos);

// --- LÓGICA DE CHAT ---
const chatBox = document.getElementById("chat-mensajes");
const msgInput = document.getElementById("mensajeInput");
const btnEnviar = document.getElementById("enviarBtn");

if (chatBox) {
  socket.on("historial", (mensajes) => {
    chatBox.innerHTML = "";
    mensajes.forEach(appendMessage);
    scrollToBottom();
  });

  socket.on("chat message", (data) => {
    appendMessage(data);
    scrollToBottom();
  });

  const enviarMsg = () => {
    const mensaje = msgInput.value.trim();
    if (mensaje) {
      socket.emit("chat message", { mensaje });
      msgInput.value = "";
    }
  };

  btnEnviar.addEventListener("click", enviarMsg);
  msgInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") enviarMsg();
  });
}

function appendMessage(data) {
  if (!chatBox) return;
  const div = document.createElement("div");
  div.className = "msg";
  const fecha = new Date(data.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  div.innerHTML = `<b>${escapeHtml(data.usuario)}</b> <small style="color:var(--text-muted)">${fecha}</small><br> ${escapeHtml(data.mensaje)}`;
  chatBox.appendChild(div);
}

function scrollToBottom() {
  if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
}