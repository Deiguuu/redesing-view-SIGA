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

const calendarDaysDiv = document.getElementById('calendar-days');
const currentMonthHeader = document.getElementById('current-month');
const weekdaysRow = document.getElementById('weekdays-row'); // Get the weekdays row
const viewsContainer = document.getElementById('views-container'); // Container for day/week/agenda

const dayView = document.getElementById('day-view');
const weekView = document.getElementById('week-view');
const agendaView = document.getElementById('agenda-view');

const events = [
  { date: new Date(2025, 3, 2, 9), title: 'Matemáticas Avanzadas' },
  { date: new Date(2025, 3, 2, 11), title: 'Programación Orientada a Objetos' },
  { date: new Date(2025, 3, 3, 10), title: 'Cálculo Diferencial' },
  { date: new Date(2025, 3, 6), title: 'Inicio del Semestre' },
  { date: new Date(2025, 3, 29, 10), title: 'Quiz de Ecuaciones', type: 'special' },
  { date: new Date(2025, 3, 29, 14), title: 'Repaso para examen', type: 'other' },
  { date: new Date(2025, 3, 30, 11), title: 'Revisión de Proyecto', type: 'other' },
  { date: new Date(2025, 4, 1, 9), title: 'Clase de Física' }, // May event
  { date: new Date(2025, 4, 5, 16), title: 'Entrega de Tarea' }, // May event
];

// Function to format time
function formatTime(date) {
  if (date.getHours() === 0 && date.getMinutes() === 0) {
    return ''; // Don't show time for all-day events
  }
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

function renderMonthView(date) {
  showOnly('month');
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDayOfWeek = firstDay.getDay(); // 0 for Sunday, 6 for Saturday
  const totalDays = lastDay.getDate();

  currentMonthHeader.textContent = date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

  calendarDaysDiv.innerHTML = '';
  const prevMonth = new Date(year, month, 0);
  const daysInPrevMonth = prevMonth.getDate();

  // Add days from the previous month
  for (let i = startDayOfWeek; i > 0; i--) {
    calendarDaysDiv.appendChild(createDayCell(new Date(year, month - 1, daysInPrevMonth - i + 1), true));
  }

  // Add days of the current month
  for (let i = 1; i <= totalDays; i++) {
    const d = new Date(year, month, i);
    const cell = createDayCell(d, false);
    cell.onclick = () => {
      currentDate = new Date(d); // Update currentDate when clicking a day
      renderDayView(d);
    };
    calendarDaysDiv.appendChild(cell);
  }

  // Add days from the next month to fill the grid
  const totalCells = startDayOfWeek + totalDays;
  const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7); // Ensure full weeks
  if (totalCells + remaining < 42) { // Ensure at least 6 rows if needed
    const needed = 42 - (totalCells + remaining);
    for (let i = 1; i <= remaining + needed; i++) {
      calendarDaysDiv.appendChild(createDayCell(new Date(year, month + 1, i), true));
    }
  } else {
    for (let i = 1; i <= remaining; i++) {
      calendarDaysDiv.appendChild(createDayCell(new Date(year, month + 1, i), true));
    }
  }
}

function createDayCell(date, inactive) {
  const cell = document.createElement('div');
  cell.className = 'day' + (inactive ? ' inactive' : '');
  cell.innerHTML = `<span>${date.getDate()}</span>`;
  const dayEvents = getEventsForDate(date);
  dayEvents.forEach(e => {
    const div = document.createElement('div');
    div.className = 'event';
    if (e.type === 'special') div.classList.add('special-event');
    if (e.type === 'other') div.classList.add('other-event');
    const eventTime = formatTime(e.date);
    div.textContent = `${eventTime ? eventTime + ' ' : ''}${e.title}`;
    cell.appendChild(div);
  });
  return cell;
}

function getEventsForDate(date) {
  // Normalize date to start of day for comparison
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return events.filter(e => e.date >= startOfDay && e.date <= endOfDay)
               .sort((a, b) => a.date - b.date); // Sort events by time
}

