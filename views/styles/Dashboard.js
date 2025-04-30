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
    