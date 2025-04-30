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

function updateAll() {
  renderSummaryProximos();
  renderSummaryHoy();
  renderSummaryEstadisticas();
}

prevMonthBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  updateMonthDisplay();
  renderMonthView(currentDate);
  updateAll();
});

nextMonthBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  updateMonthDisplay();
  renderMonthView(currentDate);
  updateAll();
});

todayBtn.addEventListener('click', () => {
  currentDate = new Date();
  updateMonthDisplay();
  renderMonthView(currentDate);
  updateAll();
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
  { date: new Date(2025, 3, 2, 9), title: 'Matemáticas Avanzadas', type: 'class' },
  { date: new Date(2025, 3, 2, 11), title: 'Programación Orientada a Objetos', type: 'class' },
  { date: new Date(2025, 3, 3, 10), title: 'Cálculo Diferencial', type: 'class' },
  { date: new Date(2025, 3, 6), title: 'Inicio del Semestre', type: 'class' },
  { date: new Date(2025, 3, 29, 10), title: 'Quiz de Ecuaciones', type: 'special' },
  { date: new Date(2025, 3, 29, 14), title: 'Repaso para examen', type: 'other' },
  { date: new Date(2025, 3, 30, 11), title: 'Revisión de Proyecto', type: 'other' },
  { date: new Date(2025, 4, 1, 9), title: 'Clase de Física', type: 'class' },
  { date: new Date(2025, 4, 5, 16), title: 'Entrega de Tarea', type: 'class' },
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

function changeView(view) {
  switch(view) {
    case 'month': renderMonthView(currentDate); break;
    case 'day': renderDayView(currentDate); break;
    case 'week': renderWeekView(currentDate); break;
    case 'agenda': renderAgendaView(currentDate); break;
  }
  showOnly(view);
  updateAll();
}

document.getElementById('month-view-btn').addEventListener('click', () => changeView('month'));
document.getElementById('day-view-btn').addEventListener('click', () => changeView('day'));
document.getElementById('week-view-btn').addEventListener('click', () => changeView('week'));
document.getElementById('agenda-view-btn').addEventListener('click', () => changeView('agenda'));
// Agrega al final de calendario.js

// --- Resumen del Calendario (ventana flotante) ---
const summaryTabs = document.querySelectorAll('.summary-tab');
const summaryPanels = {
  proximos: document.getElementById('summary-proximos'),
  hoy: document.getElementById('summary-hoy'),
  estadisticas: document.getElementById('summary-estadisticas')
};

summaryTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    summaryTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    Object.keys(summaryPanels).forEach(key => {
      summaryPanels[key].style.display = (tab.dataset.tab === key) ? 'block' : 'none';
    });
    // Llama a la función de render según la pestaña
    if (tab.dataset.tab === 'proximos') renderSummaryProximos();
    if (tab.dataset.tab === 'hoy') renderSummaryHoy();
    if (tab.dataset.tab === 'estadisticas') renderSummaryEstadisticas();
  });
});

function renderSummaryProximos() {
  const now = new Date();
  const upcoming = events
    .filter(e => e.date >= now)
    .sort((a, b) => a.date - b.date)
    .slice(0, 5);

  summaryPanels.proximos.innerHTML = upcoming.length
    ? upcoming.map(e => `
    <div class="summary-event">
      <div class="summary-event-title">${e.title}</div>
      <div class="summary-event-date">
        ${e.date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })} 
        ${formatTime(e.date)}
      </div>
      <span class="summary-event-type${e.type ? ' ' + e.type : ''}">
        ${getEventTypeLabel(e.type)}
      </span>
    </div>
  `).join('')
    : '<p style="color:#888;">No hay eventos próximos.</p>';
}