function renderDayView(date) {
  showOnly('day');
  const dayEvents = getEventsForDate(date);
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  dayView.innerHTML = `<h3>${date.toLocaleDateString('es-ES', options)}</h3>`;

  if (dayEvents.length === 0) {
    dayView.innerHTML += '<p>Sin eventos para este día.</p>';
  } else {
    const list = document.createElement('ul');
    dayEvents.forEach(e => {
      const li = document.createElement('li');
      const eventTime = formatTime(e.date);
      li.textContent = `${eventTime ? eventTime + ' - ' : ''}${e.title}`;
      list.appendChild(li);
    });
    dayView.appendChild(list);
  }
}

function renderWeekView(date) {
  showOnly('week');
  weekView.innerHTML = ''; // Clear previous content

  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay()); // Start of the week (Sunday)

  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);

    const dayBlock = document.createElement('div');
    dayBlock.className = 'week-day-block';

    const dayHeader = document.createElement('strong');
    dayHeader.textContent = d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' });
    dayBlock.appendChild(dayHeader);

    const dayEvents = getEventsForDate(d);

    if (dayEvents.length) {
      const ul = document.createElement('ul');
      dayEvents.forEach(e => {
        const li = document.createElement('li');
        const eventTime = formatTime(e.date);
        li.textContent = `${eventTime ? eventTime + ' ' : ''}${e.title}`;
        ul.appendChild(li);
      });
      dayBlock.appendChild(ul);
    } else {
      const p = document.createElement('p');
      p.textContent = 'Sin eventos';
      dayBlock.appendChild(p);
    }
    weekView.appendChild(dayBlock);
  }
}

function renderAgendaView(date) {
  showOnly('agenda');
  agendaView.innerHTML = '<h3>Próximos Eventos</h3>';

  const futureEvents = events.filter(e => e.date >= new Date())
                             .sort((a, b) => a.date - b.date);

  if (futureEvents.length === 0) {
    agendaView.innerHTML += '<p>No hay eventos próximos.</p>';
  } else {
    const ul = document.createElement('ul');
    futureEvents.forEach(e => {
      const li = document.createElement('li');
      const options = { month: 'short', day: 'numeric' };
      const eventDate = e.date.toLocaleDateString('es-ES', options);
      const eventTime = formatTime(e.date);
      li.textContent = `${eventDate} ${eventTime ? '- ' + eventTime : ''}: ${e.title}`;
      ul.appendChild(li);
    });
    agendaView.appendChild(ul);
  }
}

function showOnly(view) {
  // Ocultar la vista de mes
  currentMonthHeader.style.display = (view === 'month') ? 'block' : 'none';
  weekdaysRow.style.display = (view === 'month') ? 'grid' : 'none';
  calendarDaysDiv.style.display = (view === 'month') ? 'grid' : 'none';

  // Ocultar/mostrar el contenedor de vistas
  viewsContainer.style.display = (view === 'month') ? 'none' : 'block';

  // Mostrar solo la vista seleccionada
  dayView.style.display = (view === 'day') ? 'block' : 'none';
  weekView.style.display = (view === 'week') ? 'grid' : 'none';  // Usar grid para la vista de semana
  agendaView.style.display = (view === 'agenda') ? 'block' : 'none';
}

// Event Listeners para cambiar la vista
document.getElementById('month-view-btn').addEventListener('click', () => {
  renderMonthView(currentDate);  // Renderizar la vista de mes
  showOnly('month');  // Mostrar solo la vista de mes
});

document.getElementById('day-view-btn').addEventListener('click', () => {
  renderDayView(currentDate);  // Renderizar la vista de día
  showOnly('day');  // Mostrar solo la vista de día
});

document.getElementById('week-view-btn').addEventListener('click', () => {
  renderWeekView(currentDate);  // Renderizar la vista de semana
  showOnly('week');  // Mostrar solo la vista de semana
});

document.getElementById('agenda-view-btn').addEventListener('click', () => {
  renderAgendaView(currentDate);  // Renderizar la vista de agenda
  showOnly('agenda');  // Mostrar solo la vista de agenda
});
