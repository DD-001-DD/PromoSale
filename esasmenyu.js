// esasmenyu.js - TAM YENİ KOD
console.log("🏠 Əsas səhifə yükləndi!");

// Tərcümə sistemləri
const translations = {
    az: {
        // Navigation
        home: "Əsas Səhifə",
        search_page: "Kod Axtar",
        sell_code: "Kod Sat",
        about: "Məlumat",
        login_register: "Giriş / Qeydiyyat",
        
        // Hero Section
        hero_title: "Endirim Kodları ilə<br><span class='hero-accent'>Qənaət Edin, Qazanın</span>",
        hero_subtitle: "1000-dən çox mağazadan eksklüziv endirim kodları. Həm alın, həm satın, həm qənaət edin!",
        search_placeholder: "Mağaza və ya məhsul axtar...",
        search: "Axtar",
        
        // Features
        why_promomarket: "Niyə PromoMarket?",
        reliable: "100% Etibarlı",
        reliable_desc: "Bütün kodlarımız yoxlanılıb və zəmanətlidir. Saxta kod problemindən narahat olmayın.",
        fast: "Sürətli Aktivasiya",
        fast_desc: "Kodları dərhal alın və istifadə edin. Heç bir gözləmə, ani aktivasiya.",
        earn: "Gəlir Əldə Edin",
        earn_desc: "Öz kodlarınızı sataraq əlavə gəlir əldə edin. Həm qənaət, həm qazanç!",
        
        // Popular Codes
        popular_codes: "Populyar Kodlar",
        view_all_codes: "Bütün Kodlara Bax",
        
        // Stats
        active_codes: "Aktiv Kod",
        partner_stores: "Partnyor Mağaza",
        total_savings: "Ümumi Qənaət",
        customer_rating: "Müştəri Rəyi",
        
        // CTA
        join_now: "İndi Qoşulun!",
        join_desc: "PromoMarket icmasına qoşulun və endirimlərin üstünlüklərindən yararlanın.",
        free_register: "Pulsuz Qeydiyyat",
        how_it_works: "Necə İşləyir?",
        
        // Footer
        footer_desc: "Endirim kodları platforması - həm alın, həm satın, həm qənaət edin!",
        explore: "Kəşf Edin",
        help: "Kömək",
        contact: "Əlaqə",
        faq: "FAQ",
        terms: "İstifadə Qaydaları",
        privacy: "Gizlilik Siyasəti",
        all_rights: "Bütün hüquqlar qorunur."
    },
    en: {
        home: "Home",
        search_page: "Search Codes",
        sell_code: "Sell Code",
        about: "About",
        login_register: "Login / Register",
        
        hero_title: "Discount Codes<br><span class='hero-accent'>Save Money, Earn Money</span>",
        hero_subtitle: "Exclusive discount codes from 1000+ stores. Buy, sell, and save!",
        search_placeholder: "Search store or product...",
        search: "Search",
        
        why_promomarket: "Why PromoMarket?",
        reliable: "100% Reliable",
        reliable_desc: "All our codes are verified and guaranteed. No worries about fake codes.",
        fast: "Fast Activation",
        fast_desc: "Buy and use codes immediately. No waiting, instant activation.",
        earn: "Earn Money",
        earn_desc: "Sell your own codes and earn extra income. Both savings and earnings!",
        
        popular_codes: "Popular Codes",
        view_all_codes: "View All Codes",
        
        active_codes: "Active Codes",
        partner_stores: "Partner Stores",
        total_savings: "Total Savings",
        customer_rating: "Customer Rating",
        
        join_now: "Join Now!",
        join_desc: "Join the PromoMarket community and enjoy the benefits of discounts.",
        free_register: "Free Register",
        how_it_works: "How It Works?",
        
        footer_desc: "Discount codes platform - buy, sell, and save!",
        explore: "Explore",
        help: "Help",
        contact: "Contact",
        faq: "FAQ",
        terms: "Terms of Use",
        privacy: "Privacy Policy",
        all_rights: "All rights reserved."
    },
    ru: {
        home: "Главная",
        search_page: "Поиск Кодов",
        sell_code: "Продать Код",
        about: "Информация",
        login_register: "Вход / Регистрация",
        
        hero_title: "Промокоды<br><span class='hero-accent'>Экономьте, Зарабатывайте</span>",
        hero_subtitle: "Эксклюзивные коды скидок из 1000+ магазинов. Покупайте, продавайте и экономьте!",
        search_placeholder: "Поиск магазина или товара...",
        search: "Поиск",
        
        why_promomarket: "Почему PromoMarket?",
        reliable: "100% Надежно",
        reliable_desc: "Все наши коды проверены и гарантированы. Не беспокойтесь о поддельных кодах.",
        fast: "Быстрая Активация",
        fast_desc: "Покупайте и используйте коды сразу. Без ожидания, мгновенная активация.",
        earn: "Зарабатывайте",
        earn_desc: "Продавайте свои коды и получайте дополнительный доход. И экономия, и заработок!",
        
        popular_codes: "Популярные Коды",
        view_all_codes: "Все Коды",
        
        active_codes: "Активные Коды",
        partner_stores: "Партнерские Магазины",
        total_savings: "Общая Экономия",
        customer_rating: "Рейтинг Покупателей",
        
        join_now: "Присоединяйтесь!",
        join_desc: "Присоединяйтесь к сообществу PromoMarket и наслаждайтесь преимуществами скидок.",
        free_register: "Бесплатная Регистрация",
        how_it_works: "Как Это Работает?",
        
        footer_desc: "Платформа промокодов - покупайте, продавайте и экономьте!",
        explore: "Исследовать",
        help: "Помощь",
        contact: "Контакты",
        faq: "Частые Вопросы",
        terms: "Условия Использования",
        privacy: "Политика Конфиденциальности",
        all_rights: "Все права защищены."
    }
};