function renderSummaryHoy() {
  const today = new Date();
  today.setHours(0,0,0,0);
  const todayEvents = getEventsForDate(today);

  summaryPanels.hoy.innerHTML = todayEvents.length
    ? todayEvents.map(e => `
      <div class="summary-event">
        <div class="summary-event-title">${e.title}</div>
        <div class="summary-event-date">${formatTime(e.date)}</div>
        <span class="summary-event-type${e.type ? ' ' + e.type : ''}">
          ${e.type === 'special' ? 'Actividad' : e.type === 'other' ? 'Reunión' : 'Clase'}
        </span>
      </div>
    `).join('')
    : '<p style="color:#888;">No hay eventos para hoy.</p>';
}

function renderSummaryEstadisticas() {
  const total = events.length;
  const hoy = getEventsForDate(new Date()).length;
  const proximos = events.filter(e => e.date >= new Date()).length;

  // Distribución por tipo
  const tipos = [
    { label: 'Cursos', color: '#4f6ef7', key: 'class' },
    { label: 'Exámenes', color: '#f74f4f', key: 'exam' }, // Si tienes exámenes
    { label: 'Actividades', color: '#ff9f0a', key: 'special' },
    { label: 'Reuniones', color: '#34a853', key: 'other' },
  ];
  // Calcula porcentajes
  let distribucion = tipos.map(t => ({
    ...t,
    count: events.filter(e => e.type === t.key).length
  }));
  // Otros
  const otrosCount = total - distribucion.reduce((acc, t) => acc + t.count, 0);
  distribucion.push({ label: 'Otros', color: '#222', count: otrosCount });

  // Próximos eventos
  const now = new Date();
  const manana = new Date();
  manana.setDate(now.getDate() + 1);
  manana.setHours(0,0,0,0);
  const mananaCount = getEventsForDate(manana).length;

  // Esta semana
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0,0,0,0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23,59,59,999);
  const semanaCount = events.filter(e => e.date >= startOfWeek && e.date <= endOfWeek).length;

  summaryPanels.estadisticas.innerHTML = `
    <div style="padding:10px 0;">
      <div style="display:flex;gap:10px;margin-bottom:16px;">
        <div style="flex:1;background:#f4f7fe;border-radius:12px;padding:10px 0;text-align:center;">
          <div style="font-size:1.3em;font-weight:700;color:#4f6ef7;">${total}</div>
          <div style="font-size:0.95em;color:#555;">Total</div>
        </div>
        <div style="flex:1;background:#eafaf1;border-radius:12px;padding:10px 0;text-align:center;">
          <div style="font-size:1.3em;font-weight:700;color:#34a853;">${hoy}</div>
          <div style="font-size:0.95em;color:#555;">Hoy</div>
        </div>
        <div style="flex:1;background:#f6f3fe;border-radius:12px;padding:10px 0;text-align:center;">
          <div style="font-size:1.3em;font-weight:700;color:#a34ff7;">${proximos}</div>
          <div style="font-size:0.95em;color:#555;">Próximos</div>
        </div>
      </div>
      <div style="font-weight:600;margin-bottom:8px;">Distribución por tipo</div>
      ${distribucion.map(t => {
        const percent = total ? Math.round((t.count / total) * 100) : 0;
        return `
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
            <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${t.color};"></span>
            <span style="flex:1;font-size:0.97em;">${t.label}</span>
            <div style="flex:3;background:#eee;border-radius:6px;height:7px;overflow:hidden;">
              <div style="background:${t.color};width:${percent}%;height:100%;"></div>
            </div>
            <span style="width:36px;text-align:right;font-size:0.93em;color:#555;">${percent}%</span>
          </div>
        `;
      }).join('')}
      <div style="font-weight:600;margin:18px 0 8px 0;">Próximos eventos</div>
      <div style="display:flex;gap:10px;">
        <div style="flex:1;background:#f7f7f7;border-radius:10px;padding:8px 0;text-align:center;">
          <div style="font-size:1.1em;font-weight:600;">${hoy}</div>
          <div style="font-size:0.92em;color:#888;">Hoy</div>
        </div>
        <div style="flex:1;background:#f7f7f7;border-radius:10px;padding:8px 0;text-align:center;">
          <div style="font-size:1.1em;font-weight:600;">${mananaCount}</div>
          <div style="font-size:0.92em;color:#888;">Mañana</div>
        </div>
        <div style="flex:1;background:#f7f7f7;border-radius:10px;padding:8px 0;text-align:center;">
          <div style="font-size:1.1em;font-weight:600;">${semanaCount}</div>
          <div style="font-size:0.92em;color:#888;">Esta semana</div>
        </div>
      </div>
    </div>
  `;
}

