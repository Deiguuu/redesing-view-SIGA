// Registro de asistencia
const estudiantes = [
  { nombre: "Diego Jose Roque Tercero", carnet: "DJRT-43545-43545" },
  { nombre: "Andrea López Méndez", carnet: "ALM-12345-78901" },
  { nombre: "Carlos Pinto Rivera", carnet: "CPR-23456-89012" },
  { nombre: "Marta Ávila Delgado", carnet: "MAD-34567-90123" },
  { nombre: "Luis Fernando Núñez", carnet: "LFN-45678-01234" },
  { nombre: "Julia Torres Vega", carnet: "JTV-56789-12345" },
  { nombre: "Samuel Romero Ortega", carnet: "SRO-67890-23456" },
  { nombre: "Natalia Díaz Paredes", carnet: "NDP-78901-34567" },
  { nombre: "Eduardo Peralta Guzmán", carnet: "EPG-89012-45678" },
  { nombre: "Gabriela Moreno Reyes", carnet: "GMR-90123-56789" },
  { nombre: "Ana Karina Zepeda", carnet: "AKZ-01234-67890" },
  { nombre: "Héctor Salazar Mejía", carnet: "HSM-12345-78901" },
];

const estadosAsistencia = {
  pendiente: { texto: "Pendiente", icono: "\u26A0", clase: "pendiente" },
  presente: { texto: "Presente", icono: "\u2714", clase: "presente" },
  tardanza: { texto: "Tardanza", icono: "\u23F0", clase: "tardanza" },
  justificado: { texto: "Justificado", icono: "\u2709", clase: "justificado" },
  ausente: { texto: "Ausente", icono: "\u2B1B", clase: "ausente" },
};

const asistenciaRegistro = {};

function obtenerIniciales(nombre) {
  return nombre
    .split(" ")
    .map(p => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function generarColor(nombre) {
  let hash = 0;
  for (let i = 0; i < nombre.length; i++) {
    hash = nombre.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 70%, 50%)`;
}

function crearFila(est, index) {
  const iniciales = obtenerIniciales(est.nombre);
  const color = generarColor(est.nombre);
  return `
    <tr>
      <td>
        <div class="nombre-con-avatar">
          <div class="avatar" style="background-color: ${color};">${iniciales}</div>
          <div><strong>${est.nombre}</strong><br><span style="color: #888; font-size: 0.85rem;">${est.carnet}</span></div>
        </div>
      </td>
      <td>
        <select class="estado-toggle ${estadosAsistencia.pendiente.clase}" onchange="actualizarEstado(this, ${index})">
          ${Object.entries(estadosAsistencia).map(([key, estado]) =>
            `<option value="${key}">${estado.icono} ${estado.texto}</option>`).join('')}
        </select>
      </td>
      <td><input type="text" placeholder="Observación opcional" id="obs-${index}" /></td>
    </tr>
  `;
}

function actualizarEstado(selectEl, index) {
  const estado = selectEl.value;
  selectEl.className = `estado-toggle ${estadosAsistencia[estado].clase}`;
  asistenciaRegistro[estudiantes[index].carnet] = {
    estado,
    observacion: document.getElementById(`obs-${index}`).value
  };
}

function cargarEstudiantes() {
  document.getElementById("tablaEstudiantes").innerHTML = estudiantes.map(crearFila).join("");
}

function marcarTodosPresentes() {
  const selects = document.querySelectorAll(".estado-toggle");
  selects.forEach((select, i) => {
    select.value = "presente";
    actualizarEstado(select, i);
  });
}

function guardarTodo() {
  const total = estudiantes.length;
  const registrados = Object.keys(asistenciaRegistro).length;

  if (registrados < total) {
    mostrarToast("No se pudo guardar: falta registrar asistencia.", "error");
    return;
  }

  console.log("Registro de asistencia:", asistenciaRegistro);
  mostrarToast("Datos de asistencia guardados correctamente.", "success");
}

function mostrarToast(mensaje, tipo = "success") {
  const toast = document.getElementById("toast");
  const message = document.getElementById("toast-message");

  toast.classList.remove("hidden", "success", "error", "show");
  toast.classList.add(tipo);
  message.textContent = mensaje;

  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.classList.add("hidden"), 300);
  }, 3000);
}

cargarEstudiantes();

// Flatpickr configuración
flatpickr("#fecha-header", {
  dateFormat: "j \\de F \\de Y", // Formato de fecha
  locale: "es",                  // Localización en español
  defaultDate: "today"           // Fecha por defecto: hoy
});

// Tabs dinámicas
const tabs = document.querySelectorAll('.tab');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    console.log(`Tab activa: ${tab.dataset.tab}`);
  });
});
