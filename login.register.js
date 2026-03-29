// login.register.js - SADƏ VERSİYA
console.log("🔐 Giriş sistemi yükləndi!");

// Tərcümə sistemləri
const translations = {
    az: {
        login: "Giriş",
        register: "Qeydiyyat",
        welcome_back: "Xoş gəlmisiniz!",
        login_subtitle: "Hesabınıza daxil olun",
        email: "E-poçt",
        password: "Şifrə",
        remember_me: "Məni xatırla",
        forgot_password: "Şifrəni unutmusunuz?",
        create_account: "Hesab yaradın",
        register_subtitle: "PromoMarket icmasına qoşulun",
        username: "İstifadəçi adı",
        confirm_password: "Şifrəni təsdiqlə",
        login_success: "Giriş uğurlu!",
        register_success: "Qeydiyyat uğurlu!",
        fill_all_fields: "Xahiş edirik bütün sahələri doldurun!",
        passwords_not_match: "Şifrələr uyğun gəlmir!",
        password_too_short: "Şifrə ən azı 8 simvol olmalıdır!"
    },
    en: {
        login: "Login",
        register: "Register",
        welcome_back: "Welcome Back!",
        login_subtitle: "Sign in to your account",
        email: "Email",
        password: "Password",
        remember_me: "Remember me",
        forgot_password: "Forgot password?",
        create_account: "Create Account",
        register_subtitle: "Join the PromoMarket community",
        username: "Username",
        confirm_password: "Confirm Password",
        login_success: "Login successful!",
        register_success: "Registration successful!",
        fill_all_fields: "Please fill in all fields!",
        passwords_not_match: "Passwords do not match!",
        password_too_short: "Password must be at least 8 characters!"
    }
};

let currentLang = 'az';

// Tab keçid funksiyası
function setupAuthTabs() {
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginTab && registerTab) {
        loginTab.addEventListener('click', function() {
            switchToTab('login');
        });
        
        registerTab.addEventListener('click', function() {
            switchToTab('register');
        });
    }
}

function switchToTab(tabName) {
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (tabName === 'login') {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
    } else {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
    }
}

// Şifrə göstər/gizlə
function setupPasswordToggles() {
    document.querySelectorAll('.password-toggle').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.className = 'fas fa-eye-slash';
            } else {
                input.type = 'password';
                icon.className = 'fas fa-eye';
            }
        });
    });
}

// Giriş formu
function setupLoginForm() {
    const loginForm = document.getElementById('loginFormElement');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            if (!email || !password) {
                showNotification(translations[currentLang].fill_all_fields, 'error');
                return;
            }
            
            try {
                const formData = new FormData();
                formData.append('email', email);
                formData.append('password', password);
                
                const response = await fetch('login.php', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showNotification(translations[currentLang].login_success, 'success');
                    
                    // İstifadəçi məlumatlarını yadda saxla
                    localStorage.setItem('currentUser', JSON.stringify(result.user));
                    
                    setTimeout(() => {
                        window.location.href = 'esasmenyu.html';
                    }, 1000);
                    
                } else {
                    showNotification(result.message, 'error');
                }
            } catch (error) {
                console.error('Giriş xətası:', error);
                showNotification('Server xətası. Zəhmət olmasa yenidən cəhd edin.', 'error');
            }
        });
    }
}

// Qeydiyyat formu
function setupRegisterForm() {
    const registerForm = document.getElementById('registerFormElement');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('registerUsername').value;
            const email = document.getElementById('registerEmail').value;
            const phone = document.getElementById('registerPhone').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('registerConfirmPassword').value;
            
            // Validation
            if (!username || !email || !phone || !password || !confirmPassword) {
                showNotification(translations[currentLang].fill_all_fields, 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showNotification(translations[currentLang].passwords_not_match, 'error');
                return;
            }
            
            if (password.length < 8) {
                showNotification(translations[currentLang].password_too_short, 'error');
                return;
            }
            
            try {
                const formData = new FormData();
                formData.append('username', username);
                formData.append('email', email);
                formData.append('phone', phone);
                formData.append('password', password);
                formData.append('confirm_password', confirmPassword);
                
                console.log('Qeydiyyat məlumatları göndərilir...');
                
                const response = await fetch('register.php', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                console.log('Qeydiyyat cavabı:', result);
                
                if (result.success) {
                    showNotification(translations[currentLang].register_success, 'success');
                    
                    // İstifadəçi məlumatlarını yadda saxla
                    localStorage.setItem('currentUser', JSON.stringify(result.user));
                    
                    setTimeout(() => {
                        window.location.href = 'esasmenyu.html';
                    }, 1000);
                    
                } else {
                    showNotification(result.message, 'error');
                }
            } catch (error) {
                console.error('Qeydiyyat xətası:', error);
                showNotification('Server xətası. Zəhmət olmasa yenidən cəhd edin.', 'error');
            }
        });
    }
}

// Notification
function showNotification(message, type = 'success') {
    // Köhnə notificationları təmizlə
    const oldNotifications = document.querySelectorAll('.custom-notification');
    oldNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `custom-notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check' : 'exclamation-triangle'}"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 10000;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// CSS animasiyaları
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
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Giriş statusunu yoxla
function checkAuthStatus() {
    const user = localStorage.getItem('currentUser');
    const authSection = document.getElementById('authSection');
    const profileSection = document.getElementById('profileSection');
    
    if (user && authSection && profileSection) {
        const userData = JSON.parse(user);
        authSection.style.display = 'none';
        profileSection.style.display = 'block';
        
        document.getElementById('profileUsername').textContent = userData.username;
        document.getElementById('profileEmail').textContent = userData.email;
    }
}

// Səhifə yüklənəndə
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔐 Giriş sistemi işə başladı!');
    
    setupAuthTabs();
    setupPasswordToggles();
    setupLoginForm();
    setupRegisterForm();
    checkAuthStatus();
    
    // Forgot password
    document.querySelector('.forgot-password')?.addEventListener('click', function(e) {
        e.preventDefault();
        showNotification('Şifrə bərpa funksiyası hazırlanır...', 'success');
    });
    
    // Social auth
    document.querySelectorAll('.btn-google, .btn-facebook').forEach(btn => {
        btn.addEventListener('click', function() {
            showNotification('Social giriş sistemi hazırlanır...', 'success');
        });
    });
});