<?php
session_start();
require_once 'db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);
    
    try {
        // İstifadəçini tap
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? AND status = 'active'");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user && password_verify($password, $user['password'])) {
            // Giriş uğurlu
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_email'] = $user['email'];
            $_SESSION['user_name'] = $user['username'];
            
            echo json_encode([
                'success' => true,
                'message' => 'Giriş uğurlu!',
                'user' => [
                    'id' => $user['id'],
                    'username' => $user['username'],
                    'email' => $user['email'],
                    'balance' => $user['balance'],
                    'phone' => $user['phone'],
                    'created_at' => $user['created_at']
                ]
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Email və ya şifrə yanlışdır!'
            ]);
        }
        
    } catch (PDOException $e) {
        error_log("Login error: " . $e->getMessage());
        echo json_encode([
            'success' => false,
            'message' => 'Server xətası. Zəhmət olmasa yenidən cəhd edin.'
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Yanlış sorğu metodu!'
    ]);
}
?>