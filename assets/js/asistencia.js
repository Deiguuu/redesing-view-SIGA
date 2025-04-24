// Definición de estados de asistencia
const estadosAsistencia = {
  pendiente: { texto: "Pendiente", icono: "\u26A0", clase: "pendiente" },
  presente: { texto: "Presente", icono: "\u2714", clase: "presente" },
  tardanza: { texto: "Tardanza", icono: "\u23F0", clase: "tardanza" },
  justificado: { texto: "Justificado", icono: "\u2709", clase: "justificado" },
  ausente: { texto: "Ausente", icono: "\u2B1B", clase: "ausente" }
};

const materias = ["prog-web", "prog-android", "prog-ios", "prog-py"];
const grupos = ["grupo1", "grupo2", "grupo3"];

// Genera 12 estudiantes únicos por materia y grupo
function generarEstudiantes(materia, grupo) {
  const nombresBase = [
    "Diego Jose Roque Tercero", "Andrea López Méndez", "Carlos Pinto Rivera", "Marta Ávila Delgado",
    "Luis Fernando Núñez", "Julia Torres Vega", "Samuel Romero Ortega", "Natalia Díaz Paredes",
    "Eduardo Peralta Guzmán", "Gabriela Moreno Reyes", "Ana Karina Zepeda", "Héctor Salazar Mejía"
  ];
  return Array.from({ length: 12 }, (_, i) => ({
    nombre: `${nombresBase[i]} (${materia.replace('prog-', '').toUpperCase()} ${grupo.toUpperCase()})`,
    carnet: `${materia.toUpperCase()}-${grupo.toUpperCase()}-${(i + 1).toString().padStart(2, "0")}`
  }));
}

// Estructura: estudiantesPorMateriaYGrupo[materia][grupo] = [estudiantes...]
const estudiantesPorMateriaYGrupo = {};
materias.forEach(materia => {
  estudiantesPorMateriaYGrupo[materia] = {};
  grupos.forEach(grupo => {
    estudiantesPorMateriaYGrupo[materia][grupo] = generarEstudiantes(materia, grupo);
  });
});

// Para "todas", une todos los estudiantes de todas las materias y grupos
function obtenerTodosEstudiantes(grupo) {
  let todos = [];
  materias.forEach(materia => {
    todos = todos.concat(estudiantesPorMateriaYGrupo[materia][grupo]);
  });
  return todos;
}

// Mapeo de valores del select a nombres descriptivos
const nombreMaterias = {
  "todas": "Todas las materias",
  "prog-web": "Programación Web",
  "prog-android": "Programación Android",
  "prog-ios": "Programación iOS",
  "prog-py": "Programación Python"
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

// Carga los estudiantes en la tabla según el filtro de materia y grupo seleccionados
function cargarEstudiantes(materia = "todas", grupo = "grupo1") {
  let lista = [];
  if (materia === "todas") {
    lista = obtenerTodosEstudiantes(grupo);
  } else {
    lista = estudiantesPorMateriaYGrupo[materia][grupo] || [];
  }
  document.getElementById("tablaEstudiantes").innerHTML = lista.map(crearFila).join("");
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
  const materia = document.getElementById("materia-toggle").value;
  const grupo = document.getElementById("grupo-toggle").value;
  let totalActual = 0;
  if (materia === "todas") {
    totalActual = obtenerTodosEstudiantes(grupo).length;
  } else {
    totalActual = estudiantesPorMateriaYGrupo[materia][grupo].length;
  }
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

// Evento para el cambio de materia o grupo en los selects
function actualizarVista() {
  const materia = document.getElementById("materia-toggle").value;
  const grupo = document.getElementById("grupo-toggle").value;
  cargarEstudiantes(materia, grupo);
  document.getElementById("materia-subtext").textContent = nombreMaterias[materia] || "Todas las materias";
}

document.getElementById("materia-toggle").addEventListener("change", actualizarVista);
document.getElementById("grupo-toggle").addEventListener("change", actualizarVista);

// Inicializa con valores por defecto
document.getElementById("materia-toggle").value = "todas";
document.getElementById("grupo-toggle").value = "grupo1";
actualizarVista();