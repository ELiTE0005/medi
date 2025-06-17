// Global variables
let currentUser = null;
let medicines = [];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    setupEventListeners();
    addAnimationClasses();
});

function setupEventListeners() {
    // Close modal
    document.querySelector('.close').onclick = function() {
        closeModalWithAnimation();
    }
    
    // Medicine form submission
    document.getElementById('medicineForm').addEventListener('submit', addMedicineWithAnimation);
    
    // Close modal when clicking outside
    window.onclick = function(event) {
        const modal = document.getElementById('authModal');
        if (event.target === modal) {
            closeModalWithAnimation();
        }
    }
}

function addAnimationClasses() {
    // Add staggered animation classes to form inputs
    const inputs = document.querySelectorAll('#medicineForm input, #medicineForm select');
    inputs.forEach((input, index) => {
        input.classList.add(`stagger-${index + 1}`);
    });
}

function closeModalWithAnimation() {
    const modal = document.getElementById('authModal');
    const modalContent = document.querySelector('.modal-content');
    
    modalContent.style.animation = 'modalSlideIn 0.3s ease-out reverse';
    modal.style.animation = 'fadeIn 0.3s ease-out reverse';
    
    setTimeout(() => {
        modal.style.display = 'none';
        // Reset animations
        modalContent.style.animation = '';
        modal.style.animation = '';
    }, 300);
}

function checkLoginStatus() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showAppWithAnimation();
        loadUserMedicines();
    } else {
        showAuthModal();
    }
}

function showAuthModal() {
    document.getElementById('authModal').style.display = 'flex';
    document.getElementById('app').style.display = 'none';
}

function showAppWithAnimation() {
    document.getElementById('authModal').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    document.getElementById('userName').textContent = currentUser.name;
    
    // Animate sections appearing
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        section.style.animationDelay = `${index * 0.2}s`;
    });
    
    displayMedicines();
}

function showLogin() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    registerForm.style.animation = 'slideInFromLeft 0.3s ease-out reverse';
    setTimeout(() => {
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
        loginForm.style.animation = 'slideInFromRight 0.3s ease-out';
    }, 300);
}

function showRegister() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    loginForm.style.animation = 'slideInFromRight 0.3s ease-out reverse';
    setTimeout(() => {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        registerForm.style.animation = 'slideInFromLeft 0.3s ease-out';
    }, 300);
}

function register() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    if (!name || !email || !password) {
        showErrorAnimation('Please fill in all fields');
        return;
    }
    
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(user => user.email === email)) {
        showErrorAnimation('User already exists with this email');
        return;
    }
    
    // Create new user
    const newUser = { name, email, password, id: Date.now() };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    showSuccessAnimation('Registration successful! Please login.');
    setTimeout(() => showLogin(), 1500);
}

function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showErrorAnimation('Please fill in all fields');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        showSuccessAnimation('Login successful!');
        setTimeout(() => {
            showAppWithAnimation();
            loadUserMedicines();
        }, 1000);
    } else {
        showErrorAnimation('Invalid email or password');
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    medicines = [];
    
    // Animate logout
    const app = document.getElementById('app');
    app.style.animation = 'fadeIn 0.5s ease-out reverse';
    setTimeout(() => {
        showAuthModal();
        app.style.animation = '';
    }, 500);
}

function addMedicineWithAnimation(e) {
    e.preventDefault();
    
    const button = e.target.querySelector('button');
    const originalText = button.textContent;
    
    // Show loading animation
    button.innerHTML = '<span class="loading"></span> Adding...';
    button.disabled = true;
    
    setTimeout(() => {
        const name = document.getElementById('medicineName').value;
        const dosage = document.getElementById('dosage').value;
        const time = document.getElementById('medicineTime').value;
        const frequency = document.getElementById('frequency').value;
        
        if (!name || !dosage || !time || !frequency) {
            showErrorAnimation('Please fill in all fields');
            button.textContent = originalText;
            button.disabled = false;
            return;
        }
        
        const medicine = {
            id: Date.now(),
            name,
            dosage,
            time,
            frequency,
            userId: currentUser.id,
            status: 'pending',
            dateAdded: new Date().toISOString().split('T')[0]
        };
        
        medicines.push(medicine);
        saveMedicines();
        displayMedicinesWithAnimation();
        
        // Reset form with animation
        document.getElementById('medicineForm').reset();
        button.textContent = originalText;
        button.disabled = false;
        
        showSuccessAnimation('Medicine added successfully!');
    }, 1000);
}

function showSuccessAnimation(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    const form = document.getElementById('medicineForm');
    form.parentNode.insertBefore(successDiv, form.nextSibling);
    
    setTimeout(() => {
        successDiv.style.animation = 'slideInFromTop 0.3s ease-out reverse';
        setTimeout(() => successDiv.remove(), 300);
    }, 3000);
}

function showErrorAnimation(message) {
    // Create error message with shake animation
    const inputs = document.querySelectorAll('#medicineForm input, #registerForm input, #loginForm input');
    inputs.forEach(input => {
        if (!input.value) {
            input.style.animation = 'shake 0.5s ease-in-out';
            input.style.borderColor = '#dc3545';
            setTimeout(() => {
                input.style.animation = '';
                input.style.borderColor = '';
            }, 500);
        }
    });
    
    alert(message); // You can replace this with a custom animated notification
}

