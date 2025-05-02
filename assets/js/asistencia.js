document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".tab");
    const contents = document.querySelectorAll(".tab-content");
    const sidebarLinks = document.querySelectorAll(".sidebar a");
  
    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("active"));
        contents.forEach((c) => c.classList.add("hidden"));
        tab.classList.add("active");
  
        const targetId = tab.getAttribute("data-tab");
        document.getElementById(targetId).classList.remove("hidden");
  
        // Actualiza el estado visual de la sidebar si aplica
        sidebarLinks.forEach((link) => link.classList.remove("active"));
        // Suponiendo que el tercer ítem (índice 2) es "Asistencia"
        // y el cuarto (índice 3) es "Estadísticas"
        if (targetId === "registro-content") {
          sidebarLinks[2].classList.add("active");
        } else if (targetId === "estadisticas-content") {
          sidebarLinks[3].classList.add("active");
        }
      });
    });
  });
  
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
        document.querySelectorAll(".tab-content").forEach((content) => content.classList.add("hidden"));
        tab.classList.add("active");
        const targetId = tab.getAttribute("data-tab");
        document.getElementById(targetId).classList.remove("hidden");
      });
    });
  });
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
  
  const estudiantesPorMateriaYGrupo = {};
  materias.forEach(materia => {
    estudiantesPorMateriaYGrupo[materia] = {};
    grupos.forEach(grupo => {
      estudiantesPorMateriaYGrupo[materia][grupo] = generarEstudiantes(materia, grupo);
    });
  });
  
  function obtenerTodosEstudiantes(grupo) {
    let todos = [];
    materias.forEach(materia => {
      todos = todos.concat(estudiantesPorMateriaYGrupo[materia][grupo]);
    });
    return todos;
  }
  
  const nombreMaterias = {
    "todas": "Todas las materias",
    "prog-web": "Programación Web",
    "prog-android": "Programación Android",
    "prog-ios": "Programación iOS",
    "prog-py": "Programación Python"
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
    for (let i = 0; i < nombre.length; i++) { // <-- Corrección aquí
      hash = nombre.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 70%, 50%)`;
  }
  
  function crearFila(est) {
    const iniciales = obtenerIniciales(est.nombre);
    const color = generarColor(est.nombre);
  
    const carnetParts = est.carnet.split("-");
    const carnetNum = `${Math.floor(Math.random()*90000+10000)}-${Math.floor(Math.random()*900000+100000)}`;
    return `
      <tr>
        <td>
          <div class="nombre-con-avatar">
            <div class="avatar" style="background-color: ${color};">${iniciales}</div>
            <div>
              <strong>${est.nombre}</strong><br>
              <span style="color: #888; font-size: 0.85rem;">
                carnet ${iniciales} ${carnetNum}
              </span>
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
  
  function actualizarEstado(selectEl, carnet) {
    const estado = selectEl.value;
    selectEl.className = `estado-toggle ${estadosAsistencia[estado].clase}`;
    asistenciaRegistro[carnet] = {
      estado,
      observacion: document.getElementById(`obs-${carnet}`).value
    };
    actualizarEstadisticas();
    renderSinDatos();
    renderEstadoEstudiantesFichas(); // <-- Agregado aquí
  }
  
  function cargarEstudiantes(materia = "todas", grupo = "grupo1") {
    let lista = [];
    if (materia === "todas") {
      lista = obtenerTodosEstudiantes(grupo);
    } else {
      lista = estudiantesPorMateriaYGrupo[materia][grupo] || [];
    }
    document.getElementById("tablaEstudiantes").innerHTML = lista.map(crearFila).join("");  
    document.getElementById("total-estudiantes").textContent = `${lista.length} estudiantes`;
    actualizarEstadisticas();
  }
  
  function marcarTodosPresentes() {
    const selects = document.querySelectorAll(".estado-toggle");
    selects.forEach(select => {
      const carnet = select.getAttribute("data-carnet");
      select.value = "presente";
      actualizarEstado(select, carnet);
    });
  }
  
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
    actualizarEstadisticas();
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
  
  flatpickr("#fecha-header", {
    dateFormat: "j \\de F \\de Y",
    locale: "es",
    defaultDate: localStorage.getItem("fechaSeleccionada") || "today",
    onChange: function(selectedDates) {
      const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
      const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
      const fecha = selectedDates[0];
      if (fecha) {
        localStorage.setItem("fechaSeleccionada", fecha.toISOString());
        const texto = `${dias[fecha.getDay()]}, ${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`;
        document.getElementById("fecha-pill").textContent = texto;
      }
    }
  });
  
  function actualizarVista() {
    const materia = document.getElementById("materia-toggle").value;
    const grupo = document.getElementById("grupo-toggle").value;
    localStorage.setItem("materiaSeleccionada", materia);
    localStorage.setItem("grupoSeleccionado", grupo);
    cargarEstudiantes(materia, grupo);
    document.getElementById("materia-subtext").textContent = nombreMaterias[materia] || "Todas las materias";
    renderEstadisticasPorEstudiante();
    renderSinDatos();
    renderEstadoEstudiantesFichas(); // <-- Agregado aquí
  }
  
  document.getElementById("materia-toggle").addEventListener("change", actualizarVista);
  document.getElementById("grupo-toggle").addEventListener("change", actualizarVista);
  
  const materiaGuardada = localStorage.getItem("materiaSeleccionada") || "todas";
  const grupoGuardado = localStorage.getItem("grupoSeleccionado") || "grupo1";
  document.getElementById("materia-toggle").value = materiaGuardada;
  document.getElementById("grupo-toggle").value = grupoGuardado;
  actualizarVista();
  
  // Actualizar estadísticas
  function actualizarEstadisticas() {
    const total = document.querySelectorAll(".estado-toggle").length;
    const contadores = {
      presente: 0,
      tardanza: 0,
      ausente: 0,
      justificado: 0
    };
    document.querySelectorAll(".estado-toggle").forEach(select => {
      const estado = select.value;
      if (contadores.hasOwnProperty(estado)) contadores[estado]++;
    });
    const actualizarCard = (clase, cantidad) => {
      // Cambia el selector para que coincida con las clases reales
      const card = document.querySelector(`.estadistica-card.${clase}`);
      if (!card) return;
      const porcentaje = total ? Math.round((cantidad / total) * 100) : 0;
      card.querySelector(".porcentaje").textContent = `${porcentaje}%`;
      card.querySelector(".detalle").textContent = `${cantidad} de ${total} registros`;
    };
    actualizarCard("asistencia", contadores.presente);
    actualizarCard("tardanza", contadores.tardanza);
    actualizarCard("ausencia", contadores.ausente);
    actualizarCard("justificacion", contadores.justificado);
  }
  
  function calcularEstadisticasPorEstudiante(estudiantes) {
    // Cuenta total de registros (para porcentajes)
    const totalSesiones = 1; // Puedes cambiar esto si manejas varias fechas/sesiones
  
    return estudiantes.map(est => {
      const registro = asistenciaRegistro[est.carnet];
      // Inicializa contadores
      let presente = 0, tardanza = 0, ausente = 0, justificado = 0;
  
      if (registro) {
        if (registro.estado === "presente") presente = 1;
        if (registro.estado === "tardanza") tardanza = 1;
        if (registro.estado === "ausente") ausente = 1;
        if (registro.estado === "justificado") justificado = 1;
      }
  
      // Calcula porcentajes (aquí solo hay una sesión, así que 0% o 100%)
      const asistencia = ((presente + tardanza + justificado) / totalSesiones) * 100;
      const derechoExamen = asistencia >= 80 ? "Sí" : "No";
  
      return {
        ...est,
        presente: Math.round((presente / totalSesiones) * 100),
        tardanza: Math.round((tardanza / totalSesiones) * 100),
        ausente: Math.round((ausente / totalSesiones) * 100),
        justificado: Math.round((justificado / totalSesiones) * 100),
        asistencia: Math.round(asistencia),
        derechoExamen
      };
    });
  }
  
  function renderEstadisticasPorEstudiante() {
    const materia = document.getElementById("materia-toggle").value;
    const grupo = document.getElementById("grupo-toggle").value;
    let estudiantes = [];
    if (materia === "todas") {
      estudiantes = obtenerTodosEstudiantes(grupo);
    } else {
      estudiantes = estudiantesPorMateriaYGrupo[materia][grupo] || [];
    }
    const stats = calcularEstadisticasPorEstudiante(estudiantes);
    const tbody = document.querySelector("#tablaEstadisticasEstudiantes tbody");
    tbody.innerHTML = stats.map(est => `
      <tr>
        <td>
          <div class="nombre-con-avatar">
            <div class="avatar" style="background-color: ${generarColor(est.nombre)};">${obtenerIniciales(est.nombre)}</div>
            <span>${est.nombre}</span>
          </div>
        </td>
        <td>
          <div style="background:#f3f3f3; border-radius:8px; height:8px; width:100%; margin:8px 0;">
            <div style="background:#4b62d9; height:8px; border-radius:8px; width:${est.asistencia}%;"></div>
          </div>
        </td>
        <td>${est.presente}%</td>
        <td>${est.tardanza}%</td>
        <td>${est.ausente}%</td>
        <td>${est.justificado}%</td>
        <td>
          <span class="pill">${est.derechoExamen}</span>
        </td>
      </tr>
    `).join("");
  }
  
  function renderSinDatos() {
    const materia = document.getElementById("materia-toggle").value;
    const grupo = document.getElementById("grupo-toggle").value;
    let estudiantes = [];
    if (materia === "todas") {
      estudiantes = obtenerTodosEstudiantes(grupo);
    } else {
      estudiantes = estudiantesPorMateriaYGrupo[materia][grupo] || [];
    }
    // Filtra los que no tienen registro de asistencia
    const sinDatos = estudiantes.filter(est => !asistenciaRegistro[est.carnet]);
    const listaDiv = document.getElementById("sin-datos-lista");
    const countSpan = document.getElementById("sin-datos-count");
    countSpan.textContent = `${sinDatos.length} estudiante${sinDatos.length !== 1 ? 's' : ''}`;
    if (sinDatos.length === 0) {
      listaDiv.innerHTML = `<div style="padding:12px; color:#888; text-align:center;">Todos los estudiantes tienen registro de asistencia</div>`;
      return;
    }
    listaDiv.innerHTML = sinDatos.map(est => `
      <div style="display:flex; align-items:center; justify-content:space-between; padding:12px;">
        <div style="display:flex; align-items:center; gap:12px;">
          <div class="avatar" style="background-color:${generarColor(est.nombre)};width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:50%;font-size:14px;color:#fff;">
            ${obtenerIniciales(est.nombre)}
          </div>
          <div style="font-size:12px;">
            <p style="font-weight:600; color:#222; margin:0;">${est.nombre}</p>
            <p style="color:#888; margin:0;">${grupo.replace('grupo', 'Grupo ').toUpperCase()}</p>
          </div>
        </div>
        <span style="font-size:12px; color:#666; border:1px solid #ccc; border-radius:9999px; padding:2px 8px;">Sin datos</span>
      </div>
    `).join('');
  }
  
  function renderEstadoEstudiantesFichas() {
    const materia = document.getElementById("materia-toggle").value;
    const grupo = document.getElementById("grupo-toggle").value;
    let estudiantes = [];
    if (materia === "todas") {
      estudiantes = obtenerTodosEstudiantes(grupo);
    } else {
      estudiantes = estudiantesPorMateriaYGrupo[materia][grupo] || [];
    }
    const stats = calcularEstadisticasPorEstudiante(estudiantes);
  
    // Habilitados
    const habilitados = stats.filter(est => est.derechoExamen === "Sí");
    const habilitadosCount = habilitados.length;
    const habilitadosSpan = document.querySelector(
      '#estado-estudiantes-fichas section:nth-child(1) header span'
    );
    if (habilitadosSpan) {
      habilitadosSpan.textContent = `${habilitadosCount} estudiante${habilitadosCount !== 1 ? 's' : ''}`;
    }  const habilitadosLista = document.getElementById("habilitados-lista");
    if (habilitadosLista) {
      if (habilitadosCount === 0) {
        habilitadosLista.innerHTML = `<div style="padding:12px; color:#888; text-align:center;">No hay estudiantes habilitados para examen</div>`;
      } else {
        habilitadosLista.innerHTML = habilitados.map(est => `
          <div style="display:flex; align-items:center; justify-content:space-between; padding:12px;">
            <div style="display:flex; align-items:center; gap:12px;">
              <div class="avatar" style="background-color:${generarColor(est.nombre)};width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:50%;font-size:14px;color:#fff;">
                ${obtenerIniciales(est.nombre)}
              </div>
              <div style="font-size:12px;">
                <p style="font-weight:600; color:#222; margin:0;">${est.nombre}</p>
                <p style="color:#888; margin:0;">${grupo.replace('grupo', 'Grupo ').toUpperCase()}</p>
              </div>
            </div>
            <span style="font-size:12px; color:#2f7a2f; border:1px solid #2f7a2f; border-radius:9999px; padding:2px 8px;">Habilitado</span>
          </div>
        `).join('');
      }
    }
  
    // En Riesgo
    const enRiesgo = stats.filter(est => est.derechoExamen === "No" && asistenciaRegistro[est.carnet]);
    const enRiesgoCount = enRiesgo.length;
    const enRiesgoSpan = document.querySelector(
      '#estado-estudiantes-fichas section:nth-child(2) header span'
    );
    if (enRiesgoSpan) {
      enRiesgoSpan.textContent = `${enRiesgoCount} estudiante${enRiesgoCount !== 1 ? 's' : ''}`;
    }
    const enRiesgoLista = document.getElementById("en-riesgo-lista");
    if (enRiesgoLista) {
      if (enRiesgoCount === 0) {
        enRiesgoLista.innerHTML = `<div style="padding:12px; color:#888; text-align:center;">No hay estudiantes en riesgo de perder el derecho a examen</div>`;
      } else {
        enRiesgoLista.innerHTML = enRiesgo.map(est => `
          <div style="display:flex; align-items:center; justify-content:space-between; padding:12px;">
            <div style="display:flex; align-items:center; gap:12px;">
              <div class="avatar" style="background-color:${generarColor(est.nombre)};width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:50%;font-size:14px;color:#fff;">
                ${obtenerIniciales(est.nombre)}
              </div>
              <div style="font-size:12px;">
                <p style="font-weight:600; color:#222; margin:0;">${est.nombre}</p>
                <p style="color:#888; margin:0;">${grupo.replace('grupo', 'Grupo ').toUpperCase()}</p>
              </div>
            </div>
            <span style="font-size:12px; color:#b33a2a; border:1px solid #b33a2a; border-radius:9999px; padding:2px 8px;">En riesgo</span>
          </div>
        `).join('');
      }
    }
  }