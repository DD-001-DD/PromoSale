<?php
session_start();
require_once 'db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username']);
    $email = trim($_POST['email']);
    $phone = trim($_POST['phone']);
    $password = trim($_POST['password']);
    $confirm_password = trim($_POST['confirm_password']);
    
    try {
        // Validation
        if (empty($username) || empty($email) || empty($phone) || empty($password)) {
            echo json_encode([
                'success' => false,
                'message' => 'Bütün sahələri doldurun!'
            ]);
            exit;
        }
        
        if ($password !== $confirm_password) {
            echo json_encode([
                'success' => false,
                'message' => 'Şifrələr uyğun gəlmir!'
            ]);
            exit;
        }
        
        if (strlen($password) < 8) {
            echo json_encode([
                'success' => false,
                'message' => 'Şifrə ən azı 8 simvol olmalıdır!'
            ]);
            exit;
        }
        
        // Email-in unikallığını yoxla
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        
        if ($stmt->fetch()) {
            echo json_encode([
                'success' => false,
                'message' => 'Bu email artıq istifadə olunur!'
            ]);
            exit;
        }
        
        // İstifadəçi adının unikallığını yoxla
        $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ?");
        $stmt->execute([$username]);
        
        if ($stmt->fetch()) {
            echo json_encode([
                'success' => false,
                'message' => 'Bu istifadəçi adı artıq istifadə olunur!'
            ]);
            exit;
        }
        
        // Yeni istifadəçi yarat
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        $balance = 0.00;
        $status = 'active';
        $created_at = date('Y-m-d H:i:s');
        
        $stmt = $pdo->prepare("INSERT INTO users (username, email, phone, password, balance, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$username, $email, $phone, $hashed_password, $balance, $status, $created_at]);
        
        $user_id = $pdo->lastInsertId();
        
        // Yeni istifadəçi məlumatlarını qaytar
        $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$user_id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_email'] = $user['email'];
        $_SESSION['user_name'] = $user['username'];
        
        echo json_encode([
            'success' => true,
            'message' => 'Qeydiyyat uğurlu!',
            'user' => [
                'id' => $user['id'],
                'username' => $user['username'],
                'email' => $user['email'],
                'balance' => $user['balance'],
                'phone' => $user['phone'],
                'created_at' => $user['created_at']
            ]
        ]);
        
    } catch (PDOException $e) {
        error_log("Registration error: " . $e->getMessage());
        echo json_encode([
            'success' => false,
            'message' => 'Qeydiyyat zamanı xəta baş verdi: ' . $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Yanlış sorğu metodu!'
    ]);
}
?>