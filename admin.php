<?php
session_start();
include 'config.php';

// Admin girişi yoxla
if (isset($_POST['password']) && $_POST['password'] === 'admin123') {
    $_SESSION['admin_logged_in'] = true;
}

// Dil dəyişikliyi
if (isset($_GET['lang'])) {
    $_SESSION['lang'] = $_GET['lang'];
}

// Cari dil
$current_lang = isset($_SESSION['lang']) ? $_SESSION['lang'] : 'az';

// Dil mətnləri
$translations = [
    'az' => [
        'dashboard' => 'Dashboard',
        'users' => 'İstifadəçilər',
        'complaints' => 'Şikayətlər',
        'moderators' => 'Moderatorlar',
        'listings' => 'Promokodlar',
        'blacklist' => 'Qara Siyahı',
        'messages' => 'Mesajlar',
        'total_users' => 'Ümumi İstifadəçilər',
        'revenue' => 'Gəlir',
        'active_listings' => 'Aktiv Promokodlar',
        'pending_issues' => 'Gözləyən Problemlər',
        'search_users' => 'İstifadəçi axtar...',
        'search' => 'Axtar',
        'clear' => 'Təmizlə',
        'id' => 'ID',
        'username' => 'İstifadəçi adı',
        'email' => 'Email',
        'status' => 'Status',
        'registration_date' => 'Qeydiyyat tarixi',
        'actions' => 'Əməliyyatlar',
        'active' => 'Aktiv',
        'banned' => 'Bloklanıb',
        'view' => 'Bax',
        'approve' => 'Təsdiqlə',
        'ban' => 'Blokla',
        'delete' => 'Sil',
        'no_users' => 'İstifadəçi tapılmadı',
        'admin' => 'Admin',
        'administrator' => 'Administrator',
        'logout' => 'Çıxış',
        'user_management' => 'İstifadəçi İdarəetmə',
        'user_details' => 'İstifadəçi Məlumatları',
        'balance' => 'Balans',
        'phone' => 'Telefon',
        'last_login' => 'Son Giriş',
        'promo_management' => 'Promokod İdarəetmə',
        'store_name' => 'Mağaza',
        'promo_code' => 'Promokod',
        'discount' => 'Endirim',
        'price' => 'Qiymət',
        'seller' => 'Satıcı',
        'all' => 'Hamısı',
        'pending' => 'Gözləyir',
        'approved' => 'Aktiv',
        'blocked' => 'Bloklanıb',
        'category' => 'Kateqoriya',
        'all_categories' => 'Bütün Kateqoriyalar',
        'view_details' => 'Ətraflı bax',
        'validity_date' => 'Etibarlılıq müddəti',
        'description' => 'Təsvir',
        'store_url' => 'Mağaza URL',
        'discount_amount' => 'Endirim məbləği',
        'created_at' => 'Yaradılma tarixi',
        'promo_details' => 'Promokod Detalları',
        'close' => 'Bağla'
    ],
    'en' => [
        'dashboard' => 'Dashboard',
        'users' => 'Users',
        'complaints' => 'Complaints',
        'moderators' => 'Moderators',
        'listings' => 'Promocodes',
        'blacklist' => 'Blacklist',
        'messages' => 'Messages',
        'total_users' => 'Total Users',
        'revenue' => 'Revenue',
        'active_listings' => 'Active Promocodes',
        'pending_issues' => 'Pending Issues',
        'search_users' => 'Search users...',
        'search' => 'Search',
        'clear' => 'Clear',
        'id' => 'ID',
        'username' => 'Username',
        'email' => 'Email',
        'status' => 'Status',
        'registration_date' => 'Registration Date',
        'actions' => 'Actions',
        'active' => 'Active',
        'banned' => 'Blocked',
        'view' => 'View',
        'approve' => 'Approve',
        'ban' => 'Block',
        'delete' => 'Delete',
        'no_users' => 'No users found',
        'admin' => 'Admin',
        'administrator' => 'Administrator',
        'logout' => 'Logout',
        'user_management' => 'User Management',
        'user_details' => 'User Details',
        'balance' => 'Balance',
        'phone' => 'Phone',
        'last_login' => 'Last Login',
        'promo_management' => 'Promocode Management',
        'store_name' => 'Store',
        'promo_code' => 'Promocode',
        'discount' => 'Discount',
        'price' => 'Price',
        'seller' => 'Seller',
        'all' => 'All',
        'pending' => 'Pending',
        'approved' => 'Active',
        'blocked' => 'Blocked',
        'category' => 'Category',
        'all_categories' => 'All Categories',
        'view_details' => 'View Details',
        'validity_date' => 'Validity Date',
        'description' => 'Description',
        'store_url' => 'Store URL',
        'discount_amount' => 'Discount Amount',
        'created_at' => 'Created At',
        'promo_details' => 'Promocode Details',
        'close' => 'Close'
    ]
];

$t = $translations[$current_lang];

// Çıxış
if (isset($_GET['logout'])) {
    session_destroy();
    header("Location: admin.php");
    exit;
}

// API endpointləri
if (isset($_GET['api'])) {
    header('Content-Type: application/json');
    
    switch ($_GET['api']) {
        case 'add_promo_code':
            addPromoCode();
            break;
        case 'get_user_codes':
            getUserCodes();
            break;
        case 'delete_promo_code':
            deletePromoCode();
            break;
        case 'get_promo_details':
            getPromoDetails();
            break;
        default:
            echo json_encode(['success' => false, 'error' => 'Invalid API endpoint']);
    }
    exit;
}

