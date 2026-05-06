class BasicLoginForm {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.usernameInput = document.getElementById('username');
        this.passwordInput = document.getElementById('password');
        this.passwordToggle = document.getElementById('passwordToggle');
        this.successMessage = document.getElementById('successMessage');

        this.init();
    }

    init() {
        // Setup floating labels
        this.setupFloatingLabels();
        // Setup password toggle
        this.setupPasswordToggle();
        // Add input validation listeners
        this.usernameInput.addEventListener('input', () => this.validateField('username'));
        this.passwordInput.addEventListener('input', () => this.validateField('password'));
    }

    setupFloatingLabels() {
        const inputs = this.form.querySelectorAll('.input-wrapper input');
        inputs.forEach(input => {
            if (input.value.trim() !== '') {
                input.classList.add('has-value');
            }
            input.addEventListener('input', () => {
                if (input.value.trim() !== '') {
                    input.classList.add('has-value');
                } else {
                    input.classList.remove('has-value');
                }
            });
        });
    }

    setupPasswordToggle() {
        if (this.passwordToggle && this.passwordInput) {
            this.passwordToggle.addEventListener('click', () => {
                const isPassword = this.passwordInput.type === 'password';
                this.passwordInput.type = isPassword ? 'text' : 'password';
                const eyeIcon = this.passwordToggle.querySelector('.eye-icon');
                if (eyeIcon) {
                    eyeIcon.classList.toggle('show-password', isPassword);
                }
            });
        }
    }

    validateField(fieldName) {
        const input = document.getElementById(fieldName);
        const errorElement = document.getElementById(`${fieldName}-error`);
        const value = input.value.trim();

        // Clear previous errors
        errorElement.classList.remove('show');
        errorElement.textContent = '';

        // Basic validation
        if (fieldName === 'username') {
            if (value === '') {
                errorElement.textContent = 'Username is required';
                errorElement.classList.add('show');
                return false;
            }
            if (value.length < 3) {
                errorElement.textContent = 'Username must be at least 3 characters';
                errorElement.classList.add('show');
                return false;
            }
        } else if (fieldName === 'password') {
            if (value === '') {
                errorElement.textContent = 'Password is required';
                errorElement.classList.add('show');
                return false;
            }
            if (value.length < 6) {
                errorElement.textContent = 'Password must be at least 6 characters';
                errorElement.classList.add('show');
                return false;
            }
        }
        return true;
    }
}

// Initialize the form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BasicLoginForm();
});