function saveMedicines() {
    const allMedicines = JSON.parse(localStorage.getItem('medicines') || '[]');
    const otherUserMedicines = allMedicines.filter(med => med.userId !== currentUser.id);
    const updatedMedicines = [...otherUserMedicines, ...medicines];
    localStorage.setItem('medicines', JSON.stringify(updatedMedicines));
}

function loadUserMedicines() {
    const allMedicines = JSON.parse(localStorage.getItem('medicines') || '[]');
    medicines = allMedicines.filter(med => med.userId === currentUser.id);
    displayMedicines();
}

function displayMedicines() {
    displayTodaysMedicines();
    displayAllMedicines();
}

function displayMedicinesWithAnimation() {
    displayTodaysMedicinesWithAnimation();
    displayAllMedicinesWithAnimation();
}

function displayTodaysMedicinesWithAnimation() {
    const today = new Date().toISOString().split('T')[0];
    const todaysMedicines = medicines.filter(med => {
        if (med.frequency === 'daily') return true;
        if (med.frequency === 'weekly') {
            const daysDiff = Math.floor((new Date() - new Date(med.dateAdded)) / (1000 * 60 * 60 * 24));
            return daysDiff % 7 === 0;
        }
        if (med.frequency === 'monthly') {
            const daysDiff = Math.floor((new Date() - new Date(med.dateAdded)) / (1000 * 60 * 60 * 24));
            return daysDiff % 30 === 0;
        }
        return false;
    });
    
    const container = document.getElementById('todaysList');
    container.innerHTML = '';
    
    if (todaysMedicines.length === 0) {
        container.innerHTML = '<p style="animation: fadeIn 0.5s ease-out;">No medicines scheduled for today.</p>';
        return;
    }
    
    todaysMedicines.forEach((medicine, index) => {
        setTimeout(() => {
            const medicineElement = createMedicineElementWithAnimation(medicine, true);
            container.appendChild(medicineElement);
        }, index * 100);
    });
}

function displayAllMedicinesWithAnimation() {
    const container = document.getElementById('allMedicinesList');
    container.innerHTML = '';
    
    if (medicines.length === 0) {
        container.innerHTML = '<p style="animation: fadeIn 0.5s ease-out;">No medicines added yet.</p>';
        return;
    }
    
    medicines.forEach((medicine, index) => {
        setTimeout(() => {
            const medicineElement = createMedicineElementWithAnimation(medicine, false);
            container.appendChild(medicineElement);
        }, index * 100);
    });
}

function displayTodaysMedicines() {
    displayTodaysMedicinesWithAnimation();
}

function displayAllMedicines() {
    displayAllMedicinesWithAnimation();
}

function createMedicineElementWithAnimation(medicine, showStatus) {
    const div = document.createElement('div');
    div.className = 'medicine-item';
    div.style.opacity = '0';
    div.style.transform = 'translateX(-50px)';
    
    div.innerHTML = `
        <div class="medicine-info">
            <h3>${medicine.name}</h3>
            <p><strong>Dosage:</strong> ${medicine.dosage}</p>
            <p><strong>Time:</strong> ${medicine.time}</p>
            <p><strong>Frequency:</strong> ${medicine.frequency}</p>
        </div>
        <div class="medicine-actions">
            ${showStatus ? `
                <button class="status-btn ${getStatusClass(medicine.status)}" 
                        onclick="toggleStatusWithAnimation(${medicine.id})">
                    ${getStatusText(medicine.status)}
                </button>
            ` : ''}
            <button class="delete-btn" onclick="deleteMedicineWithAnimation(${medicine.id})">
                Delete
            </button>
        </div>
    `;
    
    // Animate in
    setTimeout(() => {
        div.style.transition = 'all 0.5s ease-out';
        div.style.opacity = '1';
        div.style.transform = 'translateX(0)';
    }, 50);
    
    return div;
}

function createMedicineElement(medicine, showStatus) {
    return createMedicineElementWithAnimation(medicine, showStatus);
}

function getStatusClass(status) {
    switch(status) {
        case 'taken': return 'status-taken';
        case 'missed': return 'status-missed';
        default: return 'status-pending';
    }
}

function getStatusText(status) {
    switch(status) {
        case 'taken': return 'Taken ✓';
        case 'missed': return 'Missed ✗';
        default: return 'Mark as Taken';
    }
}

function toggleStatusWithAnimation(medicineId) {
    const medicine = medicines.find(med => med.id === medicineId);
    const button = event.target;
    
    if (medicine) {
        // Add click animation
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 100);
        
        if (medicine.status === 'pending') {
            medicine.status = 'taken';
        } else if (medicine.status === 'taken') {
            medicine.status = 'missed';
        } else {
            medicine.status = 'pending';
        }
        
        saveMedicines();
        
        // Animate status change
        setTimeout(() => {
            displayMedicinesWithAnimation();
        }, 200);
    }
}

function toggleStatus(medicineId) {
    toggleStatusWithAnimation(medicineId);
}

function deleteMedicineWithAnimation(medicineId) {
    if (confirm('Are you sure you want to delete this medicine?')) {
        const medicineElement = event.target.closest('.medicine-item');
        
        // Animate out
        medicineElement.style.transition = 'all 0.3s ease-out';
        medicineElement.style.transform = 'translateX(100px)';
        medicineElement.style.opacity = '0';
        
        setTimeout(() => {
            medicines = medicines.filter(med => med.id !== medicineId);
            saveMedicines();
            displayMedicinesWithAnimation();
        }, 300);
    }
}

function deleteMedicine(medicineId) {
    deleteMedicineWithAnimation(medicineId);
}
