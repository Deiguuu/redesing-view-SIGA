
// Cambiar entre vistas
function showView(id) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  }
  
  // Cargar datos ficticios
  const estudiantes = [
    { nombre: "Carlos Rodríguez", correo: "carlos@ejemplo.com", acumulado: 8.37, examen: 8.10, final: 8.40, estado: "Aprobado" },
    { nombre: "Ana Martínez", correo: "ana@ejemplo.com", acumulado: 9.47, examen: 9.47, final: 9.47, estado: "Aprobado" },
    { nombre: "Miguel López", correo: "miguel@ejemplo.com", acumulado: 6.96, examen: 6.96, final: 6.96, estado: "Condicional" },
    { nombre: "Laura Sánchez", correo: "laura@ejemplo.com", acumulado: 8.37, examen: 8.40, final: 8.40, estado: "Aprobado" },
    { nombre: "Javier Gómez", correo: "javier@ejemplo.com", acumulado: 8.37, examen: 8.10, final: 8.40, estado: "Aprobado" },
  ];
  
  function cargarResumen() {
    const tbody = document.getElementById("tablaResumen");
    tbody.innerHTML = "";
    estudiantes.forEach(est => {
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
  
  function cargarDetalles() {
    const tbody = document.getElementById("tablaDetalles");
    tbody.innerHTML = "";
    estudiantes.forEach(est => {
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
  
  window.addEventListener("click", () => {
    document.getElementById("contextMenu").style.display = "none";
  });
  
  function editarNota() {
    const nueva = prompt("Ingrese nueva nota final:", currentTarget.children[3].innerText);
    if (nueva) {
      currentTarget.children[3].innerText = parseFloat(nueva).toFixed(2);
    }
  }
  
  function enviarReporte() {
    alert("Reporte enviado ✔");
  }
  
  // Inicialización
  cargarResumen();
  cargarDetalles();
  