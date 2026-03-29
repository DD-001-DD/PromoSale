// common.js - BÜTÜN SƏHİFƏLƏR ÜÇÜN
console.log("🔧 Common.js yükləndi!");

// Header-i yenilə
function updateHeader() {
    const user = localStorage.getItem('currentUser');
    const authBtn = document.querySelector('.auth-btn');
    const profileDropdown = document.querySelector('.profile-dropdown');
    const registerBtn = document.getElementById('registerBtn');
    
    console.log("🔄 Header yenilənir...", { user: !!user });

    if (user && authBtn && profileDropdown) {
        try {
            const userData = JSON.parse(user);
            
            // Giriş düyməsini gizlət, profili göstər
            authBtn.style.display = 'none';
            profileDropdown.style.display = 'block';
            
            // İstifadəçi məlumatlarını yenilə
            const userName = profileDropdown.querySelector('.user-name');
            const userEmail = profileDropdown.querySelector('.user-email');
            const userBalance = profileDropdown.querySelector('.user-balance');
            
            if (userName) userName.textContent = userData.username || 'İstifadəçi';
            if (userEmail) userEmail.textContent = userData.email || 'email@example.com';
            if (userBalance) {
                userBalance.innerHTML = `💰 Balans: ${userData.balance || '0.00'} AZN`;
            }
            
            console.log("✅ Header yeniləndi:", userData.username);
            
        } catch (error) {
            console.error('❌ User data parse xətası:', error);
            localStorage.removeItem('currentUser');
        }
    } else if (authBtn) {
        // Giriş etməyib
        authBtn.style.display = 'flex';
        if (profileDropdown) profileDropdown.style.display = 'none';
        console.log("❌ Giriş edilməyib");
    }
    
    // Qeydiyyat düyməsini yenilə
    if (registerBtn) {
        if (user) {
            registerBtn.innerHTML = '<i class="fas fa-user"></i><span>Profilim</span>';
        } else {
            registerBtn.innerHTML = '<i class="fas fa-rocket"></i><span>Pulsuz Qeydiyyat</span>';
        }
    }
}

// Giriş yoxlaması
function checkAuth(redirectToLogin = false) {
    const user = localStorage.getItem('currentUser');
    
    if (!user && redirectToLogin) {
        showNotification('Bu səhifəyə daxil olmaq üçün giriş etməlisiniz!', 'error');
        setTimeout(() => {
            window.location.href = 'login.register.html';
        }, 2000);
        return null;
    }
    
    return user ? JSON.parse(user) : null;
}

// Notification funksiyası
function showNotification(message, type = 'success') {
    // Köhnə notificationları təmizlə
    const oldNotifications = document.querySelectorAll('.custom-notification');
    oldNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `custom-notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 10000;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Dropdown funksiyaları
function setupDropdowns() {
    const languageToggle = document.getElementById('languageToggle');
    const languageMenu = document.getElementById('languageMenu');
    const profileToggle = document.getElementById('profileToggle');
    const profileMenu = document.getElementById('profileMenu');
    
    if (languageToggle && languageMenu) {
        languageToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            languageMenu.style.display = languageMenu.style.display === 'block' ? 'none' : 'block';
            if (profileMenu) profileMenu.style.display = 'none';
        });
    }
    
    if (profileToggle && profileMenu) {
        profileToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            profileMenu.style.display = profileMenu.style.display === 'block' ? 'none' : 'block';
            if (languageMenu) languageMenu.style.display = 'none';
        });
    }
    
    // Dil seçimi
    document.querySelectorAll('.language-menu a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const lang = this.getAttribute('data-lang');
            if (languageMenu) languageMenu.style.display = 'none';
        });
    });
    
    // Xaricə kliklənəndə bağla
    document.addEventListener('click', function() {
        if (languageMenu) languageMenu.style.display = 'none';
        if (profileMenu) profileMenu.style.display = 'none';
    });
    
    // Dropdown içində kliklənəndə bağlama
    if (languageMenu) {
        languageMenu.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    if (profileMenu) {
        profileMenu.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
}

// Giriş düyməsi funksiyası
function setupAuthButton() {
    const authBtn = document.querySelector('.auth-btn');
    if (authBtn) {
        authBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'login.register.html';
        });
    }
}

// Çıxış funksiyası
function setupLogout() {
    const logoutBtn = document.querySelector('.logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            showNotification('Uğurla çıxış etdiniz!', 'success');
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        });
    }
}

// Nav linkləri
function setupNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href !== '#' && !this.classList.contains('active')) {
                // Aktiv linki təyin et
                document.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
}

// Scroll to top
function setupScrollButton() {
    const scrollBtn = document.getElementById('scrollTopBtn');
    if (scrollBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                scrollBtn.style.display = 'flex';
            } else {
                scrollBtn.style.display = 'none';
            }
        });
        
        scrollBtn.addEventListener('click', function() {
            window.scrollTo({top: 0, behavior: 'smooth'});
        });
    }
}

// CSS animasiyaları
const commonStyles = document.createElement('style');
commonStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .profile-dropdown {
        display: none;
    }
`;
document.head.appendChild(commonStyles);

// Səhifə yüklənəndə
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏠 Səhifə yükləndi - Common.js işləyir');
    
    // Header-i yenilə
    updateHeader();
    
    // Funksiyaları qur
    setupDropdowns();
    setupAuthButton();
    setupLogout();
    setupNavigation();
    setupScrollButton();
    
    console.log('✅ Common.js funksiyaları quruldu');
});

// Global funksiyalar
window.checkAuth = checkAuth;
window.showNotification = showNotification;
window.updateHeader = updateHeader;