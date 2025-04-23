flatpickr("#fecha-header", {
    dateFormat: "j \\de F \\de Y", // Formato de fecha
    locale: "es",                  // Localización en español
    defaultDate: "today"           // Fecha por defecto: hoy
  });

  const tabs = document.querySelectorAll('.tab');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    console.log(`Tab activa: ${tab.dataset.tab}`);
  });
});
