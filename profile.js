// Tərcümə sistemləri
const translations = {
    az: {
        home: "Əsas Səhifə",
        search_page: "Kod Axtar",
        sell_code: "Kod Sat",
        about: "Məlumat",
        profile: "Profil",
        my_codes: "Kodlarım",
        balance: "Balans",
        logout: "Çıxış",
        footer_desc: "Endirim kodları platforması - həm alın, həm satın, həm qənaət edin!",
        explore: "Kəşf Edin",
        help: "Kömək",
        contact: "Əlaqə",
        faq: "FAQ",
        all_rights: "Bütün hüquqlar qorunur."
    },
    en: {
        home: "Home",
        search_page: "Search Codes",
        sell_code: "Sell Code",
        about: "About",
        profile: "Profile",
        my_codes: "My Codes",
        balance: "Balance",
        logout: "Logout",
        footer_desc: "Discount codes platform - buy, sell, and save!",
        explore: "Explore",
        help: "Help",
        contact: "Contact",
        faq: "FAQ",
        all_rights: "All rights reserved."
    },
    ru: {
        home: "Главная",
        search_page: "Поиск Кодов",
        sell_code: "Продать Код",
        about: "Информация",
        profile: "Профиль",
        my_codes: "Мои Коды",
        balance: "Баланс",
        logout: "Выйти",
        footer_desc: "Платформа промокодов - покупайте, продавайте и экономьте!",
        explore: "Исследовать",
        help: "Помощь",
        contact: "Контакты",
        faq: "Частые Вопросы",
        all_rights: "Все права защищены."
    }
};

let currentLang = 'az';
let verificationTimer;
let currentPhoneNumber = '';
let currentToken = '';

// ✅ BOT API ÜNVANI
const BOT_API = 'http://localhost:8081';

function translatePage(lang) {
    currentLang = lang;
    const translation = translations[lang];
    
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translation[key]) {
            element.textContent = translation[key];
        }
    });
    
    const languageToggle = document.getElementById('languageToggle');
    if (languageToggle) {
        languageToggle.querySelector('span').textContent = lang.toUpperCase();
    }
    
    localStorage.setItem('preferredLanguage', lang);
}

// ✅ YENİ: Token yaratma funksiyası
async function startVerification() {
    const phoneInput = document.getElementById('phoneInput');
    if (!phoneInput) return;
    
    const phoneNumber = phoneInput.value.trim();
    
    if (!isValidPhoneNumber(phoneNumber)) {
        showNotification('Zəhmət olmasa düzgün telefon nömrəsi daxil edin', 'error');
        return;
    }
    
    currentPhoneNumber = phoneNumber;
    
    console.log('🔐 Token yaradılır...', phoneNumber);
    
    try {
        const response = await fetch(`${BOT_API}/api/create-token?phone=${encodeURIComponent(phoneNumber)}`);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ API cavabı:', data);
            
            if (data.success) {
                currentToken = data.token;
                
                // Telegram linkini güncəllə
                const telegramLink = document.getElementById('telegramLink');
                if (telegramLink) {
                    telegramLink.href = data.telegram_url;
                    console.log('🔗 Telegram linki:', data.telegram_url);
                }
                
                // Tokeni göstər
                const tokenDisplay = document.getElementById('tokenDisplay');
                if (tokenDisplay) {
                    tokenDisplay.innerHTML = `<strong>Token:</strong> ${data.token}`;
                    tokenDisplay.style.display = 'block';
                }
                
                showStep(2);
                showNotification('Token uğurla yaradıldı! Telegram linkinə keçin.', 'success');
            } else {
                throw new Error(data.error || 'Token yaradıla bilmədi');
            }
        } else {
            throw new Error(`API cavab vermədi: ${response.status}`);
        }
    } catch (error) {
        console.error('❌ Token xətası:', error);
        showNotification('Token yaradıla bilmədi: ' + error.message, 'error');
    }
}

// ✅ YENİ: Token statusunu yoxlama
async function checkVerificationStatus() {
    if (!currentToken) {
        showVerificationError('Token tapılmadı. Yenidən cəhd edin.');
        return;
    }
    
    console.log('🔍 Token statusu yoxlanılır:', currentToken);
    
    try {
        const response = await fetch(`${BOT_API}/api/check-token?token=${currentToken}`);
        
        if (response.ok) {
            const data = await response.json();
            console.log('📊 Status cavabı:', data);
            
            if (data.verified) {
                showVerificationSuccess();
                showNotification('✅ Nömrə uğurla təsdiqləndi!', 'success');
            } else {
                showVerificationError('Nömrə hələ təsdiqlənməyib. Zəhmət olmasa Telegram botunda nömrənizi paylaşın.');
            }
        } else {
            throw new Error(`Status cavab vermədi: ${response.status}`);
        }
    } catch (error) {
        console.error('❌ Status yoxlama xətası:', error);
        showVerificationError('Bot əlaqəsi alınmadı. Botun işlədiyindən əmin olun.');
    }
}

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
    
    document.querySelectorAll('.language-menu a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const lang = this.getAttribute('data-lang');
            translatePage(lang);
            if (languageMenu) languageMenu.style.display = 'none';
        });
    });
    
    document.addEventListener('click', function() {
        if (languageMenu) languageMenu.style.display = 'none';
        if (profileMenu) profileMenu.style.display = 'none';
    });
    
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

function setupNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                return;
            }
            e.preventDefault();
            showNotification('Bu səhifə hazırlanma prosesindədir...', 'info');
        });
    });
    
    document.querySelectorAll('.profile-menu-item').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === 'esasmenyu.html') {
                e.preventDefault();
                showNotification('Uğurla çıxış etdiniz!', 'success');
                setTimeout(() => {
                    window.location.href = 'esasmenyu.html';
                }, 1000);
            }
        });
    });
}

function showNotification(message, type = 'info') {
    // Köhnə notificationları təmizlə
    document.querySelectorAll('.custom-notification').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? '#10b981' : 
                   type === 'error' ? '#ef4444' : 
                   type === 'warning' ? '#f59e0b' : '#2563eb';
    
    notification.className = 'custom-notification';
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 10000;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 4000);
}

function setupForms() {
    const editProfileBtn = document.querySelector('.profile-actions .btn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Profil redaktə səhifəsi hazırlanır...', 'info');
        });
    }
    
    document.querySelectorAll('.btn-outline').forEach(btn => {
        if (btn.id !== 'verifyPhoneBtn') {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const action = this.textContent.trim();
                showNotification(`${action} funksionallığı hazırlanır...`, 'info');
            });
        }
    });
}

function setupPhoneVerification() {
    const verifyPhoneBtn = document.getElementById('verifyPhoneBtn');
    const verificationModal = document.getElementById('verificationModal');
    const modalClose = document.getElementById('modalClose');
    const closeModalBtn = document.getElementById('closeModalBtn');
    
    if (verifyPhoneBtn) {
        verifyPhoneBtn.addEventListener('click', function() {
            openVerificationModal();
        });
    }
    
    if (modalClose) {
        modalClose.addEventListener('click', closeVerificationModal);
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeVerificationModal);
    }
    
    if (verificationModal) {
        verificationModal.addEventListener('click', function(e) {
            if (e.target === verificationModal) {
                closeVerificationModal();
            }
        });
    }
    
    const startVerificationBtn = document.getElementById('startVerificationBtn');
    if (startVerificationBtn) {
        startVerificationBtn.addEventListener('click', startVerification);
    }
    
    const backToStep1Btn = document.getElementById('backToStep1Btn');
    if (backToStep1Btn) {
        backToStep1Btn.addEventListener('click', function() {
            showStep(1);
        });
    }
    
    const checkVerificationBtn = document.getElementById('checkVerificationBtn');
    if (checkVerificationBtn) {
        checkVerificationBtn.addEventListener('click', checkVerificationStatus);
    }
    
    const retryVerificationBtn = document.getElementById('retryVerificationBtn');
    if (retryVerificationBtn) {
        retryVerificationBtn.addEventListener('click', function() {
            showStep(1);
            resetVerificationForm();
        });
    }
    
    const contactSupportBtn = document.getElementById('contactSupportBtn');
    if (contactSupportBtn) {
        contactSupportBtn.addEventListener('click', function() {
            showNotification('Dəstək komandamız sizinlə əlaqə saxlayacaq', 'info');
            closeVerificationModal();
        });
    }
}

function openVerificationModal() {
    const verificationModal = document.getElementById('verificationModal');
    if (verificationModal) {
        verificationModal.style.display = 'block';
        showStep(1);
        resetVerificationForm();
    }
}

function closeVerificationModal() {
    const verificationModal = document.getElementById('verificationModal');
    if (verificationModal) {
        verificationModal.style.display = 'none';
        stopVerificationTimer();
    }
}

function showStep(stepNumber) {
    for (let i = 1; i <= 4; i++) {
        const step = document.getElementById(`step${i}`);
        if (step) {
            step.style.display = 'none';
        }
    }
    
    const currentStep = document.getElementById(`step${stepNumber}`);
    if (currentStep) {
        currentStep.style.display = 'block';
    }
    
    if (stepNumber === 2) {
        startVerificationTimer();
    }
}

