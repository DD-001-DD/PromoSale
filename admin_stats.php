<?php
require_once 'db.php';
header('Content-Type: application/json');

try {
    $pending_count = $pdo->query("SELECT COUNT(*) FROM pending_ads")->fetchColumn();
    $approved_count = $pdo->query("SELECT COUNT(*) FROM approved_ads")->fetchColumn();
    $users_count = $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
    
    echo json_encode([
        'pending_ads' => $pending_count,
        'approved_ads' => $approved_count, 
        'total_users' => $users_count
    ]);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>