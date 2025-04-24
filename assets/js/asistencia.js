// Registro de asistencia

// Lista general de estudiantes
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
  { nombre: "Héctor Salazar Mejía", carnet: "HSM-12345-78901" }
];

// Definición de estados de asistencia
const estadosAsistencia = {
  pendiente: { texto: "Pendiente", icono: "\u26A0", clase: "pendiente" },
  presente: { texto: "Presente", icono: "\u2714", clase: "presente" },
  tardanza: { texto: "Tardanza", icono: "\u23F0", clase: "tardanza" },
  justificado: { texto: "Justificado", icono: "\u2709", clase: "justificado" },
  ausente: { texto: "Ausente", icono: "\u2B1B", clase: "ausente" }
};

// Registro de la asistencia
const asistenciaRegistro = {};

// Función para obtener las iniciales del nombre
function obtenerIniciales(nombre) {
  return nombre
    .split(" ")
    .map(p => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// Función para generar un color único
function generarColor(nombre) {
  let hash = 0;
  for (let i = 0; i < nombre.length; i++) {
    hash = nombre.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 70%, 50%)`;
}

// Distribuir estudiantes en grupos según materia:
// Dividimos la lista de 12 estudiantes en 4 grupos de 3 para asignarlos arbitrariamente a cada materia.
const estudiantesPorMateria = {
  "todas": estudiantes,
  "prog-web": estudiantes.slice(0, 3),
  "prog-android": estudiantes.slice(3, 6),
  "prog-ios": estudiantes.slice(6, 9),
  "prog-py": estudiantes.slice(9, 12)
};

// Mapeo de valores del select a nombres descriptivos
const nombreMaterias = {
  "todas": "Todas las materias",
  "prog-web": "Programación Web",
  "prog-android": "Programación Android",
  "prog-ios": "Programación iOS",
  "prog-py": "Programación Python"
};

// Función para crear la fila de la tabla para cada estudiante
function crearFila(est) {
  const iniciales = obtenerIniciales(est.nombre);
  const color = generarColor(est.nombre);
  return `
    <tr>
      <td>
        <div class="nombre-con-avatar">
          <div class="avatar" style="background-color: ${color};">${iniciales}</div>
          <div>
            <strong>${est.nombre}</strong><br>
            <span style="color: #888; font-size: 0.85rem;">${est.carnet}</span>
          </div>
        </div>
      </td>
      <td>
        <select class="estado-toggle ${estadosAsistencia.pendiente.clase}" data-carnet="${est.carnet}" onchange="actualizarEstado(this, '${est.carnet}')">
          ${Object.entries(estadosAsistencia)
            .map(([key, estado]) => `<option value="${key}">${estado.icono} ${estado.texto}</option>`)
            .join('')}
        </select>
      </td>
      <td>
        <input type="text" placeholder="Observación opcional" id="obs-${est.carnet}" />
      </td>
    </tr>
  `;
}

// Actualiza el estado de un estudiante
function actualizarEstado(selectEl, carnet) {
  const estado = selectEl.value;
  selectEl.className = `estado-toggle ${estadosAsistencia[estado].clase}`;
  asistenciaRegistro[carnet] = {
    estado,
    observacion: document.getElementById(`obs-${carnet}`).value
  };
}

// Carga los estudiantes en la tabla según el filtro de materia seleccionado
function cargarEstudiantes(filtro = "todas") {
  const lista = estudiantesPorMateria[filtro] || [];
  document.getElementById("tablaEstudiantes").innerHTML = lista.map(crearFila).join("");
  // Actualiza el número total de estudiantes mostrados
  document.getElementById("total-estudiantes").textContent = `${lista.length} estudiantes`;
}

// Marca todos los estudiantes como presentes (en la vista actual)
function marcarTodosPresentes() {
  const selects = document.querySelectorAll(".estado-toggle");
  selects.forEach(select => {
    const carnet = select.getAttribute("data-carnet");
    select.value = "presente";
    actualizarEstado(select, carnet);
  });
}

// Guarda el registro de asistencia
function guardarTodo() {
  const totalActual = Object.values(estudiantesPorMateria)[0].length; // total de estudiantes en "Todas"
  const registrados = Object.keys(asistenciaRegistro).length;
  if (registrados < totalActual) {
    mostrarToast("No se pudo guardar: falta registrar asistencia.", "error");
    return;
  }
  console.log("Registro de asistencia:", asistenciaRegistro);
  mostrarToast("Datos de asistencia guardados correctamente.", "success");
}

// Muestra una notificación temporal (Toast)
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

// Configuración de Flatpickr para el input de fecha
flatpickr("#fecha-header", {
  dateFormat: "j \\de F \\de Y",
  locale: "es",
  defaultDate: "today",
  onChange: function(selectedDates) {
    const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    const fecha = selectedDates[0];
    if (fecha) {
      const texto = `${dias[fecha.getDay()]}, ${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`;
      document.getElementById("fecha-pill").textContent = texto;
    }
  }
});

// Evento para el cambio de materia en el select
document.getElementById("materia-toggle").addEventListener("change", function() {
  const valor = this.value;
  // Carga la lista correspondiente de estudiantes
  cargarEstudiantes(valor);
  // Actualiza el subtítulo en el header
  document.getElementById("materia-subtext").textContent = nombreMaterias[valor] || "Todas las materias";
});

// Al cargar la página, inicializamos con "Todas las materias"
cargarEstudiantes("todas");
document.getElementById("materia-toggle").value = "todas";
document.getElementById("materia-subtext").textContent = nombreMaterias["todas"];
