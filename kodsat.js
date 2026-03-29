// kodsat.js - TAM YENİ KOD
console.log("💰 Kod satış sistemi yükləndi!");

// Tərcümə sistemləri
const translations = {
    az: {
        home: "Əsas Səhifə",
        search_page: "Kod Axtar",
        sell_code: "Kod Sat",
        about: "Məlumat",
        login_register: "Giriş / Qeydiyyat",
        sell_code: "Kod Sat",
        earn_money: "Qazan",
        sell_hero_subtitle: "Öz endirim kodlarını sat, həm qənaət et həm də qazan!",
        market_rating: "Market Reytingi",
        total_earnings: "Ümumi Pul",
        active_listings: "Aktiv Elanlar",
        add_new_code: "Yeni Kod Əlavə Et",
        store_name: "Mağaza adı",
        store_url: "Mağaza Linki",
        promo_code: "Promo Kod",
        discount: "Endirim %",
        category: "Kateqoriya",
        price: "Satış Qiyməti ($)",
        validity_date: "Etibarlılıq Tarixi",
        discount_amount: "Endirim Məbləği",
        description: "Təsvir",
        description_placeholder: "Kod haqqında qısa təsvir...",
        clothing: "Geyim",
        electronics: "Elektronika",
        games: "Oyun",
        sports: "İdman",
        food: "Yemək",
        beauty: "Gözəllik",
        travel: "Səyahət",
        security_rules: "Təhlükəsizlik Qaydaları",
        seller_responsibilities: "📋 Satıcı Məsuliyyətləri:",
        buyer_responsibilities: "👤 Alıcı Məsuliyyətləri:",
        rule1: "Kodun işlədiyini təmin etməlisiniz",
        rule2: "Etibarlı mağazadan kod olmalıdır",
        rule3: "Kodun vaxtı bitməməlidir",
        rule4: "Düzgün kateqoriya seçilməlidir",
        rule5: "Kodu düzgün daxil etməlidir",
        rule6: "Vaxtında istifadə etməlidir",
        rule7: "Şərtlərə uyğun istifadə etməlidir",
        rule8: "Kodu bir dəfə istifadə edə bilər",
        warning: "Diqqət:",
        warning_text: "Saxta kod paylaşan istifadəçilər bloklanacaq!",
        agree_terms: "Yuxarıdakı qaydaları oxudum və qəbul edirəm",
        add_code: "Kodu Əlavə Et",
        understand: "Başa düşdüm",
        my_codes: "Kodlarım",
        footer_desc: "Endirim kodları platforması - həm alın, həm satın, həm qənaət edin!",
        explore: "Kəşf Edin",
        help: "Kömək",
        contact: "Əlaqə",
        faq: "FAQ",
        terms: "İstifadə Qaydaları",
        privacy: "Gizlilik Siyasəti",
        all_rights: "Bütün hüquqlar qorunur.",
        url_hint: "http:// yazmaq lazım deyil"
    }
};

let currentLang = 'az';
let userCodes = [];
let editingCodeId = null;

const storeIconClasses = {
    clothing: 'clothing',
    electronics: 'electronics',
    games: 'games', 
    sports: 'sports',
    food: 'food',
    beauty: 'beauty',
    travel: 'travel'
};

const categoryNames = {
    az: {
        clothing: "Geyim",
        electronics: "Elektronika",
        games: "Oyun",
        sports: "İdman",
        food: "Yemək",
        beauty: "Gözəllik",
        travel: "Səyahət"
    }
};

// Tərcümə funksiyası
function translatePage(lang) {
    currentLang = lang;
    const translation = translations[lang];
    
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translation[key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation[key];
            } else if (element.tagName === 'SELECT') {
                const options = element.querySelectorAll('option[data-translate]');
                options.forEach(option => {
                    const optionKey = option.getAttribute('data-translate');
                    if (translation[optionKey]) {
                        option.textContent = translation[optionKey];
                    }
                });
            } else {
                element.textContent = translation[key];
            }
        }
    });
    
    localStorage.setItem('preferredLanguage', lang);
    loadUserCodes();
}

// Giriş yoxlaması
function checkAuth() {
    const user = localStorage.getItem('currentUser');
    if (!user) {
        showNotification('Kod satmaq üçün giriş etməlisiniz!', 'error');
        setTimeout(() => {
            window.location.href = 'login.register.html';
        }, 2000);
        return null;
    }
    return JSON.parse(user);
}

// Kodları yüklə
async function loadUserCodes() {
    const user = checkAuth();
    if (!user) return;
    
    console.log("📥 İstifadəçi kodları yüklənir, ID:", user.id);
    
    try {
        const response = await fetch(`admin.php?api=get_user_codes&user_id=${user.id}`);
        const data = await response.json();
        
        console.log("Kodlar cavabı:", data);
        
        if (data.success) {
            userCodes = data.codes;
            renderCodesGrid();
        } else {
            console.error('Kodlar yüklənərkən xəta:', data.error);
            showNotification('Kodlar yüklənərkən xəta baş verdi: ' + data.error, 'error');
            loadDemoCodes(user.id);
        }
    } catch (error) {
        console.error('Xəta:', error);
        showNotification('Serverlə əlaqə xətası', 'error');
        loadDemoCodes(user.id);
    }
}

