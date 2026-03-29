<?php
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // TEST ÜÇÜN: user_id = 1 yaz
    $user_id = 1;
    $store_name = $_POST['store_name'];
    $store_url = $_POST['store_url'];
    $promo_code = $_POST['promo_code'];
    $discount = $_POST['discount'];
    $discount_amount = $_POST['discount_amount'] ?? '';
    $price = $_POST['price'];
    $category = $_POST['category'];
    $validity_date = $_POST['validity_date'];
    $description = $_POST['description'] ?? '';
    
    try {
        $stmt = $pdo->prepare("
            INSERT INTO pending_ads 
            (user_id, store_name, store_url, promo_code, discount, discount_amount, price, category, validity_date, description) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([
            $user_id, $store_name, $store_url, $promo_code, $discount, 
            $discount_amount, $price, $category, $validity_date, $description
        ]);
        
        echo json_encode(['success' => true, 'message' => 'Kod göndərildi! Admin təsdiqindən sonra aktiv olacaq.']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Xəta: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Səhv sorğu metodu!']);
}
?>