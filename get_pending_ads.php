<?php
require_once 'db.php';
header('Content-Type: application/json');

try {
    $stmt = $pdo->query("SELECT * FROM pending_ads ORDER BY created_at DESC");
    $ads = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($ads);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>