// Promokod əlavə etmə və ya yeniləmə funksiyası
function addPromoCode() {
    global $conn;
    
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $user_id = 1;
        $store_name = trim($_POST['store_name']);
        $store_url = trim($_POST['store_url']);
        $promo_code = trim($_POST['promo_code']);
        $discount = intval($_POST['discount']);
        $category = trim($_POST['category']);
        $price = floatval($_POST['price']);
        $validity_date = $_POST['validity_date'];
        $discount_amount = trim($_POST['discount_amount']);
        $description = trim($_POST['description']);
        $edit_id = isset($_POST['edit_id']) ? intval($_POST['edit_id']) : null;

        if (empty($store_name) || empty($promo_code) || empty($category) || empty($validity_date)) {
            echo json_encode(['success' => false, 'error' => 'Bütün tələb olunan sahələri doldurun']);
            exit;
        }

        try {
            if ($edit_id) {
                $tables = ['pending_ads', 'approved_ads', 'blocked_ads'];
                foreach ($tables as $table) {
                    $delete_stmt = $conn->prepare("DELETE FROM $table WHERE id = ? AND user_id = ?");
                    $delete_stmt->bind_param("ii", $edit_id, $user_id);
                    $delete_stmt->execute();
                }
                
                $stmt = $conn->prepare("INSERT INTO pending_ads (user_id, store_name, store_url, promo_code, discount, discount_amount, price, category, validity_date, description, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())");
                $stmt->bind_param("isssisdsss", $user_id, $store_name, $store_url, $promo_code, $discount, $discount_amount, $price, $category, $validity_date, $description);
                
                if ($stmt->execute()) {
                    echo json_encode(['success' => true, 'message' => 'Kod uğurla yeniləndi']);
                } else {
                    echo json_encode(['success' => false, 'error' => 'Kod yenilənərkən xəta baş verdi']);
                }
            } else {
                $stmt = $conn->prepare("INSERT INTO pending_ads (user_id, store_name, store_url, promo_code, discount, discount_amount, price, category, validity_date, description, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())");
                $stmt->bind_param("isssisdsss", $user_id, $store_name, $store_url, $promo_code, $discount, $discount_amount, $price, $category, $validity_date, $description);
                
                if ($stmt->execute()) {
                    echo json_encode(['success' => true, 'message' => 'Kod uğurla əlavə edildi']);
                } else {
                    echo json_encode(['success' => false, 'error' => 'Database xətası']);
                }
            }
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'error' => 'Xəta: ' . $e->getMessage()]);
        }
    }
}

// İstifadəçi kodlarını gətir
function getUserCodes() {
    global $conn;
    
    $user_id = 1;
    
    try {
        $codes = [];
        
        $pending_stmt = $conn->prepare("SELECT * FROM pending_ads WHERE user_id = ? ORDER BY created_at DESC");
        $pending_stmt->bind_param("i", $user_id);
        $pending_stmt->execute();
        $pending_result = $pending_stmt->get_result();
        
        while ($row = $pending_result->fetch_assoc()) {
            $row['status'] = 'pending';
            $codes[] = $row;
        }
        
        $approved_stmt = $conn->prepare("SELECT * FROM approved_ads WHERE user_id = ? ORDER BY created_at DESC");
        $approved_stmt->bind_param("i", $user_id);
        $approved_stmt->execute();
        $approved_result = $approved_stmt->get_result();
        
        while ($row = $approved_result->fetch_assoc()) {
            $row['status'] = 'approved';
            $codes[] = $row;
        }
        
        $blocked_stmt = $conn->prepare("SELECT * FROM blocked_ads WHERE user_id = ? ORDER BY created_at DESC");
        $blocked_stmt->bind_param("i", $user_id);
        $blocked_stmt->execute();
        $blocked_result = $blocked_stmt->get_result();
        
        while ($row = $blocked_result->fetch_assoc()) {
            $row['status'] = 'blocked';
            $codes[] = $row;
        }
        
        echo json_encode(['success' => true, 'codes' => $codes]);
        
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => 'Xəta: ' . $e->getMessage()]);
    }
}

// Promokod sil
function deletePromoCode() {
    global $conn;
    
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $code_id = intval($_POST['code_id']);
        
        try {
            $tables = ['pending_ads', 'approved_ads', 'blocked_ads'];
            $deleted = false;
            
            foreach ($tables as $table) {
                $stmt = $conn->prepare("DELETE FROM $table WHERE id = ?");
                $stmt->bind_param("i", $code_id);
                if ($stmt->execute() && $stmt->affected_rows > 0) {
                    $deleted = true;
                    break;
                }
            }
            
            if ($deleted) {
                echo json_encode(['success' => true, 'message' => 'Kod silindi']);
            } else {
                echo json_encode(['success' => false, 'error' => 'Kod tapılmadı']);
            }
            
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'error' => 'Xəta: ' . $e->getMessage()]);
        }
    }
}

// Promokod detallarını götür
function getPromoDetails() {
    global $conn;
    
    if (isset($_GET['ad_id']) && isset($_GET['source'])) {
        $ad_id = intval($_GET['ad_id']);
        $source = $_GET['source'];
        
        $table = '';
        switch($source) {
            case 'pending': $table = 'pending_ads'; break;
            case 'approved': $table = 'approved_ads'; break;
            case 'blocked': $table = 'blocked_ads'; break;
            default: 
                echo json_encode(['error' => 'Invalid source']);
                exit;
        }
        
        $query = "SELECT * FROM $table WHERE id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $ad_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result && $result->num_rows > 0) {
            echo json_encode($result->fetch_assoc());
        } else {
            echo json_encode(['error' => 'Promokod tapılmadı']);
        }
    }
}

// Statistikalar
$stats_result = $conn->query("
    SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM pending_ads) as pending_listings,
        (SELECT COUNT(*) FROM approved_ads) as approved_listings,
        (SELECT COUNT(*) FROM blocked_ads) as blocked_listings,
        (SELECT COUNT(*) FROM complaints WHERE status = 'pending') as pending_complaints,
        (SELECT COUNT(*) FROM messages WHERE is_read = FALSE) as unread_messages,
        (SELECT COALESCE(SUM(price), 0) FROM approved_ads) as total_revenue
");
if ($stats_result) {
    $stats = $stats_result->fetch_assoc();
} else {
    $stats = [
        'total_users' => 0,
        'pending_listings' => 0,
        'approved_listings' => 0,
        'blocked_listings' => 0,
        'pending_complaints' => 0,
        'unread_messages' => 0,
        'total_revenue' => 0
    ];
}

// User actions
if (isset($_POST['action'])) {
    $user_id = intval($_POST['user_id']);
    
    if ($_POST['action'] === 'approve') {
        $conn->query("UPDATE users SET status = 'active' WHERE id = $user_id");
    } elseif ($_POST['action'] === 'ban') {
        $conn->query("UPDATE users SET status = 'banned' WHERE id = $user_id");
    } elseif ($_POST['action'] === 'delete') {
        $conn->query("DELETE FROM users WHERE id = $user_id");
    }
    
    header("Location: admin.php?page=users");
    exit;
}

