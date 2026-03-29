<?php
require_once 'db.php';
session_start();

// Admin yoxlaması (sadə versiya)
if (!isset($_SESSION['is_admin']) || !$_SESSION['is_admin']) {
    die('Admin deyilsiniz!');
}

if ($_POST['action'] === 'approve') {
    $ad_id = $_POST['ad_id'];
    
    // pending_ads-dən məlumatı al
    $stmt = $pdo->prepare("SELECT * FROM pending_ads WHERE id = ?");
    $stmt->execute([$ad_id]);
    $pending_ad = $stmt->fetch();
    
    if ($pending_ad) {
        // approved_ads-ə köçür
        $insert_stmt = $pdo->prepare("
            INSERT INTO approved_ads 
            (user_id, store_name, store_url, promo_code, discount, discount_amount, price, category, validity_date, description) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $insert_stmt->execute([
            $pending_ad['user_id'], $pending_ad['store_name'], $pending_ad['store_url'],
            $pending_ad['promo_code'], $pending_ad['discount'], $pending_ad['discount_amount'],
            $pending_ad['price'], $pending_ad['category'], $pending_ad['validity_date'],
            $pending_ad['description']
        ]);
        
        // pending_ads-dən sil
        $delete_stmt = $pdo->prepare("DELETE FROM pending_ads WHERE id = ?");
        $delete_stmt->execute([$ad_id]);
        
        echo json_encode(['success' => true]);
    }
}
?>