// Render inicial
renderSummaryProximos();
renderSummaryHoy();
renderSummaryEstadisticas();

// --- Feature 1: Agregar, editar y eliminar eventos ---

// --- Modal para agregar/editar eventos ---
let editingEventIndex = null;

function showEventModal(event = null, index = null) {
  let modal = document.getElementById('event-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'event-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <h3 id="modal-title">Nuevo Evento</h3>
        <form id="event-form">
          <label>Título: <input type="text" id="event-title" required></label><br>
          <label>Fecha: <input type="date" id="event-date" required></label><br>
          <label>Hora: <input type="time" id="event-time"></label><br>
          <label>Tipo:
            <select id="event-type">
              <option value="class">Clase</option>
              <option value="special">Actividad</option>
              <option value="other">Reunión</option>
            </select>
          </label><br>
          <div style="margin-top:10px;">
            <button type="submit" id="save-event-btn">Guardar</button>
            <button type="button" id="cancel-event-btn">Cancelar</button>
            <button type="button" id="delete-event-btn" style="display:none;color:red;">Eliminar</button>
          </div>
        </form>
      </div>
      <style>
        #event-modal {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; z-index: 1000;
        }
        #event-modal .modal-content {
          background: #fff; padding: 20px 30px; border-radius: 8px; min-width: 300px;
        }
      </style>
    `;
    document.body.appendChild(modal);
  } else {
    modal.style.display = 'flex';
  }

  document.getElementById('modal-title').textContent = event ? 'Editar Evento' : 'Nuevo Evento';
  document.getElementById('event-title').value = event ? event.title : '';
  document.getElementById('event-date').value = event ? event.date.toISOString().slice(0,10) : '';
  document.getElementById('event-time').value = event && event.date.getHours() ? event.date.toTimeString().slice(0,5) : '';
  document.getElementById('event-type').value = event ? event.type : 'class';
  document.getElementById('delete-event-btn').style.display = event ? 'inline-block' : 'none';

  editingEventIndex = index;

  document.getElementById('cancel-event-btn').onclick = () => { modal.style.display = 'none'; };
  document.getElementById('delete-event-btn').onclick = () => {
    if (editingEventIndex !== null) {
      events.splice(editingEventIndex, 1);
      modal.style.display = 'none';
      updateMonthDisplay();
      renderMonthView(currentDate);
      updateAll();
    }
  };
  document.getElementById('event-form').onsubmit = (e) => {
    e.preventDefault();
    const title = document.getElementById('event-title').value;
    const dateStr = document.getElementById('event-date').value;
    const timeStr = document.getElementById('event-time').value;
    const type = document.getElementById('event-type').value;
    const [year, month, day] = dateStr.split('-').map(Number);
    let dateObj = new Date(year, month - 1, day);
    if (timeStr) {
      const [h, m] = timeStr.split(':').map(Number);
      dateObj.setHours(h, m, 0, 0);
    }
    if (editingEventIndex !== null) {
      events[editingEventIndex] = { date: dateObj, title, type };
    } else {
      events.push({ date: dateObj, title, type });
    }
    modal.style.display = 'none';
    updateMonthDisplay();
    renderMonthView(currentDate);
    updateAll();
  };
}

// Esperar a que el DOM esté listo antes de agregar el listener
document.addEventListener('DOMContentLoaded', () => {
  const newEventBtn = document.querySelector('.new-event-btn');
  if (newEventBtn) {
    newEventBtn.addEventListener('click', () => showEventModal());
  }
});

// Permitir editar evento al hacer click en el evento del mes
const originalCreateDayCell = createDayCell;
createDayCell = function(date, inactive) {
  const cell = originalCreateDayCell(date, inactive);
  const dayEvents = getEventsForDate(date);
  Array.from(cell.querySelectorAll('.event')).forEach((div, idx) => {
    div.style.cursor = 'pointer';
    div.title = 'Editar evento';
    div.onclick = (e) => {
      e.stopPropagation();
      // Buscar el índice real del evento en el array global
      const event = dayEvents[idx];
      const eventIndex = events.findIndex(ev => ev === event);
      showEventModal(event, eventIndex);
    };
  });
  return cell;
};

// --- Feature 2: Búsqueda y filtrado de eventos ---

const searchInput = document.getElementById('searchInput');
let searchFilter = '';
let typeFilter = 'all';

function filterAndRenderEvents() {
  // Solo afecta la vista de mes y agenda
  renderMonthView(currentDate);
  renderAgendaView(currentDate);
  renderSummaryProximos();
}

searchInput.addEventListener('input', (e) => {
  searchFilter = e.target.value.toLowerCase();
  filterAndRenderEvents();
});

// Filtro por tipo (agrega select arriba del calendario)
let typeSelect = document.getElementById('typeFilter');
if (!typeSelect) {
  typeSelect = document.createElement('select');
  typeSelect.id = 'typeFilter';
  typeSelect.innerHTML = `
    <option value="all">Todos</option>
    <option value="class">Clase</option>
    <option value="special">Actividad</option>
    <option value="other">Reunión</option>
  `;
  document.querySelector('.calendar-container').insertBefore(typeSelect, document.querySelector('.calendar-container').firstChild);
}
typeSelect.addEventListener('change', (e) => {
  typeFilter = e.target.value;
  filterAndRenderEvents();
});

// Modifica getEventsForDate y renderAgendaView para aplicar filtros
const originalGetEventsForDate = getEventsForDate;
getEventsForDate = function(date) {
  let filtered = originalGetEventsForDate(date);
  if (searchFilter) {
    filtered = filtered.filter(e => e.title.toLowerCase().includes(searchFilter));
  }
  if (typeFilter !== 'all') {
    filtered = filtered.filter(e => e.type === typeFilter);
  }
  return filtered;
};

const originalRenderAgendaView = renderAgendaView;
renderAgendaView = function(date) {
  showOnly('agenda');
  agendaView.innerHTML = '<h3>Próximos Eventos</h3>';
  let futureEvents = events.filter(e => e.date >= new Date());
  if (searchFilter) {
    futureEvents = futureEvents.filter(e => e.title.toLowerCase().includes(searchFilter));
  }
  if (typeFilter !== 'all') {
    futureEvents = futureEvents.filter(e => e.type === typeFilter);
  }
  futureEvents = futureEvents.sort((a, b) => a.date - b.date);
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
};

// --- Feature 3: Notificaciones o recordatorios ---

function checkEventReminders() {
  const now = new Date();
  events.forEach(e => {
    // Notificar 10 minutos antes
    const diff = e.date - now;
    if (diff > 0 && diff < 10 * 60 * 1000 && !e.notified) {
      e.notified = true;
      if (Notification && Notification.permission === 'granted') {
        new Notification('Recordatorio de evento', {
          body: `${e.title} a las ${formatTime(e.date)}`,
        });
      } else {
        alert(`¡Recordatorio!\n${e.title} a las ${formatTime(e.date)}`);
      }
    }
  });
}

// Solicitar permiso de notificaciones al cargar
if ('Notification' in window && Notification.permission !== 'granted') {
  Notification.requestPermission();
}
setInterval(checkEventReminders, 60000); // Checar cada minuto