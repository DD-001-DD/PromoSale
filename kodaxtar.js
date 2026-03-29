// kodaxtar.js - GİRİŞ SİSTEMİ İLƏ İNTEGRASİYA
console.log("🚀 kodaxtar.js yükləndi!");

let allCodes = [];
let filteredCodes = [];
let purchasedCodes = {};

// Mağaza iconları
const storeIcons = {
    clothing: '👕',
    electronics: '📱',
    games: '🎮',
    sports: '⚽',
    food: '🍕',
    beauty: '💄',
    travel: '✈️'
};

// Kateqoriya adları
const categoryNames = {
    az: {
        clothing: "Geyim",
        electronics: "Elektronika", 
        games: "Oyun",
        sports: "İdman",
        food: "Yemək",
        beauty: "Gözəllik",
        travel: "Səyahət"
    },
    en: {
        clothing: "Clothing",
        electronics: "Electronics",
        games: "Games",
        sports: "Sports",
        food: "Food",
        beauty: "Beauty",
        travel: "Travel"
    },
    ru: {
        clothing: "Одежда",
        electronics: "Электроника",
        games: "Игры",
        sports: "Спорт",
        food: "Еда",
        beauty: "Красота",
        travel: "Путешествия"
    }
};

// Giriş yoxlaması
function checkAuth() {
    const user = localStorage.getItem('currentUser');
    if (!user) {
        showNotification('Giriş etməmisiniz! Kod almaq üçün giriş edin.', 'error');
        return null;
    }
    return JSON.parse(user);
}

// Header-i yenilə
function updateHeader() {
    const user = localStorage.getItem('currentUser');
    const authBtn = document.querySelector('.auth-btn');
    const profileDropdown = document.querySelector('.profile-dropdown');
    
    if (user && authBtn && profileDropdown) {
        const userData = JSON.parse(user);
        authBtn.style.display = 'none';
        profileDropdown.style.display = 'block';
        
        // Profil məlumatlarını yenilə
        const userName = profileDropdown.querySelector('.user-name');
        const userEmail = profileDropdown.querySelector('.user-email');
        if (userName) userName.textContent = userData.username;
        if (userEmail) userEmail.textContent = userData.email;
    }
}

// Kodları yüklə
async function loadCodes() {
    console.log("🔄 Kodlar yüklənir...");
    
    try {
        const response = await fetch('get_approved_ads.php');
        console.log("📡 API Status:", response.status);
        
        if (!response.ok) {
            throw new Error('API error: ' + response.status);
        }
        
        const data = await response.json();
        console.log("📊 API Data alındı:", data);
        
        if (Array.isArray(data)) {
            console.log("🔢 Kod sayı:", data.length);
            allCodes = data;
            filteredCodes = [...data];
        } else {
            console.error("❌ Data array deyil:", data);
            allCodes = [];
            filteredCodes = [];
        }
        
        renderCodes();
        
    } catch (error) {
        console.error('❌ API xətası:', error);
        loadSampleCodes();
    }
}

// Nümunə kodlar
function loadSampleCodes() {
    allCodes = [
        {
            id: 1,
            store_name: "Nike",
            category: "clothing",
            promo_code: "NIKE2024",
            discount: "15",
            price: "2.99",
            validity_date: "2024-12-31",
            description: "Nike idman ayaqqabıları və geyimləri üçün 15% endirim",
            views: 156,
            sales: 34,
            discount_amount: "15%",
            user_id: 1
        },
        {
            id: 2,
            store_name: "Steam",
            category: "games", 
            promo_code: "STEAM25",
            discount: "25",
            price: "1.99",
            validity_date: "2024-06-30",
            description: "Steam platformasında bütün oyunlarda etibarlıdır",
            views: 289,
            sales: 92,
            discount_amount: "25%",
            user_id: 2
        },
        {
            id: 3,
            store_name: "Starbucks",
            category: "food",
            promo_code: "COFFEE10",
            discount: "10",
            price: "0.99",
            validity_date: "2024-03-31",
            description: "Starbucks kofe və içkilərində endirim",
            views: 187,
            sales: 65,
            discount_amount: "10 AZN",
            user_id: 3
        }
    ];
    filteredCodes = [...allCodes];
    renderCodes();
}