// === PROMOKOD TƏSDİQ FUNKSİYASI - YENİ VERSİYA ===
if (isset($_POST['approve_ad'])) {
    $ad_id = intval($_POST['ad_id']);
    $source = $_POST['source'];
    
    error_log("=== ADMIN TƏSDİQ BAŞLADI ===");
    error_log("ad_id: $ad_id, source: $source");
    
    if ($source === 'pending') {
        $ad_query = $conn->query("SELECT * FROM pending_ads WHERE id = $ad_id");
        if ($ad_query && $ad_query->num_rows > 0) {
            $ad_data = $ad_query->fetch_assoc();
            
            error_log("📝 Kod tapıldı: " . $ad_data['store_name'] . " - " . $ad_data['promo_code']);
            
            // approved_ads-ə ƏLAVƏ ET
            $insert_sql = "INSERT INTO approved_ads (user_id, store_name, store_url, promo_code, discount, discount_amount, price, category, validity_date, description, status, created_at) 
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', NOW())";
            
            $stmt = $conn->prepare($insert_sql);
            $stmt->bind_param("isssisdsss", 
                $ad_data['user_id'],
                $ad_data['store_name'],
                $ad_data['store_url'],
                $ad_data['promo_code'],
                $ad_data['discount'],
                $ad_data['discount_amount'],
                $ad_data['price'],
                $ad_data['category'],
                $ad_data['validity_date'],
                $ad_data['description']
            );
            
            if ($stmt->execute()) {
                error_log("✅ Kod approved_ads-ə əlavə edildi - ID: " . $conn->insert_id);
                
                // pending_ads-dən sil
                $delete_result = $conn->query("DELETE FROM pending_ads WHERE id = $ad_id");
                if ($delete_result) {
                    error_log("✅ Kod pending_ads-dən silindi");
                } else {
                    error_log("❌ Xəta: Kod pending_ads-dən silinə bilmədi");
                }
            } else {
                error_log("❌ Xəta: Kod approved_ads-ə əlavə edilə bilmədi");
            }
        } else {
            error_log("❌ Xəta: Kod pending_ads-də tapılmadı");
        }
    } elseif ($source === 'blocked') {
        $ad_query = $conn->query("SELECT * FROM blocked_ads WHERE id = $ad_id");
        if ($ad_query && $ad_query->num_rows > 0) {
            $ad_data = $ad_query->fetch_assoc();
            
            $insert_query = "INSERT INTO pending_ads (user_id, store_name, store_url, promo_code, discount, discount_amount, price, category, validity_date, description, created_at) 
                             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";
            $stmt = $conn->prepare($insert_query);
            $stmt->bind_param("isssisdsss", 
                $ad_data['user_id'], 
                $ad_data['store_name'], 
                $ad_data['store_url'], 
                $ad_data['promo_code'], 
                $ad_data['discount'], 
                $ad_data['discount_amount'], 
                $ad_data['price'], 
                $ad_data['category'], 
                $ad_data['validity_date'], 
                $ad_data['description']
            );
            
            if ($stmt->execute()) {
                $conn->query("DELETE FROM blocked_ads WHERE id = $ad_id");
            }
        }
    }
    
    header("Location: admin.php?page=listings");
    exit;
}

if (isset($_POST['block_ad'])) {
    $ad_id = intval($_POST['ad_id']);
    $source = $_POST['source'];
    
    if ($source === 'pending') {
        $ad_query = $conn->query("SELECT * FROM pending_ads WHERE id = $ad_id");
        if ($ad_query && $ad_query->num_rows > 0) {
            $ad_data = $ad_query->fetch_assoc();
            
            $insert_query = "INSERT INTO blocked_ads (user_id, store_name, store_url, promo_code, discount, discount_amount, price, category, validity_date, description, created_at) 
                             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";
            $stmt = $conn->prepare($insert_query);
            $stmt->bind_param("isssisdsss", 
                $ad_data['user_id'], 
                $ad_data['store_name'], 
                $ad_data['store_url'], 
                $ad_data['promo_code'], 
                $ad_data['discount'], 
                $ad_data['discount_amount'], 
                $ad_data['price'], 
                $ad_data['category'], 
                $ad_data['validity_date'], 
                $ad_data['description']
            );
            
            if ($stmt->execute()) {
                $conn->query("DELETE FROM pending_ads WHERE id = $ad_id");
            }
        }
    } elseif ($source === 'approved') {
        $ad_query = $conn->query("SELECT * FROM approved_ads WHERE id = $ad_id");
        if ($ad_query && $ad_query->num_rows > 0) {
            $ad_data = $ad_query->fetch_assoc();
            
            $insert_query = "INSERT INTO blocked_ads (user_id, store_name, store_url, promo_code, discount, discount_amount, price, category, validity_date, description, created_at) 
                             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";
            $stmt = $conn->prepare($insert_query);
            $stmt->bind_param("isssisdsss", 
                $ad_data['user_id'], 
                $ad_data['store_name'], 
                $ad_data['store_url'], 
                $ad_data['promo_code'], 
                $ad_data['discount'], 
                $ad_data['discount_amount'], 
                $ad_data['price'], 
                $ad_data['category'], 
                $ad_data['validity_date'], 
                $ad_data['description']
            );
            
            if ($stmt->execute()) {
                $conn->query("DELETE FROM approved_ads WHERE id = $ad_id");
            }
        }
    }
    
    header("Location: admin.php?page=listings");
    exit;
}

if (isset($_POST['delete_ad'])) {
    $ad_id = intval($_POST['ad_id']);
    $source = $_POST['source'];
    
    if ($source === 'pending') {
        $conn->query("DELETE FROM pending_ads WHERE id = $ad_id");
    } elseif ($source === 'approved') {
        $conn->query("DELETE FROM approved_ads WHERE id = $ad_id");
    } elseif ($source === 'blocked') {
        $conn->query("DELETE FROM blocked_ads WHERE id = $ad_id");
    }
    
    header("Location: admin.php?page=listings");
    exit;
}

// Current page
$current_page = isset($_GET['page']) ? $_GET['page'] : 'dashboard';
$search = isset($_GET['search']) ? $_GET['search'] : '';
$filter = isset($_GET['filter']) ? $_GET['filter'] : 'all';
$status_filter = isset($_GET['status']) ? $_GET['status'] : 'all';
$category_filter = isset($_GET['category']) ? $_GET['category'] : 'all';
$search_query = isset($_GET['search_query']) ? $_GET['search_query'] : '';

// Kateqoriyaları götür
$categories_result = $conn->query("SELECT * FROM categories WHERE is_active = 1 ORDER BY name");
$categories = [];
if ($categories_result) {
    while ($category = $categories_result->fetch_assoc()) {
        $categories[] = $category;
    }
}

// Users məlumatları
if ($current_page === 'users') {
    $where_conditions = [];
    
    if (!empty($search)) {
        $search_query = $conn->real_escape_string($search);
        $where_conditions[] = "(username LIKE '%$search_query%' OR email LIKE '%$search_query%')";
    }
    
    if ($filter === 'active') {
        $where_conditions[] = "status = 'active'";
    } elseif ($filter === 'banned') {
        $where_conditions[] = "status = 'banned'";
    }
    
    $where_clause = !empty($where_conditions) ? "WHERE " . implode(" AND ", $where_conditions) : "";
    $query = "SELECT * FROM users $where_clause ORDER BY created_at DESC LIMIT 50";
    
    $users_result = $conn->query($query);
    $users = [];
    if ($users_result) {
        while ($user = $users_result->fetch_assoc()) {
            $users[] = $user;
        }
    }
}

