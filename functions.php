<?php
// functions.php
include 'config.php';

function generateVerificationToken() {
    return bin2hex(random_bytes(32));
}

function cleanInput($data) {
    return htmlspecialchars(stripslashes(trim($data)));
}

function isEmailExists($email) {
    global $conn;
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    return $stmt->get_result()->num_rows > 0;
}

function isUsernameExists($username) {
    global $conn;
    $stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    return $stmt->get_result()->num_rows > 0;
}

function savePendingRegistration($email, $username, $password, $phone, $token) {
    global $conn;
    
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    $expires_at = date('Y-m-d H:i:s', strtotime('+1 hour'));
    
    $stmt = $conn->prepare("INSERT INTO pending_registrations (email, username, password, phone, token, expires_at) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssss", $email, $username, $hashed_password, $phone, $token, $expires_at);
    
    return $stmt->execute();
}

function getPendingRegistration($token) {
    global $conn;
    
    $stmt = $conn->prepare("SELECT * FROM pending_registrations WHERE token = ? AND expires_at > NOW()");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $result = $stmt->get_result();
    
    return $result->fetch_assoc();
}

function completeRegistration($pending_data) {
    global $conn;
    
    $stmt = $conn->prepare("INSERT INTO users (username, email, password, phone) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $pending_data['username'], $pending_data['email'], $pending_data['password'], $pending_data['phone']);
    
    if ($stmt->execute()) {
        // Təmizlə pending registration
        $delete_stmt = $conn->prepare("DELETE FROM pending_registrations WHERE token = ?");
        $delete_stmt->bind_param("s", $pending_data['token']);
        $delete_stmt->execute();
        
        return true;
    }
    return false;
}

function verifyUserCredentials($email, $password) {
    global $conn;
    
    $stmt = $conn->prepare("SELECT id, username, password, status FROM users WHERE email = ? AND status = 'active'");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($user = $result->fetch_assoc()) {
        if (password_verify($password, $user['password'])) {
            return $user;
        }
    }
    return false;
}
?>