// Kodları göstər
function renderCodes() {
    console.log("🎯 Render edilir:", filteredCodes.length + " kod");
    
    const grid = document.getElementById('searchResultsGrid');
    const resultsCount = document.getElementById('resultsCount');
    const noResults = document.getElementById('noResults');
    const loadMore = document.getElementById('loadMoreContainer');
    
    if (!grid) {
        console.error('❌ searchResultsGrid tapılmadı!');
        return;
    }
    
    resultsCount.textContent = filteredCodes.length;
    
    if (filteredCodes.length === 0) {
        grid.style.display = 'none';
        noResults.style.display = 'block';
        loadMore.style.display = 'none';
        return;
    }
    
    grid.style.display = 'grid';
    noResults.style.display = 'none';
    loadMore.style.display = 'block';
    
    const currentUser = localStorage.getItem('currentUser');
    const userData = currentUser ? JSON.parse(currentUser) : null;
    
    grid.innerHTML = filteredCodes.map(code => {
        const isPurchased = purchasedCodes[code.id];
        const categoryName = categoryNames.az[code.category] || code.category;
        const canBuy = userData !== null;
        
        return `
            <div class="code-card-new">
                <div class="code-card-header">
                    <div class="store-icon ${code.category}">
                        <i class="fas fa-${getStoreIcon(code.category)}"></i>
                    </div>
                    <div class="store-info">
                        <div class="store-name">${code.store_name}</div>
                        <span class="store-category">${categoryName}</span>
                    </div>
                </div>
                
                <div class="code-display ${isPurchased ? '' : 'hidden'}" data-code-id="${code.id}">
                    <span class="promo-code">${isPurchased ? code.promo_code : '••••••••••'}</span>
                    ${!isPurchased ? `
                    <button class="eye-btn" onclick="toggleCodeVisibility(${code.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    ` : ''}
                </div>
                
                <div class="code-stats">
                    <div class="stat-item views">
                        <div class="stat-value">${code.views || 0}</div>
                        <div class="stat-label">Baxış</div>
                    </div>
                    <div class="stat-item sales">
                        <div class="stat-value">${code.sales || 0}</div>
                        <div class="stat-label">Satış</div>
                    </div>
                    <div class="stat-item revenue">
                        <div class="stat-value">${(code.price || 0)}</div>
                        <div class="stat-label">AZN</div>
                    </div>
                </div>
                
                <div class="code-details">
                    <div class="detail-item">
                        <span class="detail-label">Endirim</span>
                        <span class="discount-badge">${code.discount}%</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Bitmə Tarixi</span>
                        <span class="detail-value">${formatDate(code.validity_date)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Qiymət</span>
                        <span class="detail-value">${code.price} AZN</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Endirim Məbləği</span>
                        <span class="detail-value">${code.discount_amount || code.discount + '%'}</span>
                    </div>
                </div>
                
                <div class="code-description">
                    ${code.description}
                </div>
                
                <div class="code-card-footer">
                    <div class="card-actions">
                        <button class="action-btn copy-btn" onclick="copyCode('${code.promo_code}')" ${!isPurchased ? 'disabled' : ''}>
                            <i class="fas fa-copy"></i>
                        </button>
                        <button class="buy-btn-new" onclick="buyCode(${code.id}, '${code.store_name}', '${code.promo_code}', ${code.price})" ${!canBuy ? 'disabled' : ''}>
                            <i class="fas fa-shopping-cart"></i>
                            ${canBuy ? `${code.price} AZN - AL` : 'Giriş Edin'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
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

// Kod al
function buyCode(codeId, storeName, promoCode, price) {
    const user = checkAuth();
    if (!user) return;
    
    console.log("🛒 Kod alınır:", codeId, storeName, "İstifadəçi:", user.id);
    
    if (confirm(`${storeName} kodu ${price} AZN qiymətində almaq istədiyinizə əminsiniz?`)) {
        purchasedCodes[codeId] = true;
        
        // Kodu kopyala
        navigator.clipboard.writeText(promoCode);
        
        // Notification göstər
        showNotification(`✅ ${storeName} kodu uğurla alındı! Kod: ${promoCode}`, 'success');
        
        // Yenidən render et
        renderCodes();
        
        // Serverə satış məlumatını göndər
        recordPurchase(codeId, user.id, price);
    }
}

// Satışı qeyd et
async function recordPurchase(codeId, userId, price) {
    try {
        const response = await fetch('record_purchase.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `code_id=${codeId}&user_id=${userId}&price=${price}`
        });
        
        const result = await response.json();
        if (result.success) {
            console.log('✅ Satış qeydə alındı');
        }
    } catch (error) {
        console.error('❌ Satış qeyd xətası:', error);
    }
}

// Kod görünməsi
function toggleCodeVisibility(codeId) {
    const user = checkAuth();
    if (!user) return;
    
    const codeDisplay = document.querySelector(`.code-display[data-code-id="${codeId}"]`);
    if (codeDisplay) {
        codeDisplay.classList.toggle('hidden');
        
        const eyeIcon = codeDisplay.querySelector('.eye-btn i');
        if (codeDisplay.classList.contains('hidden')) {
            eyeIcon.className = 'fas fa-eye';
        } else {
            eyeIcon.className = 'fas fa-eye-slash';
        }
    }
}

// Kod kopyalama
function copyCode(code) {
    const user = checkAuth();
    if (!user) return;
    
    navigator.clipboard.writeText(code).then(() => {
        showNotification('Kod kopyalandı: ' + code, 'success');
    });
}

// Tarixi formatla
function formatDate(dateString) {
    if (!dateString) return '-';
    try {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    } catch {
        return dateString;
    }
}

// Axtarış et
function performSearch() {
    const searchTerm = document.getElementById('mainSearch').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const sortFilter = document.getElementById('sortFilter').value;
    const discountFilter = document.getElementById('discountFilter').value;
    
    let results = [...allCodes];
    
    // Axtarış termini
    if (searchTerm) {
        results = results.filter(code => 
            code.store_name.toLowerCase().includes(searchTerm) ||
            code.description.toLowerCase().includes(searchTerm) ||
            code.promo_code.toLowerCase().includes(searchTerm) ||
            code.id.toString().includes(searchTerm)
        );
    }
    
    // Kateqoriya filtrasiyası
    if (categoryFilter) {
        results = results.filter(code => code.category === categoryFilter);
    }
    
    // Endirim filtrasiyası
    if (discountFilter && discountFilter !== "0") {
        const minDiscount = parseInt(discountFilter);
        results = results.filter(code => parseInt(code.discount) >= minDiscount);
    }
    
    // Sıralama
    switch(sortFilter) {
        case 'newest':
            results.sort((a, b) => new Date(b.validity_date) - new Date(a.validity_date));
            break;
        case 'popular':
            results.sort((a, b) => (b.views || 0) - (a.views || 0));
            break;
        case 'discount':
            results.sort((a, b) => parseInt(b.discount) - parseInt(a.discount));
            break;
        case 'price':
            results.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
            break;
    }
    
    filteredCodes = results;
    renderCodes();
}

// Kateqoriya ilə filter
function filterByCategory(category) {
    document.getElementById('categoryFilter').value = category;
    performSearch();
}

// Notification
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
    }, 4000);
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

// Səhifə yüklənəndə
document.addEventListener('DOMContentLoaded', function() {
    console.log("📄 Səhifə yükləndi!");
    
    // Header-i yenilə
    updateHeader();
    
    // Axtarış eventləri
    document.getElementById('searchButton').addEventListener('click', performSearch);
    document.getElementById('mainSearch').addEventListener('input', performSearch);
    
    // Filter dəyişiklikləri
    document.getElementById('categoryFilter').addEventListener('change', performSearch);
    document.getElementById('sortFilter').addEventListener('change', performSearch);
    document.getElementById('discountFilter').addEventListener('change', performSearch);
    
    // Clear search
    document.getElementById('clearSearch').addEventListener('click', function() {
        document.getElementById('mainSearch').value = '';
        performSearch();
    });
    
    // Enter axtarışı
    document.getElementById('mainSearch').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Giriş düyməsi
    setupAuthButton();
    
    // Çıxış funksiyası
    setupLogout();
    
    // Kodları yüklə
    loadCodes();
});

// Load more funksiyası
function loadMoreCodes() {
    console.log("📥 Daha çox kod yüklənir...");
    showNotification("Daha çox kod yükləndi!", 'success');
}