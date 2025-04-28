// script.js
const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  
  let currentDate = new Date(2025, 3); // Abril 2025
  
  const currentMonthSpan = document.getElementById('currentMonth');
  const prevMonthBtn = document.getElementById('prevMonth');
  const nextMonthBtn = document.getElementById('nextMonth');
  const todayBtn = document.getElementById('todayBtn');
  
  function updateMonthDisplay() {
    const month = months[currentDate.getMonth()];
    const year = currentDate.getFullYear();
    currentMonthSpan.textContent = `${month} ${year}`;
  }
  
  prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateMonthDisplay();
  });
  
  nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateMonthDisplay();
  });
  
  todayBtn.addEventListener('click', () => {
    currentDate = new Date();
    updateMonthDisplay();
  });
  
  updateMonthDisplay();
  
  // Selector de vista
  const viewToggle = document.getElementById('viewToggle');
  const viewDropdown = document.getElementById('viewDropdown');
  const currentView = document.getElementById('currentView');
  
  viewToggle.addEventListener('click', () => {
    viewDropdown.style.display = viewDropdown.style.display === 'block' ? 'none' : 'block';
  });
  
  // Cambiar vista
  document.querySelectorAll('.view-option').forEach(option => {
    option.addEventListener('click', (e) => {
      const selectedView = e.target.getAttribute('data-view');
      currentView.textContent = selectedView;
      viewDropdown.style.display = 'none';
    });
  });
  
  // Cerrar dropdown al hacer click afuera
  document.addEventListener('click', (e) => {
    if (!viewToggle.contains(e.target) && !viewDropdown.contains(e.target)) {
      viewDropdown.style.display = 'none';
    }
  });
  