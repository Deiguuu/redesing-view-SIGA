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
  