// Promokodlar məlumatları
if ($current_page === 'listings') {
    $all_listings = [];
    
    // Pending ads
    $pending_query = "SELECT 'pending' as source, p.*, u.username FROM pending_ads p LEFT JOIN users u ON p.user_id = u.id";
    $pending_where = [];
    if ($category_filter !== 'all') {
        $pending_where[] = "p.category LIKE '%" . $conn->real_escape_string($category_filter) . "%'";
    }
    if (!empty($search_query)) {
        $pending_where[] = "(p.store_name LIKE '%" . $conn->real_escape_string($search_query) . "%' OR p.promo_code LIKE '%" . $conn->real_escape_string($search_query) . "%' OR p.category LIKE '%" . $conn->real_escape_string($search_query) . "%')";
    }
    if (!empty($pending_where)) {
        $pending_query .= " WHERE " . implode(" AND ", $pending_where);
    }
    $pending_result = $conn->query($pending_query);
    if ($pending_result) {
        while ($row = $pending_result->fetch_assoc()) {
            $all_listings[] = $row;
        }
    }
    
    // Approved ads
    $approved_query = "SELECT 'approved' as source, a.*, u.username FROM approved_ads a LEFT JOIN users u ON a.user_id = u.id";
    $approved_where = [];
    if ($category_filter !== 'all') {
        $approved_where[] = "a.category LIKE '%" . $conn->real_escape_string($category_filter) . "%'";
    }
    if (!empty($search_query)) {
        $approved_where[] = "(a.store_name LIKE '%" . $conn->real_escape_string($search_query) . "%' OR a.promo_code LIKE '%" . $conn->real_escape_string($search_query) . "%' OR a.category LIKE '%" . $conn->real_escape_string($search_query) . "%')";
    }
    if (!empty($approved_where)) {
        $approved_query .= " WHERE " . implode(" AND ", $approved_where);
    }
    $approved_result = $conn->query($approved_query);
    if ($approved_result) {
        while ($row = $approved_result->fetch_assoc()) {
            $all_listings[] = $row;
        }
    }
    
    // Blocked ads
    $blocked_query = "SELECT 'blocked' as source, b.*, u.username FROM blocked_ads b LEFT JOIN users u ON b.user_id = u.id";
    $blocked_where = [];
    if ($category_filter !== 'all') {
        $blocked_where[] = "b.category LIKE '%" . $conn->real_escape_string($category_filter) . "%'";
    }
    if (!empty($search_query)) {
        $blocked_where[] = "(b.store_name LIKE '%" . $conn->real_escape_string($search_query) . "%' OR b.promo_code LIKE '%" . $conn->real_escape_string($search_query) . "%' OR b.category LIKE '%" . $conn->real_escape_string($search_query) . "%')";
    }
    if (!empty($blocked_where)) {
        $blocked_query .= " WHERE " . implode(" AND ", $blocked_where);
    }
    $blocked_result = $conn->query($blocked_query);
    if ($blocked_result) {
        while ($row = $blocked_result->fetch_assoc()) {
            $all_listings[] = $row;
        }
    }
    
    // Sıralama: təsdiqlənmişlər -> gözləyənlər -> bloklanmışlar
    usort($all_listings, function($a, $b) {
        $order = ['approved' => 1, 'pending' => 2, 'blocked' => 3];
        $a_order = $order[$a['source']] ?? 4;
        $b_order = $order[$b['source']] ?? 4;
        
        if ($a_order === $b_order) {
            return strtotime($b['created_at']) - strtotime($a['created_at']);
        }
        return $a_order - $b_order;
    });
    
    // Limit tətbiq et
    $all_listings = array_slice($all_listings, 0, 100);
    
    // Status filter tətbiq et
    $listings = [];
    foreach ($all_listings as $listing) {
        if ($status_filter === 'all' || $status_filter === $listing['source']) {
            $listings[] = $listing;
        }
    }
}

