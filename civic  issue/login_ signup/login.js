// Get form elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');

// Toggle password visibility
togglePassword.addEventListener('click', function() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    this.innerHTML = type === 'password' 
        ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
           </svg>`
        : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
           </svg>`;
});

// Email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

// Real-time validation
emailInput.addEventListener('blur', function() {
    if (!this.value) {
        emailError.textContent = 'Email is required';
        this.classList.add('error');
    } else if (!validateEmail(this.value)) {
        emailError.textContent = 'Please enter a valid email';
        this.classList.add('error');
    } else {
        emailError.textContent = '';
        this.classList.remove('error');
    }
});

passwordInput.addEventListener('blur', function() {
    if (!this.value) {
        passwordError.textContent = 'Password is required';
        this.classList.add('error');
    } else if (this.value.length < 6) {
        passwordError.textContent = 'Password must be at least 6 characters';
        this.classList.add('error');
    } else {
        passwordError.textContent = '';
        this.classList.remove('error');
    }
});

// Clear error on input
emailInput.addEventListener('input', function() {
    if (this.value) {
        emailError.textContent = '';
        this.classList.remove('error');
    }
});

passwordInput.addEventListener('input', function() {
    if (this.value) {
        passwordError.textContent = '';
        this.classList.remove('error');
    }
});

// Form submission
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    emailError.textContent = '';
    passwordError.textContent = '';
    emailInput.classList.remove('error');
    passwordInput.classList.remove('error');
    
    let isValid = true;
    
    if (!emailInput.value) {
        emailError.textContent = 'Email is required';
        emailInput.classList.add('error');
        isValid = false;
    } else if (!validateEmail(emailInput.value)) {
        emailError.textContent = 'Please enter a valid email';
        emailInput.classList.add('error');
        isValid = false;
    }
    
    if (!passwordInput.value) {
        passwordError.textContent = 'Password is required';
        passwordInput.classList.add('error');
        isValid = false;
    } else if (passwordInput.value.length < 6) {
        passwordError.textContent = 'Password must be at least 6 characters';
        passwordInput.classList.add('error');
        isValid = false;
    }
    
    if (isValid) {
        // Get registered users
        const users = JSON.parse(localStorage.getItem('civicReportUsers')) || [];
        
        // Find matching user
        const user = users.find(u => u.email === emailInput.value && u.password === passwordInput.value);
        
        if (user) {
            // Save login session
            const loginData = {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                loginTime: new Date().toISOString(),
                isLoggedIn: true
            };
            
            localStorage.setItem('civicReportAuth', JSON.stringify(loginData));
            
            // Show success message
            showSuccessMessage('Login successful! Redirecting...');
            
            // Redirect to home page (correct relative path to landing_page)
            setTimeout(() => {
                window.location.href = '../landing_page/home.html';
            }, 1000);
        } else {
            passwordError.textContent = 'Invalid email or password';
            passwordInput.classList.add('error');
        }
    }
});

// Success message function
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4caf50;
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 2000);
}

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);