// Demo kodlar
function loadDemoCodes(userId) {
    userCodes = [
        {
            id: 1,
            user_id: userId,
            store_name: "Nike",
            category: "clothing",
            promo_code: "NIKE2024",
            discount: "15",
            price: "2.99",
            validity_date: "2024-12-31",
            description: "Nike idman ayaqqabıları və geyimləri üçün 15% endirim",
            discount_amount: "15%",
            views: 156,
            sales: 34,
            revenue: 101.66,
            status: "approved",
            created_at: "2024-01-15 10:30:00"
        },
        {
            id: 2,
            user_id: userId,
            store_name: "Steam",
            category: "games", 
            promo_code: "STEAM25",
            discount: "25",
            price: "1.99",
            validity_date: "2024-06-30",
            description: "Steam platformasında bütün oyunlarda etibarlıdır",
            discount_amount: "25%",
            views: 289,
            sales: 92,
            revenue: 183.08,
            status: "pending",
            created_at: "2024-01-16 14:20:00"
        },
        {
            id: 3,
            user_id: userId,
            store_name: "Starbucks",
            category: "food",
            promo_code: "COFFEE10",
            discount: "10",
            price: "0.99",
            validity_date: "2024-03-31",
            description: "Starbucks kofe və içkilərində endirim",
            discount_amount: "10 AZN",
            views: 87,
            sales: 45,
            revenue: 44.55,
            status: "approved",
            created_at: "2024-01-17 09:15:00"
        }
    ];
    renderCodesGrid();
}