// Əgər giriş etməyibsə, login formunu göstər
if (!isset($_SESSION['admin_logged_in'])): ?>
<!DOCTYPE html>
<html lang="az">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Giriş - PromoMarket</title>
    <style>
        * { 
            margin: 0; 
            padding: 0; 
            box-sizing: border-box; 
            font-family: 'Segoe UI', Arial, sans-serif; 
        }
        body { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex; 
            justify-content: center; 
            align-items: center;
            min-height: 100vh; 
            padding: 20px;
        }
        .login-container {
            background: white; 
            padding: 2rem; 
            border-radius: 12px;
            box-shadow: 0 15px 30px rgba(0,0,0,0.2); 
            max-width: 350px; 
            width: 100%;
            text-align: center;
        }
        .logo { 
            font-size: 2rem; 
            margin-bottom: 0.8rem; 
            color: #764ba2; 
        }
        h1 { 
            color: #764ba2; 
            margin-bottom: 0.4rem; 
            font-size: 1.5rem; 
        }
        .subtitle { 
            color: #666; 
            margin-bottom: 1.5rem; 
            font-size: 0.9rem; 
        }
        input[type="password"] {
            width: 100%; 
            padding: 0.8rem; 
            border: 2px solid #ddd;
            border-radius: 6px; 
            font-size: 0.9rem; 
            margin-bottom: 0.8rem;
        }
        button {
            width: 100%; 
            padding: 0.8rem; 
            background: #764ba2;
            color: white; 
            border: none; 
            border-radius: 6px;
            font-size: 0.9rem; 
            font-weight: 600; 
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="logo">🏷️</div>
        <h1>Admin Panel</h1>
        <p class="subtitle">Promokod Satış Marketi</p>
        <form method="POST">
            <input type="password" name="password" placeholder="Admin şifrəsi">
            <button type="submit">Daxil Ol</button>
        </form>
    </div>
</body>
</html>
<?php exit; endif;
?>

<!DOCTYPE html>
<html lang="az">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Panel - PromoMarket</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        :root {
            --primary: #4361ee;
            --secondary: #3f37c9;
            --success: #4cc9f0;
            --warning: #f72585;
            --danger: #e63946;
            --dark: #1d3557;
            --light: #f8f9fa;
            --gray: #6c757d;
            --sidebar-width: 260px;
            --transition: all 0.3s ease;
            --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            --radius: 8px;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', system-ui, sans-serif;
        }

        body {
            background: #f5f7fb;
            color: #333;
            display: flex;
            min-height: 100vh;
        }

        /* Sidebar */
        .sidebar {
            width: var(--sidebar-width);
            background: var(--dark);
            color: white;
            height: 100vh;
            position: fixed;
            display: flex;
            flex-direction: column;
        }

        .logo-container {
            padding: 1.5rem 1.25rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        .logo {
            font-size: 1.5rem;
            font-weight: 700;
            color: white;
        }

        .nav-menu {
            flex: 1;
            padding: 1.5rem 0;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .nav-item {
            padding: 0.85rem 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            color: rgba(255, 255, 255, 0.7);
            text-decoration: none;
            transition: var(--transition);
            border-left: 3px solid transparent;
        }

        .nav-item:hover, .nav-item.active {
            background: rgba(255, 255, 255, 0.05);
            color: white;
            border-left-color: var(--primary);
        }

        .nav-item i {
            width: 20px;
            text-align: center;
        }

        .sidebar-footer {
            padding: 1.25rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .user-info {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 1rem;
        }

        .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: var(--primary);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }

        .logout-btn {
            width: 100%;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border: none;
            padding: 0.6rem;
            border-radius: var(--radius);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }

        /* Main Content */
        .main-content {
            flex: 1;
            margin-left: var(--sidebar-width);
            padding: 1.5rem;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            background: white;
            padding: 1.25rem 1.5rem;
            border-radius: var(--radius);
            box-shadow: var(--shadow);
        }

        .page-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--dark);
        }

        .header-actions {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .search-box {
            position: relative;
        }

        .search-input {
            padding: 0.75rem 1rem 0.75rem 2.5rem;
            border: 1px solid #e2e8f0;
            border-radius: var(--radius);
            width: 300px;
        }

        .search-icon {
            position: absolute;
            left: 1rem;
            top: 50%;
            transform: translateY(-50%);
            color: var(--gray);
        }

        /* Stats Grid */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1.5rem;
            margin-bottom: 2rem;
        }

        .stat-card {
            background: white;
            border-radius: var(--radius);
            padding: 1.5rem;
            box-shadow: var(--shadow);
            display: flex;
            align-items: center;
            gap: 1rem;
            border-left: 4px solid var(--primary);
        }

        .stat-icon {
            width: 50px;
            height: 50px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.25rem;
            color: white;
        }

        .stat-icon.users { background: #667eea; }
        .stat-icon.revenue { background: #f093fb; }
        .stat-icon.listings { background: #4facfe; }
        .stat-icon.issues { background: #43e97b; }

        .stat-value {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--dark);
        }

        .stat-label {
            color: var(--gray);
            font-size: 0.9rem;
        }

        /* Content Area */
        .content-area {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 1.5rem;
            margin-bottom: 2rem;
        }

        .chart-container {
            background: white;
            border-radius: var(--radius);
            padding: 1.5rem;
            box-shadow: var(--shadow);
        }

        .chart-wrapper {
            height: 250px;
        }

        /* Tables */
        .users-section {
            background: white;
            border-radius: var(--radius);
            padding: 1.5rem;
            box-shadow: var(--shadow);
        }

        .table-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
        }

        .filters {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
        }

        .filter-btn {
            padding: 0.5rem 1rem;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: var(--radius);
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            text-decoration: none;
            color: #333;
            font-size: 0.9rem;
        }

        .filter-btn.active {
            background: var(--primary);
            color: white;
            border-color: var(--primary);
        }

        .filter-select {
            padding: 0.5rem 1rem;
            border: 1px solid #e2e8f0;
            border-radius: var(--radius);
            background: white;
            font-size: 0.9rem;
        }

        .search-form {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 1rem;
        }

        .table-container {
            overflow-x: auto;
        }

        .data-table {
            width: 100%;
            border-collapse: collapse;
        }

        .data-table th {
            background: #f8fafc;
            padding: 1rem;
            text-align: left;
            font-weight: 600;
            color: var(--dark);
            border-bottom: 1px solid #e2e8f0;
        }

        .data-table td {
            padding: 1rem;
            border-bottom: 1px solid #e2e8f0;
        }

        .data-table tr:hover {
            background: #f8fafc;
        }

        .status-badge {
            padding: 0.35rem 0.75rem;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 600;
            display: inline-block;
        }

        .status-active { background: #d1fae5; color: #065f46; }
        .status-pending { background: #fef3c7; color: #92400e; }
        .status-banned { background: #fee2e2; color: #991b1b; }
        .status-approved { background: #d1fae5; color: #065f46; }
        .status-blocked { background: #fee2e2; color: #991b1b; }

        .action-buttons {
            display: flex;
            gap: 0.5rem;
        }

        .btn {
            padding: 0.5rem 0.75rem;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.4rem;
            font-size: 0.8rem;
            font-weight: 600;
        }

        .btn-sm {
            padding: 0.4rem 0.6rem;
            font-size: 0.75rem;
        }

        .btn-primary { background: var(--primary); color: white; }
        .btn-success { background: var(--success); color: white; }
        .btn-warning { background: var(--warning); color: white; }
        .btn-danger { background: var(--danger); color: white; }
        .btn-info { background: #17a2b8; color: white; }

        .promo-code {
            font-family: 'Courier New', monospace;
            background: #f8f9fa;
            padding: 4px 8px;
            border-radius: 4px;
            border: 1px solid #e9ecef;
        }

        /* Modal */
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 2000;
            justify-content: center;
            align-items: center;
        }

        .modal-content {
            background: white;
            border-radius: var(--radius);
            width: 90%;
            max-width: 600px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            max-height: 90vh;
            overflow-y: auto;
        }

        .modal-header {
            padding: 1.5rem;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            background: white;
            z-index: 1;
        }

        .modal-title {
            font-size: 1.25rem;
            font-weight: 600;
        }

        .close-modal {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--gray);
        }

        .modal-body {
            padding: 1.5rem;
        }

        .detail-row {
            display: flex;
            margin-bottom: 1rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid #e2e8f0;
        }

        .detail-label {
            font-weight: 600;
            width: 200px;
            color: var(--dark);
        }

        .detail-value {
            flex: 1;
            color: var(--gray);
        }

        .detail-value.promo-code {
            font-family: 'Courier New', monospace;
            background: #f8f9fa;
            padding: 8px 12px;
            border-radius: 4px;
            border: 1px solid #e9ecef;
        }

        /* Responsive */
        @media (max-width: 1200px) {
            .stats-grid {
                grid-template-columns: repeat(2, 1fr);
            }
            .content-area {
                grid-template-columns: 1fr;
            }
        }

        @media (max-width: 768px) {
            .sidebar {
                width: 70px;
            }
            .main-content {
                margin-left: 70px;
            }
            .nav-text, .user-details, .logo {
                display: none;
            }
            .search-input {
                width: 200px;
            }
            .filters {
                flex-direction: column;
            }
            .detail-row {
                flex-direction: column;
            }
            .detail-label {
                width: 100%;
                margin-bottom: 0.5rem;
            }
        }
    </style>
</head>
<body>
    <!-- Sidebar -->
    <div class="sidebar">
        <div class="logo-container">
            <div class="logo">🏷️ PM</div>
        </div>
        
        <div class="nav-menu">
            <a href="?page=dashboard" class="nav-item <?php echo $current_page === 'dashboard' ? 'active' : ''; ?>">
                <i class="fas fa-chart-line"></i>
                <span class="nav-text"><?php echo $t['dashboard']; ?></span>
            </a>
            <a href="?page=users" class="nav-item <?php echo $current_page === 'users' ? 'active' : ''; ?>">
                <i class="fas fa-users"></i>
                <span class="nav-text"><?php echo $t['users']; ?></span>
            </a>
            <a href="?page=listings" class="nav-item <?php echo $current_page === 'listings' ? 'active' : ''; ?>">
                <i class="fas fa-tags"></i>
                <span class="nav-text"><?php echo $t['listings']; ?></span>
            </a>
            <a href="?page=complaints" class="nav-item">
                <i class="fas fa-exclamation-circle"></i>
                <span class="nav-text"><?php echo $t['complaints']; ?></span>
            </a>
            <a href="?page=moderators" class="nav-item">
                <i class="fas fa-user-shield"></i>
                <span class="nav-text"><?php echo $t['moderators']; ?></span>
            </a>
        </div>
        
        <div class="sidebar-footer">
            <div class="user-info">
                <div class="user-avatar">A</div>
                <div class="user-details">
                    <div style="font-weight: 600;"><?php echo $t['admin']; ?></div>
                    <div style="font-size: 0.8rem; opacity: 0.7;"><?php echo $t['administrator']; ?></div>
                </div>
            </div>
            <a href="?logout=1" class="logout-btn">
                <i class="fas fa-sign-out-alt"></i>
                <span><?php echo $t['logout']; ?></span>
            </a>
        </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
        <!-- Header -->
        <div class="header">
            <h1 class="page-title">
                <?php 
                $page_titles = [
                    'dashboard' => $t['dashboard'],
                    'users' => $t['user_management'],
                    'listings' => $t['promo_management']
                ];
                echo $page_titles[$current_page] ?? $t['dashboard'];
                ?>
            </h1>
            <div class="header-actions">
                <div class="search-box">
                    <i class="fas fa-search search-icon"></i>
                    <input type="text" class="search-input" placeholder="Axtarış...">
                </div>
            </div>
        </div>

        <!-- Dashboard Page -->
        <?php if ($current_page === 'dashboard'): ?>
            <div>
                <!-- Statistics -->
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon users">
                            <i class="fas fa-users"></i>
                        </div>
                        <div>
                            <div class="stat-value"><?php echo $stats['total_users'] ?? 0; ?></div>
                            <div class="stat-label"><?php echo $t['total_users']; ?></div>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon revenue">
                            <i class="fas fa-dollar-sign"></i>
                        </div>
                        <div>
                            <div class="stat-value"><?php echo number_format($stats['total_revenue'] ?? 0, 0); ?> AZN</div>
                            <div class="stat-label"><?php echo $t['revenue']; ?></div>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon listings">
                            <i class="fas fa-tags"></i>
                        </div>
                        <div>
                            <div class="stat-value"><?php echo $stats['approved_listings'] ?? 0; ?></div>
                            <div class="stat-label"><?php echo $t['active_listings']; ?></div>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon issues">
                            <i class="fas fa-exclamation-circle"></i>
                        </div>
                        <div>
                            <div class="stat-value"><?php echo $stats['pending_complaints'] ?? 0; ?></div>
                            <div class="stat-label"><?php echo $t['pending_issues']; ?></div>
                        </div>
                    </div>
                </div>

                <!-- Charts -->
                <div class="content-area">
                    <div class="chart-container">
                        <h3 style="margin-bottom: 1rem;">Gəlir Analitikası</h3>
                        <div class="chart-wrapper">
                            <canvas id="revenueChart"></canvas>
                        </div>
                    </div>
                    
                    <div class="chart-container">
                        <h3 style="margin-bottom: 1rem;">İstifadəçi Artımı</h3>
                        <div class="chart-wrapper">
                            <canvas id="usersChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        <?php endif; ?>

        <!-- Users Page -->
        <?php if ($current_page === 'users'): ?>
            <div class="users-section">
                <div class="table-header">
                    <h2><?php echo $t['user_management']; ?></h2>
                    <div class="filters">
                        <a href="?page=users&filter=all" class="filter-btn <?php echo $filter === 'all' ? 'active' : ''; ?>">
                            <?php echo $t['all']; ?>
                        </a>
                        <a href="?page=users&filter=active" class="filter-btn <?php echo $filter === 'active' ? 'active' : ''; ?>">
                            <?php echo $t['active']; ?>
                        </a>
                        <a href="?page=users&filter=banned" class="filter-btn <?php echo $filter === 'banned' ? 'active' : ''; ?>">
                            <?php echo $t['banned']; ?>
                        </a>
                    </div>
                </div>

                <div style="margin-bottom: 1.5rem;">
                    <form method="GET" style="display: flex; gap: 0.8rem;">
                        <input type="hidden" name="page" value="users">
                        <input type="hidden" name="filter" value="<?php echo $filter; ?>">
                        <input type="text" name="search" class="search-input" placeholder="<?php echo $t['search_users']; ?>" value="<?php echo htmlspecialchars($search); ?>">
                        <button type="submit" class="btn btn-primary"><?php echo $t['search']; ?></button>
                        <?php if ($search): ?>
                            <a href="?page=users" class="btn" style="background: #6c757d; color: white;"><?php echo $t['clear']; ?></a>
                        <?php endif; ?>
                    </form>
                </div>
                
                <div class="table-container">
                    <?php if (count($users) > 0): ?>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th><?php echo $t['id']; ?></th>
                                <th><?php echo $t['username']; ?></th>
                                <th><?php echo $t['email']; ?></th>
                                <th><?php echo $t['status']; ?></th>
                                <th><?php echo $t['registration_date']; ?></th>
                                <th><?php echo $t['actions']; ?></th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($users as $user): ?>
                            <tr>
                                <td>#<?php echo $user['id']; ?></td>
                                <td><?php echo htmlspecialchars($user['username']); ?></td>
                                <td><?php echo htmlspecialchars($user['email']); ?></td>
                                <td>
                                    <span class="status-badge <?php echo $user['status'] === 'active' ? 'status-active' : 'status-banned'; ?>">
                                        <?php echo $user['status'] === 'active' ? $t['active'] : $t['banned']; ?>
                                    </span>
                                </td>
                                <td><?php echo date('d.m.Y', strtotime($user['created_at'])); ?></td>
                                <td>
                                    <div class="action-buttons">
                                        <button class="btn btn-primary btn-sm" onclick="viewUserDetails(<?php echo $user['id']; ?>)">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <?php if ($user['status'] === 'active'): ?>
                                            <form method="POST" style="display: inline;">
                                                <input type="hidden" name="user_id" value="<?php echo $user['id']; ?>">
                                                <input type="hidden" name="action" value="ban">
                                                <button type="submit" class="btn btn-warning btn-sm">
                                                    <i class="fas fa-ban"></i>
                                                </button>
                                            </form>
                                        <?php else: ?>
                                            <form method="POST" style="display: inline;">
                                                <input type="hidden" name="user_id" value="<?php echo $user['id']; ?>">
                                                <input type="hidden" name="action" value="approve">
                                                <button type="submit" class="btn btn-success btn-sm">
                                                    <i class="fas fa-check"></i>
                                                </button>
                                            </form>
                                        <?php endif; ?>
                                        <form method="POST" style="display: inline;" onsubmit="return confirm('Silmək istədiyinizə əminsiniz?');">
                                            <input type="hidden" name="user_id" value="<?php echo $user['id']; ?>">
                                            <input type="hidden" name="action" value="delete">
                                            <button type="submit" class="btn btn-danger btn-sm">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                    <?php else: ?>
                    <div style="text-align: center; padding: 2rem; color: #6c757d;">
                        <h3><?php echo $t['no_users']; ?></h3>
                    </div>
                    <?php endif; ?>
                </div>
            </div>
        <?php endif; ?>

        <!-- Promokodlar Page -->
        <?php if ($current_page === 'listings'): ?>
            <div class="users-section">
                <div class="table-header">
                    <h2><?php echo $t['promo_management']; ?></h2>
                    <div class="filters">
                        <a href="?page=listings&status=all&category=<?php echo urlencode($category_filter); ?>&search_query=<?php echo urlencode($search_query); ?>" class="filter-btn <?php echo $status_filter === 'all' ? 'active' : ''; ?>">
                            <?php echo $t['all']; ?>
                        </a>
                        <a href="?page=listings&status=pending&category=<?php echo urlencode($category_filter); ?>&search_query=<?php echo urlencode($search_query); ?>" class="filter-btn <?php echo $status_filter === 'pending' ? 'active' : ''; ?>">
                            <?php echo $t['pending']; ?>
                        </a>
                        <a href="?page=listings&status=approved&category=<?php echo urlencode($category_filter); ?>&search_query=<?php echo urlencode($search_query); ?>" class="filter-btn <?php echo $status_filter === 'approved' ? 'active' : ''; ?>">
                            <?php echo $t['approved']; ?>
                        </a>
                        <a href="?page=listings&status=blocked&category=<?php echo urlencode($category_filter); ?>&search_query=<?php echo urlencode($search_query); ?>" class="filter-btn <?php echo $status_filter === 'blocked' ? 'active' : ''; ?>">
                            <?php echo $t['blocked']; ?>
                        </a>
                        
                        <!-- Kateqoriya filteri -->
                        <select class="filter-select" onchange="updateCategoryFilter(this.value)">
                            <option value="all"><?php echo $t['all_categories']; ?></option>
                            <?php foreach ($categories as $category): ?>
                                <option value="<?php echo urlencode($category['name']); ?>" 
                                    <?php echo $category_filter === $category['name'] ? 'selected' : ''; ?>>
                                    <?php echo htmlspecialchars($category['name']); ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                </div>

                <!-- Axtarış formu -->
                <div class="search-form">
                    <form method="GET" style="display: flex; gap: 0.8rem; width: 100%;">
                        <input type="hidden" name="page" value="listings">
                        <input type="hidden" name="status" value="<?php echo $status_filter; ?>">
                        <input type="hidden" name="category" value="<?php echo $category_filter; ?>">
                        <input type="text" name="search_query" class="search-input" placeholder="Mağaza, promokod və ya kateqoriya axtar..." value="<?php echo htmlspecialchars($search_query); ?>" style="flex: 1;">
                        <button type="submit" class="btn btn-primary"><?php echo $t['search']; ?></button>
                        <?php if ($search_query): ?>
                            <a href="?page=listings&status=<?php echo $status_filter; ?>&category=<?php echo urlencode($category_filter); ?>" class="btn" style="background: #6c757d; color: white;"><?php echo $t['clear']; ?></a>
                        <?php endif; ?>
                    </form>
                </div>
                
                <div class="table-container">
                    <?php if (count($listings) > 0): ?>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th><?php echo $t['promo_code']; ?></th>
                                <th><?php echo $t['store_name']; ?></th>
                                <th><?php echo $t['discount']; ?></th>
                                <th><?php echo $t['price']; ?></th>
                                <th><?php echo $t['category']; ?></th>
                                <th><?php echo $t['status']; ?></th>
                                <th><?php echo $t['seller']; ?></th>
                                <th><?php echo $t['actions']; ?></th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($listings as $listing): ?>
                            <tr>
                                <td><span class="promo-code"><?php echo htmlspecialchars($listing['promo_code']); ?></span></td>
                                <td><?php echo htmlspecialchars($listing['store_name']); ?></td>
                                <td><?php echo htmlspecialchars($listing['discount']); ?></td>
                                <td><?php echo $listing['price']; ?> AZN</td>
                                <td><?php echo htmlspecialchars($listing['category']); ?></td>
                                <td>
                                    <?php if ($listing['source'] === 'approved'): ?>
                                        <span class="status-badge status-approved"><?php echo $t['approved']; ?></span>
                                    <?php elseif ($listing['source'] === 'blocked'): ?>
                                        <span class="status-badge status-blocked"><?php echo $t['blocked']; ?></span>
                                    <?php else: ?>
                                        <span class="status-badge status-pending"><?php echo $t['pending']; ?></span>
                                    <?php endif; ?>
                                </td>
                                <td><?php echo htmlspecialchars($listing['username']); ?></td>
                                <td>
                                    <div class="action-buttons">
                                        <!-- Bax düyməsi -->
                                        <button class="btn btn-info btn-sm" onclick="viewPromoDetails(<?php echo $listing['id']; ?>, '<?php echo $listing['source']; ?>')" title="<?php echo $t['view_details']; ?>">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        
                                        <?php if ($listing['source'] === 'pending'): ?>
                                            <form method="POST" style="display: inline;">
                                                <input type="hidden" name="ad_id" value="<?php echo $listing['id']; ?>">
                                                <input type="hidden" name="source" value="pending">
                                                <button type="submit" name="approve_ad" class="btn btn-success btn-sm" title="<?php echo $t['approve']; ?>">
                                                    <i class="fas fa-check"></i>
                                                </button>
                                            </form>
                                            <form method="POST" style="display: inline;">
                                                <input type="hidden" name="ad_id" value="<?php echo $listing['id']; ?>">
                                                <input type="hidden" name="source" value="pending">
                                                <button type="submit" name="block_ad" class="btn btn-warning btn-sm" title="<?php echo $t['ban']; ?>">
                                                    <i class="fas fa-ban"></i>
                                                </button>
                                            </form>
                                        <?php elseif ($listing['source'] === 'approved'): ?>
                                            <form method="POST" style="display: inline;">
                                                <input type="hidden" name="ad_id" value="<?php echo $listing['id']; ?>">
                                                <input type="hidden" name="source" value="approved">
                                                <button type="submit" name="block_ad" class="btn btn-warning btn-sm" title="<?php echo $t['ban']; ?>">
                                                    <i class="fas fa-ban"></i>
                                                </button>
                                            </form>
                                        <?php else: ?>
                                            <form method="POST" style="display: inline;">
                                                <input type="hidden" name="ad_id" value="<?php echo $listing['id']; ?>">
                                                <input type="hidden" name="source" value="blocked">
                                                <button type="submit" name="approve_ad" class="btn btn-success btn-sm" title="<?php echo $t['approve']; ?>">
                                                    <i class="fas fa-check"></i>
                                                </button>
                                            </form>
                                        <?php endif; ?>
                                        <form method="POST" style="display: inline;" onsubmit="return confirm('Silmək istədiyinizə əminsiniz?');">
                                            <input type="hidden" name="ad_id" value="<?php echo $listing['id']; ?>">
                                            <input type="hidden" name="source" value="<?php echo $listing['source']; ?>">
                                            <button type="submit" name="delete_ad" class="btn btn-danger btn-sm" title="<?php echo $t['delete']; ?>">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                    <?php else: ?>
                    <div style="text-align: center; padding: 2rem; color: #6c757d;">
                        <h3>Promokod tapılmadı</h3>
                    </div>
                    <?php endif; ?>
                </div>
            </div>
        <?php endif; ?>
    </div>

    <!-- Promokod Detalları Modal -->
    <div class="modal" id="promoModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title"><?php echo $t['promo_details']; ?></h3>
                <button class="close-modal" onclick="closePromoModal()">&times;</button>
            </div>
            <div class="modal-body" id="promoModalBody">
                <!-- Məlumatlar burada doldurulacaq -->
            </div>
        </div>
    </div>

    <script>
        // Chart.js
        document.addEventListener('DOMContentLoaded', function() {
            // Revenue Chart
            const revenueCtx = document.getElementById('revenueChart');
            if (revenueCtx) {
                new Chart(revenueCtx, {
                    type: 'line',
                    data: {
                        labels: ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'İyn'],
                        datasets: [{
                            label: 'Gəlir',
                            data: [12000, 19000, 15000, 22000, 18000, 25000],
                            borderColor: '#4361ee',
                            backgroundColor: 'rgba(67, 97, 238, 0.1)',
                            borderWidth: 2,
                            fill: true
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false
                    }
                });
            }
            
            // Users Chart
            const usersCtx = document.getElementById('usersChart');
            if (usersCtx) {
                new Chart(usersCtx, {
                    type: 'bar',
                    data: {
                        labels: ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'İyn'],
                        datasets: [{
                            label: 'İstifadəçilər',
                            data: [450, 600, 550, 750, 650, 900],
                            backgroundColor: '#4cc9f0'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false
                    }
                });
            }
        });

        // User details function
        function viewUserDetails(userId) {
            alert('İstifadəçi ID: ' + userId + '\nBu hissə inkişaf etdirilir...');
        }

        // Kateqoriya filterini yenilə
        function updateCategoryFilter(category) {
            const url = new URL(window.location.href);
            url.searchParams.set('category', category);
            window.location.href = url.toString();
        }

        // Promokod detallarını göstər
        async function viewPromoDetails(adId, source) {
            try {
                const response = await fetch(`?api=get_promo_details&ad_id=${adId}&source=${source}`);
                const data = await response.json();
                
                if (data.error) {
                    alert('Xəta: ' + data.error);
                    return;
                }

                // Modalı doldur
                const modalBody = document.getElementById('promoModalBody');
                modalBody.innerHTML = `
                    <div class="detail-row">
                        <div class="detail-label"><?php echo $t['promo_code']; ?>:</div>
                        <div class="detail-value promo-code">${data.promo_code || '-'}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label"><?php echo $t['store_name']; ?>:</div>
                        <div class="detail-value">${data.store_name || '-'}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label"><?php echo $t['store_url']; ?>:</div>
                        <div class="detail-value">${data.store_url ? `<a href="${data.store_url}" target="_blank">${data.store_url}</a>` : '-'}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label"><?php echo $t['discount']; ?>:</div>
                        <div class="detail-value">${data.discount || '-'}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label"><?php echo $t['discount_amount']; ?>:</div>
                        <div class="detail-value">${data.discount_amount ? data.discount_amount + ' AZN' : '-'}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label"><?php echo $t['price']; ?>:</div>
                        <div class="detail-value">${data.price ? data.price + ' AZN' : '-'}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label"><?php echo $t['category']; ?>:</div>
                        <div class="detail-value">${data.category || '-'}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label"><?php echo $t['validity_date']; ?>:</div>
                        <div class="detail-value">${data.validity_date || '-'}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label"><?php echo $t['description']; ?>:</div>
                        <div class="detail-value">${data.description || '-'}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label"><?php echo $t['created_at']; ?>:</div>
                        <div class="detail-value">${data.created_at || '-'}</div>
                    </div>
                `;

                // Modalı göstər
                document.getElementById('promoModal').style.display = 'flex';
            } catch (error) {
                console.error('Xəta:', error);
                alert('Məlumatlar gətirilərkən xəta baş verdi.');
            }
        }

        // Modalı bağla
        function closePromoModal() {
            document.getElementById('promoModal').style.display = 'none';
        }

        // Modal xaricində kliklənəndə bağlansın
        document.getElementById('promoModal').addEventListener('click', function(e) {
            if (e.target === this) {
                closePromoModal();
            }
        });
    </script>
</body>
</html>