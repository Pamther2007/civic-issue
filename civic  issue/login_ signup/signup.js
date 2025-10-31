// Get form elements
const signupForm = document.getElementById('signupForm');
const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const termsCheckbox = document.getElementById('terms');
const togglePassword = document.getElementById('togglePassword');
const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');

// Get error elements
const firstNameError = document.getElementById('firstNameError');
const lastNameError = document.getElementById('lastNameError');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const confirmPasswordError = document.getElementById('confirmPasswordError');
const termsError = document.getElementById('termsError');

// Password strength elements
const strengthFill = document.getElementById('strengthFill');
const strengthText = document.getElementById('strengthText');

// Toggle password visibility
function togglePasswordVisibility(inputElement, toggleElement) {
    toggleElement.addEventListener('click', function() {
        const type = inputElement.getAttribute('type') === 'password' ? 'text' : 'password';
        inputElement.setAttribute('type', type);
        
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
}

togglePasswordVisibility(passwordInput, togglePassword);
togglePasswordVisibility(confirmPasswordInput, toggleConfirmPassword);

// Email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

// Password strength checker
function checkPasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    
    return strength;
}

// Update password strength indicator
passwordInput.addEventListener('input', function() {
    const password = this.value;
    const strength = checkPasswordStrength(password);
    
    if (!password) {
        strengthFill.style.width = '0%';
        strengthText.textContent = '';
        return;
    }
    
    let width, color, text;
    
    switch(strength) {
        case 0:
        case 1:
            width = '20%';
            color = '#ff4444';
            text = 'Weak';
            break;
        case 2:
            width = '40%';
            color = '#ffa000';
            text = 'Fair';
            break;
        case 3:
            width = '60%';
            color = '#ffca28';
            text = 'Good';
            break;
        case 4:
            width = '80%';
            color = '#66bb6a';
            text = 'Strong';
            break;
        case 5:
            width = '100%';
            color = '#4caf50';
            text = 'Very Strong';
            break;
    }
    
    strengthFill.style.width = width;
    strengthFill.style.backgroundColor = color;
    strengthText.textContent = text;
    strengthText.style.color = color;
});

// Validation functions
function validateFirstName() {
    if (!firstNameInput.value.trim()) {
        firstNameError.textContent = 'First name is required';
        firstNameInput.classList.add('error');
        return false;
    } else if (firstNameInput.value.trim().length < 2) {
        firstNameError.textContent = 'First name must be at least 2 characters';
        firstNameInput.classList.add('error');
        return false;
    } else {
        firstNameError.textContent = '';
        firstNameInput.classList.remove('error');
        return true;
    }
}

function validateLastName() {
    if (!lastNameInput.value.trim()) {
        lastNameError.textContent = 'Last name is required';
        lastNameInput.classList.add('error');
        return false;
    } else if (lastNameInput.value.trim().length < 2) {
        lastNameError.textContent = 'Last name must be at least 2 characters';
        lastNameInput.classList.add('error');
        return false;
    } else {
        lastNameError.textContent = '';
        lastNameInput.classList.remove('error');
        return true;
    }
}

function validateEmailField() {
    if (!emailInput.value) {
        emailError.textContent = 'Email is required';
        emailInput.classList.add('error');
        return false;
    } else if (!validateEmail(emailInput.value)) {
        emailError.textContent = 'Please enter a valid email';
        emailInput.classList.add('error');
        return false;
    } else {
        emailError.textContent = '';
        emailInput.classList.remove('error');
        return true;
    }
}

function validatePassword() {
    if (!passwordInput.value) {
        passwordError.textContent = 'Password is required';
        passwordInput.classList.add('error');
        return false;
    } else if (passwordInput.value.length < 8) {
        passwordError.textContent = 'Password must be at least 8 characters';
        passwordInput.classList.add('error');
        return false;
    } else {
        passwordError.textContent = '';
        passwordInput.classList.remove('error');
        return true;
    }
}

function validateConfirmPassword() {
    if (!confirmPasswordInput.value) {
        confirmPasswordError.textContent = 'Please confirm your password';
        confirmPasswordInput.classList.add('error');
        return false;
    } else if (confirmPasswordInput.value !== passwordInput.value) {
        confirmPasswordError.textContent = 'Passwords do not match';
        confirmPasswordInput.classList.add('error');
        return false;
    } else {
        confirmPasswordError.textContent = '';
        confirmPasswordInput.classList.remove('error');
        return true;
    }
}

function validateTerms() {
    if (!termsCheckbox.checked) {
        termsError.textContent = 'You must agree to the terms and conditions';
        return false;
    } else {
        termsError.textContent = '';
        return true;
    }
}

// Real-time validation
firstNameInput.addEventListener('blur', validateFirstName);
lastNameInput.addEventListener('blur', validateLastName);
emailInput.addEventListener('blur', validateEmailField);
passwordInput.addEventListener('blur', validatePassword);
confirmPasswordInput.addEventListener('blur', validateConfirmPassword);

// Clear errors on input
firstNameInput.addEventListener('input', function() {
    if (this.value) {
        firstNameError.textContent = '';
        this.classList.remove('error');
    }
});

lastNameInput.addEventListener('input', function() {
    if (this.value) {
        lastNameError.textContent = '';
        this.classList.remove('error');
    }
});

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
    if (confirmPasswordInput.value) {
        validateConfirmPassword();
    }
});

confirmPasswordInput.addEventListener('input', function() {
    if (this.value) {
        confirmPasswordError.textContent = '';
        this.classList.remove('error');
    }
});

termsCheckbox.addEventListener('change', function() {
    if (this.checked) {
        termsError.textContent = '';
    }
});

// Form submission
signupForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const isFirstNameValid = validateFirstName();
    const isLastNameValid = validateLastName();
    const isEmailValid = validateEmailField();
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();
    const isTermsValid = validateTerms();
    
    if (isFirstNameValid && isLastNameValid && isEmailValid && 
        isPasswordValid && isConfirmPasswordValid && isTermsValid) {
        
        // Get existing users
        const users = JSON.parse(localStorage.getItem('civicReportUsers')) || [];
        
        // Check if user already exists
        const userExists = users.some(user => user.email === emailInput.value);
        
        if (userExists) {
            emailError.textContent = 'This email is already registered';
            emailInput.classList.add('error');
            return;
        }
        
        // Create new user
        const newUser = {
            firstName: firstNameInput.value.trim(),
            lastName: lastNameInput.value.trim(),
            email: emailInput.value,
            password: passwordInput.value,
            signupDate: new Date().toISOString()
        };
        
        // Add user to array
        users.push(newUser);
        
        // Save to localStorage
        localStorage.setItem('civicReportUsers', JSON.stringify(users));
        
        // Show success message
        showSuccessMessage('Account created successfully! Redirecting to login...');
        
        // Redirect to login
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
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