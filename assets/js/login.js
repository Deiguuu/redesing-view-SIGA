document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#login-form');
    const usernameInput = document.querySelector('#username');
    const passwordInput = document.querySelector('#password');
    const errorMessage = document.querySelector('#error-message');
    const inputs = form.querySelectorAll('input[type="text"], input[type="password"]');

    // Definir las credenciales correctas
    const correctEmail = "admin@admin.com";
    const correctPassword = "123";

    // Enfocado/Desenfocado (añadir clase para animaciones o estilo)
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            input.classList.remove('focused');
            validateInput(input);
        });
    });

    // Validación simple en cliente
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Evitar el envío del formulario

        let isValid = true;
        
        // Validación de campos vacíos
        inputs.forEach(input => {
            if (!input.value.trim()) {
                showError(input, 'Este campo es obligatorio');
                isValid = false;
            } else {
                clearError(input);
            }
        });

        // Validación de credenciales
        const enteredEmail = usernameInput.value.trim();
        const enteredPassword = passwordInput.value.trim();

        if (enteredEmail === correctEmail && enteredPassword === correctPassword) {
            // Si las credenciales son correctas, redirigir
            window.location.href = "home.html"; // Cambia 'home.html' por la URL de la página que deseas redirigir
        } else if (isValid) {
            // Si son incorrectas y los campos son válidos, mostrar el error
            errorMessage.style.display = "block";
        }

        if (!isValid) {
            errorMessage.style.display = "none"; // Ocultar mensaje de error si los campos están vacíos
        }
    });

    // Funciones de manejo de errores
    function validateInput(input) {
        if (!input.value.trim()) {
            showError(input, 'Este campo no puede estar vacío');
        } else {
            clearError(input);
        }
    }

    function showError(input, message) {
        input.setAttribute('aria-invalid', 'true');
        let error = input.parentElement.querySelector('.error-message');
        if (!error) {
            error = document.createElement('div');
            error.className = 'error-message';
            error.style.color = '#e74c3c';
            error.style.fontSize = '0.85rem';
            error.style.marginTop = '0.3rem';
            input.parentElement.appendChild(error);
        }
        error.textContent = message;
    }

    function clearError(input) {
        input.removeAttribute('aria-invalid');
        const error = input.parentElement.querySelector('.error-message');
        if (error) {
            error.remove();
        }
    }
});