// Kod əlavə et
async function addCode(codeData) {
    const user = checkAuth();
    if (!user) return;
    
    console.log("➕ Kod əlavə edilir:", codeData);
    
    try {
        const formData = new FormData();
        formData.append('user_id', user.id);
        formData.append('store_name', codeData.storeName);
        formData.append('store_url', codeData.storeUrl || '');
        formData.append('promo_code', codeData.promoCode);
        formData.append('discount', codeData.discount);
        formData.append('price', codeData.price);
        formData.append('category', codeData.category);
        formData.append('validity_date', codeData.validityDate);
        formData.append('discount_amount', codeData.discountAmount || '');
        formData.append('description', codeData.description || '');

        const response = await fetch('admin.php?api=add_promo_code', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        console.log("Kod əlavə cavabı:", result);

        if (result.success) {
            showNotification(result.message || 'Kod uğurla əlavə edildi! Admin təsdiqindən sonra aktiv olacaq.', 'success');
            
            // Formu təmizlə
            document.getElementById('addCodeForm').reset();
            document.getElementById('termsAgree').checked = false;
            document.getElementById('submitBtn').disabled = true;
            
            // Kodları yenilə
            setTimeout(() => {
                loadUserCodes();
            }, 1000);
            
        } else {
            showNotification('Xəta: ' + (result.error || 'Əməliyyat zamanı xəta baş verdi'), 'error');
        }
    } catch (error) {
        console.error('Xəta:', error);
        showNotification('Serverlə əlaqə xətası', 'error');
    }
}

// Kod statusunu yoxla
function getCodeStatus(code) {
    const now = new Date();
    const expiry = new Date(code.validity_date);
    
    if (now > expiry) return 'expired';
    if (code.status === 'approved') return 'approved';
    if (code.status === 'rejected') return 'banned';
    return 'pending';
}

// Grid-i göstər
function renderCodesGrid() {
    const gridContent = document.getElementById('codesGridContent');
    if (!gridContent) {
        console.error('Grid content elementi tapılmadı!');
        return;
    }

    if (!userCodes || userCodes.length === 0) {
        gridContent.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-tags"></i>
                <h3>Hələ kod əlavə etməmisiniz</h3>
                <p>İlk kodunuzu əlavə etmək üçün yuxarıdakı formu doldurun</p>
            </div>
        `;
        return;
    }

    gridContent.innerHTML = userCodes.map(code => {
        if (!code) return '';
        
        const status = getCodeStatus(code);
        let statusText, statusClass;
        
        switch(status) {
            case 'pending':
                statusText = 'Gözləmədə';
                statusClass = 'status-pending';
                break;
            case 'approved':
                statusText = 'Təsdiqləndi';
                statusClass = 'status-active';
                break;
            case 'banned':
                statusText = 'Bloklandı';
                statusClass = 'status-banned';
                break;
            case 'expired':
                statusText = 'Bitmiş';
                statusClass = 'status-expired';
                break;
            default:
                statusText = 'Gözləmədə';
                statusClass = 'status-pending';
        }

        const categoryName = categoryNames[currentLang]?.[code.category] || code.category;

        return `
            <div class="code-card">
                <div class="code-card-header">
                    <div class="store-icon ${storeIconClasses[code.category] || 'clothing'}">
                        <i class="fas fa-${getStoreIcon(code.category)}"></i>
                    </div>
                    <div class="store-info">
                        <div class="store-name">${code.store_name || 'Mağazasız'}</div>
                        <span class="store-category">${categoryName}</span>
                    </div>
                </div>
                
                <div class="code-display" data-code-id="${code.id}">
                    <span class="promo-code">${code.promo_code || 'Kodsuz'}</span>
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
                        <div class="stat-value">${(code.revenue || 0).toFixed(2)}</div>
                        <div class="stat-label">AZN</div>
                    </div>
                </div>
                
                <div class="code-details">
                    <div class="detail-item">
                        <span class="detail-label">Endirim</span>
                        <span class="discount-badge">${code.discount || 0}%</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Bitmə Tarixi</span>
                        <span class="detail-value">${formatDate(code.validity_date)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Qiymət</span>
                        <span class="detail-value">${code.price || 0} AZN</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Endirim Məbləği</span>
                        <span class="detail-value">${code.discount_amount || '-'}</span>
                    </div>
                </div>
                
                ${code.description ? `
                <div class="code-description">
                    ${code.description}
                </div>
                ` : ''}
                
                <div class="code-card-footer">
                    <span class="status-badge ${statusClass}">${statusText}</span>
                    <div class="card-actions">
                        <button class="action-btn copy-btn" onclick="copyCode('${code.promo_code}')">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button class="action-btn delete-btn" onclick="deleteCode(${code.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Köməkçi funksiyalar
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

function copyCode(code) {
    if (!code) return;
    
    navigator.clipboard.writeText(code).then(() => {
        showNotification('Kod kopyalandı: ' + code, 'success');
    }).catch(err => {
        console.error('Kopyalama xətası:', err);
        showNotification('Kod kopyalandı: ' + code, 'success');
    });
}

async function deleteCode(codeId, showConfirm = true) {
    if (showConfirm) {
        if (!confirm('Bu kodu silmək istədiyinizə əminsiniz?')) {
            return;
        }
    }
    
    try {
        const formData = new FormData();
        formData.append('code_id', codeId);

        const response = await fetch('admin.php?api=delete_promo_code', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            showNotification('Kod uğurla silindi', 'success');
            loadUserCodes();
        } else {
            showNotification('Xəta: ' + (result.error || 'Kod silinərkən xəta baş verdi'), 'error');
        }
    } catch (error) {
        console.error('Xəta:', error);
        showNotification('Serverlə əlaqə xətası', 'error');
    }
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

// Form validation
function setupFormValidation() {
    const form = document.getElementById('addCodeForm');
    const termsAgree = document.getElementById('termsAgree');
    const submitBtn = document.getElementById('submitBtn');
    
    if (form && termsAgree && submitBtn) {
        termsAgree.addEventListener('change', function() {
            submitBtn.disabled = !this.checked;
        });
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                storeName: document.getElementById('storeName').value,
                storeUrl: document.getElementById('storeUrl').value,
                promoCode: document.getElementById('promoCode').value,
                discount: parseInt(document.getElementById('discount').value),
                category: document.getElementById('category').value,
                price: parseFloat(document.getElementById('price').value),
                validityDate: document.getElementById('validityDate').value,
                discountAmount: document.getElementById('discountAmount').value,
                description: document.getElementById('description').value
            };
            
            // Validation
            if (!formData.storeName || !formData.promoCode || !formData.validityDate) {
                showNotification('Zorunlu sahələri doldurun!', 'error');
                return;
            }
            
            if (formData.discount < 1 || formData.discount > 99) {
                showNotification('Endirim 1% ilə 99% arasında olmalıdır!', 'error');
                return;
            }
            
            if (formData.price <= 0) {
                showNotification('Qiymət 0-dan böyük olmalıdır!', 'error');
                return;
            }
            
            addCode(formData);
        });
    }
}

// Modal funksiyaları
function showTermsModal() {
    const modal = document.getElementById('termsModal');
    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('show'), 10);
    }
}

function closeTermsModal() {
    const modal = document.getElementById('termsModal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.style.display = 'none', 300);
    }
}

function showStatusInfoModal() {
    const modal = document.getElementById('statusInfoModal');
    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('show'), 10);
    }
}

function closeStatusInfoModal() {
    const modal = document.getElementById('statusInfoModal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.style.display = 'none', 300);
    }
}

// Səhifə yüklənəndə
document.addEventListener('DOMContentLoaded', function() {
    console.log("💰 Kod satış səhifəsi hazırdır!");
    
    const savedLang = localStorage.getItem('preferredLanguage') || 'az';
    translatePage(savedLang);
    
    setupFormValidation();
    loadUserCodes();
    
    // Modal bağlama
    const termsModal = document.getElementById('termsModal');
    const statusModal = document.getElementById('statusInfoModal');
    
    if (termsModal) {
        termsModal.addEventListener('click', function(e) {
            if (e.target === termsModal) closeTermsModal();
        });
    }
    
    if (statusModal) {
        statusModal.addEventListener('click', function(e) {
            if (e.target === statusModal) closeStatusInfoModal();
        });
    }
});