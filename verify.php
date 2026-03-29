<?php
session_start();
require_once 'db.php';

if (isset($_GET['token'])) {
    $token = $_GET['token'];
    
    try {
        // Tokeni yoxla
        $stmt = $pdo->prepare("
            SELECT * FROM pending_registrations 
            WHERE token = ? AND expires_at > NOW()
        ");
        $stmt->execute([$token]);
        $pending_user = $stmt->fetch();
        
        if ($pending_user) {
            // İstifadəçini əsas cədvələ köçür
            $insert_stmt = $pdo->prepare("
                INSERT INTO users (username, email, password, phone) 
                VALUES (?, ?, ?, ?)
            ");
            $insert_stmt->execute([
                $pending_user['username'],
                $pending_user['email'],
                $pending_user['password'],
                $pending_user['phone']
            ]);
            
            // Müvəqqəti qeydiyyatdan sil
            $delete_stmt = $pdo->prepare("DELETE FROM pending_registrations WHERE id = ?");
            $delete_stmt->execute([$pending_user['id']]);
            
            $_SESSION['success_message'] = "✅ Hesabınız uğurla təsdiqləndi! İndi daxil ola bilərsiniz.";
            header("Location: login.php");
            exit();
        } else {
            $error = "❌ Təsdiq linki etibarsız və ya müddəti bitib.";
        }
    } catch (PDOException $e) {
        $error = "Xəta baş verdi: " . $e->getMessage();
    }
} else {
    $error = "Təsdiq linki tapılmadı.";
}
?>

<!DOCTYPE html>
<html lang="az">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Təsdiqi - PromoMarket</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 500px;
            width: 100%;
        }
        .success { color: #28a745; font-size: 48px; margin-bottom: 20px; }
        .error { color: #dc3545; font-size: 48px; margin-bottom: 20px; }
        .message { font-size: 18px; margin-bottom: 30px; color: #333; }
        .btn {
            background: #007bff;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 8px;
            display: inline-block;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <?php if (isset($error)): ?>
            <div class="error">❌</div>
            <div class="message"><?= htmlspecialchars($error) ?></div>
            <a href="register.php" class="btn">Yenidən Qeydiyyat</a>
        <?php else: ?>
            <div class="success">✅</div>
            <div class="message">Hesabınız uğurla təsdiqləndi!</div>
            <a href="login.php" class="btn">Daxil Ol</a>
        <?php endif; ?>
    </div>
</body>
</html>