// Cari dil
let currentLang = 'az';

// Tərcümə funksiyası
function translatePage(lang) {
    currentLang = lang;
    const translation = translations[lang];
    
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translation[key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation[key];
            } else {
                element.innerHTML = translation[key];
            }
        }
    });
    
    const langToggle = document.getElementById('languageToggle');
    if (langToggle) {
        const span = langToggle.querySelector('span');
        if (span) {
            span.textContent = lang.toUpperCase();
        }
    }
    
    localStorage.setItem('preferredLanguage', lang);
}

// Header-i yenilə
function updateHeader() {
    const user = localStorage.getItem('currentUser');
    const authBtn = document.getElementById('authButton');
    const profileDropdown = document.querySelector('.profile-dropdown');
    const registerBtn = document.getElementById('registerBtn');
    
    if (user && authBtn && profileDropdown) {
        const userData = JSON.parse(user);
        authBtn.style.display = 'none';
        profileDropdown.style.display = 'block';
        if (registerBtn) {
            registerBtn.innerHTML = '<i class="fas fa-user"></i><span>Profilim</span>';
        }
        
        // İstifadəçi məlumatlarını yenilə
        const userName = profileDropdown.querySelector('.user-name');
        const userEmail = profileDropdown.querySelector('.user-email');
        if (userName) userName.textContent = userData.username;
        if (userEmail) userEmail.textContent = userData.email;
    } else if (registerBtn) {
        registerBtn.innerHTML = '<i class="fas fa-rocket"></i><span>Pulsuz Qeydiyyat</span>';
    }
}

// Giriş düyməsi funksiyası
function setupAuthButton() {
    const authBtn = document.getElementById('authButton');
    if (authBtn) {
        authBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'login.register.html';
        });
    }
}

// Qeydiyyat düyməsi
function setupRegisterButton() {
    const registerBtn = document.getElementById('registerBtn');
    if (registerBtn) {
        registerBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const user = localStorage.getItem('currentUser');
            if (user) {
                window.location.href = 'profile.html';
            } else {
                window.location.href = 'login.register.html';
            }
        });
    }
}

// Necə işləyir düyməsi
function setupHowItWorksButton() {
    const howItWorksBtn = document.getElementById('howItWorksBtn');
    if (howItWorksBtn) {
        howItWorksBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'melumat.html';
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
            showNotification('Uğurla çıxış etdiniz!');
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        });
    }
}

// Axtarış funksiyası
function setupSearch() {
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('mainSearch');
    
    if (searchButton && searchInput) {
        searchButton.addEventListener('click', function() {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                window.location.href = `kodaxtar.html?search=${encodeURIComponent(searchTerm)}`;
            } else {
                window.location.href = 'kodaxtar.html';
            }
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchButton.click();
            }
        });
    }
}

// Populyar kodları yüklə
function loadPopularCodes() {
    const grid = document.getElementById('popularCodesGrid');
    if (!grid) return;
    
    const sampleCodes = [
        {
            id: 1,
            store_name: "Nike",
            category: "clothing",
            discount: "15",
            price: "2.99",
            description: "Nike idman ayaqqabıları və geyimləri üçün 15% endirim"
        },
        {
            id: 2,
            store_name: "Steam",
            category: "games",
            discount: "25", 
            price: "1.99",
            description: "Steam platformasında bütün oyunlarda etibarlıdır"
        },
        {
            id: 3,
            store_name: "Starbucks",
            category: "food",
            discount: "10",
            price: "0.99",
            description: "Starbucks kofe və içkilərində endirim"
        }
    ];
    
    grid.innerHTML = sampleCodes.map(code => `
        <div class="code-card-home">
            <div class="code-header-home">
                <div class="store-info-home">
                    <div class="store-logo-home ${code.category}">
                        <i class="fas fa-${getStoreIcon(code.category)}"></i>
                    </div>
                    <div class="store-details-home">
                        <h3>${code.store_name}</h3>
                        <div class="store-category-home">${code.category}</div>
                    </div>
                </div>
                <div class="discount-badge-home">${code.discount}%</div>
            </div>
            <p class="code-description-home">${code.description}</p>
            <div class="code-price-home">
                <span class="price">${code.price} AZN</span>
                <button class="buy-btn-home" onclick="redirectToSearch('${code.store_name}')">
                    <i class="fas fa-shopping-cart"></i>
                    Almaq
                </button>
            </div>
        </div>
    `).join('');
}

