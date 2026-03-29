<?php
// db.php
$host = 'localhost';
$dbname = 'promoono';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Debug üçün
    error_log("✅ Database connected successfully to: $dbname");
    
} catch (PDOException $e) {
    error_log("❌ Database connection failed: " . $e->getMessage());
    die("Database connection failed: " . $e->getMessage());
}

// Qlobal olaraq əlçatan etmək üçün
global $pdo;
?>