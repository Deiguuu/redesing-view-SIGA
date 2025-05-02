document.addEventListener('DOMContentLoaded', () => {
    const toggleButtons = document.querySelectorAll('.menu-toggle');
  
    toggleButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const menu = btn.nextElementSibling;
        document.querySelectorAll('.menu-options').forEach(m => {
          if (m !== menu) m.classList.add('hidden');
        });
        menu.classList.toggle('hidden');
        e.stopPropagation();
      });
    });
  
    document.addEventListener('click', () => {
      document.querySelectorAll('.menu-options').forEach(menu => {
        menu.classList.add('hidden');
      });
    });
  });

  document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".tab-button");
    const contents = document.querySelectorAll(".tab-content");
  
    buttons.forEach(button => {
      button.addEventListener("click", () => {
        buttons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
  
        const target = button.getAttribute("data-tab");
        contents.forEach(content => {
          content.classList.toggle("hidden", content.id !== target);
        });
      });
    });
  });
  const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const tab = button.dataset.tab;

    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    button.classList.add('active');
    document.getElementById(tab).classList.add('active');
  });
});
const actividadSelect = document.getElementById('actividad-select');
const pesoSelect = document.getElementById('peso-select');

// Guarda las opciones originales para restaurarlas si no es "Examen"
const originalPesoOptions = Array.from(pesoSelect.options);

actividadSelect.addEventListener('change', () => {
  if (actividadSelect.value === 'Examen') {
    // Limpiar y agregar solo 30
    pesoSelect.innerHTML = '';
    const opt = document.createElement('option');
    opt.value = '30';
    opt.textContent = '30';
    pesoSelect.appendChild(opt);
  } else {
    // Restaurar opciones originales
    pesoSelect.innerHTML = '';
    originalPesoOptions.forEach(opt => pesoSelect.appendChild(opt.cloneNode(true)));
  }
});
const buttons = document.querySelectorAll('.tab-button');
const contents = document.querySelectorAll('.tab-content');

buttons.forEach(button => {
  button.addEventListener('click', () => {
    // Quitar clase "active" de botones y contenidos
    buttons.forEach(btn => btn.classList.remove('active'));
    contents.forEach(content => content.classList.remove('active'));

    // Agregar clase "active" al botón clicado
    button.classList.add('active');

    // Mostrar el contenido correspondiente
    const tab = button.getAttribute('data-tab');
    document.getElementById(tab).classList.add('active');
  });
});