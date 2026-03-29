<?php
require_once 'db.php';
header('Content-Type: application/json');

try {
    // Əvvəlcə cədvəldə nə qədər kod var yoxla
    $count_stmt = $pdo->prepare("SELECT COUNT(*) as total FROM approved_ads WHERE status = 'active'");
    $count_stmt->execute();
    $count = $count_stmt->fetch(PDO::FETCH_ASSOC);
    
    error_log("📊 approved_ads-də ümumi kod sayı: " . $count['total']);
    
    // Kodları götür
    $stmt = $pdo->prepare("SELECT * FROM approved_ads WHERE status = 'active' ORDER BY created_at DESC");
    $stmt->execute();
    $ads = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    error_log("📋 Götürülən kod sayı: " . count($ads));
    
    // Əgər boşdursa, nümunə məlumat qaytar
    if (empty($ads)) {
        error_log("ℹ️ approved_ads boşdur, nümunə məlumat qaytarılır");
        $ads = [
            [
                'id' => 999,
                'store_name' => 'TEST - approved_ads BOŞDUR',
                'category' => 'test',
                'promo_code' => 'TEST123',
                'discount' => '10',
                'price' => '1.00',
                'validity_date' => '2024-12-31',
                'description' => 'Bu test məlumatıdır - approved_ads cədvəli boşdur!',
                'status' => 'active'
            ]
        ];
    }
    
    echo json_encode($ads);
    
} catch (PDOException $e) {
    error_log("❌ Database error: " . $e->getMessage());
    echo json_encode(['error' => $e->getMessage()]);
}
?>