// Mağaza iconunu təyin et
function getStoreIcon(category) {
    const icons = {
        clothing: 'tshirt',
        electronics: 'laptop',
        games: 'gamepad',
        sports: 'futbol',
        food: 'utensils',
        beauty: 'spa',
        travel: 'plane'
    };
    return icons[category] || 'tag';
}

// Axtarışa yönləndir
function redirectToSearch(storeName) {
    const user = localStorage.getItem('currentUser');
    if (!user) {
        showNotification('Kod almaq üçün giriş etməlisiniz!', 'error');
        setTimeout(() => {
            window.location.href = 'login.register.html';
        }, 2000);
        return;
    }
    window.location.href = `kodaxtar.html?search=${encodeURIComponent(storeName)}`;
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

// Notification funksiyası
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
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
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Statistikaları yenilə
function updateStats() {
    // Bu hissəni real məlumatlarla əvəz edə bilərsiniz
    const stats = {
        totalCodes: "10,000+",
        totalStores: "500+", 
        totalSavings: "$50K+",
        rating: "4.9/5"
    };
    
    document.getElementById('totalCodes').textContent = stats.totalCodes;
    document.getElementById('totalStores').textContent = stats.totalStores;
    document.getElementById('totalSavings').textContent = stats.totalSavings;
    document.getElementById('rating').textContent = stats.rating;
}

// Səhifə yüklənəndə
document.addEventListener('DOMContentLoaded', function() {
    console.log("📄 Əsas səhifə hazırdır!");
    
    const savedLang = localStorage.getItem('preferredLanguage') || 'az';
    translatePage(savedLang);
    
    // Header-i yenilə
    updateHeader();
    
    // Funksiyaları qur
    setupAuthButton();
    setupRegisterButton();
    setupHowItWorksButton();
    setupLogout();
    setupSearch();
    setupDropdowns();
    setupScrollButton();
    
    // Məlumatları yüklə
    loadPopularCodes();
    updateStats();
    
    // Nav linkləri
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href !== '#' && !this.classList.contains('active')) {
                e.preventDefault();
                window.location.href = href;
            }
        });
    });
    
    // Footer linkləri
    document.querySelectorAll('.footer-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                e.preventDefault();
                window.location.href = href;
            }
        });
    });
    
    console.log("✅ Əsas səhifə tam yükləndi!");
});

// CSS əlavə et (kod kartları üçün)
const homeStyles = document.createElement('style');
homeStyles.textContent = `
    .code-card-home {
        background: white;
        padding: 1.5rem;
        border-radius: 12px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        border: 1px solid #e2e8f0;
        transition: all 0.3s ease;
    }
    
    .code-card-home:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }
    
    .code-header-home {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1rem;
    }
    
    .store-info-home {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .store-logo-home {
        width: 50px;
        height: 50px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
        color: white;
    }
    
    .store-logo-home.clothing { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%); }
    .store-logo-home.electronics { background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%); }
    .store-logo-home.games { background: linear-gradient(135deg, #45b7d1 0%, #96c93d 100%); }
    .store-logo-home.food { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
    
    .store-details-home h3 {
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 0.25rem;
        color: #1e293b;
    }
    
    .store-category-home {
        font-size: 0.8rem;
        color: #64748b;
        background: #f1f5f9;
        padding: 0.25rem 0.5rem;
        border-radius: 6px;
    }
    
    .discount-badge-home {
        background: linear-gradient(135deg, #10b981 0%, #3cb371 100%);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-weight: 700;
        font-size: 0.9rem;
    }
    
    .code-description-home {
        color: #64748b;
        font-size: 0.9rem;
        margin-bottom: 1rem;
        line-height: 1.4;
    }
    
    .code-price-home {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .code-price-home .price {
        font-size: 1.25rem;
        font-weight: 700;
        color: #1e293b;
    }
    
    .buy-btn-home {
        background: #f59e0b;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .buy-btn-home:hover {
        background: #eab308;
        transform: translateY(-1px);
    }
    
    .popular-codes .codes-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
    }
`;
document.head.appendChild(homeStyles);