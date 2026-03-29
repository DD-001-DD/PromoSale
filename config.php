<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "promoono";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// SMTP Config - GMAIL
$smtp_host = 'smtp.gmail.com';
$smtp_port = 587;
$smtp_username = 'promoonosite@gmail.com';
$smtp_password = 'your_app_password'; // Gmail App Password bura
?>