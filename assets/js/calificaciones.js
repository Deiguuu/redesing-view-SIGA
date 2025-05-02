// Cambiar entre vistas
function showView(id) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  }
  
  // Datos ficticios de estudiantes
  const estudiantes = [
    { nombre: "Carlos Rodríguez", correo: "carlos@ejemplo.com", acumulado: 8.37, examen: 8.10, final: 8.40, estado: "Aprobado" },
    { nombre: "Ana Martínez", correo: "ana@ejemplo.com", acumulado: 9.47, examen: 9.47, final: 9.47, estado: "Aprobado" },
    { nombre: "Miguel López", correo: "miguel@ejemplo.com", acumulado: 6.96, examen: 6.96, final: 6.96, estado: "Condicional" },
    { nombre: "Laura Sánchez", correo: "laura@ejemplo.com", acumulado: 8.37, examen: 8.40, final: 8.40, estado: "Aprobado" },
    { nombre: "Javier Gómez", correo: "javier@ejemplo.com", acumulado: 8.37, examen: 8.10, final: 8.40, estado: "Aprobado" },
  ];
  
  // Filtrar estudiantes por estado
  function filtrarPorEstado(estado) {
    return estudiantes.filter(est => est.estado.toLowerCase() === estado.toLowerCase());
  }
  
  // Cargar resumen (con soporte para filtros)
  function cargarResumen(lista = estudiantes) {
    const tbody = document.getElementById("tablaResumen");
    tbody.innerHTML = "";
    lista.forEach(est => {
      const estadoClass = est.estado.toLowerCase();
      tbody.innerHTML += `
        <tr>
          <td>${est.nombre}<br><small>${est.correo}</small></td>
          <td>${est.acumulado.toFixed(2)}</td>
          <td>${est.examen.toFixed(2)}</td>
          <td>${est.final.toFixed(2)}</td>
          <td><span class="estado ${estadoClass}">${est.estado}</span></td>
          <td><button onclick="mostrarMenu(event)"><i class='fa fa-ellipsis-h'></i></button></td>
        </tr>
      `;
    });
  }
  
  // Cargar detalles
  function cargarDetalles(lista = estudiantes) {
    const tbody = document.getElementById("tablaDetalles");
    tbody.innerHTML = "";
    lista.forEach(est => {
      tbody.innerHTML += `
        <tr>
          <td>${est.nombre}<br><small>${est.correo}</small></td>
          <td>9.00</td><td>9.00</td><td>9.10</td><td>9.00</td>
          <td>8.50</td><td>${est.examen.toFixed(2)}</td>
          <td>${est.acumulado.toFixed(2)}</td>
          <td>${est.final.toFixed(2)}</td>
        </tr>
      `;
    });
  }
  
  // Menú contextual
  let currentTarget = null;
  
  function mostrarMenu(event) {
    const menu = document.getElementById("contextMenu");
    menu.style.top = event.pageY + "px";
    menu.style.left = event.pageX + "px";
    menu.style.display = "block";
    currentTarget = event.target.closest("tr");
  }
  
  window.addEventListener("click", (event) => {
    if (!event.target.closest("#contextMenu")) {
      document.getElementById("contextMenu").style.display = "none";
    }
  });
  
  // Editar nota final
  function editarNota() {
    const nuevaNota = prompt("Ingrese nueva nota final:", currentTarget.children[3].innerText);
    if (nuevaNota) {
      const valor = parseFloat(nuevaNota);
      if (!isNaN(valor) && valor >= 0 && valor <= 10) {
        currentTarget.children[3].innerText = valor.toFixed(2);
        alert("Nota actualizada exitosamente.");
      } else {
        alert("Por favor ingrese una nota válida entre 0 y 10.");
      }
    }
  }
  
  // Enviar reporte
  function enviarReporte() {
    if (confirm("¿Estás seguro de que deseas enviar el reporte?")) {
      alert("Reporte enviado ✔");
    }
  }
  
  // Calcular estadísticas de distribución de calificaciones
  function calcularEstadisticas() {
    const total = estudiantes.length;
    const rangoExcelente = estudiantes.filter(est => est.final >= 9.0).length;
    const rangoMuyBueno = estudiantes.filter(est => est.final >= 8.0 && est.final < 9.0).length;
    const rangoBueno = estudiantes.filter(est => est.final >= 7.0 && est.final < 8.0).length;
    const rangoRegular = estudiantes.filter(est => est.final >= 6.0 && est.final < 7.0).length;
    const rangoInsuficiente = estudiantes.filter(est => est.final < 6.0).length;
  
    const porcentaje = (cantidad) => ((cantidad / total) * 100).toFixed(1);
  
    document.getElementById("rangoExcelente").innerText = rangoExcelente;
    document.getElementById("porcExcelente").innerText = porcentaje(rangoExcelente);
  
    document.getElementById("rangoMuyBueno").innerText = rangoMuyBueno;
    document.getElementById("porcMuyBueno").innerText = porcentaje(rangoMuyBueno);
  
    document.getElementById("rangoBueno").innerText = rangoBueno;
    document.getElementById("porcBueno").innerText = porcentaje(rangoBueno);
  
    document.getElementById("rangoRegular").innerText = rangoRegular;
    document.getElementById("porcRegular").innerText = porcentaje(rangoRegular);
  
    document.getElementById("rangoInsuficiente").innerText = rangoInsuficiente;
    document.getElementById("porcInsuficiente").innerText = porcentaje(rangoInsuficiente);
  }
  
  // Inicialización única
  document.addEventListener("DOMContentLoaded", () => {
    cargarResumen();
    cargarDetalles();
    calcularEstadisticas();
  });
  