function resetVerificationForm() {
    const phoneInput = document.getElementById('phoneInput');
    if (phoneInput) {
        phoneInput.value = '';
    }
    currentPhoneNumber = '';
    currentToken = '';
    stopVerificationTimer();
    
    // Token display-i gizlət
    const tokenDisplay = document.getElementById('tokenDisplay');
    if (tokenDisplay) {
        tokenDisplay.style.display = 'none';
    }
}

function showVerificationSuccess() {
    const verifiedPhoneNumber = document.getElementById('verifiedPhoneNumber');
    const verificationTime = document.getElementById('verificationTime');
    
    if (verifiedPhoneNumber) {
        verifiedPhoneNumber.textContent = currentPhoneNumber;
    }
    
    if (verificationTime) {
        verificationTime.textContent = 'Az əvvəl';
    }
    
    updateProfilePhone(currentPhoneNumber);
    showStep(3);
    stopVerificationTimer();
}

function showVerificationError(message) {
    const errorMessage = document.getElementById('errorMessage');
    if (errorMessage) {
        errorMessage.textContent = message;
    }
    showStep(4);
    stopVerificationTimer();
}

function updateProfilePhone(phoneNumber) {
    const phoneDisplay = document.getElementById('phoneDisplay');
    const verificationBadge = document.getElementById('verificationBadge');
    const verifyPhoneBtn = document.getElementById('verifyPhoneBtn');
    
    if (phoneDisplay) {
        phoneDisplay.textContent = phoneNumber;
    }
    
    if (verificationBadge) {
        verificationBadge.style.display = 'inline';
    }
    
    if (verifyPhoneBtn) {
        verifyPhoneBtn.textContent = 'Dəyiş';
    }
    
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    userData.phone = phoneNumber;
    userData.phoneVerified = true;
    localStorage.setItem('userData', JSON.stringify(userData));
}

function startVerificationTimer() {
    stopVerificationTimer();
    
    let timeLeft = 600;
    const countdownElement = document.getElementById('countdown');
    
    verificationTimer = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        if (countdownElement) {
            countdownElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        
        if (timeLeft <= 0) {
            stopVerificationTimer();
            showVerificationError('Təsdiq vaxtı bitdi. Zəhmət olmasa yenidən cəhd edin.');
            return;
        }
        
        timeLeft--;
    }, 1000);
}

function stopVerificationTimer() {
    if (verificationTimer) {
        clearInterval(verificationTimer);
        verificationTimer = null;
    }
}

function isValidPhoneNumber(phone) {
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
}

// Səhifə yüklənəndə
document.addEventListener('DOMContentLoaded', function() {
    const savedLang = localStorage.getItem('preferredLanguage') || 'az';
    translatePage(savedLang);
    
    setupDropdowns();
    setupNavigation();
    setupForms();
    setupPhoneVerification();
    
    const userData = {
        name: "İstifadəçi Adı",
        email: "user@example.com",
        phone: "+994 XX XXX XX XX",
        phoneVerified: false,
        activeCodes: 15,
        balance: "$45.50",
        rating: 4.8
    };
    
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
        Object.assign(userData, JSON.parse(storedUserData));
    }
    
    document.querySelector('.profile-name').textContent = userData.name;
    document.querySelector('.profile-email').textContent = userData.email;
    document.querySelectorAll('.stat-number')[0].textContent = userData.activeCodes;
    document.querySelectorAll('.stat-number')[1].textContent = userData.balance;
    document.querySelectorAll('.stat-number')[2].textContent = userData.rating;
    
    const phoneDisplay = document.getElementById('phoneDisplay');
    const verificationBadge = document.getElementById('verificationBadge');
    const verifyPhoneBtn = document.getElementById('verifyPhoneBtn');
    
    if (phoneDisplay) {
        phoneDisplay.textContent = userData.phone;
    }
    
    if (verificationBadge && userData.phoneVerified) {
        verificationBadge.style.display = 'inline';
    }
    
    if (verifyPhoneBtn && userData.phoneVerified) {
        verifyPhoneBtn.textContent = 'Dəyiş';
    }
    
    console.log('✅ Sistem hazırdır!');
    console.log('📞 Nömrə formatı: +994501234567');
    console.log('🌐 API: http://localhost:8081');
});

// ✅ DEMO: Əl ilə test etmək üçün
window.testVerification = function() {
    console.log('🧪 Demo test başladı...');
    
    // Token yarat
    fetch('http://localhost:8081/api/create-token?phone=+994501234567')
        .then(r => r.json())
        .then(data => {
            console.log('Demo Token:', data);
            alert(`Demo Token: ${data.token}\nTelegram link: ${data.telegram_url}`);
        })
        .catch(err => console.error('Demo xəta:', err));
};